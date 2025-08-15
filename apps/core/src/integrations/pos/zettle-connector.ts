import { BasePOSConnector, POSConnectorConfig, POSCustomer, POSSubscription, POSPayment, POSProduct } from './base-connector';

export class ZettleConnector extends BasePOSConnector {
  private baseUrl: string;

  constructor(config: POSConnectorConfig) {
    super(config);
    this.baseUrl = config.environment === 'production' 
      ? 'https://api.zettle.com/v1'
      : 'https://api.zettle.com/v1'; // Zettle uses same URL for sandbox/production
    this.validateConfig();
  }

  async createCustomer(customer: Omit<POSCustomer, 'id'>): Promise<POSCustomer> {
    try {
      // Zettle doesn't have native customer management, so we'll create a custom customer record
      const customerId = this.generateId();
      
      // Store customer data in Zettle's custom fields or external system
      const response = await this.makeRequest('/customers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: customerId,
          name: `${customer.firstName} ${customer.lastName}`.trim(),
          email: customer.email,
          phone: customer.phone,
          address: customer.address ? {
            address1: customer.address.line1,
            address2: customer.address.line2,
            city: customer.address.city,
            state: customer.address.state,
            postalCode: customer.address.postalCode,
            country: customer.address.country,
          } : undefined,
          metadata: customer.metadata,
        }),
      });

      return {
        id: customerId,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        address: customer.address,
        metadata: customer.metadata,
      };
    } catch (error) {
      this.handleError(error, 'create Zettle customer');
    }
  }

  async getCustomer(customerId: string): Promise<POSCustomer | null> {
    try {
      const response = await this.makeRequest(`/customers/${customerId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.customer) return null;

      const [firstName, ...lastNameParts] = (response.customer.name || '').split(' ');
      const lastName = lastNameParts.join(' ');

      return {
        id: response.customer.id,
        email: response.customer.email,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phone: response.customer.phone,
        address: response.customer.address ? {
          line1: response.customer.address.address1,
          line2: response.customer.address.address2,
          city: response.customer.address.city,
          state: response.customer.address.state,
          postalCode: response.customer.address.postalCode,
          country: response.customer.address.country,
        } : undefined,
        metadata: response.customer.metadata,
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) return null;
      this.handleError(error, 'get Zettle customer');
    }
  }

  async updateCustomer(customerId: string, updates: Partial<POSCustomer>): Promise<POSCustomer> {
    try {
      const response = await this.makeRequest(`/customers/${customerId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          name: updates.firstName && updates.lastName ? 
            `${updates.firstName} ${updates.lastName}` : undefined,
          email: updates.email,
          phone: updates.phone,
          address: updates.address ? {
            address1: updates.address.line1,
            address2: updates.address.line2,
            city: updates.address.city,
            state: updates.address.state,
            postalCode: updates.address.postalCode,
            country: updates.address.country,
          } : undefined,
          metadata: updates.metadata,
        }),
      });

      const [firstName, ...lastNameParts] = (response.customer.name || '').split(' ');
      const lastName = lastNameParts.join(' ');

      return {
        id: response.customer.id,
        email: response.customer.email,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phone: response.customer.phone,
        address: response.customer.address ? {
          line1: response.customer.address.address1,
          line2: response.customer.address.address2,
          city: response.customer.address.city,
          state: response.customer.address.state,
          postalCode: response.customer.address.postalCode,
          country: response.customer.address.country,
        } : undefined,
        metadata: response.customer.metadata,
      };
    } catch (error) {
      this.handleError(error, 'update Zettle customer');
    }
  }

  async deleteCustomer(customerId: string): Promise<boolean> {
    try {
      await this.makeRequest(`/customers/${customerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });
      return true;
    } catch (error) {
      this.handleError(error, 'delete Zettle customer');
    }
  }

  async createSubscription(subscription: Omit<POSSubscription, 'id'>): Promise<POSSubscription> {
    try {
      // Zettle doesn't have native subscriptions, so we'll create a recurring product
      const subscriptionId = this.generateId();
      
      const response = await this.makeRequest('/subscriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          id: subscriptionId,
          customerId: subscription.customerId,
          amount: Math.round(subscription.amount * 100), // Convert to cents
          currency: subscription.currency,
          interval: subscription.interval,
          nextBillingDate: subscription.nextBillingDate.toISOString(),
          status: subscription.status,
          metadata: subscription.metadata,
        }),
      });

      return {
        id: subscriptionId,
        customerId: subscription.customerId,
        status: subscription.status,
        amount: subscription.amount,
        currency: subscription.currency,
        interval: subscription.interval,
        nextBillingDate: subscription.nextBillingDate,
        metadata: subscription.metadata,
      };
    } catch (error) {
      this.handleError(error, 'create Zettle subscription');
    }
  }

  async getSubscription(subscriptionId: string): Promise<POSSubscription | null> {
    try {
      const response = await this.makeRequest(`/subscriptions/${subscriptionId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.subscription) return null;

      return {
        id: response.subscription.id,
        customerId: response.subscription.customerId,
        status: this.mapZettleStatus(response.subscription.status),
        amount: response.subscription.amount / 100, // Convert from cents
        currency: response.subscription.currency,
        interval: response.subscription.interval,
        nextBillingDate: new Date(response.subscription.nextBillingDate),
        metadata: response.subscription.metadata,
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) return null;
      this.handleError(error, 'get Zettle subscription');
    }
  }

  async updateSubscription(subscriptionId: string, updates: Partial<POSSubscription>): Promise<POSSubscription> {
    try {
      const response = await this.makeRequest(`/subscriptions/${subscriptionId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          amount: updates.amount ? Math.round(updates.amount * 100) : undefined,
          currency: updates.currency,
          interval: updates.interval,
          nextBillingDate: updates.nextBillingDate?.toISOString(),
          status: updates.status,
          metadata: updates.metadata,
        }),
      });

      return {
        id: response.subscription.id,
        customerId: response.subscription.customerId,
        status: this.mapZettleStatus(response.subscription.status),
        amount: response.subscription.amount / 100,
        currency: response.subscription.currency,
        interval: response.subscription.interval,
        nextBillingDate: new Date(response.subscription.nextBillingDate),
        metadata: response.subscription.metadata,
      };
    } catch (error) {
      this.handleError(error, 'update Zettle subscription');
    }
  }

  async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd: boolean = true): Promise<POSSubscription> {
    try {
      const response = await this.makeRequest(`/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          cancelAtPeriodEnd,
          canceledDate: cancelAtPeriodEnd ? undefined : new Date().toISOString(),
        }),
      });

      return {
        id: response.subscription.id,
        customerId: response.subscription.customerId,
        status: this.mapZettleStatus(response.subscription.status),
        amount: response.subscription.amount / 100,
        currency: response.subscription.currency,
        interval: response.subscription.interval,
        nextBillingDate: new Date(response.subscription.nextBillingDate),
        metadata: response.subscription.metadata,
      };
    } catch (error) {
      this.handleError(error, 'cancel Zettle subscription');
    }
  }

  async capturePayment(paymentId: string): Promise<POSPayment> {
    try {
      const response = await this.makeRequest(`/payments/${paymentId}/capture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      return {
        id: response.payment.id,
        amount: response.payment.amount / 100, // Convert from cents
        currency: response.payment.currency,
        status: this.mapPaymentStatus(response.payment.status),
        paymentMethod: response.payment.paymentMethod || 'unknown',
        customerId: response.payment.customerId,
        subscriptionId: response.payment.subscriptionId,
        metadata: response.payment.metadata,
      };
    } catch (error) {
      this.handleError(error, 'capture Zettle payment');
    }
  }

  async getPayment(paymentId: string): Promise<POSPayment | null> {
    try {
      const response = await this.makeRequest(`/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.payment) return null;

      return {
        id: response.payment.id,
        amount: response.payment.amount / 100,
        currency: response.payment.currency,
        status: this.mapPaymentStatus(response.payment.status),
        paymentMethod: response.payment.paymentMethod || 'unknown',
        customerId: response.payment.customerId,
        subscriptionId: response.payment.subscriptionId,
        metadata: response.payment.metadata,
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) return null;
      this.handleError(error, 'get Zettle payment');
    }
  }

  async refundPayment(paymentId: string, amount?: number): Promise<POSPayment> {
    try {
      const response = await this.makeRequest(`/payments/${paymentId}/refund`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          amount: amount ? Math.round(amount * 100) : undefined,
        }),
      });

      // Return the original payment with refund information
      const payment = await this.getPayment(paymentId);
      if (!payment) throw new Error('Payment not found after refund');

      return {
        ...payment,
        metadata: {
          ...payment.metadata,
          refundId: response.refund.id,
          refundAmount: amount?.toString() || '0',
        },
      };
    } catch (error) {
      this.handleError(error, 'refund Zettle payment');
    }
  }

  async createProduct(product: Omit<POSProduct, 'id'>): Promise<POSProduct> {
    try {
      const response = await this.makeRequest('/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          name: product.name,
          description: product.description,
          price: Math.round(product.price * 100), // Convert to cents
          currency: product.currency,
          inventoryQuantity: product.inventoryQuantity,
          metadata: product.metadata,
        }),
      });

      return {
        id: response.product.id,
        name: response.product.name,
        description: response.product.description,
        price: response.product.price / 100,
        currency: response.product.currency,
        inventoryQuantity: response.product.inventoryQuantity,
        metadata: response.product.metadata,
      };
    } catch (error) {
      this.handleError(error, 'create Zettle product');
    }
  }

  async getProduct(productId: string): Promise<POSProduct | null> {
    try {
      const response = await this.makeRequest(`/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.product) return null;

      return {
        id: response.product.id,
        name: response.product.name,
        description: response.product.description,
        price: response.product.price / 100,
        currency: response.product.currency,
        inventoryQuantity: response.product.inventoryQuantity,
        metadata: response.product.metadata,
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) return null;
      this.handleError(error, 'get Zettle product');
    }
  }

  async updateProduct(productId: string, updates: Partial<POSProduct>): Promise<POSProduct> {
    try {
      const response = await this.makeRequest(`/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          name: updates.name,
          description: updates.description,
          price: updates.price ? Math.round(updates.price * 100) : undefined,
          currency: updates.currency,
          inventoryQuantity: updates.inventoryQuantity,
          metadata: updates.metadata,
        }),
      });

      return {
        id: response.product.id,
        name: response.product.name,
        description: response.product.description,
        price: response.product.price / 100,
        currency: response.product.currency,
        inventoryQuantity: response.product.inventoryQuantity,
        metadata: response.product.metadata,
      };
    } catch (error) {
      this.handleError(error, 'update Zettle product');
    }
  }

  async updateInventory(productId: string, quantity: number): Promise<POSProduct> {
    try {
      const response = await this.makeRequest(`/products/${productId}/inventory`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          quantity,
        }),
      });

      return {
        id: response.product.id,
        name: response.product.name,
        description: response.product.description,
        price: response.product.price / 100,
        currency: response.product.currency,
        inventoryQuantity: quantity,
        metadata: response.product.metadata,
      };
    } catch (error) {
      this.handleError(error, 'update Zettle inventory');
    }
  }

  async verifyWebhook(payload: string, signature: string): Promise<boolean> {
    // Zettle webhook verification would go here
    // For now, return true as a placeholder
    return true;
  }

  async parseWebhookEvent(payload: string): Promise<any> {
    try {
      return JSON.parse(payload);
    } catch (error) {
      this.handleError(error, 'parse Zettle webhook');
    }
  }

  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; details?: string }> {
    try {
      await this.makeRequest('/health', {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });
      return { status: 'healthy' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { status: 'unhealthy', details: errorMessage };
    }
  }

  // Helper methods
  private mapZettleStatus(zettleStatus: string): 'active' | 'canceled' | 'past_due' | 'unpaid' {
    switch (zettleStatus) {
      case 'ACTIVE': return 'active';
      case 'CANCELED': return 'canceled';
      case 'PAST_DUE': return 'past_due';
      case 'UNPAID': return 'unpaid';
      default: return 'unpaid';
    }
  }

  private mapPaymentStatus(zettleStatus: string): 'succeeded' | 'failed' | 'pending' {
    switch (zettleStatus) {
      case 'COMPLETED': return 'succeeded';
      case 'FAILED': return 'failed';
      case 'PENDING': return 'pending';
      default: return 'pending';
    }
  }
} 