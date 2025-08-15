import { BasePOSConnector, POSConnectorConfig, POSCustomer, POSSubscription, POSPayment, POSProduct } from './base-connector';

export class SquareConnector extends BasePOSConnector {
  private baseUrl: string;

  constructor(config: POSConnectorConfig) {
    super(config);
    this.baseUrl = config.environment === 'production' 
      ? 'https://connect.squareup.com/v2'
      : 'https://connect.squareupsandbox.com/v2';
    this.validateConfig();
  }

  async createCustomer(customer: Omit<POSCustomer, 'id'>): Promise<POSCustomer> {
    try {
      const response = await this.makeRequest('/customers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          given_name: customer.firstName,
          family_name: customer.lastName,
          email_address: customer.email,
          phone_number: customer.phone,
          address: customer.address ? {
            address_line_1: customer.address.line1,
            address_line_2: customer.address.line2,
            locality: customer.address.city,
            administrative_district_level_1: customer.address.state,
            postal_code: customer.address.postalCode,
            country: customer.address.country,
          } : undefined,
        }),
      });

      return {
        id: response.customer.id,
        email: response.customer.email_address,
        firstName: response.customer.given_name,
        lastName: response.customer.family_name,
        phone: response.customer.phone_number,
        address: response.customer.address ? {
          line1: response.customer.address.address_line_1,
          line2: response.customer.address.address_line_2,
          city: response.customer.address.locality,
          state: response.customer.address.administrative_district_level_1,
          postalCode: response.customer.address.postal_code,
          country: response.customer.address.country,
        } : undefined,
        metadata: response.customer.reference_id ? { referenceId: response.customer.reference_id } : undefined,
      };
    } catch (error) {
      this.handleError(error, 'create Square customer');
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

      return {
        id: response.customer.id,
        email: response.customer.email_address,
        firstName: response.customer.given_name,
        lastName: response.customer.family_name,
        phone: response.customer.phone_number,
        address: response.customer.address ? {
          line1: response.customer.address.address_line_1,
          line2: response.customer.address.address_line_2,
          city: response.customer.address.locality,
          state: response.customer.address.administrative_district_level_1,
          postalCode: response.customer.address.postal_code,
          country: response.customer.address.country,
        } : undefined,
        metadata: response.customer.reference_id ? { referenceId: response.customer.reference_id } : undefined,
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) return null;
      this.handleError(error, 'get Square customer');
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
          given_name: updates.firstName,
          family_name: updates.lastName,
          email_address: updates.email,
          phone_number: updates.phone,
          address: updates.address ? {
            address_line_1: updates.address.line1,
            address_line_2: updates.address.line2,
            locality: updates.address.city,
            administrative_district_level_1: updates.address.state,
            postal_code: updates.address.postalCode,
            country: updates.address.country,
          } : undefined,
        }),
      });

      return {
        id: response.customer.id,
        email: response.customer.email_address,
        firstName: response.customer.given_name,
        lastName: response.customer.family_name,
        phone: response.customer.phone_number,
        address: response.customer.address ? {
          line1: response.customer.address.address_line_1,
          line2: response.customer.address.address_line_2,
          city: response.customer.address.locality,
          state: response.customer.address.administrative_district_level_1,
          postalCode: response.customer.address.postal_code,
          country: response.customer.address.country,
        } : undefined,
        metadata: response.customer.reference_id ? { referenceId: response.customer.reference_id } : undefined,
      };
    } catch (error) {
      this.handleError(error, 'update Square customer');
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
      this.handleError(error, 'delete Square customer');
    }
  }

  async createSubscription(subscription: Omit<POSSubscription, 'id'>): Promise<POSSubscription> {
    try {
      // Square doesn't have native subscriptions, so we'll create a catalog item and use it for billing
      const response = await this.makeRequest('/subscriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          idempotency_key: this.generateId(),
          location_id: this.config.metadata?.locationId,
          plan_id: subscription.metadata?.planId,
          customer_id: subscription.customerId,
          start_date: subscription.nextBillingDate.toISOString(),
          card_id: subscription.metadata?.cardId,
        }),
      });

      return {
        id: response.subscription.id,
        customerId: response.subscription.customer_id,
        status: this.mapSquareStatus(response.subscription.status),
        amount: response.subscription.plan_variation_id ? 
          (await this.getPlanVariationPrice(response.subscription.plan_variation_id)) : subscription.amount,
        currency: response.subscription.currency || 'EUR',
        interval: 'month', // Square subscriptions are typically monthly
        nextBillingDate: new Date(response.subscription.start_date),
        metadata: {
          planId: response.subscription.plan_id,
          planVariationId: response.subscription.plan_variation_id,
        },
      };
    } catch (error) {
      this.handleError(error, 'create Square subscription');
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
        customerId: response.subscription.customer_id,
        status: this.mapSquareStatus(response.subscription.status),
        amount: response.subscription.plan_variation_id ? 
          (await this.getPlanVariationPrice(response.subscription.plan_variation_id)) : 0,
        currency: response.subscription.currency || 'EUR',
        interval: 'month',
        nextBillingDate: new Date(response.subscription.start_date),
        metadata: {
          planId: response.subscription.plan_id,
          planVariationId: response.subscription.plan_variation_id,
        },
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) return null;
      this.handleError(error, 'get Square subscription');
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
          start_date: updates.nextBillingDate?.toISOString(),
          card_id: updates.metadata?.cardId,
        }),
      });

      return {
        id: response.subscription.id,
        customerId: response.subscription.customer_id,
        status: this.mapSquareStatus(response.subscription.status),
        amount: response.subscription.plan_variation_id ? 
          (await this.getPlanVariationPrice(response.subscription.plan_variation_id)) : 0,
        currency: response.subscription.currency || 'EUR',
        interval: 'month',
        nextBillingDate: new Date(response.subscription.start_date),
        metadata: {
          planId: response.subscription.plan_id,
          planVariationId: response.subscription.plan_variation_id,
        },
      };
    } catch (error) {
      this.handleError(error, 'update Square subscription');
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
          canceled_date: cancelAtPeriodEnd ? undefined : new Date().toISOString(),
        }),
      });

      return {
        id: response.subscription.id,
        customerId: response.subscription.customer_id,
        status: this.mapSquareStatus(response.subscription.status),
        amount: response.subscription.plan_variation_id ? 
          (await this.getPlanVariationPrice(response.subscription.plan_variation_id)) : 0,
        currency: response.subscription.currency || 'EUR',
        interval: 'month',
        nextBillingDate: new Date(response.subscription.start_date),
        metadata: {
          planId: response.subscription.plan_id,
          planVariationId: response.subscription.plan_variation_id,
        },
      };
    } catch (error) {
      this.handleError(error, 'cancel Square subscription');
    }
  }

  async capturePayment(paymentId: string): Promise<POSPayment> {
    try {
      const response = await this.makeRequest(`/payments/${paymentId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      return {
        id: response.payment.id,
        amount: response.payment.amount_money.amount / 100, // Convert from cents
        currency: response.payment.amount_money.currency,
        status: this.mapPaymentStatus(response.payment.status),
        paymentMethod: response.payment.card_details?.card?.card_brand || 'unknown',
        customerId: response.payment.customer_id,
        subscriptionId: response.payment.order_id, // Square uses order_id for subscription references
        metadata: {
          locationId: response.payment.location_id,
          orderId: response.payment.order_id,
        },
      };
    } catch (error) {
      this.handleError(error, 'capture Square payment');
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
        amount: response.payment.amount_money.amount / 100,
        currency: response.payment.amount_money.currency,
        status: this.mapPaymentStatus(response.payment.status),
        paymentMethod: response.payment.card_details?.card?.card_brand || 'unknown',
        customerId: response.payment.customer_id,
        subscriptionId: response.payment.order_id,
        metadata: {
          locationId: response.payment.location_id,
          orderId: response.payment.order_id,
        },
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) return null;
      this.handleError(error, 'get Square payment');
    }
  }

  async refundPayment(paymentId: string, amount?: number): Promise<POSPayment> {
    try {
      const response = await this.makeRequest(`/refunds`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          idempotency_key: this.generateId(),
          payment_id: paymentId,
          amount_money: amount ? {
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'EUR',
          } : undefined,
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
      this.handleError(error, 'refund Square payment');
    }
  }

  async createProduct(product: Omit<POSProduct, 'id'>): Promise<POSProduct> {
    try {
      const response = await this.makeRequest('/catalog/objects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          idempotency_key: this.generateId(),
          object: {
            type: 'ITEM',
            id: `#${this.generateId()}`,
            item_data: {
              name: product.name,
              description: product.description,
              variations: [
                {
                  type: 'ITEM_VARIATION',
                  id: `#${this.generateId()}`,
                  item_variation_data: {
                    item_id: `#${this.generateId()}`,
                    name: 'Regular',
                    pricing_type: 'FIXED_PRICING',
                    price_money: {
                      amount: Math.round(product.price * 100), // Convert to cents
                      currency: product.currency,
                    },
                    track_inventory: product.inventoryQuantity !== undefined,
                    stockable_quantity: product.inventoryQuantity,
                  },
                },
              ],
            },
          },
        }),
      });

      return {
        id: response.catalog_object.id,
        name: response.catalog_object.item_data.name,
        description: response.catalog_object.item_data.description,
        price: response.catalog_object.item_data.variations[0].item_variation_data.price_money.amount / 100,
        currency: response.catalog_object.item_data.variations[0].item_variation_data.price_money.currency,
        inventoryQuantity: response.catalog_object.item_data.variations[0].item_variation_data.stockable_quantity,
        metadata: {
          catalogObjectId: response.catalog_object.id,
          variationId: response.catalog_object.item_data.variations[0].id,
        },
      };
    } catch (error) {
      this.handleError(error, 'create Square product');
    }
  }

  async getProduct(productId: string): Promise<POSProduct | null> {
    try {
      const response = await this.makeRequest(`/catalog/objects/${productId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.catalog_object || response.catalog_object.type !== 'ITEM') return null;

      const variation = response.catalog_object.item_data.variations[0];
      return {
        id: response.catalog_object.id,
        name: response.catalog_object.item_data.name,
        description: response.catalog_object.item_data.description,
        price: variation.item_variation_data.price_money.amount / 100,
        currency: variation.item_variation_data.price_money.currency,
        inventoryQuantity: variation.item_variation_data.stockable_quantity,
        metadata: {
          catalogObjectId: response.catalog_object.id,
          variationId: variation.id,
        },
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) return null;
      this.handleError(error, 'get Square product');
    }
  }

  async updateProduct(productId: string, updates: Partial<POSProduct>): Promise<POSProduct> {
    try {
      const currentProduct = await this.getProduct(productId);
      if (!currentProduct) throw new Error('Product not found');

      const response = await this.makeRequest(`/catalog/objects/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          idempotency_key: this.generateId(),
          object: {
            type: 'ITEM',
            id: productId,
            item_data: {
              name: updates.name || currentProduct.name,
              description: updates.description || currentProduct.description,
              variations: [
                {
                  type: 'ITEM_VARIATION',
                  id: currentProduct.metadata?.variationId,
                  item_variation_data: {
                    item_id: productId,
                    name: 'Regular',
                    pricing_type: 'FIXED_PRICING',
                    price_money: {
                      amount: Math.round((updates.price || currentProduct.price) * 100),
                      currency: updates.currency || currentProduct.currency,
                    },
                    track_inventory: updates.inventoryQuantity !== undefined,
                    stockable_quantity: updates.inventoryQuantity || currentProduct.inventoryQuantity,
                  },
                },
              ],
            },
          },
        }),
      });

      return {
        id: response.catalog_object.id,
        name: response.catalog_object.item_data.name,
        description: response.catalog_object.item_data.description,
        price: response.catalog_object.item_data.variations[0].item_variation_data.price_money.amount / 100,
        currency: response.catalog_object.item_data.variations[0].item_variation_data.price_money.currency,
        inventoryQuantity: response.catalog_object.item_data.variations[0].item_variation_data.stockable_quantity,
        metadata: {
          catalogObjectId: response.catalog_object.id,
          variationId: response.catalog_object.item_data.variations[0].id,
        },
      };
    } catch (error) {
      this.handleError(error, 'update Square product');
    }
  }

  async updateInventory(productId: string, quantity: number): Promise<POSProduct> {
    try {
      const currentProduct = await this.getProduct(productId);
      if (!currentProduct) throw new Error('Product not found');

      const response = await this.makeRequest('/inventory/adjustments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          idempotency_key: this.generateId(),
          adjustment: {
            catalog_object_id: productId,
            location_id: this.config.metadata?.locationId,
            quantity: quantity.toString(),
            from_state: 'IN_STOCK',
            to_state: 'IN_STOCK',
            occurred_at: new Date().toISOString(),
          },
        }),
      });

      return {
        ...currentProduct,
        inventoryQuantity: quantity,
      };
    } catch (error) {
      this.handleError(error, 'update Square inventory');
    }
  }

  async verifyWebhook(payload: string, signature: string): Promise<boolean> {
    // Square webhook verification would go here
    // For now, return true as a placeholder
    return true;
  }

  async parseWebhookEvent(payload: string): Promise<any> {
    try {
      return JSON.parse(payload);
    } catch (error) {
      this.handleError(error, 'parse Square webhook');
    }
  }

  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; details?: string }> {
    try {
      await this.makeRequest('/locations', {
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
  private mapSquareStatus(squareStatus: string): 'active' | 'canceled' | 'past_due' | 'unpaid' {
    switch (squareStatus) {
      case 'ACTIVE': return 'active';
      case 'CANCELED': return 'canceled';
      case 'PAST_DUE': return 'past_due';
      case 'UNPAID': return 'unpaid';
      default: return 'unpaid';
    }
  }

  private mapPaymentStatus(squareStatus: string): 'succeeded' | 'failed' | 'pending' {
    switch (squareStatus) {
      case 'COMPLETED': return 'succeeded';
      case 'FAILED': return 'failed';
      case 'PENDING': return 'pending';
      default: return 'pending';
    }
  }

  private async getPlanVariationPrice(planVariationId: string): Promise<number> {
    try {
      const response = await this.makeRequest(`/catalog/objects/${planVariationId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });
      return response.catalog_object.subscription_plan_data.phases[0].recurring_price_money.amount / 100;
    } catch (error) {
      return 0;
    }
  }
} 