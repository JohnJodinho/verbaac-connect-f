import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { PasswordManagement } from '../components/PasswordManagement';
import { SessionList } from '../components/SessionList';
import { KycStatusCard } from '../components/KycStatusCard';

/**
 * Security Page - Consumer Dashboard
 * 
 * Mobile-first responsive design:
 * - Stacked single-column layout on mobile
 * - Two-column layout on desktop (lg breakpoint)
 */
export default function Security() {
  return (
    <div className="theme-consumer w-full max-w-full">
      {/* Page Header - Compact on mobile */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 md:mb-8"
      >
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Security</h1>
            <p className="text-sm md:text-base text-muted-foreground truncate">
              Password, sessions & account security
            </p>
          </div>
        </div>
      </motion.div>

      {/* Content Sections - Stacked */}
      <div className="space-y-4 md:space-y-6">
        {/* KYC Status - Full Width */}
        <KycStatusCard 
          status="active" 
          verifiedAt={new Date().toISOString()} 
        />

        {/* Single column on mobile, two columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Password Management */}
          <PasswordManagement />

          {/* Active Sessions */}
          <SessionList />
        </div>
      </div>
    </div>
  );
}
