import { ScreenContainer } from '@/components/ScreenContainer';
import { EmptyState } from '@/components/ui/EmptyState';

export default function OrdersScreen() {
  return (
    <ScreenContainer>
      <EmptyState
        title="No orders yet"
        description="Order management lands in Phase 3 — create, track and update orders here."
      />
    </ScreenContainer>
  );
}
