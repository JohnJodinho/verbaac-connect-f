import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star } from 'lucide-react';
import { housingAPI } from '../../../lib/api';
// Mock data as fallback
const mockProperties = [
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
            role: 'landlord',
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
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await housingAPI.getProperties();
                // Handle paginated response
                setProperties(response.data.data);
            }
            catch (err) {
                setError('Failed to load properties. Please try again.');
                console.error('Error fetching properties:', err);
                // Fallback to mock data for development
                setProperties(mockProperties);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchProperties();
    }, []);
    return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-4", children: "Student Housing" }), _jsx("p", { className: "text-gray-600", children: "Find verified off-campus accommodation near your university" })] }), _jsx("div", { className: "bg-white rounded-lg shadow-sm p-6 mb-8", children: _jsxs("div", { className: "flex flex-col lg:flex-row gap-4", children: [_jsx("div", { className: "flex-1", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" }), _jsx("input", { type: "text", placeholder: "Search by location, university, or property name...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }) }), _jsxs("button", { className: "flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50", children: [_jsx(Filter, { className: "h-5 w-5" }), "Filters"] })] }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsx("div", { className: "lg:col-span-2 space-y-6", children: isLoading ? (_jsxs("div", { className: "flex items-center justify-center py-12", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }), _jsx("span", { className: "ml-2 text-gray-600", children: "Loading properties..." })] })) : error ? (_jsxs("div", { className: "text-center py-12", children: [_jsx("p", { className: "text-red-600 mb-4", children: error }), _jsx("button", { onClick: () => window.location.reload(), className: "text-blue-600 hover:text-blue-700", children: "Try again" })] })) : properties.length === 0 ? (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-gray-600", children: "No properties found." }) })) : (properties.map((property) => (_jsx("div", { className: "bg-white rounded-lg shadow-sm overflow-hidden", children: _jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx("div", { className: "md:w-1/3", children: _jsx("img", { src: property.images[0] || '/api/placeholder/400/300', alt: property.title, className: "w-full h-48 md:h-full object-cover" }) }), _jsxs("div", { className: "md:w-2/3 p-6", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsx("h3", { className: "text-xl font-semibold text-gray-900", children: property.title }), _jsxs("span", { className: "text-2xl font-bold text-blue-600", children: ["\u20A6", property.price.toLocaleString(), "/year"] })] }), _jsxs("div", { className: "flex items-center text-gray-600 mb-4", children: [_jsx(MapPin, { className: "h-4 w-4 mr-1" }), property.location] }), _jsxs("div", { className: "flex items-center mb-4", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Star, { className: "h-4 w-4 text-yellow-400 fill-current" }), _jsx("span", { className: "ml-1 text-sm text-gray-600", children: "4.5 (12 reviews)" })] }), _jsx("span", { className: "mx-2", children: "\u2022" }), _jsxs("span", { className: "text-sm text-gray-600", children: [property.landlord.firstName, " ", property.landlord.lastName] })] }), _jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: property.amenities.map((amenity) => (_jsx("span", { className: "px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full", children: amenity }, amenity))) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { className: "flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors", children: "View Details" }), _jsx("button", { className: "px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors", children: "Contact" })] })] })] }) }, property.id)))) }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4 text-gray-900", children: "Map View" }), _jsx("div", { className: "h-96 bg-gray-200 rounded-lg flex items-center justify-center", children: _jsx("span", { className: "text-gray-500", children: "Map integration coming soon" }) })] })] })] }) }));
}
