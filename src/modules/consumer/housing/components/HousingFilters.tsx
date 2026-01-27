import { useState } from 'react';
import { Filter, X, Check } from 'lucide-react';
import { AnimatedButton } from '@/components/animated';
import { motion, AnimatePresence } from 'framer-motion';

export interface HousingFilterState {
  priceRange: [number, number];
  propertyType: string | null;
  location: string | null;
  amenities: string[];
}

interface HousingFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: HousingFilterState;
  onFilterChange: (newFilters: HousingFilterState) => void;
  locations: string[]; // Dynamic list from available properties
}

const PROPERTY_TYPES = ['Self-Contain', 'Mini Flat', 'Shared Flat', 'Bungalow', 'Student Lodge', 'Studio Apartment'];
const AMENITIES = ['Water', 'Electricity', 'Security', 'WiFi', 'Kitchen', 'Fenced'];

export function HousingFilters({ isOpen, onClose, filters, onFilterChange, locations }: HousingFiltersProps) {
  const [localFilters, setLocalFilters] = useState<HousingFilterState>(filters);

  const handleApply = () => {
    onFilterChange(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetState = {
      priceRange: [0, 2000000] as [number, number],
      propertyType: null,
      location: null,
      amenities: []
    };
    setLocalFilters(resetState);
    onFilterChange(resetState);
  };

  const toggleAmenity = (amenity: string) => {
    setLocalFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />

          {/* Filter Panel (Sidebar on mobile, Droplist/Panel on desktop) */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-background shadow-2xl border-l border-border flex flex-col h-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Filters</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Location */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Location</h3>
                <div className="flex flex-wrap gap-2">
                  {locations.map(loc => (
                    <button
                      key={loc}
                      onClick={() => setLocalFilters(prev => ({ ...prev, location: prev.location === loc ? null : loc }))}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                        localFilters.location === loc
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background hover:bg-muted border-input'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Property Type</h3>
                <div className="grid grid-cols-2 gap-2">
                  {PROPERTY_TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => setLocalFilters(prev => ({ ...prev, propertyType: prev.propertyType === type ? null : type }))}
                      className={`px-3 py-2 rounded-md text-sm border text-left transition-all ${
                        localFilters.propertyType === type
                          ? 'bg-primary/10 border-primary text-primary font-medium shadow-sm'
                          : 'bg-background hover:bg-muted border-input'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-foreground">Max Budget</h3>
                    <span className="text-primary font-bold">₦{localFilters.priceRange[1].toLocaleString()}</span>
                </div>
                <input 
                    type="range" 
                    min={50000} 
                    max={1500000} 
                    step={10000}
                    value={localFilters.priceRange[1]}
                    onChange={(e) => setLocalFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], parseInt(e.target.value)] }))}
                    className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>₦50k</span>
                    <span>₦1.5M+</span>
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Amenities</h3>
                <div className="space-y-2">
                  {AMENITIES.map(amenity => (
                    <label key={amenity} className="flex items-center gap-3 p-2 bg-card border border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                      <div 
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                            localFilters.amenities.includes(amenity)
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-muted-foreground/30'
                        }`}
                        onClick={() => toggleAmenity(amenity)}
                      >
                         {localFilters.amenities.includes(amenity) && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-sm font-medium">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-background space-y-3">
              <AnimatedButton variant="primary" className="w-full justify-center" onClick={handleApply}>
                Show Results
              </AnimatedButton>
              <button 
                onClick={handleReset}
                className="w-full text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline py-2"
              >
                Reset all filters
              </button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
