import Stripe from 'stripe';
import { HttpError } from 'wasp/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export type CreateCheckoutSessionInput = {
  subscriptionTierId: string;
  wineCaveId: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
};

export const createCheckoutSession = async (args: CreateCheckoutSessionInput, context: any): Promise<{ sessionId: string }> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  try {
    // Get subscription tier details
    const subscriptionTier = await context.entities.SubscriptionTier.findUnique({
      where: { id: args.subscriptionTierId },
      include: { wineCave: true },
    });

    if (!subscriptionTier) {
      throw new HttpError(404, 'Subscription tier not found');
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: subscriptionTier.currency || 'eur',
            unit_amount: Math.round(subscriptionTier.price * 100), // Convert to cents
            recurring: {
              interval: subscriptionTier.billingCycle === 'MONTHLY' ? 'month' : 'year',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: args.successUrl,
      cancel_url: args.cancelUrl,
      customer_email: args.customerEmail,
      metadata: {
        subscriptionTierId: args.subscriptionTierId,
        wineCaveId: args.wineCaveId,
        userId: context.user.id,
      },
    });

    return { sessionId: session.id };
  } catch (error) {
    // TODO: Integrate with production logging service
    throw new HttpError(500, 'Failed to create checkout session');
  }
};

export const createStripeSubscription = async (args: { subscriptionTierId: string; wineCaveId: string }, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  try {
    const subscriptionTier = await context.entities.SubscriptionTier.findUnique({
      where: { id: args.subscriptionTierId },
    });

    if (!subscriptionTier) {
      throw new HttpError(404, 'Subscription tier not found');
    }

    // Create subscription in database
    const subscription = await context.entities.WineSubscription.create({
      data: {
        memberId: context.user.id,
        wineCaveId: args.wineCaveId,
        subscriptionTierId: args.subscriptionTierId,
        status: 'active',
        startDate: new Date(),
      },
    });

    return subscription;
  } catch (error) {
    // TODO: Integrate with production logging service
    throw new HttpError(500, 'Failed to create subscription');
  }
};

export const cancelStripeSubscription = async (args: { subscriptionId: string }, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  try {
    const subscription = await context.entities.WineSubscription.findFirst({
      where: {
        id: args.subscriptionId,
        memberId: context.user.id,
      },
    });

    if (!subscription) {
      throw new HttpError(404, 'Subscription not found');
    }

    // Update subscription status
    const updatedSubscription = await context.entities.WineSubscription.update({
      where: { id: args.subscriptionId },
      data: { status: 'cancelled' },
    });

    return updatedSubscription;
  } catch (error) {
    // TODO: Integrate with production logging service
    throw new HttpError(500, 'Failed to cancel subscription');
  }
};

export const createPaymentIntent = async (args: { amount: number; currency: string }, context: any): Promise<{ clientSecret: string }> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(args.amount * 100), // Convert to cents
      currency: args.currency,
      metadata: {
        userId: context.user.id,
      },
    });

    return { clientSecret: paymentIntent.client_secret! };
  } catch (error) {
    // TODO: Integrate with production logging service
    throw new HttpError(500, 'Failed to create payment intent');
  }
};

export const handleWebhook = async (event: Stripe.Event): Promise<void> => {
  let _session: Stripe.Checkout.Session | undefined
  let _invoice: Stripe.Invoice | undefined
  let _failedInvoice: Stripe.Invoice | undefined
  switch (event.type) {
    case 'checkout.session.completed':
      _session = event.data.object as Stripe.Checkout.Session
      // TODO: Handle successful checkout (e.g., log event, notify user)
      break
    case 'invoice.payment_succeeded':
      _invoice = event.data.object as Stripe.Invoice
      // TODO: Handle successful subscription payment (e.g., log event, notify user)
      break
    case 'invoice.payment_failed':
      _failedInvoice = event.data.object as Stripe.Invoice
      // TODO: Handle failed payment (e.g., log event, notify user)
      break
    default:
      // TODO: Handle unhandled event type (e.g., log event)
  }
}; 