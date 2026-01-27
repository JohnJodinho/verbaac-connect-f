import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { PasswordManagement } from '../components/PasswordManagement';
import { SessionList } from '../components/SessionList';
import { KycStatusCard } from '../components/KycStatusCard';

/**
 * Security Page - Consumer Dashboard
 * 
 * Focuses on legal identity and account protection:
 * - Password Management with Zod validation
 * - Active Sessions list with device/location tracking
 * - KYC Status display
 */
export default function Security() {
  return (
    <div className="theme-consumer min-h-screen">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Security Settings</h1>
            <p className="text-muted-foreground">
              Manage your password, sessions, and account security
            </p>
          </div>
        </div>
      </motion.div>

      {/* Content Sections */}
      <div className="space-y-6">
        {/* KYC Status - Full Width */}
        <KycStatusCard 
          status="active" 
          verifiedAt={new Date().toISOString()} 
        />

        {/* Two Column Layout for Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Password Management */}
          <PasswordManagement />

          {/* Active Sessions */}
          <SessionList />
        </div>
      </div>
    </div>
  );
}
