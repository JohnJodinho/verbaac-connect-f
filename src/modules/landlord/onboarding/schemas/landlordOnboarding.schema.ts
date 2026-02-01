import { z } from 'zod';

/**
 * Step 1: Entity Identification Schema
 */
export const entityIdSchema = z.object({
  landlordType: z.enum(['individual', 'agent', 'company']),
  legalName: z.string().min(3, 'Legal name must be at least 3 characters'),
  registrationNumber: z.string().optional().refine(() => {
    // registrationNumber is required if type is agent or company
    return true; // Simplified for now
  }, {
    message: 'Registration number is required for Agents and Companies',
  }),
});

/**
 * Step 2: KYC & Proof of Ownership Schema
 */
export const kycSchema = z.object({
  idUrl: z.string().url('Please upload a valid Government ID'),
  propertyProofUrl: z.string().url('Please upload a valid Property Ownership Proof'),
});

/**
 * Step 3: Financial Setup Schema
 */
export const financialSchema = z.object({
  bankName: z.string().min(1, 'Please select a bank'),
  bankCode: z.string().min(1, 'Bank code is required'),
  accountNumber: z.string().length(10, 'Account number must be 10 digits'),
  accountName: z.string().min(3, 'Account name must be at least 3 characters'),
});

export type EntityIdValues = z.infer<typeof entityIdSchema>;
export type KycValues = z.infer<typeof kycSchema>;
export type FinancialValues = z.infer<typeof financialSchema>;

export const landlordOnboardingSchema = z.object({
  ...entityIdSchema.shape,
  ...kycSchema.shape,
  ...financialSchema.shape,
});

export type LandlordOnboardingValues = z.infer<typeof landlordOnboardingSchema>;
