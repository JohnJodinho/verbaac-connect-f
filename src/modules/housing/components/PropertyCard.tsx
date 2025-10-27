import { type Property } from '../../../types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, CheckCircle, Wifi, Zap,Droplet, Shield } from 'lucide-react';
import { AnimatedButton } from '../../../components/animated';

interface PropertyCardProps {
  property: Property;
}

// Helper to get an icon for common amenities
const AmenityIcon = ({ amenity }: { amenity: string }) => {
  switch (amenity.toLowerCase()) {
    case 'wifi':
      return <Wifi className="w-3 h-3 mr-1" />;
    case 'power supply':
      return <Zap className="w-3 h-3 mr-1" />;
    case 'water':
      return <Droplet className="w-3 h-3 mr-1" />;
    case 'security':
      return <Shield className="w-3 h-3 mr-1" />;
    default:
      return null;
  }
};

export function PropertyCard({ property }: PropertyCardProps) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/housing/${property.id}`);
  };

//   const handleContact = () => {
//     // Logic to open chat modal or contact page
//     console.log('Contacting landlord:', property.landlord.id);
//   };

  // Format rent
  const formattedRent = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: property.rent.currency,
    minimumFractionDigits: 0,
  }).format(property.rent.amount);

  const availabilityClasses = {
    Available: 'bg-green-100 text-green-800',
    Taken: 'bg-red-100 text-red-800',
    Pending: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <motion.div
      className="bg-card text-card-foreground border border-border rounded-lg shadow-sm overflow-hidden group relative transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-primary/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row">
        {/* Section 1: Thumbnail */}
        <div className="md:w-1/3 overflow-hidden">
          <img
            src={property.thumbnailImage}
            alt={property.title}
            className="w-full h-48 md:h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            onError={(e) => (e.currentTarget.src = `https://placehold.co/400x400/3ABEFF/FFFFFF?text=${encodeURIComponent(property.propertyType)}&font=poppins`)}
          />
        </div>

        {/* Section 2: Content */}
        <div className="md:w-2/3 p-4 md:p-6 flex flex-col">
          {/* A. Header: Title + Rent */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-foreground pr-2">
              {property.title}
            </h3>
            <div className="text-right flex-shrink-0">
              <span className="text-2xl font-bold text-primary">
                {formattedRent}
              </span>
              <span className="text-sm font-medium text-muted-foreground block">
                /{property.rent.duration}
              </span>
            </div>
          </div>

          {/* B. Sub-row: Location */}
          <div className="flex items-center text-muted-foreground mb-4 text-sm">
            <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span>{property.location.address}</span>
          </div>

          {/* C. Rating + Landlord */}
          <div className="flex items-center text-sm text-muted-foreground mb-5 flex-wrap">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
            <span className="font-medium text-foreground">{property.rating.average.toFixed(1)}</span>
            <span className="ml-1">({property.rating.reviewCount} reviews)</span>
            <span className="mx-2 text-muted-foreground">•</span>
            <span className="font-medium text-foreground">{property.landlord.name}</span>
            {property.landlord.verified && (
              <CheckCircle className="h-4 w-4 text-primary ml-1.5" />
            )}
          </div>

          {/* D. Top Amenities */}
          <div className="flex flex-wrap gap-2 mb-6">
            {property.topAmenities.slice(0, 4).map((amenity) => (
              <span
                key={amenity}
                className="flex items-center px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full font-medium"
              >
                <AmenityIcon amenity={amenity} />
                {amenity}
              </span>
            ))}
            {property.topAmenities.length > 4 && (
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                +{property.topAmenities.length - 4} more
              </span>
            )}
          </div>

          {/* Spacer to push buttons to bottom */}
          <div className="flex-grow"></div>

          {/* E. Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <AnimatedButton variant="primary" size="sm" onClick={handleViewDetails} className="w-full">
              View Details
            </AnimatedButton>
            {/* <AnimatedButton variant="outline" size="sm" onClick={handleContact} className="w-full">
              Contact
            </AnimatedButton> */}
          </div>
        </div>
      </div>

      {/* Availability Tag */}
      <div
        className={`absolute top-1 right-2 text-xs font-semibold px-3 py-1 rounded-full ${
          availabilityClasses[property.availability]
        }`}
      >
        {property.availability}
      </div>

      {/* Highlighted Ribbon */}
      {property.highlighted && (
        <div className="absolute top-0 left-0">
          <div className="relative px-4 py-1 text-xs font-semibold text-primary-foreground bg-primary rounded-br-lg shadow-md">
            Featured
            <div className="absolute top-0 -left-2 w-2 h-full bg-primary" style={{ clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' }}></div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
