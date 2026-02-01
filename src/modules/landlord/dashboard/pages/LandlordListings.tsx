import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  Plus, 
  MapPin, 
  CheckCircle2, 
  Clock,
  BedDouble,
  Receipt
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getListings, getBuildings, type Listing, type Building } from '../../api/landlord.service';

export default function LandlordListings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [buildings, setBuildings] = useState<Record<string, Building>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [lResult, bResult] = await Promise.all([
          getListings(),
          getBuildings()
        ]);
        
        if (lResult.success) setListings(lResult.data);
        
        if (bResult.success) {
           // Create a map for easy lookup
           const bMap = bResult.data.reduce((acc: Record<string, Building>, b: Building) => ({ ...acc, [b.id]: b }), {} as Record<string, Building>);
           setBuildings(bMap);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Listings</h1>
          <p className="text-sm text-gray-500">Manage rental units.</p>
        </div>
        {listings.length > 0 && (
          <button 
             onClick={() => navigate('/dashboard/landlord/listings/new')}
             className="h-10 px-4 bg-role-landlord text-white rounded-xl font-bold flex items-center gap-2 text-sm shadow-sm hover:bg-role-landlord/90 transition-colors"
          >
             <Plus className="w-4 h-4" />
             <span className="hidden md:inline">Create Listing</span>
             <span className="md:hidden">Add Unit</span>
          </button>
        )}
      </div>

      {isLoading ? (
         <div className="flex flex-col gap-4">
            {[1,2].map(i => (
               <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
         </div>
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <ClipboardList className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No active listings</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto mb-6">
            Create listings for your buildings to start earning.
          </p>
          <button 
             onClick={() => navigate('/dashboard/landlord/listings/new')}
             className="px-6 py-3 bg-white text-role-landlord border-2 border-role-landlord rounded-xl font-bold hover:bg-role-landlord/5 transition-colors"
          >
             Create First Listing
          </button>
        </div>
      ) : (
         <div className="flex flex-col gap-4">
            {listings.map(l => (
               <ListingCard key={l.id} listing={l} building={buildings[l.buildingId]} />
            ))}
         </div>
      )}
    </div>
  );
}

function ListingCard({ listing, building }: { listing: Listing, building?: Building }) {
   return (
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm relative overflow-hidden">
         {/* Status Badge */}
         <div className="absolute top-4 right-4">
            <span className={cn(
               "text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider",
               listing.status === 'verified' ? "bg-emerald-50 text-emerald-600" :
               listing.status === 'pending_vetting' ? "bg-amber-50 text-amber-600" :
               "bg-gray-100 text-gray-500"
            )}>
               {listing.status === 'verified' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
               {listing.status.replace('_', ' ')}
            </span>
         </div>

         <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-violet-500 shrink-0">
               <BedDouble className="w-6 h-6" />
            </div>
            <div className="pr-16">
               <h3 className="font-bold text-gray-900 truncate">{listing.displayId}</h3>
               <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {building ? building.name : 'Unknown Building'}
               </p>
            </div>
         </div>

         <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
               <Receipt className="w-3 h-3" />
               <span className="capitalize">{listing.paymentFrequency}</span>
            </div>
            <div className="text-right">
               <p className="text-xs text-gray-400 font-bold uppercase">Final Price</p>
               <p className="text-sm font-black text-gray-900">₦{listing.finalPrice.toLocaleString()}</p>
            </div>
         </div>
      </div>
   );
}
