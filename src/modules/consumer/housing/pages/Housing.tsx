import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageWrapper, AnimatedButton, StaggeredContainer } from '@/components/animated/index';
import { PropertyCard } from '@/modules/consumer/housing/components/PropertyCard';
import { PropertiesMap } from '@/modules/consumer/housing/components/PropertiesMap';
import { HousingFilters, type HousingFilterState } from '@/modules/consumer/housing/components/HousingFilters';
import { propertyDetails as mockProperties } from '@/data/mock-properties';

// Helper: Get unique locations for filter
const LOCATIONS = Array.from(new Set(mockProperties.map(p => {
    return p.location.address.split(',')[0].trim();
})));

export default function Housing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Initialize filters from URL or default
  const [filters, setFilters] = useState<HousingFilterState>({
    priceRange: [0, 2000000],
    propertyType: null,
    location: null,
    amenities: []
  });

  // Sync search query to URL for sharing
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (searchQuery) params.set('q', searchQuery);
    else params.delete('q');
    setSearchParams(params, { replace: true });
  }, [searchQuery, setSearchParams]);

  // Filtering Logic
  const filteredProperties = useMemo(() => {
    return mockProperties.filter(p => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
            p.title.toLowerCase().includes(searchLower) || 
            p.location.address.toLowerCase().includes(searchLower) ||
            p.propertyType.toLowerCase().includes(searchLower);

        const matchesPrice = p.rent.amount <= filters.priceRange[1];
        const matchesType = filters.propertyType ? p.propertyType === filters.propertyType : true;
        const matchesLocation = filters.location ? p.location.address.includes(filters.location) : true;
        const matchesAmenities = filters.amenities.length > 0
            ? filters.amenities.every(a => 
                p.topAmenities.some(pa => pa.toLowerCase().includes(a.toLowerCase()))
              )
            : true;

        return matchesSearch && matchesPrice && matchesType && matchesLocation && matchesAmenities;
    });
  }, [searchQuery, filters]);

  const activeFiltersCount = [
    filters.location,
    filters.propertyType,
    filters.amenities.length > 0
  ].filter(Boolean).length;

  return (
    <PageWrapper>
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-8">
          
          {/* Header - Compact on mobile */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 md:mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 md:hidden">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-bold text-foreground">
                  Student Housing
                </h1>
                <p className="text-sm md:text-lg text-muted-foreground hidden md:block">
                  Find verified off-campus accommodation near your university
                </p>
              </div>
            </div>
          </motion.div>

          {/* Search and Filters Bar - Sticky */}
          <div className="bg-card text-card-foreground border border-border rounded-xl shadow-sm p-3 md:p-6 mb-4 md:mb-8 sticky top-14 md:top-20 z-30">
            <div className="flex gap-2 md:gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 md:h-5 md:w-5" />
                <input
                  type="text"
                  placeholder="Search location or property..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 md:pl-10 pr-4 py-2.5 md:py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground text-sm md:text-base"
                />
              </div>
              
              {/* Filter Button */}
              <AnimatedButton 
                variant="outline" 
                onClick={() => setIsFilterOpen(true)}
                className="relative shrink-0 touch-target px-3 md:px-4"
              >
                <Filter className="h-5 w-5 md:mr-2" />
                <span className="hidden md:inline">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </AnimatedButton>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-3 md:mb-4 text-sm text-muted-foreground flex justify-between items-center px-1">
            <span>{filteredProperties.length} properties found</span>
          </div>

          {/* Results Grid - Single column on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
            
            {/* Listings Column */}
            <div className="lg:col-span-2">
              <StaggeredContainer className="space-y-4 md:space-y-6">
                {filteredProperties.length === 0 ? (
                  <div className="text-center py-12 md:py-16 bg-card rounded-lg border border-dashed border-border">
                    <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                      <Search className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">No Properties Found</h3>
                    <p className="text-sm md:text-base text-muted-foreground max-w-sm mx-auto mb-6 px-4">
                      Try adjusting your filters or search terms.
                    </p>
                    <AnimatedButton 
                      variant="outline" 
                      className="touch-target"
                      onClick={() => {
                        setFilters({ priceRange: [0, 2000000], propertyType: null, location: null, amenities: [] });
                        setSearchQuery('');
                      }}
                    >
                      Clear All Filters
                    </AnimatedButton>
                  </div>
                ) : (
                  filteredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))
                )}
              </StaggeredContainer>
            </div>

            {/* Sidebar / Map Placeholder - Hidden on mobile */}
            <div className="hidden lg:block">
              <div className="bg-card text-card-foreground border border-border rounded-lg shadow-sm p-4 sticky top-24">
                <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Live Map View
                </h3>
                <div className="h-[600px]">
                    <PropertiesMap properties={filteredProperties} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Filter Sidebar Component */}
      <HousingFilters 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        locations={LOCATIONS}
      />
    </PageWrapper>
  );
}
