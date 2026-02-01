import { useState, useEffect } from 'react';
import { 
  Search, ShieldAlert, Gavel, AlertTriangle, 
  MapPin, CheckCircle2, User, DollarSign, FileText, 
  Loader2, ArrowRight
} from 'lucide-react';
import { adminService, type DisputeCase } from '../../services/admin.service';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function DisputeResolutionHub() {
  const [queue, setQueue] = useState<DisputeCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{id: string, action: 'release_escrow' | 'refund_payer'} | null>(null);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    setLoading(true);
    const data = await adminService.getDisputeQueue();
    setQueue(data);
    if (data.length > 0 && !selectedId) {
      setSelectedId(data[0].id);
    }
    setLoading(false);
  };

  const initiateResolution = (id: string, action: 'release_escrow' | 'refund_payer') => {
     setPendingAction({ id, action });
     setIsModalOpen(true);
  };

  const confirmResolution = async () => {
    if (!pendingAction) return;
    
    setProcessing(pendingAction.id);
    await adminService.resolveDispute(pendingAction.id, pendingAction.action, 'Manual Resolution via Hub');
    
    // Optimistic update
    setQueue(prev => prev.filter(req => req.id !== pendingAction.id));
    if (selectedId === pendingAction.id) setSelectedId(null);
    
    setProcessing(null);
    setIsModalOpen(false);
    setPendingAction(null);
  };

  const selectedCase = queue.find(q => q.id === selectedId);

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden font-sans">
       {/* High-Level Header */}
       <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-red-50 rounded-lg">
                <Gavel className="w-5 h-5 text-red-600" />
             </div>
             <div>
                <h1 className="text-lg font-bold text-slate-900 leading-tight">Dispute Resolution Hub</h1>
                <p className="text-xs text-slate-500">Global Financial Arbitration Console</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-xs font-bold border border-red-100">
                <AlertTriangle className="w-3 h-3" />
                {queue.length} Critical Cases
             </div>
             <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search TX Ref ID..." 
                  className="pl-9 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-100 transition-all w-64 outline-none placeholder:text-slate-400 font-medium"
                />
             </div>
          </div>
       </header>

       <div className="flex-1 flex overflow-hidden">
          {/* Left Pane: Ledger & Queue */}
          <aside className="w-[400px] bg-white border-r border-slate-200 flex flex-col z-0">
             <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contested Transaction Feed</h2>
             </div>
             <div className="flex-1 overflow-y-auto">
                {loading ? (
                   <div className="p-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
                ) : queue.length === 0 ? (
                   <div className="p-10 text-center text-slate-400">
                      <CheckCircle2 className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">All clear. No disputes pending.</p>
                   </div>
                ) : (
                   <div className="divide-y divide-slate-100">
                      {queue.map((item) => (
                         <div 
                           key={item.id}
                           onClick={() => setSelectedId(item.id)}
                           className={cn(
                             "p-4 cursor-pointer hover:bg-slate-50 transition-all border-l-4 group",
                             selectedId === item.id ? "bg-slate-50 border-red-500 shadow-inner" : "border-transparent"
                           )}
                         >
                            <div className="flex justify-between items-start mb-2">
                               <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                     {item.transaction_ref}
                                  </span>
                                  {item.type === 'housing' ? (
                                     <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">HOUSING</span>
                                  ) : (
                                     <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">MARKET</span>
                                  )}
                               </div>
                               <span className="text-xs font-bold text-slate-900">₦{(item.amount / 1000).toFixed(0)}k</span>
                            </div>
                            
                            <h3 className="font-bold text-slate-800 text-sm mb-1 truncate">{item.parties.payee.name} vs {item.parties.payer.name}</h3>
                            <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                               Flagged by {item.evidence.ambassador_name} • Match Score: {item.evidence.gps_match_score}%
                            </p>

                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                               <span>{new Date(item.created_at).toLocaleDateString()}</span>
                               <span className="flex items-center gap-1 group-hover:text-red-500 transition-colors">
                                  Review <ArrowRight className="w-3 h-3" />
                               </span>
                            </div>
                         </div>
                      ))}
                   </div>
                )}
             </div>
          </aside>

          {/* Right Pane: Evidence Vault */}
          <main className="flex-1 bg-slate-50/50 flex flex-col overflow-hidden relative">
             {selectedCase ? (
                <div className="flex-1 overflow-y-auto p-8">
                   
                   {/* Top Summary Card */}
                   <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
                      <div className="flex justify-between items-start mb-6">
                         <div>
                            <div className="flex items-center gap-3 mb-1">
                               <h2 className="text-2xl font-bold text-slate-900">Case #{selectedCase.id}</h2>
                               <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold border border-red-200 animate-pulse">
                                  ACTION REQUIRED
                               </span>
                            </div>
                            <p className="text-sm text-slate-500 flex items-center gap-2">
                               <FileText className="w-4 h-4" />
                               Ref: {selectedCase.transaction_ref} • 
                               Link: <span className="font-mono text-slate-700">{selectedCase.lineage.listing_id || selectedCase.lineage.item_id}</span>
                            </p>
                         </div>
                         <div className="text-right">
                            <div className="text-3xl font-bold text-slate-900 tracking-tight">
                               ₦{selectedCase.amount.toLocaleString()}
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Escrow Locked</p>
                         </div>
                      </div>

                      {/* Ledger Split Visualization */}
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                         <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                             <DollarSign className="w-3 h-3" /> Universal Ledger Breakdown
                         </h3>
                         <div className="h-6 w-full flex rounded overflow-hidden mb-2 shadow-sm">
                            <div className="h-full bg-emerald-500 w-[88%] relative group">
                               <span className="absolute inset-0 flex items-center justify-end px-2 text-[10px] font-bold text-white/90">Provider (88%)</span>
                            </div>
                            <div className="h-full bg-slate-800 w-[12%] relative group">
                               <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/90">12%</span>
                            </div>
                         </div>
                         <div className="flex justify-between text-xs font-mono font-medium text-slate-600">
                            <span>Payout: ₦{selectedCase.split_breakdown.provider_share.toLocaleString()}</span>
                            <span>Platform Fee: ₦{selectedCase.split_breakdown.platform_fee.toLocaleString()}</span>
                         </div>
                      </div>
                   </div>

                   {/* Context Grid */}
                   <div className="grid grid-cols-12 gap-6 mb-8">
                      {/* Left: Map & GPS */}
                      <div className="col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                         <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                               <MapPin className="w-4 h-4 text-slate-500" /> 
                               Site Visit Verification
                            </h3>
                            <span className={cn(
                               "text-xs font-bold px-2 py-0.5 rounded border",
                               selectedCase.evidence.gps_match_score > 90 
                                 ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                 : "bg-red-50 text-red-700 border-red-200"
                            )}>
                               GPS Match: {selectedCase.evidence.gps_match_score}%
                            </span>
                         </div>
                         {/* Mock Map Visualization */}
                         <div className="flex-1 bg-slate-200 relative min-h-[300px]">
                            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none" 
                               style={{backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
                            </div>
                            {/* Pin */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                               <div className="w-8 h-8 rounded-full bg-red-500/20 animate-ping absolute"></div>
                               <div className="w-3 h-3 rounded-full bg-red-600 border-2 border-white shadow-lg relative z-10"></div>
                               <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-[10px] font-bold whitespace-nowrap">
                                  {selectedCase.evidence.check_in_geom.lat}, {selectedCase.evidence.check_in_geom.lng}
                               </div>
                            </div>
                         </div>
                         <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
                            <span>Ambassador: <strong>{selectedCase.evidence.ambassador_name}</strong></span>
                            <span>Report ID: <strong>{selectedCase.evidence.report_id}</strong></span>
                         </div>
                      </div>

                      {/* Right: Parties */}
                      <div className="col-span-4 space-y-4">
                         <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                               <User className="w-3 h-3" /> Payer
                            </h3>
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                                  {selectedCase.parties.payer.name.charAt(0)}
                               </div>
                               <div>
                                  <p className="font-bold text-slate-900 text-sm">{selectedCase.parties.payer.name}</p>
                                  <p className="text-xs text-slate-500">{selectedCase.parties.payer.role}</p>
                                  <p className="text-[10px] font-mono text-slate-400 mt-0.5">{selectedCase.parties.payer.id}</p>
                               </div>
                            </div>
                         </div>

                         <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full -mr-8 -mt-8"></div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                               <ShieldAlert className="w-3 h-3" /> Payee (Provider)
                            </h3>
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                                  {selectedCase.parties.payee.name.charAt(0)}
                               </div>
                               <div>
                                  <p className="font-bold text-slate-900 text-sm">{selectedCase.parties.payee.name}</p>
                                  <p className="text-xs text-slate-500">{selectedCase.parties.payee.role}</p>
                                  <p className="text-[10px] font-mono text-slate-400 mt-0.5">{selectedCase.parties.payee.id}</p>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Media Gallery */}
                   <div className="mb-24">
                      <h3 className="font-bold text-slate-900 mb-4">Live Evidence Capture</h3>
                      <div className="grid grid-cols-4 gap-4">
                         {selectedCase.evidence.media_urls.map((url, i) => (
                            <div key={i} className="aspect-square bg-slate-100 rounded-lg border border-slate-200 overflow-hidden relative group">
                               <img src={url} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" alt="Evidence" />
                               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="text-white text-xs font-bold border border-white/50 px-2 py-1 rounded backdrop-blur-sm">View</span>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>

                </div>
             ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                    <ShieldAlert className="w-24 h-24 mb-4 opacity-20" />
                    <p className="text-lg font-medium text-slate-400">Select a case to begin arbitration</p>
                </div>
             )}

             {/* Sticky Action Footer */}
             <div className="bg-white border-t border-slate-200 p-6 absolute bottom-0 inset-x-0 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] z-20">
                <div className="flex items-center justify-between max-w-5xl mx-auto">
                   <div className="text-xs text-slate-500">
                      Logged in as <strong>ADM-2026-X</strong> • <span className="text-slate-400">Actions are immutable</span>
                   </div>
                   <div className="flex gap-4">
                      <Button 
                         variant="outline" 
                         className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-red-600 hover:border-red-200"
                         disabled={!selectedCase || !!processing}
                         onClick={() => selectedCase && initiateResolution(selectedCase.id, 'refund_payer')}
                      >
                         Refund Payer (Void Transaction)
                      </Button>
                      <Button 
                         className="bg-slate-900 hover:bg-slate-800 text-white min-w-[200px]"
                         disabled={!selectedCase || !!processing}
                         onClick={() => selectedCase && initiateResolution(selectedCase.id, 'release_escrow')}
                      >
                         {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Release Funds to Provider'}
                      </Button>
                   </div>
                </div>
             </div>
          </main>
       </div>

       {/* Confirmation Modal */}
       {isModalOpen && pendingAction && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6">
                   <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center mb-4",
                      pendingAction.action === 'release_escrow' ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                   )}>
                      {pendingAction.action === 'release_escrow' ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {pendingAction.action === 'release_escrow' ? 'Confirm Fund Release' : 'Confirm Refund'}
                   </h3>
                   <p className="text-sm text-slate-500 leading-relaxed mb-6">
                      {pendingAction.action === 'release_escrow' 
                         ? "You are about to release the held escrow funds to the provider. This will credit their wallet immediately. This action cannot be undone."
                         : "You are about to refund the transaction to the payer. This will void the escrow and nullify the verification report. This action cannot be undone."
                      }
                   </p>
                   
                   <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-6">
                      <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1">Target Transaction</p>
                      <p className="font-bold text-slate-900 font-mono text-sm">{queue.find(q => q.id === pendingAction.id)?.transaction_ref}</p>
                   </div>

                   <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                      <Button 
                         className={cn("flex-1 text-white", pendingAction.action === 'release_escrow' ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700")}
                         onClick={confirmResolution}
                      >
                         Confirm Resolution
                      </Button>
                   </div>
                </div>
             </div>
          </div>
       )}
    </div>
  );
}
