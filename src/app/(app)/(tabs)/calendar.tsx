import { ScreenContainer } from '@/components/ScreenContainer';
import { EmptyState } from '@/components/ui/EmptyState';

export default function CalendarScreen() {
  return (
    <ScreenContainer>
      <EmptyState
        title="Calendar coming soon"
        description="Monthly and agenda views of orders, deliveries and appointments arrive in Phase 5."
      />
    </ScreenContainer>
  );
}
