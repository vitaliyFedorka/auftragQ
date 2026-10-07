import { z } from 'zod';

import type { Order } from '@/types/models';

const amountSchema = z
  .string()
  .trim()
  .refine((value) => value !== '', 'Required')
  .refine((value) => /^\d+(\.\d{1,2})?$/.test(value), 'Enter a valid amount');

export const orderSchema = z
  .object({
    customerId: z.string().nullable(),
    title: z.string().trim().min(1, 'Title is required'),
    description: z.string().trim(),
    orderType: z.string().trim(),
    date: z.string().nullable(),
    startTime: z.string().nullable(),
    endTime: z.string().nullable(),
    price: amountSchema,
    deposit: amountSchema,
    materialCost: amountSchema,
    deliveryFee: amountSchema,
    deliveryRequired: z.boolean(),
    deliveryAddress: z.string().trim(),
    notes: z.string().trim(),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryRequired && data.deliveryAddress.trim() === '') {
      ctx.addIssue({
        code: 'custom',
        path: ['deliveryAddress'],
        message: 'Delivery address is required for delivery orders',
      });
    }
    if (Number(data.deposit) > Number(data.price)) {
      ctx.addIssue({
        code: 'custom',
        path: ['deposit'],
        message: 'Deposit cannot exceed the price',
      });
    }
  });

export type OrderInput = z.infer<typeof orderSchema>;

export const orderFormDefaults: OrderInput = {
  customerId: null,
  title: '',
  description: '',
  orderType: '',
  date: null,
  startTime: null,
  endTime: null,
  price: '0',
  deposit: '0',
  materialCost: '0',
  deliveryFee: '0',
  deliveryRequired: false,
  deliveryAddress: '',
  notes: '',
};

export function orderToFormInput(order: Order): OrderInput {
  return {
    customerId: order.customerId,
    title: order.title,
    description: order.description ?? '',
    orderType: order.orderType ?? '',
    date: order.date,
    startTime: order.startTime,
    endTime: order.endTime,
    price: String(order.price),
    deposit: String(order.deposit),
    materialCost: String(order.materialCost),
    deliveryFee: String(order.deliveryFee),
    deliveryRequired: order.deliveryRequired,
    deliveryAddress: order.deliveryAddress ?? '',
    notes: order.notes ?? '',
  };
}
