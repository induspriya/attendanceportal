import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Calendar, TrendingUp, UserCheck, Clock, AlertCircle, CheckCircle } from 'lucide-react';

const HR = () => {
  const [testCount, setTestCount] = useState(0);
  
  console.log('🔍 HR Component: Rendering HR page');
  console.log('🔍 HR Component: Current time:', new Date().toISOString());
  
  const handleTestClick = () => {
    setTestCount(prev => prev + 1);
    console.log('🔍 HR Component: Test button clicked! Count:', testCount + 1);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* SUPER PROMINENT TEST MESSAGE */}
        <div className="bg-red-500 text-white text-center p-8 rounded-lg shadow-lg border-4 border-red-700">
          <h1 className="text-4xl font-bold mb-4">🚨 HR PAGE IS WORKING! 🚨</h1>
          <p className="text-xl">If you can see this message, the HR page is rendering correctly!</p>
          <p className="text-lg mt-2">Timestamp: {new Date().toLocaleString()}</p>
          <button 
            onClick={handleTestClick}
            className="mt-4 bg-white text-red-500 px-6 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            🧪 Test Button (Clicked: {testCount} times)
          </button>
        </div>

        {/* Debug Header */}
        <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-6">
          <h3 className="text-red-800 font-bold">DEBUG INFO:</h3>
          <p className="text-red-700">HR Page is rendering successfully!</p>
          <p className="text-red-700">Timestamp: {new Date().toLocaleString()}</p>
          <p className="text-red-700">Test Count: {testCount}</p>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between bg-white rounded-lg shadow-lg p-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">HR Management</h1>
            <p className="text-lg text-gray-600">Manage human resources, employee records, and HR processes</p>
          </div>
          <div className="flex items-center space-x-4">
            <Users className="h-12 w-12 text-blue-600" />
          </div>
        </motion.div>

        {/* Prominent Placeholder Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-center text-white shadow-lg"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Users className="h-12 w-12 text-white" />
            <h2 className="text-3xl font-bold">HR Management System</h2>
          </div>
          <p className="text-xl text-blue-100 mb-4">
            This is a placeholder for the HR Management system. Features like employee management, 
            performance reviews, training programs, and advanced leave management will be implemented here.
          </p>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-sm text-blue-100">
              <strong>Current Status:</strong> Under Development
            </p>
            <p className="text-sm text-blue-100">
              <strong>Expected Features:</strong> Employee Directory, Performance Reviews, Training Programs, Advanced Leave Management
            </p>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Employees</p>
                <p className="text-2xl font-bold text-gray-900">142</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">+12</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Employee Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Users className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-medium text-black">Employee Management</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Employee Directory</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Performance Reviews</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Training Programs</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Employee Onboarding</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
            </div>
          </motion.div>

          {/* Leave & Attendance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-medium text-black">Leave & Attendance</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Leave Requests</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Attendance Reports</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Overtime Management</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Shift Scheduling</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-medium text-black">Recent Activities</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600">New employee John Doe joined the team</span>
              <span className="text-xs text-gray-400 ml-auto">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-gray-600">Leave request pending approval for Sarah Wilson</span>
              <span className="text-xs text-gray-400 ml-auto">4 hours ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600">Performance review completed for Mike Johnson</span>
              <span className="text-xs text-gray-400 ml-auto">1 day ago</span>
            </div>
          </div>
        </motion.div>

        {/* Development Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 shadow-lg"
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <h3 className="text-lg font-medium text-yellow-900">Development Status</h3>
          </div>
          <p className="text-yellow-700 text-center">
            This HR Management system is currently under development. The placeholder content above demonstrates 
            the planned features and layout. Please check back later for the full implementation.
          </p>
        </motion.div>

        {/* Footer Debug Info */}
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-center">
          <p className="text-gray-600 text-sm">
            <strong>Page Status:</strong> HR Page is visible and functional
          </p>
          <p className="text-gray-600 text-sm">
            <strong>Last Updated:</strong> {new Date().toLocaleString()}
          </p>
          <p className="text-gray-600 text-sm">
            <strong>Test Count:</strong> {testCount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HR;
