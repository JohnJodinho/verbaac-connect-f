import { motion } from 'framer-motion';
import { MapPin, Lock, Eye, EyeOff } from 'lucide-react';
import { useVisibilityGate } from '@/hooks/useVisibilityGate';

interface PropertyMapProps {
  /** General zone/area name (always visible) */
  zoneName: string;
  /** Precise coordinates (only visible after escrow) */
  coordinates?: {
    lat: number;
    lng: number;
  };
  /** Google Maps embed URL or link */
  mapUrl?: string;
  /** Whether user has paid escrow for this property */
  hasEscrowPayment?: boolean;
  /** Property ID for reference */
  propertyId?: string;
}

/**
 * PropertyMap - Context-aware map component that implements the visibility gate.
 * - Guest: Shows general zone only
 * - Consumer (after escrow): Shows precise pin location
 */
export function PropertyMap({
  zoneName,
  coordinates,
  mapUrl,
  hasEscrowPayment = false,
  propertyId,
}: PropertyMapProps) {
  const { isGuest, showPreciseLocation } = useVisibilityGate();
  
  const canShowPrecise = showPreciseLocation(hasEscrowPayment);

  // Generate static map URL for zone preview (blurred/general view)
  const getZonePreviewUrl = () => {
    // Using a placeholder since we don't have actual Google Maps API key
    return `/api/placeholder/600/300?text=${encodeURIComponent(zoneName + ' Area')}`;
  };

  // Generate precise map embed for escrow-paid users
  const getPreciseMapUrl = () => {
    if (coordinates && mapUrl) {
      return mapUrl;
    }
    if (coordinates) {
      return `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=17&output=embed`;
    }
    return null;
  };

  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-200">
      {/* Map Container */}
      <div className="relative h-64 bg-gray-100">
        {canShowPrecise && getPreciseMapUrl() ? (
          // Precise location view (after escrow)
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full"
          >
            <iframe
              src={getPreciseMapUrl()!}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map showing ${zoneName}`}
            />
          </motion.div>
        ) : (
          // Zone preview (general view)
          <>
            <img
              src={getZonePreviewUrl()}
              alt={`General area of ${zoneName}`}
              className="w-full h-full object-cover filter blur-sm"
            />
            
            {/* Overlay for restricted view */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent 
                          flex flex-col items-center justify-center text-white p-6">
              <div className="bg-white/10 backdrop-blur-md rounded-full p-4 mb-4">
                {isGuest ? (
                  <EyeOff className="h-8 w-8" />
                ) : (
                  <Lock className="h-8 w-8" />
                )}
              </div>
              
              <h4 className="text-lg font-semibold mb-2 text-center">
                {isGuest ? 'Sign in to view location' : 'Precise Location Protected'}
              </h4>
              
              <p className="text-sm text-white/80 text-center max-w-xs mb-4">
                {isGuest 
                  ? 'Create an account to see property locations and contact landlords.'
                  : 'Pay into escrow to unlock the precise location and contact details.'}
              </p>

              <button
                className="flex items-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-600 
                         text-white font-medium rounded-lg transition-colors"
              >
                {isGuest ? (
                  <>
                    <Eye className="h-4 w-4" />
                    Sign In to View
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Pay to Unlock Location
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Zone Badge */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 
                    bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
        <MapPin className="h-4 w-4 text-teal-600" />
        <span className="text-sm font-medium text-gray-900">{zoneName}</span>
      </div>

      {/* Visibility Status Badge */}
      <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 
                      rounded-full shadow-lg text-xs font-medium
                      ${canShowPrecise 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-amber-100 text-amber-700'}`}>
        {canShowPrecise ? (
          <>
            <Eye className="h-3.5 w-3.5" />
            Precise View
          </>
        ) : (
          <>
            <EyeOff className="h-3.5 w-3.5" />
            Zone Only
          </>
        )}
      </div>
    </div>
  );
}
