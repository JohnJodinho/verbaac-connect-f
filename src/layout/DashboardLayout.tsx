import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  User, 
  Shield, 
  Activity, 
  Wallet, 
  Gift,
  LogOut,
  Bell,
  MessageCircle
} from 'lucide-react';
import { AnimatedIcon } from '../components/animated';

const sidebarNavigation = [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Security', href: '/dashboard/security', icon: Shield },
  { name: 'Activity', href: '/dashboard/activity', icon: Activity },
  { name: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
  { name: 'Rewards', href: '/dashboard/rewards', icon: Gift },
];

export function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                Verbaac Connect
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
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
              <AnimatedIcon>
                <button className="text-gray-400 hover:text-gray-500 transition-colors">
                  <LogOut className="h-6 w-6" />
                </button>
              </AnimatedIcon>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <motion.aside 
          className="w-64 min-h-screen bg-white shadow-sm border-r border-gray-200"
          initial={{ x: -250, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <nav className="mt-8 px-4">
            <motion.ul 
              className="space-y-2"
              initial="initial"
              animate="animate"
              variants={{
                initial: {},
                animate: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {sidebarNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <motion.li 
                    key={item.name}
                    variants={{
                      initial: { opacity: 0, x: -20 },
                      animate: { opacity: 1, x: 0 },
                    }}
                  >
                    <Link
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <AnimatedIcon hover={!isActive}>
                        <item.icon
                          className={`mr-3 h-5 w-5 ${
                            isActive
                              ? 'text-blue-500'
                              : 'text-gray-400 group-hover:text-gray-500'
                          }`}
                        />
                      </AnimatedIcon>
                      {item.name}
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>
          </nav>
        </motion.aside>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.main 
            className="flex-1 p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ 
              type: 'spring',
              stiffness: 300,
              damping: 30 
            }}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
