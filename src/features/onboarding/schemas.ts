import { z } from 'zod';

export const businessCategories = [
  { value: 'florist', label: 'Florist' },
  { value: 'decorator', label: 'Decorator' },
  { value: 'photographer', label: 'Photographer' },
  { value: 'cleaner', label: 'Cleaner' },
  { value: 'freelancer', label: 'Freelancer' },
  { value: 'beauty', label: 'Beauty professional' },
  { value: 'event_vendor', label: 'Event vendor' },
  { value: 'other', label: 'Other' },
] as const;

export const countries = [
  { value: 'DE', label: 'Germany', currency: 'EUR' },
  { value: 'AT', label: 'Austria', currency: 'EUR' },
  { value: 'CH', label: 'Switzerland', currency: 'CHF' },
  { value: 'OTHER', label: 'Other', currency: 'EUR' },
] as const;

export const onboardingSchema = z.object({
  businessName: z.string().trim().min(1, 'Business name is required'),
  userName: z.string().trim().min(1, 'Your name is required'),
  businessCategory: z.enum([
    'florist',
    'decorator',
    'photographer',
    'cleaner',
    'freelancer',
    'beauty',
    'event_vendor',
    'other',
  ]),
  country: z.string().min(1, 'Select a country'),
  currency: z.string().min(1, 'Select a currency'),
  logoUrl: z.string().nullable().optional(),
});
export type OnboardingInput = z.infer<typeof onboardingSchema>;
