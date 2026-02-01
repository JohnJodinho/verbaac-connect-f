/**
 * Step 3: Legal & Tier 1 Agreement
 * 
 * Mandatory consent for field audit protocols and anti-collusion policies.
 * Required before ambassador activation.
 */

import { motion } from 'framer-motion';
import { Shield, FileCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step3Props {
  data: {
    fieldAuditAccepted: boolean;
    antiCollusionAccepted: boolean;
  };
  onChange: (field: string, value: boolean) => void;
  errors?: Record<string, string>;
}

export default function Step3LegalAgreement({ data, onChange, errors }: Step3Props) {
  const allAccepted = data.fieldAuditAccepted && data.antiCollusionAccepted;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-role-ambassador/10 rounded-2xl flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-role-ambassador" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Legal Agreements</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Please review and accept the following policies to activate your Ambassador role
        </p>
      </div>

      {/* Field Audit Protocol */}
      <div className={cn(
        'p-4 rounded-xl border transition-all',
        data.fieldAuditAccepted 
          ? 'border-emerald-500 bg-emerald-50/50' 
          : 'border-border bg-card'
      )}>
        <button
          type="button"
          onClick={() => onChange('fieldAuditAccepted', !data.fieldAuditAccepted)}
          className="w-full text-left touch-target"
        >
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <div className={cn(
              'w-6 h-6 rounded-md border-2 shrink-0 flex items-center justify-center mt-0.5 transition-colors',
              data.fieldAuditAccepted 
                ? 'bg-emerald-500 border-emerald-500' 
                : 'border-muted-foreground'
            )}>
              {data.fieldAuditAccepted && (
                <CheckCircle2 className="w-4 h-4 text-white" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <FileCheck className="w-4 h-4 text-role-ambassador" />
                <h3 className="font-semibold text-foreground">Field Audit Protocol</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                I agree to conduct property verifications in person, at the property location. 
                I understand that GPS location data will be collected to confirm my presence 
                during verification tasks, and that inaccurate reports may result in account suspension.
              </p>
            </div>
          </div>
        </button>
        {errors?.fieldAuditAccepted && (
          <p className="text-xs text-destructive mt-2 ml-9">{errors.fieldAuditAccepted}</p>
        )}
      </div>

      {/* Anti-Collusion Policy */}
      <div className={cn(
        'p-4 rounded-xl border transition-all',
        data.antiCollusionAccepted 
          ? 'border-emerald-500 bg-emerald-50/50' 
          : 'border-border bg-card'
      )}>
        <button
          type="button"
          onClick={() => onChange('antiCollusionAccepted', !data.antiCollusionAccepted)}
          className="w-full text-left touch-target"
        >
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <div className={cn(
              'w-6 h-6 rounded-md border-2 shrink-0 flex items-center justify-center mt-0.5 transition-colors',
              data.antiCollusionAccepted 
                ? 'bg-emerald-500 border-emerald-500' 
                : 'border-muted-foreground'
            )}>
              {data.antiCollusionAccepted && (
                <CheckCircle2 className="w-4 h-4 text-white" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="font-semibold text-foreground">Anti-Collusion Policy</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                I confirm that I will not collude with landlords, agents, or sellers to provide 
                false verification reports. I understand that fraudulent activity will result in 
                immediate termination and forfeiture of pending earnings.
              </p>
            </div>
          </div>
        </button>
        {errors?.antiCollusionAccepted && (
          <p className="text-xs text-destructive mt-2 ml-9">{errors.antiCollusionAccepted}</p>
        )}
      </div>

      {/* Confirmation Summary */}
      {allAccepted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-role-ambassador/10 to-amber-100/50 rounded-xl p-4 border border-role-ambassador/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-role-ambassador/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-role-ambassador" />
            </div>
            <div>
              <p className="font-medium text-foreground">Ready to Activate</p>
              <p className="text-sm text-muted-foreground">
                You've accepted all required agreements
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
