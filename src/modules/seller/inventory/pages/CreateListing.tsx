import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Package, Camera, Truck, Check, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Step1Identity from '../components/Step1Identity';
import Step2Media from '../components/Step2Media';
import Step3Fulfillment from '../components/Step3Fulfillment';
import { useListingWizard, type WizardStep } from '../stores/useListingWizard';
import { createListingPayload, listingSchema } from '../schemas/listing.schema';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1 as WizardStep, label: 'Details', icon: Package },
  { id: 2 as WizardStep, label: 'Photos', icon: Camera },
  { id: 3 as WizardStep, label: 'Delivery', icon: Truck },
];

export default function CreateListing() {
  const navigate = useNavigate();
  const { currentStep, setStep, getAllData, reset, isDirty, lastSavedAt } = useListingWizard();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDraftAlert, setShowDraftAlert] = useState(false);

  // Check for existing draft on mount
  useEffect(() => {
    if (isDirty && lastSavedAt) {
      setShowDraftAlert(true);
    }
  }, [isDirty, lastSavedAt]);

  const handleBack = () => {
    if (currentStep === 1) {
      navigate('/dashboard/seller/inventory');
    } else {
      setStep((currentStep - 1) as WizardStep);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setStep((currentStep + 1) as WizardStep);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const allData = getAllData();
      
      // Validate complete data
      const result = listingSchema.safeParse(allData);
      if (!result.success) {
        console.error('Validation failed:', result.error);
        setIsSubmitting(false);
        return;
      }

      // Create API payload
      const payload = createListingPayload(result.data);
      
      // TODO: Call API with X-Active-Persona: seller header
      console.log('Creating listing with payload:', payload);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset wizard and navigate
      reset();
      navigate('/dashboard/seller/inventory', { 
        state: { message: 'Listing created successfully!' } 
      });
    } catch (error) {
      console.error('Failed to create listing:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscardDraft = () => {
    reset();
    setShowDraftAlert(false);
  };

  const handleContinueDraft = () => {
    setShowDraftAlert(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Fixed with back button */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center h-14 px-4 gap-3">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-lg hover:bg-muted active:bg-muted/80 transition-colors touch-target"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold text-foreground">New Listing</h1>
            <p className="text-xs text-muted-foreground">Step {currentStep} of 3</p>
          </div>
          <Link
            to="/dashboard/seller/inventory"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Link>
        </div>

        {/* Step Indicator */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2">
            {STEPS.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex-1 flex items-center">
                  <button
                    onClick={() => isCompleted && setStep(step.id)}
                    disabled={!isCompleted && !isActive}
                    className={cn(
                      'flex items-center gap-2 py-2 px-3 rounded-lg transition-all w-full touch-target',
                      isActive && 'bg-role-seller/10',
                      isCompleted && 'cursor-pointer hover:bg-muted',
                      !isCompleted && !isActive && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-medium',
                      isActive && 'bg-role-seller text-white',
                      isCompleted && 'bg-emerald-500 text-white',
                      !isCompleted && !isActive && 'bg-muted text-muted-foreground'
                    )}>
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.id}
                    </div>
                    <span className={cn(
                      'text-sm font-medium hidden md:block',
                      isActive ? 'text-role-seller' : 'text-muted-foreground'
                    )}>
                      {step.label}
                    </span>
                  </button>
                  
                  {index < STEPS.length - 1 && (
                    <div className={cn(
                      'h-0.5 flex-1 mx-1',
                      currentStep > step.id ? 'bg-emerald-500' : 'bg-border'
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Step1Identity onNext={handleNext} />
            </motion.div>
          )}
          
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Step2Media onNext={handleNext} onBack={handleBack} />
            </motion.div>
          )}
          
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Step3Fulfillment 
                onSubmit={handleSubmit} 
                onBack={handleBack}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Draft Recovery Alert */}
      <AnimatePresence>
        {showDraftAlert && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 md:bottom-8 inset-x-4 max-w-md mx-auto z-50"
          >
            <div className="bg-card border border-border rounded-xl p-4 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Draft found</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    You have an unsaved listing. Continue where you left off?
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleDiscardDraft}
                      className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Discard
                    </button>
                    <button
                      onClick={handleContinueDraft}
                      className="px-4 py-1.5 text-sm font-medium bg-role-seller text-white rounded-lg hover:bg-role-seller/90 active:bg-role-seller/80 transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
