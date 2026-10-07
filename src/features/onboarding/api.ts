import { supabase } from '@/lib/supabase/client';
import type { Profile } from '@/types/models';

import type { OnboardingInput } from './schemas';

function toProfile(row: {
  id: string;
  business_name: string | null;
  user_name: string | null;
  business_category: string | null;
  currency: string;
  country: string | null;
  logo_url: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}): Profile {
  return {
    id: row.id,
    businessName: row.business_name,
    userName: row.user_name,
    businessCategory: row.business_category as Profile['businessCategory'],
    currency: row.currency,
    country: row.country,
    logoUrl: row.logo_url,
    onboardingCompleted: row.onboarding_completed,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data ? toProfile(data) : null;
}

export async function completeOnboarding(userId: string, input: OnboardingInput): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      business_name: input.businessName,
      user_name: input.userName,
      business_category: input.businessCategory,
      country: input.country,
      currency: input.currency,
      logo_url: input.logoUrl ?? null,
      onboarding_completed: true,
    })
    .select('*')
    .single();
  if (error) throw error;
  return toProfile(data);
}
