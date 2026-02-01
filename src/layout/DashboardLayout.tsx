import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
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
  Store,
  Package,
  ShoppingCart,
  Building,
  ClipboardList,
  Users,
  BadgeCheck,
  ChevronDown,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnimatedIcon } from '../components/animated';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { BottomTabBar } from '@/components/navigation/BottomTabBar';

// Consumer/Student navigation (default)
const consumerNavigation = [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Security', href: '/dashboard/security', icon: Shield },
  { name: 'Activity', href: '/dashboard/activity', icon: Activity },
  { name: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
  { name: 'Rewards', href: '/dashboard/rewards', icon: Gift },
];

// Seller navigation
const sellerNavigation = [
  { name: 'Dashboard', href: '/dashboard/seller', icon: Home },
  { name: 'Inventory', href: '/dashboard/seller/inventory', icon: Package },
  { name: 'Orders', href: '/dashboard/seller/orders', icon: ShoppingCart },
  { name: 'Seller Wallet', href: '/dashboard/seller/wallet', icon: Wallet },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
];

// Landlord navigation
const landlordNavigation = [
  { name: 'Dashboard', href: '/dashboard/landlord', icon: Home },
  { name: 'Properties', href: '/dashboard/landlord/properties', icon: Building },
  { name: 'Listings', href: '/dashboard/landlord/listings', icon: ClipboardList },
  { name: 'Tenants', href: '/dashboard/landlord/tenants', icon: Users },
  { name: 'Wallet', href: '/dashboard/landlord/wallet', icon: Wallet },
];

// Agent navigation
const agentNavigation = [
  { name: 'Dashboard', href: '/dashboard/agent', icon: Home },
  { name: 'Portfolio', href: '/dashboard/agent/portfolio', icon: Building },
  { name: 'Clients', href: '/dashboard/agent/clients', icon: Users },
  { name: 'Wallet', href: '/dashboard/agent/wallet', icon: Wallet },
];

// Ambassador navigation
const ambassadorNavigation = [
  { name: 'Dashboard', href: '/dashboard/ambassador', icon: Home },
  { name: 'Verifications', href: '/dashboard/ambassador/verifications', icon: BadgeCheck },
  { name: 'Activity', href: '/dashboard/ambassador/activity', icon: Activity },
  { name: 'Earnings', href: '/dashboard/ambassador/earnings', icon: Wallet },
];

// Get navigation based on active role
const getNavigationForRole = (role: string) => {
  switch (role) {
    case 'seller':
      return sellerNavigation;
    case 'landlord':
      return landlordNavigation;
    case 'agent':
      return agentNavigation;
    case 'ambassador':
      return ambassadorNavigation;
    default:
      return consumerNavigation;
  }
};

// Get role theme class
const getRoleThemeClass = (role: string) => {
  switch (role) {
    case 'seller':
      return 'theme-seller';
    case 'landlord':
      return 'theme-landlord';
    case 'agent':
      return 'theme-agent';
    case 'ambassador':
      return 'theme-ambassador';
    default:
      return 'theme-consumer';
  }
};

// Get role display label
const getRoleLabel = (role: string) => {
  const labels: Record<string, string> = {
    consumer: 'Consumer',
    seller: 'Seller',
    landlord: 'Landlord',
    agent: 'Agent',
    ambassador: 'Ambassador',
    admin: 'Admin',
  };
  return labels[role] || 'Consumer';
};

// Get role icon
const getRoleIcon = (role: string) => {
  switch (role) {
    case 'seller':
      return Store;
    case 'landlord':
      return Building;
    default:
      return User;
  }
};

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  
  const { activeRole, logout, setActiveRole, unlockedRoles } = useAuthStore();

  const navigation = getNavigationForRole(activeRole);
  const themeClass = getRoleThemeClass(activeRole);
  const roleLabel = getRoleLabel(activeRole);
  const RoleIcon = getRoleIcon(activeRole);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const path = location.pathname;
    
    if (path.startsWith('/dashboard/seller')) {
      if (activeRole !== 'seller') setActiveRole('seller');
    } else if (path.startsWith('/dashboard/landlord')) {
      if (activeRole !== 'landlord') setActiveRole('landlord');
    } else if (path.startsWith('/dashboard/agent')) {
      if (activeRole !== 'agent') setActiveRole('agent');
    } else if (path.startsWith('/dashboard/ambassador')) {
      if (activeRole !== 'ambassador') setActiveRole('ambassador');
    } else if (path === '/dashboard' || path.startsWith('/dashboard/profile')) {
      // Default to consumer for standard dashboard paths
      if (activeRole !== 'consumer') setActiveRole('consumer');
    }
  }, [location.pathname, activeRole, setActiveRole]);

  // Simplify your role switcher logic
  const handleRoleSwitch = (role: string) => {
    setIsRoleSwitcherOpen(false);
    
    if (unlockedRoles.includes(role as any)) {
      // Navigate first; the useEffect above will handle setting the role state
      const targetPath = role === 'consumer' ? '/dashboard' : `/dashboard/${role}`;
      navigate(targetPath);
    } else {
      navigate(`/${role}/onboarding`);
    }
  };

  return (
    <div 
      className={cn(
        // Viewport locking - prevent horizontal scroll
        'h-screen flex flex-col max-w-screen overflow-x-hidden',
        'bg-gray-50',
        themeClass
      )}
    >
      {/* Fixed Header */}
      <nav className="flex-none bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-center h-14 md:h-16">
            {/* Logo - Simplified on mobile */}
            <Link to="/" className="flex items-center shrink-0">
              <span className="text-xl md:text-2xl font-bold text-primary">Verbacc</span>
              <span className="sm:inline ml-1 text-xl md:text-2xl font-medium opacity-90">Connect</span>
            </Link>

            {/* Right Section */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Role Badge - Compact on mobile */}
              {activeRole !== 'consumer' && activeRole !== 'guest' && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20"
                >
                  <RoleIcon className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-semibold text-primary">
                    {roleLabel}
                  </span>
                </motion.div>
              )}

              {/* Role Switcher - Mobile Friendly */}
              <div className="relative">
                <button
                  onClick={() => setIsRoleSwitcherOpen(!isRoleSwitcherOpen)}
                  className="flex items-center gap-1 px-2 py-1.5 md:px-3 md:py-2 rounded-lg bg-primary/5 border border-primary/20 text-primary touch-target"
                >
                  <RoleIcon className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">{roleLabel}</span>
                  <ChevronDown className={cn(
                    'w-4 h-4 transition-transform',
                    isRoleSwitcherOpen && 'rotate-180'
                  )} />
                </button>

                <AnimatePresence>
                  {isRoleSwitcherOpen && (
                    <>
                      {/* Backdrop for mobile */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsRoleSwitcherOpen(false)}
                        className="fixed inset-0 z-40 bg-black/20 md:hidden"
                      />
                      
                      {/* Dropdown Menu */}
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className={cn(
                          'absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black/5 z-50 border border-gray-100',
                          'md:w-48'
                        )}
                      >
                        <div className="py-2">
                          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                            Switch Mode
                          </div>
                          {['consumer', 'seller', 'landlord', 'agent'].map((role) => {
                            const isUnlocked = unlockedRoles.includes(role as any);
                            const isActive = activeRole === role;
                            const Icon = getRoleIcon(role);
                            
                            return (
                              <button
                                key={role}
                                onClick={() => handleRoleSwitch(role)}
                                className={cn(
                                  'w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors touch-target',
                                  isActive 
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                                )}
                              >
                                <Icon className="w-4 h-4" />
                                <span>{getRoleLabel(role)}</span>
                                {!isUnlocked && (
                                  <span className="ml-auto text-xs text-gray-400">+ Add</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Notifications */}
              <AnimatedIcon>
                <Link
                  to="/notifications"
                  className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors touch-target"
                >
                  <Bell className="w-5 h-5" />
                  {/* Notification badge */}
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </Link>
              </AnimatedIcon>

              {/* Logout - Hidden on mobile (in profile) */}
              <button 
                onClick={handleLogout}
                className="hidden md:flex p-2 text-gray-400 hover:text-gray-500 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content Area - fills remaining space */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar - Hidden on mobile */}
        {!isMobile && (
          <motion.aside 
            className="w-64 bg-white shadow-sm border-r border-gray-200 overflow-y-auto"
            initial={{ x: -250, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Role Indicator in Sidebar */}
            <div className="px-4 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <RoleIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{roleLabel} Dashboard</p>
                  <p className="text-xs text-gray-500">Manage your {roleLabel.toLowerCase()} activities</p>
                </div>
              </div>
            </div>

            <nav className="mt-4 px-4 pb-20">
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
                {navigation.map((item) => {
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
                        className={cn(
                          'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )}
                      >
                        <AnimatedIcon hover={!isActive}>
                          <item.icon
                            className={cn(
                              'mr-3 h-5 w-5',
                              isActive
                                ? 'text-primary'
                                : 'text-gray-400 group-hover:text-gray-500'
                            )}
                          />
                        </AnimatedIcon>
                        {item.name}
                      </Link>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </nav>

            {/* Back to Consumer Mode link for non-consumer roles */}
            {activeRole !== 'consumer' && activeRole !== 'guest' && (
              <div className="absolute bottom-4 left-4 right-4">
                <Link
                  to="/dashboard"
                  onClick={() => setActiveRole('consumer')}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Back to Consumer Mode
                </Link>
              </div>
            )}
          </motion.aside>
        )}

        {/* Main Content - Independent Scroll */}
        <main 
          className={cn(
            'flex-1 overflow-y-auto overflow-x-hidden',
            'p-4 md:p-6 lg:p-8',
            // Bottom padding for mobile bottom bar + safe area
            isMobile && 'pb-24'
          )}
        >
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Mobile Bottom Tab Bar - Fixed at bottom */}
      {isMobile && <BottomTabBar />}
    </div>
  );
}

