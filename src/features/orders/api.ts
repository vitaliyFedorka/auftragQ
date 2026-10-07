import { supabase } from '@/lib/supabase/client';
import { toOrder, type OrderRow } from '@/lib/supabase/mappers';
import type { Order, OrderStatus, PaymentStatus } from '@/types/models';

import type { OrderInput } from './schemas';

export interface OrderWithCustomer extends Order {
  customerName: string | null;
}

type OrderRowWithCustomer = OrderRow & {
  customers: { first_name: string; last_name: string | null } | null;
};

function toOrderWithCustomer(row: OrderRowWithCustomer): OrderWithCustomer {
  return {
    ...toOrder(row),
    customerName: row.customers
      ? [row.customers.first_name, row.customers.last_name].filter(Boolean).join(' ')
      : null,
  };
}

function toNullable(value: string): string | null {
  return value.trim() === '' ? null : value.trim();
}

export async function listOrders(): Promise<OrderWithCustomer[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, customers(first_name, last_name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toOrderWithCustomer);
}

export async function getOrder(id: string): Promise<OrderWithCustomer | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, customers(first_name, last_name)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data ? toOrderWithCustomer(data) : null;
}

function buildPayload(input: OrderInput) {
  return {
    customer_id: input.customerId,
    title: input.title.trim(),
    description: toNullable(input.description),
    order_type: toNullable(input.orderType),
    date: input.date,
    start_time: input.startTime,
    end_time: input.endTime,
    price: Number(input.price),
    deposit: Number(input.deposit),
    material_cost: Number(input.materialCost),
    delivery_fee: Number(input.deliveryFee),
    delivery_required: input.deliveryRequired,
    delivery_address: toNullable(input.deliveryAddress),
    notes: toNullable(input.notes),
  };
}

export async function createOrder(userId: string, input: OrderInput): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .insert({ user_id: userId, ...buildPayload(input) })
    .select('*')
    .single();
  if (error) throw error;
  return toOrder(data);
}

export async function updateOrder(id: string, input: OrderInput): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .update(buildPayload(input))
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return toOrder(data);
}

export async function updateOrderStatus(id: string, orderStatus: OrderStatus): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .update({ order_status: orderStatus })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return toOrder(data);
}

export async function updatePaymentStatus(
  id: string,
  paymentStatus: PaymentStatus,
): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .update({ payment_status: paymentStatus })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return toOrder(data);
}

export async function deleteOrder(id: string): Promise<void> {
  const { error } = await supabase.from('orders').delete().eq('id', id);
  if (error) throw error;
}
