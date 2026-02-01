import { z } from 'zod';

// Nigerian banks supported by Paystack/Monnify
export const NIGERIAN_BANKS = [
  { code: '044', name: 'Access Bank' },
  { code: '023', name: 'Citibank Nigeria' },
  { code: '050', name: 'Ecobank Nigeria' },
  { code: '070', name: 'Fidelity Bank' },
  { code: '011', name: 'First Bank of Nigeria' },
  { code: '214', name: 'First City Monument Bank' },
  { code: '058', name: 'Guaranty Trust Bank' },
  { code: '030', name: 'Heritage Bank' },
  { code: '301', name: 'Jaiz Bank' },
  { code: '082', name: 'Keystone Bank' },
  { code: '526', name: 'Parallex Bank' },
  { code: '076', name: 'Polaris Bank' },
  { code: '101', name: 'Providus Bank' },
  { code: '221', name: 'Stanbic IBTC Bank' },
  { code: '068', name: 'Standard Chartered Bank' },
  { code: '232', name: 'Sterling Bank' },
  { code: '100', name: 'Suntrust Bank' },
  { code: '032', name: 'Union Bank of Nigeria' },
  { code: '033', name: 'United Bank for Africa' },
  { code: '215', name: 'Unity Bank' },
  { code: '035', name: 'Wema Bank' },
  { code: '057', name: 'Zenith Bank' },
  { code: '999992', name: 'Opay' },
  { code: '999991', name: 'PalmPay' },
  { code: '999993', name: 'Moniepoint' },
  { code: '090110', name: 'Kuda Bank' },
] as const;

// Step 1: Marketplace Profile Setup
export const step1ProfileSchema = z.object({
  userName: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores'
    ),
  profilePhotoUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

// Step 2: Financial & Payout Details
export const step2FinancialSchema = z.object({
  bankName: z.string().min(1, 'Please select a bank'),
  bankCode: z.string().min(1, 'Bank code is required'),
  accountNumber: z
    .string()
    .length(10, 'Account number must be exactly 10 digits')
    .regex(/^\d{10}$/, 'Account number must contain only digits'),
  accountName: z.string().min(2, 'Account name is required'),
});

// Step 3: Legal Compliance & Activation
export const step3LegalSchema = z.object({
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the Terms & Conditions',
  }),
  dataPrivacyAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the Data Privacy Policy',
  }),
});

// Combined schema for full onboarding data
export const sellerOnboardingSchema = step1ProfileSchema
  .merge(step2FinancialSchema)
  .merge(step3LegalSchema);

// Type exports
export type Step1ProfileData = z.infer<typeof step1ProfileSchema>;
export type Step2FinancialData = z.infer<typeof step2FinancialSchema>;
export type Step3LegalData = z.infer<typeof step3LegalSchema>;
export type SellerOnboardingData = z.infer<typeof sellerOnboardingSchema>;

// Partial type for store persistence
export type SellerOnboardingPartialData = Partial<SellerOnboardingData>;
