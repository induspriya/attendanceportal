import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Calendar, 
  Clock, 
  PiggyBank, 
  FileText, 
  ChevronRight,
  Download,
  Eye
} from 'lucide-react';
import EPFCalculator from '../components/EPFCalculator';
import LeaveCalculator from '../components/LeaveCalculator';

const Policies = () => {
  const [activeTab, setActiveTab] = useState('company');

  const policyTabs = [
    { id: 'company', name: 'Company Policy', icon: Building2, color: 'bg-blue-500' },
    { id: 'leave', name: 'Leave Policy', icon: Calendar, color: 'bg-green-500' },
    { id: 'compensatory', name: 'Compensatory Leave', icon: Clock, color: 'bg-orange-500' },
    { id: 'epf', name: 'EPF Details', icon: PiggyBank, color: 'bg-purple-500' },
  ];

  const renderPolicyContent = () => {
    switch (activeTab) {
      case 'company':
        return <CompanyPolicy />;
      case 'leave':
        return <LeavePolicy />;
      case 'compensatory':
        return <CompensatoryPolicy />;
      case 'epf':
        return <EPFDetails />;
      default:
        return <CompanyPolicy />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Policies</h1>
        <p className="text-gray-600">Access and review all company policies and guidelines</p>
      </div>

      {/* Policy Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {policyTabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-6 rounded-lg border-2 transition-all duration-200 ${
              activeTab === tab.id
                ? 'border-primary-500 bg-primary-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${tab.color} text-white`}>
                <tab.icon className="h-6 w-6" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900">{tab.name}</h3>
                <p className="text-sm text-gray-500">View details</p>
              </div>
              <ChevronRight className={`h-5 w-5 transition-colors ${
                activeTab === tab.id ? 'text-primary-500' : 'text-gray-400'
              }`} />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Policy Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-lg p-8"
      >
        {renderPolicyContent()}
      </motion.div>
    </div>
  );
};

// Company Policy Component
const CompanyPolicy = () => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center">
        <Building2 className="h-8 w-8 text-blue-500 mr-3" />
        Company Policy
      </h2>
      <div className="flex space-x-2">
        <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
          <Eye className="h-4 w-4 mr-2" />
          View
        </button>
        <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </button>
      </div>
    </div>

    <div className="prose max-w-none">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">1. General Conduct</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li>Maintain professional behavior at all times</li>
        <li>Respect colleagues and maintain a positive work environment</li>
        <li>Follow company dress code and grooming standards</li>
        <li>Maintain confidentiality of company information</li>
      </ul>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">2. Working Hours</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li>Standard working hours: 9:00 AM to 6:00 PM (Monday to Friday)</li>
        <li>Flexible timing available with manager approval</li>
        <li>Overtime compensation for work beyond standard hours</li>
        <li>Weekend work only when required by project deadlines</li>
      </ul>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">3. Attendance & Punctuality</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li>Mark attendance daily using the attendance portal</li>
        <li>Inform manager in case of late arrival or early departure</li>
        <li>Regular attendance is mandatory for all employees</li>
        <li>Absence without prior notice may result in disciplinary action</li>
      </ul>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">4. Code of Ethics</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li>Maintain integrity and honesty in all business dealings</li>
        <li>Avoid conflicts of interest</li>
        <li>Report any unethical behavior to HR department</li>
        <li>Comply with all applicable laws and regulations</li>
      </ul>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">5. IT & Security</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li>Use company resources responsibly</li>
        <li>Maintain strong password security</li>
        <li>Report any security incidents immediately</li>
        <li>No personal use of company equipment during work hours</li>
      </ul>
    </div>
  </div>
);

// Leave Policy Component
const LeavePolicy = () => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center">
        <Calendar className="h-8 w-8 text-green-500 mr-3" />
        Leave Policy
      </h2>
      <div className="flex space-x-2">
        <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
          <Eye className="h-4 w-4 mr-2" />
          View
        </button>
        <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </button>
      </div>
    </div>

    <div className="prose max-w-none">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">1. Annual Leave</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li>New employees: 15 days per year</li>
        <li>After 2 years: 20 days per year</li>
        <li>After 5 years: 25 days per year</li>
        <li>Maximum carry forward: 10 days to next year</li>
      </ul>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">2. Sick Leave</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li>12 days per year with medical certificate</li>
        <li>Immediate family illness: 5 days per year</li>
        <li>Long-term illness: Extended leave with medical approval</li>
        <li>No carry forward of sick leave</li>
      </ul>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">3. Maternity Leave</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li>26 weeks as per government regulations</li>
        <li>Additional 30 days for complications</li>
        <li>Full salary during maternity leave</li>
        <li>Return to work guarantee after leave</li>
      </ul>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">4. Leave Application Process</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li>Submit leave request at least 3 days in advance</li>
        <li>Emergency leave: Inform manager within 24 hours</li>
        <li>Manager approval required for all leave types</li>
        <li>HR approval for leaves longer than 5 days</li>
      </ul>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">5. Leave Without Pay</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li>Maximum 30 days per year</li>
        <li>Requires HR and management approval</li>
        <li>No benefits during unpaid leave</li>
        <li>Service continuity maintained</li>
      </ul>
      
      <div className="mt-8">
        <LeaveCalculator />
      </div>
    </div>
  </div>
);

// Compensatory Leave Policy Component
const CompensatoryPolicy = () => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center">
        <Clock className="h-8 w-8 text-orange-500 mr-3" />
        Compensatory Leave Policy
      </h2>
      <div className="flex space-x-2">
        <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
          <Eye className="h-4 w-4 mr-2" />
          View
        </button>
        <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 transition-colors">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </button>
      </div>
    </div>

    <div className="prose max-w-none">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">1. Eligibility for Compensatory Leave</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li>Work beyond standard 8 hours per day</li>
        <li>Weekend work for critical projects</li>
        <li>Holiday work when business critical</li>
        <li>Travel time beyond normal working hours</li>
      </ul>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">2. Compensatory Leave Calculation</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li>1:1 ratio for overtime hours worked</li>
        <li>Weekend work: 1.5 days compensatory leave</li>
        <li>Holiday work: 2 days compensatory leave</li>
        <li>Travel time: 0.5 day for each 4 hours</li>
      </ul>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">3. Approval Process</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li>Manager approval required for overtime</li>
        <li>HR approval for compensatory leave usage</li>
        <li>Maximum 5 days compensatory leave per month</li>
        <li>Compensatory leave expires after 6 months</li>
      </ul>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">4. Usage Guidelines</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li>Can be combined with regular leave</li>
        <li>Advance notice of 3 days required</li>
        <li>Subject to business requirements</li>
        <li>No cash compensation for unused compensatory leave</li>
      </ul>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">5. Documentation</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li>Timesheet approval by manager</li>
        <li>HR records compensatory leave balance</li>
        <li>Monthly reporting of overtime hours</li>
        <li>Quarterly review of compensatory leave usage</li>
      </ul>
    </div>
  </div>
);

// EPF Details Component
const EPFDetails = () => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center">
        <PiggyBank className="h-8 w-8 text-purple-500 mr-3" />
        Employee Provident Fund (EPF) Details
      </h2>
      <div className="flex space-x-2">
        <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
          <Eye className="h-4 w-4 mr-2" />
          View
        </button>
        <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </button>
      </div>
    </div>

    <div className="prose max-w-none">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">1. EPF Contribution Structure</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li>Employee contribution: 12% of basic salary</li>
        <li>Employer contribution: 12% of basic salary</li>
        <li>Total EPF contribution: 24% of basic salary</li>
        <li>EPS contribution: 8.33% of employer's share</li>
      </ul>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">2. EPF Account Details</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li>EPF account number: Unique 12-digit number</li>
        <li>UAN (Universal Account Number): 12-digit unique identifier</li>
        <li>KYC verification required for account activation</li>
        <li>Nominee details must be updated</li>
      </ul>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">3. EPF Withdrawal Rules</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li>Complete withdrawal: After retirement (58 years)</li>
        <li>Partial withdrawal: For specific purposes (education, marriage, medical)</li>
        <li>Job change: Transfer to new employer's EPF account</li>
        <li>Unemployment: 90 days after job loss</li>
      </ul>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">4. EPF Interest & Returns</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li>Interest rate: Set by EPFO annually</li>
        <li>Interest calculation: Monthly on running balance</li>
        <li>Interest credit: Annually to EPF account</li>
        <li>Tax benefits: EEE (Exempt-Exempt-Exempt) status</li>
      </ul>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">5. EPF Services & Support</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li>EPFO website: www.epfindia.gov.in</li>
        <li>EPF passbook: Download from EPFO portal</li>
        <li>UAN activation: Through EPFO website</li>
        <li>Grievance redressal: EPFO grievance portal</li>
      </ul>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">6. Important Contact Information</h3>
      <div className="bg-gray-50 p-4 rounded-lg">
        <ul className="list-none space-y-2 text-gray-700">
          <li><strong>EPFO Helpline:</strong> 1800-118-005</li>
          <li><strong>EPFO Email:</strong> epf@epfindia.gov.in</li>
          <li><strong>Company HR Contact:</strong> hr@company.com</li>
          <li><strong>EPF Administrator:</strong> admin@company.com</li>
        </ul>
      </div>
      
      <div className="mt-8">
        <EPFCalculator />
      </div>
    </div>
  </div>
);

export default Policies;
