import { useState, useEffect, type ReactNode } from 'react';
import { useParams, Link } from 'react-router-dom';
import { type PropertyDetail } from '@/types/index';
import { PageWrapper, AnimatedButton, PageLoader } from '@/components/animated/index';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Star, MapPin, Share, Bookmark, CheckCircle, Bed, Bath, Soup, 
  Wifi, Zap, Droplet, Shield,  Building, User, MessageSquare, 
  ChevronDown, ArrowRight, Banknote, Calendar, Check, X,
  Map, Video, Image as ImageIcon, Phone, HomeIcon
} from 'lucide-react';
import { propertyDetails } from '@/data/mock-properties';

// --- Helper Components (internal to this file) ---

// For Section 3: Overview
const InfoItem = ({ icon, label, value }: { icon: ReactNode; label: string; value?: string }) => (
  <div className="flex items-center space-x-3">
    <div className="flex-shrink-0 p-2 bg-primary/10 text-primary rounded-lg">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base font-semibold text-foreground">{value || 'N/A'}</p>
    </div>
  </div>
);

// For Section 4: Features
const FeaturePill = ({ icon, label, available }: { icon: ReactNode; label: string; available: boolean }) => (
  <div 
    className={`flex items-center space-x-2 border rounded-full px-3 py-1.5 ${
      available 
        ? 'bg-card border-border' 
        : 'bg-muted/50 border-dashed text-muted-foreground opacity-60'
    }`}
  >
    {available ? (
      <Check className="w-4 h-4 text-green-500" />
    ) : (
      <X className="w-4 h-4 text-red-500" />
    )}
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </div>
);

// For Section 6: Reviews
const ReviewBar = ({ category, rating }: { category: string; rating: number }) => {
  const percentage = (rating / 5) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm font-medium">
        <span className="text-foreground">{category}</span>
        <span className="text-muted-foreground">{rating.toFixed(1)}</span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-2 bg-primary"
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        />
      </div>
    </div>
  );
};

// --- Main Page Component ---

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [mediaTab, setMediaTab] = useState<'Photos' | 'Map' | 'Video'>('Photos');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // --- Scroll Animations ---
  const { scrollY } = useScroll();
  // Sticky header fades in after 200px
  const stickyHeaderOpacity = useTransform(scrollY, [150, 200], [0, 1]);
  // Mobile sticky bar fades in after 400px
  const mobileBarOpacity = useTransform(scrollY, [300, 400], [1, 1]); // Always visible after 400px

