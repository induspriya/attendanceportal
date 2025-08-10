import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Edit, Trash2, Filter } from 'lucide-react';
import api from '../api/axios';

const AdminHolidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const response = await api.get('/holidays');
      setHolidays(response.data);
    } catch (error) {
      console.error('Error fetching holidays:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHolidayTypeColor = (type) => {
    switch (type) {
      case 'gazetted':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'restricted':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'company':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'optional':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const filteredHolidays = holidays.filter(holiday => {
    if (filter === 'all') return true;
    return holiday.type === filter;
  });

  const holidayTypes = [
    { value: 'all', label: 'All Holidays', count: holidays.length },
    { value: 'gazetted', label: 'Gazetted', count: holidays.filter(h => h.type === 'gazetted').length },
    { value: 'restricted', label: 'Restricted', count: holidays.filter(h => h.type === 'restricted').length },
    { value: 'company', label: 'Company', count: holidays.filter(h => h.type === 'company').length },
    { value: 'optional', label: 'Optional', count: holidays.filter(h => h.type === 'optional').length },
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
          <h1 className="text-2xl font-bold text-black">Holiday Management</h1>
          <p className="text-gray-600">Manage company holidays and important dates</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Holiday</span>
          </button>
          <Calendar className="h-8 w-8 text-blue-600" />
        </div>
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
          <h3 className="text-lg font-medium text-black">Filter Holidays</h3>
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

      {/* Holidays Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-black">All Holidays</h3>
        </div>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHolidays.length > 0 ? (
                filteredHolidays.map((holiday) => (
                  <tr key={holiday._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="font-medium text-gray-900">{holiday.name}</span>
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
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {holiday.description || 'No description available'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
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

export default AdminHolidays; 