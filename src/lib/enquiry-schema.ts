import { z } from 'zod';

/**
 * Zod schema for enquiry form validation.
 *
 * Rules:
 * - name:     required, letters and spaces only (no numbers or special characters)
 * - phone:    required, exactly 10 digits (after stripping non-digit characters)
 * - email:    optional, but must be valid if provided
 * - company:  optional free-text
 * - service:  required, non-empty string
 * - location: optional free-text
 * - message:  optional free-text
 */
export const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Please enter your name.')
    .regex(/^[A-Za-z\s]+$/, 'Name must contain only letters and spaces.'),

  phone: z
    .string()
    .trim()
    .min(1, 'Please enter a phone number we can reach you on.')
    .transform((val) => val.replace(/\D/g, ''))
    .pipe(
      z
        .string()
        .length(10, 'Phone number must be exactly 10 digits.'),
    ),

  email: z
    .string()
    .trim()
    .refine(
      (val) => val === '' || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val),
      'Please check this email address.',
    ),

  company: z.string().optional().default(''),

  service: z.string().min(1, 'Please choose the service you need.'),

  location: z.string().optional().default(''),

  message: z.string().optional().default(''),
});

export type EnquiryFormErrors = Partial<Record<keyof z.input<typeof enquirySchema>, string>>;
