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
    id: '2',
    title: 'Shared Room in Student Lodge',
    propertyType: 'Shared Room',
    rent: { amount: 80000, currency: 'NGN', duration: 'year' },
    location: { address: 'University of Ibadan' },
    rating: { average: 4.1, reviewCount: 8 },
    landlord: { name: 'Mary Adebayo', verified: true, id: 'landlord2' },
    availability: 'Available',
    topAmenities: ['WiFi', 'Shared Kitchen', 'Study Area'],
    thumbnailImage: 'https://images.unsplash.com/photo-1600607688979-a3bbf6c3d6b5?w=800',
    images: ['https://images.unsplash.com/photo-1600607688979-a3bbf6c3d6b5?w=800'],
    lastUpdated: '2025-10-18T00:00:00Z',
    highlighted: false,
    description: 'Affordable shared accommodation for students with large study area.',
    rules: ['Quiet hours after 10pm'],
  },
  {
    id: '3',
    title: 'Self-Contained Apartment Near UNILAG',
    propertyType: 'Self-Contained',
    rent: { amount: 150000, currency: 'NGN', duration: 'year' },
    location: { address: 'Yaba, Lagos' },
    rating: { average: 4.8, reviewCount: 20 },
    landlord: { name: 'Emmanuel Okafor', verified: true, id: 'landlord3' },
    availability: 'Pending',
    topAmenities: ['Power Supply', 'Water', 'Wardrobe', 'Kitchenette'],
    thumbnailImage: 'https://images.unsplash.com/photo-1586105251261-72a756497a12?w=800',
    images: ['https://images.unsplash.com/photo-1586105251261-72a756497a12?w=800'],
    lastUpdated: '2025-10-21T00:00:00Z',
    highlighted: true,
    description: 'Fully tiled, ensuite bathroom, and constant water supply.',
    rules: ['No loud music', 'No pets'],
  },
  {
    id: '4',
    title: 'Female Hostel – Shared Room',
    propertyType: 'Hostel Room',
    rent: { amount: 60000, currency: 'NGN', duration: 'year' },
    location: { address: 'Benin City, Edo State' },
    rating: { average: 3.9, reviewCount: 5 },
    landlord: { name: 'Grace Eze', verified: false, id: 'landlord4' },
    availability: 'Available',
    topAmenities: ['Security', 'WiFi', 'Common Room'],
    thumbnailImage: 'https://images.unsplash.com/photo-1595526114035-0b73b0b9e1b3?w=800',
    images: ['https://images.unsplash.com/photo-1595526114035-0b73b0b9e1b3?w=800'],
    lastUpdated: '2025-10-15T00:00:00Z',
    highlighted: false,
    description: 'Comfortable and secure female-only hostel close to UNIBEN campus.',
    rules: ['Females only', 'No visitors after 8pm'],
  },
  {
    id: '5',
    title: 'Luxury Mini Flat – Near FUTA South Gate',
    propertyType: 'Mini Flat',
    rent: { amount: 180000, currency: 'NGN', duration: 'year' },
    location: { address: 'Akure, Ondo State' },
    rating: { average: 4.6, reviewCount: 15 },
    landlord: { name: 'David Olawale', verified: true, id: 'landlord5' },
    availability: 'Taken',
    topAmenities: ['Parking', 'Power Backup', 'WiFi', 'Furnished'],
    thumbnailImage: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800',
    images: ['https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800'],
    lastUpdated: '2025-10-22T00:00:00Z',
    highlighted: false,
    description: 'Furnished apartment with inverter and parking space.',
    rules: ['No parties', 'No smoking'],
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

