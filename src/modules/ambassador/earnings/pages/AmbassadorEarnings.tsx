/**
 * Ambassador Earnings Page
 * 
 * Wallet view for Ambassadors to track their 2% commissions.
 * Displays available vs pending (escrow) balances.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet as WalletIcon, 
  ArrowLeft, 
  TrendingUp, 
  ShieldCheck, 
  Loader2, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Receipt
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { WalletHero } from '@/modules/shared/wallet/components/WalletHero';
import { 
  getAmbassadorWallet, 
  type AmbassadorWalletData, 
  type AmbassadorTransaction 
} from '../../api/ambassador.service';
import { cn } from '@/lib/utils';

export default function AmbassadorEarnings() {
  const [walletData, setWalletData] = useState<AmbassadorWalletData | null>(null);
  const [transactions, setTransactions] = useState<AmbassadorTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await getAmbassadorWallet();
        if (response.success) {
          setWalletData(response.data.wallet);
          setTransactions(response.data.recentTransactions);
        }
      } catch (error) {
        console.error('Failed to fetch ambassador earnings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarnings();
  }, []);

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
      year: 'numeric'
    });
  };

  const statusConfig: Record<AmbassadorTransaction['status'], { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
    held: { 
      label: 'Escrow', 
      color: 'text-amber-600', 
      bgColor: 'bg-amber-100',
      icon: Clock
    },
    released: { 
      label: 'Released', 
      color: 'text-emerald-600', 
      bgColor: 'bg-emerald-100',
      icon: CheckCircle2
    },
    disputed: { 
      label: 'Disputed', 
      color: 'text-red-600', 
      bgColor: 'bg-red-100',
      icon: AlertCircle
    },
    cancelled: { 
      label: 'Cancelled', 
      color: 'text-gray-600', 
      bgColor: 'bg-gray-100',
      icon: ArrowLeft
    },
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-20">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-role-ambassador/10 flex items-center justify-center shrink-0">
            <WalletIcon className="w-5 h-5 text-role-ambassador" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Earnings</h1>
            <p className="text-xs text-muted-foreground">Keep track of your verification commissions</p>
          </div>
        </div>
        <Link
          to="/dashboard/ambassador"
          className="flex items-center gap-1 text-sm font-medium text-role-ambassador hover:underline active:text-role-ambassador/80 touch-target"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
      </motion.div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-border">
          <Loader2 className="w-10 h-10 text-role-ambassador animate-spin mb-4" />
          <p className="text-sm text-muted-foreground animate-pulse">Calculating your earnings...</p>
        </div>
      ) : (
        <>
          {/* Wallet Hero - Reusable component with ambassador variant */}
          <WalletHero
            availableBalance={walletData?.availableBalance ?? 0}
            pendingBalance={walletData?.pendingBalance ?? 0}
            variant="ambassador"
            onWithdraw={() => alert('Withdrawal feature coming soon. Payouts are currently processed every Friday.')}
          />

          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl border border-border p-4 relative overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Total Paid</span>
              </div>
              <p className="text-xl font-black text-foreground">{formatCurrency(walletData?.totalEarnings ?? 0)}</p>
              <div className="absolute -right-2 -bottom-2 opacity-5">
                <TrendingUp className="w-16 h-16" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl border border-border p-4 relative overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-role-ambassador/10 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-role-ambassador" />
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Commission Rate</span>
              </div>
              <p className="text-xl font-black text-foreground">2.0%</p>
              <p className="text-[10px] text-muted-foreground mt-1">Per successful audit</p>
            </motion.div>
          </div>

          {/* Info Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-role-ambassador/5 border border-role-ambassador/20 rounded-2xl p-4 flex gap-3"
          >
            <ShieldCheck className="w-5 h-5 text-role-ambassador shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-role-ambassador uppercase tracking-tight">How Escrow Works</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Your commission is held in <span className="text-amber-600 font-bold">Escrow</span> once an audit is submitted. It is <span className="text-emerald-600 font-bold">Released</span> only after the student completes their move-in and confirms the house matches your report.
              </p>
            </div>
          </motion.div>

          {/* Audit History / Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl border border-border overflow-hidden"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Audit History</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-0.5">Payment Trail</p>
              </div>
              <Receipt className="w-5 h-5 text-muted-foreground/30" />
            </div>

            {transactions.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Receipt className="w-8 h-8 text-muted-foreground opacity-20" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">No audit transactions yet.</p>
                <Link 
                  to="/dashboard/ambassador/verifications"
                  className="inline-block mt-4 px-6 py-2 bg-role-ambassador text-white rounded-xl text-xs font-bold shadow-lg shadow-role-ambassador/20"
                >
                  Start Auditing
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {transactions.map((tx) => {
                  const config = statusConfig[tx.status];
                  const Icon = config.icon;
                  return (
                    <div key={tx.id} className="p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-foreground truncate">{tx.propertyName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              {tx.listingDisplayId}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {formatDate(tx.createdAt)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-black text-foreground">{formatCurrency(tx.amount)}</p>
                          <div className={cn(
                            'inline-flex items-center gap-1.2 px-2 py-0.5 rounded-full text-[10px] font-bold mt-1.5',
                            config.bgColor,
                            config.color
                          )}>
                            <Icon className="w-3 h-3" />
                            {config.label}
                          </div>
                        </div>
                      </div>
                      
                      {tx.status === 'released' && tx.releasedAt && (
                        <div className="mt-3 py-2 px-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                          <span className="text-[10px] text-emerald-800 font-medium">Payout Released</span>
                          <span className="text-[10px] text-emerald-600 font-bold">{formatDate(tx.releasedAt)}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}
