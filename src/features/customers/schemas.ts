import { z } from 'zod';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const customerSchema = z
  .object({
    firstName: z.string().trim().min(1, 'First name is required'),
    lastName: z.string().trim(),
    phone: z.string().trim(),
    email: z.string().trim(),
    address: z.string().trim(),
    notes: z.string().trim(),
  })
  .superRefine((data, ctx) => {
    if (data.email && !emailPattern.test(data.email)) {
      ctx.addIssue({ code: 'custom', path: ['email'], message: 'Enter a valid email address' });
    }
  });

export type CustomerInput = z.infer<typeof customerSchema>;

export const customerFormDefaults: CustomerInput = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  address: '',
  notes: '',
};
