import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCw, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchDisputes, type DisputeDetails } from '../../api/seller.service';
import DisputeCard from '../components/DisputeCard';

export default function DisputeList() {
  const navigate = useNavigate();
  const [disputes, setDisputes] = useState<DisputeDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDisputes();
  }, []);

  const loadDisputes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchDisputes();
      if (response.success) {
        setDisputes(response.data);
      } else {
        setError('Failed to load disputes');
      }
    } catch (err) {
      setError('Failed to load disputes');
      console.error('Error loading disputes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-4 md:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg md:text-xl font-bold text-foreground">Disputes</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Buyer complaints & resolutions
              </p>
            </div>
            <button
              onClick={loadDisputes}
              disabled={isLoading}
              className="p-2 rounded-lg border border-border hover:bg-muted transition-colors touch-target"
            >
              <RefreshCw className={cn('w-5 h-5 text-muted-foreground', isLoading && 'animate-spin')} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 md:px-6 py-4">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load Disputes</h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <button
              onClick={loadDisputes}
              className="px-4 py-2 bg-role-seller text-white rounded-lg font-medium hover:bg-role-seller/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : disputes.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Disputes</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Great news! You have no active disputes. Keep providing accurate listings to maintain your reputation.
            </p>
          </div>
        ) : (
          // Dispute list
          <AnimatePresence mode="popLayout">
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {disputes.map((dispute, index) => (
                <motion.div
                  key={dispute.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <DisputeCard
                    dispute={dispute}
                    onClick={() => navigate(`/dashboard/seller/disputes/${dispute.id}`)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
