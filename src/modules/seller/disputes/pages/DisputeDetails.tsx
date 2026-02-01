import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  AlertTriangle, 
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Image as ImageIcon,
  Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDisputeDetails, type DisputeDetails, type DisputeStatus } from '../../api/seller.service';
import AIScoreIndicator from '../components/AIScoreIndicator';

const STATUS_CONFIG: Record<DisputeStatus, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  pending: {
    label: 'Under Review',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    icon: <Clock className="w-4 h-4" />,
  },
  resolved_buyer: {
    label: 'Resolved in Buyer Favor',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: <XCircle className="w-4 h-4" />,
  },
  resolved_seller: {
    label: 'Resolved in Your Favor',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-100',
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
};

export default function DisputeDetailsPage() {
  const { disputeId } = useParams<{ disputeId: string }>();
  const navigate = useNavigate();
  
  const [dispute, setDispute] = useState<DisputeDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (disputeId) {
      loadDispute(disputeId);
    }
  }, [disputeId]);

  const loadDispute = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getDisputeDetails(id);
      if (response.success) {
        setDispute(response.data);
      } else {
        setError('Failed to load dispute details');
      }
    } catch (err) {
      setError('Dispute not found');
      console.error('Error loading dispute:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-role-seller border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !dispute) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{error || 'Dispute Not Found'}</h3>
        <button
          onClick={() => navigate('/dashboard/seller/disputes')}
          className="mt-4 px-4 py-2 bg-role-seller text-white rounded-lg font-medium"
        >
          Back to Disputes
        </button>
      </div>
    );
  }

  const status = STATUS_CONFIG[dispute.status];

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard/seller/disputes')}
              className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors touch-target"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-semibold text-foreground truncate">
                Dispute Details
              </h1>
              <p className="text-xs text-muted-foreground">
                {dispute.orderRef}
              </p>
            </div>
            <div className={cn(
              'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
              status.bgColor,
              status.color
            )}>
              {status.icon}
              <span className="hidden sm:inline">{status.label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-6 py-4 space-y-4">
        {/* Item Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <h3 className="font-medium text-sm text-foreground">Disputed Item</h3>
          </div>
          <p className="text-foreground font-medium">{dispute.itemTitle}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Filed on {formatDate(dispute.createdAt)}
          </p>
        </motion.div>

        {/* Buyer's Complaint */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card rounded-xl border border-border p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-medium text-sm text-foreground">Buyer's Complaint</h3>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{dispute.reason}</p>
        </motion.div>

        {/* AI Computer Vision Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border p-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Bot className="w-4 h-4 text-primary" />
            <h3 className="font-medium text-sm text-foreground">AI Analysis</h3>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <AIScoreIndicator score={dispute.aiMatchScore} />
            
            <div className="flex-1 text-center md:text-left">
              <p className="text-sm text-foreground leading-relaxed">
                {dispute.aiAnalysisSummary}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Powered by Verbaac Computer Vision
              </p>
            </div>
          </div>
        </motion.div>

        {/* Buyer Evidence */}
        {dispute.buyerEvidence.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card rounded-xl border border-border p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-medium text-sm text-foreground">
                Buyer's Evidence ({dispute.buyerEvidence.length})
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {dispute.buyerEvidence.map((url, index) => (
                <div
                  key={index}
                  className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(url, '_blank')}
                >
                  <img src={url} alt={`Evidence ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Admin Notes */}
        {dispute.adminNotes && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-primary/5 rounded-xl border border-primary/20 p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-primary" />
              <h3 className="font-medium text-sm text-primary">Admin Review Notes</h3>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {dispute.adminNotes}
            </p>
          </motion.div>
        )}

        {/* Resolution Status */}
        {dispute.status !== 'pending' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className={cn(
              'rounded-xl border p-4',
              dispute.status === 'resolved_seller' 
                ? 'bg-emerald-50 border-emerald-200' 
                : 'bg-red-50 border-red-200'
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              {dispute.status === 'resolved_seller' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <h3 className={cn(
                'font-medium',
                dispute.status === 'resolved_seller' ? 'text-emerald-700' : 'text-red-700'
              )}>
                {dispute.status === 'resolved_seller' 
                  ? 'Case Resolved in Your Favor' 
                  : 'Case Resolved in Buyer Favor'}
              </h3>
            </div>
            {dispute.adminDecision && (
              <p className="text-sm text-foreground">{dispute.adminDecision}</p>
            )}
            {dispute.resolvedAt && (
              <p className="text-xs text-muted-foreground mt-2">
                Resolved on {formatDate(dispute.resolvedAt)}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
