import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { PersonaSwitchLog } from '../components/PersonaSwitchLog';
import { TransactionAudit } from '../components/TransactionAudit';

/**
 * Activity Page - Consumer Dashboard
 * 
 * Provides a transparent audit trail of the user's platform history:
 * - Persona Switch Log: Track transitions between roles
 * - Transaction Audit: All escrow transactions with fee breakdowns
 */
export default function ActivityPage() {
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
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Activity Log</h1>
            <p className="text-muted-foreground">
              Track your platform history and transactions
            </p>
          </div>
        </div>
      </motion.div>

      {/* Content Sections */}
      <div className="space-y-6">
        {/* Transaction Audit - Full Width */}
        <TransactionAudit />

        {/* Persona Switch Log */}
        <PersonaSwitchLog />
      </div>
    </div>
  );
}
