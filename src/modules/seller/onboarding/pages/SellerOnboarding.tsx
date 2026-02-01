import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Store } from 'lucide-react';

import { useAuthStore } from '@/store/useAuthStore';
import { useSellerOnboardingStore } from '../../store/useSellerOnboardingStore';
import {
  step1ProfileSchema,
  step2FinancialSchema,
  step3LegalSchema,
  sellerOnboardingSchema,
  type SellerOnboardingData,
} from '../schemas/sellerOnboarding.schema';
import { submitOnboarding } from '../../api/onboarding.service';
import { AnimatedCard } from '@/components/animated';

// Step Components
import Step1ProfileSetup from '../components/Step1ProfileSetup';
import Step2FinancialDetails from '../components/Step2FinancialDetails';
import Step3LegalCompliance from '../components/Step3LegalCompliance';
import WelcomeAnimation from '../components/WelcomeAnimation';

// Step schemas for individual validation
const stepSchemas = [step1ProfileSchema, step2FinancialSchema, step3LegalSchema];

export default function SellerOnboarding() {
  const navigate = useNavigate();
  const { unlockRole, setActiveRole, unlockedRoles } = useAuthStore();
  const {
    step,
    setStep,
    data: storedData,
    updateData,
    complete,
    isComplete,
    sellerDisplayId,
    reset,
  } = useSellerOnboardingStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already a seller
  useEffect(() => {
    if (unlockedRoles.includes('seller') && !isComplete) {
      navigate('/dashboard/seller');
    }
  }, [unlockedRoles, navigate, isComplete]);

  // Form methods with combined schema
  const methods = useForm<SellerOnboardingData>({
    resolver: zodResolver(sellerOnboardingSchema),
    defaultValues: {
      userName: storedData.userName || '',
      profilePhotoUrl: storedData.profilePhotoUrl || '',
      bankName: storedData.bankName || '',
      bankCode: storedData.bankCode || '',
      accountNumber: storedData.accountNumber || '',
      accountName: storedData.accountName || '',
      termsAccepted: storedData.termsAccepted || false,
      dataPrivacyAccepted: storedData.dataPrivacyAccepted || false,
    },
    mode: 'onChange',
  });

  // Validate current step and move to next
  const handleNextStep = async () => {
    const currentSchema = stepSchemas[step - 1];
    const currentData = methods.getValues();

    try {
      // Validate current step
      await currentSchema.parseAsync(currentData);

      // Persist data to store
      updateData(currentData);

      // Move to next step
      setStep(step + 1);
      setError(null);
    } catch (err) {
      console.error('Validation error:', err);
    }
  };

  // Go back to previous step
  const handlePrevStep = () => {
    if (step > 1) {
      // Save current data before going back
      updateData(methods.getValues());
      setStep(step - 1);
    }
  };

  // Final form submission
  const onSubmit = async (data: SellerOnboardingData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Call the mockable onboarding service
      const response = await submitOnboarding(data);

      if (response.success) {
        console.log('[SellerOnboarding] Activation successful:', response);
        console.log('[SellerOnboarding] X-Active-Persona will be set to: seller');
        
        // Update auth store with new role
        unlockRole('seller');
        setActiveRole('seller');

        // Mark onboarding complete with the display ID
        complete(response.displayId);
      } else {
        setError(response.message || 'Failed to activate seller account');
      }
    } catch (err) {
      console.error('Activation error:', err);
      setError('An error occurred during activation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle successful completion - reset store after welcome animation redirect
  useEffect(() => {
    if (isComplete && sellerDisplayId) {
      // Store will be reset after navigation in WelcomeAnimation
      const timer = setTimeout(() => {
        reset();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isComplete, sellerDisplayId, reset]);

  // Show welcome animation if complete
  if (isComplete && sellerDisplayId) {
    return <WelcomeAnimation sellerDisplayId={sellerDisplayId} />;
  }

  // Calculate progress percentage
  const progressPercent = (step / 3) * 100;

  // Dynamic theme class based on progress
  const getThemeClass = () => {
    if (step === 1) return 'theme-consumer';
    if (step === 2) return 'theme-seller';
    return 'theme-seller';
  };

  return (
    <div className={`min-h-screen py-8 px-4 ${getThemeClass()}`}>
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-14 h-14 rounded-2xl bg-linear-to-br from-role-consumer to-role-seller flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <Store className="w-7 h-7 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-foreground">Become a Seller</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Set up your marketplace profile to start selling
          </p>
        </div>

        <AnimatedCard className="bg-card w-full shadow-xl shadow-black/5 rounded-2xl border border-border overflow-hidden">
          {/* Step Indicator Header */}
          <div className="bg-muted/30 p-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-1">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      s === step
                        ? 'bg-primary text-primary-foreground'
                        : s < step
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {s}
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Step {step} of 3
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${progressPercent}%` }}
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, var(--role-consumer) 0%, var(--role-seller) 100%)`,
                }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </div>

            {/* Step Labels */}
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span className={step >= 1 ? 'text-primary font-medium' : ''}>
                Profile
              </span>
              <span className={step >= 2 ? 'text-primary font-medium' : ''}>
                Payment
              </span>
              <span className={step >= 3 ? 'text-primary font-medium' : ''}>
                Activate
              </span>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </motion.div>
            )}

            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <Step1ProfileSetup key="step1" onNext={handleNextStep} />
                  )}
                  {step === 2 && (
                    <Step2FinancialDetails
                      key="step2"
                      onNext={handleNextStep}
                      onBack={handlePrevStep}
                    />
                  )}
                  {step === 3 && (
                    <Step3LegalCompliance
                      key="step3"
                      onBack={handlePrevStep}
                      isSubmitting={isSubmitting}
                    />
                  )}
                </AnimatePresence>
              </form>
            </FormProvider>
          </div>

          {/* Footer */}
          <div className="bg-muted/30 p-4 text-center border-t border-border">
            <span className="text-xs text-muted-foreground">
              Already have seller access?{' '}
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="text-primary hover:underline underline-offset-4 font-medium"
              >
                Go to Dashboard
              </button>
            </span>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
}
