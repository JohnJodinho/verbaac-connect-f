/**
 * Ambassador Onboarding Schemas
 * 
 * Zod schemas for validating each step of the ambassador onboarding wizard.
 */

import { z } from 'zod';

// Step 1: Campus & Proximity Data
export const step1CampusSchema = z.object({
  assignedCampus: z
    .string()
    .min(1, 'Please select your campus'),
  currentZone: z
    .string()
    .min(1, 'Please select your current zone'),
  availabilityStatus: z.enum(['available', 'busy', 'unavailable']),
});

// Step 2: Financial Setup (Bank Details)
export const step2FinancialSchema = z.object({
  bankName: z
    .string()
    .min(1, 'Please select your bank'),
  bankCode: z
    .string()
    .min(1, 'Bank code is required'),
  accountNumber: z
    .string()
    .length(10, 'Account number must be 10 digits')
    .regex(/^\d+$/, 'Account number must contain only digits'),
  accountName: z
    .string()
    .min(2, 'Account name is required'),
});

// Step 3: Legal & Tier 1 Agreement
export const step3LegalSchema = z.object({
  fieldAuditAccepted: z
    .boolean()
    .refine((val) => val === true, 'You must accept the field audit protocols'),
  antiCollusionAccepted: z
    .boolean()
    .refine((val) => val === true, 'You must accept the anti-collusion policy'),
});

// Combined schema for full onboarding
export const ambassadorOnboardingSchema = z.object({
  // Step 1
  assignedCampus: z.string().min(1),
  currentZone: z.string().min(1),
  availabilityStatus: z.enum(['available', 'busy', 'unavailable']),
  
  // Step 2
  bankName: z.string().min(1),
  bankCode: z.string().min(1),
  accountNumber: z.string().length(10).regex(/^\d+$/),
  accountName: z.string().min(2),
  
  // Step 3
  fieldAuditAccepted: z.boolean().refine((val) => val === true),
  antiCollusionAccepted: z.boolean().refine((val) => val === true),
});

export type Step1Data = z.infer<typeof step1CampusSchema>;
export type Step2Data = z.infer<typeof step2FinancialSchema>;
export type Step3Data = z.infer<typeof step3LegalSchema>;
export type AmbassadorOnboardingFormData = z.infer<typeof ambassadorOnboardingSchema>;
