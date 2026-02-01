import { useState, useEffect } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  Clock, 
  Lock, 
  History, 
  TrendingUp,
  CreditCard,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { agentService, type AgentWalletStats } from '../../services/agent.service';
import { cn } from '@/lib/utils';

export default function AgentWallet() {
  const [stats, setStats] = useState<AgentWalletStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const data = await agentService.getWalletStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load wallet", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWallet();
  }, []);

  const handleWithdraw = async () => {
    if (!stats || stats.available_balance < 1000) return;
    setIsWithdrawing(true);
    try {
      await agentService.withdrawFunds(stats.available_balance);
      alert("Withdrawal processed successfully to your registered bank account.");
      // Ideally refresh wallet here
    } catch(err) {
      console.error(err);
    } finally {
      setIsWithdrawing(false);
    }
  };

  if (isLoading || !stats) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-32">
       {/* Header */}
       <div className="sticky top-0 bg-gray-50 z-10 py-2">
         <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
         <p className="text-sm text-gray-500">Earnings & Commission Management</p>
       </div>

       {/* Balance Cards */}
       <div className="grid gap-4 sm:grid-cols-2">
          {/* Available */}
          <div className="bg-primary rounded-2xl p-6 text-white shadow-lg shadow-primary/20 relative overflow-hidden">
             <div className="absolute right-0 top-0 p-32 bg-white/5 rounded-full -mr-10 -mt-10" />
             <div className="relative z-10">
                <div className="flex items-center gap-2 text-indigo-100 mb-1">
                   <Wallet className="w-4 h-4" />
                   <span className="text-xs font-bold uppercase tracking-wider">Available Balance</span>
                </div>
                <div className="flex items-baseline gap-1">
                   <span className="text-3xl font-bold">₦{stats.available_balance.toLocaleString()}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-indigo-100">
                   <span>Accumulated Split (3%)</span>
                   <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" /> GTBank-1234</span>
                </div>
             </div>
          </div>

          {/* Pending / Locked */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
             <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Pending / Locked</span>
             </div>
             <div className="flex items-baseline gap-1 text-gray-900">
                <span className="text-3xl font-bold">₦{stats.pending_balance.toLocaleString()}</span>
             </div>
             
             {stats.pending_balance > 0 && (
                <div className="mt-4 bg-amber-50 rounded-lg p-3 flex gap-2 text-xs text-amber-700">
                   <Lock className="w-4 h-4 shrink-0 text-amber-500" />
                   <p className="leading-tight">
                      Some funds are locked because the Landlord (Shadow Profile) has not completed KYC.
                   </p>
                </div>
             )}
          </div>
       </div>

       {/* Analytics Teaser */}
       <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-green-100 p-2 rounded-lg text-green-700">
                <TrendingUp className="w-5 h-5" />
             </div>
             <div>
                <p className="text-sm font-bold text-gray-900">Total Earnings</p>
                <p className="text-xs text-gray-500">Lifetime commission</p>
             </div>
          </div>
          <span className="text-lg font-bold text-gray-900">₦{stats.total_earned.toLocaleString()}</span>
       </div>

       {/* Transactions */}
       <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
             <History className="w-5 h-5 text-gray-400" />
             Transaction History
          </h2>

          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
             {stats.transactions.map((tx) => (
                <div key={tx.id} className="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                   <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                      tx.type === 'commission_credit' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                   )}>
                      {tx.type === 'commission_credit' ? <ArrowUpRight className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                   </div>
                   
                   <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                         <h4 className="font-bold text-gray-900 truncate pr-2">{tx.description}</h4>
                         <span className={cn(
                            "font-bold whitespace-nowrap",
                            tx.type === 'commission_credit' ? "text-green-600" : "text-gray-900"
                         )}>
                            {tx.type === 'commission_credit' ? '+' : '-'}₦{Math.abs(tx.amount).toLocaleString()}
                         </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                         <span>{new Date(tx.created_at).toLocaleDateString()}</span>
                         <span>•</span>
                         <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" /> {tx.building_name}
                         </span>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                         <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">
                            {tx.client_name}
                         </span>
                         
                         {tx.status === 'locked' && (
                            <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold flex items-center gap-1">
                               <Lock className="w-3 h-3" /> Locked (KYC)
                            </span>
                         )}
                         {tx.status === 'pending' && (
                            <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold flex items-center gap-1">
                               <Clock className="w-3 h-3" /> Pending (Escrow)
                            </span>
                         )}
                      </div>
                   </div>
                </div>
             ))}
             {stats.transactions.length === 0 && (
                <div className="p-8 text-center text-gray-400 text-sm">No transactions yet.</div>
             )}
          </div>
       </div>

       {/* Withdraw Button */}
       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-[env(safe-area-inset-bottom)] z-50">
          <Button 
             onClick={handleWithdraw}
             disabled={stats.available_balance < 1000 || isWithdrawing}
             className={cn(
               "w-full h-14 text-lg font-bold shadow-lg",
               stats.available_balance >= 1000 ? "shadow-primary/25" : "shadow-none"
             )}
          >
             {isWithdrawing ? "Processing..." : "Withdraw Funds"}
          </Button>
          <p className="text-center text-[10px] text-gray-400 mt-2">
             Minimum withdrawal: ₦1,000. Processed to verified bank account.
          </p>
       </div>
    </div>
  );
}