useEffect(() => {
    // --- 3. Find the property ---
    const fetchPropertyDetails = () => {
      setLoading(true);
      
      const foundProperty = propertyDetails.find(p => p.id === id);
      
      if (foundProperty) {
        setProperty(foundProperty);
      } else {
        setProperty(null); // Set to null if not found
      }
      
      // Simulate a short delay, as finding in a list is instant
      setTimeout(() => setLoading(false), 200); 
    };

    fetchPropertyDetails();
  }, [id]); // Re-run this effect if the ID in the URL changes

  if (loading) {
    return <PageLoader />;
  }

  if (!property) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center h-[70vh] text-center">
          <HomeIcon className="w-24 h-24 text-muted-foreground/50" />
          <h1 className="mt-4 text-3xl font-bold text-foreground">Property Not Found</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            The property you're looking for (ID: {id}) doesn't exist or has been removed.
          </p>
          <AnimatedButton className="mt-6">
            <Link to="/housing">Back to Listings</Link>
          </AnimatedButton>
        </div>
      </PageWrapper>
    );
  }

  // --- Helpers for derived data ---
  const formattedRent = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(property.rent.amount);

  const mainImage = property.images[currentImageIndex] || property.thumbnailImage;

  return (
    <PageWrapper>
      {/* --- STICKY HEADER (Section 1 - On Scroll) --- */}
      <motion.header
        style={{ opacity: stickyHeaderOpacity }}
        className="hidden lg:flex fixed top-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-md border-b border-border z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between w-full">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{property.title}</h2>
            <p className="text-sm text-muted-foreground">{property.location.address}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-primary">{formattedRent}</span>
            <AnimatedButton>
              <MessageSquare className="w-4 h-4 mr-2" /> Message Landlord
            </AnimatedButton>
          </div>
        </div>
      </motion.header>
      
      {/* --- Main Page Content --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* === Main Content (Left Column) === */}
          <main className="lg:col-span-2 space-y-8">
            
            {/* --- SECTION 1: Header --- */}
            <section id="header" className="pb-6 border-b border-border">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {property.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                {property.propertyType} • {property.location.address}
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  property.availability === 'Available' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
                }`}>
                  {property.availability}
                </div>
                {property.landlord.verified && (
                  <div className="flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    <CheckCircle className="w-4 h-4 mr-1.5" /> Verified Landlord
                  </div>
                )}
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <AnimatedButton variant="ghost" size="sm"><Bookmark className="w-4 h-4 mr-2" /> Bookmark</AnimatedButton>
                  <AnimatedButton variant="ghost" size="sm"><Share className="w-4 h-4 mr-2" /> Share</AnimatedButton>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Last verified: {new Date(property.metadata.verifiedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </section>

            {/* --- SECTION 2: Media Gallery --- */}
            <section id="gallery">
              <div className="flex space-x-2 border-b border-border mb-4">
                <button
                  onClick={() => setMediaTab('Photos')}
                  className={`py-3 px-4 text-sm font-medium ${mediaTab === 'Photos' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                ><ImageIcon className="w-4 h-4 inline mr-2" /> Photos</button>
                <button
                  onClick={() => setMediaTab('Map')}
                  className={`py-3 px-4 text-sm font-medium ${mediaTab === 'Map' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                ><Map className="w-4 h-4 inline mr-2" /> Map View</button>
                {property.media.videoTour && (
                  <button
                    onClick={() => setMediaTab('Video')}
                    className={`py-3 px-4 text-sm font-medium ${mediaTab === 'Video' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                  ><Video className="w-4 h-4 inline mr-2" /> Video</button>
                )}
              </div>
              
              {/* Gallery Content */}
              <div className="bg-card border border-border rounded-lg p-2">
                {mediaTab === 'Photos' && (
                  <div className="space-y-2">
                    <div className="h-96 w-full rounded-md overflow-hidden bg-muted">
                      <img src={mainImage} alt="Main property view" className="w-full h-full object-cover" />
                    </div>
                    {/* Thumbnails */}
                    <div className="flex space-x-2 overflow-x-auto">
                      {property.images.map((img, index) => (
                        <button key={index} onClick={() => setCurrentImageIndex(index)}
                          className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                            index === currentImageIndex ? 'border-primary' : 'border-transparent'
                          }`}
                        >
                          <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {mediaTab === 'Map' && (
                  <div className="h-96 w-full rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                    {/* Placeholder for actual map embed */}
                    Map Embed Placeholder ({property.location.address})
                  </div>
                )}
                {mediaTab === 'Video' && (
                  <div className="h-96 w-full rounded-md bg-black flex items-center justify-center">
                    {/* Placeholder for video player */}
                    <video src={property.media.videoTour} controls className="w-full h-full" />
                  </div>
                )}
              </div>
            </section>

            {/* --- SECTION 3: Overview & Quick Facts --- */}
            <section id="overview" className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 text-foreground">Overview & Quick Facts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                <InfoItem icon={<HomeIcon className="w-5 h-5" />} label="Property Type" value={property.propertyType} />
                <InfoItem icon={<Banknote className="w-5 h-5" />} label="Rent" value={`${formattedRent} / ${property.rent.duration}`} />
                <InfoItem icon={<Calendar className="w-5 h-5" />} label="Availability" value={property.availability} />
                <InfoItem icon={<MapPin className="w-5 h-5" />} label="Location" value={property.proximity.toCampus} />
                <InfoItem icon={<Bed className="w-5 h-5" />} label="Room Size" value={property.dimensions.roomSize} />
                <InfoItem icon={<Building className="w-5 h-5" />} label="Floor Level" value={property.dimensions.floorLevel} />
                <InfoItem icon={<Bath className="w-5 h-5" />} label="Bathroom" value={property.bathroom.type} />
                <InfoItem icon={<Soup className="w-5 h-5" />} label="Kitchen" value={property.kitchen.access} />
              </div>
            </section>

            {/* --- SECTION 4: Features & Utilities --- */}
            <section id="features" className="space-y-4">
              {/* Amenities */}
              <details className="bg-card border border-border rounded-lg p-4 group" open>
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <h3 className="text-xl font-semibold text-foreground">Amenities</h3>
                  <ChevronDown className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" />
                </summary>
                <div className="flex flex-wrap gap-3 pt-4">
                  <FeaturePill icon={<Soup className="w-4 h-4" />} label="Kitchen" available={property.kitchen.access !== 'None'} />
                  <FeaturePill icon={<Bath className="w-4 h-4" />} label="Bathroom" available={property.bathroom.type === 'Private'} />
                  {/* Add more amenity pills here based on property data */}
                </div>
              </details>
              {/* Utilities */}
              <details className="bg-card border border-border rounded-lg p-4 group">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <h3 className="text-xl font-semibold text-foreground">Utilities</h3>
                  <ChevronDown className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" />
                </summary>
                <div className="flex flex-wrap gap-3 pt-4">
                  <FeaturePill icon={<Droplet className="w-4 h-4" />} label="Water" available={property.utilities.water} />
                  <FeaturePill icon={<Zap className="w-4 h-4" />} label="Electricity" available={property.utilities.electricity} />
                  <FeaturePill icon={<Wifi className="w-4 h-4" />} label="Internet" available={property.utilities.internet || false} />
                  <FeaturePill icon={<Zap className="w-4 h-4" />} label="Prepaid Meter" available={property.utilities.prepaidMeter || false} />
                </div>
              </details>
              {/* Security */}
              <details className="bg-card border border-border rounded-lg p-4 group">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <h3 className="text-xl font-semibold text-foreground">Security</h3>
                  <ChevronDown className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" />
                </summary>
                <div className="flex flex-wrap gap-3 pt-4">
                  <FeaturePill icon={<Shield className="w-4 h-4" />} label="Gated" available={property.security.gated} />
                  <FeaturePill icon={<Shield className="w-4 h-4" />} label="Fenced" available={property.security.fenced} />
                  <FeaturePill icon={<User className="w-4 h-4" />} label="Security Guard" available={property.security.securityGuard || false} />
                  <FeaturePill icon={<Shield className="w-4 h-4" />} label="Streetlight" available={property.security.streetLight || false} />
                </div>
              </details>
            </section>

            {/* --- SECTION 5: About the Property --- */}
            <section id="about" className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">About this Property</h2>
              <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {property.description}
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-4 text-foreground">Rules</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {property.rules.map((rule, i) => <li key={i}>{rule}</li>)}
              </ul>
            </section>

            {/* --- SECTION 6: Ratings & Reviews --- */}
            <section id="reviews" className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Ratings & Reviews</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Breakdown */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    <span className="text-2xl font-bold text-foreground">{property.rating.average.toFixed(1)}</span>
                    <span className="text-muted-foreground">({property.rating.reviewCount} reviews)</span>
                  </div>
                  <div className="space-y-3">
                    <ReviewBar category="Cleanliness" rating={property.reviews.cleanliness} />
                    <ReviewBar category="Safety" rating={property.reviews.safety} />
                    <ReviewBar category="Power" rating={property.reviews.power} />
                    <ReviewBar category="Water" rating={property.reviews.water} />
                    <ReviewBar category="Value" rating={property.reviews.value} />
                  </div>
                </div>
                {/* Review List */}
                <div className="space-y-4">
                  {property.reviewList.slice(0, 2).map((review) => (
                    <div key={review.userId} className="border-b border-border pb-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">{review.userName}</span>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`} />
                        ))}
                      </div>
                      <p className="text-sm text-foreground/90 mt-2">{review.comment}</p>
                    </div>
                  ))}
                  <AnimatedButton variant="outline" size="sm" className="w-full">
                    Show all {property.rating.reviewCount} reviews
                  </AnimatedButton>
                </div>
              </div>
            </section>

            {/* --- SECTION 7: Nearby Facilities --- */}
            <section id="nearby" className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 text-foreground">Nearby Facilities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {property.nearbyFacilities?.map((facility) => (
                  <div key={facility.name} className="bg-muted p-4 rounded-lg group hover:bg-primary/10 transition-colors">
                    <Link to={facility.googleMapLink || '#'} target="_blank" className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-foreground">{facility.name}</p>
                        <p className="text-sm text-muted-foreground">{facility.type} • {facility.distance}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                ))}
              </div>
            </section>
            
            {/* --- SECTION 9: Additional Metadata --- */}
            <section id="metadata" className="border-t border-border pt-6 mt-4 text-muted-foreground text-sm flex flex-wrap gap-x-6 gap-y-2 justify-between">
              <p>Property ID: {property.metadata.propertyCode}</p>
              <p>Views: {property.metadata.viewsCount}</p>
              <p>Last Updated: {new Date(property.lastUpdated).toLocaleDateString()}</p>
            </section>

          </main>

          {/* === Sidebar (Right Column) [Section 8] === */}
          <aside className="lg:col-span-1">
            <div id="action-panel-desktop" className="hidden lg:block sticky top-28 bg-card border border-border rounded-lg shadow-xl p-6">
              <h3 className="text-3xl font-bold text-primary mb-2">
                {formattedRent}
                <span className="text-lg text-muted-foreground font-medium">/{property.rent.duration}</span>
              </h3>
              {property.paymentTerms.negotiable && (
                <span className="text-sm font-medium text-green-600">Payment is negotiable</span>
              )}

              <div className="flex flex-col gap-3 mt-6">
                <AnimatedButton variant="primary" size="lg">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Message Landlord
                </AnimatedButton>
                <AnimatedButton variant="secondary" size="lg">
                  Book Inspection
                </AnimatedButton>
              </div>

              {/* Landlord Quick Contact */}
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
                <img src={property.landlord.profileImage} alt={property.landlord.name} className="w-12 h-12 rounded-full" />
                <div>
                  <h4 className="font-semibold text-foreground">{property.landlord.name}</h4>
                  <p className="text-sm text-muted-foreground">Landlord • Verified</p>
                </div>
                <AnimatedButton variant="ghost" size="sm" className="ml-auto">
                  <Phone className="w-4 h-4" />
                </AnimatedButton>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* --- STICKY MOBILE FOOTER (Section 8 - On Scroll) --- */}
      <motion.div
        style={{ opacity: mobileBarOpacity }}
        className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border z-40"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xl font-bold text-primary">{formattedRent}</p>
            <p className="text-sm text-muted-foreground">/{property.rent.duration}</p>
          </div>
          <AnimatedButton variant="primary">
            <MessageSquare className="w-4 h-4 mr-2" /> Message
          </AnimatedButton>
        </div>
      </motion.div>
    </PageWrapper>
  );
}