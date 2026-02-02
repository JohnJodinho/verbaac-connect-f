import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { agentService, type AgentProfileData } from '../../services/agent.service';
import { ChevronLeft, ChevronRight, Upload, CheckCircle2, Building, ScanFace, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Validation Schemas ---

const step1Schema = z.object({
  agency_name: z.string().optional(),
  office_address: z.string().min(5, "Office address is required"),
  experience_years: z.coerce.number().min(0, "Must be a positive number"),
  bio: z.string().min(20, "Please provide a short bio (min 20 chars)"),
  operational_zones: z.array(z.string()).min(1, "Select at least one zone"),
});

const step2Schema = z.object({
  id_type: z.enum(['national_id', 'passport', 'voters_card', 'drivers_license']),
  id_url: z.string().min(1, "ID Document is required"), // Mock file upload returning string URL
  proof_of_address_doc: z.string().min(1, "Proof of Address is required"),
  background_check_consent: z.boolean().refine(val => val === true, "Consent required"),
  terms_accepted: z.boolean().refine(val => val === true, "Must accept terms"),
});

const step3Schema = z.object({
  bank_name: z.string().min(2, "Bank name required"),
  account_name: z.string().min(2, "Account name required"),
  account_number: z.string().regex(/^\d{10}$/, "Account number must be exactly 10 digits"),
  commission_preference: z.enum(['standard', 'accumulate']),
});

// Merged schema for type inference
// Merged schema for type inference
type FormData = z.infer<typeof step1Schema> & z.infer<typeof step2Schema> & z.infer<typeof step3Schema>;

// Mock Zones
const OPERATIONAL_ZONES = [
  'Naraguta', 'Bauchi Road', 'Ring Road', 'Farin Gada', 'Terminus', 'Bukuru', 'Rayfield'
];

export default function AgentOnboarding() {
  const navigate = useNavigate();
  const { unlockRole } = useAuthStore();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<FormData>>({
    commission_preference: 'standard',
    operational_zones: [],
    // Initialize to avoid uncontrolled inputs
    agency_name: '',
    office_address: '',
    bio: '',
    bank_name: '',
    account_name: '',
    account_number: '',
    experience_years: 0,
  });

  // react-hook-form setup for each step
  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    formState: { errors: errorsStep1 },
    setValue: setValueStep1,
    watch: watchStep1,
  } = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      agency_name: formData.agency_name || '',
      office_address: formData.office_address || '',
      experience_years: formData.experience_years || 0,
      bio: formData.bio || '',
      operational_zones: formData.operational_zones || [],
    },
    mode: 'onChange'
  });

  const {
    register: registerStep2,
    handleSubmit: handleSubmitStep2,
    formState: { errors: errorsStep2 },
    setValue: setValueStep2,
    watch: watchStep2,
  } = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      id_type: formData.id_type || 'national_id',
      id_url: formData.id_url || '',
      proof_of_address_doc: formData.proof_of_address_doc || '',
      background_check_consent: formData.background_check_consent || false,
      terms_accepted: formData.terms_accepted || false,
    },
    mode: 'onChange'
  });

  const {
    register: registerStep3,
    handleSubmit: handleSubmitStep3,
    formState: { errors: errorsStep3 },
    watch: watchStep3,
  } = useForm({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      bank_name: formData.bank_name || '',
      account_name: formData.account_name || '',
      account_number: formData.account_number || '',
      commission_preference: formData.commission_preference || 'standard',
    },
    mode: 'onChange'
  });

  // Step Handlers
  const onStep1Submit = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(2);
    window.scrollTo(0, 0);
  };

  const onStep2Submit = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(3);
    window.scrollTo(0, 0);
  };

  const onFinalSubmit = async (data: Partial<FormData>) => {
    setIsSubmitting(true);
    try {
      const finalData = { ...formData, ...data } as AgentProfileData & { terms_accepted: boolean };
      
      // Add timestamps
      const submissionData: AgentProfileData = {
        ...finalData,
        terms_accepted_at: new Date().toISOString(),
        data_policy_accepted_at: new Date().toISOString(),
      };

      await agentService.createProfile(submissionData);
      
      // Unlock role and redirect
      // Note: In real app, this might wait for verification.
      // For now, we unlock it but Dashboard will show "Pending" state based on profile status.
      unlockRole('agent');
      
      // Redirect to dashboard shell
      navigate('/dashboard/agent');
      
    } catch (error) {
      console.error("Onboarding failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleZoneToggle = (zone: string) => {
    const current = watchStep1('operational_zones') || [];
    const newZones = current.includes(zone) 
      ? current.filter((z) => typeof z === 'string' && z !== zone)
      : [...current, zone];
    setValueStep1('operational_zones', newZones);
  };

  return (
    <div className="w-full pb-8">
      {/* Header */}
      <div className="bg-white px-6 py-4 border rounded-xl shadow-sm mb-6 relative z-10">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-gray-900">Agent Setup</h1>
          <span className="text-sm font-medium text-primary">Step {step} of 3</span>
        </div>
        {/* Progress Bar */}
        <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <main className="relative z-0">
        
        {/* Step 1: Professional Identity */}
        {step === 1 && (
          <form onSubmit={handleSubmitStep1(onStep1Submit)} className="space-y-6 relative z-20">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Building className="w-6 h-6 text-primary" />
                Identity
              </h2>
              <p className="text-gray-500">Tell us about your real estate experience.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Agency Name (Optional)</label>
                <input 
                  {...registerStep1('agency_name')}
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="e.g. Prestige Homes Ltd."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Office Address</label>
                <input 
                  {...registerStep1('office_address')}
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="Street address or office location"
                />
                {errorsStep1.office_address && <p className="text-red-500 text-xs mt-1">{errorsStep1.office_address.message?.toString()}</p>}
              </div>

               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                <input 
                  type="number"
                  inputMode="numeric"
                  {...registerStep1('experience_years')}
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
                {errorsStep1.experience_years && <p className="text-red-500 text-xs mt-1">{errorsStep1.experience_years.message?.toString()}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea 
                  {...registerStep1('bio')}
                  className="w-full h-32 p-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                  placeholder="Describe your expertise..."
                />
                {errorsStep1.bio && <p className="text-red-500 text-xs mt-1">{errorsStep1.bio.message?.toString()}</p>}
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Operational Zones</label>
                 <div className="flex flex-wrap gap-2">
                   {OPERATIONAL_ZONES.map(zone => {
                     const isSelected = (watchStep1('operational_zones') || []).includes(zone);
                     return (
                       <button
                        key={zone}
                        type="button"
                        onClick={() => handleZoneToggle(zone)}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                          isSelected 
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                        )}
                       >
                         {zone}
                       </button>
                     )
                   })}
                 </div>
                 {errorsStep1.operational_zones && <p className="text-red-500 text-xs mt-1">{errorsStep1.operational_zones.message?.toString()}</p>}
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base mt-8 rounded-xl font-semibold">
              Next Step
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </form>
        )}

        {/* Step 2: KYC */}
        {step === 2 && (
          <form onSubmit={handleSubmitStep2(onStep2Submit)} className="space-y-6 relative z-20">
             <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <ScanFace className="w-6 h-6 text-primary" />
                Verification
              </h2>
              <p className="text-gray-500">Compliance & Identity documents.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
                <select 
                  {...registerStep2('id_type')}
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none"
                >
                  <option value="national_id">National ID (NIN)</option>
                  <option value="passport">Types</option>
                  <option value="voters_card">Voter's Card</option>
                  <option value="drivers_license">Driver's License</option>
                </select>
              </div>

              {/* File Upload Mock 1 */}
              <div 
                className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setValueStep2('id_url', 'mock_url_id_123')}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Upload ID Document</p>
                <p className="text-xs text-gray-500 mt-1">Tap to simulate upload</p>
                {watchStep2('id_url') && (
                  <div className="mt-2 text-green-600 text-xs font-semibold flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Uploaded
                  </div>
                )}
              </div>
              {errorsStep2.id_url && <p className="text-red-500 text-xs">{errorsStep2.id_url.message?.toString()}</p>}

              {/* File Upload Mock 2 */}
              <div 
                className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setValueStep2('proof_of_address_doc', 'mock_url_poa_456')}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Proof of Address</p>
                <p className="text-xs text-gray-500 mt-1">Utility Bill or Bank Statement</p>
                 {watchStep2('proof_of_address_doc') && (
                  <div className="mt-2 text-green-600 text-xs font-semibold flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Uploaded
                  </div>
                )}
              </div>
              {errorsStep2.proof_of_address_doc && <p className="text-red-500 text-xs">{errorsStep2.proof_of_address_doc.message?.toString()}</p>}

              <div className="space-y-3 pt-4">
                <label className="flex items-start gap-3 p-3 border border-gray-100 rounded-xl bg-gray-50/50">
                  <input 
                    type="checkbox" 
                    {...registerStep2('background_check_consent')}
                    className="mt-1 w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <span className="text-sm text-gray-600">I consent to a professional background check.</span>
                </label>
                 {errorsStep2.background_check_consent && <p className="text-red-500 text-xs">{errorsStep2.background_check_consent.message?.toString()}</p>}

                <label className="flex items-start gap-3 p-3 border border-gray-100 rounded-xl bg-gray-50/50">
                  <input 
                    type="checkbox" 
                    {...registerStep2('terms_accepted')}
                    className="mt-1 w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <span className="text-sm text-gray-600">I accept the Agent Terms of Service & Privacy Policy.</span>
                </label>
                {errorsStep2.terms_accepted && <p className="text-red-500 text-xs">{errorsStep2.terms_accepted.message?.toString()}</p>}
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <Button type="button" variant="outline" className="w-1/3 h-12 rounded-xl" onClick={() => setStep(1)}>
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back
              </Button>
              <Button type="submit" className="flex-1 h-12 rounded-xl">
                Next Step
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          </form>
        )}

        {/* Step 3: Financials - Fluid Layout */}
        {step === 3 && (
          <form onSubmit={handleSubmitStep3(onFinalSubmit)} className="flex flex-col gap-6 relative z-20 pb-[env(safe-area-inset-bottom)]">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Wallet className="w-6 h-6 text-primary" />
                Payout Details
              </h2>
              <p className="text-gray-500">Configure your wallet to receive your 3% commission.</p>
            </div>

            <div className="space-y-6">
              {/* Bank Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Bank Name
                </label>
                <input
                  {...registerStep3('bank_name')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="e.g. Zenith Bank"
                />
                {errorsStep3.bank_name && <p className="text-sm text-destructive font-medium">{errorsStep3.bank_name.message?.toString()}</p>}
              </div>

              {/* Account Number */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Account Number
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  {...registerStep3('account_number')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="0123456789"
                />
                {errorsStep3.account_number && <p className="text-sm text-destructive font-medium">{errorsStep3.account_number.message?.toString()}</p>}
              </div>

              {/* Account Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Account Name
                </label>
                <input
                  {...registerStep3('account_name')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Full name as it appears on bank"
                />
                {errorsStep3.account_name && <p className="text-sm text-destructive font-medium">{errorsStep3.account_name.message?.toString()}</p>}
              </div>

              {/* Commission Preference */}
              <div className="space-y-3">
                <label className="text-sm font-medium leading-none">Commission Preference</label>
                <div className="grid grid-cols-2 gap-4">
                  {['standard', 'accumulate'].map((opt) => (
                    <label
                      key={opt}
                      className={cn(
                        "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all",
                        watchStep3('commission_preference') === opt
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-200 text-gray-600"
                      )}
                    >
                      <input
                        type="radio"
                        value={opt}
                        {...registerStep3('commission_preference')}
                        className="sr-only"
                      />
                      <span className="font-semibold capitalize">{opt}</span>
                      <span className="text-xs text-center mt-1 opacity-80">
                         {opt === 'standard' ? 'Payout Weekly' : 'Hold until requested'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto pt-6 pb-safe flex gap-4">
              <Button type="button" variant="ghost" onClick={() => setStep(2)} className="w-1/3 text-muted-foreground">
                Back
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className={cn(
                  "flex-1 h-12 rounded-full font-bold text-lg shadow-lg transition-all",
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isSubmitting ? 'Finalizing...' : 'Complete Setup'}
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
