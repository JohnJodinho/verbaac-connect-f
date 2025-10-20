import { useState } from 'react'
import { Search, Filter, MapPin, Star } from 'lucide-react'
import { Property } from '../../../types'

// Local mock data with real images
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern 2BR Apartment Near UNN',
    description: 'A stylish apartment close to campus with stable power, WiFi, and borehole water.',
    location: 'Nsukka, Enugu State',
    price: 120000,
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
    amenities: ['WiFi', 'Power Supply', 'Water', 'Security'],
    rules: ['No smoking', 'No pets'],
    landlordId: 'landlord1',
    landlord: {
      id: 'landlord1',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Okechukwu',
      role: 'landlord',
      isVerified: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    isAvailable: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    title: 'Shared Room in Student Lodge',
    description: 'Affordable shared accommodation for students with large study area.',
    location: 'University of Ibadan',
    price: 80000,
    images: ['https://images.unsplash.com/photo-1600607688979-a3bbf6c3d6b5?w=800'],
    amenities: ['WiFi', 'Shared Kitchen', 'Study Area'],
    rules: ['Quiet hours after 10pm'],
    landlordId: 'landlord2',
    landlord: {
      id: 'landlord2',
      email: 'mary@example.com',
      firstName: 'Mary',
      lastName: 'Adebayo',
      role: 'landlord',
      isVerified: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    isAvailable: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '3',
    title: 'Self-Contained Apartment Near UNILAG',
    description: 'Fully tiled, ensuite bathroom, and constant water supply.',
    location: 'Yaba, Lagos',
    price: 150000,
    images: ['https://images.unsplash.com/photo-1586105251261-72a756497a12?w=800'],
    amenities: ['Power Supply', 'Water', 'Wardrobe', 'Kitchenette'],
    rules: ['No loud music', 'No pets'],
    landlordId: 'landlord3',
    landlord: {
      id: 'landlord3',
      email: 'emma@example.com',
      firstName: 'Emmanuel',
      lastName: 'Okafor',
      role: 'landlord',
      isVerified: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    isAvailable: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '4',
    title: 'Female Hostel – Shared Room',
    description: 'Comfortable and secure female-only hostel close to UNIBEN campus.',
    location: 'Benin City, Edo State',
    price: 60000,
    images: ['https://images.unsplash.com/photo-1595526114035-0b73b0b9e1b3?w=800'],
    amenities: ['Security', 'WiFi', 'Common Room'],
    rules: ['Females only', 'No visitors after 8pm'],
    landlordId: 'landlord4',
    landlord: {
      id: 'landlord4',
      email: 'grace@example.com',
      firstName: 'Grace',
      lastName: 'Eze',
      role: 'landlord',
      isVerified: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    isAvailable: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '5',
    title: 'Luxury Mini Flat – Near FUTA South Gate',
    description: 'Furnished apartment with inverter and parking space.',
    location: 'Akure, Ondo State',
    price: 180000,
    images: ['https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800'],
    amenities: ['Parking', 'Power Backup', 'WiFi', 'Furnished'],
    rules: ['No parties', 'No smoking'],
    landlordId: 'landlord5',
    landlord: {
      id: 'landlord5',
      email: 'david@example.com',
      firstName: 'David',
      lastName: 'Olawale',
      role: 'landlord',
      isVerified: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    isAvailable: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
]

export default function Housing() {
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = mockProperties.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.landlord.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Student Housing
          </h1>
          <p className="text-muted-foreground">
            Find verified off-campus accommodation near your university
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card text-card-foreground border border-border rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by location, university, or property name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-muted transition-colors text-foreground">
              <Filter className="h-5 w-5" />
              Filters
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Listings */}
          <div className="lg:col-span-2 space-y-6">
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No properties found.</p>
              </div>
            ) : (
              filtered.map((property) => (
                <div
                  key={property.id}
                  className="bg-card text-card-foreground border border-border rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-foreground">
                          {property.title}
                        </h3>
                        <span className="text-2xl font-bold text-primary">
                          ₦{property.price.toLocaleString()}/year
                        </span>
                      </div>

                      <div className="flex items-center text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4 mr-1" />
                        {property.location}
                      </div>

                      <div className="flex items-center mb-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm text-muted-foreground">
                            4.5 (12 reviews)
                          </span>
                        </div>
                        <span className="mx-2 text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">
                          {property.landlord.firstName} {property.landlord.lastName}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {property.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:opacity-90 transition-colors">
                          View Details
                        </button>
                        <button className="px-4 py-2 border border-input rounded-lg hover:bg-muted transition-colors text-foreground">
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Map/Sidebar */}
          <div className="bg-card text-card-foreground border border-border rounded-lg shadow-sm p-6">
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
  )
}
