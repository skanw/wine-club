// Payment utility functions
export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const calculateSubscriptionPrice = (basePrice: number, billingCycle: string): number => {
  if (billingCycle === 'YEARLY') {
    return basePrice * 12 * 0.9; // 10% discount for yearly
  }
  return basePrice;
};

export const validatePaymentData = (data: any): boolean => {
  return data && data.amount && data.currency && data.amount > 0;
}; 