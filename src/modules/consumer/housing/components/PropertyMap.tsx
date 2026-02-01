import { useEffect, useRef, useState } from 'react';
import * as atlas from 'azure-maps-control';
import 'azure-maps-control/dist/atlas.min.css';
import { MapPin, Lock, Eye, EyeOff } from 'lucide-react';
import { useVisibilityGate } from '@/hooks/useVisibilityGate';

interface PropertyMapProps {
  zoneName: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  hasEscrowPayment?: boolean;
}

export function PropertyMap({
  zoneName,
  coordinates,
  hasEscrowPayment = false,
}: PropertyMapProps) {
  const { isGuest, showPreciseLocation } = useVisibilityGate();
  const canShowPrecise = showPreciseLocation(hasEscrowPayment);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<atlas.Map | null>(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || !coordinates) return;

    if (!import.meta.env.VITE_AZURE_MAPS_KEY) {
        setMapError(true);
        return;
    }

    // Privacy Guard Logic
    // If not precise, offset the center slightly (approx 500m-1km offset)
    // 0.005 degrees is roughly 500m
    const offsetLat = canShowPrecise ? 0 : (Math.random() - 0.5) * 0.01;
    const offsetLng = canShowPrecise ? 0 : (Math.random() - 0.5) * 0.01;

    const center = [
        coordinates.lng + offsetLng, 
        coordinates.lat + offsetLat
    ];

    const zoomLevel = canShowPrecise ? 16 : 13;
    const maxZoom = canShowPrecise ? 20 : 14; // Strictly lock zoom for privacy

    const map = new atlas.Map(mapRef.current, {
      authOptions: {
        authType: atlas.AuthenticationType.subscriptionKey,
        subscriptionKey: import.meta.env.VITE_AZURE_MAPS_KEY,
      },
      center: center,
      zoom: zoomLevel,
      maxZoom: maxZoom,
      view: 'Auto',
      showLogo: false,
    });

    map.events.add('ready', () => {
        // If precise, add a pin
        if (canShowPrecise) {
            const dataSource = new atlas.source.DataSource();
            map.sources.add(dataSource);
            
            const point = new atlas.data.Feature(new atlas.data.Point([
                coordinates.lng,
                coordinates.lat
            ]));
            dataSource.add(point);

            const symbolLayer = new atlas.layer.SymbolLayer(dataSource, undefined, {
                iconOptions: {
                    image: 'pin-round-red',
                    anchor: 'bottom'
                }
            });
            map.layers.add(symbolLayer);
        } else {
            // If not precise, maybe add a circle to indicate general area
             const dataSource = new atlas.source.DataSource();
             map.sources.add(dataSource);

             // Create a circle of approx 1km radius around the "center" (which is already offset)
             // or just around the actual coordinates but with a large radius
             // Actually, a simple circle around the APPROXIMATE center is safer visually
             
             // For simplicity in this privacy guard, we just show the area without specific markers
             // preventing the user from pinpointing a specific house.
        }

        // Prevent zooming in further than allowed
        map.events.add('zoomend', () => {
            const currentZoom = map.getCamera().zoom;
            if (currentZoom !== undefined && currentZoom > maxZoom) {
                map.setCamera({ zoom: maxZoom });
            }
        });

        // Disable pitch and rotate for cleaner simple view
        map.setUserInteraction({
            pitchWithDegrees: false,
            rotateWithRightClick: false
        });

        mapInstanceRef.current = map;
    });

    map.events.add('error', () => {
        setMapError(true);
    });

    return () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.dispose();
            mapInstanceRef.current = null;
        }
    };
  }, [coordinates, canShowPrecise]);


  // Generate static map URL for zone preview (fallback)
  const getZonePreviewUrl = () => {
    return `https://via.placeholder.com/600x300?text=${encodeURIComponent(zoneName + ' Area')}`;
  };

  return (
    <div className="relative rounded-xl overflow-hidden border border-border">
      {/* Map Container */}
      <div className="relative h-64 bg-muted">
        {!mapError && coordinates ? (
           <div ref={mapRef} className="w-full h-full" />
        ) : (
             // Fallback image
            <img
              src={getZonePreviewUrl()}
              alt={`General area of ${zoneName}`}
              className="w-full h-full object-cover filter blur-sm"
            />
        )}
             
        {/* Overlay for restricted view */}
        {!canShowPrecise && (
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent 
                          flex flex-col items-center justify-center p-6 text-foreground pointer-events-none">
              
               {/* Click-through blocker */}
               <div className="pointer-events-auto flex flex-col items-center">
                  <div className="bg-background/80 backdrop-blur-md rounded-full p-4 mb-4 shadow-lg">
                    {isGuest ? (
                      <EyeOff className="h-8 w-8 text-muted-foreground" />
                    ) : (
                      <Lock className="h-8 w-8 text-primary" />
                    )}
                  </div>
                  
                  <h4 className="text-lg font-semibold mb-2 text-center bg-background/50 backdrop-blur-sm px-3 py-1 rounded-md">
                    {isGuest ? 'Sign in to view location' : 'Precise Location Protected'}
                  </h4>
                  
                  <p className="text-sm text-foreground/80 text-center max-w-xs mb-4 bg-background/50 backdrop-blur-sm px-2 rounded">
                    {isGuest 
                      ? 'Create an account to see property locations and contact landlords.'
                      : 'Pay into escrow to unlock the precise location and contact details.'}
                  </p>
               </div>
            </div>
        )}
      </div>

      {/* Zone Badge */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 
                    bg-background/90 backdrop-blur-sm rounded-full shadow-lg border border-border">
        <MapPin className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-foreground">{zoneName}</span>
      </div>

      {/* Visibility Status Badge */}
      <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 
                      rounded-full shadow-lg text-xs font-medium border
                      ${canShowPrecise 
                        ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' 
                        : 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'}`}>
        {canShowPrecise ? (
          <>
            <Eye className="h-3.5 w-3.5" />
            Precise View
          </>
        ) : (
          <>
            <EyeOff className="h-3.5 w-3.5" />
            Approximate Location
          </>
        )}
      </div>
    </div>
  );
}
