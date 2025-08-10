import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Clock, CheckCircle, XCircle, AlertCircle, FileText, Home, Heart, Baby, User, Coffee, Gift, Building, Info } from 'lucide-react';
import api from '../api/axios';

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [holidaysLoading, setHolidaysLoading] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    type: 'casual',
    reason: ''
  });

  const leaveTypes = [
    { value: 'casual', label: 'Casual Leave', icon: Coffee, color: 'bg-blue-100 text-blue-800' },
    { value: 'sick', label: 'Sick Leave', icon: Heart, color: 'bg-red-100 text-red-800' },
    { value: 'maternity', label: 'Maternity Leave', icon: Baby, color: 'bg-pink-100 text-pink-800' },
    { value: 'paternity', label: 'Paternity Leave', icon: User, color: 'bg-purple-100 text-purple-800' },
    { value: 'annual', label: 'Annual Leave', icon: Calendar, color: 'bg-green-100 text-green-800' },
    { value: 'work_from_home', label: 'Work from Home', icon: Home, color: 'bg-gray-100 text-gray-800' }
  ];

  const fetchLeaves = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/leaves');
      setLeaves(response.data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHolidays = async () => {
    try {
      console.log('Fetching holidays...');
      setHolidaysLoading(true);
      const response = await api.get('/holidays/upcoming');
      console.log('Holidays response:', response.data);
      setHolidays(response.data);
    } catch (error) {
      console.error('Error fetching holidays:', error);
      setHolidays([]);
    } finally {
      setHolidaysLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
    fetchHolidays();
  }, [fetchLeaves]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leaves/apply', formData);
      setShowApplyForm(false);
      setFormData({ from: '', to: '', type: 'casual', reason: '' });
      fetchLeaves();
    } catch (error) {
      console.error('Error applying leave:', error);
    }
  };

  const closeModal = useCallback(() => {
    setShowApplyForm(false);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'manager_approved':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'hr_approved':
        return <CheckCircle className="h-4 w-4 text-purple-500" />;
      case 'manager_rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'hr_rejected':
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
      case 'manager_approved':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'hr_approved':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'manager_rejected':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'hr_rejected':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'manager_approved':
        return 'Manager Approved';
      case 'hr_approved':
        return 'HR Approved';
      case 'manager_rejected':
        return 'Manager Rejected';
      case 'hr_rejected':
        return 'HR Rejected';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  const getLeaveTypeInfo = (type) => {
    return leaveTypes.find(t => t.value === type) || leaveTypes[0];
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
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-600">Manage your leave applications and view history</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowApplyForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Apply for Leave
        </motion.button>
      </motion.div>

      {/* Leave Types Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {leaveTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <div key={type.value} className="bg-white rounded-lg p-4 text-center border border-gray-200 hover:shadow-md transition-shadow">
              <IconComponent className="h-8 w-8 mx-auto mb-2 text-gray-600" />
              <p className="text-sm font-medium text-gray-900">{type.label}</p>
            </div>
          );
        })}
      </motion.div>

      {/* Holidays Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Gift className="h-5 w-5 mr-2 text-green-600" />
            Upcoming Holidays
          </h3>
          <p className="text-sm text-gray-600 mt-1">Plan your leaves around these upcoming holidays</p>
        </div>
        <div className="p-6">
          {holidaysLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            </div>
          ) : holidays.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {holidays.map((holiday) => {
                const holidayDate = new Date(holiday.date);
                const today = new Date();
                const daysUntil = Math.ceil((holidayDate - today) / (1000 * 60 * 60 * 24));
                const isUpcoming = daysUntil > 0;
                
                return (
                  <motion.div
                    key={holiday._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.02 }}
                    className={`bg-gradient-to-br ${
                      isUpcoming 
                        ? 'from-green-50 to-green-100 border-green-200' 
                        : 'from-gray-50 to-gray-100 border-gray-200'
                    } rounded-lg p-4 border`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <Calendar className={`h-5 w-5 mr-2 ${
                          isUpcoming ? 'text-green-600' : 'text-gray-500'
                        }`} />
                        <span className={`text-sm font-medium ${
                          isUpcoming ? 'text-green-800' : 'text-gray-700'
                        }`}>
                          {holiday.type === 'public' ? 'Public Holiday' : 'Company Holiday'}
                        </span>
                      </div>
                      {isUpcoming && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          {daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}
                        </span>
                      )}
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-2">{holiday.name}</h4>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      {holidayDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    
                    {holiday.description && (
                      <p className="text-sm text-gray-600">{holiday.description}</p>
                    )}
                    
                    {isUpcoming && daysUntil <= 7 && (
                      <div className="mt-3 pt-3 border-t border-green-200">
                        <span className="text-xs text-green-700 font-medium">
                          ⚠️ Plan your leaves accordingly
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Gift className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">No upcoming holidays found</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* HR and Administration Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            HR and Administration
          </h3>
          <p className="text-sm text-gray-600 mt-1">Important policies and information for employees</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Leave Policy */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4"
            >
              <div className="flex items-center mb-3">
                <FileText className="h-6 w-6 text-blue-600 mr-2" />
                <h4 className="font-semibold text-blue-900">Leave Policy</h4>
              </div>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex justify-between">
                  <span>Casual Leave:</span>
                  <span className="font-medium">12 days/year</span>
                </div>
                <div className="flex justify-between">
                  <span>Sick Leave:</span>
                  <span className="font-medium">15 days/year</span>
                </div>
                <div className="flex justify-between">
                  <span>Earned Leave:</span>
                  <span className="font-medium">30 days/year</span>
                </div>
                <div className="flex justify-between">
                  <span>Maternity Leave:</span>
                  <span className="font-medium">26 weeks</span>
                </div>
                <div className="flex justify-between">
                  <span>Paternity Leave:</span>
                  <span className="font-medium">15 days</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-blue-200">
                <span className="text-xs text-blue-700 font-medium">
                  📋 Apply at least 3 days in advance for planned leaves
                </span>
              </div>
            </motion.div>

            {/* Compensatory Leave Policy */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4"
            >
              <div className="flex items-center mb-3">
                <Clock className="h-6 w-6 text-green-600 mr-2" />
                <h4 className="font-semibold text-green-900">Compensatory Leave Policy</h4>
              </div>
              <div className="space-y-2 text-sm text-green-800">
                <div className="flex justify-between">
                  <span>Weekend Work:</span>
                  <span className="font-medium">1:1 ratio</span>
                </div>
                <div className="flex justify-between">
                  <span>Holiday Work:</span>
                  <span className="font-medium">1:1 ratio</span>
                </div>
                <div className="flex justify-between">
                  <span>Overtime (8+ hrs):</span>
                  <span className="font-medium">0.5:1 ratio</span>
                </div>
                <div className="flex justify-between">
                  <span>Night Shift:</span>
                  <span className="font-medium">0.5:1 ratio</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Comp Off:</span>
                  <span className="font-medium">30 days</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-green-200">
                <span className="text-xs text-green-700 font-medium">
                  ⏰ Comp off must be availed within 3 months
                </span>
              </div>
            </motion.div>

            {/* EPF Details */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4"
            >
              <div className="flex items-center mb-3">
                <Building className="h-6 w-6 text-purple-600 mr-2" />
                <h4 className="font-semibold text-purple-900">EPF Details</h4>
              </div>
              <div className="space-y-2 text-sm text-purple-800">
                <div className="flex justify-between">
                  <span>Employee Contribution:</span>
                  <span className="font-medium">12% of Basic</span>
                </div>
                <div className="flex justify-between">
                  <span>Employer Contribution:</span>
                  <span className="font-medium">12% of Basic</span>
                </div>
                <div className="flex justify-between">
                  <span>EPS Contribution:</span>
                  <span className="font-medium">8.33% of Basic</span>
                </div>
                <div className="flex justify-between">
                  <span>EPF Admin:</span>
                  <span className="font-medium">0.5% of Basic</span>
                </div>
                <div className="flex justify-between">
                  <span>EDLI:</span>
                  <span className="font-medium">0.5% of Basic</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-purple-200">
                <span className="text-xs text-purple-700 font-medium">
                  💰 EPF account number: EPF123456789
                </span>
              </div>
            </motion.div>
          </div>

          {/* Additional Information */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2 flex items-center">
              <Info className="h-4 w-4 mr-2 text-gray-600" />
              Important Notes
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p className="mb-2"><strong>Leave Application:</strong> Submit through the portal at least 3 working days in advance.</p>
                <p className="mb-2"><strong>Medical Certificate:</strong> Required for sick leave exceeding 3 days.</p>
              </div>
              <div>
                <p className="mb-2"><strong>Comp Off:</strong> Must be approved by manager and availed within 3 months.</p>
                <p className="mb-2"><strong>EPF Withdrawal:</strong> Available after 2 months of unemployment or retirement.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Leave History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Leave History
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaves.length > 0 ? (
                leaves.map((leave) => {
                  const leaveTypeInfo = getLeaveTypeInfo(leave.type);
                  const IconComponent = leaveTypeInfo.icon;
                  return (
                    <tr key={leave._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <IconComponent className="h-5 w-5 mr-2 text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">{leaveTypeInfo.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(leave.from).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(leave.to).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(leave.status)}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                            {getStatusLabel(leave.status)}
                          </span>
                        </div>
                        {leave.managerApproval && (
                          <div className="text-xs text-gray-500 mt-1">
                            Manager: {leave.managerApproval.status === 'pending' ? 'Pending' : 
                              leave.managerApproval.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                          </div>
                        )}
                        {leave.hrApproval && (
                          <div>HR: {leave.hrApproval.status === 'pending' ? 'Pending' : 
                            leave.hrApproval.status === 'approved' ? '✓ Approved' : '✗ Rejected'}</div>
                        )}
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
      <AnimatePresence>
        {showApplyForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
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
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Leaves; 