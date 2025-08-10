import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, FileText, Home, Heart, Baby, User, Coffee, Briefcase, CalendarDays, Users } from 'lucide-react';
import api from '../api/axios';

const HRLeaves = () => {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [approvalData, setApprovalData] = useState({
    status: 'approved',
    comments: '',
    rejectionReason: ''
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
    fetchPendingLeaves();
  }, []);

  const fetchPendingLeaves = async () => {
    try {
      setLoading(true);
      const response = await api.get('/leaves/pending-hr');
      setPendingLeaves(response.data);
    } catch (error) {
      console.error('Error fetching pending leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (leaveId) => {
    try {
      const payload = {
        status: approvalData.status,
        comments: approvalData.comments
      };

      if (approvalData.status === 'rejected' && approvalData.rejectionReason) {
        payload.rejectionReason = approvalData.rejectionReason;
      }

      await api.post(`/leaves/hr-approve/${leaveId}`, payload);
      setSelectedLeave(null);
      setApprovalData({ status: 'approved', comments: '', rejectionReason: '' });
      fetchPendingLeaves();
    } catch (error) {
      console.error('Error approving leave:', error);
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
          <h1 className="text-2xl font-bold text-black">HR Leave Approvals</h1>
          <p className="text-gray-600">Review and approve leave requests approved by managers</p>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-8 w-8 text-purple-600" />
          <span className="text-sm font-medium text-gray-500">
            {pendingLeaves.length} pending request{pendingLeaves.length !== 1 ? 's' : ''}
          </span>
        </div>
      </motion.div>

      {/* Pending Leave Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {pendingLeaves.length > 0 ? (
          pendingLeaves.map((leave) => {
            const leaveTypeInfo = getLeaveTypeInfo(leave.type);
            return (
              <motion.div
                key={leave._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className={leaveTypeInfo.color}>{leaveTypeInfo.icon}</div>
                    <span className="ml-2 font-medium text-black">{leaveTypeInfo.label}</span>
                  </div>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                    Manager Approved
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-black">{leave.user.name}</h4>
                    <p className="text-sm text-gray-600">{leave.user.department} • {leave.user.position}</p>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(leave.from).toLocaleDateString()} - {new Date(leave.to).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{leave.totalDays} day(s)</span>
                  </div>

                  <div className="text-sm text-gray-700">
                    <strong>Reason:</strong> {leave.reason}
                  </div>

                  {/* Manager Approval Info */}
                  {leave.managerApproval && leave.managerApproval.status === 'approved' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-800">Manager Approved</span>
                      </div>
                      {leave.managerApproval.comments && (
                        <p className="text-xs text-blue-700 mt-1">
                          <strong>Comments:</strong> {leave.managerApproval.comments}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex space-x-2 pt-3">
                    <button
                      onClick={() => setSelectedLeave(leave)}
                      className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
                    >
                      Review & Approve
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Pending HR Approvals</h3>
            <p className="mt-1 text-sm text-gray-500">
              All manager-approved leave requests have been processed.
            </p>
          </div>
        )}
      </motion.div>

      {/* Approval Modal */}
      {selectedLeave && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedLeave(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-black">HR Review - Leave Request</h3>
                <button
                  onClick={() => setSelectedLeave(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-black">{selectedLeave.user.name}</h4>
                  <p className="text-sm text-gray-600">{selectedLeave.user.department} • {selectedLeave.user.position}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Leave Type:</span>
                    <p className="font-medium">{getLeaveTypeInfo(selectedLeave.type).label}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <p className="font-medium">{selectedLeave.totalDays} day(s)</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">From - To:</span>
                    <p className="font-medium">
                      {new Date(selectedLeave.from).toLocaleDateString()} - {new Date(selectedLeave.to).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Reason:</span>
                    <p className="font-medium">{selectedLeave.reason}</p>
                  </div>
                </div>

                {/* Manager Approval Details */}
                {selectedLeave.managerApproval && selectedLeave.managerApproval.status === 'approved' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <div className="flex items-center space-x-2 text-sm mb-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Manager Approval</span>
                    </div>
                    {selectedLeave.managerApproval.comments && (
                      <p className="text-xs text-blue-700">
                        <strong>Manager Comments:</strong> {selectedLeave.managerApproval.comments}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">HR Decision</label>
                  <select
                    value={approvalData.status}
                    onChange={(e) => setApprovalData({ ...approvalData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="approved">Approve</option>
                    <option value="rejected">Reject</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">HR Comments (Optional)</label>
                  <textarea
                    value={approvalData.comments}
                    onChange={(e) => setApprovalData({ ...approvalData, comments: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows="3"
                    placeholder="Add any HR comments or feedback..."
                  />
                </div>

                {approvalData.status === 'rejected' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason</label>
                    <textarea
                      value={approvalData.rejectionReason}
                      onChange={(e) => setApprovalData({ ...approvalData, rejectionReason: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows="2"
                      placeholder="Please provide a reason for rejection..."
                      required
                    />
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => handleApproval(selectedLeave._id)}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      approvalData.status === 'approved'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    {approvalData.status === 'approved' ? 'Approve' : 'Reject'}
                  </button>
                  <button
                    onClick={() => setSelectedLeave(null)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default HRLeaves; 