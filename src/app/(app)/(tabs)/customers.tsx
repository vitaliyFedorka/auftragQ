import { ScreenContainer } from '@/components/ScreenContainer';
import { EmptyState } from '@/components/ui/EmptyState';

export default function CustomersScreen() {
  return (
    <ScreenContainer>
      <EmptyState
        title="No customers yet"
        description="Customer profiles, contact shortcuts and order history arrive in Phase 2."
      />
    </ScreenContainer>
  );
}
