import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Shield, ChevronLeft, Loader2, FileText, Lock } from 'lucide-react';
import type { Step3LegalData } from '../schemas/sellerOnboarding.schema';

interface Step3LegalComplianceProps {
  onBack: () => void;
  isSubmitting: boolean;
}

export default function Step3LegalCompliance({ onBack, isSubmitting }: Step3LegalComplianceProps) {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<Step3LegalData>();

  const termsAccepted = watch('termsAccepted');
  const dataPrivacyAccepted = watch('dataPrivacyAccepted');
  const canSubmit = termsAccepted && dataPrivacyAccepted && !isSubmitting;

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
          <Shield className="w-8 h-8 text-role-seller" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Almost There!</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Review and accept our seller policies to activate your account
        </p>
      </div>

      {/* Terms & Conditions Card */}
      <div className={`rounded-xl border-2 transition-all duration-300 ${
        termsAccepted 
          ? 'border-role-seller bg-role-seller/5' 
          : 'border-border bg-card hover:border-gray-300'
      }`}>
        <label className="p-4 flex items-start gap-4 cursor-pointer">
          <div className="pt-1">
            <input
              type="checkbox"
              {...register('termsAccepted')}
              className="sr-only peer"
            />
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
              termsAccepted 
                ? 'bg-role-seller border-role-seller' 
                : 'border-border bg-background'
            }`}>
              {termsAccepted && (
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </motion.svg>
              )}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-role-seller" />
              <h3 className="font-semibold text-sm text-foreground">
                Terms & Conditions
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              I agree to Verbaac's Seller Terms including:
            </p>
            <ul className="text-xs text-muted-foreground mt-2 space-y-1 ml-4 list-disc">
              <li>12% platform commission on all sales</li>
              <li>Escrow payment system (funds held until buyer confirmation)</li>
              <li>No off-platform payment requests</li>
              <li>Accurate product listings with required condition tags</li>
            </ul>
            <a
              href="/legal/seller-terms"
              target="_blank"
              className="text-xs text-primary hover:underline mt-2 inline-block"
              onClick={(e) => e.stopPropagation()}
            >
              Read full terms →
            </a>
          </div>
        </label>
        {errors.termsAccepted && (
          <p className="px-4 pb-3 text-[0.8rem] font-medium text-destructive">
            {errors.termsAccepted.message}
          </p>
        )}
      </div>

      {/* Data Privacy Policy Card */}
      <div className={`rounded-xl border-2 transition-all duration-300 ${
        dataPrivacyAccepted 
          ? 'border-role-seller bg-role-seller/5' 
          : 'border-border bg-card hover:border-gray-300'
      }`}>
        <label className="p-4 flex items-start gap-4 cursor-pointer">
          <div className="pt-1">
            <input
              type="checkbox"
              {...register('dataPrivacyAccepted')}
              className="sr-only peer"
            />
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
              dataPrivacyAccepted 
                ? 'bg-role-seller border-role-seller' 
                : 'border-border bg-background'
            }`}>
              {dataPrivacyAccepted && (
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </motion.svg>
              )}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4 text-role-seller" />
              <h3 className="font-semibold text-sm text-foreground">
                Data Privacy Policy (NDPR)
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              I consent to Verbaac processing my personal and financial data in accordance with:
            </p>
            <ul className="text-xs text-muted-foreground mt-2 space-y-1 ml-4 list-disc">
              <li>Nigeria Data Protection Regulation (NDPR)</li>
              <li>Bank account verification for KYC compliance</li>
              <li>Transaction records for dispute resolution</li>
            </ul>
            <a
              href="/legal/privacy-policy"
              target="_blank"
              className="text-xs text-primary hover:underline mt-2 inline-block"
              onClick={(e) => e.stopPropagation()}
            >
              Read privacy policy →
            </a>
          </div>
        </label>
        {errors.dataPrivacyAccepted && (
          <p className="px-4 pb-3 text-[0.8rem] font-medium text-destructive">
            {errors.dataPrivacyAccepted.message}
          </p>
        )}
      </div>

      {/* Security Note */}
      <div className="rounded-xl bg-muted/50 border border-border p-4 flex gap-3">
        <Shield className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-sm text-foreground">
            Your Data is Secure
          </h4>
          <p className="text-xs text-muted-foreground mt-1">
            Your bank details are encrypted and used solely for payouts. We never share your financial information with third parties.
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-2">
        <motion.button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="flex-1 py-3 rounded-lg border border-border bg-background text-foreground font-medium transition-all hover:bg-muted flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </motion.button>
        <motion.button
          type="submit"
          disabled={!canSubmit}
          whileHover={{ scale: canSubmit ? 1.01 : 1 }}
          whileTap={{ scale: canSubmit ? 0.99 : 1 }}
          className="flex-2 py-3 rounded-lg bg-role-seller text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-role-seller/90 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Activating...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4" />
              Become a Seller
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
