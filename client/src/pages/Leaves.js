import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Clock, CheckCircle, XCircle, AlertCircle, FileText, Home, Heart, Baby, User, Coffee, Briefcase, CalendarDays } from 'lucide-react';
import axios from 'axios';

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    type: 'casual',
    reason: ''
  });

  const leaveTypes = [
    { value: 'sick', label: 'Sick Leave', icon: <Heart className="h-4 w-4" />, color: 'text-red-600', bgColor: 'bg-red-50' },
    { value: 'casual', label: 'Casual Leave', icon: <Coffee className="h-4 w-4" />, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { value: 'annual', label: 'Annual Leave', icon: <Calendar className="h-4 w-4" />, color: 'text-green-600', bgColor: 'bg-green-50' },
    { value: 'maternity', label: 'Maternity Leave', icon: <Baby className="h-4 w-4" />, color: 'text-pink-600', bgColor: 'bg-pink-50' },
    { value: 'paternity', label: 'Paternity Leave', icon: <User className="h-4 w-4" />, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    { value: 'bereavement', label: 'Bereavement Leave', icon: <Heart className="h-4 w-4" />, color: 'text-gray-600', bgColor: 'bg-gray-50' },
    { value: 'compensatory', label: 'Compensatory Leave', icon: <Clock className="h-4 w-4" />, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { value: 'sabbatical', label: 'Sabbatical Leave', icon: <Briefcase className="h-4 w-4" />, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { value: 'unpaid', label: 'Unpaid Leave', icon: <FileText className="h-4 w-4" />, color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { value: 'work-from-home', label: 'Work from Home', icon: <Home className="h-4 w-4" />, color: 'text-teal-600', bgColor: 'bg-teal-50' },
    { value: 'half-day', label: 'Half Day', icon: <Clock className="h-4 w-4" />, color: 'text-cyan-600', bgColor: 'bg-cyan-50' },
    { value: 'other', label: 'Other', icon: <CalendarDays className="h-4 w-4" />, color: 'text-gray-600', bgColor: 'bg-gray-50' }
  ];

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/leaves/me');
      setLeaves(response.data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/leaves/apply', formData);
      setShowApplyForm(false);
      setFormData({ from: '', to: '', type: 'casual', reason: '' });
      fetchLeaves();
    } catch (error) {
      console.error('Error applying leave:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'rejected':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getLeaveTypeInfo = (type) => {
    return leaveTypes.find(lt => lt.value === type) || leaveTypes[leaveTypes.length - 1];
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-600">Apply for leaves and track your leave history</p>
        </div>
        <button
          onClick={() => setShowApplyForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Apply Leave</span>
        </button>
      </motion.div>

      {/* Leave Types Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">Available Leave Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leaveTypes.map((type) => (
            <div
              key={type.value}
              className={`p-4 rounded-lg border ${type.bgColor} border-gray-200`}
            >
              <div className="flex items-center space-x-3">
                <div className={type.color}>{type.icon}</div>
                <div>
                  <h4 className="font-medium text-gray-900">{type.label}</h4>
                  <p className="text-sm text-gray-600">Available for application</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Leave History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">Leave History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leave Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From - To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaves.length > 0 ? (
                leaves.map((leave) => {
                  const leaveTypeInfo = getLeaveTypeInfo(leave.type);
                  return (
                    <tr key={leave._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={leaveTypeInfo.color}>{leaveTypeInfo.icon}</div>
                          <span className="ml-2 font-medium text-gray-900">{leaveTypeInfo.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(leave.from).toLocaleDateString()} - {new Date(leave.to).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {leave.totalDays} day(s)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(leave.status)}
                          <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(leave.status)}`}>
                            {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {leave.reason}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No leave applications found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Apply Leave Modal */}
      {showApplyForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">Apply for Leave</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {leaveTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  value={formData.to}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Apply Leave
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplyForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Leaves; 