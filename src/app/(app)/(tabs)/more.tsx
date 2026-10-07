import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { signOut } from '@/features/auth/api';
import { useSession } from '@/providers/SessionProvider';
import { spacing, typography } from '@/theme/tokens';
import { useThemeColors } from '@/theme/useThemeColors';
import { getErrorMessage } from '@/utils/errors';

export default function MoreScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { session, profile } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setError(null);
    setLoading(true);
    try {
      await signOut();
      router.replace('/');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <Text style={[typography.title, { color: colors.text, marginBottom: spacing.lg }]}>More</Text>

      <Card style={{ marginBottom: spacing.lg }}>
        <Text style={[typography.subheading, { color: colors.text }]}>{profile?.businessName}</Text>
        <Text style={[typography.body, { color: colors.textMuted, marginTop: spacing.xs }]}>
          {profile?.userName}
        </Text>
        <Text style={[typography.caption, { color: colors.textSubtle, marginTop: spacing.sm }]}>
          {session?.user.email}
        </Text>
      </Card>

      {error ? (
        <Text style={{ color: colors.danger, marginBottom: spacing.md }}>{error}</Text>
      ) : null}

      <View style={styles.footer}>
        <Button label="Sign out" onPress={handleSignOut} variant="secondary" loading={loading} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 'auto',
  },
});
