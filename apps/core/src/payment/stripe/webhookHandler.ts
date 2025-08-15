import Stripe from 'stripe';
import { HttpError } from 'wasp/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export interface WebhookEvent {
  id: string;
  type: string;
  data: any;
  created: number;
}

/**
 * Handle Stripe webhook events for subscription management
 */
export const handleStripeWebhook = async (event: WebhookEvent, context: any): Promise<void> => {
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object, context);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object, context);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object, context);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object, context);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object, context);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object, context);
        break;
      
      case 'payment_method.attached':
        await handlePaymentMethodAttached(event.data.object, context);
        break;
      
      case 'payment_method.detached':
        await handlePaymentMethodDetached(event.data.object, context);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Webhook handler error:', error);
    throw new HttpError(500, 'Webhook processing failed');
  }
};

/**
 * Handle successful checkout completion
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session, context: any): Promise<void> {
  const { subscriptionTierId, wineCaveId, userId } = session.metadata || {};
  
  if (!subscriptionTierId || !wineCaveId || !userId) {
    console.error('Missing metadata in checkout session:', session.id);
    return;
  }

  try {
    // Create subscription in database
    const subscription = await context.entities.WineSubscription.create({
      data: {
        memberId: userId,
        wineCaveId: wineCaveId,
        subscriptionTierId: subscriptionTierId,
        status: 'active',
        startDate: new Date(),
        stripeSubscriptionId: session.subscription as string,
        stripeCustomerId: session.customer as string,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    });

    // Update user's subscription status
    await context.entities.User.update({
      where: { id: userId },
      data: {
        subscriptionStatus: 'active',
        datePaid: new Date(),
      },
    });

    // Send welcome email
    await sendWelcomeEmail(userId, subscription, context);

    console.log(`Subscription created for user ${userId}: ${subscription.id}`);
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
    throw error;
  }
}

/**
 * Handle successful invoice payment
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice, context: any): Promise<void> {
  const subscriptionId = invoice.subscription as string;
  
  if (!subscriptionId) {
    console.error('No subscription ID in invoice:', invoice.id);
    return;
  }

  try {
    // Update subscription billing date
    const subscription = await context.entities.WineSubscription.findFirst({
      where: { stripeSubscriptionId: subscriptionId },
    });

    if (subscription) {
      await context.entities.WineSubscription.update({
        where: { id: subscription.id },
        data: {
          lastBillingDate: new Date(),
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: 'active',
        },
      });

      // Update user's payment date
      await context.entities.User.update({
        where: { id: subscription.memberId },
        data: { datePaid: new Date() },
      });

      // Send payment confirmation email
      await sendPaymentConfirmationEmail(subscription.memberId, invoice, context);

      console.log(`Payment succeeded for subscription: ${subscription.id}`);
    }
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
    throw error;
  }
}

/**
 * Handle failed invoice payment
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice, context: any): Promise<void> {
  const subscriptionId = invoice.subscription as string;
  
  if (!subscriptionId) {
    console.error('No subscription ID in failed invoice:', invoice.id);
    return;
  }

  try {
    const subscription = await context.entities.WineSubscription.findFirst({
      where: { stripeSubscriptionId: subscriptionId },
    });

    if (subscription) {
      // Update subscription status
      await context.entities.WineSubscription.update({
        where: { id: subscription.id },
        data: {
          status: 'past_due',
          lastBillingDate: new Date(),
        },
      });

      // Update user's subscription status
      await context.entities.User.update({
        where: { id: subscription.memberId },
        data: { subscriptionStatus: 'past_due' },
      });

      // Send payment failure notification
      await sendPaymentFailureEmail(subscription.memberId, invoice, context);

      console.log(`Payment failed for subscription: ${subscription.id}`);
    }
  } catch (error) {
    console.error('Error handling invoice payment failed:', error);
    throw error;
  }
}

/**
 * Handle subscription creation
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription, context: any): Promise<void> {
  try {
    const dbSubscription = await context.entities.WineSubscription.findFirst({
      where: { stripeSubscriptionId: subscription.id },
    });

    if (dbSubscription) {
      await context.entities.WineSubscription.update({
        where: { id: dbSubscription.id },
        data: {
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });
    }

    console.log(`Subscription created: ${subscription.id}`);
  } catch (error) {
    console.error('Error handling subscription created:', error);
    throw error;
  }
}

/**
 * Handle subscription updates
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription, context: any): Promise<void> {
  try {
    const dbSubscription = await context.entities.WineSubscription.findFirst({
      where: { stripeSubscriptionId: subscription.id },
    });

    if (dbSubscription) {
      await context.entities.WineSubscription.update({
        where: { id: dbSubscription.id },
        data: {
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
      });

      // Update user's subscription status
      await context.entities.User.update({
        where: { id: dbSubscription.memberId },
        data: { subscriptionStatus: subscription.status },
      });
    }

    console.log(`Subscription updated: ${subscription.id}`);
  } catch (error) {
    console.error('Error handling subscription updated:', error);
    throw error;
  }
}

/**
 * Handle subscription deletion
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription, context: any): Promise<void> {
  try {
    const dbSubscription = await context.entities.WineSubscription.findFirst({
      where: { stripeSubscriptionId: subscription.id },
    });

    if (dbSubscription) {
      await context.entities.WineSubscription.update({
        where: { id: dbSubscription.id },
        data: {
          status: 'cancelled',
          endDate: new Date(),
        },
      });

      // Update user's subscription status
      await context.entities.User.update({
        where: { id: dbSubscription.memberId },
        data: { subscriptionStatus: 'cancelled' },
      });

      // Send cancellation email
      await sendCancellationEmail(dbSubscription.memberId, subscription, context);
    }

    console.log(`Subscription cancelled: ${subscription.id}`);
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
    throw error;
  }
}

/**
 * Handle payment method attachment
 */
