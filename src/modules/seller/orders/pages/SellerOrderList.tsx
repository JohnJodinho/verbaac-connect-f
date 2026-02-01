import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, RefreshCw, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchOrders, type SellerOrder, type EscrowStatus } from '../../api/seller.service';
import OrderCard from '../components/OrderCard';

type FilterTab = 'all' | EscrowStatus;

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All Orders' },
  { id: 'held', label: 'Held' },
  { id: 'released', label: 'Completed' },
  { id: 'disputed', label: 'Disputed' },
];

export default function SellerOrderList() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchOrders();
      if (response.success) {
        setOrders(response.data);
      } else {
        setError('Failed to load orders');
      }
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error loading orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeFilter === 'all') return true;
    return order.escrowStatus === activeFilter;
  });

  const getOrderCounts = () => {
    return {
      all: orders.length,
      held: orders.filter(o => o.escrowStatus === 'held').length,
      released: orders.filter(o => o.escrowStatus === 'released').length,
      disputed: orders.filter(o => o.escrowStatus === 'disputed').length,
    };
  };

  const counts = getOrderCounts();

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-4 md:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg md:text-xl font-bold text-foreground">Orders</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Manage your sales & fulfillment
              </p>
            </div>
            <button
              onClick={loadOrders}
              disabled={isLoading}
              className="p-2 rounded-lg border border-border hover:bg-muted transition-colors touch-target"
            >
              <RefreshCw className={cn('w-5 h-5 text-muted-foreground', isLoading && 'animate-spin')} />
            </button>
          </div>
        </div>

        {/* Filter Tabs - Horizontal Scroll on Mobile */}
        <div className="px-4 md:px-6 pb-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all touch-target whitespace-nowrap',
                  activeFilter === tab.id
                    ? 'bg-role-seller text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 active:bg-muted'
                )}
              >
                <span>{tab.label}</span>
                <span className={cn(
                  'min-w-5 h-5 flex items-center justify-center rounded-full text-xs',
                  activeFilter === tab.id
                    ? 'bg-white/20'
                    : 'bg-background'
                )}>
                  {counts[tab.id]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 md:px-6 py-4">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-muted rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-1/4" />
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
            <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load Orders</h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <button
              onClick={loadOrders}
              className="px-4 py-2 bg-role-seller text-white rounded-lg font-medium hover:bg-role-seller/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {activeFilter === 'all' ? 'No Orders Yet' : `No ${FILTER_TABS.find(t => t.id === activeFilter)?.label}`}
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {activeFilter === 'all' 
                ? 'When buyers purchase your items, orders will appear here.'
                : 'Orders matching this filter will appear here.'}
            </p>
          </div>
        ) : (
          // Order list
          <AnimatePresence mode="popLayout">
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <OrderCard
                    order={order}
                    onClick={() => navigate(`/dashboard/seller/orders/${order.id}`)}
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
