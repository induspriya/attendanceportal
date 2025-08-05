import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  CalendarDays
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState(null);
  const [todayStatus, setTodayStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);
  const [latestNews, setLatestNews] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [attendanceRes, todayRes, holidaysRes, newsRes] = await Promise.all([
        axios.get('/api/attendance/me'),
        axios.get('/api/attendance/today'),
        axios.get('/api/holidays/upcoming'),
        axios.get('/api/news/latest?limit=3')
      ]);

      setAttendanceData(attendanceRes.data);
      setTodayStatus(todayRes.data);
      setUpcomingHolidays(holidaysRes.data);
      setLatestNews(newsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceAction = async (type) => {
    try {
      await axios.post('/api/attendance/mark', { type });
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
                <BarChart data={attendanceData?.attendance?.slice(0, 7) || []}>
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