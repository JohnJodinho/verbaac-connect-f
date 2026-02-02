import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Building, 
  Home,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  DollarSign,
  Users,
  Bath,
  Utensils,
  Wifi,
  Droplets,
  Zap,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  getPropertyTypes,
  type ListingType,
  type CreateListingDTO 
} from '@/modules/landlord/api/landlord.service'; // Reuse landlord types
import { agentService, type ManagedProperty } from '../../services/agent.service';
import { useListingWizardStore } from '@/modules/landlord/store/useListingWizardStore'; // Reuse store

const STEPS = [
  { id: 1, title: 'Building', icon: Building },
  { id: 2, title: 'Details', icon: Home },
  { id: 3, title: 'Pricing', icon: DollarSign },
];

export default function AgentUnitWizard() {
  const navigate = useNavigate();
  const { step, data: formData, setStep, updateData, reset } = useListingWizardStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Unlike Landlord, Agent fetches MANAGED properties
  const [buildings, setBuildings] = useState<ManagedProperty[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<ListingType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [bResult, tResult] = await Promise.all([
          agentService.getManagedProperties(),
          getPropertyTypes()
        ]);
        setBuildings(bResult);
        if (tResult.success) setPropertyTypes(tResult.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else {
      // Confirm exit or just go back
      if (window.confirm("Exit unit creation? Unsaved progress will be lost (store persists though).")) {
        reset();
        navigate('/dashboard/agent/portfolio');
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.buildingId || !formData.basePrice) return;
    
    setIsSubmitting(true);
    try {
      const base = Number(formData.basePrice);
      const final = Math.round(base * 1.12);
      
      // Submit via Agent Service
      await agentService.createListing({
        ...formData,
        basePrice: base,
        finalPrice: final,
        // Backend should infer managed_by from auth token, and get owner_id from building relation
      } as CreateListingDTO);
      
      reset();
      navigate('/dashboard/agent/portfolio');
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    if (step === 1) return !!formData.buildingId;
    if (step === 2) return !!formData.propertyTypeId && !!formData.dimensions;
    if (step === 3) return !!formData.basePrice && Number(formData.basePrice) > 0;
    return false;
  };

  // Pricing Math
  const verbaacFee = formData.basePrice ? Math.round(Number(formData.basePrice) * 0.12) : 0;
  const finalPrice = formData.basePrice ? Math.round(Number(formData.basePrice) * 1.12) : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-[env(safe-area-inset-bottom)]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-50 flex items-center justify-between shadow-sm">
        <button onClick={handleBack} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
           <h1 className="text-lg font-bold text-gray-900 tracking-tight">Add Managed Unit</h1>
           <p className="text-[10px] text-primary font-bold text-center">AGENT MODE</p>
        </div>
        <div className="w-10" />
      </div>

      {/* Progress */}
      <div className="px-6 py-4 bg-white border-b border-dashed border-gray-100 mb-2">
         <div className="flex justify-between items-center px-4">
            {STEPS.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-1">
                 <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                    step >= s.id 
                       ? "bg-primary text-white shadow-lg shadow-primary/20" 
                       : "bg-gray-100 text-gray-300"
                 )}>
                    {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                 </div>
                 <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider",
                    step >= s.id ? "text-primary" : "text-gray-300"
                 )}>{s.title}</span>
              </div>
            ))}
         </div>
      </div>

      <main className="flex-1 px-6 pb-32 pt-4">
        <AnimatePresence mode="wait">
          {/* STEP 1: BUILDING SELECTION */}
          {step === 1 && (
            <motion.div
               key="step1"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-4"
            >
               <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex gap-3 text-amber-800">
                  <Building2 className="w-5 h-5 shrink-0" />
                  <div className="text-xs">
                     <p className="font-bold">Select Managed Property</p>
                     <p>Choose one of the buildings you manage to add this unit to.</p>
                  </div>
               </div>

               <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Your Portfolio</h2>
               {buildings.map(b => (
                 <div 
                    key={b.id}
                    onClick={() => updateData({ buildingId: b.id })}
                    className={cn(
                       "relative p-4 rounded-2xl border-2 transition-all cursor-pointer bg-white",
                       formData.buildingId === b.id 
                          ? "border-primary shadow-md bg-primary/5" 
                          : "border-gray-100 hover:border-gray-200"
                    )}
                 >
                    <div className="flex items-start justify-between">
                       <div>
                          <h3 className="font-bold text-gray-900">{b.name}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">{b.address}</p>
                          <p className="text-[10px] text-gray-400 mt-1">Owner: {b.owner_name}</p>
                       </div>
                       {formData.buildingId === b.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                    </div>
                 </div>
               ))}
               {buildings.length === 0 && (
                  <div className="text-center py-10 text-gray-400 text-sm">
                     No managed buildings found found.<br/> 
                     <span className="text-primary font-bold cursor-pointer" onClick={() => navigate('/agent/properties/new')}>Create one first</span>.
                  </div>
               )}
            </motion.div>
          )}

          {/* STEP 2: METADATA */}
          {step === 2 && (
             <motion.div
               key="step2"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-6"
             >
                <div className="space-y-4">
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Unit Type</label>
                   <div className="grid grid-cols-2 gap-3">
                      {propertyTypes.map(t => (
                         <div 
                           key={t.id}
                           onClick={() => updateData({ propertyTypeId: t.id })}
                           className={cn(
                              "p-3 rounded-xl border-2 text-center cursor-pointer transition-all",
                              formData.propertyTypeId === t.id
                                 ? "border-primary bg-primary/5 text-primary"
                                 : "border-gray-100 bg-white text-gray-400"
                           )}
                         >
                            <span className="text-xs font-bold">{t.name}</span>
                         </div>
                      ))}
                   </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 space-y-4">
                   <div>
                      <label className="text-xs font-bold text-gray-400 block mb-2">Room Dimensions</label>
                      <input 
                         type="text" 
                         placeholder="e.g. 12x14 ft"
                         value={formData.dimensions || ''}
                         onChange={e => updateData({ dimensions: e.target.value })}
                         className="w-full text-lg font-bold border-b border-gray-200 py-2 focus:outline-none focus:border-primary bg-transparent"
                      />
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <Select label="Bath Type" icon={Bath} 
                         value={formData.bathroomType || ''} 
                         onChange={(v) => updateData({ bathroomType: v as 'private' | 'shared' })}
                      >
                         <option value="private">Private</option>
                         <option value="shared">Shared</option>
                      </Select>
                      
                      <Select label="Kitchen" icon={Utensils}
                         value={formData.kitchenAccess || ''}
                         onChange={(v) => updateData({ kitchenAccess: v as 'private' | 'shared' | 'none' })}
                      >
                         <option value="private">Private</option>
                         <option value="shared">Shared</option>
                         <option value="none">None</option>
                      </Select>
                   </div>
                </div>

                {/* Amenities */}
                <div className="space-y-3">
                   <h3 className="text-xs font-bold text-gray-500 uppercase">Amenities Included</h3>
                   <div className="grid grid-cols-2 gap-2">
                      <AmenityToggle 
                         label="24/7 Power" icon={Zap}
                         checked={!!formData.amenities?.electricity}
                         onChange={() => updateAmenity('electricity')}
                      />
                      <AmenityToggle 
                         label="Water" icon={Droplets}
                         checked={!!formData.amenities?.water}
                         onChange={() => updateAmenity('water')}
                      />
                      <AmenityToggle 
                         label="Security" icon={ShieldCheck}
                         checked={!!formData.amenities?.security}
                         onChange={() => updateAmenity('security')}
                      />
                      <AmenityToggle 
                         label="WiFi" icon={Wifi}
                         checked={!!formData.amenities?.wifi}
                         onChange={() => updateAmenity('wifi')}
                      />
                   </div>
                </div>
             </motion.div>
          )}

          {/* STEP 3: FINANCIALS */}
          {step === 3 && (
             <motion.div
               key="step3"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-6"
             >
                <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-900/20">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Landlord Net Price (Base)
                   </label>
                   <div className="flex items-center gap-2 border-b border-slate-700/50 pb-2">
                      <span className="text-2xl font-bold text-slate-500">₦</span>
                      <input 
                         type="number"
                         value={formData.basePrice || ''}
                         onChange={e => updateData({ basePrice: Number(e.target.value) })}
                         placeholder="0.00"
                         className="w-full bg-transparent text-3xl font-black focus:outline-none placeholder:text-slate-700"
                         autoFocus
                      />
                   </div>
                   
                   <div className="mt-6 space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-400">
                         <span>Verbaac Fee (12%)</span>
                         <span>+ ₦{verbaacFee.toLocaleString()}</span>
                      </div>
                      <div className="h-px bg-slate-800" />
                      <div className="flex justify-between items-end pt-2">
                         <span className="text-sm font-bold text-slate-300">Final Student Price</span>
                         <span className="text-xl font-black text-white">₦{finalPrice.toLocaleString()}</span>
                      </div>
                   </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                         <Users className="w-5 h-5" />
                      </div>
                      <div className="text-sm">
                         <p className="font-bold text-gray-900">Roommate Splitting</p>
                         <p className="text-xs text-gray-400">Allow pricing to be split</p>
                      </div>
                   </div>
                   <div 
                      onClick={() => updateData({ allowRoommateSplitting: !formData.allowRoommateSplitting })}
                      className={cn(
                        "w-12 h-7 rounded-full transition-colors flex items-center px-1 cursor-pointer",
                        formData.allowRoommateSplitting ? "bg-primary justify-end" : "bg-gray-200 justify-start"
                      )}
                   >
                      <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {['yearly', 'semester', 'monthly'].map(freq => (
                     <button
                        key={freq}
                        onClick={() => updateData({ paymentFrequency: freq as 'yearly' | 'semester' | 'monthly' })}
                        className={cn(
                           "py-3 rounded-xl text-xs font-bold uppercase border-2 transition-all",
                           formData.paymentFrequency === freq 
                              ? "border-primary text-primary bg-primary/5"
                              : "border-gray-100 text-gray-400"
                        )}
                     >
                        {freq}
                     </button>
                  ))}
                </div>
             </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-[env(safe-area-inset-bottom)] z-50">
        <button
          onClick={handleNext}
          disabled={!isStepValid() || isSubmitting}
          className={cn(
            "w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg text-white",
            isStepValid() 
               ? "bg-primary shadow-primary/25 active:scale-[0.98]" 
               : "bg-gray-300 cursor-not-allowed shadow-none"
          )}
        >
          {isSubmitting ? (
             <Loader2 className="w-5 h-5 animate-spin" />
          ) : step === 3 ? (
             'Publish Managed Unit'
          ) : (
             <>Next Step <ChevronRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  );

  function updateAmenity(key: 'wifi' | 'water' | 'electricity' | 'security') {
     if (!formData.amenities) return;
     updateData({
        amenities: {
           ...formData.amenities,
           [key]: !formData.amenities[key]
        }
     });
  }
}

interface SelectProps {
  label: string;
  icon: React.ElementType;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}

function Select({ label, icon: Icon, value, onChange, children }: SelectProps) {
   return (
      <div className="space-y-1">
         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Icon className="w-3 h-3" /> {label}
         </label>
         <div className="relative">
            <select 
               value={value} 
               onChange={e => onChange(e.target.value)}
               className="w-full h-10 bg-gray-50 rounded-lg px-3 text-xs font-bold text-gray-900 border-none outline-none appearance-none"
            >
               {children}
            </select>
            <ChevronRight className="w-3 h-3 text-gray-400 absolute right-3 top-3.5 rotate-90 pointer-events-none" />
         </div>
      </div>
   );
}

interface AmenityToggleProps {
  label: string;
  icon: React.ElementType;
  checked: boolean;
  onChange: () => void;
}

function AmenityToggle({ label, icon: Icon, checked, onChange }: AmenityToggleProps) {
   return (
      <button 
         onClick={onChange}
         className={cn(
            "flex items-center gap-2 p-3 rounded-xl border border-gray-100 transition-all text-left",
            checked ? "bg-emerald-50 border-emerald-100" : "bg-white"
         )}
      >
         <div className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center",
            checked ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"
         )}>
            <Icon className="w-3 h-3" />
         </div>
         <span className={cn(
            "text-xs font-bold",
            checked ? "text-emerald-700" : "text-gray-400"
         )}>{label}</span>
      </button>
   );
}
