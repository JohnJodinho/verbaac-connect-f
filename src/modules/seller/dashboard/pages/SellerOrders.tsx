import { motion } from 'framer-motion';
import { ShoppingCart, Package, Clock, CheckCircle2, AlertCircle, MessageCircle, Eye, ChevronRight } from 'lucide-react';
import { AnimatedCard } from '@/components/animated';

/**
 * SellerOrders Page
 * 
 * Mobile-first responsive design:
 * - Horizontal scroll tabs on mobile
 * - Stacked order cards with touch targets
 * - Compact action buttons
 */
export default function SellerOrders() {
  const mockOrders = [
    {
      id: '1',
      orderRef: 'ORD-2025-001',
      itemName: 'MacBook Pro M3 2024',
      buyerName: 'Adebayo O.',
      amount: 850000,
      status: 'pending' as const,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '2',
      orderRef: 'ORD-2025-002',
      itemName: 'iPhone 15 Pro Max',
      buyerName: 'Chidinma E.',
      amount: 650000,
      status: 'confirmed' as const,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '3',
      orderRef: 'ORD-2025-003',
      itemName: 'Samsung Galaxy S24 Ultra',
      buyerName: 'Fatima M.',
      amount: 520000,
      status: 'completed' as const,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
  ];

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusConfig = {
    pending: { 
      label: 'Pending', 
      color: 'text-amber-600', 
      bgColor: 'bg-amber-100',
      icon: Clock,
      description: 'Awaiting confirmation',
    },
    confirmed: { 
      label: 'Confirmed', 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-100',
      icon: Package,
      description: 'Ready for delivery',
    },
    completed: { 
      label: 'Completed', 
      color: 'text-emerald-600', 
      bgColor: 'bg-emerald-100',
      icon: CheckCircle2,
      description: 'Order fulfilled',
    },
    disputed: { 
      label: 'Disputed', 
      color: 'text-red-600', 
      bgColor: 'bg-red-100',
      icon: AlertCircle,
      description: 'Under review',
    },
  };

  const pendingCount = mockOrders.filter(o => o.status === 'pending').length;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header - Compact on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:hidden rounded-xl bg-role-seller/10 flex items-center justify-center shrink-0">
            <ShoppingCart className="w-5 h-5 text-role-seller" />
          </div>
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl md:text-2xl font-bold text-foreground"
            >
              Orders
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-muted-foreground hidden md:block"
            >
              Manage buyer orders and fulfillment
            </motion.p>
          </div>
        </div>
        
        {pendingCount > 0 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-amber-100 text-amber-800 self-start sm:self-auto"
          >
            <Clock className="w-4 h-4" />
            <span className="text-xs md:text-sm font-medium">{pendingCount} pending</span>
          </motion.div>
        )}
      </div>

      {/* Status Tabs - Horizontal scroll */}
      <AnimatedCard className="bg-card p-1.5 md:p-2 rounded-xl border border-border">
        <div className="flex gap-1.5 md:gap-2 overflow-x-auto scrollbar-hide">
          {(['all', 'pending', 'confirmed', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              className={`shrink-0 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-colors touch-target ${
                tab === 'all'
                  ? 'bg-role-seller text-white'
                  : 'text-muted-foreground hover:bg-muted active:bg-muted/80'
              }`}
            >
              {tab === 'all' ? 'All' : statusConfig[tab]?.label || tab}
            </button>
          ))}
        </div>
      </AnimatedCard>

      {/* Orders List - Card style on mobile */}
      <div className="space-y-3 md:space-y-0">
        {/* Desktop: Table-like card */}
        <AnimatedCard className="hidden md:block bg-card rounded-xl border border-border overflow-hidden">
          <div className="divide-y divide-border">
            {mockOrders.map((order, index) => {
              const config = statusConfig[order.status];
              const StatusIcon = config.icon;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 hover:bg-muted/30 active:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${config.bgColor} flex items-center justify-center shrink-0`}>
                      <StatusIcon className={`w-6 h-6 ${config.color}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">{order.itemName}</h3>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.orderRef} • Buyer: {order.buyerName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(order.createdAt)} • {config.description}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold text-role-seller">
                        {formatCurrency(order.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Net: {formatCurrency(order.amount * 0.88)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-muted active:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground touch-target">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-muted active:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground touch-target">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {order.status === 'pending' && (
                    <div className="mt-4 flex gap-3 pl-16">
                      <button className="px-4 py-2 rounded-lg bg-role-seller text-white text-sm font-medium hover:bg-role-seller/90 active:bg-role-seller/80 transition-colors touch-target">
                        Confirm Order
                      </button>
                      <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted active:bg-muted/80 transition-colors touch-target">
                        Message Buyer
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </AnimatedCard>

        {/* Mobile: Separate cards */}
        {mockOrders.map((order, index) => {
          const config = statusConfig[order.status];
          const StatusIcon = config.icon;

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="md:hidden bg-card rounded-xl border border-border p-4"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center shrink-0`}>
                  <StatusIcon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium text-foreground truncate">{order.itemName}</h3>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {order.buyerName} • {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3">
                <div>
                  <p className="text-lg font-bold text-role-seller">{formatCurrency(order.amount)}</p>
                  <p className="text-xs text-muted-foreground">Net: {formatCurrency(order.amount * 0.88)}</p>
                </div>
                <div className="flex gap-2">
                  {order.status === 'pending' ? (
                    <button className="px-4 py-2 rounded-lg bg-role-seller text-white text-sm font-medium active:bg-role-seller/80 transition-colors touch-target">
                      Confirm
                    </button>
                  ) : (
                    <button className="p-2 rounded-lg bg-muted text-foreground active:bg-muted/80 transition-colors touch-target">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {mockOrders.length === 0 && (
        <AnimatedCard className="bg-muted/30 p-8 md:p-12 rounded-xl border border-dashed border-border text-center">
          <ShoppingCart className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">No orders yet</h3>
          <p className="text-sm text-muted-foreground">
            When buyers purchase your items, their orders will appear here.
          </p>
        </AnimatedCard>
      )}
    </div>
  );
}
