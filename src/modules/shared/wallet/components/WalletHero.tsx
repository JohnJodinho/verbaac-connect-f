import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Clock, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface WalletHeroProps {
  availableBalance: number;
  pendingBalance: number;
  currency?: 'NGN';
  onFundWallet?: () => void;
  onWithdraw?: () => void;
}

const formatCurrency = (amount: number, currency = 'NGN'): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * WalletHero Component
 * Displays the user's wallet with Available vs Pending (Escrow) balances.
 * Uses Fresh Teal theme for Consumer persona.
 */
export function WalletHero({
  availableBalance,
  pendingBalance,
  currency = 'NGN',
  onFundWallet,
  onWithdraw,
}: WalletHeroProps) {
  const totalBalance = availableBalance + pendingBalance;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/95 to-primary/85 p-6 text-primary-foreground shadow-xl"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/20" />
        <div className="absolute -left-5 -bottom-5 w-32 h-32 rounded-full bg-white/10" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-white/80">My Wallet</p>
              <h2 className="text-2xl font-bold">Verbaac Pay</h2>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-sm">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Active</span>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Available Balance */}
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/30 flex items-center justify-center">
                <ArrowDownLeft className="w-4 h-4 text-emerald-300" />
              </div>
              <span className="text-sm text-white/80">Available Balance</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(availableBalance, currency)}</p>
            <p className="text-xs text-white/60 mt-1">Ready for withdrawal or spending</p>
          </div>

          {/* Pending (Escrow) Balance */}
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/30 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-300" />
              </div>
              <span className="text-sm text-white/80">Pending (Escrow)</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(pendingBalance, currency)}</p>
            <p className="text-xs text-white/60 mt-1">Held in Verbaac Secure Pay</p>
          </div>
        </div>

        {/* Total Balance Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/80">Total Balance</span>
            <span className="text-lg font-semibold">{formatCurrency(totalBalance, currency)}</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(availableBalance / totalBalance) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-emerald-400 rounded-full"
            />
          </div>
          <div className="flex justify-between text-xs text-white/60 mt-1">
            <span>Available: {((availableBalance / totalBalance) * 100).toFixed(0)}%</span>
            <span>Escrow: {((pendingBalance / totalBalance) * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onFundWallet}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-white text-primary 
                       font-semibold rounded-xl hover:bg-white/90 transition-colors shadow-lg"
          >
            <ArrowDownLeft className="w-5 h-5" />
            Fund Wallet
          </button>
          <button
            onClick={onWithdraw}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-white/20 text-white 
                       font-semibold rounded-xl hover:bg-white/30 transition-colors backdrop-blur-sm
                       border border-white/30"
          >
            <ArrowUpRight className="w-5 h-5" />
            Withdraw
          </button>
        </div>
      </div>
    </motion.div>
  );
}
