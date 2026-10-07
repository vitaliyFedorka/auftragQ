import { Text } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { EmptyState } from '@/components/ui/EmptyState';
import { useSession } from '@/providers/SessionProvider';
import { typography } from '@/theme/tokens';
import { useThemeColors } from '@/theme/useThemeColors';

export default function HomeScreen() {
  const { profile } = useSession();
  const colors = useThemeColors();

  return (
    <ScreenContainer>
      <Text style={[typography.title, { color: colors.text }]}>
        {profile?.businessName ?? 'Welcome'}
      </Text>
      <EmptyState
        title="Your dashboard is on the way"
        description="Today's revenue, orders and upcoming appointments will show up here once orders are tracked (Phase 4)."
      />
    </ScreenContainer>
  );
}
