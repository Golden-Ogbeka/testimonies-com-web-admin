import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .transform((email) => email.toLowerCase().trim()),
  password: z.string().min(1, 'Password is required').trim(),
});

export const verifyOtpSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .transform((email) => email.toLowerCase().trim()),
  otp: z
    .string()
    .min(1, 'OTP is required')
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must be 6 digits'),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .transform((email) => email.toLowerCase().trim()),
});

export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email format')
      .transform((email) => email.toLowerCase().trim()),
    otp: z
      .string()
      .min(1, 'OTP is required')
      .length(6, 'OTP must be 6 digits')
      .regex(/^\d{6}$/, 'OTP must be 6 digits'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /[!@#$%^&*]/,
        'Password must contain at least one special character (!@#$%^&*)',
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Admin management schemas
export const createAdminSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters long')
    .trim(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters long')
    .trim(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please provide a valid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[!@#$%^&*]/,
      'Password must contain at least one special character (!@#$%^&*)',
    ),
  phoneNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val),
      'Please provide a valid phone number',
    ),
  role: z.enum(['super-admin', 'admin']).optional(),
  permissions: z.array(z.string()).optional(),
});

export const updateAdminSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters long')
    .trim(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters long')
    .trim(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please provide a valid email'),
  phoneNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val),
      'Please provide a valid phone number',
    ),
  role: z.enum(['super-admin', 'admin']).optional(),
  permissions: z.array(z.string()).optional(),
});

// Permission schemas
export const createPermissionSchema = z.object({
  name: z
    .string()
    .min(1, 'Permission name is required')
    .min(2, 'Permission name must be at least 2 characters long')
    .trim(),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(5, 'Description must be at least 5 characters long')
    .trim(),
});

// Subscription schemas
export const createSubscriptionPlanSchema = z.object({
  name: z
    .string()
    .min(1, 'Plan name is required')
    .min(2, 'Plan name must be at least 2 characters long')
    .trim(),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(5, 'Description must be at least 5 characters long')
    .trim(),
  price: z.number().min(0, 'Price must be a positive number'),
  currency: z
    .string()
    .optional()
    .refine(
      (val) => !val || (val.length === 3 && /^[A-Z]{3}$/i.test(val)),
      'Currency must be a 3-letter code',
    )
    .transform((val) => val?.toUpperCase()),
  billingCycle: z.enum(['monthly', 'yearly', 'quarterly']),
  features: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

// Promotion schemas
export const createPromotionSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(2, 'Title must be at least 2 characters long')
    .trim(),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(5, 'Description must be at least 5 characters long')
    .trim(),
  type: z.enum(['announcement', 'discount', 'offer', 'feature']),
  targetAudience: z.enum(['all', 'basic', 'organizations']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  isActive: z.boolean().optional(),
});

// FAQ schemas
export const createFaqSchema = z.object({
  question: z
    .string()
    .min(1, 'Question is required')
    .min(5, 'Question must be at least 5 characters long')
    .trim(),
  answer: z
    .string()
    .min(1, 'Answer is required')
    .min(10, 'Answer must be at least 10 characters long')
    .trim(),
  order: z.number().min(0, 'Display order must be a positive number'),
  isActive: z.boolean().optional(),
});

// Content schemas
export const updateContentSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(2, 'Title must be at least 2 characters long')
    .trim(),
  version: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+\.\d+\.\d+$/.test(val),
      'Version must be in format x.y.z',
    ),
  content: z
    .string()
    .min(1, 'Content is required')
    .min(10, 'Content must be at least 10 characters long')
    .trim(),
});

// Profile update schema
export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters long')
    .trim(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters long')
    .trim(),
  phoneNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val),
      'Please provide a valid phone number',
    ),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /[!@#$%^&*]/,
        'Password must contain at least one special character (!@#$%^&*)',
      ),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type CreateAdminFormData = z.infer<typeof createAdminSchema>;
export type UpdateAdminFormData = z.infer<typeof updateAdminSchema>;
export type CreatePermissionFormData = z.infer<typeof createPermissionSchema>;
export type CreateSubscriptionPlanFormData = z.infer<
  typeof createSubscriptionPlanSchema
>;
export type CreatePromotionFormData = z.infer<typeof createPromotionSchema>;
export type CreateFaqFormData = z.infer<typeof createFaqSchema>;
export type UpdateContentFormData = z.infer<typeof updateContentSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
