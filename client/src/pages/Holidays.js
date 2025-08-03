import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Filter, CalendarDays, Clock, Star, Building, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const Holidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'

  useEffect(() => {
    fetchHolidays();
  }, [currentYear]);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/holidays/');
      setHolidays(response.data);
    } catch (error) {
      console.error('Error fetching holidays:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHolidayTypeIcon = (type) => {
    switch (type) {
      case 'gazetted':
        return <Star className="h-4 w-4 text-red-500" />;
      case 'restricted':
        return <CalendarDays className="h-4 w-4 text-orange-500" />;
      case 'company':
        return <Building className="h-4 w-4 text-blue-500" />;
      case 'optional':
        return <Clock className="h-4 w-4 text-purple-500" />;
      case 'sunday':
        return <Calendar className="h-4 w-4 text-gray-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-400" />;
    }
  };

  const getHolidayTypeColor = (type) => {
    switch (type) {
      case 'gazetted':
        return 'bg-red-500 text-white';
      case 'restricted':
        return 'bg-orange-500 text-white';
      case 'company':
        return 'bg-blue-500 text-white';
      case 'optional':
        return 'bg-purple-500 text-white';
      case 'sunday':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const getHolidayTypeBorderColor = (type) => {
    switch (type) {
      case 'gazetted':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'restricted':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'company':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'optional':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'sunday':
        return 'bg-gray-50 border-gray-200 text-gray-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getHolidayTypeLabel = (type) => {
    switch (type) {
      case 'gazetted':
        return 'Gazetted Holiday';
      case 'restricted':
        return 'Restricted Holiday';
      case 'company':
        return 'Company Holiday';
      case 'optional':
        return 'Optional Holiday';
      case 'sunday':
        return 'Sunday';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  // Calendar generation functions
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    const day = new Date(year, month, 1).getDay();
    // Convert Sunday=0 to Monday=0 format
    return day === 0 ? 6 : day - 1;
  };

  const getHolidayForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return holidays.find(holiday => {
      const holidayDate = new Date(holiday.date).toISOString().split('T')[0];
      return holidayDate === dateString;
    });
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const holiday = getHolidayForDate(date);
      days.push({ date, holiday, dayNumber: i });
    }

    return days;
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const filteredHolidays = holidays.filter(holiday => {
    if (filter === 'all') return true;
    return holiday.type === filter;
  });

  const upcomingHolidays = filteredHolidays
    .filter(holiday => new Date(holiday.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  const holidayTypes = [
    { value: 'all', label: 'All Holidays', count: holidays.length },
    { value: 'gazetted', label: 'Gazetted', count: holidays.filter(h => h.type === 'gazetted').length },
    { value: 'restricted', label: 'Restricted', count: holidays.filter(h => h.type === 'restricted').length },
    { value: 'company', label: 'Company', count: holidays.filter(h => h.type === 'company').length },
    { value: 'optional', label: 'Optional', count: holidays.filter(h => h.type === 'optional').length },
    { value: 'sunday', label: 'Sundays', count: holidays.filter(h => h.type === 'sunday').length },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Holiday Calendar</h1>
          <p className="text-gray-600">View all company holidays and important dates</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Calendar View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              List View
            </button>
          </div>
          <Calendar className="h-8 w-8 text-blue-600" />
        </div>
      </motion.div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={() => {
                  setCurrentMonth(new Date().getMonth());
                  setCurrentYear(new Date().getFullYear());
                }}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 bg-gray-50 rounded">
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {generateCalendarDays().map((day, index) => (
              <div
                key={index}
                className={`min-h-[80px] p-2 border border-gray-200 relative ${
                  day ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                {day && (
                  <>
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {day.dayNumber}
                    </div>
                    {day.holiday && (
                      <div
                        className={`text-xs p-1 rounded text-white font-medium truncate ${getHolidayTypeColor(day.holiday.type)}`}
                        title={day.holiday.name}
                      >
                        {day.holiday.name}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Holiday Types</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {holidayTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${type.value === 'gazetted' ? 'bg-red-500' : 
                    type.value === 'restricted' ? 'bg-orange-500' : 
                    type.value === 'company' ? 'bg-blue-500' : 
                    type.value === 'optional' ? 'bg-purple-500' : 
                    type.value === 'sunday' ? 'bg-gray-500' : 'bg-gray-400'}`}></div>
                  <span className="text-xs text-gray-600">{type.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Filter Tabs - Only show in list view */}
      {viewMode === 'list' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-medium text-gray-900">Filter Holidays</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {holidayTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setFilter(type.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === type.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.label} ({type.count})
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Upcoming Holidays - Only show in list view */}
      {viewMode === 'list' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Holidays</h3>
        <div className="space-y-3">
          {upcomingHolidays.length > 0 ? (
            upcomingHolidays.map((holiday) => (
              <div
                key={holiday._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getHolidayTypeIcon(holiday.type)}
                  <div>
                    <h4 className="font-medium text-gray-900">{holiday.name}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(holiday.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                                 <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getHolidayTypeBorderColor(holiday.type)}`}>
                  {getHolidayTypeLabel(holiday.type)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No upcoming holidays found</p>
          )}
        </div>
        </motion.div>
      )}

      {/* All Holidays - Only show in list view */}
      {viewMode === 'list' && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">All Holidays</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Holiday
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHolidays.length > 0 ? (
                filteredHolidays.map((holiday) => (
                  <tr key={holiday._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getHolidayTypeIcon(holiday.type)}
                        <span className="ml-2 font-medium text-gray-900">{holiday.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(holiday.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getHolidayTypeBorderColor(holiday.type)}`}>
                        {getHolidayTypeLabel(holiday.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {holiday.description || 'No description available'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No holidays found for the selected filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </motion.div>
      )}
    </div>
  );
};

export default Holidays; 