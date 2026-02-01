import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Lock,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLandlordOnboardingStore } from '../../store/useLandlordOnboardingStore';
import { submitLandlordOnboarding, type LandlordOnboardingData } from '../../api/landlord.service';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

const BANKS = [
  { name: 'Access Bank', code: '044' },
  { name: 'First Bank of Nigeria', code: '011' },
  { name: 'Guaranty Trust Bank', code: '058' },
  { name: 'United Bank for Africa', code: '033' },
  { name: 'Zenith Bank', code: '057' },
  { name: 'Kuda Microfinance Bank', code: '50211' },
];

export default function Step3FinancialSetup() {
  const navigate = useNavigate();
  const { user, unlockRole, setActiveRole } = useAuthStore();
  const { data, updateData, setStep, setActivationSuccess } = useLandlordOnboardingStore();
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fullName = user ? `${user.firstName} ${user.lastName}` : 'John Jodinho';

  // Auto-fill account name simulation (matching legal identity)
  useEffect(() => {
    if (!data.accountName && user) {
      updateData({ accountName: fullName });
    }
  }, [user, data.accountName, updateData, fullName]);

  const handleVerifyAccount = () => {
    if (data.accountNumber?.length !== 10 || !data.bankCode) return;
    
    setIsVerifying(true);
    setError(null);

    // Simulate bank verification (NIP)
    setTimeout(() => {
      setIsVerifying(false);
      // In a real app, this would return the resolved name from the bank
      updateData({ accountName: fullName });
    }, 1200);
  };

  const handleFinalSubmit = async () => {
    if (!data.accountName || !data.accountNumber || !data.bankName) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Create the final data object for the service
      const finalData: LandlordOnboardingData = {
        landlordType: data.landlordType || 'individual',
        legalName: fullName,
        idUrl: data.idUrl || '',
        propertyProofUrl: data.propertyProofUrl || '',
        bankName: data.bankName || '',
        bankCode: data.bankCode || '',
        accountNumber: data.accountNumber || '',
        accountName: data.accountName || '',
      };

      const result = await submitLandlordOnboarding(finalData);
      
      if (result.success) {
        setActivationSuccess(result.displayId, result.profile);
        
        // CRITICAL: Unlock the role in the global Auth Store so RoleGuard allows access
        unlockRole('landlord');
        setActiveRole('landlord');

        // Instant persona switch will be handled by the redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard/landlord');
        }, 500);
      } else {
         setError('Activation failed. Please check your details and try again.');
      }
    } catch {
      setError('Failed to activate landlord profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = data.accountNumber?.length === 10 && data.bankName && data.accountName && !isSubmitting;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Financial Setup</h2>
        <p className="text-sm text-gray-500">Configure your payout account for rental income.</p>
      </div>

      <div className="space-y-5">
        {/* Bank Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Select Bank</label>
          <div className="relative">
            <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={data.bankCode || ''}
              onChange={(e) => {
                const bank = BANKS.find(b => b.code === e.target.value);
                updateData({ bankCode: e.target.value, bankName: bank?.name || '' });
              }}
              className="w-full h-14 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-role-landlord/20 focus:border-role-landlord transition-all appearance-none cursor-pointer"
            >
              <option value="">Choose your bank</option>
              {BANKS.map(bank => (
                <option key={bank.code} value={bank.code}>{bank.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Account Number */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Account Number</label>
          <div className="relative">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              inputMode="numeric"
              maxLength={10}
              placeholder="0000000000"
              value={data.accountNumber || ''}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                updateData({ accountNumber: val });
                if (val.length === 10) handleVerifyAccount();
              }}
              className="w-full h-14 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-role-landlord/20 focus:border-role-landlord transition-all"
            />
            {isVerifying && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 className="w-5 h-5 text-role-landlord animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Resolved Account Name */}
        <AnimatePresence>
          {data.accountName && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2 overflow-hidden"
            >
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Resolved Account Name</label>
              <div className="h-14 px-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between">
                <p className="text-sm font-black text-emerald-900">{data.accountName}</p>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Policy Notice */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs text-amber-900 font-bold leading-tight">Verification Policy</p>
            <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
              The bank account name must match your legal identity ({fullName}) or your verified BVN to enable payouts.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <p className="text-xs font-bold">{error}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 pt-4">
        <button
          onClick={handleFinalSubmit}
          disabled={!canSubmit}
          className={cn(
            "w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg",
            canSubmit 
              ? "bg-role-landlord text-white shadow-role-landlord/25 active:scale-[0.98]" 
              : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Activating Account...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              Complete Professional Activation
            </>
          )}
        </button>
        <button 
          onClick={() => setStep(2)}
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Return to Verification
        </button>
      </div>

      <p className="text-center text-[10px] text-gray-400 font-medium">
        Secure transactions powered by Verbacc Pay. Data encryption active.
      </p>
    </div>
  );
}
