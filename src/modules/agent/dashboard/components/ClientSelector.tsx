import { useState, useEffect } from 'react';
import { Search, UserPlus, CheckCircle2, Ghost } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { agentService, type ClientProfile } from '../../services/agent.service';
import AddShadowClientDialog from './AddShadowClientDialog';
import { cn } from '@/lib/utils'; // Assuming utils location

interface ClientSelectorProps {
  onSelect: (client: ClientProfile) => void;
  selectedClientId?: string;
}

export default function ClientSelector({ onSelect, selectedClientId }: ClientSelectorProps) {
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const data = await agentService.getClients();
      setClients(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleCreateShadowClient = async (data: any) => {
    const newClient = await agentService.createShadowClient(data);
    await fetchClients();
    onSelect(newClient); // Auto-select new client
    // Dialog closes automatically via its own logic if managed properly, but here we just need to ensure list refresh
  };

  const filteredClients = clients.filter(c => 
    c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search landlord by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
        <Button size="sm" onClick={() => setIsAddDialogOpen(true)} variant="outline" className="shrink-0">
          <UserPlus className="w-4 h-4" />
        </Button>
      </div>

      <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
        {isLoading ? (
          <div className="text-center py-4 text-gray-400 text-xs">Loading clients...</div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm border border-dashed rounded-lg bg-gray-50">
            No clients found. <br/> 
            <span className="text-primary font-medium cursor-pointer" onClick={() => setIsAddDialogOpen(true)}>Create a Shadow Profile</span>
          </div>
        ) : (
          filteredClients.map(client => (
            <div 
              key={client.id}
              onClick={() => onSelect(client)}
              className={cn(
                "p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between group hover:border-primary/50 hover:bg-primary/5",
                selectedClientId === client.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-gray-100 bg-white"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                  client.status === 'active' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                )}>
                  {client.full_name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{client.full_name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500">{client.email}</span>
                    {client.status === 'shadow' && (
                      <span className="text-[9px] bg-amber-100 text-amber-800 px-1 rounded flex items-center gap-0.5">
                        <Ghost className="w-2 h-2" /> Proxy
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {selectedClientId === client.id && (
                <CheckCircle2 className="w-5 h-5 text-primary" />
              )}
            </div>
          ))
        )}
      </div>

      <AddShadowClientDialog 
        isOpen={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)} 
        onSubmit={handleCreateShadowClient}
      />
    </div>
  );
}
