import { z } from 'zod';

export const step1Schema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  middleName: z.string().optional(),
  email: z.email("Invalid email address"),
  phoneNumber: z.string().regex(/^\+?[0-9]{10,14}$/, "Invalid phone number (e.g., +234...)"), // Basic regex
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const step2Schema = z.object({
  gender: z.enum(['male', 'female'], { message: "Please select your gender" }),
  dateOfBirth: z.string().refine((date) => {
    const age = new Date().getFullYear() - new Date(date).getFullYear();
    return age >= 18;
  }, "You must be at least 18 years old"),
  userName: z.string().min(3, "Username must be at least 3 characters").max(20, "Username too long"),
  
  isStudent: z.boolean(),
  
  // Conditional fields - validations applied conditionally in the form or via refine if strictly needed here, 
  // but simpler to make them optional/nullable in schema and validate in UI logic or superRefine
  institution: z.string().optional(),
  matricNo: z.string().optional(),
  level: z.string().optional(), // Using string for select input then parsing to number
}).superRefine((data, ctx) => {
  if (data.isStudent) {
    if (!data.institution) {
      ctx.addIssue({
        code: "custom",
        message: "Institution is required for students",
        path: ["institution"],
      });
    }
    if (!data.matricNo) {
      ctx.addIssue({
        code: "custom",
        message: "Matric Number is required for students",
        path: ["matricNo"],
      });
    }
    if (!data.level) {
      ctx.addIssue({
        code: "custom",
        message: "Level is required for students",
        path: ["level"],
      });
    }
  }
});

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
