import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Building, ShoppingBag, Bell, MessageCircle, Menu, X, User, LogOut, ChevronDown, Plus, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { AnimatedButton, AnimatedIcon } from '../animated';
import { useAuthStore } from '@/store/useAuthStore';
import type { RoleType } from '@/types';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Housing', href: '/housing', icon: Building },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
  // { name: 'Roommates', href: '/roommates', icon: Users },
  // { name: 'Agreements', href: '/agreements', icon: FileText },
];

const ALL_ROLES: { id: RoleType; label: string; icon?: typeof Home; themeColor: string; activeLabel: string; onboardLabel: string }[] = [
  { id: 'consumer', label: 'Student', themeColor: 'text-role-consumer', activeLabel: 'Switch to Student Mode', onboardLabel: 'Student Mode' },
  { id: 'seller', label: 'Seller', icon: Store, themeColor: 'text-role-seller', activeLabel: 'Switch to Seller Mode', onboardLabel: 'Start Selling / List Item' },
  { id: 'landlord', label: 'Landlord', themeColor: 'text-role-landlord', activeLabel: 'Switch to Landlord Mode', onboardLabel: 'List Property' },
  { id: 'agent', label: 'Agent', themeColor: 'text-role-agent', activeLabel: 'Switch to Agent Mode', onboardLabel: 'Become an Agent' },
  { id: 'ambassador', label: 'Ambassador', themeColor: 'text-role-ambassador', activeLabel: 'Switch to Ambassador', onboardLabel: 'Join Ambassadors' },
  { id: 'admin', label: 'Admin', themeColor: 'text-gray-700', activeLabel: 'Switch to Admin', onboardLabel: 'Admin' },
];

