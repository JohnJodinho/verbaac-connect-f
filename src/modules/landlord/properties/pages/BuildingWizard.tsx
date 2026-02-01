import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Building, 
  MapPin, 
  Camera, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2,
  Loader2,
  Navigation,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createBuilding, getZones, type CreateBuildingDTO, type Zone } from '../../api/landlord.service';
import { useBuildingWizardStore } from '../../store/useBuildingWizardStore';

const STEPS = [
  { id: 1, title: 'Identity', icon: Building },
  { id: 2, title: 'Location', icon: MapPin },
  { id: 3, title: 'Media', icon: Camera },
];

export default function BuildingWizard() {
  const navigate = useNavigate();
  // Use persisted store
  const { step, data: formData, setStep, updateData, reset } = useBuildingWizardStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [zones, setZones] = useState<Zone[]>([]);
  const [isLoadingZones, setIsLoadingZones] = useState(false);

  // Fetch Zones on Mount
  useEffect(() => {
    const loadZones = async () => {
      setIsLoadingZones(true);
      try {
        const result = await getZones();
        if (result.success) {
          setZones(result.data);
        }
      } catch (err) {
        console.error("Failed to load zones", err);
      } finally {
        setIsLoadingZones(false);
      }
    };
    loadZones();
  }, []);

  // Filter available zones based on selected city
  const availableZones = zones.filter(z => z.city === formData.city);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      // Confirm before exit if data exists?
      navigate('/dashboard/landlord/properties');
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.address || !formData.coordinates || !formData.zoneId) return;
    
    setIsSubmitting(true);
    try {
      await createBuilding(formData as CreateBuildingDTO);
      reset(); // Clear store on success
      navigate('/dashboard/landlord/properties');
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  // Step 2: Geo Logic
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateData({
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          });
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Could not get location. Please enable GPS.");
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const isStepValid = () => {
    if (step === 1) return formData.name && formData.address && formData.state && formData.city && formData.zoneId;
    if (step === 2) return formData.coordinates?.lat && formData.coordinates?.lng;
    if (step === 3) return true; // Photos optional for now
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-[env(safe-area-inset-bottom)]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-50 flex items-center justify-between shadow-sm">
        <button onClick={handleBack} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 tracking-tight">Add New Building</h1>
        <div className="w-10" />
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-6 bg-white border-b border-dashed border-gray-100 mb-2">
        <div className="flex justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-10 -translate-y-1/2" />
          {STEPS.map((s) => (
            <div key={s.id} className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 bg-white",
              step >= s.id 
                ? "border-role-landlord text-role-landlord shadow-lg shadow-role-landlord/10 scale-110" 
                : "border-gray-300 text-gray-300"
            )}>
              {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-3 px-1">
          {STEPS.map((s) => (
             <span key={s.id} className={cn(
               "text-[10px] uppercase font-bold tracking-wider transition-colors duration-300",
               step >= s.id ? "text-role-landlord" : "text-gray-300"
             )}>{s.title}</span>
          ))}
        </div>
      </div>

      <main className="flex-1 px-6 pb-28 pt-4">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <InputGroup label="Building Name" icon={Building}>
                <input 
                  type="text" 
                  placeholder="e.g. Naraguta Luxury Lodge"
                  value={formData.name || ''}
                  onChange={e => updateData({ name: e.target.value })}
                  className="w-full h-12 bg-transparent outline-none text-sm font-bold text-gray-900 placeholder:text-gray-300"
                  autoFocus
                />
              </InputGroup>

              <InputGroup label="Street Address" icon={MapPin}>
                <input 
                  type="text" 
                  placeholder="e.g. Opposite University Gate"
                  value={formData.address || ''}
                  onChange={e => updateData({ address: e.target.value })}
                  className="w-full h-12 bg-transparent outline-none text-sm font-bold text-gray-900 placeholder:text-gray-300"
                />
              </InputGroup>

              {/* Geo Filters */}
              <div className="grid grid-cols-2 gap-4">
                <SelectGroup label="State">
                  <select 
                    value={formData.state}
                    onChange={e => updateData({ state: e.target.value })}
                     className="w-full h-12 bg-transparent outline-none text-sm font-bold text-gray-900 appearance-none"
                  >
                    <option value="Plateau">Plateau</option>
                  </select>
                </SelectGroup>
                <SelectGroup label="City">
                  <select 
                     value={formData.city}
                     onChange={e => updateData({ city: e.target.value, zoneId: '' })} // Reset zone on city change
                      className="w-full h-12 bg-transparent outline-none text-sm font-bold text-gray-900 appearance-none"
                  >
                    <option value="Jos North">Jos North</option>
                    <option value="Jos South">Jos South</option>
                  </select>
                </SelectGroup>
              </div>

              {/* Zone Selection */}
              <SelectGroup label="Zone (Neighborhood)">
                {isLoadingZones ? (
                  <div className="h-12 flex items-center text-gray-400 text-sm">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading zones...
                  </div>
                ) : (
                  <select 
                    value={formData.zoneId || ''}
                    onChange={e => updateData({ zoneId: e.target.value })}
                    className={cn(
                      "w-full h-12 bg-transparent outline-none text-sm font-bold appearance-none",
                      !formData.zoneId ? "text-gray-400" : "text-gray-900"
                    )}
                  >
                    <option value="" disabled>Select a zone</option>
                    {availableZones.map(z => (
                      <option key={z.id} value={z.id}>{z.name}</option>
                    ))}
                    {availableZones.length === 0 && (
                      <option disabled>No zones found for {formData.city}</option>
                    )}
                  </select>
                )}
              </SelectGroup>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto shadow-sm shadow-blue-100">
                  <Navigation className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-blue-900">Geo-Tag Entrance</h3>
                  <p className="text-xs text-blue-700 mt-1 max-w-[240px] mx-auto leading-relaxed">
                    Stand exactly at the <strong>main entrance</strong> of your building. 
                    This location will be used for student directions and ambassador verification.
                  </p>
                </div>

                {formData.coordinates ? (
                  <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm animate-in fade-in zoom-in duration-300">
                    <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold mb-2">
                       <CheckCircle2 className="w-4 h-4" />
                       <span className="text-xs uppercase tracking-wider">Coordinates Captured</span>
                    </div>
                    <div className="flex items-center justify-center gap-4 text-xs font-mono text-gray-600 font-bold bg-gray-50 py-2 rounded-lg">
                      <span>LAT: {formData.coordinates.lat.toFixed(6)}</span>
                      <span className="w-px h-4 bg-gray-300"></span>
                      <span>LNG: {formData.coordinates.lng.toFixed(6)}</span>
                    </div>
                    <button 
                      onClick={handleGetLocation}
                      className="mt-3 text-[10px] font-bold text-blue-500 hover:text-blue-700 underline"
                    >
                      Update Location
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleGetLocation}
                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    Use Current Location
                  </button>
                )}
              </div>
              
              <div className="flex bg-amber-50 rounded-xl p-4 gap-3 text-amber-800 border border-amber-100">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-xs leading-relaxed">
                  <strong>Important:</strong> Ensure you are outdoors with a clear view of the sky for the best GPS accuracy.
                </p>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
               <div className="border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center space-y-4 hover:border-role-landlord/50 hover:bg-role-landlord/5 transition-all cursor-pointer group">
                  <div className="w-16 h-16 rounded-full bg-gray-50 group-hover:bg-white flex items-center justify-center mx-auto transition-colors">
                    <Camera className="w-8 h-8 text-gray-400 group-hover:text-role-landlord transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Upload Building Photos</h3>
                    <p className="text-xs text-gray-400 mt-1">Exterior, Gate, Signage</p>
                  </div>
               </div>
               
               {/* Simulating Display ID preview */}
               <div className="bg-gray-900 rounded-xl p-4 text-center">
                 <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Generated ID Preview</p>
                 <p className="text-lg font-mono text-white font-bold tracking-wider">
                   PLA-{formData.zoneId ? zones.find(z => z.id === formData.zoneId)?.name.substring(0,3).toUpperCase() : 'XXX'}-BLD-????
                 </p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-[env(safe-area-inset-bottom)] z-60">
        <button
          onClick={handleNext}
          disabled={!isStepValid() || isSubmitting}
          className={cn(
            "w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg",
            isStepValid() && !isSubmitting
              ? "bg-role-landlord text-white shadow-role-landlord/25 active:scale-[0.98]" 
              : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
          )}
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : step === 3 ? (
            'Save & Create Building'
          ) : (
            <>
              Continue <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function InputGroup({ label, icon: Icon, children }: any) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 focus-within:ring-2 focus-within:ring-role-landlord/20 focus-within:border-role-landlord transition-all">
      <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-2 mb-1">
        <Icon className="w-3 h-3" />
        {label}
      </label>
      {children}
    </div>
  );
}

function SelectGroup({ label, children }: any) {
   return (
     <div className="bg-white border border-gray-200 rounded-2xl p-4 focus-within:ring-2 focus-within:ring-role-landlord/20 focus-within:border-role-landlord transition-all">
       <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-1">
         {label}
       </label>
       {children}
     </div>
   );
 }
