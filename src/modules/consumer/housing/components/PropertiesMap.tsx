import { useEffect, useRef, useState } from 'react';
import * as atlas from 'azure-maps-control';
import 'azure-maps-control/dist/atlas.min.css';
import { useNavigate } from 'react-router-dom';
import type { PropertyDetail } from '@/types';
import { MapPin } from 'lucide-react';

interface PropertiesMapProps {
  properties: PropertyDetail[];
}

export function PropertiesMap({ properties }: PropertiesMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<atlas.Map | null>(null);
  const dataSourceRef = useRef<atlas.source.DataSource | null>(null);
  const navigate = useNavigate();
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = new atlas.Map(mapRef.current, {
      authOptions: {
        authType: atlas.AuthenticationType.subscriptionKey,
        subscriptionKey: import.meta.env.VITE_AZURE_MAPS_KEY || '',
      },
      center: [8.8884, 9.8862], // Jos center
      zoom: 12,
      view: 'Auto',
    });

    map.events.add('ready', () => {
      // Create a data source and add it to the map
      const dataSource = new atlas.source.DataSource();
      map.sources.add(dataSource);
      dataSourceRef.current = dataSource;

      // Create a symbol layer to render icons
      const symbolLayer = new atlas.layer.SymbolLayer(dataSource, undefined, {
        iconOptions: {
          image: 'pin-round-darkblue',
          anchor: 'center',
          allowOverlap: true,
          size: 0.8
        },
        textOptions: {
          textField: ['get', 'price'],
          offset: [0, -1.5],
          color: '#FFFFFF',
          haloColor: '#000000',
          haloWidth: 1,
          size: 12
        }
      });
      map.layers.add(symbolLayer);

      // Create a popup but don't add it to the map yet
      const popup = new atlas.Popup({
        pixelOffset: [0, -18],
        closeButton: false,
      });

      // Add hover events
      map.events.add('mouseover', symbolLayer, (e) => {
        if (e.shapes && e.shapes.length > 0) {
          const shape = e.shapes[0] as atlas.Shape;
          const content = shape.getProperties();
          const coordinate = shape.getCoordinates() as atlas.data.Position;

          popup.setOptions({
            content: `
              <div class="p-3 bg-white rounded-lg shadow-lg min-w-[150px]">
                <h4 class="font-bold text-sm truncate">${content.title}</h4>
                <p class="text-xs text-gray-500 mb-1">${content.type}</p>
                <div class="text-primary font-bold text-sm">${content.priceFormatted}</div>
              </div>
            `,
            position: coordinate,
          });
          popup.open(map);
        }
      });

      map.events.add('mouseleave', symbolLayer, () => {
         // Optional: close popup on leave, or keep it open until another hover
         // popup.close(); 
      });

      // Add click event for navigation
      map.events.add('click', symbolLayer, (e) => {
        if (e.shapes && e.shapes.length > 0) {
            const shape = e.shapes[0] as atlas.Shape;
            const props = shape.getProperties();
            if (props.id) {
                navigate(`/housing/property/${props.id}`);
            }
        }
      });

      mapInstanceRef.current = map;
      setIsMapReady(true);
    });

    // Handle map load errors (e.g. invalid key)
    map.events.add('error', function (e) {
        console.error('Azure Maps Error', e);
    });

    return () => {
      // Cleanup if needed, though usually map instance persists for page life
      if (mapInstanceRef.current) {
        mapInstanceRef.current.dispose();
        mapInstanceRef.current = null;
      }
    };
  }, [navigate]);

  // Update data source when properties change
  useEffect(() => {
    if (!isMapReady || !dataSourceRef.current) return;

    const points = properties
        .filter(p => {
            const geo = p.location.geoLocation;
            return geo && typeof geo.lat === 'number' && typeof geo.lng === 'number';
        })
        .map(p => {
            return new atlas.data.Feature(new atlas.data.Point([
                p.location.geoLocation!.lng, 
                p.location.geoLocation!.lat
            ]), {
                id: p.id,
                title: p.title,
                price: `₦${(p.rent.amount / 1000).toFixed(0)}k`,
                priceFormatted: new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(p.rent.amount),
                type: p.propertyType
            });
        });

    dataSourceRef.current.clear();
    dataSourceRef.current.add(points);
    
    // Adjust camera to fit all points if there are any
    if (points.length > 0 && mapInstanceRef.current) {
         // Create a bounding box from all positions
         const positions = points.map(f => f.geometry.coordinates);
         const bbox = atlas.data.BoundingBox.fromPositions(positions);
         mapInstanceRef.current.setCamera({
             bounds: bbox,
             padding: 40
         });
    }

  }, [properties, isMapReady]);

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden border border-border bg-muted">
       <div ref={mapRef} className="w-full h-full" />
       
       {!import.meta.env.VITE_AZURE_MAPS_KEY && (
           <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10 backdrop-blur-sm">
               <div className="text-center p-6 max-w-md">
                   <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                       <MapPin className="w-6 h-6" />
                   </div>
                   <h3 className="text-lg font-bold mb-2">Azure Maps Key Missing</h3>
                   <p className="text-muted-foreground text-sm mb-4">
                       Please set VITE_AZURE_MAPS_KEY in your .env file to enable the map.
                       Using fallback view.
                   </p>
               </div>
           </div>
       )}
    </div>
  );
}
