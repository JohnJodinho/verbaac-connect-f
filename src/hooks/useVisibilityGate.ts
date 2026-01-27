import { useAuthStore } from '@/store/useAuthStore';

export type VisibilityGateResult = {
  /** User is not authenticated */
  isGuest: boolean;
  /** User is authenticated with consumer role active */
  isConsumer: boolean;
  /** User has verified student profile */
  isStudent: boolean;
  /** User can access roommate matching (students only) */
  canAccessRoommates: boolean;
  /** Can view precise property location (after escrow payment) */
  showPreciseLocation: (hasEscrowPayment: boolean) => boolean;
  /** Can contact seller/landlord (requires escrow payment) */
  canContactSeller: (hasEscrowPayment: boolean) => boolean;
  /** User needs student verification */
  needsStudentVerification: boolean;
};

/**
 * Hook to manage Guest vs Consumer visibility rules across the application.
 * Implements the "Escrow Gate" pattern where certain features are locked
 * behind authentication or escrow payment states.
 */
export function useVisibilityGate(): VisibilityGateResult {
  const { isAuthenticated, user, activeRole } = useAuthStore();

  const isGuest = !isAuthenticated;
  const isConsumer = isAuthenticated && activeRole === 'consumer';
  
  // Check if user has valid student profile
  const studentProfile = user?.studentProfile;
  const isStudent = Boolean(
    studentProfile?.institution && 
    studentProfile?.matricNo
  );

  // Check if student verification is needed
  const needsStudentVerification = isAuthenticated && !isStudent;

  // Roommates feature is locked for non-students
  const canAccessRoommates = isConsumer && isStudent;

  // Precise location only shown after escrow payment
  const showPreciseLocation = (hasEscrowPayment: boolean): boolean => {
    if (isGuest) return false;
    return isConsumer && hasEscrowPayment;
  };

  // Contact seller only available after escrow payment
  const canContactSeller = (hasEscrowPayment: boolean): boolean => {
    if (isGuest) return false;
    return isConsumer && hasEscrowPayment;
  };

  return {
    isGuest,
    isConsumer,
    isStudent,
    canAccessRoommates,
    showPreciseLocation,
    canContactSeller,
    needsStudentVerification,
  };
}
