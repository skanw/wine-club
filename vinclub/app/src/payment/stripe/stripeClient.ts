import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

function initializeStripe(): Stripe {
  if (!stripeInstance) {
    const apiKey = process.env.STRIPE_API_KEY;
    if (!apiKey) {
      throw new Error(
        'STRIPE_API_KEY is not configured. Please set it in your .env.server file. ' +
        'For development, you can use a test key from https://dashboard.stripe.com/test/apikeys'
      );
    }
    stripeInstance = new Stripe(apiKey, {
      // NOTE:
      // API version below should ideally match the API version in your Stripe dashboard.
      // If that is not the case, you will most likely want to (up/down)grade the `stripe`
      // npm package to the API version that matches your Stripe dashboard's one.
      // For more details and alternative setups check
      // https://docs.stripe.com/api/versioning .
      apiVersion: '2025-04-30.basil',
    });
  }
  return stripeInstance;
}

/**
 * Stripe client instance. Initializes lazily on first access.
 * This allows the server to start without STRIPE_API_KEY configured,
 * but will throw an error when Stripe is actually used.
 */
export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const instance = initializeStripe();
    const value = instance[prop as keyof Stripe];
    // If it's a function, bind it to the instance
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  },
});
