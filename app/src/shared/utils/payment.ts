import * as stripeUtils from '../../payment/stripe/checkoutUtils';
import * as lemonSqueezyUtils from '../../payment/lemonSqueezy/checkoutUtils';

// Payment provider types
export type PaymentProvider = 'stripe' | 'lemonSqueezy';

// Payment status types
export type PaymentStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded';

// Payment amount interface
export interface PaymentAmount {
  amount: number;
  currency: string;
}

// Payment details interface
export interface PaymentDetails {
  id: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  amount: PaymentAmount;
  metadata?: Record<string, any>;
}

// Re-export payment utilities
export const payment = {
  stripe: stripeUtils,
  lemonSqueezy: lemonSqueezyUtils
} as const;

// Format payment amount with currency
export const formatPaymentAmount = (amount: PaymentAmount): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: amount.currency
  }).format(amount.amount / 100); // Assuming amount is in cents
};

// Get payment provider display name
export const getPaymentProviderName = (provider: PaymentProvider): string => {
  const names: Record<PaymentProvider, string> = {
    stripe: 'Stripe',
    lemonSqueezy: 'LemonSqueezy'
  };
  return names[provider];
};

// Get payment status display text
export const getPaymentStatusText = (status: PaymentStatus): string => {
  const statusText: Record<PaymentStatus, string> = {
    pending: 'Pending',
    processing: 'Processing',
    succeeded: 'Succeeded',
    failed: 'Failed',
    refunded: 'Refunded'
  };
  return statusText[status];
};

// Get payment status color class
export const getPaymentStatusColor = (status: PaymentStatus): string => {
  const statusColors: Record<PaymentStatus, string> = {
    pending: 'text-yellow-500',
    processing: 'text-blue-500',
    succeeded: 'text-green-500',
    failed: 'text-red-500',
    refunded: 'text-gray-500'
  };
  return statusColors[status];
}; 