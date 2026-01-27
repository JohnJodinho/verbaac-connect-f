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
 * Follows the Persona-Aware Architecture with Fresh Teal (--color-role-consumer) theme.
 */
export default function Profile() {
  const { user } = useAuthStore();
  const { isDirty, resetForm } = useProfileStore();
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  // Warn user before leaving page with unsaved changes (browser close/refresh)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        // Modern browsers require returnValue to be set
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
    <div className="theme-consumer min-h-screen">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4">
          {/* User Avatar */}
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
            {user?.profilePhotoUrl ? (
              <img 
                src={user.profilePhotoUrl} 
                alt={user.firstName} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <User className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your identity, preferences, and roles
            </p>
          </div>
        </div>
      </motion.div>

      {/* Section Cards */}
      <div className="space-y-6">
        {/* Section A: Global Personal Information */}
        <IdentitySection />

        {/* Section B: Consumer & Student Sub-Profiles */}
        <StudentProfileSection />
        <PreferencesSection />

        {/* Section C: Role Management */}
        <RoleManagementCard />
      </div>

      {/* Discard Changes Modal */}
      {showDiscardModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl border border-border p-6 shadow-2xl max-w-md w-full"
          >
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Discard Changes?
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              You have unsaved changes. Are you sure you want to leave this page? 
              Your changes will be lost.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelNavigation}
                className="px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDiscard}
                className="px-4 py-2 text-sm font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 rounded-lg transition-colors"
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
