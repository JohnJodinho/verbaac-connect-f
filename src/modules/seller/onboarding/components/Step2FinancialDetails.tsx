import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Landmark, CreditCard, User, ChevronLeft, Loader2, Info } from 'lucide-react';
import { useState } from 'react';
import type { Step2FinancialData } from '../schemas/sellerOnboarding.schema';
import { NIGERIAN_BANKS } from '../schemas/sellerOnboarding.schema';
import { verifyBankAccount } from '../../api/onboarding.service';

interface Step2FinancialDetailsProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step2FinancialDetails({ onNext, onBack }: Step2FinancialDetailsProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useFormContext<Step2FinancialData>();

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verified' | 'failed'>('idle');
  const [resolvedName, setResolvedName] = useState<string | null>(null);

  const accountNumber = watch('accountNumber');
  const bankCode = watch('bankCode');

  // Verify bank account when both fields are filled
  const verifyAccount = async () => {
    if (!accountNumber || accountNumber.length !== 10 || !bankCode) return;

    setIsVerifying(true);
    setVerificationStatus('idle');
    
    try {
      const response = await verifyBankAccount(bankCode, accountNumber);
      if (response.verified) {
        setResolvedName(response.accountName);
        setValue('accountName', response.accountName);
        setVerificationStatus('verified');
      } else {
        setVerificationStatus('failed');
      }
    } catch {
      // Don't block on verification failure - let user enter manually
      setVerificationStatus('failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBank = NIGERIAN_BANKS.find((b) => b.code === e.target.value);
    if (selectedBank) {
      setValue('bankName', selectedBank.name);
      setValue('bankCode', selectedBank.code);
    }
    // Reset verification state when bank changes
    setVerificationStatus('idle');
    setResolvedName(null);
  };

  const handleAccountNumberChange = () => {
    // Reset verification state when account number changes
    setVerificationStatus('idle');
    setResolvedName(null);
  };

  const handleContinue = async () => {
    const valid = await trigger(['bankCode', 'bankName', 'accountNumber', 'accountName']);
    if (valid) {
      onNext();
    }
  };

  const inputClasses =
    'w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary transition-all duration-200';

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-role-seller/10 flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-role-seller" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Payment Setup</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Add your bank details to receive payments from sales
        </p>
      </div>

      {/* Commission Notice */}
      <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 flex gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-sm text-amber-700 dark:text-amber-400">
            88% Payout Rate
          </h4>
          <p className="text-xs text-amber-600/80 dark:text-amber-400/70 mt-1">
            Verbaac charges a 12% platform fee on all sales. You receive 88% of each transaction directly to your bank account after buyer confirmation.
          </p>
        </div>
      </div>

      {/* Bank Selection */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
          <Landmark className="w-3.5 h-3.5 text-muted-foreground" />
          Bank Name
        </label>
        <select
          {...register('bankCode')}
          onChange={(e) => {
            register('bankCode').onChange(e);
            handleBankChange(e);
          }}
          className={inputClasses}
        >
          <option value="">Select your bank...</option>
          {NIGERIAN_BANKS.map((bank) => (
            <option key={bank.code} value={bank.code}>
              {bank.name}
            </option>
          ))}
        </select>
        <input type="hidden" {...register('bankName')} />
        {errors.bankName && (
          <p className="text-[0.8rem] font-medium text-destructive">
            {errors.bankName.message}
          </p>
        )}
      </div>

      {/* Account Number */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
          <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
          Account Number
        </label>
        <div className="flex gap-2">
          <input
            {...register('accountNumber')}
            onChange={(e) => {
              register('accountNumber').onChange(e);
              handleAccountNumberChange();
            }}
            type="text"
            maxLength={10}
            inputMode="numeric"
            pattern="\d*"
            className={`${inputClasses} flex-1`}
            placeholder="0123456789"
          />
          <motion.button
            type="button"
            onClick={verifyAccount}
            disabled={!accountNumber || accountNumber.length !== 10 || !bankCode || isVerifying}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 rounded-lg bg-muted text-foreground font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted/80"
          >
            {isVerifying ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Verify'
            )}
          </motion.button>
        </div>
        {errors.accountNumber && (
          <p className="text-[0.8rem] font-medium text-destructive">
            {errors.accountNumber.message}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          10-digit NUBAN account number
        </p>
      </div>

      {/* Account Name */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-muted-foreground" />
          Account Name
        </label>
        <input
          {...register('accountName')}
          type="text"
          className={`${inputClasses} ${verificationStatus === 'verified' ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' : ''}`}
          placeholder="John Doe"
          readOnly={verificationStatus === 'verified'}
        />
        {errors.accountName && (
          <p className="text-[0.8rem] font-medium text-destructive">
            {errors.accountName.message}
          </p>
        )}
        {verificationStatus === 'verified' && resolvedName && (
          <p className="text-[0.8rem] font-medium text-green-600 dark:text-green-400">
            ✓ Account verified: {resolvedName}
          </p>
        )}
        {verificationStatus === 'failed' && (
          <p className="text-[0.8rem] font-medium text-amber-600">
            Could not auto-verify. Please enter your account name manually.
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Must match your legal name for KYC compliance
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-2">
        <motion.button
          type="button"
          onClick={onBack}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="flex-1 py-3 rounded-lg border border-border bg-background text-foreground font-medium transition-all hover:bg-muted flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </motion.button>
        <motion.button
          type="button"
          onClick={handleContinue}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="flex-2 py-3 rounded-lg bg-primary text-primary-foreground font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
        >
          Continue to Activation
        </motion.button>
      </div>
    </motion.div>
  );
}
