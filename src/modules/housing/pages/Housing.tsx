import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
// MODIFICATION: Adjusted import paths to be absolute from 'src'
import { type Property } from '@/types/index';
import { PageWrapper, AnimatedButton, StaggeredContainer } from '@/components/animated/index';
import { PropertyCard } from '@/modules/housing/components/PropertyCard';

// Local mock data updated to the new Property type
const mockProperties: Property[] = [
  {
    id: "VC-HS-2025-001",
    title: "2 Bedroom Self-Contain at Naraguta",
    propertyType: "Self-Contain",
    rent: {
      amount: 350000,
      currency: "NGN",
      duration: "year",
    },
    location: { address: "Near University of Jos Main Campus" },
    rating: {
      average: 4.3,
      reviewCount: 18,
    },
    landlord: {
      name: "Mr. Sani Musa",
      verified: true,
      id: "LLD-102"
    },
    availability: "Available",
    topAmenities: ["Water", "Band A Electricity", "Fenced"],
    thumbnailImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=1200&q=80"
    ],
    lastUpdated: "2025-10-25",
    highlighted: true,
    description:
      "A clean and spacious 2-bedroom self-contain located within walking distance to UNIJOS Main Campus. The apartment offers reliable power, borehole water, and secure access. Ideal for students or small families.",
    rules: [
      "No smoking indoors",
      "Respect quiet hours (10 PM - 6 AM)",
      "Rent payable yearly or bi-annually",
    ],
  },
  {
    id: "VC-HS-2025-002",
    title: "1 Bedroom Apartment at Rayfield Estate",
    propertyType: "Mini Flat",
    rent: {
      amount: 200000,
      currency: "NGN",
      duration: "year",
    },
    location: {
      address: "Estate in Rayfield, Jos South" },
    rating: {
      average: 4.7,
      reviewCount: 25,
    },
    landlord: {
      name: "Mrs. Sarah Luka",
      verified: true,
      id: "LLD-205", 
    },
    availability: "Available",
    topAmenities: ["Prepaid Meter", "Parking Space", "Security", "Water Heater"],
    thumbnailImage:
      "https://images.unsplash.com/photo-1600585154207-8c8a477b1e8e?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1585412727339-54efc4cb0f37?auto=format&fit=crop&w=1200&q=80"],
    lastUpdated: "2025-10-21",
    highlighted: false,
    description:
      "Modern one-bedroom mini flat located inside Rayfield Estate. Perfect for working professionals or small families. Comes with full kitchen, prepaid meter, and gated compound.",
    rules: [
      "No loud parties",
      "Pets allowed (small only)",
      "Rent payable yearly only",
    ],
  },
  {
    id: "VC-HS-2025-003",
    title: "Single Room Lodge at Bauchi Road",
    propertyType: "Student Lodge",
    rent: {
      amount: 120000,
      currency: "NGN",
      duration: "year",
    },
    location: {
      address: "Forestry, Bauchi Road Campus, Jos, Plateau State"
    },
    rating: {
      average: 4.0,
      reviewCount: 35,
    },
    landlord: {
      name: "Mr. Danladi Peter",
      verified: true,
      id: "LLD-309",
    },
    availability: "Available",
    topAmenities: ["Borehole", "Electricity", "Security", "Shared Kitchen"],
    thumbnailImage:
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=1200&q=80",
    ],
    lastUpdated: "2025-10-15",
    highlighted: false,
    description:
      "Single room lodge designed for students who value privacy and affordability. Comes with borehole water, prepaid light, and a shared kitchen. 5 minutes walk to UNIJOS gate.",
    rules: ["No smoking", "No overnight guests", "Keep shared spaces clean"],
  },
  {
id: "VC-HS-2025-004",
    title: "Shared Apartment at Zaramaganda",
    propertyType: "Shared Flat",
    rent: {
      amount: 250000,
      currency: "NGN",
      duration: "year",
    },
    location: {
      address: "Zaramaganda, off Old Airport Road, Jos South", },
    rating: {
      average: 4.2,
      reviewCount: 9,
    },
    landlord: {
      name: "Mr. Emmanuel Yakubu",
      verified: false,
      id: "LLD-420", },
    availability: "Available",
    topAmenities: ["WiFi", "Water", "Kitchen Access", "Security"],
    thumbnailImage:
      "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1586105251261-72a756497a12?auto=format&fit=crop&w=1200&q=80"],
    lastUpdated: "2025-10-22",
    highlighted: true,
    description:
      "Cozy shared flat with two available rooms, shared kitchen and bathroom. Located in a calm and well-secured area of Zaramaganda. Perfect for young professionals or NYSC members.",
    rules: ["Keep shared areas clean", "No parties", "Respect quiet hours"],
  },
  {
    id: "VC-HS-2025-005",
    title: "3 Bedroom Fully Detached Bungalow at Rayfield",
    propertyType: "Bungalow",
    rent: {
      amount: 900000,
      currency: "NGN",
      duration: "year",
    },
    location: {
      address: "Rayfield Layout, Jos South, Plateau State", },
    rating: {
      average: 4.8,
      reviewCount: 13,
    },
    landlord: {
      name: "Mr. Ibrahim Sule",
      verified: true,
      id: "LLD-512", },
availability: "Available",
    topAmenities: [
      "Parking",
      "Prepaid Meter",
      "Water Heater",
      "Fenced Compound",
    ],
    thumbnailImage:
      "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1586105251261-72a756497a12?auto=format&fit=crop&w=1200&q=80",],
    lastUpdated: "2025-10-19",
    highlighted: true,
    description:
      "A fully detached 3-bedroom bungalow with POP ceilings, large compound, borehole water, and prepaid electricity meter. Perfect for families and professionals seeking comfort and privacy.",
    rules: ["No subletting", "Pets allowed", "Pay utility bills on time"],
  },
];

export default function Housing() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mockProperties.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.landlord.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

          {/* Search and Filters */}
          <div className="bg-card text-card-foreground border border-border rounded-lg shadow-sm p-4 md:p-6 mb-8">
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
              <AnimatedButton variant="outline">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </AnimatedButton>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Property Listings */}
            <div className="lg:col-span-2">
              <StaggeredContainer className="space-y-6">
                {filtered.length === 0 ? (
                  <div className="text-center py-12 bg-card rounded-lg border border-border">
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Properties Found</h3>
                    <p className="text-muted-foreground">Try adjusting your search query or filters.</p>
                  </div>
                ) : (
                  filtered.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))
                )}
              </StaggeredContainer>
            </div>

            {/* Map/Sidebar */}
            <div className="bg-card text-card-foreground border border-border rounded-lg shadow-sm p-6 h-fit lg:sticky top-24">
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Map View
              </h3>
              <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Map integration coming soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

