import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { VerificationBanner } from '../components/VerificationBanner';
import { ActiveEscrowCard } from '../components/ActiveEscrowCard';
import { QuickActionGrid } from '../components/QuickActionGrid';
import { MarketplaceScroller } from '../components/MarketplaceScroller';
import { ConsumerWalletCard } from '../components/ConsumerWalletCard';

/**
 * Consumer Dashboard - Central command center for Verbaac Connect's demand-side.
 * Features personalized greeting, Active Persona Badge, and modular components.
 */
export default function Dashboard() {
  const { user, activeRole } = useAuthStore();
  
  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user?.firstName || 'there';

  return (
    <div className="theme-consumer">
      {/* Dynamic Header with Greeting and Persona Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {getGreeting()}, {firstName}! 👋
            </h1>
            <p className="text-gray-600">
              Welcome back! Here's what's happening with your account.
            </p>
          </div>

          {/* Active Persona Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 
                       text-white rounded-full shadow-lg"
          >
            <User className="h-4 w-4" />
            <span className="font-medium text-sm">Consumer Mode</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Verification Banner - Shows if student profile incomplete */}
      <VerificationBanner />

      {/* Quick Action Grid - Primary Navigation */}
      <QuickActionGrid />

      {/* Two Column Layout for Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column - Escrow Status */}
        <div className="lg:col-span-2">
          <ActiveEscrowCard 
            escrow={{
              status: 'held',
              amount: 75000,
              currency: 'NGN',
              transactionId: 'TXN-2025-001',
            }}
          />
        </div>

        {/* Right Column - Wallet */}
        <div className="lg:col-span-1">
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
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Watchlist</h3>
          <div className="space-y-3">
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
          <button className="w-full mt-4 text-center text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">
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
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 ${color} rounded-full flex-shrink-0`} />
      <p className="text-sm text-gray-600">{message}</p>
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
    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
      <div>
        <h4 className="font-medium text-gray-900 text-sm">{title}</h4>
        <p className="text-xs text-gray-500">{type} • {price}</p>
      </div>
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[status] || 'text-gray-600 bg-gray-50'}`}>
        {status}
      </span>
    </div>
  );
}
