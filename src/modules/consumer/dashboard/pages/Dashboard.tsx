import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { VerificationBanner } from '../components/VerificationBanner';
import { ActiveEscrowCard } from '../components/ActiveEscrowCard';
import { QuickActionGrid } from '../components/QuickActionGrid';
import { MarketplaceScroller } from '../components/MarketplaceScroller';
import { ConsumerWalletCard } from '../components/ConsumerWalletCard';

/**
 * Consumer Dashboard - Central command center for Verbacc Connect's demand-side.
 * Features personalized greeting, Active Persona Badge, and modular components.
 * 
 * Mobile-First Design:
 * - Reduces heading sizes on mobile
 * - Stacks cards vertically
 * - Uses edge-to-edge containers where appropriate
 */
export default function Dashboard() {
  const { user } = useAuthStore();
  
  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user?.firstName || 'there';

  return (
    <div className="theme-consumer w-full max-w-full">
      {/* Dynamic Header with Greeting and Persona Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 md:mb-8"
      >
        <div className="flex items-start justify-between gap-2 md:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
              {getGreeting()}, {firstName}! 👋
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-0.5 md:mt-1">
              <span className="hidden sm:inline">Welcome back! Here's what's happening with your account.</span>
              <span className="sm:hidden">Here's your dashboard overview.</span>
            </p>
          </div>

          {/* Active Persona Badge - Compact on mobile */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="shrink-0 flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-linear-to-r from-teal-500 to-emerald-600 
                       text-white rounded-full shadow-lg"
          >
            <User className="h-3 w-3 md:h-4 md:w-4" />
            <span className="font-medium text-xs md:text-sm">Consumer</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Verification Banner - Shows if student profile incomplete */}
      <VerificationBanner />

      {/* Quick Action Grid - Primary Navigation */}
      <QuickActionGrid />

      {/* Two Column Layout for Cards - Stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Left Column - Escrow Status (takes 2 cols on lg) */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <ActiveEscrowCard 
            escrow={{
              status: 'held',
              amount: 75000,
              currency: 'NGN',
              transactionId: 'TXN-2025-001',
            }}
          />
        </div>

        {/* Right Column - Wallet (shows first on mobile) */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <ConsumerWalletCard 
            wallet={{
              availableBalance: 25000,
              pendingBalance: 75000,
              currency: 'NGN',
            }}
          />
        </div>
      </div>

      {/* Marketplace Scroller - Personalized Recommendations */}
      <MarketplaceScroller title="Recommended for You" />

      {/* Recent Activity Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6"
      >
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Recent Activity</h3>
          <div className="space-y-3 md:space-y-4">
            <ActivityItem
              color="bg-teal-500"
              message="New message from John about apartment listing"
            />
            <ActivityItem
              color="bg-emerald-500"
              message="MacBook Pro listing received 3 new views"
            />
            <ActivityItem
              color="bg-amber-500"
              message="Rental agreement pending your signature"
            />
            <ActivityItem
              color="bg-blue-500"
              message="Escrow payment confirmed for marketplace item"
            />
          </div>
        </div>

        {/* Saved Items / Watchlist */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Your Watchlist</h3>
          <div className="space-y-2 md:space-y-3">
            <WatchlistItem
              title="2-Bedroom Flat, Naraguta"
              type="Housing"
              price="₦180,000/yr"
              status="Available"
            />
            <WatchlistItem
              title="MacBook Air M2"
              type="Marketplace"
              price="₦520,000"
              status="Negotiable"
            />
            <WatchlistItem
              title="Self-con near UNIJOS"
              type="Housing"
              price="₦150,000/yr"
              status="Pending"
            />
          </div>
          <button className="w-full mt-3 md:mt-4 text-center text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors py-2 touch-target">
            View All Saved Items
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Helper Components
function ActivityItem({ color, message }: { color: string; message: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`w-2 h-2 ${color} rounded-full shrink-0 mt-1.5`} />
      <p className="text-sm text-gray-600 line-clamp-2">{message}</p>
    </div>
  );
}

function WatchlistItem({ 
  title, 
  type, 
  price, 
  status 
}: { 
  title: string; 
  type: string; 
  price: string; 
  status: string;
}) {
  const statusColors: Record<string, string> = {
    Available: 'text-emerald-600 bg-emerald-50',
    Negotiable: 'text-blue-600 bg-blue-50',
    Pending: 'text-amber-600 bg-amber-50',
  };

  return (
    <div className="flex items-center justify-between p-2.5 md:p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer touch-target">
      <div className="min-w-0 flex-1">
        <h4 className="font-medium text-gray-900 text-sm truncate">{title}</h4>
        <p className="text-xs text-gray-500">{type} • {price}</p>
      </div>
      <span className={`shrink-0 ml-2 text-xs font-medium px-2 py-0.5 md:py-1 rounded-full ${statusColors[status] || 'text-gray-600 bg-gray-50'}`}>
        {status}
      </span>
    </div>
  );
}
