export type OrderStatus = 'new' | 'confirmed' | 'in_progress' | 'ready' | 'completed' | 'cancelled';

export type PaymentStatus = 'unpaid' | 'partially_paid' | 'paid';

export type BusinessCategory =
  | 'florist'
  | 'decorator'
  | 'photographer'
  | 'cleaner'
  | 'freelancer'
  | 'beauty'
  | 'event_vendor'
  | 'other';

export interface Profile {
  id: string;
  businessName: string | null;
  userName: string | null;
  businessCategory: BusinessCategory | null;
  currency: string;
  country: string | null;
  logoUrl: string | null;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  userId: string;
  firstName: string;
  lastName: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  customerId: string | null;
  title: string;
  description: string | null;
  orderType: string | null;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  price: number;
  deposit: number;
  materialCost: number;
  deliveryFee: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  deliveryRequired: boolean;
  deliveryAddress: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderImage {
  id: string;
  orderId: string;
  userId: string;
  storagePath: string;
  createdAt: string;
}

export type NotificationType =
  'order_tomorrow' | 'delivery_upcoming' | 'payment_unpaid' | 'order_needs_confirmation';

export interface AppNotification {
  id: string;
  userId: string;
  orderId: string | null;
  type: NotificationType;
  scheduledFor: string | null;
  sentAt: string | null;
  createdAt: string;
}
