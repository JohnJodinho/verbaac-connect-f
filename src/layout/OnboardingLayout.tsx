import { Link, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

/**
 * OnboardingLayout - A focused, full-screen layout for role onboarding flows.
 * 
 * Features:
 * - Mobile-first responsive design
 * - Minimalist header with logo and exit button
 * - Centered content area for the onboarding wizard
 * - Uses role theme colors for accents
 */
export function OnboardingLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* Minimalist Header - Shorter on mobile */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-baseline text-lg md:text-xl">
              <span className="font-bold text-primary">verbacc</span>
              <span className="font-medium opacity-90 ml-1">connect</span>
            </Link>

            {/* Exit to Dashboard */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 md:gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground active:text-foreground/80 transition-colors rounded-lg hover:bg-muted active:bg-muted/80 touch-target"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Exit to Dashboard</span>
                <span className="sm:hidden">Exit</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content - Full-width on mobile */}
      <main className="pt-14 md:pt-16 min-h-screen flex items-start md:items-center justify-center">
        <div className="w-full max-w-lg px-4 py-6 md:py-8">
          <Outlet />
        </div>
      </main>

      {/* Decorative Background Elements - Smaller on mobile */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Top-right gradient blob */}
        <div 
          className="absolute -top-20 -right-20 md:-top-40 md:-right-40 w-48 h-48 md:w-96 md:h-96 rounded-full opacity-20"
          style={{ 
            background: 'radial-gradient(circle, var(--role-seller) 0%, transparent 70%)' 
          }}
        />
        {/* Bottom-left gradient blob */}
        <div 
          className="absolute -bottom-16 -left-16 md:-bottom-32 md:-left-32 w-40 h-40 md:w-80 md:h-80 rounded-full opacity-15"
          style={{ 
            background: 'radial-gradient(circle, var(--role-seller) 0%, transparent 70%)' 
          }}
        />
      </div>
    </div>
  );
}

export default OnboardingLayout;
