import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Package, 
  User, 
  MapPin, 
  Truck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Wallet
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  getOrderDetails, 
  confirmFulfillment,
  type SellerOrder, 
  type EscrowStatus 
} from '../../api/seller.service';
import PrivacyGate from '../components/PrivacyGate';
import FulfillmentActions from '../components/FulfillmentActions';

const STATUS_CONFIG: Record<EscrowStatus, { label: string; color: string; bgColor: string }> = {
  held: {
    label: 'Payment Secured',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
  },
  released: {
    label: 'Funds Released',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-100',
  },
  disputed: {
    label: 'Under Dispute',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
  },
};

export default function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<SellerOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (orderId) {
      loadOrder(orderId);
    }
  }, [orderId]);

  const loadOrder = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getOrderDetails(id);
      if (response.success) {
        setOrder(response.data);
      } else {
        setError('Failed to load order details');
      }
    } catch (err) {
      setError('Order not found');
      console.error('Error loading order:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmFulfillment = async () => {
    if (!order) return;
    
    setIsConfirming(true);
    try {
      const response = await confirmFulfillment(order.id);
      if (response.success) {
        setOrder(response.data);
      }
    } catch (err) {
      console.error('Error confirming fulfillment:', err);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleContactBuyer = () => {
    // Navigate to chat with order context
    navigate(`/messages?context=order:${orderId}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-role-seller border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{error || 'Order Not Found'}</h3>
        <button
          onClick={() => navigate('/dashboard/seller/orders')}
          className="mt-4 px-4 py-2 bg-role-seller text-white rounded-lg font-medium"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const status = STATUS_CONFIG[order.escrowStatus];
  const isRevealed = order.escrowStatus === 'held' || order.escrowStatus === 'released';

  return (
    <div className="pb-24 md:pb-4">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard/seller/orders')}
              className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors touch-target"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-semibold text-foreground truncate">
                {order.orderRef}
              </h1>
              <p className="text-xs text-muted-foreground">
                {formatDate(order.createdAt)}
              </p>
            </div>
            <div className={cn(
              'px-2.5 py-1 rounded-full text-xs font-medium',
              status.bgColor,
              status.color
            )}>
              {status.label}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-6 py-4 space-y-4">
        {/* Item Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-4"
        >
          <div className="flex gap-3">
            <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
              {order.itemImageUrl ? (
                <img
                  src={order.itemImageUrl}
                  alt={order.itemTitle}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Package className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground">{order.itemTitle}</h3>
              <div className={cn(
                'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1',
                order.itemCondition === 'new' && 'bg-emerald-100 text-emerald-700',
                order.itemCondition === 'used' && 'bg-amber-100 text-amber-700',
                order.itemCondition === 'refurbished' && 'bg-blue-100 text-blue-700',
              )}>
                {order.itemCondition.charAt(0).toUpperCase() + order.itemCondition.slice(1)}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Buyer Information - Privacy Gated */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card rounded-xl border border-border p-4 space-y-3"
        >
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-medium text-sm text-foreground">Buyer Information</h3>
            {!isRevealed && (
              <span className="ml-auto text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                Awaiting Payment
              </span>
            )}
          </div>

          <div className="space-y-2">
            <div>
              <label className="text-xs text-muted-foreground">Name</label>
              <PrivacyGate
                escrowStatus={order.escrowStatus}
                field="name"
                value={order.buyerName}
                className="mt-1"
              />
            </div>

            {order.fulfillmentType === 'delivery' && (
              <div>
                <label className="text-xs text-muted-foreground">Shipping Address</label>
                <PrivacyGate
                  escrowStatus={order.escrowStatus}
                  field="address"
                  value={order.buyerAddress}
                  className="mt-1"
                />
              </div>
            )}

            <div>
              <label className="text-xs text-muted-foreground">Phone Number</label>
              <PrivacyGate
                escrowStatus={order.escrowStatus}
                field="phone"
                value={order.buyerPhone}
                className="mt-1"
              />
            </div>
          </div>
        </motion.div>

        {/* Fulfillment Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            {order.fulfillmentType === 'delivery' ? (
              <Truck className="w-4 h-4 text-muted-foreground" />
            ) : (
              <MapPin className="w-4 h-4 text-muted-foreground" />
            )}
            <h3 className="font-medium text-sm text-foreground">
              {order.fulfillmentType === 'delivery' ? 'Delivery Details' : 'Pickup Details'}
            </h3>
          </div>

          {order.fulfillmentType === 'pickup' && order.pickupLandmark && (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm text-foreground">{order.pickupLandmark}</p>
            </div>
          )}

          {order.fulfillmentType === 'delivery' && isRevealed && order.buyerAddress && (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm text-foreground">{order.buyerAddress}</p>
            </div>
          )}
        </motion.div>

        {/* Order Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-xl border border-border p-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-medium text-sm text-foreground">Order Timeline</h3>
          </div>

          <div className="space-y-3">
            {/* Created */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Order Created</p>
                <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
              </div>
            </div>

            {/* Paid */}
            {order.paidAt && (
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Payment Secured</p>
                  <p className="text-xs text-muted-foreground">{formatDate(order.paidAt)}</p>
                </div>
              </div>
            )}

            {/* Fulfilled */}
            {order.fulfilledAt ? (
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {order.fulfillmentType === 'delivery' ? 'Delivered' : 'Picked Up'}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDate(order.fulfilledAt)}</p>
                </div>
              </div>
            ) : order.escrowStatus === 'held' && (
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-700">Awaiting Fulfillment</p>
                  <p className="text-xs text-muted-foreground">Confirm when item is handed over</p>
                </div>
              </div>
            )}

            {/* Released */}
            {order.releasedAt && (
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Funds Released</p>
                  <p className="text-xs text-muted-foreground">{formatDate(order.releasedAt)}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Payment Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-medium text-sm text-foreground">Payment Breakdown</h3>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Total</span>
              <span className="font-medium">{formatCurrency(order.amount)}</span>
            </div>
            <div className="flex justify-between text-role-seller">
              <span>Platform Fee (12%)</span>
              <span>-{formatCurrency(order.platformFee)}</span>
            </div>
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-medium text-foreground">You Receive</span>
                <span className="font-semibold text-emerald-600 text-base">
                  {formatCurrency(order.sellerReceives)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fixed Bottom Actions */}
      <FulfillmentActions
        order={order}
        onConfirm={handleConfirmFulfillment}
        onContactBuyer={handleContactBuyer}
        isConfirming={isConfirming}
      />
    </div>
  );
}
