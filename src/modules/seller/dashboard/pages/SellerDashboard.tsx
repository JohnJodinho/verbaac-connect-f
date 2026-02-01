import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Store, Package, ShoppingCart, TrendingUp, Plus, ArrowRight, Wallet, Loader2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { AnimatedCard, AnimatedButton } from '@/components/animated';
import { getSellerStats, type SellerStats } from '../../api/seller.service';

export default function SellerDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getSellerStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch seller stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const statCards = [
    { label: 'Items', value: stats?.totalItems ?? 0, icon: Package, format: (v: number) => v.toString() },
    { label: 'Active', value: stats?.activeListings ?? 0, icon: Store, format: (v: number) => v.toString() },
    { label: 'Orders', value: stats?.pendingOrders ?? 0, icon: ShoppingCart, format: (v: number) => v.toString(), highlight: true },
    { label: 'Sales', value: stats?.totalSales ?? 0, icon: TrendingUp, format: formatCurrency },
  ];

  const isNewSeller = stats?.totalItems === 0;

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Header - Compact on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:hidden rounded-xl bg-role-seller/10 flex items-center justify-center shrink-0">
            <Store className="w-5 h-5 text-role-seller" />
          </div>
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl md:text-3xl font-bold text-foreground"
            >
              Seller Dashboard
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm md:text-base text-muted-foreground hidden md:block"
            >
              Welcome back, {user?.firstName || 'Seller'}!
            </motion.p>
          </div>
        </div>
        
        {/* Add button - fixed on mobile */}
        <AnimatedButton 
          variant="primary" 
          size="md" 
          className="hidden sm:flex touch-target"
        >
          <Link to="/dashboard/seller/inventory/new" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            List New Item
          </Link>
        </AnimatedButton>
      </div>

      {/* Stats Grid - 2x2 on mobile, 4 cols on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <AnimatedCard
              key={index}
              className="bg-card p-4 md:p-6 rounded-xl border border-border shadow-sm"
              delay={index * 0.1}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-12 md:h-4 md:w-24 bg-muted rounded animate-pulse" />
                  <div className="h-6 w-10 md:h-8 md:w-16 bg-muted rounded animate-pulse" />
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-muted animate-pulse" />
              </div>
            </AnimatedCard>
          ))
        ) : (
          statCards.map((stat, index) => (
            <AnimatedCard
              key={stat.label}
              className={`bg-card p-4 md:p-6 rounded-xl border shadow-sm transition-all active:scale-[0.98] ${
                stat.highlight && (stat.value as number) > 0 
                  ? 'border-role-seller/50 bg-role-seller/5' 
                  : 'border-border'
              }`}
              delay={index * 0.1}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-lg md:text-2xl font-bold text-foreground mt-0.5 md:mt-1">
                    {stat.format(stat.value as number)}
                  </p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-role-seller/10 flex items-center justify-center shrink-0">
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-role-seller" />
                </div>
              </div>
            </AnimatedCard>
          ))
        )}
      </div>

      {/* Revenue Summary Card */}
      {!isLoading && stats && !isNewSeller && (
        <AnimatedCard className="bg-gradient-to-br from-role-seller/10 via-purple-50 to-violet-50 p-4 md:p-6 rounded-xl border border-role-seller/20">
          <div className="flex items-center gap-3 md:gap-4 mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-role-seller/20 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5 md:w-6 md:h-6 text-role-seller" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-foreground">Revenue</h3>
              <p className="text-xs md:text-sm text-muted-foreground hidden md:block">Your earnings at a glance</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="p-3 md:p-4 bg-white/60 rounded-lg backdrop-blur-sm">
              <p className="text-xs md:text-sm text-muted-foreground">Pending</p>
              <p className="text-base md:text-xl font-bold text-amber-600">{formatCurrency(stats.pendingRevenue)}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 md:mt-1">In escrow</p>
            </div>
            <div className="p-3 md:p-4 bg-white/60 rounded-lg backdrop-blur-sm">
              <p className="text-xs md:text-sm text-muted-foreground">Available</p>
              <p className="text-base md:text-xl font-bold text-emerald-600">{formatCurrency(stats.availableForPayout)}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 md:mt-1">Ready to withdraw</p>
            </div>
          </div>
          <Link 
            to="/dashboard/seller/wallet"
            className="mt-3 md:mt-4 inline-flex items-center gap-2 text-sm font-medium text-role-seller hover:underline active:text-role-seller/80 touch-target"
          >
            View Full Wallet
            <ArrowRight className="w-4 h-4" />
          </Link>
        </AnimatedCard>
      )}

      {/* Quick Actions - Horizontal scroll on mobile */}
      <AnimatedCard className="bg-card p-4 md:p-6 rounded-xl border border-border shadow-sm">
        <h2 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">Quick Actions</h2>
        
        {/* Mobile: Horizontal scroll */}
        <div className="md:hidden">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-2">
            {[
              { to: '/dashboard/seller/inventory/new', icon: Plus, title: 'List Product', desc: 'Add new item' },
              { to: '/dashboard/seller/orders', icon: ShoppingCart, title: 'Orders', desc: 'Manage requests' },
              { to: '/dashboard/seller/wallet', icon: TrendingUp, title: 'Earnings', desc: 'Track payouts' },
            ].map(action => (
              <Link
                key={action.to}
                to={action.to}
                className="shrink-0 w-[140px] flex flex-col items-center p-4 rounded-xl border border-border hover:border-role-seller active:bg-role-seller/5 transition-colors touch-target"
              >
                <div className="w-10 h-10 rounded-lg bg-role-seller/10 flex items-center justify-center mb-2">
                  <action.icon className="w-5 h-5 text-role-seller" />
                </div>
                <p className="font-medium text-foreground text-sm">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.desc}</p>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Desktop: 3-col grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-4">
          <Link
            to="/dashboard/seller/inventory/new"
            className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-role-seller hover:bg-role-seller/5 active:bg-role-seller/10 transition-colors group touch-target"
          >
            <div className="w-10 h-10 rounded-lg bg-role-seller/10 flex items-center justify-center">
              <Plus className="w-5 h-5 text-role-seller" />
            </div>
            <div>
              <p className="font-medium text-foreground">List a Product</p>
              <p className="text-sm text-muted-foreground">Add item to marketplace</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-role-seller ml-auto transition-colors" />
          </Link>
          
          <Link
            to="/dashboard/seller/orders"
            className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-role-seller hover:bg-role-seller/5 active:bg-role-seller/10 transition-colors group touch-target"
          >
            <div className="w-10 h-10 rounded-lg bg-role-seller/10 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-role-seller" />
            </div>
            <div>
              <p className="font-medium text-foreground">View Orders</p>
              <p className="text-sm text-muted-foreground">Manage buyer requests</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-role-seller ml-auto transition-colors" />
          </Link>
          
          <Link
            to="/dashboard/seller/wallet"
            className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-role-seller hover:bg-role-seller/5 active:bg-role-seller/10 transition-colors group touch-target"
          >
            <div className="w-10 h-10 rounded-lg bg-role-seller/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-role-seller" />
            </div>
            <div>
              <p className="font-medium text-foreground">View Earnings</p>
              <p className="text-sm text-muted-foreground">Track your payouts</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-role-seller ml-auto transition-colors" />
          </Link>
        </div>
      </AnimatedCard>

      {/* Empty State Prompt - Only show for new sellers */}
      {!isLoading && isNewSeller && (
        <AnimatedCard className="bg-gradient-to-br from-role-seller/10 to-purple-100 p-6 md:p-8 rounded-xl border border-role-seller/20">
          <div className="text-center">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-role-seller/20 flex items-center justify-center mx-auto mb-4">
              <Store className="w-7 h-7 md:w-8 md:h-8 text-role-seller" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">
              Start Selling Today!
            </h3>
            <p className="text-sm md:text-base text-muted-foreground mb-6 max-w-md mx-auto">
              List your first item on the marketplace and start earning. 
              Verbaac handles payments securely with our escrow system.
            </p>
            <AnimatedButton variant="primary" size="lg" className="touch-target">
              <Link to="/dashboard/seller/inventory/new" className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                List Your First Item
              </Link>
            </AnimatedButton>
          </div>
        </AnimatedCard>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex items-center justify-center py-6 md:py-8">
          <Loader2 className="w-5 h-5 md:w-6 md:h-6 text-role-seller animate-spin" />
          <span className="ml-2 text-sm md:text-base text-muted-foreground">Loading dashboard...</span>
        </div>
      )}

      {/* Mobile FAB for adding items */}
      <Link
        to="/dashboard/seller/inventory/new"
        className="sm:hidden fixed bottom-20 right-4 w-14 h-14 bg-role-seller text-white rounded-full shadow-lg shadow-role-seller/30 flex items-center justify-center hover:bg-role-seller/90 active:bg-role-seller/80 transition-colors touch-target-lg z-40"
      >
        <Plus className="w-6 h-6" />
      </Link>
    </div>
  );
}
