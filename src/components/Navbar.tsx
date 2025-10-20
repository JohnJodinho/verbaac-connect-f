import { Link, useLocation } from 'react-router-dom';
import { Home, Building, ShoppingBag, Users, FileText, Bell, MessageCircle, Menu, X, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { AnimatedButton, AnimatedIcon } from '../components/animated';
import { useAuth } from '../hooks/useAuth';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Housing', href: '/housing', icon: Building },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
  { name: 'Roommates', href: '/roommates', icon: Users },
  { name: 'Agreements', href: '/agreements', icon: FileText },
];

export function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link to="/" className="text-2xl font-bold text-blue-600">
                  Verbaac Connect
                </Link>
              </motion.div>
            </div>
            
            {/* Navigation Links */}
            <motion.div 
              className="hidden sm:ml-6 sm:flex sm:space-x-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {navigation.map((item, index) => {
                const isActive = location.pathname === item.href;
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      to={item.href}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'border-blue-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <AnimatedIcon hover={!isActive}>
                        <item.icon className="h-4 w-4 mr-2" />
                      </AnimatedIcon>
                      {item.name}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Right side buttons */}
          <motion.div 
            className="hidden sm:ml-6 sm:flex sm:items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isAuthenticated ? (
              <>
                <AnimatedIcon>
                  <Link
                    to="/notifications"
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <Bell className="h-6 w-6" />
                  </Link>
                </AnimatedIcon>
                <AnimatedIcon>
                  <Link
                    to="/messages"
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <MessageCircle className="h-6 w-6" />
                  </Link>
                </AnimatedIcon>
                <div className="flex items-center space-x-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      to="/dashboard"
                      className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <User className="h-4 w-4 mr-1" />
                      {user?.firstName || 'Profile'}
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35 }}
                  >
                    <AnimatedButton size="sm" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-1" />
                      Logout
                    </AnimatedButton>
                  </motion.div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link
                    to="/login"
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Sign in
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  <AnimatedButton size="sm">
                    <Link to="/register">
                      Get started
                    </Link>
                  </AnimatedButton>
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <motion.button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="sm:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                {navigation.map((item, index) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.href}
                        className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <item.icon className="h-5 w-5 mr-3" />
                          {item.name}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
                
                {/* Mobile menu additional items */}
                <div className="border-t border-gray-200 pt-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Link
                      to="/notifications"
                      className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <Bell className="h-5 w-5 mr-3" />
                        Notifications
                      </div>
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Link
                      to="/messages"
                      className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <MessageCircle className="h-5 w-5 mr-3" />
                        Messages
                      </div>
                    </Link>
                  </motion.div>
                </div>
                
                {/* Mobile auth buttons */}
                <div className="border-t border-gray-200 pt-4 pb-3">
                  <div className="flex items-center px-4 space-y-3">
                    <motion.div
                      className="w-full"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <Link
                        to="/login"
                        className="block w-full text-center px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign in
                      </Link>
                    </motion.div>
                  </div>
                  <div className="mt-3 px-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                    >
                      <Link
                        to="/register"
                        className="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Get started
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
