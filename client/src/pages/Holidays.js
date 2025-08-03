import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Filter, CalendarDays, Clock, Star, Building, Users } from 'lucide-react';
import axios from 'axios';

const Holidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

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
        <Calendar className="h-8 w-8 text-blue-600" />
      </motion.div>

      {/* Filter Tabs */}
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

      {/* Upcoming Holidays */}
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
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getHolidayTypeColor(holiday.type)}`}>
                  {getHolidayTypeLabel(holiday.type)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No upcoming holidays found</p>
          )}
        </div>
      </motion.div>

      {/* All Holidays */}
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
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getHolidayTypeColor(holiday.type)}`}>
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
    </div>
  );
};

export default Holidays; 