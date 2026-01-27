import { motion } from 'framer-motion';
import { AlertCircle, GraduationCap, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * VerificationBanner displays if matric_no or institution is null.
 * Prompts for "Student Verification" with a CTA button.
 */
export function VerificationBanner() {
  const { user } = useAuthStore();
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if user needs verification
  const studentProfile = user?.studentProfile;
  const needsVerification = !studentProfile?.institution || !studentProfile?.matricNo;

  if (!needsVerification || isDismissed) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-6"
    >
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute top-3 right-3 text-amber-400 hover:text-amber-600 transition-colors"
        aria-label="Dismiss verification banner"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-2 bg-amber-100 rounded-lg">
          <GraduationCap className="h-6 w-6 text-amber-600" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <h3 className="font-semibold text-amber-900">Complete Your Student Profile</h3>
          </div>
          <p className="text-sm text-amber-700 mb-3">
            Verify your student status to unlock exclusive features like roommate matching, 
            student discounts, and priority access to housing near your campus.
          </p>
          <Link
            to="/dashboard/profile/verify-student"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 
                       text-white font-medium text-sm rounded-lg transition-colors"
          >
            <GraduationCap className="h-4 w-4" />
            Verify Student Status
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
