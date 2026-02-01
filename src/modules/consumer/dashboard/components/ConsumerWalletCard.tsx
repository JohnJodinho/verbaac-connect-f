import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Clock, ArrowRight, Plus, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WalletData {
  availableBalance: number;
  pendingBalance: number;
  currency?: string;
}

interface ConsumerWalletCardProps {
  wallet?: WalletData;
}

/**
 * ConsumerWalletCard visualizes pending_balance (Refunds/Escrow) 
 * vs available_balance for the consumer.
 * 
 * Mobile-first: Full-width gradient card with large touch targets
 */
export function ConsumerWalletCard({ wallet }: ConsumerWalletCardProps) {
  // Default mock data for demonstration
  const walletData = wallet || {
    availableBalance: 25000,
    pendingBalance: 45000,
    currency: 'NGN',
  };

  const formatCurrency = (amount: number, currency: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalBalance = walletData.availableBalance + walletData.pendingBalance;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-linear-to-br from-slate-800 to-slate-900 rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-1.5 md:p-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <Wallet className="h-4 w-4 md:h-5 md:w-5" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-semibold">My Wallet</h3>
            <p className="text-[10px] md:text-xs text-slate-400">Verbacc Pay</p>
          </div>
        </div>
        <Link
          to="/dashboard/wallet"
          className="flex items-center gap-1 text-xs md:text-sm text-teal-400 hover:text-teal-300 transition-colors touch-target"
        >
          View
          <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
        </Link>
      </div>

      {/* Total Balance */}
      <div className="mb-4 md:mb-6">
        <p className="text-xs md:text-sm text-slate-400 mb-0.5 md:mb-1">Total Balance</p>
        <p className="text-2xl md:text-3xl font-bold tracking-tight">
          {formatCurrency(totalBalance, walletData.currency)}
        </p>
      </div>

      {/* Balance Breakdown - Stack vertically on small mobile, grid on larger */}
      <div className="grid grid-cols-2 gap-2 md:gap-4">
        {/* Available Balance */}
        <div className="bg-white/5 rounded-lg md:rounded-xl p-3 md:p-4 backdrop-blur-sm">
          <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-emerald-400" />
            <span className="text-[10px] md:text-xs text-slate-400">Available</span>
          </div>
          <p className="text-sm md:text-lg font-semibold text-emerald-400">
            {formatCurrency(walletData.availableBalance, walletData.currency)}
          </p>
        </div>

        {/* Pending Balance */}
        <div className="bg-white/5 rounded-lg md:rounded-xl p-3 md:p-4 backdrop-blur-sm">
          <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
            <Clock className="h-3 w-3 md:h-4 md:w-4 text-amber-400" />
            <span className="text-[10px] md:text-xs text-slate-400">In Escrow</span>
          </div>
          <p className="text-sm md:text-lg font-semibold text-amber-400">
            {formatCurrency(walletData.pendingBalance, walletData.currency)}
          </p>
        </div>
      </div>

      {/* Quick Actions - Larger buttons for mobile */}
      <div className="mt-4 md:mt-6 flex gap-2 md:gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 py-3 md:py-2.5 bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors touch-target">
          <Plus className="h-4 w-4" />
          <span>Fund</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-3 md:py-2.5 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-sm font-medium rounded-lg transition-colors backdrop-blur-sm touch-target">
          <ArrowUpRight className="h-4 w-4" />
          <span>Withdraw</span>
        </button>
      </div>
    </motion.div>
  );
}
