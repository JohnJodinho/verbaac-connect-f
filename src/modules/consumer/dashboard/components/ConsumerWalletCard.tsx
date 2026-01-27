import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Clock, ArrowRight } from 'lucide-react';
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
      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">My Wallet</h3>
            <p className="text-xs text-slate-400">Verbaac Pay</p>
          </div>
        </div>
        <Link
          to="/dashboard/wallet"
          className="flex items-center gap-1 text-sm text-teal-400 hover:text-teal-300 transition-colors"
        >
          View
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Total Balance */}
      <div className="mb-6">
        <p className="text-sm text-slate-400 mb-1">Total Balance</p>
        <p className="text-3xl font-bold tracking-tight">
          {formatCurrency(totalBalance, walletData.currency)}
        </p>
      </div>

      {/* Balance Breakdown */}
      <div className="grid grid-cols-2 gap-4">
        {/* Available Balance */}
        <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-xs text-slate-400">Available</span>
          </div>
          <p className="text-lg font-semibold text-emerald-400">
            {formatCurrency(walletData.availableBalance, walletData.currency)}
          </p>
        </div>

        {/* Pending Balance */}
        <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-amber-400" />
            <span className="text-xs text-slate-400">In Escrow</span>
          </div>
          <p className="text-lg font-semibold text-amber-400">
            {formatCurrency(walletData.pendingBalance, walletData.currency)}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex gap-3">
        <button className="flex-1 py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg transition-colors">
          Fund Wallet
        </button>
        <button className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors backdrop-blur-sm">
          Withdraw
        </button>
      </div>
    </motion.div>
  );
}