// Get role-specific background class
const getRoleBgClass = (roleId: RoleType, isActive: boolean) => {
  const bgMap: Record<RoleType, string> = {
    consumer: isActive ? 'bg-role-consumer/10' : 'hover:bg-role-consumer/5 active:bg-role-consumer/10',
    seller: isActive ? 'bg-role-seller/10' : 'hover:bg-role-seller/5 active:bg-role-seller/10',
    landlord: isActive ? 'bg-role-landlord/10' : 'hover:bg-role-landlord/5 active:bg-role-landlord/10',
    agent: isActive ? 'bg-role-agent/10' : 'hover:bg-role-agent/5 active:bg-role-agent/10',
    ambassador: isActive ? 'bg-role-ambassador/10' : 'hover:bg-role-ambassador/5 active:bg-role-ambassador/10',
    admin: isActive ? 'bg-gray-100' : 'hover:bg-gray-50 active:bg-gray-100',
  };
  return bgMap[roleId] || '';
};

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  
  const { isAuthenticated, user, logout, activeRole, unlockedRoles, setActiveRole } = useAuthStore();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const handleRoleSwitch = (role: RoleType) => {
    if (unlockedRoles.includes(role)) {
      setActiveRole(role);
      setIsRoleMenuOpen(false);
      
      if (role === 'consumer') {
        navigate('/dashboard');
      }  else {
        navigate(`/dashboard/${role}`);
      }
    } else {
      setIsRoleMenuOpen(false);
      
      navigate(`/onboarding/${role}`);
      
    }
  };

  const activeRoleLabel = ALL_ROLES.find(r => r.id === activeRole)?.label || 'Student';

  return (
    <nav className="bg-background border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Mobile: shorter height, Desktop: taller */}
        <div className="flex justify-between items-center h-14 md:h-20">
          
          {/* === 1. Left Section: Logo === */}
          <motion.div
            className="shrink-0 flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center">
              {/* Mobile Logo: SVG */}
              <img 
                src="/verbacc-logo.svg" 
                alt="Verbacc Connect Logo" 
                className="h-8 w-auto md:hidden"
                onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x40/3ABEFF/FFFFFF?text=V+C&font=poppins')}
              />
              {/* Desktop Logo: Text (themed) */}
              <div className="hidden md:flex items-baseline text-2xl">
                <span className="font-bold text-primary">verbacc</span>
                <span className="font-medium opacity-90 ml-1">connect</span>
              </div>
            </Link>
          </motion.div>
          
          {/* === 2. Center Section: Desktop Navigation (Pill) === */}
          <motion.div
            className="hidden md:flex flex-1 justify-center group"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } },
              hidden: { opacity: 0, y: -10 }
            }}
          >
            <div className="flex items-center space-x-1 bg-card border border-border rounded-lg p-1 shadow-none transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-primary/30">
              {navigation.filter(item => {
                if (!isAuthenticated && item.name === 'Roommates') return false;
                return true;
              }).map((item, index) => {
                const isActive = location.pathname === item.href;
                return (
                  <motion.div
                    key={item.name}
                    variants={{
                      hidden: { opacity: 0, y: -10 },
                      visible: { opacity: 1, y: 0, transition: { delay: 0.1 + index * 0.05 } }
                    }}
                  >
                    <Link
                      to={item.href}
                      className={cn(
                        'flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground active:bg-muted'
                      )}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* === 3. Right Section: Auth & Icons (Desktop) === */}
          <motion.div
            className="hidden md:flex md:items-center md:space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isAuthenticated ? (
              <>
                 {/* Role Switcher */}
                <div className="relative mr-2">
                  <AnimatedButton 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 border-primary/20 bg-primary/5 text-primary"
                    onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                  >
                    <span className="font-semibold">{activeRoleLabel} Mode</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isRoleMenuOpen ? 'rotate-180' : ''}`} />
                  </AnimatedButton>

                  <AnimatePresence>
                    {isRoleMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-card ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-border"
                      >
                        <div className="py-1">
                          <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Switch Role
                          </div>
                          {ALL_ROLES.map((role) => {
                            const isUnlocked = unlockedRoles.includes(role.id);
                            const isCurrentActive = activeRole === role.id;
                            
                            if (role.id === 'admin' && !isUnlocked) return null;

                            const displayLabel = isUnlocked ? role.activeLabel : role.onboardLabel;
                            const RoleIcon = role.icon;

                            return (
                              <button
                                key={role.id}
                                onClick={() => handleRoleSwitch(role.id)}
                                className={cn(
                                  'w-full text-left px-4 py-2.5 text-sm flex items-center justify-between group transition-colors',
                                  isCurrentActive 
                                    ? `${getRoleBgClass(role.id, true)} ${role.themeColor} font-medium`
                                    : `text-foreground ${getRoleBgClass(role.id, false)}`
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  {RoleIcon && <RoleIcon className={cn('w-4 h-4', role.themeColor)} />}
                                  <span className={!isUnlocked ? role.themeColor : ''}>{displayLabel}</span>
                                </div>
                                {isUnlocked ? (
                                  isCurrentActive && <div className={cn('w-1.5 h-1.5 rounded-full', `bg-current ${role.themeColor}`)} />
                                ) : (
                                  <Plus className={cn('w-4 h-4', role.themeColor, 'opacity-60 group-hover:opacity-100 transition-opacity')} />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <AnimatedIcon>
                  <Link
                    to="/notifications"
                    className="text-muted-foreground hover:text-foreground active:bg-muted transition-colors p-2 rounded-full hover:bg-muted"
                  >
                    <Bell className="h-5 w-5" />
                  </Link>
                </AnimatedIcon>
                <AnimatedIcon>
                  <Link
                    to="/messages"
                    className="text-muted-foreground hover:text-foreground active:bg-muted transition-colors p-2 rounded-full hover:bg-muted"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </Link>
                </AnimatedIcon>
                <div className="w-px h-6 bg-border mx-2"></div>
                <AnimatedButton variant="ghost" size="sm" >
                  <Link to="/dashboard">
                    <User className="h-4 w-4 mr-2" />
                    {user?.firstName || 'Profile'}
                  </Link>
                </AnimatedButton>
                <AnimatedButton variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </AnimatedButton>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <AnimatedButton variant="ghost" size="sm" >
                  <Link to="/login">
                    Sign in
                  </Link>
                </AnimatedButton>
                <AnimatedButton variant="primary" size="sm" >
                  <Link to="/register">
                    Get started
                  </Link>
                </AnimatedButton>
              </div>
            )}
          </motion.div>

          {/* === 4. Mobile Right Section: Notifications + Menu === */}
          <div className="md:hidden flex items-center gap-1">
            {/* Mobile Quick Icons (when authenticated) */}
            {isAuthenticated && (
              <>
                <Link
                  to="/notifications"
                  className="relative p-2 text-muted-foreground hover:text-foreground active:bg-muted rounded-lg transition-colors touch-target"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                </Link>
              </>
            )}
            
            {/* Mobile Menu Button */}
            <motion.button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted active:bg-muted/80 transition-colors touch-target"
              whileTap={{ scale: 0.95 }}
            >
              <span className="sr-only">Open main menu</span>
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={isMobileMenuOpen ? 'open' : 'closed'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileMenuOpen ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* === 5. Mobile Menu Panel (Full Screen Slide) === */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 top-14 bg-black/20 z-40"
            />
            
            {/* Slide Panel */}
            <motion.div
              className="md:hidden fixed inset-x-0 top-14 bg-background z-50 border-b border-border shadow-lg max-h-[calc(100vh-3.5rem)] overflow-y-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {/* Navigation Links */}
              <div className="py-2">
                {navigation.filter(item => {
                  if (!isAuthenticated && item.name === 'Roommates') return false;
                  return true;
                }).map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        'flex items-center px-4 py-3.5 text-base font-medium transition-colors touch-target',
                        isActive
                          ? 'bg-primary/10 text-primary border-l-4 border-primary'
                          : 'text-foreground hover:bg-muted active:bg-muted/80 border-l-4 border-transparent'
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
              
              {/* Auth Section */}
              <div className="border-t border-border">
                {isAuthenticated ? (
                  <div className="py-3 px-4 space-y-3">
                    {/* Mobile Role Switcher - Horizontal Scroll */}
                    <div className="pb-3 border-b border-border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Switch Mode</p>
                      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
                        {ALL_ROLES.map(role => {
                          if (role.id === 'admin' && !unlockedRoles.includes(role.id)) return null;
                          const isUnlocked = unlockedRoles.includes(role.id);
                          const isActive = activeRole === role.id;
                          
                          return (
                            <button
                              key={role.id}
                              onClick={() => {
                                handleRoleSwitch(role.id);
                                setIsMobileMenuOpen(false);
                              }}
                              className={cn(
                                'shrink-0 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors touch-target',
                                isActive 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-muted text-foreground active:bg-muted/80',
                                !isUnlocked && 'opacity-70'
                              )}
                            >
                              {role.label} {!isUnlocked && '🔒'}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Profile Link */}
                    <Link
                      to="/dashboard"
                      className="flex items-center px-3 py-3 text-base font-medium text-foreground hover:bg-muted active:bg-muted/80 rounded-lg transition-colors touch-target"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5 mr-3" />
                      {user?.firstName || 'Profile'}
                    </Link>
                    
                    {/* Messages Link */}
                    <Link
                      to="/messages"
                      className="flex items-center px-3 py-3 text-base font-medium text-foreground hover:bg-muted active:bg-muted/80 rounded-lg transition-colors touch-target"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <MessageCircle className="h-5 w-5 mr-3" />
                      Messages
                    </Link>
                    
                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-3 text-base font-medium text-destructive hover:bg-destructive/10 active:bg-destructive/20 rounded-lg transition-colors touch-target"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="py-4 px-4 space-y-3">
                    <AnimatedButton variant="primary" size="lg" className="w-full">
                      <Link 
                        to="/register" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-center w-full"
                      >
                        Get started
                      </Link>
                    </AnimatedButton>
                    <AnimatedButton variant="ghost" size="lg" className="w-full">
                      <Link 
                        to="/login" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-center w-full"
                      >
                        Sign in
                      </Link>
                    </AnimatedButton>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
