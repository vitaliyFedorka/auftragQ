import type { Customer, Order } from '@/types/models';

export type CustomerRow = {
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

export type OrderRow = {
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

export function toCustomer(row: CustomerRow): Customer {
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

export function toOrder(row: OrderRow): Order {
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
