import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building, 
  Plus, 
  MapPin, 
  MoreVertical, 
  CheckCircle2, 
  Clock,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getBuildings, type Building as IBuilding } from '../../api/landlord.service';

export default function LandlordProperties() {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState<IBuilding[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBuildings = async () => {
      try {
        const result = await getBuildings();
        if (result.success) {
          setBuildings(result.data);
        }
      } catch (err) {
        console.error("Failed to load buildings", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadBuildings();
  }, []);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Properties</h1>
          <p className="text-sm text-gray-500">Manage your property portfolio.</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/landlord/properties/new')}
          className="h-10 px-4 bg-role-landlord text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95 transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Property
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
           <div className="animate-spin mb-4">
              <Building className="w-8 h-8 opacity-20" />
           </div>
           <p className="text-xs font-bold uppercase tracking-wider">Loading Portfolio...</p>
        </div>
      ) : buildings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <Building className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No properties yet</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
            Start by adding your first property to begin listing units for students.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {buildings.map((building) => (
            <BuildingCard key={building.id} building={building} />
          ))}
        </div>
      )}
    </div>
  );
}

function BuildingCard({ building }: { building: IBuilding }) {
  const isVerified = building.verificationStatus === 'verified';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
       {/* Background accent */}
       <div className="absolute top-0 right-0 w-24 h-24 bg-role-landlord/5 rounded-bl-full -mr-10 -mt-10" />

       <div className="flex items-start justify-between mb-4 relative">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
             <Building className="w-6 h-6" />
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
             <MoreVertical className="w-5 h-5" />
          </button>
       </div>

       <div className="mb-4 relative">
          <h3 className="font-bold text-gray-900 truncate pr-4">{building.name}</h3>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
             <MapPin className="w-3 h-3 shrink-0" />
             <span className="truncate">{building.address}</span>
          </div>
       </div>

       <div className="flex items-center justify-between pt-4 border-t border-gray-50 relative mt-4">
          <button className="text-xs font-bold text-role-landlord hover:text-role-landlord/80 transition-colors flex items-center gap-1">
             Manage Units <ChevronRight className="w-3 h-3" />
          </button>
          
          <div className="flex items-center gap-2">
             <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider",
                isVerified 
                   ? "bg-emerald-50 text-emerald-600" 
                   : "bg-amber-50 text-amber-600"
             )}>
                {isVerified ? (
                   <><CheckCircle2 className="w-3 h-3" /> Verif.</>
                ) : (
                   <><Clock className="w-3 h-3" /> Pending</>
                )}
             </span>
             <span className="text-xs font-bold text-gray-400 ml-1">
                {building.totalUnits} Units
             </span>
          </div>
       </div>
    </div>
  );
}
