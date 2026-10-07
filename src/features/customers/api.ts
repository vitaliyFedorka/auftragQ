import { supabase } from '@/lib/supabase/client';
import type { Customer, Order } from '@/types/models';

import type { CustomerInput } from './schemas';

type CustomerRow = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
};

type OrderRow = {
  id: string;
  user_id: string;
  customer_id: string | null;
  title: string;
  description: string | null;
  order_type: string | null;
  date: string | null;
  start_time: string | null;
  end_time: string | null;
  price: number;
  deposit: number;
  material_cost: number;
  delivery_fee: number;
  payment_status: Order['paymentStatus'];
  order_status: Order['orderStatus'];
  delivery_required: boolean;
  delivery_address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

function toCustomer(row: CustomerRow): Customer {
  return {
    id: row.id,
    userId: row.user_id,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    email: row.email,
    address: row.address,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

function toOrder(row: OrderRow): Order {
  return {
    id: row.id,
    userId: row.user_id,
    customerId: row.customer_id,
    title: row.title,
    description: row.description,
    orderType: row.order_type,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    price: row.price,
    deposit: row.deposit,
    materialCost: row.material_cost,
    deliveryFee: row.delivery_fee,
    paymentStatus: row.payment_status,
    orderStatus: row.order_status,
    deliveryRequired: row.delivery_required,
    deliveryAddress: row.delivery_address,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toNullable(value: string): string | null {
  return value.trim() === '' ? null : value.trim();
}

export async function listCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('first_name', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(toCustomer);
}

export async function getCustomer(id: string): Promise<Customer | null> {
  const { data, error } = await supabase.from('customers').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? toCustomer(data) : null;
}

export async function listOrdersForCustomer(customerId: string): Promise<Order[]> {
  const { data, error } = await supabase.from('orders').select('*').eq('customer_id', customerId);
  if (error) throw error;
  return (data ?? []).map(toOrder);
}

export async function createCustomer(userId: string, input: CustomerInput): Promise<Customer> {
  const { data, error } = await supabase
    .from('customers')
    .insert({
      user_id: userId,
      first_name: input.firstName.trim(),
      last_name: toNullable(input.lastName),
      phone: toNullable(input.phone),
      email: toNullable(input.email),
      address: toNullable(input.address),
      notes: toNullable(input.notes),
    })
    .select('*')
    .single();
  if (error) throw error;
  return toCustomer(data);
}

export async function updateCustomer(id: string, input: CustomerInput): Promise<Customer> {
  const { data, error } = await supabase
    .from('customers')
    .update({
      first_name: input.firstName.trim(),
      last_name: toNullable(input.lastName),
      phone: toNullable(input.phone),
      email: toNullable(input.email),
      address: toNullable(input.address),
      notes: toNullable(input.notes),
    })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return toCustomer(data);
}

export async function deleteCustomer(id: string): Promise<void> {
  const { error } = await supabase.from('customers').delete().eq('id', id);
  if (error) throw error;
}
