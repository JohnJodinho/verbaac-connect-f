import { z } from 'zod';

/**
 * Validates that a date makes the user at least 18 years old
 */
const isAtLeast18 = (dateString: string): boolean => {
  const birthDate = new Date(dateString);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= 18;
  }
  return age >= 18;
};

/**
 * Global Identity Schema (users table fields)
 */
export const globalIdentitySchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(200, 'First name must be less than 200 characters'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(200, 'Last name must be less than 200 characters'),
  middleName: z
    .string()
    .max(200, 'Middle name must be less than 200 characters')
    .optional()
    .or(z.literal('')),
  gender: z.enum(['male', 'female'], {
    message: 'Please select your gender',
  }),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine(isAtLeast18, {
      message: 'You must be at least 18 years old',
    }),
});

/**
 * Student Profile Schema (tenant_sub_profiles table)
 */
export const studentProfileSchema = z.object({
  institution: z
    .string()
    .min(2, 'Institution name is required')
    .max(255, 'Institution name is too long'),
  matricNo: z
    .string()
    .min(5, 'Matric number must be at least 5 characters')
    .max(50, 'Matric number is too long'),
  level: z
    .number()
    .min(100, 'Level must be at least 100')
    .max(900, 'Level cannot exceed 900'),
  preferredZones: z
    .array(z.string())
    .optional()
    .default([]),
});

/**
 * Preferences Schema (buyer_sub_profiles table)
 */
export const preferencesSchema = z.object({
  preferredZones: z
    .array(z.string().min(1))
    .optional()
    .default([]),
  savedCategories: z
    .array(z.string().min(1))
    .optional()
    .default([]),
});

// Type exports
export type GlobalIdentityFormData = z.infer<typeof globalIdentitySchema>;
export type StudentProfileFormData = z.infer<typeof studentProfileSchema>;
export type PreferencesFormData = z.infer<typeof preferencesSchema>;
