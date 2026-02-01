/**
 * Ambassador Identity Section
 * 
 * Displays the ambassador's identity card with:
 * - AMB-YEAR-XXXX display ID
 * - Campus and zone assignment
 * - Availability status badge
 * - Tier level indicator
 */

import { motion } from 'framer-motion';
import { BadgeCheck, MapPin, Building2, Clock, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AmbassadorProfile, AvailabilityStatus } from '../../api/ambassador.service';

interface AmbassadorIdentitySectionProps {
  profile: AmbassadorProfile;
  userName: string;
}

const AVAILABILITY_CONFIG: Record<AvailabilityStatus, { label: string; color: string }> = {
  available: { label: 'Available', color: 'bg-emerald-500' },
  busy: { label: 'Busy', color: 'bg-amber-500' },
  unavailable: { label: 'Unavailable', color: 'bg-red-500' },
};

const TIER_CONFIG: Record<string, { label: string; color: string; stars: number }> = {
  tier1: { label: 'Tier 1', color: 'text-amber-600', stars: 1 },
  tier2: { label: 'Tier 2', color: 'text-amber-500', stars: 2 },
  tier3: { label: 'Tier 3', color: 'text-role-ambassador', stars: 3 },
};

export default function AmbassadorIdentitySection({ profile, userName }: AmbassadorIdentitySectionProps) {
  const availability = AVAILABILITY_CONFIG[profile.availabilityStatus];
  const tier = TIER_CONFIG[profile.tier] || TIER_CONFIG.tier1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-role-ambassador/10 via-amber-50/50 to-orange-50/30 rounded-2xl border border-role-ambassador/20 p-5 md:p-6"
    >
      <div className="flex items-start gap-4">
        {/* Avatar with Badge */}
        <div className="relative">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-role-ambassador to-amber-600 flex items-center justify-center">
            <BadgeCheck className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          {/* Availability indicator */}
          <div className={cn(
            'absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white',
            availability.color
          )} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg md:text-xl font-bold text-foreground truncate">
              {userName}
            </h2>
            {/* Tier Badge */}
            <div className={cn(
              'flex items-center gap-1 px-2 py-0.5 rounded-full bg-role-ambassador/10',
              tier.color
            )}>
              {Array.from({ length: tier.stars }).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
              <span className="text-xs font-medium ml-0.5">{tier.label}</span>
            </div>
          </div>

          {/* Ambassador ID */}
          <p className="text-sm font-mono text-role-ambassador font-semibold mt-1">
            {profile.displayId}
          </p>

          {/* Location */}
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              <span>{profile.assignedCampus}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span className="capitalize">{profile.currentZone}</span>
            </div>
          </div>

          {/* Availability Status */}
          <div className="flex items-center gap-2 mt-3">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Status:</span>
            <span className={cn(
              'text-sm font-medium px-2 py-0.5 rounded-full',
              availability.color === 'bg-emerald-500' && 'bg-emerald-100 text-emerald-700',
              availability.color === 'bg-amber-500' && 'bg-amber-100 text-amber-700',
              availability.color === 'bg-red-500' && 'bg-red-100 text-red-700',
            )}>
              {availability.label}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
