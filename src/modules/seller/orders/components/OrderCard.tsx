import { motion } from 'framer-motion';
import { Package, Truck, MapPin, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SellerOrder, EscrowStatus } from '../../api/seller.service';

interface OrderCardProps {
  order: SellerOrder;
  onClick: () => void;
}

const STATUS_CONFIG: Record<EscrowStatus, { label: string; color: string; icon: React.ReactNode }> = {
  held: {
    label: 'Payment Held',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  released: {
    label: 'Completed',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  disputed: {
    label: 'Disputed',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
  },
};

export default function OrderCard({ order, onClick }: OrderCardProps) {
  const status = STATUS_CONFIG[order.escrowStatus];
  const isRevealed = order.escrowStatus === 'held' || order.escrowStatus === 'released';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Get buyer initials for avatar
  const getBuyerInitials = () => {
    if (!isRevealed) return '?';
    return order.buyerName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full bg-card rounded-xl border border-border p-4 text-left transition-colors hover:bg-muted/50 active:bg-muted touch-target"
    >
      <div className="flex gap-3">
        {/* Item Image or Placeholder */}
        <div className="relative w-16 h-16 md:w-20 md:h-20 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
          {order.itemImageUrl ? (
            <img
              src={order.itemImageUrl}
              alt={order.itemTitle}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
          
          {/* Condition badge */}
          <div className={cn(
            'absolute bottom-1 left-1 text-[10px] font-medium px-1.5 py-0.5 rounded',
            order.itemCondition === 'new' && 'bg-emerald-500 text-white',
            order.itemCondition === 'used' && 'bg-amber-500 text-white',
            order.itemCondition === 'refurbished' && 'bg-blue-500 text-white',
          )}>
            {order.itemCondition.charAt(0).toUpperCase() + order.itemCondition.slice(1)}
          </div>
        </div>

        {/* Order Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-medium text-sm text-foreground truncate">
                {order.itemTitle}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {order.orderRef} · {formatDate(order.createdAt)}
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

          {/* Buyer & Fulfillment */}
          <div className="flex items-center gap-3 mt-2">
            {/* Buyer Avatar */}
            <div className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
              isRevealed ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            )}>
              {getBuyerInitials()}
            </div>
            
            <span className="text-xs text-muted-foreground truncate">
              {isRevealed ? order.buyerName : 'Buyer Hidden'}
            </span>

            {/* Fulfillment Type */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto flex-shrink-0">
              {order.fulfillmentType === 'delivery' ? (
                <>
                  <Truck className="w-3.5 h-3.5" />
                  <span>Delivery</span>
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Pickup</span>
                </>
              )}
            </div>
          </div>

          {/* Amount */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">You receive</span>
            <span className="text-sm font-semibold text-emerald-600">
              {formatCurrency(order.sellerReceives)}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
