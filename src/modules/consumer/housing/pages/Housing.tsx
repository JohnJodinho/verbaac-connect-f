import { useState, useMemo, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { PageWrapper, AnimatedButton, StaggeredContainer } from '@/components/animated/index';
import { PropertyCard } from '@/modules/consumer/housing/components/PropertyCard';
import { HousingFilters, type HousingFilterState } from '@/modules/consumer/housing/components/HousingFilters';
import { propertyDetails as mockProperties } from '@/data/mock-properties';

// Helper: Get unique locations for filter
const LOCATIONS = Array.from(new Set(mockProperties.map(p => {
    // Extract general area key from "Naraguta, Jos" -> "Naraguta"
    return p.location.address.split(',')[0].trim();
})));

export default function Housing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Initialize filters from URL or default
  const [filters, setFilters] = useState<HousingFilterState>({
    priceRange: [0, 2000000], // Full range default
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
        // 1. Text Search
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
            p.title.toLowerCase().includes(searchLower) || 
            p.location.address.toLowerCase().includes(searchLower) ||
            p.propertyType.toLowerCase().includes(searchLower);

        // 2. Price Range
        const matchesPrice = p.rent.amount <= filters.priceRange[1];

        // 3. Property Type
        const matchesType = filters.propertyType ? p.propertyType === filters.propertyType : true;

        // 4. Location
        const matchesLocation = filters.location ? p.location.address.includes(filters.location) : true;

        // 5. Amenities (Must match ALL selected)
        const matchesAmenities = filters.amenities.length > 0
            ? filters.amenities.every(a => 
                p.topAmenities.some(pa => pa.toLowerCase().includes(a.toLowerCase()))
              )
            : true;

        return matchesSearch && matchesPrice && matchesType && matchesLocation && matchesAmenities;
    });
  }, [searchQuery, filters]);

  return (
    <PageWrapper>
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Student Housing
            </h1>
            <p className="text-lg text-muted-foreground">
              Find verified off-campus accommodation near your university
            </p>
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-card text-card-foreground border border-border rounded-lg shadow-sm p-4 md:p-6 mb-8 sticky top-20 z-30">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search by location, university, or property name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              <AnimatedButton 
                variant="outline" 
                onClick={() => setIsFilterOpen(true)}
                className="relative"
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters
                {(filters.location || filters.propertyType || filters.amenities.length > 0) && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
                )}
              </AnimatedButton>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Listings Column */}
            <div className="lg:col-span-2">
              <div className="mb-4 text-sm text-muted-foreground flex justify-between items-center">
                <span>Showing {filteredProperties.length} results</span>
                {/* Sort dropdown could go here */}
              </div>

              <StaggeredContainer className="space-y-6">
                {filteredProperties.length === 0 ? (
                  <div className="text-center py-16 bg-card rounded-lg border border-dashed border-border">
                    <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                         <Search className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Properties Found</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                        We couldn't find any matches for your current filters. Try adjusting your price range or removing some amenity requirements.
                    </p>
                    <AnimatedButton 
                        variant="outline" 
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

            {/* Sidebar / Map Placeholder */}
            <div className="hidden lg:block">
                <div className="bg-card text-card-foreground border border-border rounded-lg shadow-sm p-6 sticky top-40">
                <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Live Map View
                </h3>
                <div className="h-96 bg-muted/50 rounded-lg flex flex-col items-center justify-center text-center p-6 border border-dashed border-border">
                    <div className="mb-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Static map image placeholder */}
                        <img 
                            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80" 
                            alt="Map Preview" 
                            className="rounded-md opacity-60"
                        />
                    </div>
                    <p className="text-sm font-medium">Interactive Map Integration</p>
                    <p className="text-xs text-muted-foreground mt-1">Coming in next update</p>
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
