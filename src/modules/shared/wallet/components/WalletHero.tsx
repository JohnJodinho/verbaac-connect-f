import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Clock, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

type WalletVariant = 'consumer' | 'seller' | 'landlord' | 'ambassador';

interface WalletHeroProps {
  availableBalance: number;
  pendingBalance: number;
  currency?: 'NGN';
  variant?: WalletVariant;
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

// Persona-specific labels
const variantLabels: Record<WalletVariant, {
  walletTitle: string;
  availableLabel: string;
  availableDescription: string;
  pendingLabel: string;
  pendingDescription: string;
  withdrawLabel: string;
}> = {
  consumer: {
    walletTitle: 'My Wallet',
    availableLabel: 'Available Balance',
    availableDescription: 'Ready for withdrawal or spending',
    pendingLabel: 'Pending (Escrow)',
    pendingDescription: 'Held in Verbaac Secure Pay',
    withdrawLabel: 'Withdraw',
  },
  seller: {
    walletTitle: 'Seller Wallet',
    availableLabel: 'Available for Payout',
    availableDescription: 'Ready to withdraw to your bank',
    pendingLabel: 'Pending Revenue',
    pendingDescription: 'Awaiting buyer confirmation',
    withdrawLabel: 'Request Payout',
  },
  landlord: {
    walletTitle: 'Landlord Wallet',
    availableLabel: 'Cash Balance',
    availableDescription: 'Cleared rental payments',
    pendingLabel: 'Rental Escrow',
    pendingDescription: 'Tenant deposits held securely',
    withdrawLabel: 'Withdraw',
  },
  ambassador: {
    walletTitle: 'Ambassador Wallet',
    availableLabel: 'Cleared Commission',
    availableDescription: 'Ready to withdraw post-student move-in',
    pendingLabel: 'Audit Escrow',
    pendingDescription: 'Held until move-in confirmation',
    withdrawLabel: 'Request Commission',
  },
};

/**
 * WalletHero Component
 * Displays the user's wallet with Available vs Pending (Escrow) balances.
 * Supports persona-based labeling via the variant prop.
 */
export function WalletHero({
  availableBalance,
  pendingBalance,
  currency = 'NGN',
  variant = 'consumer',
  onFundWallet,
  onWithdraw,
}: WalletHeroProps) {
  const labels = variantLabels[variant];
  const totalBalance = availableBalance + pendingBalance;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl md:rounded-2xl bg-linear-to-br from-primary via-primary/95 to-primary/85 p-4 md:p-6 text-primary-foreground shadow-xl"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/20" />
        <div className="absolute -left-5 -bottom-5 w-32 h-32 rounded-full bg-white/10" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Wallet className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-white/80">{labels.walletTitle}</p>
              <h2 className="text-lg md:text-2xl font-bold">Verbaac Pay</h2>
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 bg-white/20 rounded-full backdrop-blur-sm">
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-xs md:text-sm font-medium">Active</span>
          </div>
        </div>

        {/* Balance Cards - Stack on mobile */}
        <div className="grid grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-6">
          {/* Available Balance */}
          <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg bg-emerald-500/30 flex items-center justify-center">
                <ArrowDownLeft className="w-3 h-3 md:w-4 md:h-4 text-emerald-300" />
              </div>
              <span className="text-[10px] md:text-sm text-white/80 line-clamp-1">{labels.availableLabel}</span>
            </div>
            <p className="text-lg md:text-2xl font-bold">{formatCurrency(availableBalance, currency)}</p>
            <p className="hidden md:block text-xs text-white/60 mt-1">{labels.availableDescription}</p>
          </div>

          {/* Pending (Escrow) Balance */}
          <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg bg-amber-500/30 flex items-center justify-center">
                <Clock className="w-3 h-3 md:w-4 md:h-4 text-amber-300" />
              </div>
              <span className="text-[10px] md:text-sm text-white/80 line-clamp-1">{labels.pendingLabel}</span>
            </div>
            <p className="text-lg md:text-2xl font-bold">{formatCurrency(pendingBalance, currency)}</p>
            <p className="hidden md:block text-xs text-white/60 mt-1">{labels.pendingDescription}</p>
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

        {/* Action Buttons - Large touch targets */}
        <div className="grid grid-cols-2 gap-2 md:gap-3">
          <button
            onClick={onFundWallet}
            className="flex items-center justify-center gap-1.5 md:gap-2 py-3 md:py-3 px-3 md:px-4 bg-white text-primary 
                       font-semibold rounded-lg md:rounded-xl hover:bg-white/90 active:bg-white/80 transition-colors shadow-lg touch-target"
          >
            <ArrowDownLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base">Fund</span>
          </button>
          <button
            onClick={onWithdraw}
            className="flex items-center justify-center gap-1.5 md:gap-2 py-3 md:py-3 px-3 md:px-4 bg-white/20 text-white 
                       font-semibold rounded-lg md:rounded-xl hover:bg-white/30 active:bg-white/40 transition-colors backdrop-blur-sm
                       border border-white/30 touch-target"
          >
            <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base">{labels.withdrawLabel}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
