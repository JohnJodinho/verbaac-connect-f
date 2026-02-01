import { Lock, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EscrowStatus } from '../../api/seller.service';

interface PrivacyGateProps {
  escrowStatus: EscrowStatus;
  field: 'name' | 'address' | 'phone';
  value: string | null;
  className?: string;
}

/**
 * Privacy Gate Component
 * 
 * Implements the escrow-based data reveal logic:
 * - Pre-Payment: All buyer data hidden
 * - Post-Payment (Escrow Held/Released): Name & Address revealed, Phone always masked
 */
export default function PrivacyGate({ escrowStatus, field, value, className }: PrivacyGateProps) {
  // Phone is ALWAYS masked regardless of escrow status
  if (field === 'phone') {
    return (
      <div className={cn(
        'flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg',
        className
      )}>
        <Lock className="w-4 h-4" />
        <span>Protected for privacy</span>
      </div>
    );
  }

  // Check if data should be revealed (escrow held or released)
  const isRevealed = escrowStatus === 'held' || escrowStatus === 'released';

  if (!isRevealed) {
    return (
      <div className={cn(
        'flex items-center gap-2 text-sm text-muted-foreground bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg',
        className
      )}>
        <EyeOff className="w-4 h-4 text-amber-600" />
        <span className="text-amber-700">
          {field === 'name' ? 'Buyer identity hidden until payment' : 'Address hidden until payment'}
        </span>
      </div>
    );
  }

  // Data is revealed
  if (!value) {
    return (
      <span className={cn('text-sm text-muted-foreground', className)}>
        Not provided
      </span>
    );
  }

  return (
    <div className={cn(
      'flex items-center gap-2 text-sm',
      className
    )}>
      <Eye className="w-4 h-4 text-emerald-600 flex-shrink-0" />
      <span className="text-foreground">{value}</span>
    </div>
  );
}
