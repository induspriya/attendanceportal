import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Clock, 
  Calendar, 
  FileText, 
  Users, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  User,
  Bell
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Attendance', href: '/attendance', icon: Clock },
    { name: 'Leaves', href: '/leaves', icon: Calendar },
    { name: 'Holidays', href: '/holidays', icon: Calendar },
    { name: 'News', href: '/news', icon: FileText },
    { name: 'Policies', href: '/policies', icon: FileText },
  ];

  const managerNavigation = [
    { name: 'Manager Approvals', href: '/manager/leaves', icon: Calendar },
  ];

  const hrNavigation = [
    { name: 'HR Dashboard', href: '/hr', icon: Users },
    { name: 'HR Approvals', href: '/hr/leaves', icon: Calendar },
  ];

  const adminNavigation = [
    { name: 'Admin Dashboard', href: '/admin', icon: Settings },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Leave Requests', href: '/admin/leaves', icon: Calendar },
    { name: 'Holidays', href: '/admin/holidays', icon: Calendar },
    { name: 'News', href: '/admin/news', icon: FileText },
    { name: 'Administration', href: '/administration', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold text-gray-900">Attendance Portal</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <motion.button
                key={item.name}
                onClick={() => {
                  navigate(item.href);
                  setSidebarOpen(false);
                }}
                className={`group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary-100 text-primary-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </motion.button>
            ))}
            {user?.role === 'admin' && (
              <>
                <div className="pt-4 pb-2">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Admin
                  </h3>
                </div>
                {adminNavigation.map((item) => (
                  <motion.button
                    key={item.name}
                    onClick={() => {
                      navigate(item.href);
                      setSidebarOpen(false);
                    }}
                    className={`group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </motion.button>
                ))}
              </>
            )}
            {user?.role === 'manager' && (
              <>
                <div className="pt-4 pb-2">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Manager
                  </h3>
                </div>
                {managerNavigation.map((item) => (
                  <motion.button
                    key={item.name}
                    onClick={() => {
                      navigate(item.href);
                      setSidebarOpen(false);
                    }}
                    className={`group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </motion.button>
                ))}
              </>
            )}
            {user?.role === 'hr' && (
              <>
                <div className="pt-4 pb-2">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    HR
                  </h3>
                </div>
                {hrNavigation.map((item) => (
                  <motion.button
                    key={item.name}
                    onClick={() => {
                      navigate(item.href);
                      setSidebarOpen(false);
                    }}
                    className={`group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </motion.button>
                ))}
              </>
            )}
            <div className="pt-4">
              <motion.button
                onClick={handleLogout}
                className="group flex w-full items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </motion.button>
            </div>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white pt-5 pb-4 overflow-y-auto shadow-lg">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-gray-900">Attendance Portal</h1>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <motion.button
                key={item.name}
                onClick={() => navigate(item.href)}
                className={`group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary-100 text-primary-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </motion.button>
            ))}
            {user?.role === 'admin' && (
              <>
                <div className="pt-4 pb-2">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Admin
                  </h3>
                </div>
                {adminNavigation.map((item) => (
                  <motion.button
                    key={item.name}
                    onClick={() => navigate(item.href)}
                    className={`group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </motion.button>
                ))}
              </>
            )}
            {user?.role === 'manager' && (
              <>
                <div className="pt-4 pb-2">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Manager
                  </h3>
                </div>
                {managerNavigation.map((item) => (
                  <motion.button
                    key={item.name}
                    onClick={() => navigate(item.href)}
                    className={`group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </motion.button>
                ))}
              </>
            )}
            {user?.role === 'hr' && (
              <>
                <div className="pt-4 pb-2">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    HR
                  </h3>
                </div>
                {hrNavigation.map((item) => (
                  <motion.button
                    key={item.name}
                    onClick={() => navigate(item.href)}
                    className={`group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </motion.button>
                ))}
              </>
            )}
            <div className="pt-4">
              <motion.button
                onClick={handleLogout}
                className="group flex w-full items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </motion.button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow-sm border-b border-gray-200">
          <button
            type="button"
            className="lg:hidden px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-lg font-medium text-gray-900">
                {(() => {
                  // Debug logging for page title
                  const currentPath = location.pathname;
                  console.log('🔍 Layout: Current path:', currentPath);
                  
                  // Check each navigation array for the current path
                  const navItem = navigation.find(item => item.href === currentPath);
                  const adminItem = adminNavigation.find(item => item.href === currentPath);
                  const managerItem = managerNavigation.find(item => item.href === currentPath);
                  const hrItem = hrNavigation.find(item => item.href === currentPath);
                  
                  console.log('🔍 Layout: Navigation matches:', { navItem, adminItem, managerItem, hrItem });
                  
                  if (hrItem) {
                    console.log('🔍 Layout: HR page detected:', hrItem.name);
                    return hrItem.name;
                  } else if (adminItem) {
                    console.log('🔍 Layout: Admin page detected:', adminItem.name);
                    return adminItem.name;
                  } else if (managerItem) {
                    console.log('🔍 Layout: Manager page detected:', managerItem.name);
                    return managerItem.name;
                  } else if (navItem) {
                    console.log('🔍 Layout: Regular page detected:', navItem.name);
                    return navItem.name;
                  } else {
                    console.log('🔍 Layout: No page match found, using default');
                    return 'Dashboard';
                  }
                })()}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 