import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet as WalletIcon, ArrowLeft, TrendingUp, Receipt, Loader2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WalletHero } from '@/modules/shared/wallet/components/WalletHero';
import { BankAccountForm } from '@/modules/shared/wallet/components/BankAccountForm';
import { ReAuthModal } from '@/modules/shared/wallet/components/ReAuthModal';
import { getSellerWallet, type SellerTransaction, type SellerWalletData } from '../../api/seller.service';

/**
 * SellerWallet Page
 * 
 * Mobile-first responsive design:
 * - Stacked layout on mobile
 * - Compact headers and cards
 * - Horizontal scroll for transactions on mobile
 */
export default function SellerWallet() {
  const [reAuthToken, setReAuthToken] = useState<string | null>(null);
  const [showReAuthModal, setShowReAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'bank' | 'withdraw' | null>(null);
  const [walletData, setWalletData] = useState<SellerWalletData | null>(null);
  const [transactions, setTransactions] = useState<SellerTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await getSellerWallet();
        if (response.success) {
          setWalletData(response.data.wallet);
          setTransactions(response.data.recentTransactions);
        }
      } catch (error) {
        console.error('Failed to fetch seller wallet:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  const handleReAuthRequired = (action: 'bank' | 'withdraw' = 'bank') => {
    setPendingAction(action);
    setShowReAuthModal(true);
  };

  const handleReAuthSuccess = (token: string) => {
    setReAuthToken(token);
    setShowReAuthModal(false);
    
    setTimeout(() => {
      setReAuthToken(null);
    }, 5 * 60 * 1000);
  };

  const handleFundWallet = () => {
    console.log('Navigate to seller dashboard');
  };

  const handleWithdraw = () => {
    if (!reAuthToken) {
      handleReAuthRequired('withdraw');
      return;
    }
    console.log('Initiate payout with token:', reAuthToken);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });
  };

  const statusConfig: Record<SellerTransaction['status'], { label: string; color: string; bgColor: string }> = {
    held: { label: 'Pending', color: 'text-amber-600', bgColor: 'bg-amber-100' },
    released: { label: 'Paid', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
    disputed: { label: 'Disputed', color: 'text-red-600', bgColor: 'bg-red-100' },
  };

  return (
    <div className="theme-seller space-y-4 md:space-y-6">
      {/* Page Header - Compact on mobile */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-role-seller/10 flex items-center justify-center shrink-0 md:hidden">
            <WalletIcon className="w-5 h-5 text-role-seller" />
          </div>
          <div className="hidden md:flex w-12 h-12 rounded-xl bg-role-seller/10 items-center justify-center shrink-0">
            <WalletIcon className="w-6 h-6 text-role-seller" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Wallet</h1>
            <p className="text-sm text-muted-foreground hidden md:block">
              Track your earnings and manage payouts
            </p>
          </div>
        </div>
        <Link
          to="/dashboard/seller"
          className="flex items-center gap-1 text-sm font-medium text-role-seller hover:underline active:text-role-seller/80 touch-target"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </Link>
      </motion.div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8 md:py-12">
          <Loader2 className="w-6 h-6 md:w-8 md:h-8 text-role-seller animate-spin" />
          <span className="ml-2 md:ml-3 text-sm md:text-base text-muted-foreground">Loading wallet...</span>
        </div>
      ) : (
        <>
          {/* Wallet Hero - Seller Variant */}
          <WalletHero
            availableBalance={walletData?.availableBalance ?? 0}
            pendingBalance={walletData?.pendingBalance ?? 0}
            variant="seller"
            onFundWallet={handleFundWallet}
            onWithdraw={handleWithdraw}
          />

          {/* Earnings Summary - 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-3 md:gap-4"
          >
            <div className="bg-card rounded-xl border border-border p-4 md:p-5">
              <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground truncate">Total Earnings</p>
                  <p className="text-base md:text-xl font-bold text-foreground">
                    {formatCurrency(walletData?.totalEarnings ?? 0)}
                  </p>
                </div>
              </div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Lifetime sales</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-4 md:p-5">
              <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-role-seller/10 flex items-center justify-center shrink-0">
                  <Receipt className="w-4 h-4 md:w-5 md:h-5 text-role-seller" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground truncate">Commission</p>
                  <p className="text-base md:text-xl font-bold text-foreground">
                    {formatCurrency(walletData?.totalCommissionPaid ?? 0)}
                  </p>
                </div>
              </div>
              <p className="text-[10px] md:text-xs text-muted-foreground">12% platform fee</p>
            </div>
          </motion.div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Bank Accounts - First on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1 order-1 lg:order-2"
            >
              <BankAccountForm
                onReAuthRequired={() => handleReAuthRequired('bank')}
                reAuthToken={reAuthToken}
              />
            </motion.div>

            {/* Sales Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 order-2 lg:order-1 bg-card rounded-xl border border-border overflow-hidden"
            >
              <div className="p-4 md:p-6 border-b border-border">
                <h3 className="text-base md:text-lg font-semibold text-foreground">Recent Sales</h3>
                <p className="text-xs md:text-sm text-muted-foreground">Your marketplace transactions</p>
              </div>

              {transactions.length === 0 ? (
                <div className="text-center py-8 md:py-12 text-muted-foreground px-4">
                  <Receipt className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 opacity-50" />
                  <p className="mb-2">No sales yet</p>
                  <Link
                    to="/dashboard/seller/inventory/new"
                    className="inline-block text-sm text-role-seller hover:underline active:text-role-seller/80 touch-target"
                  >
                    List your first item
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {transactions.map((tx) => {
                    const config = statusConfig[tx.status];
                    return (
                      <div key={tx.id} className="p-4 hover:bg-muted/30 active:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-foreground truncate">{tx.itemName}</p>
                            <p className="text-xs md:text-sm text-muted-foreground truncate">
                              {tx.buyerName} • {formatDate(tx.createdAt)}
                            </p>
                          </div>
                          <div className="text-right shrink-0 ml-3">
                            <p className="font-semibold text-foreground">{formatCurrency(tx.amount)}</p>
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                              {config.label}
                            </span>
                          </div>
                        </div>
                        
                        {/* Commission Breakdown - Collapsed on mobile */}
                        <details className="mt-2">
                          <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground flex items-center gap-1">
                            <ChevronRight className="w-3 h-3" />
                            View breakdown
                          </summary>
                          <div className="mt-2 p-3 bg-muted/30 rounded-lg space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Sale Amount</span>
                              <span className="text-foreground">{formatCurrency(tx.amount)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-role-seller">
                              <span>Platform Fee (12%)</span>
                              <span>- {formatCurrency(tx.platformFee)}</span>
                            </div>
                            <div className="flex justify-between text-sm font-semibold pt-2 border-t border-border">
                              <span className="text-foreground">You Receive</span>
                              <span className="text-emerald-600">{formatCurrency(tx.netAmount)}</span>
                            </div>
                          </div>
                        </details>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}

      {/* Re-Authentication Modal */}
      <ReAuthModal
        isOpen={showReAuthModal}
        onClose={() => {
          setShowReAuthModal(false);
          setPendingAction(null);
        }}
        onSuccess={handleReAuthSuccess}
        title={
          pendingAction === 'withdraw' 
            ? 'Verify to Request Payout' 
            : 'Verify Your Identity'
        }
        description={
          pendingAction === 'withdraw'
            ? 'Enter your password to initiate a payout.'
            : 'Enter your password to manage bank accounts.'
        }
      />
    </div>
  );
}
