export interface POSCustomer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  metadata?: Record<string, string>;
}

export interface POSSubscription {
  id: string;
  customerId: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  nextBillingDate: Date;
  metadata?: Record<string, string>;
}

export interface POSPayment {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'failed' | 'pending';
  paymentMethod: string;
  customerId: string;
  subscriptionId?: string;
  metadata?: Record<string, string>;
}

export interface POSProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  inventoryQuantity?: number;
  metadata?: Record<string, string>;
}

export interface POSConnectorConfig {
  apiKey: string;
  apiSecret?: string;
  environment: 'sandbox' | 'production';
  webhookSecret?: string;
  baseUrl?: string;
  metadata?: {
    locationId?: string;
    accountId?: string;
  };
}

export interface POSConnector {
  // Customer Management
  createCustomer(customer: Omit<POSCustomer, 'id'>): Promise<POSCustomer>;
  getCustomer(customerId: string): Promise<POSCustomer | null>;
  updateCustomer(customerId: string, updates: Partial<POSCustomer>): Promise<POSCustomer>;
  deleteCustomer(customerId: string): Promise<boolean>;

  // Subscription Management
  createSubscription(subscription: Omit<POSSubscription, 'id'>): Promise<POSSubscription>;
  getSubscription(subscriptionId: string): Promise<POSSubscription | null>;
  updateSubscription(subscriptionId: string, updates: Partial<POSSubscription>): Promise<POSSubscription>;
  cancelSubscription(subscriptionId: string, cancelAtPeriodEnd?: boolean): Promise<POSSubscription>;

  // Payment Management
  capturePayment(paymentId: string): Promise<POSPayment>;
  getPayment(paymentId: string): Promise<POSPayment | null>;
  refundPayment(paymentId: string, amount?: number): Promise<POSPayment>;

  // Product Management
  createProduct(product: Omit<POSProduct, 'id'>): Promise<POSProduct>;
  getProduct(productId: string): Promise<POSProduct | null>;
  updateProduct(productId: string, updates: Partial<POSProduct>): Promise<POSProduct>;
  updateInventory(productId: string, quantity: number): Promise<POSProduct>;

  // Webhook Handling
  verifyWebhook(payload: string, signature: string): Promise<boolean>;
  parseWebhookEvent(payload: string): Promise<any>;

  // Health Check
  healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; details?: string }>;
}

export abstract class BasePOSConnector implements POSConnector {
  protected config: POSConnectorConfig;

  constructor(config: POSConnectorConfig) {
    this.config = config;
  }

  // Abstract methods that must be implemented by each POS provider
  abstract createCustomer(customer: Omit<POSCustomer, 'id'>): Promise<POSCustomer>;
  abstract getCustomer(customerId: string): Promise<POSCustomer | null>;
  abstract updateCustomer(customerId: string, updates: Partial<POSCustomer>): Promise<POSCustomer>;
  abstract deleteCustomer(customerId: string): Promise<boolean>;
  abstract createSubscription(subscription: Omit<POSSubscription, 'id'>): Promise<POSSubscription>;
  abstract getSubscription(subscriptionId: string): Promise<POSSubscription | null>;
  abstract updateSubscription(subscriptionId: string, updates: Partial<POSSubscription>): Promise<POSSubscription>;
  abstract cancelSubscription(subscriptionId: string, cancelAtPeriodEnd?: boolean): Promise<POSSubscription>;
  abstract capturePayment(paymentId: string): Promise<POSPayment>;
  abstract getPayment(paymentId: string): Promise<POSPayment | null>;
  abstract refundPayment(paymentId: string, amount?: number): Promise<POSPayment>;
  abstract createProduct(product: Omit<POSProduct, 'id'>): Promise<POSProduct>;
  abstract getProduct(productId: string): Promise<POSProduct | null>;
  abstract updateProduct(productId: string, updates: Partial<POSProduct>): Promise<POSProduct>;
  abstract updateInventory(productId: string, quantity: number): Promise<POSProduct>;
  abstract verifyWebhook(payload: string, signature: string): Promise<boolean>;
  abstract parseWebhookEvent(payload: string): Promise<any>;
  abstract healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; details?: string }>;

  // Common utility methods
  protected generateId(): string {
    return `pos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  protected validateConfig(): void {
    if (!this.config.apiKey) {
      throw new Error('API key is required for POS connector');
    }
  }

  protected async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`POS API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  protected handleError(error: unknown, operation: string): never {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to ${operation}: ${errorMessage}`);
  }
} 