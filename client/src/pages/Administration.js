import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Database, Users, BarChart3, Globe, Activity, AlertTriangle } from 'lucide-react';

const Administration = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-black">System Administration</h1>
          <p className="text-gray-600">Manage system settings, security, and administrative functions</p>
        </div>
        <div className="flex items-center space-x-4">
          <Settings className="h-8 w-8 text-gray-600" />
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Database className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">System Health</p>
              <p className="text-2xl font-bold text-gray-900">98%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Alerts</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Uptime</p>
              <p className="text-2xl font-bold text-gray-900">99.9%</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Settings className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-medium text-black">System Settings</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">General Configuration</span>
              <span className="text-xs text-gray-400">Coming Soon</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Email Settings</span>
              <span className="text-xs text-gray-400">Coming Soon</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Notification Preferences</span>
              <span className="text-xs text-gray-400">Coming Soon</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">System Maintenance</span>
              <span className="text-xs text-gray-400">Coming Soon</span>
            </div>
          </div>
        </motion.div>

        {/* Security & Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-medium text-black">Security & Access</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">User Permissions</span>
              <span className="text-xs text-gray-400">Coming Soon</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Role Management</span>
              <span className="text-xs text-gray-400">Coming Soon</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Authentication Settings</span>
              <span className="text-xs text-gray-400">Coming Soon</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Audit Logs</span>
              <span className="text-xs text-gray-400">Coming Soon</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Database className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-medium text-black">Data Management</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Backup & Restore</span>
              <span className="text-xs text-gray-400">Coming Soon</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Data Export</span>
              <span className="text-xs text-gray-400">Coming Soon</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Data Cleanup</span>
              <span className="text-xs text-gray-400">Coming Soon</span>
            </div>
          </div>
        </motion.div>

        {/* Monitoring */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-medium text-black">Monitoring</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Performance Metrics</span>
              <span className="text-xs text-gray-400">Coming Soon</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Error Logs</span>
              <span className="text-xs text-gray-400">Coming Soon</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">System Alerts</span>
              <span className="text-xs text-gray-400">Coming Soon</span>
            </div>
          </div>
        </motion.div>

        {/* Integration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-medium text-black">Integration</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">API Management</span>
              <span className="text-xs text-gray-400">Coming Soon</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Third-party Apps</span>
              <span className="text-xs text-gray-400">Coming Soon</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Webhooks</span>
              <span className="text-xs text-gray-400">Coming Soon</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-medium text-black">System Status</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">Database</span>
            </div>
            <p className="text-xs text-green-600 mt-1">Operational</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">API Services</span>
            </div>
            <p className="text-xs text-green-600 mt-1">Operational</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">File Storage</span>
            </div>
            <p className="text-xs text-green-600 mt-1">Operational</p>
          </div>
        </div>
      </motion.div>

      {/* Coming Soon Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center"
      >
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Settings className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">System Administration</h3>
        </div>
        <p className="text-gray-700">
          This is a placeholder for the System Administration panel. Features like system configuration, 
          security management, monitoring, and advanced administrative functions will be implemented here.
        </p>
      </motion.div>
    </div>
  );
};

export default Administration;
