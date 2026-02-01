/**
 * Verification Task Card
 * 
 * Displays a single verification task in the queue with:
 * - Property type and zone
 * - Landlord/Agent name
 * - Priority badge (Normal vs High Priority)
 * - Status indicator
 * - Commission amount
 */

import { motion } from 'framer-motion';
import { 
  Home, 
  MapPin, 
  User, 
  Building2, 
  Clock, 
  AlertCircle,
  BadgeCheck,
  ChevronRight,
  Wallet
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { VerificationTask, VerificationTaskStatus } from '../../api/ambassador.service';

interface VerificationTaskCardProps {
  task: VerificationTask;
  onSelect: (task: VerificationTask) => void;
  index?: number;
}

const STATUS_CONFIG: Record<VerificationTaskStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: 'Pending', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  assigned: { label: 'Assigned', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  in_progress: { label: 'In Progress', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  completed: { label: 'Completed', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  dispute_reverification: { label: 'Re-Verify', color: 'text-red-600', bgColor: 'bg-red-100' },
};

export default function VerificationTaskCard({ task, onSelect, index = 0 }: VerificationTaskCardProps) {
  const status = STATUS_CONFIG[task.status];
  const isHighPriority = task.priority === 'high';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => onSelect(task)}
      className={cn(
        'w-full text-left bg-card rounded-xl border p-4 transition-all touch-target',
        isHighPriority 
          ? 'border-red-200 bg-red-50/30 hover:border-red-300' 
          : 'border-border hover:border-role-ambassador/30 hover:bg-muted/30'
      )}
    >
      {/* High Priority Banner */}
      {isHighPriority && (
        <div className="flex items-center gap-2 text-red-600 mb-3 -mt-1">
          <AlertCircle className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            {task.priorityReason || 'High Priority'}
          </span>
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Property Icon */}
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
          isHighPriority ? 'bg-red-100' : 'bg-role-ambassador/10'
        )}>
          <Home className={cn(
            'w-6 h-6',
            isHighPriority ? 'text-red-600' : 'text-role-ambassador'
          )} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Property Type & Zone */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground truncate">
                {task.propertyType}
              </h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate">{task.zone}</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
          </div>

          {/* Address */}
          <p className="text-sm text-muted-foreground mt-2 truncate">
            {task.streetAddress}
          </p>

          {/* Landlord/Agent */}
          <div className="flex items-center gap-4 mt-2 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <User className="w-3.5 h-3.5" />
              <span className="truncate">{task.landlordName}</span>
            </div>
            {task.agentName && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Building2 className="w-3.5 h-3.5" />
                <span className="truncate">{task.agentName}</span>
              </div>
            )}
          </div>

          {/* Footer: Status, Time, Commission */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center gap-3">
              {/* Status Badge */}
              <span className={cn(
                'inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
                status.bgColor, status.color
              )}>
                <BadgeCheck className="w-3 h-3" />
                {status.label}
              </span>
              
              {/* Time */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{formatDate(task.createdAt)}</span>
              </div>
            </div>

            {/* Commission */}
            <div className="flex items-center gap-1 text-sm font-medium text-role-ambassador">
              <Wallet className="w-3.5 h-3.5" />
              <span>{formatCurrency(task.commissionAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
