import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, 
  ShieldCheck, 
  Wallet, 
  ChevronLeft,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLandlordOnboardingStore } from "../../store/useLandlordOnboardingStore";

// Step components
import Step1EntityId from '../components/Step1EntityId';
import Step2KycOwnership from '../components/Step2KycOwnership';
import Step3FinancialSetup from '../components/Step3FinancialSetup';

const STEPS = [
  { id: 1, title: 'Entity', icon: Building, description: 'Identification' },
  { id: 2, title: 'Verification', icon: ShieldCheck, description: 'KYC & Proof' },
  { id: 3, title: 'Financial', icon: Wallet, description: 'Payout Setup' },
];

export default function LandlordOnboarding() {
  const navigate = useNavigate();
  const { step, setStep } = useLandlordOnboardingStore();

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Standalone Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="p-2 -ml-2 text-gray-400 hover:text-gray-600 transition-colors touch-target"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex flex-col items-center">
            <h1 className="text-lg font-bold text-gray-900">Landlord Activation</h1>
            <p className="text-[10px] uppercase tracking-widest font-bold text-role-landlord">Professional Suite</p>
          </div>
          
          <div className="w-10" /> {/* Spacer */}
        </div>
      </header>

      <main className="flex-1 px-4 py-8 max-w-3xl mx-auto w-full">
        {/* Progress Stepper */}
        <div className="mb-10">
          <div className="flex justify-between items-start relative px-2">
            {/* Background Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
            <div 
              className="absolute top-5 left-0 h-0.5 bg-role-landlord transition-all duration-500 -z-10" 
              style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
            />

            {STEPS.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-2">
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                    step >= s.id 
                      ? "bg-role-landlord border-role-landlord text-white shadow-lg shadow-role-landlord/20" 
                      : "bg-white border-gray-300 text-gray-400"
                  )}
                >
                  {step > s.id ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <s.icon className="w-5 h-5" />
                  )}
                </div>
                <div className="text-center">
                  <p className={cn(
                    "text-[10px] font-bold uppercase tracking-tight",
                    step >= s.id ? "text-role-landlord" : "text-gray-400"
                  )}>
                    {s.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && <Step1EntityId />}
              {step === 2 && <Step2KycOwnership />}
              {step === 3 && <Step3FinancialSetup />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Help Footer */}
        <div className="mt-8 text-center px-6">
          <div className="flex items-center justify-center gap-2 text-gray-400 mb-2">
            <FileText className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Professional Governance</span>
          </div>
          <p className="text-[10px] text-gray-400 leading-relaxed">
            By proceeding, you agree to the Verbaac Professional Service Level Agreement and the Security Deposit Escrow protocols.
          </p>
        </div>
      </main>
    </div>
  );
}
