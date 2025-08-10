import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Info } from 'lucide-react';

const EPFCalculator = () => {
  const [formData, setFormData] = useState({
    basicSalary: '',
    da: '',
    specialAllowance: ''
  });

  const [results, setResults] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateEPF = () => {
    const basic = parseFloat(formData.basicSalary) || 0;
    const da = parseFloat(formData.da) || 0;
    const special = parseFloat(formData.da) || 0;
    
    const totalBasic = basic + da + special;
    
    // EPF calculations
    const employeeContribution = totalBasic * 0.12;
    const employerContribution = totalBasic * 0.12;
    const totalEPF = employeeContribution + employerContribution;
    
    // EPS calculations (8.33% of employer's 12%)
    const epsContribution = totalBasic * 0.0833;
    const epfContribution = employerContribution - epsContribution;
    
    // Monthly and yearly totals
    const monthlyEPF = totalEPF;
    const yearlyEPF = monthlyEPF * 12;
    
    setResults({
      totalBasic,
      employeeContribution,
      employerContribution,
      totalEPF,
      epsContribution,
      epfContribution,
      monthlyEPF,
      yearlyEPF
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateEPF();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Calculator className="h-8 w-8 text-purple-500 mr-3" />
        <h3 className="text-xl font-bold text-gray-900">EPF Calculator</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Basic Salary (₹)
            </label>
            <input
              type="number"
              name="basicSalary"
              value={formData.basicSalary}
              onChange={handleInputChange}
              placeholder="50000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dearness Allowance (₹)
            </label>
            <input
              type="number"
              name="da"
              value={formData.da}
              onChange={handleInputChange}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Allowance (₹)
            </label>
            <input
              type="number"
              name="specialAllowance"
              value={formData.specialAllowance}
              onChange={handleInputChange}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors font-medium"
        >
          Calculate EPF
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
              <TrendingUp className="h-5 w-5 text-purple-500 mr-2" />
              EPF Calculation Results
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Basic + DA:</span>
                  <span className="font-semibold">₹{results.totalBasic.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Employee Contribution (12%):</span>
                  <span className="font-semibold text-red-600">₹{results.employeeContribution.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Employer Contribution (12%):</span>
                  <span className="font-semibold text-green-600">₹{results.employerContribution.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Total EPF Contribution:</span>
                  <span className="font-semibold text-blue-600">₹{results.totalEPF.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">EPS Contribution:</span>
                  <span className="font-semibold text-orange-600">₹{results.epsContribution.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">EPF Contribution:</span>
                  <span className="font-semibold text-purple-600">₹{results.epfContribution.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Total:</span>
                  <span className="font-semibold">₹{results.monthlyEPF.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Yearly Total:</span>
                  <span className="font-semibold">₹{results.yearlyEPF.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Important Notes:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>EPF contribution is calculated on Basic + DA + Special Allowance</li>
                  <li>Employee contribution is deducted from salary</li>
                  <li>Employer contribution is additional to your salary</li>
                  <li>EPS provides pension benefits after retirement</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EPFCalculator;
