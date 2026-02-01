import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import type { RoleType } from '@/types';

interface RoleGuardProps {
  requiredRole: RoleType;
  onboardingPath: string;
  children?: React.ReactNode;
}

/**
 * Route guard that checks if the user has the required role unlocked.
 * If not unlocked, redirects to the onboarding flow for that role.
 * Also syncs the activeRole when navigating to a role-specific area.
 */
export function RoleGuard({ requiredRole, onboardingPath, children }: RoleGuardProps) {
  const { unlockedRoles, setActiveRole, activeRole } = useAuthStore();
  const [isSyncing, setIsSyncing] = useState(false);
  
  const hasRole = unlockedRoles.includes(requiredRole);
  const needsSync = hasRole && activeRole !== requiredRole;
  
  // Sync activeRole in useEffect to avoid setState during render
  useEffect(() => {
    if (needsSync) {
      setIsSyncing(true);
      // Use a microtask to ensure navigation has completed
      queueMicrotask(() => {
        setActiveRole(requiredRole);
        setIsSyncing(false);
      });
    }
  }, [needsSync, requiredRole, setActiveRole]);
  
  if (!hasRole) {
    // User doesn't have the role - redirect to onboarding
    return <Navigate to={onboardingPath} replace />;
  }
  
  // Wait for role sync to complete before rendering children
  if (isSyncing || needsSync) {
    return null;
  }
  
  // User has the role and it's synced - render children or child routes
  return <>{children || <Outlet />}</>;
}

export default RoleGuard;