async function handlePaymentMethodAttached(paymentMethod: Stripe.PaymentMethod, context: any): Promise<void> {
  try {
    // Update user's payment method information
    const user = await context.entities.User.findFirst({
      where: { paymentProcessorUserId: paymentMethod.customer as string },
    });

    if (user) {
      // Store payment method details (last 4 digits, brand, etc.)
      const paymentMethodData = {
        id: paymentMethod.id,
        type: paymentMethod.type,
        card: paymentMethod.card ? {
          brand: paymentMethod.card.brand,
          last4: paymentMethod.card.last4,
          expMonth: paymentMethod.card.exp_month,
          expYear: paymentMethod.card.exp_year,
        } : null,
      };

      // You might want to store this in a separate PaymentMethod entity
      console.log(`Payment method attached for user: ${user.id}`);
    }
  } catch (error) {
    console.error('Error handling payment method attached:', error);
    throw error;
  }
}

/**
 * Handle payment method detachment
 */
async function handlePaymentMethodDetached(paymentMethod: Stripe.PaymentMethod, context: any): Promise<void> {
  try {
    // Handle payment method removal
    console.log(`Payment method detached: ${paymentMethod.id}`);
  } catch (error) {
    console.error('Error handling payment method detached:', error);
    throw error;
  }
}

// Email notification functions (stubs - implement with your email service)
async function sendWelcomeEmail(userId: string, subscription: any, context: any): Promise<void> {
  // TODO: Implement with your email service (SendGrid, Mailgun, etc.)
  console.log(`Welcome email sent to user: ${userId}`);
}

async function sendPaymentConfirmationEmail(userId: string, invoice: Stripe.Invoice, context: any): Promise<void> {
  // TODO: Implement with your email service
  console.log(`Payment confirmation email sent to user: ${userId}`);
}

async function sendPaymentFailureEmail(userId: string, invoice: Stripe.Invoice, context: any): Promise<void> {
  // TODO: Implement with your email service
  console.log(`Payment failure email sent to user: ${userId}`);
}

async function sendCancellationEmail(userId: string, subscription: Stripe.Subscription, context: any): Promise<void> {
  // TODO: Implement with your email service
  console.log(`Cancellation email sent to user: ${userId}`);
}

/**
 * Verify webhook signature
 */
export const verifyWebhookSignature = (payload: string, signature: string): Stripe.Event => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!endpointSecret) {
    throw new HttpError(500, 'Webhook secret not configured');
  }

  try {
    return stripe.webhooks.constructEvent(payload, signature, endpointSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw new HttpError(400, 'Invalid webhook signature');
  }
};

/**
 * Process webhook with signature verification
 */
export const processWebhook = async (payload: string, signature: string, context: any): Promise<void> => {
  const event = verifyWebhookSignature(payload, signature);
  await handleStripeWebhook(event, context);
}; 