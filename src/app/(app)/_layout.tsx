import { Redirect, Stack } from 'expo-router';

import { useSession } from '@/providers/SessionProvider';

export default function AppLayout() {
  const { session, isSessionLoading, profile, isProfileLoading } = useSession();

  if (isSessionLoading || isProfileLoading) return null;
  if (!session) return <Redirect href="/(auth)/login" />;
  if (!profile?.onboardingCompleted) return <Redirect href="/(onboarding)/business-setup" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
