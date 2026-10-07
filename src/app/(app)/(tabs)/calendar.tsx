import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

import { ScreenContainer } from '@/components/ScreenContainer';
import { ChipGroup } from '@/components/ui/ChipGroup';
import { ErrorState } from '@/components/ui/ErrorState';
import { OrderCard } from '@/components/ui/OrderCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { groupOrdersByDate } from '@/features/calendar/agenda';
import { buildMarkedDates } from '@/features/calendar/markedDates';
import { useOrders } from '@/features/orders/hooks';
import { useSession } from '@/providers/SessionProvider';
import { spacing, typography } from '@/theme/tokens';
import { useThemeColors } from '@/theme/useThemeColors';
import { formatDate } from '@/utils/date';
import { getErrorMessage } from '@/utils/errors';

type ViewMode = 'month' | 'agenda';

const VIEW_OPTIONS: { value: ViewMode; label: string }[] = [
  { value: 'month', label: 'Month' },
  { value: 'agenda', label: 'Agenda' },
];

export default function CalendarScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { profile } = useSession();
  const [view, setView] = useState<ViewMode>('month');
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const { data: orders, isLoading, isError, error, refetch } = useOrders();

  const currency = profile?.currency ?? 'EUR';
  const markedDates = useMemo(
    () => buildMarkedDates(orders ?? [], colors, selectedDate),
    [orders, colors, selectedDate],
  );
  const agendaSections = useMemo(() => groupOrdersByDate(orders ?? []), [orders]);
  const selectedDayOrders = useMemo(
    () => (orders ?? []).filter((order) => order.date === selectedDate),
    [orders, selectedDate],
  );

  if (isLoading) {
    return (
      <ScreenContainer>
        <ActivityIndicator color={colors.accent} />
      </ScreenContainer>
    );
  }

  if (isError) {
    return (
      <ScreenContainer>
        <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={{ gap: spacing.md }}>
      <Text style={[typography.title, { color: colors.text }]}>Calendar</Text>
      <ChipGroup
        options={VIEW_OPTIONS}
        value={view}
        onChange={(value) => setView(value as ViewMode)}
      />

      {view === 'month' ? (
        <ScrollView contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.xl }}>
          <Calendar
            current={selectedDate}
            markedDates={markedDates}
            markingType="multi-dot"
            onDayPress={(day) => setSelectedDate(day.dateString)}
            theme={{
              backgroundColor: colors.background,
              calendarBackground: colors.background,
              textSectionTitleColor: colors.textMuted,
              dayTextColor: colors.text,
              monthTextColor: colors.text,
              todayTextColor: colors.accent,
              arrowColor: colors.accent,
              textDisabledColor: colors.textSubtle,
            }}
          />
          <View>
            <SectionHeader title={formatDate(selectedDate, 'dddd, D MMMM')} />
            {selectedDayOrders.length === 0 ? (
              <Text style={[typography.caption, { color: colors.textSubtle }]}>
                Nothing scheduled.
              </Text>
            ) : (
              <View style={{ gap: spacing.sm }}>
                {selectedDayOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    currency={currency}
                    onPress={() => router.push(`/(app)/orders/${order.id}`)}
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.xl }}>
          {agendaSections.length === 0 ? (
            <Text style={[typography.caption, { color: colors.textSubtle }]}>
              No scheduled orders yet.
            </Text>
          ) : (
            agendaSections.map((section) => (
              <View key={section.date} style={styles.agendaSection}>
                <SectionHeader title={formatDate(section.date, 'dddd, D MMMM')} />
                <View style={{ gap: spacing.sm }}>
                  {section.orders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      currency={currency}
                      onPress={() => router.push(`/(app)/orders/${order.id}`)}
                    />
                  ))}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  agendaSection: {
    gap: spacing.sm,
  },
});
