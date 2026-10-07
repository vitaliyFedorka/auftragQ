import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { useState, type ReactNode } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { spacing, typography } from '@/theme/tokens';
import { useThemeColors } from '@/theme/useThemeColors';
import { formatDate, formatTime } from '@/utils/date';
import type { Customer } from '@/types/models';

import { CustomerPickerSheet } from './CustomerPickerSheet';
import { orderSchema, type OrderInput } from '../schemas';

interface OrderFormProps {
  defaultValues: OrderInput;
  initialCustomerName?: string | null;
  onSubmit: (input: OrderInput) => Promise<void>;
  submitLabel: string;
  submitError: string | null;
}

export function OrderForm({
  defaultValues,
  initialCustomerName,
  onSubmit,
  submitLabel,
  submitError,
}: OrderFormProps) {
  const colors = useThemeColors();
  const [customerName, setCustomerName] = useState<string | null>(initialCustomerName ?? null);
  const [pickerOpen, setPickerOpen] = useState<
    'customer' | 'date' | 'startTime' | 'endTime' | null
  >(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OrderInput>({
    resolver: zodResolver(orderSchema),
    defaultValues,
  });

  const date = useWatch({ control, name: 'date' });
  const startTime = useWatch({ control, name: 'startTime' });
  const endTime = useWatch({ control, name: 'endTime' });
  const deliveryRequired = useWatch({ control, name: 'deliveryRequired' });

  const onSelectCustomer = (customer: Customer | null) => {
    setValue('customerId', customer?.id ?? null);
    setCustomerName(
      customer ? [customer.firstName, customer.lastName].filter(Boolean).join(' ') : null,
    );
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Field label="Customer">
          <Pressable
            onPress={() => setPickerOpen('customer')}
            style={[
              styles.pickerRow,
              { borderColor: colors.border, backgroundColor: colors.surface },
            ]}
          >
            <Text
              style={[typography.body, { color: customerName ? colors.text : colors.textSubtle }]}
            >
              {customerName ?? 'No customer selected'}
            </Text>
          </Pressable>
        </Field>

        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <Input
              label="Title"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.title?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="orderType"
          render={({ field }) => (
            <Input
              label="Order type"
              placeholder="e.g. Wedding bouquet"
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <Input
              label="Description"
              multiline
              numberOfLines={3}
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />

        <Field label="Date">
          <Pressable
            onPress={() => setPickerOpen('date')}
            style={[
              styles.pickerRow,
              { borderColor: colors.border, backgroundColor: colors.surface },
            ]}
          >
            <Text style={[typography.body, { color: date ? colors.text : colors.textSubtle }]}>
              {date ? formatDate(date) : 'Select a date'}
            </Text>
          </Pressable>
        </Field>

        <View style={styles.timeRow}>
          <View style={{ flex: 1 }}>
            <Field label="Start time">
              <Pressable
                onPress={() => setPickerOpen('startTime')}
                style={[
                  styles.pickerRow,
                  { borderColor: colors.border, backgroundColor: colors.surface },
                ]}
              >
                <Text
                  style={[typography.body, { color: startTime ? colors.text : colors.textSubtle }]}
                >
                  {startTime ? formatTime(startTime) : 'Select'}
                </Text>
              </Pressable>
            </Field>
          </View>
          <View style={{ flex: 1 }}>
            <Field label="End time">
              <Pressable
                onPress={() => setPickerOpen('endTime')}
                style={[
                  styles.pickerRow,
                  { borderColor: colors.border, backgroundColor: colors.surface },
                ]}
              >
                <Text
                  style={[typography.body, { color: endTime ? colors.text : colors.textSubtle }]}
                >
                  {endTime ? formatTime(endTime) : 'Select'}
                </Text>
              </Pressable>
            </Field>
          </View>
        </View>

        <View style={styles.amountsRow}>
          <View style={{ flex: 1 }}>
            <Controller
              control={control}
              name="price"
              render={({ field }) => (
                <Input
                  label="Price"
                  keyboardType="decimal-pad"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.price?.message}
                />
              )}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Controller
              control={control}
              name="deposit"
              render={({ field }) => (
                <Input
                  label="Deposit"
                  keyboardType="decimal-pad"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.deposit?.message}
                />
              )}
            />
          </View>
        </View>
        <View style={styles.amountsRow}>
          <View style={{ flex: 1 }}>
            <Controller
              control={control}
              name="materialCost"
              render={({ field }) => (
                <Input
                  label="Material cost"
                  keyboardType="decimal-pad"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.materialCost?.message}
                />
              )}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Controller
              control={control}
              name="deliveryFee"
              render={({ field }) => (
                <Input
                  label="Delivery fee"
                  keyboardType="decimal-pad"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.deliveryFee?.message}
                />
              )}
            />
          </View>
        </View>

        <View style={styles.switchRow}>
          <Text style={[typography.body, { color: colors.text }]}>Delivery required</Text>
          <Controller
            control={control}
            name="deliveryRequired"
            render={({ field }) => (
              <Switch
                value={field.value}
                onValueChange={field.onChange}
                trackColor={{ true: colors.accent }}
              />
            )}
          />
        </View>

        {deliveryRequired ? (
          <Controller
            control={control}
            name="deliveryAddress"
            render={({ field }) => (
              <Input
                label="Delivery address"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.deliveryAddress?.message}
              />
            )}
          />
        ) : null}

        <Controller
          control={control}
          name="notes"
          render={({ field }) => (
            <Input
              label="Notes"
              multiline
              numberOfLines={3}
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />

        {submitError ? <Text style={{ color: colors.danger }}>{submitError}</Text> : null}
        <Button label={submitLabel} onPress={handleSubmit(onSubmit)} loading={isSubmitting} />
      </ScrollView>

      <CustomerPickerSheet
        visible={pickerOpen === 'customer'}
        onSelect={onSelectCustomer}
        onClose={() => setPickerOpen(null)}
      />

      {pickerOpen === 'date' ? (
        <NativePicker
          mode="date"
          value={date ? dayjs(date).toDate() : new Date()}
          onConfirm={(selected) => setValue('date', dayjs(selected).format('YYYY-MM-DD'))}
          onClose={() => setPickerOpen(null)}
        />
      ) : null}
      {pickerOpen === 'startTime' ? (
        <NativePicker
          mode="time"
          value={startTime ? dayjs(`2000-01-01T${startTime}`).toDate() : new Date()}
          onConfirm={(selected) => setValue('startTime', dayjs(selected).format('HH:mm'))}
          onClose={() => setPickerOpen(null)}
        />
      ) : null}
      {pickerOpen === 'endTime' ? (
        <NativePicker
          mode="time"
          value={endTime ? dayjs(`2000-01-01T${endTime}`).toDate() : new Date()}
          onConfirm={(selected) => setValue('endTime', dayjs(selected).format('HH:mm'))}
          onClose={() => setPickerOpen(null)}
        />
      ) : null}
    </>
  );
}

function NativePicker({
  mode,
  value,
  onConfirm,
  onClose,
}: {
  mode: 'date' | 'time';
  value: Date;
  onConfirm: (date: Date) => void;
  onClose: () => void;
}) {
  if (Platform.OS === 'android') {
    return (
      <DateTimePicker
        value={value}
        mode={mode}
        onChange={(_event, selected) => {
          onClose();
          if (selected) onConfirm(selected);
        }}
      />
    );
  }

  return (
    <BottomSheet visible title={mode === 'date' ? 'Select date' : 'Select time'} onClose={onClose}>
      <DateTimePicker
        value={value}
        mode={mode}
        display="spinner"
        onChange={(_event, selected) => {
          if (selected) onConfirm(selected);
        }}
      />
      <Button label="Done" onPress={onClose} />
    </BottomSheet>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  const colors = useThemeColors();
  return (
    <View>
      <Text style={[typography.caption, { color: colors.textMuted, marginBottom: spacing.xs }]}>
        {label}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    padding: spacing.lg,
  },
  pickerRow: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  timeRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  amountsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
