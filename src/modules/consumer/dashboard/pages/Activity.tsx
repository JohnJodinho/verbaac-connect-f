import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { PersonaSwitchLog } from '../components/PersonaSwitchLog';
import { TransactionAudit } from '../components/TransactionAudit';

/**
 * Activity Page - Consumer Dashboard
 * 
 * Mobile-first responsive design:
 * - Compact header on mobile
 * - Stacked single-column layout
 * - Activity lists with word-break for long text
 */
export default function ActivityPage() {
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
            <Activity className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Activity Log</h1>
            <p className="text-sm md:text-base text-muted-foreground truncate">
              Track your platform history and transactions
            </p>
          </div>
        </div>
      </motion.div>

      {/* Content Sections - Full width, stacked */}
      <div className="space-y-4 md:space-y-6 w-full max-w-full">
        {/* Transaction Audit - Full Width */}
        <TransactionAudit />

        {/* Persona Switch Log */}
        <PersonaSwitchLog />
      </div>
    </div>
  );
}

