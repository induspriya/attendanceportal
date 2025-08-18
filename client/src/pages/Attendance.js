import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, AlertCircle, LogIn, LogOut, RefreshCw, Calendar } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [todayStatus, setTodayStatus] = useState('not_checked');
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Function to get today's attendance status
  const getTodayStatus = async () => {
    try {
      const response = await api.get('/attendance/today');
      console.log('Today\'s status:', response.data);
      
      const { checkedIn, checkedOut, checkInTime, checkOutTime } = response.data;
      
      if (checkedOut) {
        setTodayStatus('checked_out');
        setCheckInTime(checkInTime ? new Date(checkInTime) : null);
        setCheckOutTime(checkOutTime ? new Date(checkOutTime) : null);
      } else if (checkedIn) {
        setTodayStatus('checked_in');
        setCheckInTime(checkInTime ? new Date(checkInTime) : null);
        setCheckOutTime(null);
      } else {
        setTodayStatus('not_checked');
        setCheckInTime(null);
        setCheckOutTime(null);
      }
    } catch (error) {
      console.error('Error getting today\'s status:', error);
    }
  };

  const fetchAttendanceData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Try to fetch from backend first
      try {
        const response = await api.get(`/attendance/me?month=${selectedMonth}&year=${selectedYear}`);
        console.log('Backend attendance data:', response.data);
        setAttendanceData(response.data);
        
        // Get today's date and find today's record
        const today = new Date();
        const todayRecord = response.data.attendance?.find(day => {
          const recordDate = new Date(day.date);
          return recordDate.toDateString() === today.toDateString();
        });
        
        console.log('Today\'s record from backend:', todayRecord);
        
        if (todayRecord) {
          // Determine status based on backend data
          let status = 'not_checked';
          if (todayRecord.checkIn?.time && todayRecord.checkOut?.time) {
            status = 'checked_out';
          } else if (todayRecord.checkIn?.time) {
            status = 'checked_in';
          }
          
          setTodayStatus(status);
          setCheckInTime(todayRecord.checkIn?.time ? new Date(todayRecord.checkIn.time) : null);
          setCheckOutTime(todayRecord.checkOut?.time ? new Date(todayRecord.checkOut.time) : null);
          
          console.log('Updated today status:', status);
        } else {
          // No record for today, reset status
          setTodayStatus('not_checked');
          setCheckInTime(null);
          setCheckOutTime(null);
          console.log('No record for today, reset status to not_checked');
        }
      } catch (backendError) {
        console.log('Backend failed, using mock data:', backendError.message);
        // Fallback to mock data if backend fails
        const mockData = generateMockAttendanceData(selectedMonth, selectedYear);
        setAttendanceData(mockData);
        
        // Set today's status
        const today = new Date();
        const todayRecord = mockData.days.find(day => 
          new Date(day.date).toDateString() === today.toDateString()
        );
        
        if (todayRecord) {
          setTodayStatus(todayRecord.status);
          setCheckInTime(todayRecord.checkIn);
          setCheckOutTime(todayRecord.checkOut);
        }
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);

  // Get today's status when component mounts
  useEffect(() => {
    getTodayStatus();
  }, []);

  // Generate mock attendance data for testing
  const generateMockAttendanceData = (month, year) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isToday = date.toDateString() === new Date().toDateString();
      
      let status = 'present';
      let checkIn = null;
      let checkOut = null;
      
      if (!isWeekend) {
        if (isToday) {
          status = 'not_checked';
        } else {
          status = Math.random() > 0.1 ? 'present' : 'absent';
          if (status === 'present') {
            checkIn = new Date(year, month - 1, day, 9, Math.floor(Math.random() * 30));
            checkOut = new Date(year, month - 1, day, 17, Math.floor(Math.random() * 60));
          }
        }
      } else {
        status = 'weekend';
      }
      
      days.push({
        date: date.toISOString(),
        status,
        checkIn,
        checkOut,
        workingHours: checkIn && checkOut ? 
          ((checkOut - checkIn) / (1000 * 60 * 60)).toFixed(1) : null
      });
    }
    
    return {
      days,
      summary: {
        totalDays: daysInMonth,
        presentDays: days.filter(d => d.status === 'present').length,
        absentDays: days.filter(d => d.status === 'absent').length,
        weekendDays: days.filter(d => d.status === 'weekend').length,
        averageWorkingHours: days
          .filter(d => d.workingHours)
          .reduce((sum, d) => sum + parseFloat(d.workingHours), 0) / 
          days.filter(d => d.workingHours).length || 0
      }
    };
  };

  const handleCheckIn = async () => {
    try {
      setIsProcessing(true);
      
      // Send to backend first
      try {
        const response = await api.post('/attendance/mark', { type: 'check-in' });
        console.log('Check-in response:', response.data);
        
        toast.success('Check-in successful!');
        
        // Get updated today's status from backend
        await getTodayStatus();
        
        // Refresh attendance data to get updated information
        await fetchAttendanceData();
      } catch (error) {
        console.error('Backend check-in failed:', error);
        toast.error('Check-in failed to save to server');
        return;
      }
    } catch (error) {
      console.error('Check-in error:', error);
      toast.error('Check-in failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setIsProcessing(true);
      
      // Send to backend first
      try {
        const response = await api.post('/attendance/mark', { type: 'check-out' });
        console.log('Check-out response:', response.data);
        
        toast.success('Check-out successful!');
        
        // Get updated today's status from backend
        await getTodayStatus();
        
        // Refresh attendance data to get updated information
        await fetchAttendanceData();
      } catch (error) {
        console.error('Backend check-out failed:', error);
        toast.error('Check-out failed to save to server');
        return;
      }
    } catch (error) {
      console.error('Check-out error:', error);
      toast.error('Check-out failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-5 w-5 text-success-600" />;
      case 'absent': return <XCircle className="h-5 w-5 text-danger-600" />;
      case 'late': return <AlertCircle className="h-5 w-5 text-warning-600" />;
      case 'weekend': return <Clock className="h-5 w-5 text-gray-400" />;
      case 'checked_in': return <LogIn className="h-5 w-5 text-blue-600" />;
      case 'checked_out': return <LogOut className="h-5 w-5 text-green-600" />;
      default: return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-success-100 text-success-800';
      case 'absent': return 'bg-danger-100 text-danger-800';
      case 'late': return 'bg-warning-100 text-warning-800';
      case 'weekend': return 'bg-gray-100 text-gray-600';
      case 'checked_in': return 'bg-blue-100 text-blue-800';
      case 'checked_out': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'present': return 'Present';
      case 'absent': return 'Absent';
      case 'late': return 'Late';
      case 'weekend': return 'Weekend';
      case 'checked_in': return 'Checked In';
      case 'checked_out': return 'Checked Out';
      case 'not_checked': return 'Not Checked';
      default: return 'Unknown';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '-';
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your daily attendance and working hours
          </p>
        </div>
        
        {/* Month/Year Selector */}
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="input"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2024, i).toLocaleDateString('en-US', { month: 'long' })}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="input"
          >
            {[2023, 2024, 2025].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Today's Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-lg font-medium text-gray-900 mb-4">Today's Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatDate(new Date())}
            </div>
            <div className="text-sm text-gray-500">Date</div>
          </div>
          <div className="text-center">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(todayStatus)}`}>
              {getStatusIcon(todayStatus)}
              <span className="ml-2">{getStatusText(todayStatus)}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">Status</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {checkInTime ? formatTime(checkInTime) : '-'}
            </div>
            <div className="text-sm text-gray-500">Check-in Time</div>
          </div>
        </div>
        
        {/* Check-out Time Display */}
        {todayStatus === 'checked_out' && (
          <div className="mt-4 text-center">
            <div className="text-lg font-medium text-gray-900">
              Check-out Time: {checkOutTime ? formatTime(checkOutTime) : '-'}
            </div>
            <div className="text-sm text-gray-500">You have completed your work day</div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="mt-6 flex justify-center space-x-4">
          {todayStatus === 'not_checked' && (
            <button
              onClick={handleCheckIn}
              disabled={isProcessing}
              className="btn btn-primary flex items-center space-x-2"
            >
              <LogIn className="h-5 w-5" />
              <span>Check In</span>
            </button>
          )}
          
          {todayStatus === 'checked_in' && (
            <button
              onClick={handleCheckOut}
              disabled={isProcessing}
              className="btn btn-success flex items-center space-x-2"
            >
              <LogOut className="h-5 w-5" />
              <span>Check Out</span>
            </button>
          )}
          
          {/* Always show refresh button */}
          <button
            onClick={async () => {
              await getTodayStatus();
              await fetchAttendanceData();
            }}
            disabled={isProcessing}
            className="btn btn-outline flex items-center space-x-2"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Refresh Status</span>
          </button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Present Days</p>
              <p className="text-2xl font-bold text-gray-900">{attendanceData?.summary?.presentDays || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Absent Days</p>
              <p className="text-2xl font-bold text-gray-900">{attendanceData?.summary?.absentDays || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Working Hours</p>
              <p className="text-2xl font-bold text-gray-900">
                {(attendanceData?.summary?.averageWorkingHours || 0).toFixed(1)}h
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Days</p>
              <p className="text-2xl font-bold text-gray-900">{attendanceData?.summary?.totalDays || 0}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Attendance Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-lg font-medium text-gray-900 mb-4">Monthly Calendar</h2>
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {attendanceData?.days?.map((day, index) => (
            <div
              key={index}
              className={`p-2 text-center text-sm border rounded-lg ${
                day.status === 'weekend' 
                  ? 'bg-gray-100 text-gray-400' 
                  : day.status === 'present' 
                    ? 'bg-green-100 text-green-800' 
                    : day.status === 'absent' 
                      ? 'bg-red-100 text-red-800'
                      : day.status === 'checked_in'
                        ? 'bg-blue-100 text-blue-800'
                        : day.status === 'checked_out'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-50 text-gray-600'
              }`}
            >
              <div className="font-medium">{new Date(day.date).getDate()}</div>
              <div className="text-xs mt-1">
                {day.status === 'weekend' ? 'W' : 
                 day.status === 'present' ? 'P' : 
                 day.status === 'absent' ? 'A' :
                 day.status === 'checked_in' ? 'CI' :
                 day.status === 'checked_out' ? 'CO' : '-'}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Working Hours Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-lg font-medium text-gray-900 mb-4">Working Hours This Month</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceData?.days?.filter(day => day.workingHours) || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).getDate()}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                formatter={(value) => [`${value} hours`, 'Working Hours']}
              />
              <Bar dataKey="workingHours" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default Attendance; 