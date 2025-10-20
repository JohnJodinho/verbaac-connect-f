import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star } from 'lucide-react';
import { Property } from '../../../types';
import { housingAPI } from '../../../lib/api';

// Mock data as fallback
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern 2BR Apartment Near UNN',
    description: 'A beautiful modern apartment with all amenities',
    location: 'Nsukka, Enugu State',
    price: 120000,
    images: ['/api/placeholder/400/300'],
    amenities: ['WiFi', 'Power Supply', 'Water', 'Security'],
    rules: ['No smoking', 'No pets'],
    landlordId: 'landlord1',
    landlord: {
      id: 'landlord1',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Okechukwu',
      role: 'landlord' as const,
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
    description: 'Affordable shared accommodation for students',
    location: 'University of Ibadan',
    price: 80000,
    images: ['/api/placeholder/400/300'],
    amenities: ['WiFi', 'Shared Kitchen', 'Study Area'],
    rules: ['Quiet hours after 10pm'],
    landlordId: 'landlord2',
    landlord: {
      id: 'landlord2',
      email: 'mary@example.com',
      firstName: 'Mary',
      lastName: 'Adebayo',
      role: 'landlord' as const,
      isVerified: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    isAvailable: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

export default function Housing() {
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await housingAPI.getProperties();
        // Handle paginated response
        setProperties(response.data.data);
      } catch (err) {
        setError('Failed to load properties. Please try again.');
        console.error('Error fetching properties:', err);
        // Fallback to mock data for development
        setProperties(mockProperties);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Student Housing
          </h1>
          <p className="text-gray-600">
            Find verified off-campus accommodation near your university
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by location, university, or property name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-5 w-5" />
              Filters
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Listings */}
          <div className="lg:col-span-2 space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading properties...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="text-blue-600 hover:text-blue-700"
                >
                  Try again
                </button>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No properties found.</p>
              </div>
            ) : (
              properties.map((property) => (
                <div key={property.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3">
                      <img
                        src={property.images[0] || '/api/placeholder/400/300'}
                        alt={property.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {property.title}
                        </h3>
                        <span className="text-2xl font-bold text-blue-600">
                          ₦{property.price.toLocaleString()}/year
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="h-4 w-4 mr-1" />
                        {property.location}
                      </div>

                      <div className="flex items-center mb-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm text-gray-600">
                            4.5 (12 reviews)
                          </span>
                        </div>
                        <span className="mx-2">•</span>
                        <span className="text-sm text-gray-600">
                          {property.landlord.firstName} {property.landlord.lastName}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {property.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                          View Details
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
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
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Map View
            </h3>
            <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Map integration coming soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
