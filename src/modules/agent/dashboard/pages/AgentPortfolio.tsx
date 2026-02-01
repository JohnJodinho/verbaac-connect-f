import { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Plus, 
  ShieldCheck, 
  ShieldAlert, 
  LayoutGrid, 
  List, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { agentService, type ManagedProperty } from '../../services/agent.service';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function AgentPortfolio() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<ManagedProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchPortfolio = async () => {
      setIsLoading(true);
      try {
        const data = await agentService.getManagedProperties();
        setProperties(data);
      } catch (error) {
        console.error("Failed to fetch portfolio", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const getStatusBadge = (status: ManagedProperty['verification_status']) => {
    switch(status) {
      case 'verified':
        return <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold border border-green-100 uppercase tracking-wider"><ShieldCheck className="w-3 h-3 mr-1" /> Verified</span>;
      case 'pending_vetting':
        return <span className="inline-flex items-center px-2 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-100 uppercase tracking-wider"><Clock className="w-3 h-3 mr-1" /> Vetting</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-50 text-red-700 text-[10px] font-bold border border-red-100 uppercase tracking-wider"><ShieldAlert className="w-3 h-3 mr-1" /> Rejected</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-50 text-gray-500 text-[10px] font-bold border border-gray-100 uppercase tracking-wider">Draft</span>;
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sticky top-0 bg-gray-50 z-10 py-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
          <p className="text-sm text-gray-500">Managed buildings & listings.</p>
        </div>
        
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <Button 
            onClick={() => navigate('/agent/units/new')} 
            className="h-10 px-4 shadow-sm bg-white text-gray-900 border border-gray-200 hover:bg-gray-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Unit
          </Button>
          <Button 
            onClick={() => navigate('/agent/properties/new')} 
            className="h-10 px-4 shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Building
          </Button>

          <div className="bg-white rounded-lg border border-gray-200 p-1 flex">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-2 rounded-md transition-all", viewMode === 'grid' ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600")}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn("p-2 rounded-md transition-all", viewMode === 'list' ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600")}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : properties.length > 0 ? (
        <div className={cn(
          "grid gap-4",
          viewMode === 'grid' ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {properties.map((property) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
            >
              {/* Image Header */}
              <div className="h-32 bg-gray-100 relative overflow-hidden">
                <img 
                  src={property.image_url} 
                  alt={property.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2">
                  {getStatusBadge(property.verification_status)}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <h3 className="text-white font-bold text-lg leading-none">{property.name}</h3>
                  <p className="text-white/80 text-xs flex items-center gap-1 mt-1 truncate">
                    <MapPin className="w-3 h-3" /> {property.address}
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Owner</span>
                  <span className="font-medium text-gray-900">{property.owner_name}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50">
                   <div className="bg-gray-50 rounded-lg p-2 text-center">
                     <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider">Units</span>
                     <span className="block text-lg font-bold text-gray-900">{property.total_units}</span>
                   </div>
                   <div className="bg-gray-50 rounded-lg p-2 text-center">
                     <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider">Occupancy</span>
                     <span className={cn(
                       "block text-lg font-bold",
                       property.occupancy_rate >= 90 ? "text-green-600" : property.occupancy_rate >= 50 ? "text-amber-600" : "text-gray-900"
                     )}>{property.occupancy_rate}%</span>
                   </div>
                </div>

                {property.verification_status === 'rejected' && (
                   <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-xs text-red-700 flex gap-2">
                     <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                     <p>
                       <strong>Attention Needed:</strong> Ambassador flagged incorrect coordinates. Please update.
                     </p>
                   </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
           <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No managed properties</h3>
          <p className="text-sm text-gray-500 mt-1 mb-6 text-center max-w-xs">
            Start by adding a building for one of your clients.
          </p>
          <Button 
            onClick={() => navigate('/agent/properties/new')} 
            className="mt-4 shadow-sm"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Building
          </Button>
        </div>
      )}
    </div>
  );
}
