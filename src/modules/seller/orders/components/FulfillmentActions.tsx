import { motion } from 'framer-motion';
import { Truck, MapPin, MessageCircle, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SellerOrder, FulfillmentType } from '../../api/seller.service';

interface FulfillmentActionsProps {
  order: SellerOrder;
  onConfirm: () => void;
  onContactBuyer: () => void;
  isConfirming: boolean;
}

/**
 * Fulfillment Actions Component
 * 
 * Full-width action buttons fixed at bottom on mobile
 * - "Confirm Pickup" or "Mark as Delivered" based on fulfillment type
 * - "Contact Buyer" opens in-app chat
 */
export default function FulfillmentActions({ 
  order, 
  onConfirm, 
  onContactBuyer, 
  isConfirming 
}: FulfillmentActionsProps) {
  // Only show fulfillment action if escrow is held and not yet fulfilled
  const canFulfill = order.escrowStatus === 'held' && !order.fulfilledAt;
  const isFulfilled = !!order.fulfilledAt;
  const isReleased = order.escrowStatus === 'released';
  const isDisputed = order.escrowStatus === 'disputed';

  const getActionLabel = (type: FulfillmentType) => {
    if (isFulfilled) return 'Fulfilled ✓';
    if (type === 'pickup') return 'Confirm Pickup';
    return 'Mark as Delivered';
  };

  const getActionIcon = (type: FulfillmentType) => {
    if (isFulfilled) return <Check className="w-5 h-5" />;
    if (isConfirming) return <Loader2 className="w-5 h-5 animate-spin" />;
    if (type === 'pickup') return <MapPin className="w-5 h-5" />;
    return <Truck className="w-5 h-5" />;
  };

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        'fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border',
        'px-4 py-3 pb-safe md:relative md:pb-3 md:border-t-0 md:bg-transparent md:px-0'
      )}
    >
      <div className="flex gap-3 max-w-lg mx-auto md:max-w-none">
        {/* Contact Buyer Button */}
        <button
          onClick={onContactBuyer}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-3.5 md:py-3 rounded-xl font-medium',
            'border border-border bg-card text-foreground',
            'hover:bg-muted active:bg-muted/80 transition-colors touch-target'
          )}
        >
          <MessageCircle className="w-5 h-5" />
          <span>Contact Buyer</span>
        </button>

        {/* Fulfillment Action Button */}
        <button
          onClick={onConfirm}
          disabled={!canFulfill || isConfirming || isFulfilled}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-3.5 md:py-3 rounded-xl font-medium transition-all touch-target',
            // Active state - can fulfill
            canFulfill && !isConfirming && 'bg-role-seller text-white hover:bg-role-seller/90 active:bg-role-seller/80',
            // Fulfilled state
            isFulfilled && 'bg-emerald-500 text-white cursor-not-allowed',
            // Released state
            isReleased && !isFulfilled && 'bg-emerald-100 text-emerald-700 cursor-not-allowed',
            // Disputed state
            isDisputed && 'bg-red-100 text-red-700 cursor-not-allowed',
            // Loading state
            isConfirming && 'bg-role-seller/70 text-white cursor-wait',
            // Default disabled
            !canFulfill && !isFulfilled && !isReleased && !isDisputed && 'bg-muted text-muted-foreground cursor-not-allowed'
          )}
        >
          {getActionIcon(order.fulfillmentType)}
          <span>{getActionLabel(order.fulfillmentType)}</span>
        </button>
      </div>

      {/* Helper text */}
      {isDisputed && (
        <p className="text-center text-xs text-red-600 mt-2">
          This order is under dispute. Contact support for assistance.
        </p>
      )}
      {isFulfilled && !isReleased && (
        <p className="text-center text-xs text-muted-foreground mt-2">
          Awaiting buyer confirmation to release funds.
        </p>
      )}
      {isReleased && (
        <p className="text-center text-xs text-emerald-600 mt-2">
          Funds have been released to your wallet.
        </p>
      )}
    </motion.div>
  );
}
