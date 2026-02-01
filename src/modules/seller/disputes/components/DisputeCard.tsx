import { motion } from 'framer-motion';
import { AlertTriangle, Clock, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DisputeDetails, DisputeStatus } from '../../api/seller.service';

interface DisputeCardProps {
  dispute: DisputeDetails;
  onClick: () => void;
}

const STATUS_CONFIG: Record<DisputeStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending: {
    label: 'Under Review',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  resolved_buyer: {
    label: 'Resolved - Buyer',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
  resolved_seller: {
    label: 'Resolved - You',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
};

export default function DisputeCard({ dispute, onClick }: DisputeCardProps) {
  const status = STATUS_CONFIG[dispute.status];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get score color for indicator
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 70) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full bg-card rounded-xl border border-border p-4 text-left transition-colors hover:bg-muted/50 active:bg-muted touch-target"
    >
      <div className="flex items-start gap-3">
        {/* Alert Icon */}
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-medium text-sm text-foreground truncate">
                {dispute.itemTitle}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {dispute.orderRef} · {formatDate(dispute.createdAt)}
              </p>
            </div>
            
            {/* Status Badge */}
            <div className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border flex-shrink-0',
              status.color
            )}>
              {status.icon}
              <span className="hidden sm:inline">{status.label}</span>
            </div>
          </div>

          {/* Reason Preview */}
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {dispute.reason}
          </p>

          {/* AI Score & Actions */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <div className={cn(
                'w-2 h-2 rounded-full',
                getScoreColor(dispute.aiMatchScore)
              )} />
              <span className="text-xs text-muted-foreground">
                AI Match: <span className="font-medium">{dispute.aiMatchScore}%</span>
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </motion.button>
  );
}
