import { useState, useEffect } from 'react';
import { 
  Search, Filter, CheckCircle2, XCircle, 
  User, FileText, Building, Briefcase, Eye, Loader2, MapPin
} from 'lucide-react';
import { adminService, type VerificationRequest } from '../../services/admin.service';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function VerificationCenter() {
  const [queue, setQueue] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [batchSelection, setBatchSelection] = useState<string[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    setLoading(true);
    const data = await adminService.getVerificationQueue();
    setQueue(data);
    if (data.length > 0 && !selectedId) {
      setSelectedId(data[0].id);
    }
    setLoading(false);
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    if (action === 'reject' && !rejectReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    setProcessing(id);
    await adminService.processVerification(id, action, action === 'reject' ? rejectReason : undefined);
    
    // Optimistic update
    setQueue(prev => prev.filter(req => req.id !== id));
    
    if (selectedId === id) {
      const remaining = queue.filter(req => req.id !== id);
      setSelectedId(remaining.length > 0 ? remaining[0].id : null);
    }
    
    setProcessing(null);
    setRejectReason('');
  };

  // Filter Logic
  const filteredQueue = queue.filter(req => 
    req.full_name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    req.id.toLowerCase().includes(filterQuery.toLowerCase()) ||
    req.persona_type.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const selectedItem = queue.find(q => q.id === selectedId);

  const toggleBatchSelect = (id: string) => {
    setBatchSelection(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-50 overflow-hidden">
       {/* Top Header */}
       <div className="h-16 border-b border-zinc-200 bg-white flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
             <h1 className="text-xl font-bold text-zinc-900">Verification Center</h1>
             <span className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full text-xs font-bold">
               {queue.length} Pending
             </span>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Search ID, Name or Role..." 
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-zinc-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-zinc-300 transition-all w-64"
                />
             </div>
             <button className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-lg">
                <Filter className="w-5 h-5" />
             </button>
          </div>
       </div>

       {/* Main Split View */}
       <div className="flex-1 flex overflow-hidden">
          
          {/* Left: Verification Queue List */}
          <div className="w-1/3 border-r border-zinc-200 bg-white flex flex-col">
             <div className="flex-1 overflow-y-auto">
               {loading ? (
                 <div className="p-8 flex justify-center text-zinc-400">
                    <Loader2 className="w-6 h-6 animate-spin" />
                 </div>
               ) : queue.length === 0 ? (
                 <div className="p-8 text-center text-zinc-500">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-500/20" />
                    <p>All cleared! No pending verifications.</p>
                 </div>
               ) : (
                 <div className="divide-y divide-zinc-100">
                    {filteredQueue.map((req) => (
                       <div 
                         key={req.id}
                         onClick={() => setSelectedId(req.id)}
                         className={cn(
                           "p-4 cursor-pointer hover:bg-zinc-50 transition-colors border-l-4 group relative",
                           selectedId === req.id ? "bg-zinc-50 border-zinc-900" : "border-transparent"
                         )}
                       >
                          <div className="absolute top-4 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <input 
                               type="checkbox" 
                               checked={batchSelection.includes(req.id)}
                               onChange={(e) => {
                                  e.stopPropagation();
                                  toggleBatchSelect(req.id);
                               }}
                             />
                          </div>
                          <div className="flex justify-between items-start mb-1 pl-4">
                             <div className="flex items-center gap-2">
                                <span className={cn(
                                   "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                                   req.persona_type === 'landlord' ? "bg-purple-100 text-purple-700" :
                                   req.persona_type === 'agent' ? "bg-blue-100 text-blue-700" :
                                   "bg-orange-100 text-orange-700"
                                )}>
                                   {req.persona_type}
                                </span>
                                <span className="text-xs text-zinc-400 font-mono">
                                   {new Date(req.submitted_at).toLocaleDateString()}
                                </span>
                             </div>
                             {processing === req.id && <Loader2 className="w-3 h-3 animate-spin text-zinc-400" />}
                          </div>
                          <h3 className="font-bold text-zinc-900 truncate pl-4">{req.full_name}</h3>
                          <p className="text-sm text-zinc-500 truncate pl-4">{req.metadata.email}</p>
                       </div>
                    ))}
                 </div>
               )}
             </div>
             
             {/* Batch Actions Footer */}
             <div className="p-4 border-t border-zinc-200 bg-zinc-50/50">
                <Button variant="outline" className="w-full text-xs h-9" disabled={batchSelection.length === 0}>
                   {batchSelection.length > 0 ? `Approve Selected (${batchSelection.length})` : 'Select Multiple'}
                </Button>
             </div>
          </div>

          {/* Right: Detail Inspector */}
          <div className="flex-1 bg-zinc-50 flex flex-col overflow-hidden">
             {selectedItem ? (
                <div className="flex-1 overflow-y-auto p-8">
                   {/* Profile Summary Card */}
                   <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 mb-8">
                      <div className="flex justify-between items-start">
                         <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-300">
                               <User className="w-8 h-8" />
                            </div>
                            <div>
                               <h2 className="text-2xl font-bold text-zinc-900">{selectedItem.full_name}</h2>
                               <div className="flex items-center gap-4 text-sm text-zinc-500 mt-1">
                                  <span className="flex items-center gap-1">
                                     <Briefcase className="w-4 h-4" />
                                     {selectedItem.persona_type.toUpperCase()}
                                  </span>
                                  <span className="flex items-center gap-1">
                                     <MapPin className="w-4 h-4" />
                                     {selectedItem.metadata.location}
                                  </span>
                               </div>
                            </div>
                         </div>
                         <div className="text-right">
                            <span className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Status</span>
                            <span className="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                               <Loader2 className="w-3 h-3" />
                               PENDING REVIEW
                            </span>
                         </div>
                      </div>
                   </div>

                   {/* Document Grid */}
                   <div className="grid grid-cols-2 gap-6 mb-8">
                      <div className="space-y-3">
                         <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-zinc-700 flex items-center gap-2">
                               <FileText className="w-4 h-4" />
                               Identity Document ({selectedItem.documents.id_type})
                            </label>
                            <button className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">
                               <Eye className="w-3 h-3" /> View Original
                            </button>
                         </div>
                         <div className="aspect-[3/2] bg-zinc-900 rounded-lg overflow-hidden border border-zinc-200 relative group">
                            <img 
                              src={selectedItem.documents.id_card_url} 
                              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                              alt="ID Document" 
                            />
                         </div>
                      </div>

                      {(selectedItem.documents.property_proof_url || selectedItem.documents.business_reg_url) && (
                         <div className="space-y-3">
                            <div className="flex items-center justify-between">
                               <label className="text-sm font-bold text-zinc-700 flex items-center gap-2">
                                  <Building className="w-4 h-4" />
                                  {selectedItem.persona_type === 'agent' ? 'Business Registration' : 'Property Proof'}
                               </label>
                               <button className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">
                                  <Eye className="w-3 h-3" /> View Original
                               </button>
                            </div>
                            <div className="aspect-[3/2] bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200 relative group flex items-center justify-center">
                               <img 
                                 src={selectedItem.documents.property_proof_url || selectedItem.documents.business_reg_url} 
                                 className="w-full h-full object-cover"
                                 alt="Proof Document" 
                               />
                            </div>
                         </div>
                      )}
                   </div>

                   {/* Action Bar */}
                   <div className="bg-white border-t border-zinc-200 p-6 -mx-8 -mb-8 sticky bottom-0 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                      <div className="w-1/2 pr-4">
                         <input 
                           type="text" 
                           placeholder="Reason for rejection (Optional)..." 
                           value={rejectReason}
                           onChange={(e) => setRejectReason(e.target.value)}
                           className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                         />
                      </div>
                      <div className="flex items-center gap-3">
                         <Button 
                           variant="outline" 
                           className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                           onClick={() => handleAction(selectedItem.id, 'reject')}
                           disabled={!!processing}
                         >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                         </Button>
                         <Button 
                           className="bg-zinc-900 hover:bg-zinc-800 text-white min-w-[140px]"
                           onClick={() => handleAction(selectedItem.id, 'approve')}
                           disabled={!!processing}
                         >
                            {processing === selectedItem.id ? (
                               <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                               <>
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                  approve & Verify
                               </>
                            )}
                         </Button>
                      </div>
                   </div>

                </div>
             ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-zinc-400">
                   <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
                      <User className="w-10 h-10 text-zinc-300" />
                   </div>
                   <h3 className="text-lg font-medium text-zinc-900">Select a request to review</h3>
                   <p className="text-sm max-w-xs text-center mt-2">
                      Click on any item from the queue on the left to inspect documents and take action.
                   </p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
}
