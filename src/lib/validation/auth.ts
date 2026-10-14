import { z } from 'zod';

/**
 * Validates Nepal mobile numbers.
 * Nepal mobile format:
 * Country code: +977 (optional in raw user input)
 * 10 digits starting with 96, 97, or 98
 * Examples: +9779812345678, 9812345678, +977 9741234567, 9612345678
 */
export const cleanNepalPhone = (raw: string): string => {
  return raw.replace(/[\s\-\(\)]/g, '');
};

export const normalizeToNepalE164 = (raw: string): string => {
  const cleaned = cleanNepalPhone(raw);
  if (cleaned.startsWith('+977')) {
    return cleaned;
  }
  if (cleaned.startsWith('977')) {
    return `+${cleaned}`;
  }
  return `+977${cleaned}`;
};

export const nepalPhoneRegex = /^(\+977)?[9][678]\d{8}$/;

export const phoneAuthSchema = z.object({
  phone: z
    .string()
    .min(1, 'Mobile number is required')
    .refine(
      (val) => {
        const cleaned = cleanNepalPhone(val);
        return nepalPhoneRegex.test(cleaned);
      },
      {
        message: 'Enter a valid Nepal mobile number starting with 96, 97, or 98 (e.g. +977 9812345678)',
      }
    ),
});

export type PhoneAuthInput = z.infer<typeof phoneAuthSchema>;

export const emailAuthSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
});

export type EmailAuthInput = z.infer<typeof emailAuthSchema>;

export const otpVerifySchema = z.object({
  otp: z
    .string()
    .length(6, 'Verification code must be exactly 6 digits')
    .regex(/^\d{6}$/, 'Verification code must contain only numbers'),
});

export type OtpVerifyInput = z.infer<typeof otpVerifySchema>;

export const onboardingSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(80, 'Full name cannot exceed 80 characters'),
  province: z
    .string()
    .min(1, 'Please select your province'),
  district: z
    .string()
    .trim()
    .min(1, 'Please select or enter your district'),
  localLevel: z
    .string()
    .trim()
    .min(2, 'Please enter your municipality or rural municipality (गाउँपालिका / नगरपालिका)'),
  ward: z
    .string()
    .trim()
    .min(1, 'Ward number is required')
    .regex(/^(?:[1-9]|[12][0-9]|3[0-5])$/, 'Ward number must be between 1 and 35'),
  preferredLanguage: z.enum(['ne', 'en'], {
    errorMap: () => ({ message: 'Please select your preferred language (Nepali or English)' }),
  }),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
