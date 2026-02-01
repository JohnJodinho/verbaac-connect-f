import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Building, 
  ShoppingBag, 
  Users, 
  User, 
  Package, 
  ShoppingCart, 
  ClipboardList,
  BadgeCheck,
  Activity,
  type LucideIcon, 
  Shield,
  Wallet,
  Gift
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import type  { RoleType } from '@/types';

interface TabItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

// Role-specific tab configurations
const TAB_CONFIGS: Record<RoleType | 'guest', TabItem[]> = {
  // Consumer/Student: Housing search, Marketplace, Roommates
  consumer: [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Security', href: '/dashboard/security', icon: Shield },
  { name: 'Activity', href: '/dashboard/activity', icon: Activity },
  { name: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
  { name: 'Rewards', href: '/dashboard/rewards', icon: Gift },
  ],
  // Seller: Inventory management, Orders, Wallet
  seller: [
    { name: 'Dashboard', href: '/dashboard/seller', icon: Home },
    { name: 'Inventory', href: '/dashboard/seller/inventory', icon: Package },
    { name: 'Orders', href: '/dashboard/seller/orders', icon: ShoppingCart },
    { name: 'Wallet', href: '/dashboard/seller/wallet', icon: Wallet },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ],
  // Landlord: Properties, Listings, Tenants
  landlord: [
    { name: 'Dashboard', href: '/dashboard/landlord', icon: Home },
    { name: 'Properties', href: '/dashboard/landlord/properties', icon: Building },
    { name: 'Listings', href: '/dashboard/landlord/listings', icon: ClipboardList },
    { name: 'Tenants', href: '/dashboard/landlord/tenants', icon: Users },
    { name: 'Wallet', href: '/dashboard/landlord/wallet', icon: Wallet },
  ],
  // Agent: Portfolio, Clients, Wallet
  agent: [
    { name: 'Dashboard', href: '/dashboard/agent', icon: Home },
    { name: 'Portfolio', href: '/dashboard/agent/portfolio', icon: Building },
    { name: 'Clients', href: '/dashboard/agent/clients', icon: Users },
    { name: 'Wallet', href: '/dashboard/agent/wallet', icon: Wallet },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ],
  // Ambassador: Verifications, Activity, Earnings
  ambassador: [
    { name: 'Dashboard', href: '/dashboard/ambassador', icon: Home },
    { name: 'Verify', href: '/dashboard/ambassador/verifications', icon: BadgeCheck },
    { name: 'Activity', href: '/dashboard/ambassador/activity', icon: Activity },
    { name: 'Earnings', href: '/dashboard/ambassador/earnings', icon: Wallet },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ],
  // Admin: Limited mobile support, redirect to desktop
  admin: [
    { name: 'Dashboard', href: '/dashboard/admin', icon: Home },
    { name: 'Users', href: '/dashboard/admin/users', icon: Users },
    { name: 'Reports', href: '/dashboard/admin/reports', icon: ClipboardList },
    { name: 'Wallet', href: '/dashboard/admin/wallet', icon: Wallet },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ],
  // Guest: Basic navigation
  guest: [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Housing', href: '/housing', icon: Building },
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
    { name: 'Login', href: '/login', icon: User },
  ],
};

/**
 * BottomTabBar Component
 * 
 * Role-aware floating bottom navigation for mobile screens.
 * Features:
 * - Dynamic tabs based on activeRole
 * - Glassmorphism background
 * - 44x44px minimum touch targets
 * - Active tab indicator with role theme color
 * - Safe area inset for iPhone X+
 * - Smooth Framer Motion transitions
 */
export function BottomTabBar() {
  const location = useLocation();
  const { activeRole } = useAuthStore();

  // Get tabs for current role
  const tabs = TAB_CONFIGS[activeRole] || TAB_CONFIGS.consumer;

  // Check if current path matches the tab's href
  const isActive = (href: string) => {
    // Exact match for dashboard roots
    if (href === '/dashboard' || href === '/dashboard/seller' || 
        href === '/dashboard/landlord' || href === '/dashboard/agent' || 
        href === '/dashboard/ambassador' || href === '/dashboard/admin') {
      return location.pathname === href || location.pathname === `${href}/`;
    }
    // Prefix match for subroutes
    return location.pathname.startsWith(href);
  };

  // Get role-specific accent color class
  const getActiveColor = () => {
    switch (activeRole) {
      case 'seller':
        return 'text-role-seller';
      case 'landlord':
        return 'text-role-landlord';
      case 'agent':
        return 'text-role-agent';
      case 'ambassador':
        return 'text-role-ambassador';
      case 'admin':
        return 'text-role-admin';
      default:
        return 'text-role-consumer';
    }
  };

  const activeColorClass = getActiveColor();

  return (
  <motion.nav
    key={activeRole} // Force remount on role change for clean animation
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    className={cn(
      'fixed bottom-0 inset-x-0 w-screen z-50',
      'md:hidden' // Only show on mobile
    )}
  >
    {/* Glassmorphism Background */}
    <div className="absolute inset-0 bg-white/80 backdrop-blur-lg border-t border-gray-200/50 shadow-lg" />
    
    {/* Tab Container */}
    <div 
      className="relative flex w-full items-stretch" // Changed to items-stretch for full-height hit areas
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {tabs.map((tab) => {
        const active = isActive(tab.href);
        
        return (
          <Link
            key={tab.name}
            to={tab.href}
            className={cn(
              'relative flex flex-1 flex-col items-center justify-center', // 'flex-1' forces tabs to share width equally
              'min-h-16 py-2 px-1', // Increased min-height for better thumb reach
              'touch-target transition-colors duration-200'
            )}
          >
            {/* Active Indicator Background */}
            <AnimatePresence>
              {active && (
                <motion.div
                  layoutId={`activeTab-${activeRole}`}
                  className="absolute inset-x-2 inset-y-1 rounded-xl bg-primary/10" // Matches role-based primary color
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </AnimatePresence>

            {/* Icon & Label remain centered within the flex-1 cell */}
            <motion.div whileTap={{ scale: 0.9 }} className="relative z-10">
              <tab.icon 
                className={cn(
                  'w-5 h-5 transition-colors duration-200',
                  active ? activeColorClass : 'text-gray-400'
                )}
                strokeWidth={active ? 2.5 : 2}
              />
            </motion.div>

            <span className={cn(
              'text-[10px] font-medium mt-1 truncate w-full text-center relative z-10', // Truncate prevents layout breaks
              active ? activeColorClass : 'text-gray-500'
            )}>
              {tab.name}
            </span>
          </Link>
        );
      })}
    </div>
  </motion.nav>
);
}

export default BottomTabBar;
