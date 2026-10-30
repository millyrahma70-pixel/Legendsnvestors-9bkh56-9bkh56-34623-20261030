import { z } from 'zod';
import { ADMIN_OTP_LENGTH } from '@/constants/admin';

export const adminLoginSchema = z.object({
  phone: z.string().trim().min(1, 'Enter your admin number.').regex(/^\+?[0-9\s()-]{9,20}$/, 'Enter a valid phone number.'),
  password: z.string().min(6, 'Enter your admin password (at least 6 characters).'),
});
export const adminVerificationSchema = z.object({
  token: z.string().trim().regex(new RegExp(`^\\d{${ADMIN_OTP_LENGTH}}$`), `Enter the ${ADMIN_OTP_LENGTH}-digit email code.`),
  password: z.string().min(6, 'Use at least 6 characters.'),
  confirm: z.string(),
}).refine(value => value.password === value.confirm, { message: 'Passwords do not match.', path: ['confirm'] });
export type AdminLoginValues = z.infer<typeof adminLoginSchema>;
export type AdminVerificationValues = z.infer<typeof adminVerificationSchema>;
