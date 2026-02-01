import { useState, useEffect } from 'react';
import { 
  TrendingUp, DollarSign, Wallet, AlertCircle, 
  ArrowUpRight, Download, Sliders, Loader2
} from 'lucide-react';
import { adminService, type TreasuryTransaction } from '../../services/admin.service';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function TreasuryHub() {
  const [ledger, setLedger] = useState<TreasuryTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'platform' | 'provider'>('all');
  
  // Split Adjustment State
  const [adjustingTx, setAdjustingTx] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadTreasury();
  }, []);

  const loadTreasury = async () => {
    setLoading(true);
    const data = await adminService.getTreasuryData();
    setLedger(data);
    setLoading(false);
  };

  const filteredLedger = ledger.filter(tx => {
    if (filter === 'platform') return ['verbaac_10', 'verbaac_7'].includes(tx.split_category);
    if (filter === 'provider') return ['landlord_88', 'agent_2', 'ambassador_1'].includes(tx.split_category);
    return true;
  });

  const totalRevenue = ledger
    .filter(tx => ['verbaac_10', 'verbaac_7'].includes(tx.split_category))
    .reduce((acc, tx) => acc + tx.amount, 0);

  const handleAdjustSplit = async () => {
    if (!adjustingTx || !resolutionNote) return;
    setIsProcessing(true);
    await adminService.updateSplitRatio(adjustingTx, 'manual_adjustment', resolutionNote);
    
    // Refresh
    await loadTreasury();
    setAdjustingTx(null);
    setResolutionNote('');
    setIsProcessing(false);
  };

  /* --- Simple SVG Chart Component --- */
  const RevenueChart = () => {
     const dataPoints = [30, 45, 40, 50, 65, 55, 70, 85, 90, 100]; // Mock monthly trend
     const max = Math.max(...dataPoints);
     const points = dataPoints.map((val, i) => {
        const x = (i / (dataPoints.length - 1)) * 100;
        const y = 100 - (val / max) * 100;
        return `${x},${y}`;
     }).join(' ');

     return (
       <div className="h-48 w-full relative mt-4">
         <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
            {/* Grid Lines */}
            <line x1="0" y1="25" x2="100" y2="25" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2" />
            <line x1="0" y1="75" x2="100" y2="75" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2" />
            
            {/* Line Graph */}
            <polyline
               points={points}
               fill="none"
               stroke="#4f46e5"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round"
               className="drop-shadow-lg"
            />
            {/* Area Fill */}
            <polygon
               points={`0,100 ${points} 100,100`}
               fill="url(#gradient)"
               opacity="0.2"
            />
            <defs>
               <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
               </linearGradient>
            </defs>
         </svg>
         {/* Axis Labels (Mock) */}
         <div className="flex justify-between text-[10px] text-slate-400 mt-2">
            <span>Day 1</span>
            <span>Day 15</span>
            <span>Day 30</span>
         </div>
       </div>
     );
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
       {/* Treasury Header */}
       <header className="p-8 pb-4 shrink-0">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <Wallet className="w-6 h-6 text-emerald-600" /> Treasury Hub
          </h1>
          <p className="text-slate-500 mt-1">Platform revenue ledger and split governance.</p>
       </header>

       <div className="flex-1 overflow-y-auto p-8 pt-0 flex flex-col gap-6">
          {/* Top Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {/* Total Revenue Card */}
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start">
                   <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Platform Revenue</span>
                      <div className="text-3xl font-bold text-slate-900 mt-2">₦{totalRevenue.toLocaleString()}</div>
                      <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-2">
                         <TrendingUp className="w-3 h-3" /> +12.5% vs last month
                      </div>
                   </div>
                   <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                      <DollarSign className="w-6 h-6" />
                   </div>
                </div>
                <RevenueChart />
             </div>

             {/* Held in Escrow */}
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Escrow (Held)</span>
                   <div className="text-3xl font-bold text-slate-900 mt-2">₦890,200</div>
                   <p className="text-xs text-slate-500 mt-2">Funds awaiting verification or payout.</p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                   <Button variant="outline" className="w-full text-xs">View Escrow Audit</Button>
                </div>
             </div>

             {/* Split Health */}
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Split Distribution</span>
                <div className="mt-6 space-y-4">
                   {[
                      { label: 'Providers (Landlords/Sellers)', pct: 88, color: 'bg-indigo-500' },
                      { label: 'Verbaac Commission', pct: 10, color: 'bg-emerald-500' },
                      { label: 'Ambassadors / Agents', pct: 2, color: 'bg-amber-500' },
                   ].map((item) => (
                      <div key={item.label}>
                         <div className="flex justify-between text-xs mb-1">
                            <span className="font-bold text-slate-700">{item.label}</span>
                            <span className="text-slate-500">{item.pct}%</span>
                         </div>
                         <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className={cn("h-full", item.color)} style={{ width: `${item.pct}%` }} />
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Ledger Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col flex-1 min-h-[400px]">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                   <ArrowUpRight className="w-4 h-4" /> Transaction Ledger
                </h3>
                <div className="flex gap-2">
                   <div className="flex bg-slate-100 p-1 rounded-lg">
                      {['all', 'platform', 'provider'].map((f) => (
                         <button
                           key={f}
                           onClick={() => setFilter(f as 'all' | 'platform' | 'provider')}
                           className={cn(
                             "px-3 py-1 text-xs font-bold rounded-md capitalize transition-all",
                             filter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                           )}
                         >
                            {f}
                         </button>
                      ))}
                   </div>
                   <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" /> Export
                   </Button>
                </div>
             </div>

             <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                      <tr>
                         <th className="p-4">Reference</th>
                         <th className="p-4">Date</th>
                         <th className="p-4">Split Category</th>
                         <th className="p-4 text-right">Amount</th>
                         <th className="p-4">Status</th>
                         <th className="p-4 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 text-sm">
                      {loading ? (
                         <tr><td colSpan={6} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-300" /></td></tr>
                      ) : filteredLedger.map((tx) => (
                         <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 font-mono text-slate-600">{tx.reference}</td>
                            <td className="p-4 text-slate-500">{new Date(tx.created_at).toLocaleDateString()}</td>
                            <td className="p-4">
                               <span className={cn(
                                 "px-2 py-1 rounded text-[10px] font-bold uppercase",
                                 tx.split_category.startsWith('verbaac') ? "bg-emerald-100 text-emerald-700" :
                                 "bg-indigo-50 text-indigo-700"
                               )}>
                                  {tx.split_category.replace('_', ' ').toUpperCase()}
                               </span>
                            </td>
                            <td className="p-4 text-right font-bold text-slate-900">₦{tx.amount.toLocaleString()}</td>
                            <td className="p-4">
                               <span className={cn(
                                 "flex items-center gap-1 w-fit px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                                 tx.status === 'held' ? "bg-amber-100 text-amber-700" :
                                 tx.status === 'released' ? "bg-blue-100 text-blue-700" :
                                 "bg-slate-100 text-slate-500"
                               )}>
                                  {tx.status === 'held' && <AlertCircle className="w-3 h-3" />}
                                  {tx.status}
                               </span>
                            </td>
                            <td className="p-4 text-right">
                               {tx.status === 'held' && (
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="text-indigo-600 hover:bg-indigo-50"
                                    onClick={() => setAdjustingTx(tx.id)}
                                  >
                                     <Sliders className="w-4 h-4 mr-1" /> Adjust
                                  </Button>
                               )}
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
       </div>

       {/* Adjust Split Modal */}
       {adjustingTx && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full animate-in zoom-in-95 duration-200">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Adjust Manual Split / Fee</h2>
                <div className="bg-amber-50 p-3 rounded-lg text-xs text-amber-700 mb-4 flex gap-2">
                   <AlertCircle className="w-4 h-4 shrink-0" />
                   This action overrides the default contract logic. A secure audit log will be created.
                </div>
                
                <div className="space-y-4">
                   <div>
                      <label className="text-xs font-bold text-slate-500 mb-1 block">Correction / Note (Mandatory)</label>
                      <textarea 
                        className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        rows={3}
                        placeholder="Reason for adjustment (e.g. promotional waiver, error correction)..."
                        value={resolutionNote}
                        onChange={(e) => setResolutionNote(e.target.value)}
                      />
                   </div>
                   
                   <div className="flex gap-2 pt-2">
                      <Button variant="outline" className="flex-1" onClick={() => setAdjustingTx(null)}>Cancel</Button>
                      <Button 
                        className="flex-1 bg-indigo-600 text-white" 
                        disabled={!resolutionNote || isProcessing}
                        onClick={handleAdjustSplit}
                      >
                         {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Adjustment'}
                      </Button>
                   </div>
                </div>
             </div>
          </div>
       )}
    </div>
  );
}
