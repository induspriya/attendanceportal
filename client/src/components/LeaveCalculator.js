import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Info, TrendingUp } from 'lucide-react';

const LeaveCalculator = () => {
  const [formData, setFormData] = useState({
    yearsOfService: '',
    leaveType: 'annual',
    leavesTaken: '',
    leavesCarriedForward: ''
  });

  const [results, setResults] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateLeaves = () => {
    const years = parseFloat(formData.yearsOfService) || 0;
    const taken = parseFloat(formData.leavesTaken) || 0;
    const carriedForward = parseFloat(formData.leavesCarriedForward) || 0;
    
    let entitlement = 0;
    
    // Calculate annual leave entitlement based on years of service
    if (years < 2) {
      entitlement = 15;
    } else if (years < 5) {
      entitlement = 20;
    } else {
      entitlement = 25;
    }
    
    // Calculate available leaves
    const totalAvailable = entitlement + carriedForward;
    const remainingLeaves = totalAvailable - taken;
    const usedPercentage = (taken / totalAvailable) * 100;
    
    setResults({
      entitlement,
      carriedForward,
      totalAvailable,
      taken,
      remainingLeaves,
      usedPercentage
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateLeaves();
  };

  const getLeaveTypeInfo = () => {
    switch (formData.leaveType) {
      case 'annual':
        return {
          name: 'Annual Leave',
          description: 'Regular vacation and personal time off',
          color: 'text-green-600'
        };
      case 'sick':
        return {
          name: 'Sick Leave',
          description: 'Medical and health-related time off',
          color: 'text-red-600'
        };
      case 'maternity':
        return {
          name: 'Maternity Leave',
          description: 'Pregnancy and childbirth related leave',
          color: 'text-pink-600'
        };
      default:
        return {
          name: 'Annual Leave',
          description: 'Regular vacation and personal time off',
          color: 'text-green-600'
        };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Calendar className="h-8 w-8 text-green-500 mr-3" />
        <h3 className="text-xl font-bold text-gray-900">Leave Balance Calculator</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of Service
            </label>
            <input
              type="number"
              step="0.1"
              name="yearsOfService"
              value={formData.yearsOfService}
              onChange={handleInputChange}
              placeholder="2.5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Leave Type
            </label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="annual">Annual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="maternity">Maternity Leave</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Leaves Taken This Year
            </label>
            <input
              type="number"
              name="leavesTaken"
              value={formData.leavesTaken}
              onChange={handleInputChange}
              placeholder="5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Leaves Carried Forward
            </label>
            <input
              type="number"
              name="leavesCarriedForward"
              value={formData.leavesCarriedForward}
              onChange={handleInputChange}
              placeholder="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
        >
          Calculate Leave Balance
        </button>
      </form>

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
              Leave Balance Results
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Leave Type:</span>
                  <span className={`font-semibold ${getLeaveTypeInfo().color}`}>
                    {getLeaveTypeInfo().name}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Annual Entitlement:</span>
                  <span className="font-semibold">{results.entitlement} days</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Carried Forward:</span>
                  <span className="font-semibold text-blue-600">{results.carriedForward} days</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Available:</span>
                  <span className="font-semibold text-green-600">{results.totalAvailable} days</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Leaves Taken:</span>
                  <span className="font-semibold text-red-600">{results.taken} days</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining Leaves:</span>
                  <span className="font-semibold text-green-600">{results.remainingLeaves} days</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Usage Percentage:</span>
                  <span className="font-semibold">{results.usedPercentage.toFixed(1)}%</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-semibold ${
                    results.remainingLeaves > 10 ? 'text-green-600' : 
                    results.remainingLeaves > 5 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {results.remainingLeaves > 10 ? 'Good' : 
                     results.remainingLeaves > 5 ? 'Moderate' : 'Low'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1">Leave Policy Notes:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Annual leave entitlement increases with years of service</li>
                  <li>Maximum 10 days can be carried forward to next year</li>
                  <li>Apply for leaves at least 3 days in advance</li>
                  <li>Emergency leaves require immediate manager notification</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LeaveCalculator;
