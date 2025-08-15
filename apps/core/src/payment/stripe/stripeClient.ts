import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

// Customer Management
export const createStripeCustomer = async (email: string, name?: string) => {
  return await stripe.customers.create({
    email,
    name,
    metadata: {
      source: 'wineclub-saas',
    },
  });
};

export const updateStripeCustomer = async (customerId: string, data: Stripe.CustomerUpdateParams) => {
  return await stripe.customers.update(customerId, data);
};

// Subscription Management
export const createSubscription = async (customerId: string, priceId: string, metadata?: Record<string, string>) => {
  return await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    metadata,
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
  });
};

export const cancelSubscription = async (subscriptionId: string, cancelAtPeriodEnd: boolean = true) => {
  if (cancelAtPeriodEnd) {
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  } else {
    return await stripe.subscriptions.cancel(subscriptionId);
  }
};

export const reactivateSubscription = async (subscriptionId: string) => {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
};

export const updateSubscription = async (subscriptionId: string, updates: Stripe.SubscriptionUpdateParams) => {
  return await stripe.subscriptions.update(subscriptionId, updates);
};

// Payment Methods
export const createPaymentMethod = async (paymentMethodData: Stripe.PaymentMethodCreateParams) => {
  return await stripe.paymentMethods.create(paymentMethodData);
};

export const attachPaymentMethod = async (paymentMethodId: string, customerId: string) => {
  return await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  });
};

export const detachPaymentMethod = async (paymentMethodId: string) => {
  return await stripe.paymentMethods.detach(paymentMethodId);
};

// Invoices and Billing
export const createInvoice = async (customerId: string, subscriptionId?: string) => {
  return await stripe.invoices.create({
    customer: customerId,
    subscription: subscriptionId,
    auto_advance: true,
  });
};

export const finalizeInvoice = async (invoiceId: string) => {
  return await stripe.invoices.finalizeInvoice(invoiceId);
};

export const payInvoice = async (invoiceId: string, paymentMethodId?: string) => {
  return await stripe.invoices.pay(invoiceId, {
    payment_method: paymentMethodId,
  });
};

// Webhook Verification
export const constructWebhookEvent = (payload: string | Buffer, signature: string, secret: string) => {
  return stripe.webhooks.constructEvent(payload, signature, secret);
};

// Price Management
export const createPrice = async (priceData: Stripe.PriceCreateParams) => {
  return await stripe.prices.create(priceData);
};

export const updatePrice = async (priceId: string, updates: Stripe.PriceUpdateParams) => {
  return await stripe.prices.update(priceId, updates);
};

// Refunds
export const createRefund = async (paymentIntentId: string, amount?: number, reason?: Stripe.RefundCreateParams.Reason) => {
  return await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount,
    reason,
  });
};

// Customer Portal
export const createCustomerPortalSession = async (customerId: string, returnUrl: string) => {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
};

// Utility Functions
export const formatAmountForStripe = (amount: number, currency: string = 'eur'): number => {
  const multiplier = currency === 'jpy' ? 1 : 100;
  return Math.round(amount * multiplier);
};

export const formatAmountFromStripe = (amount: number, currency: string = 'eur'): number => {
  const divisor = currency === 'jpy' ? 1 : 100;
  return amount / divisor;
};
