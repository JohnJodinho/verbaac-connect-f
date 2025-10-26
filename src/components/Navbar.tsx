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
    setIsMobileMenuOpen(false); // Close menu on logout
  };

  return (
    <nav className="bg-background border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* MODIFICATION: Increased height from h-16 to h-20 (5rem)
        */}
        <div className="flex justify-between items-center h-20">
          
          {/* === 1. Left Section: Logo === */}
          <motion.div
            className="flex-shrink-0 flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center">
              {/* Mobile Logo: SVG */}
              <img 
                src="/verbacc-logo.svg" 
                alt="Verbacc Connect Logo" 
                className="h-8 w-auto sm:hidden"
                onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x40/3ABEFF/FFFFFF?text=V+C&font=poppins')}
              />
              {/* Desktop Logo: Text (themed) */}
              <div className="hidden sm:flex items-baseline text-2xl">
                <span className="font-bold text-primary">verbacc</span>
                <span className="font-medium opacity-90 ml-1">connect</span>
              </div>

            </Link>
          </motion.div>
          
          {/* === 2. Center Section: Desktop Navigation (Pill) === */}
          <motion.div
            className="hidden sm:flex flex-1 justify-center group" // MODIFICATION: Added "group"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } },
              hidden: { opacity: 0, y: -10 }
            }}
          >
            {/* MODIFICATION: 
              - Removed 'shadow-sm'
              - Added 'shadow-none transition-shadow duration-300'
              - Added 'group-hover:shadow-lg group-hover:shadow-primary/30' for themed shadow
            */}
            <div className="flex items-center space-x-1 bg-card border border-border rounded-lg p-1 shadow-none transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-primary/30">
              {navigation.map((item, index) => {
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
                      className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* === 3. Right Section: Auth & Icons === */}
          <motion.div
            className="hidden sm:flex sm:items-center sm:space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isAuthenticated ? (
              <>
                <AnimatedIcon>
                  <Link
                    to="/notifications"
                    className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted"
                  >
                    <Bell className="h-5 w-5" />
                  </Link>
                </AnimatedIcon>
                <AnimatedIcon>
                  <Link
                    to="/messages"
                    className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted"
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

          {/* === 4. Mobile Menu Button === */}
          <div className="sm:hidden flex items-center">
            <motion.button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              whileHover={{ scale: 1.05 }}
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

      {/* === 5. Mobile Menu Panel === */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="sm:hidden border-t border-border bg-background"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item, index) => {
                const isActive = location.pathname === item.href;
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={item.href}
                      className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted hover:border-border'
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
            </div>
            
            {/* --- Mobile Auth Buttons --- */}
            <div className="border-t border-border pt-4 pb-3">
              {isAuthenticated ? (
                <div className="px-4 space-y-3">
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <Link
                      to="/dashboard"
                      className="flex items-center pl-3 pr-4 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5 mr-3" />
                      {user?.firstName || 'Profile'}
                    </Link>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                    <Link
                      to="/notifications"
                      className="flex items-center pl-3 pr-4 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Bell className="h-5 w-5 mr-3" />
                      Notifications
                    </Link>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                    <Link
                      to="/messages"
                      className="flex items-center pl-3 pr-4 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <MessageCircle className="h-5 w-5 mr-3" />
                      Messages
                    </Link>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full pl-3 pr-4 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Logout
                    </button>
                  </motion.div>
                </div>
              ) : (
                <div className="px-4 space-y-3">
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <AnimatedButton variant="primary" size="md" className="w-full">
                      <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                        Get started
                      </Link>
                    </AnimatedButton>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                    <AnimatedButton variant="ghost" size="md" className="w-full">
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        Sign in
                      </Link>
                    </AnimatedButton>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

