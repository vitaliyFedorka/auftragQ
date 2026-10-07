import type { ThemeColors } from '@/theme/tokens';
import type { OrderStatus, PaymentStatus } from '@/types/models';

export function orderStatusColors(
  colors: ThemeColors,
  status: OrderStatus,
): { bg: string; fg: string } {
  switch (status) {
    case 'new':
      return { bg: colors.border, fg: colors.textMuted };
    case 'confirmed':
      return { bg: colors.accentMuted, fg: colors.accent };
    case 'in_progress':
      return { bg: colors.warningMuted, fg: colors.warning };
    case 'ready':
      return { bg: colors.accentMuted, fg: colors.accent };
    case 'completed':
      return { bg: colors.successMuted, fg: colors.success };
    case 'cancelled':
      return { bg: colors.dangerMuted, fg: colors.danger };
  }
}

export function paymentStatusColors(
  colors: ThemeColors,
  status: PaymentStatus,
): { bg: string; fg: string } {
  switch (status) {
    case 'unpaid':
      return { bg: colors.dangerMuted, fg: colors.danger };
    case 'partially_paid':
      return { bg: colors.warningMuted, fg: colors.warning };
    case 'paid':
      return { bg: colors.successMuted, fg: colors.success };
  }
}
