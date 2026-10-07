import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useSession } from '@/providers/SessionProvider';
import { useThemeColors } from '@/theme/useThemeColors';

export default function Index() {
  const { session, isSessionLoading, profile, isProfileLoading } = useSession();
  const colors = useThemeColors();

  if (isSessionLoading || (session && isProfileLoading)) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!session) return <Redirect href="/(auth)/login" />;
  if (!profile?.onboardingCompleted) return <Redirect href="/(onboarding)/business-setup" />;
  return <Redirect href="/(app)/(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
