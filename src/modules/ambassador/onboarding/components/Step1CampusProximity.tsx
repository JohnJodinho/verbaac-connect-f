/**
 * Step 1: Campus & Proximity Data
 * 
 * Collects ambassador's assigned campus, current operational zone,
 * and availability status for verification task auto-assignment.
 */

import { motion } from 'framer-motion';
import { MapPin, Building2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CAMPUS_OPTIONS, ZONE_OPTIONS, type AvailabilityStatus } from '../../api/ambassador.service';

interface Step1Props {
  data: {
    assignedCampus: string;
    currentZone: string;
    availabilityStatus: AvailabilityStatus;
  };
  onChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

const AVAILABILITY_OPTIONS: { value: AvailabilityStatus; label: string; description: string }[] = [
  { value: 'available', label: 'Available', description: 'Ready to take on verification tasks' },
  { value: 'busy', label: 'Busy', description: 'Limited availability this week' },
  { value: 'unavailable', label: 'Unavailable', description: 'Not accepting tasks currently' },
];

export default function Step1CampusProximity({ data, onChange, errors }: Step1Props) {
  const inputClasses = (hasError: boolean) =>
    cn(
      'w-full px-4 py-3.5 bg-card border rounded-xl text-foreground',
      'focus:outline-none focus:ring-2 focus:ring-role-ambassador focus:border-transparent',
      'transition-all duration-200',
      hasError ? 'border-destructive' : 'border-border'
    );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-role-ambassador/10 rounded-2xl flex items-center justify-center mb-4">
          <MapPin className="w-8 h-8 text-role-ambassador" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Campus & Location</h2>
        <p className="text-sm text-muted-foreground mt-2">
          This helps us assign verification tasks in your area
        </p>
      </div>

      {/* Campus Selection */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
          <Building2 className="w-4 h-4 text-muted-foreground" />
          Assigned Campus
        </label>
        <select
          value={data.assignedCampus}
          onChange={(e) => onChange('assignedCampus', e.target.value)}
          className={inputClasses(!!errors?.assignedCampus)}
        >
          <option value="">Select your campus...</option>
          {CAMPUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors?.assignedCampus && (
          <p className="text-xs text-destructive mt-1">{errors.assignedCampus}</p>
        )}
      </div>

      {/* Zone Selection */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          Current Zone
        </label>
        <select
          value={data.currentZone}
          onChange={(e) => onChange('currentZone', e.target.value)}
          className={inputClasses(!!errors?.currentZone)}
        >
          <option value="">Select your zone...</option>
          {ZONE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors?.currentZone && (
          <p className="text-xs text-destructive mt-1">{errors.currentZone}</p>
        )}
      </div>

      {/* Availability Status */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
          <Clock className="w-4 h-4 text-muted-foreground" />
          Availability Status
        </label>
        <div className="space-y-2">
          {AVAILABILITY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange('availabilityStatus', option.value)}
              className={cn(
                'w-full p-4 rounded-xl border text-left transition-all touch-target',
                data.availabilityStatus === option.value
                  ? 'border-role-ambassador bg-role-ambassador/5 ring-2 ring-role-ambassador/20'
                  : 'border-border bg-card hover:bg-muted/50'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0',
                    data.availabilityStatus === option.value
                      ? 'border-role-ambassador bg-role-ambassador'
                      : 'border-muted-foreground'
                  )}
                >
                  {data.availabilityStatus === option.value && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">{option.label}</p>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        {errors?.availabilityStatus && (
          <p className="text-xs text-destructive mt-1">{errors.availabilityStatus}</p>
        )}
      </div>
    </motion.div>
  );
}
