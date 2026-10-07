import { supabase } from '@/lib/supabase/client';
import { toCustomer, toOrder } from '@/lib/supabase/mappers';
import type { Customer, Order } from '@/types/models';

import type { CustomerInput } from './schemas';

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
