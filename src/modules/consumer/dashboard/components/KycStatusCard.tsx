import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX, 
  Calendar, 
  ExternalLink 
} from 'lucide-react';

type KycStatus = 'active' | 'deactivated' | 'banned';

interface KycStatusCardProps {
  status?: KycStatus;
  verifiedAt?: string;
  reason?: string;
}

const statusConfig: Record<KycStatus, {
  icon: typeof ShieldCheck;
  label: string;
  description: string;
  bgColor: string;
  iconBg: string;
  iconColor: string;
  badgeColor: string;
}> = {
  active: {
    icon: ShieldCheck,
    label: 'Verified',
    description: 'Your identity has been verified. You have full access to all features.',
    bgColor: 'bg-emerald-50 border-emerald-200',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    badgeColor: 'bg-emerald-500 text-white',
  },
  deactivated: {
    icon: ShieldAlert,
    label: 'Pending Verification',
    description: 'Your account is pending verification. Some features may be limited.',
    bgColor: 'bg-amber-50 border-amber-200',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    badgeColor: 'bg-amber-500 text-white',
  },
  banned: {
    icon: ShieldX,
    label: 'Suspended',
    description: 'Your account has been suspended. Please contact support for assistance.',
    bgColor: 'bg-red-50 border-red-200',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    badgeColor: 'bg-red-500 text-white',
  },
};

/**
 * KYC Status Card Component
 * Displays the user's identity verification status from the users table.
 */
export function KycStatusCard({ 
  status = 'active', 
  verifiedAt,
  reason 
}: KycStatusCardProps) {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`rounded-xl border p-6 ${config.bgColor}`}
    >
      <div className="flex items-start gap-4">
        {/* Status Icon */}
        <div className={`w-12 h-12 rounded-xl ${config.iconBg} flex items-center justify-center flex-shrink-0`}>
          <StatusIcon className={`w-6 h-6 ${config.iconColor}`} />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-foreground">Identity Status</h3>
            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${config.badgeColor}`}>
              {config.label}
            </span>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            {config.description}
          </p>

          {/* Additional Info */}
          <div className="space-y-2">
            {status === 'active' && verifiedAt && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Verified on {formatDate(verifiedAt)}</span>
              </div>
            )}

            {status === 'banned' && reason && (
              <div className="p-3 bg-red-100/50 rounded-lg">
                <p className="text-sm text-red-700">
                  <strong>Reason:</strong> {reason}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              {status === 'deactivated' && (
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground 
                                   text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors">
                  Complete Verification
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}

              {status === 'banned' && (
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-foreground 
                                   text-sm font-medium rounded-lg hover:bg-muted/80 transition-colors">
                  Contact Support
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}

              {status === 'active' && (
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-foreground 
                                   text-sm font-medium rounded-lg hover:bg-muted/80 transition-colors">
                  View Verification Details
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
