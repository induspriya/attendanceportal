import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Calendar, 
  Clock, 
  PiggyBank, 
  Users, 
  Shield, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Info,
  Calculator
} from 'lucide-react';

const PolicyDashboard = () => {
  const policyHighlights = [
    {
      title: 'Company Policy',
      icon: Building2,
      color: 'bg-blue-500',
      keyPoints: [
        'Professional conduct standards',
        'Working hours: 9 AM - 6 PM',
        'Dress code compliance',
        'IT security guidelines'
      ],
      status: 'active'
    },
    {
      title: 'Leave Policy',
      icon: Calendar,
      color: 'bg-green-500',
      keyPoints: [
        '15-25 days annual leave',
        '12 days sick leave',
        '26 weeks maternity leave',
        '3 days advance notice required'
      ],
      status: 'active'
    },
    {
      title: 'Compensatory Leave',
      icon: Clock,
      color: 'bg-orange-500',
      keyPoints: [
        '1:1 overtime compensation',
        'Weekend work: 1.5x leave',
        'Holiday work: 2x leave',
        '6 months expiry period'
      ],
      status: 'active'
    },
    {
      title: 'EPF Benefits',
      icon: PiggyBank,
      color: 'bg-purple-500',
      keyPoints: [
        '12% employee contribution',
        '12% employer contribution',
        '8.33% EPS contribution',
        'Tax-free returns'
      ],
      status: 'active'
    }
  ];

  const recentUpdates = [
    {
      policy: 'Leave Policy',
      update: 'Updated maternity leave to 26 weeks as per new regulations',
      date: '2024-01-15',
      type: 'update'
    },
    {
      policy: 'EPF Details',
      update: 'Added new EPF withdrawal options for education and medical purposes',
      date: '2024-01-10',
      type: 'new'
    },
    {
      policy: 'Company Policy',
      update: 'Enhanced IT security guidelines and remote work policies',
      date: '2024-01-05',
      type: 'update'
    }
  ];

  const policyStats = [
    { label: 'Total Policies', value: '4', icon: Shield, color: 'text-blue-600' },
    { label: 'Active Policies', value: '4', icon: CheckCircle, color: 'text-green-600' },
    { label: 'Last Updated', value: '15 Jan 2024', icon: TrendingUp, color: 'text-purple-600' },
    { label: 'Compliance Rate', value: '100%', icon: Users, color: 'text-orange-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Policy Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {policyStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-4"
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-lg bg-gray-100`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Policy Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="h-5 w-5 text-blue-500 mr-2" />
            Policy Highlights
          </h3>
          <div className="space-y-4">
            {policyHighlights.map((policy, index) => (
              <motion.div
                key={policy.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border-l-4 border-gray-200 pl-4 hover:border-blue-500 transition-colors"
              >
                <div className="flex items-start">
                  <div className={`p-2 rounded-lg ${policy.color} text-white mr-3`}>
                    <policy.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">{policy.title}</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {policy.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        policy.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {policy.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
            Recent Policy Updates
          </h3>
          <div className="space-y-4">
            {recentUpdates.map((update, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className="font-medium text-gray-900">{update.policy}</span>
                      <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        update.type === 'new' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {update.type === 'new' ? 'New' : 'Updated'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{update.update}</p>
                    <p className="text-xs text-gray-500">{update.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Info className="h-5 w-5 text-purple-500 mr-2" />
          Quick Actions & Resources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
            <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Apply for Leave</h4>
            <p className="text-sm text-gray-600">Submit leave requests and track approvals</p>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
            <Calculator className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Calculate Benefits</h4>
            <p className="text-sm text-gray-600">Use calculators for EPF and leave balance</p>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
            <Shield className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Policy Documents</h4>
            <p className="text-sm text-gray-600">Download and view policy PDFs</p>
          </div>
        </div>
      </div>

      {/* Compliance Alert */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Policy Compliance Reminder</p>
            <p>All employees are required to review and acknowledge company policies annually. Please ensure you have read and understood the latest policy updates.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyDashboard;
