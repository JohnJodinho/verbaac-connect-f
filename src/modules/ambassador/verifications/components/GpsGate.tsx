/**
 * GPS Gate Component
 * 
 * Geo-validation gate that checks if the Ambassador is within 100m of the property.
 * Uses navigator.geolocation to get current position.
 * 
 * Features:
 * - Request geolocation permission
 * - Calculate distance to property
 * - Show success/error states
 * - Handle GPS permission denial and poor accuracy
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  AlertTriangle,
  LocateFixed,
  RefreshCw
} from 'lucide-react';
import { 
  checkProximity, 
  PROXIMITY_THRESHOLD_METERS,
  type ProximityCheckResult 
} from '../../api/ambassador.service';

interface GpsGateProps {
  taskId: string;
  propertyAddress: string;
  propertyCoords: { lat: number; lng: number };
  onProximityVerified: (checkInGeom: { lat: number; lng: number }) => void;
  onCancel: () => void;
}

type GateState = 'idle' | 'requesting' | 'checking' | 'success' | 'too_far' | 'error';

interface GpsError {
  type: 'permission_denied' | 'position_unavailable' | 'timeout' | 'low_accuracy' | 'api_error';
  message: string;
}

export default function GpsGate({ 
  taskId, 
  propertyAddress, 
  propertyCoords, 
  onProximityVerified, 
  onCancel 
}: GpsGateProps) {
  const [state, setState] = useState<GateState>('idle');
  const [result, setResult] = useState<ProximityCheckResult | null>(null);
  const [error, setError] = useState<GpsError | null>(null);
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);

  const requestLocation = useCallback(async () => {
    setState('requesting');
    setError(null);
    setResult(null);

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setError({
        type: 'position_unavailable',
        message: 'Geolocation is not supported by your device.',
      });
      setState('error');
      return;
    }

    // Request position
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        // Check accuracy - warn if poor (> 50m)
        if (accuracy > 50) {
          console.warn('[GPS] Poor accuracy:', accuracy, 'meters');
          // Still proceed but could show warning
        }

        setCurrentPosition({ lat: latitude, lng: longitude });
        setState('checking');

        try {
          // Check proximity with API
          const proximityResult = await checkProximity(taskId, latitude, longitude);
          setResult(proximityResult);

          if (proximityResult.isWithinRange) {
            setState('success');
          } else {
            setState('too_far');
          }
        } catch (err) {
          console.error('[GPS] API error:', err);
          setError({
            type: 'api_error',
            message: 'Failed to verify proximity. Please try again.',
          });
          setState('error');
        }
      },
      (geoError) => {
        console.error('[GPS] Geolocation error:', geoError);
        
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            setError({
              type: 'permission_denied',
              message: 'Location access denied. Please enable location permissions in your browser settings.',
            });
            break;
          case geoError.POSITION_UNAVAILABLE:
            setError({
              type: 'position_unavailable',
              message: 'Unable to determine your location. Please ensure GPS is enabled.',
            });
            break;
          case geoError.TIMEOUT:
            setError({
              type: 'timeout',
              message: 'Location request timed out. Please try again.',
            });
            break;
          default:
            setError({
              type: 'position_unavailable',
              message: 'An unknown error occurred while getting your location.',
            });
        }
        setState('error');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, [taskId]);

  const handleProceed = () => {
    if (result?.checkInGeom) {
      onProximityVerified(result.checkInGeom);
    }
  };

  const renderContent = () => {
    switch (state) {
      case 'idle':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 mx-auto bg-role-ambassador/10 rounded-full flex items-center justify-center mb-4">
              <Navigation className="w-10 h-10 text-role-ambassador" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Location Verification Required
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
              To ensure authenticity, you must be within {PROXIMITY_THRESHOLD_METERS}m of the property to start the audit.
            </p>
            
            <div className="bg-muted/50 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3 text-left">
                <MapPin className="w-5 h-5 text-role-ambassador shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Property Location</p>
                  <p className="text-xs text-muted-foreground mt-1">{propertyAddress}</p>
                </div>
              </div>
            </div>

            <button
              onClick={requestLocation}
              className="w-full py-4 bg-role-ambassador text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-role-ambassador/90 transition-colors touch-target"
            >
              <LocateFixed className="w-5 h-5" />
              Check My Location
            </button>
          </motion.div>
        );

      case 'requesting':
      case 'checking':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 mx-auto bg-role-ambassador/10 rounded-full flex items-center justify-center mb-4 relative">
              <Loader2 className="w-10 h-10 text-role-ambassador animate-spin" />
              {/* Pulsing ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-role-ambassador/30"
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {state === 'requesting' ? 'Requesting Location...' : 'Verifying Proximity...'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {state === 'requesting' 
                ? 'Please allow location access when prompted'
                : 'Calculating distance to property'}
            </p>
          </motion.div>
        );

      case 'success':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Location Verified!
            </h2>
            <p className="text-sm text-muted-foreground mb-2">
              You are {result?.distanceMeters}m from the property.
            </p>
            <p className="text-sm text-emerald-600 font-medium mb-6">
              You may proceed with the audit.
            </p>

            <button
              onClick={handleProceed}
              className="w-full py-4 bg-emerald-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors touch-target"
            >
              <CheckCircle2 className="w-5 h-5" />
              Start Audit
            </button>
          </motion.div>
        );

      case 'too_far':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-10 h-10 text-destructive" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Too Far From Property
            </h2>
            <p className="text-sm text-muted-foreground mb-2">
              You are <span className="font-semibold text-destructive">{result?.distanceMeters}m</span> away.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Please move within {PROXIMITY_THRESHOLD_METERS}m of the property to continue.
            </p>

            <div className="space-y-3">
              <button
                onClick={requestLocation}
                className="w-full py-4 bg-role-ambassador text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-role-ambassador/90 transition-colors touch-target"
              >
                <RefreshCw className="w-5 h-5" />
                Check Again
              </button>
              <button
                onClick={onCancel}
                className="w-full py-3 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80 transition-colors touch-target"
              >
                Go Back
              </button>
            </div>
          </motion.div>
        );

      case 'error':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-10 h-10 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              {error?.type === 'permission_denied' ? 'Location Access Denied' : 'Location Error'}
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
              {error?.message}
            </p>

            <div className="space-y-3">
              <button
                onClick={requestLocation}
                className="w-full py-4 bg-role-ambassador text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-role-ambassador/90 transition-colors touch-target"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
              <button
                onClick={onCancel}
                className="w-full py-3 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80 transition-colors touch-target"
              >
                Go Back
              </button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 pb-[env(safe-area-inset-bottom,1rem)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card rounded-2xl border border-border shadow-xl p-6 max-w-sm w-full"
      >
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>

        {/* Debug info in development */}
        {import.meta.env.DEV && currentPosition && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg text-xs font-mono text-muted-foreground">
            <p>Your: {currentPosition.lat.toFixed(6)}, {currentPosition.lng.toFixed(6)}</p>
            <p>Target: {propertyCoords.lat.toFixed(6)}, {propertyCoords.lng.toFixed(6)}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
