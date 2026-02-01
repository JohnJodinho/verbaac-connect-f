/**
 * Ambassador Onboarding Page
 * 
 * Student-only activation wizard with 3 steps:
 * 1. Campus & Proximity Data
 * 2. Financial Setup (Bank Details)
 * 3. Legal & Tier 1 Agreement
 * 
 * Gate: Redirects non-students to /dashboard/profile
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, BadgeCheck, ChevronLeft, ChevronRight, Loader2, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useAuthStore } from '@/store/useAuthStore';
import { useAmbassadorOnboardingStore } from '../../store/useAmbassadorOnboardingStore';
import {
  step1CampusSchema,
  step2FinancialSchema,
  step3LegalSchema,
} from '../schemas/ambassadorOnboarding.schema';
import { submitAmbassadorApplication, type AmbassadorOnboardingData } from '../../api/ambassador.service';
import { AnimatedCard } from '@/components/animated';

// Step Components
import Step1CampusProximity from '../components/Step1CampusProximity';
import Step2FinancialSetup from '../components/Step2FinancialSetup';
import Step3LegalAgreement from '../components/Step3LegalAgreement';
import WelcomeAnimation from '../components/WelcomeAnimation';

// Step schemas for individual validation
const stepSchemas = [step1CampusSchema, step2FinancialSchema, step3LegalSchema];

// Toast duration in milliseconds (3+ seconds as requested)
const TOAST_DURATION_MS = 3500;

export default function AmbassadorOnboarding() {
  const navigate = useNavigate();
  const { user, unlockRole, setActiveRole, unlockedRoles } = useAuthStore();
  const {
    step,
    setStep,
    data: storedData,
    updateData,
    complete,
    isComplete,
    ambassadorDisplayId,
    reset,
  } = useAmbassadorOnboardingStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [showRedirectToast, setShowRedirectToast] = useState(false);

  // Student-only gate: Check eligibility on mount
  useEffect(() => {
    const hasStudentProfile = !!user?.studentProfile?.matricNo;
    
    if (!hasStudentProfile) {
      // Show toast for 3+ seconds before redirecting
      console.log('[AmbassadorOnboarding] User is not a verified student, showing toast...');
      setShowRedirectToast(true);
      
      const redirectTimer = setTimeout(() => {
        navigate('/dashboard/profile', { 
          state: { message: 'Only verified students can apply to be Ambassadors' } 
        });
      }, TOAST_DURATION_MS);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [user, navigate]);

  // Redirect if already an ambassador
  useEffect(() => {
    if (unlockedRoles.includes('ambassador') && !isComplete) {
      navigate('/dashboard/ambassador');
    }
  }, [unlockedRoles, navigate, isComplete]);

  // Handle successful completion - reset store after welcome animation redirect
  useEffect(() => {
    if (isComplete && ambassadorDisplayId) {
      const timer = setTimeout(() => {
        reset();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isComplete, ambassadorDisplayId, reset]);

  // Form data management
  const [formData, setFormData] = useState<Partial<AmbassadorOnboardingData>>({
    assignedCampus: storedData.assignedCampus || '',
    currentZone: storedData.currentZone || '',
    availabilityStatus: storedData.availabilityStatus || 'available',
    bankName: storedData.bankName || '',
    bankCode: storedData.bankCode || '',
    accountNumber: storedData.accountNumber || '',
    accountName: storedData.accountName || '',
    fieldAuditAccepted: storedData.fieldAuditAccepted || false,
    antiCollusionAccepted: storedData.antiCollusionAccepted || false,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    setStepErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  // Validate current step and move to next
  const handleNextStep = async () => {
    const currentSchema = stepSchemas[step - 1];
    
    try {
      await currentSchema.parseAsync(formData);
      
      // Persist data to store
      updateData(formData);
      
      // Move to next step
      setStep(step + 1);
      setStepErrors({});
      setError(null);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'errors' in err) {
        const zodError = err as { errors: Array<{ path: string[]; message: string }> };
        const errors: Record<string, string> = {};
        zodError.errors.forEach((e) => {
          errors[e.path[0]] = e.message;
        });
        setStepErrors(errors);
      }
    }
  };

  // Go back to previous step
  const handlePrevStep = () => {
    if (step > 1) {
      updateData(formData);
      setStep(step - 1);
      setStepErrors({});
    }
  };

  // Final form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate step 3
      await step3LegalSchema.parseAsync(formData);
      
      // Submit application
      const response = await submitAmbassadorApplication(formData as AmbassadorOnboardingData);

      if (response.success) {
        console.log('[AmbassadorOnboarding] Activation successful:', response);
        console.log('[AmbassadorOnboarding] X-Active-Persona will be set to: ambassador');
        
        // Update auth store with new role
        unlockRole('ambassador');
        setActiveRole('ambassador');

        // Mark onboarding complete with the display ID
        complete(response.displayId);
      } else {
        setError(response.message || 'Failed to activate ambassador account');
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'errors' in err) {
        const zodError = err as { errors: Array<{ path: string[]; message: string }> };
        const errors: Record<string, string> = {};
        zodError.errors.forEach((e) => {
          errors[e.path[0]] = e.message;
        });
        setStepErrors(errors);
      } else {
        console.error('Activation error:', err);
        setError('An error occurred during activation. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show welcome animation after completion
  if (isComplete && ambassadorDisplayId) {
    return <WelcomeAnimation displayId={ambassadorDisplayId} onComplete={reset} />;
  }

  // Progress percentage
  const progress = (step / 3) * 100;

  // Show redirect toast for non-students
  if (showRedirectToast) {
    return (
      <div className="min-h-full flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm w-full bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center"
        >
          <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-lg font-bold text-amber-900 mb-2">
            Student Verification Required
          </h2>
          <p className="text-sm text-amber-700 mb-4">
            Only verified students can apply to be Ambassadors. Please update your student profile first.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-amber-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Redirecting to Profile...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-full p-4 md:p-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 mx-auto bg-role-ambassador/10 rounded-2xl flex items-center justify-center mb-3">
          <BadgeCheck className="w-7 h-7 text-role-ambassador" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Become an Ambassador</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Complete your profile to start verifying properties
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Step {step} of 3</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-role-ambassador"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-4 mb-6 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </motion.div>
      )}

      {/* Step Content */}
      <AnimatedCard className="bg-card/50 backdrop-blur rounded-2xl p-6 border border-border shadow-sm">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <Step1CampusProximity
              key="step1"
              data={{
                assignedCampus: formData.assignedCampus || '',
                currentZone: formData.currentZone || '',
                availabilityStatus: formData.availabilityStatus || 'available',
              }}
              onChange={handleChange}
              errors={stepErrors}
            />
          )}
          {step === 2 && (
            <Step2FinancialSetup
              key="step2"
              data={{
                bankName: formData.bankName || '',
                bankCode: formData.bankCode || '',
                accountNumber: formData.accountNumber || '',
                accountName: formData.accountName || '',
              }}
              onChange={handleChange}
              errors={stepErrors}
            />
          )}
          {step === 3 && (
            <Step3LegalAgreement
              key="step3"
              data={{
                fieldAuditAccepted: formData.fieldAuditAccepted || false,
                antiCollusionAccepted: formData.antiCollusionAccepted || false,
              }}
              onChange={handleChange}
              errors={stepErrors}
            />
          )}
        </AnimatePresence>
      </AnimatedCard>

      {/* Navigation Buttons */}
      <div className="flex gap-3 mt-6">
        {/* Back Button */}
        <button
          type="button"
          onClick={handlePrevStep}
          disabled={step === 1}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium transition-all touch-target',
            step === 1
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-card border border-border text-foreground hover:bg-muted'
          )}
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        {/* Next/Submit Button */}
        {step < 3 ? (
          <button
            type="button"
            onClick={handleNextStep}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-role-ambassador text-white rounded-xl font-medium hover:bg-role-ambassador/90 transition-colors touch-target"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.fieldAuditAccepted || !formData.antiCollusionAccepted}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium transition-all touch-target',
              isSubmitting || !formData.fieldAuditAccepted || !formData.antiCollusionAccepted
                ? 'bg-role-ambassador/50 text-white/70 cursor-not-allowed'
                : 'bg-role-ambassador text-white hover:bg-role-ambassador/90'
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Activating...
              </>
            ) : (
              <>
                Activate Ambassador
                <BadgeCheck className="w-5 h-5" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
