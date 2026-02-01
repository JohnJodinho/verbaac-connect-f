import { useState, useEffect } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  Building2,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  fetchLandlordStats, 
  getWalletTransactions,
  type LandlordStats,
  type WalletTransaction
} from '../../api/landlord.service';


export default function LandlordWallet() {
  const [stats, setStats] = useState<LandlordStats | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      const [statsRes, txRes] = await Promise.all([
        fetchLandlordStats(),
        getWalletTransactions()
      ]);
      
      if (statsRes.success) setStats(statsRes.data);
      if (txRes.success) setTransactions(txRes.data);
    } catch (error) {
      console.error('Failed to load wallet data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Wallet</h1>
          <p className="text-sm text-gray-500">Your earnings ledger.</p>
        </div>
        <button className="h-10 px-4 bg-white border border-gray-200 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm hover:bg-gray-50 transition-all text-gray-700">
          <ArrowUpRight className="w-4 h-4" />
          Withdraw
        </button>
      </div>

      {/* Main Balance Card */}
      {isLoading ? (
        <div className="h-48 bg-gray-100 rounded-3xl animate-pulse" />
      ) : (
        <div className="bg-role-landlord rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-role-landlord/20 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Available for Payout</p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                  {formatCurrency(stats?.availableBalance || 0)}
                </h2>
              </div>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1">Held in Escrow</p>
                <p className="text-xl font-bold">{formatCurrency(stats?.pendingRevenue || 0)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1">Total Earned</p>
                <p className="text-xl font-bold">
                  {formatCurrency((stats?.availableBalance || 0) + (stats?.pendingRevenue || 0))}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Split Notice */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-4 items-center">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
          <div className="text-xs font-black text-blue-600">12%</div>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-blue-900">Platform Commission</h4>
          <p className="text-xs text-blue-700 leading-relaxed mt-0.5">
            Verbaac retains 12% of the gross rent. Your wallet reflects the <span className="font-bold">88% Net Payout</span>.
          </p>
        </div>
      </div>

      {/* Transactions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <History className="w-4 h-4 text-gray-400" />
            Recent Activity
          </h3>
          <button className="text-xs font-bold text-role-landlord hover:text-role-landlord/80 text-right">
            View All
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center py-10 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mb-2" />
            <p className="text-xs">Loading...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
            <p className="text-sm font-medium">No transactions yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div 
                key={tx.id}
                className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:border-gray-200 transition-colors"
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                  tx.type === 'credit' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                )}>
                  {tx.type === 'credit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h4 className="font-bold text-gray-900 truncate pr-2">{tx.description}</h4>
                    <span className={cn(
                      "font-bold whitespace-nowrap",
                      tx.type === 'credit' ? "text-emerald-600" : "text-gray-900"
                    )}>
                      {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{new Date(tx.date).toLocaleDateString()}</span>
                    {tx.metadata?.buildingName && (
                      <>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span className="flex items-center gap-1 truncate">
                          <Building2 className="w-3 h-3" />
                          {tx.metadata.buildingName}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
