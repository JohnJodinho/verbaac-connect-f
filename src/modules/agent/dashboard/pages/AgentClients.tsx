import { useState, useEffect } from 'react';
import { Search, Plus, Users, Building2, Wallet, AlertTriangle, ShieldCheck, Ghost } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { agentService, type ClientProfile } from '../../services/agent.service';
import AddShadowClientDialog from '../components/AddShadowClientDialog';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function AgentClients() {
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'shadow'>('all');

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const data = await agentService.getClients();
      setClients(data);
    } catch (error) {
      console.error("Failed to fetch clients", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleCreateShadowClient = async (data: { full_name: string; email: string; phone: string }) => {
    await agentService.createShadowClient(data);
    await fetchClients(); // Refresh list
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          client.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || client.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sticky top-0 bg-gray-50 z-10 py-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients Hub</h1>
          <p className="text-sm text-gray-500">Manage your landlord portfolio.</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all">
          <Plus className="w-5 h-5 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        </div>
        
        <div className="flex bg-white p-1 rounded-xl border border-gray-200">
          <button 
            onClick={() => setFilter('all')}
            className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all", filter === 'all' ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-900")}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('active')}
            className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all", filter === 'active' ? "bg-green-50 text-green-700" : "text-gray-500 hover:text-gray-900")}
          >
            Active
          </button>
          <button 
            onClick={() => setFilter('shadow')}
            className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all", filter === 'shadow' ? "bg-amber-50 text-amber-700" : "text-gray-500 hover:text-gray-900")}
          >
            Shadow
          </button>
        </div>
      </div>

      {/* Clients List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : filteredClients.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            >
              {/* Card Header */}
              <div className="p-4 border-b border-gray-50 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
                    client.status === 'active' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  )}>
                    {client.full_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{client.full_name}</h3>
                    <p className="text-xs text-gray-500">{client.email}</p>
                  </div>
                </div>
                {client.status === 'active' ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-medium border border-green-100">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-medium border border-amber-100">
                    <Ghost className="w-3 h-3 mr-1" /> Shadow
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="p-4 grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> Managed Props
                  </span>
                  <span className="text-sm font-semibold text-gray-900">{client.managed_buildings_count} buildings</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Users className="w-3 h-3" /> Units/Tenants
                  </span>
                  <span className="text-sm font-semibold text-gray-900">{client.managed_units_count} units</span>
                </div>
              </div>

              {/* Wallet/Gate */}
              <div className="px-4 pb-4">
                 <div className={cn(
                   "rounded-lg p-3 text-sm flex items-start gap-3",
                   client.status === 'active' ? "bg-gray-50" : "bg-red-50 border border-red-100"
                 )}>
                   <Wallet className={cn("w-4 h-4 mt-0.5", client.status === 'active' ? "text-gray-400" : "text-red-500")} />
                   <div className="flex-1">
                     <p className="text-gray-500 text-xs mb-1">Pending Balance</p>
                     <p className={cn("font-bold", client.status === 'active' ? "text-gray-900" : "text-red-700")}>
                       ₦{client.wallet_balance.pending.toLocaleString()}
                     </p>
                     {client.status === 'shadow' && client.wallet_balance.pending > 0 && (
                       <div className="mt-3 flex items-center justify-between bg-red-50 p-2 rounded-lg border border-red-100">
                          <div className="flex items-center gap-2 text-xs text-red-700 font-medium">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <span>Payout Locked:</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                               agentService.sendKYCInvite(client.id);
                               alert(`KYC Invitation sent to ${client.email}`);
                            }}
                            className="bg-white border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-7 text-xs"
                          >
                             Send KYC Wizard
                          </Button>
                       </div>
                     )}
                   </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No clients found</h3>
          <p className="text-sm text-gray-500 mt-1 mb-6 text-center max-w-xs">
            {filter !== 'all' ? `No ${filter} clients match your search.` : "Get started by adding your first landlord."}
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        </div>
      )}

      <AddShadowClientDialog 
        isOpen={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)} 
        onSubmit={handleCreateShadowClient}
      />
    </div>
  );
}
