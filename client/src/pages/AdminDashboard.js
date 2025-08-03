import React from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <Settings className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Admin Dashboard</h3>
        <p className="mt-1 text-sm text-gray-500">
          This page will contain admin controls and system management features.
        </p>
      </motion.div>
    </div>
  );
};

export default AdminDashboard; 