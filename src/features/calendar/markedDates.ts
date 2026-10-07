import { orderStatusColors } from '@/features/orders/statusColors';
import type { ThemeColors } from '@/theme/tokens';
import type { Order } from '@/types/models';

export interface MarkedDate {
  dots: { key: string; color: string }[];
  selected?: boolean;
  selectedColor?: string;
}

/** Pure so it can be unit tested without touching Supabase or react-native-calendars. */
export function buildMarkedDates<T extends Order>(
  orders: T[],
  colors: ThemeColors,
  selectedDate?: string,
): Record<string, MarkedDate> {
  const marked: Record<string, MarkedDate> = {};

  for (const order of orders) {
    if (!order.date) continue;
    const { fg } = orderStatusColors(colors, order.orderStatus);
    const entry = marked[order.date] ?? { dots: [] };
    if (entry.dots.length < 4) {
      entry.dots.push({ key: order.id, color: fg });
    }
    marked[order.date] = entry;
  }

  if (selectedDate) {
    marked[selectedDate] = {
      ...(marked[selectedDate] ?? { dots: [] }),
      selected: true,
      selectedColor: colors.accentMuted,
    };
  }

  return marked;
}
