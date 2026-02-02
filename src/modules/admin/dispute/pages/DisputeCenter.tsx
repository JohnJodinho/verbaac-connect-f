import { useState, useEffect, type SVGProps } from 'react';
import { 
  Search, AlertTriangle, CheckCircle2, 
  MapPin, Shield, DollarSign, Camera, Scale, Loader2, ArrowRight
} from 'lucide-react';
import { adminService, type DisputeCase } from '../../services/admin.service';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function DisputeCenter() {
  const [queue, setQueue] = useState<DisputeCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

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

  const handleResolution = async (id: string, action: 'release_escrow' | 'refund_payer') => {
    if (!confirm(`Are you sure you want to ${action.replace('_', ' ')}? This action is irreversible.`)) return;

    setProcessing(id);
    await adminService.resolveDispute(id, action, 'Manual Resolution by Admin');
    
    // Optimistic remove
    setQueue(prev => prev.filter(req => req.id !== id));
    if (selectedId === id) setSelectedId(null);
    setProcessing(null);
  };

  const selectedCase = queue.find(q => q.id === selectedId);

  return (
    <div className="h-screen flex flex-col bg-zinc-50 overflow-hidden">
       {/* Header */}
       <div className="h-16 border-b border-zinc-200 bg-white flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
             <h1 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                <GavelIcon className="w-5 h-5 text-zinc-900" />
                Dispute Resolution
             </h1>
             <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold">
               {queue.length} Active
             </span>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Search Ref..." 
                  className="pl-9 pr-4 py-2 bg-zinc-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-zinc-300 transition-all w-48"
                />
             </div>
          </div>
       </div>

       <div className="flex-1 flex overflow-hidden">
          {/* List Sidebar */}
          <div className="w-1/3 border-r border-zinc-200 bg-white flex flex-col">
             <div className="flex-1 overflow-y-auto">
                {loading ? (
                   <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-zinc-400" /></div>
                ) : queue.length === 0 ? (
                   <div className="p-8 text-center text-zinc-500">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-500/20" />
                      <p>No active disputes.</p>
                   </div>
                ) : (
                   <div className="divide-y divide-zinc-100">
                      {queue.map((item) => (
                         <div 
                           key={item.id}
                           onClick={() => setSelectedId(item.id)}
                           className={cn(
                             "p-4 cursor-pointer hover:bg-zinc-50 transition-colors border-l-4",
                             selectedId === item.id ? "bg-zinc-50 border-red-500" : "border-transparent"
                           )}
                         >
                            <div className="flex justify-between items-start mb-1">
                               <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded">
                                  {item.transaction_ref}
                               </span>
                               <span className="text-xs text-red-600 font-bold flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  DISPUTED
                               </span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                               <div>
                                  <h4 className="font-bold text-zinc-900">₦{item.amount.toLocaleString()}</h4>
                                  <p className="text-xs text-zinc-500">{item.type.toUpperCase()}</p>
                               </div>
                               <ArrowRight className="w-4 h-4 text-zinc-300" />
                            </div>
                         </div>
                      ))}
                   </div>
                )}
             </div>
          </div>

          {/* Evidence Vault */}
          <div className="flex-1 bg-zinc-50 flex flex-col overflow-hidden">
             {selectedCase ? (
                <div className="flex-1 overflow-y-auto p-8">
                   
                   {/* Case Header */}
                   <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 mb-6">
                      <div className="flex justify-between items-center mb-6">
                         <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-50 rounded-lg text-red-600">
                               <Scale className="w-6 h-6" />
                            </div>
                            <div>
                               <h2 className="text-2xl font-bold text-zinc-900">Case #{selectedCase.id}</h2>
                               <p className="text-sm text-zinc-500">Opened {new Date(selectedCase.created_at).toLocaleDateString()}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <h3 className="text-xl font-bold text-zinc-900">₦{selectedCase.amount.toLocaleString()}</h3>
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Escrow Held</p>
                         </div>
                      </div>

                      {/* Financial Split Visualization */}
                      <div className="h-4 bg-zinc-100 rounded-full overflow-hidden flex mb-2">
                         <div className="h-full bg-emerald-500 w-[88%]" title="Provider Share (88%)"></div>
                         <div className="h-full bg-zinc-900 w-[12%]" title="Platform Fee (12%)"></div>
                      </div>
                      <div className="flex justify-between text-xs font-medium text-zinc-500">
                         <span>Provider Share: ₦{selectedCase.split_breakdown.provider_share.toLocaleString()}</span>
                         <span>Verbacc Fee: ₦{selectedCase.split_breakdown.platform_fee.toLocaleString()}</span>
                      </div>
                   </div>

                   {/* Parties & Evidence Grid */}
                   <div className="grid grid-cols-2 gap-6 mb-6">
                      {/* Parties */}
                      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
                         <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                            <Shield className="w-4 h-4" /> Involved Parties
                         </h3>
                         <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-zinc-50 rounded-lg">
                               <div>
                                  <p className="text-xs text-zinc-500 uppercase">Payer (Buyer/Tenant)</p>
                                  <p className="font-bold text-zinc-900">{selectedCase.parties.payer.name}</p>
                               </div>
                               <span className="text-xs bg-white border border-zinc-200 px-2 py-1 rounded">
                                  {selectedCase.parties.payer.role}
                               </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-zinc-50 rounded-lg">
                               <div>
                                  <p className="text-xs text-zinc-500 uppercase">Payee (Provider)</p>
                                  <p className="font-bold text-zinc-900">{selectedCase.parties.payee.name}</p>
                               </div>
                               <span className="text-xs bg-white border border-zinc-200 px-2 py-1 rounded">
                                  {selectedCase.parties.payee.role}
                               </span>
                            </div>
                         </div>
                      </div>

                      {/* Evidence Scores */}
                      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
                         <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                            <Camera className="w-4 h-4" /> Evidence Analysis
                         </h3>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-zinc-50 rounded-lg text-center">
                               <p className="text-2xl font-bold text-zinc-900">{selectedCase.evidence.gps_match_score}%</p>
                               <p className="text-xs text-zinc-500 uppercase mt-1 flex items-center justify-center gap-1">
                                  <MapPin className="w-3 h-3" /> GPS Match
                               </p>
                            </div>
                            <div className="p-4 bg-zinc-50 rounded-lg text-center">
                               <p className={cn(
                                  "text-lg font-bold uppercase",
                                  selectedCase.evidence.ai_confidence_tier === 'high' ? "text-emerald-600" : "text-yellow-600"
                               )}>
                                  {selectedCase.evidence.ai_confidence_tier}
                               </p>
                               <p className="text-xs text-zinc-500 uppercase mt-1">AI Confidence</p>
                            </div>
                         </div>
                         <div className="mt-4 pt-4 border-t border-zinc-100">
                             <p className="text-xs text-zinc-500">
                                Verified by <strong>{selectedCase.evidence.ambassador_name}</strong>
                             </p>
                         </div>
                      </div>
                   </div>

                   {/* Media Gallery */}
                   <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 mb-24">
                      <h3 className="font-bold text-zinc-900 mb-4">Evidence Media</h3>
                      <div className="grid grid-cols-3 gap-4">
                         {selectedCase.evidence.media_urls.map((url, i) => (
                            <div key={i} className="aspect-video bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200">
                               <img src={url} className="w-full h-full object-cover" alt={`Evidence ${i+1}`} />
                            </div>
                         ))}
                      </div>
                   </div>

                   {/* Action Footer */}
                   <div className="bg-white border-t border-zinc-200 p-6 -mx-8 -mb-8 sticky bottom-0 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
                      <div className="text-xs text-zinc-500">
                         Action will be logged by <strong>ADM-2026-X</strong>
                      </div>
                      <div className="flex gap-4">
                         <Button 
                           variant="outline" 
                           className="border-red-200 text-red-600 hover:bg-red-50"
                           onClick={() => handleResolution(selectedCase.id, 'refund_payer')}
                           disabled={!!processing}
                         >
                            {processing === selectedCase.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Refund Payer (Revert)'}
                         </Button>
                         <Button 
                           className="bg-emerald-600 hover:bg-emerald-700 text-white"
                           onClick={() => handleResolution(selectedCase.id, 'release_escrow')}
                           disabled={!!processing}
                         >
                            {processing === selectedCase.id ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                               <>
                                  <DollarSign className="w-4 h-4 mr-2" />
                                  Release Funds to Provider
                               </>
                            )}
                         </Button>
                      </div>
                   </div>

                </div>
             ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-zinc-400">
                    <Scale className="w-16 h-16 text-zinc-200 mb-4" />
                    <p>Select a disputed transaction to review evidence.</p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
}

function GavelIcon(props: SVGProps<SVGSVGElement>) {
   return (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
         <path d="m14 13-7.5 7.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L11 10"/>
         <path d="m16 16 6-6"/>
         <path d="m8 8 6-6"/>
         <path d="m9 7 8 8"/>
         <path d="m21 11-8-8"/>
      </svg>
   )
}
