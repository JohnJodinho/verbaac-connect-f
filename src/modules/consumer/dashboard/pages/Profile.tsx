import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '../store/useProfileStore';
import { IdentitySection } from '../components/IdentitySection';
import { StudentProfileSection } from '../components/StudentProfileSection';
import { PreferencesSection } from '../components/PreferencesSection';
import { RoleManagementCard } from '../components/RoleManagementCard';

/**
 * Profile Page - Consumer Dashboard
 * 
 * Manages the user's Legal Identity (Global) and Consumer/Tenant sub-profiles.
 * Mobile-first responsive design with stacked sections.
 */
export default function Profile() {
  const { user } = useAuthStore();
  const { isDirty, resetForm } = useProfileStore();
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  // Warn user before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleCancelNavigation = useCallback(() => {
    setShowDiscardModal(false);
  }, []);

  const handleConfirmDiscard = useCallback(() => {
    resetForm();
    setShowDiscardModal(false);
  }, [resetForm]);

  return (
    <div className="theme-consumer">
      {/* Page Header - Compact on mobile */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 md:mb-8"
      >
        <div className="flex items-center gap-3 md:gap-4">
          {/* User Avatar - Smaller on mobile */}
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border shrink-0">
            {user?.profilePhotoUrl ? (
              <img 
                src={user.profilePhotoUrl} 
                alt={user.firstName} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <User className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground" />
            )}
          </div>
          
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">My Profile</h1>
            <p className="text-sm md:text-base text-muted-foreground truncate">
              Manage your identity and preferences
            </p>
          </div>
        </div>
      </motion.div>

      {/* Section Cards - Stacked on all screens */}
      <div className="space-y-4 md:space-y-6">
        {/* Section A: Global Personal Information */}
        <IdentitySection />

        {/* Section B: Consumer & Student Sub-Profiles */}
        <StudentProfileSection />
        <PreferencesSection />

        {/* Section C: Role Management */}
        <RoleManagementCard />
      </div>

      {/* Discard Changes Modal - Full-width on mobile */}
      {showDiscardModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-0 md:p-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-t-2xl md:rounded-xl border border-border p-5 md:p-6 shadow-2xl max-w-md w-full safe-bottom"
          >
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Discard Changes?
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              You have unsaved changes. Are you sure you want to leave? 
              Your changes will be lost.
            </p>
            <div className="flex flex-col-reverse md:flex-row gap-3 md:justify-end">
              <button
                onClick={handleCancelNavigation}
                className="w-full md:w-auto px-4 py-3 md:py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 active:bg-muted/70 rounded-lg transition-colors touch-target"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDiscard}
                className="w-full md:w-auto px-4 py-3 md:py-2 text-sm font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 active:bg-destructive/80 rounded-lg transition-colors touch-target"
              >
                Discard Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
