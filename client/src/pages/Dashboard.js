import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  CalendarDays,
  Settings,
  Users
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState(null);
  const [todayStatus, setTodayStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [error, setError] = useState(null);

  console.log('=== DASHBOARD COMPONENT RENDER ===');
  console.log('Dashboard: Component mounted');
  console.log('Dashboard: user =', user);
  console.log('Dashboard: loading =', loading);

  useEffect(() => {
    console.log('Dashboard: useEffect triggered');
    try {
      fetchDashboardData();
    } catch (err) {
      console.error('Dashboard: Error in useEffect:', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // In development mode, set mock data instead of making API calls
      if (process.env.NODE_ENV === 'development') {
        console.log('Dashboard: Development mode - using mock data');
        setAttendanceData({
          totalDays: 30,
          presentDays: 25,
          absentDays: 3,
          lateDays: 2,
          attendanceRate: 83.3,
          summary: {
            presentDays: 25,
            totalHours: 200
          },
          attendance: [
            { _id: 'att_1', date: new Date().toISOString(), totalHours: 8 },
            { _id: 'att_2', date: new Date(Date.now() - 86400000).toISOString(), totalHours: 7.5 },
            { _id: 'att_3', date: new Date(Date.now() - 172800000).toISOString(), totalHours: 8 }
          ]
        });
        setTodayStatus({
          status: 'checked_in',
          checkInTime: '09:00 AM',
          checkOutTime: null,
          canCheckIn: false,
          canCheckOut: true
        });
        setUpcomingHolidays([
          { _id: 'holiday_1', name: 'Independence Day', date: '2024-08-15', type: 'gazetted' },
          { _id: 'holiday_2', name: 'Raksha Bandhan', date: '2024-08-19', type: 'restricted' }
        ]);
        setLatestNews([
          { _id: 'news_1', title: 'Welcome to the New Attendance Portal!', summary: 'New attendance portal launched with enhanced features', publishedAt: new Date(), priority: 'high' },
          { _id: 'news_2', title: 'Holiday Schedule for Q4 2024', summary: 'Q4 2024 holiday schedule announced', publishedAt: new Date(), priority: 'info' }
        ]);
        setLoading(false);
        return;
      }
      
      // Fetch data in parallel
      const [attendanceData, todayData, holidaysData, newsData] = await Promise.all([
        api.get('/attendance/me').catch(err => ({ data: null, error: err })),
        api.get('/attendance/today').catch(err => ({ data: null, error: err })),
        api.get('/holidays/upcoming').catch(err => ({ data: null, error: err })),
        api.get('/news/latest?limit=3').catch(err => ({ data: null, error: err }))
      ]);
      
      // Handle each result individually
      const [attendanceRes, todayRes, holidaysRes, newsRes] = [attendanceData, todayData, holidaysData, newsData];
      
      if (attendanceRes.error) {
        console.warn('Attendance API failed:', attendanceRes.error.message);
        setAttendanceData({
          totalDays: 0,
          presentDays: 0,
          absentDays: 0,
          lateDays: 0,
          attendanceRate: 0,
          summary: {
            presentDays: 0,
            totalHours: 0
          },
          attendance: []
        });
      } else {
        // Ensure attendance data has proper structure
        const attendanceData = attendanceRes.data;
        if (attendanceData && Array.isArray(attendanceData.attendance)) {
          const processedAttendance = attendanceData.attendance.map((att, index) => ({
            ...att,
            _id: att._id || `att_${index}`
          }));
          setAttendanceData({
            ...attendanceData,
            attendance: processedAttendance
          });
        } else {
          setAttendanceData(attendanceData);
        }
      }
      
      if (todayRes.error) {
        console.warn('Today attendance API failed:', todayRes.error.message);
        setTodayStatus({
          status: 'not_marked',
          checkInTime: null,
          checkOutTime: null,
          canCheckIn: true,
          canCheckOut: false
        });
      } else {
        setTodayStatus(todayRes.data);
      }
      
      if (holidaysRes.error) {
        console.warn('Holidays API failed:', holidaysRes.error.message);
        setUpcomingHolidays([]);
      } else {
        // Ensure holidays data has proper structure with _id
        const holidaysData = holidaysRes.data;
        if (Array.isArray(holidaysData)) {
          const processedHolidays = holidaysData.map((holiday, index) => ({
            ...holiday,
            _id: holiday._id || `holiday_${index}`
          }));
          setUpcomingHolidays(processedHolidays);
        } else {
          setUpcomingHolidays([]);
        }
      }
      
      if (newsRes.error) {
        console.warn('News API failed:', newsRes.error.message);
        setLatestNews([]);
      } else {
        // Ensure news data has proper structure with _id and publishedAt
        const newsData = newsRes.data || newsRes;
        if (Array.isArray(newsData)) {
          const processedNews = newsData.map((news, index) => ({
            ...news,
            _id: news._id || `news_${index}`,
            publishedAt: news.publishedAt || new Date(),
            priority: news.priority || 'info'
          }));
          setLatestNews(processedNews);
        } else {
          setLatestNews([]);
        }
      }
      
    } catch (error) {
      console.error('Error in dashboard data fetch:', error);
      // Set fallback data to prevent complete failure
      setAttendanceData({
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        lateDays: 0,
        attendanceRate: 0,
        summary: {
          presentDays: 0,
          totalHours: 0
        },
        attendance: []
      });
      setTodayStatus({
        status: 'not_marked',
        checkInTime: null,
        checkOutTime: null,
        canCheckIn: true,
        canCheckOut: false
      });
      setUpcomingHolidays([]);
      setLatestNews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceAction = async (type) => {
    try {
      await api.post('/attendance/mark', { type });
      toast.success(`${type === 'check-in' ? 'Checked in' : 'Checked out'} successfully!`);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to mark attendance';
      toast.error(message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'text-success-600 bg-success-100';
      case 'absent': return 'text-danger-600 bg-danger-100';
      case 'late': return 'text-warning-600 bg-warning-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-5 w-5" />;
      case 'absent': return <XCircle className="h-5 w-5" />;
      case 'late': return <AlertCircle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-2">⚠️ Error Loading Dashboard</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button 
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchDashboardData();
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-600 text-xl mb-2">Loading user information...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mt-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white"
      >
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-primary-100 mt-1">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Today's Status */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Today's Status</h3>
                <div className="mt-2">
                  {todayStatus ? (
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(todayStatus.status)}
                      <span className={`text-sm font-medium ${getStatusColor(todayStatus.status)} px-2 py-1 rounded-full`}>
                        {todayStatus.status}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Not marked yet</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Attendance Actions */}
            <div className="mt-4 space-y-2">
              {todayStatus?.canCheckIn && (
                <button
                  onClick={() => handleAttendanceAction('check-in')}
                  className="btn-success w-full text-sm"
                >
                  Check In
                </button>
              )}
              {todayStatus?.canCheckOut && (
                <button
                  onClick={() => handleAttendanceAction('check-out')}
                  className="btn-warning w-full text-sm"
                >
                  Check Out
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-success-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">This Month</h3>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {attendanceData?.summary?.presentDays || 0}
                  </p>
                  <p className="text-sm text-gray-500">Days Present</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leave Balance */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-warning-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Leave Balance</h3>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-gray-900">15</p>
                  <p className="text-sm text-gray-500">Days Remaining</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Hours */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-info-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Total Hours</h3>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {attendanceData?.summary?.totalHours || 0}
                  </p>
                  <p className="text-sm text-gray-500">This Month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Role-based Quick Access */}
      {(user?.role === 'admin' || user?.role === 'hr' || user?.role === 'manager') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Quick Access</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {user?.role === 'admin' && (
                <div key="admin-access" className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                  <Settings className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-blue-900">Administration</h4>
                    <p className="text-sm text-blue-600">System settings & management</p>
                  </div>
                </div>
              )}
              {user?.role === 'hr' && (
                <div key="hr-access" className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
                  <Users className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-green-900">HR Management</h4>
                    <p className="text-sm text-green-600">Employee & HR processes</p>
                  </div>
                </div>
              )}
              {user?.role === 'manager' && (
                <div key="manager-access" className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
                  <Calendar className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-purple-900">Manager Approvals</h4>
                    <p className="text-sm text-purple-600">Leave & attendance approvals</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Attendance Overview</h3>
          </div>
          <div className="card-body">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={(attendanceData?.attendance?.slice(0, 7) || [
                  { date: new Date().toISOString(), totalHours: 8, _id: 'chart_1' },
                  { date: new Date(Date.now() - 86400000).toISOString(), totalHours: 7.5, _id: 'chart_2' },
                  { date: new Date(Date.now() - 172800000).toISOString(), totalHours: 8, _id: 'chart_3' }
                ]).map((item, index) => ({
                  ...item,
                  _id: item._id || `chart_${index}`,
                  key: item._id || `chart_${index}`
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    formatter={(value) => [value, 'Hours']}
                  />
                  <Bar dataKey="totalHours" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Holidays */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Upcoming Holidays</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {upcomingHolidays.length > 0 ? (
                upcomingHolidays.map((holiday) => (
                  <div key={holiday._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{holiday.name}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(holiday.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <CalendarDays className="h-5 w-5 text-primary-600" />
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No upcoming holidays</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Latest News */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Latest News & Announcements</h3>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {latestNews.length > 0 ? (
              latestNews.map((news) => (
                <div key={news._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <h4 className="font-medium text-gray-900">{news.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{news.summary}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">
                      {new Date(news.publishedAt).toLocaleDateString()}
                    </span>
                    <span className={`badge-${news.priority === 'urgent' ? 'danger' : news.priority === 'high' ? 'warning' : 'info'}`}>
                      {news.priority}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent news</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard; 