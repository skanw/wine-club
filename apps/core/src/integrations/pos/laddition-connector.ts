import { BasePOSConnector, POSConnectorConfig, POSCustomer, POSSubscription, POSPayment, POSProduct } from './base-connector';

export class LAdditionConnector extends BasePOSConnector {
  private baseUrl: string;

  constructor(config: POSConnectorConfig) {
    super(config);
    this.baseUrl = config.environment === 'production' 
      ? 'https://api.laddition.fr/v1'
      : 'https://api-sandbox.laddition.fr/v1';
    this.validateConfig();
  }

  async createCustomer(customer: Omit<POSCustomer, 'id'>): Promise<POSCustomer> {
    try {
      const response = await this.makeRequest('/customers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: customer.lastName,
          prenom: customer.firstName,
          email: customer.email,
          telephone: customer.phone,
          adresse: customer.address ? {
            rue: customer.address.line1,
            complement: customer.address.line2,
            ville: customer.address.city,
            code_postal: customer.address.postalCode,
            pays: customer.address.country,
          } : undefined,
        }),
      });

      return {
        id: response.customer.id,
        email: response.customer.email,
        firstName: response.customer.prenom,
        lastName: response.customer.nom,
        phone: response.customer.telephone,
        address: response.customer.adresse ? {
          line1: response.customer.adresse.rue,
          line2: response.customer.adresse.complement,
          city: response.customer.adresse.ville,
          postalCode: response.customer.adresse.code_postal,
          country: response.customer.adresse.pays,
        } : undefined,
        metadata: response.customer.reference_id ? { referenceId: response.customer.reference_id } : undefined,
      };
    } catch (error) {
      this.handleError(error, 'create L\'Addition customer');
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
        email: response.customer.email,
        firstName: response.customer.prenom,
        lastName: response.customer.nom,
        phone: response.customer.telephone,
        address: response.customer.adresse ? {
          line1: response.customer.adresse.rue,
          line2: response.customer.adresse.complement,
          city: response.customer.adresse.ville,
          postalCode: response.customer.adresse.code_postal,
          country: response.customer.adresse.pays,
        } : undefined,
        metadata: response.customer.reference_id ? { referenceId: response.customer.reference_id } : undefined,
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) return null;
      this.handleError(error, 'get L\'Addition customer');
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
          nom: updates.lastName,
          prenom: updates.firstName,
          email: updates.email,
          telephone: updates.phone,
          adresse: updates.address ? {
            rue: updates.address.line1,
            complement: updates.address.line2,
            ville: updates.address.city,
            code_postal: updates.address.postalCode,
            pays: updates.address.country,
          } : undefined,
        }),
      });

      return {
        id: response.customer.id,
        email: response.customer.email,
        firstName: response.customer.prenom,
        lastName: response.customer.nom,
        phone: response.customer.telephone,
        address: response.customer.adresse ? {
          line1: response.customer.adresse.rue,
          line2: response.customer.adresse.complement,
          city: response.customer.adresse.ville,
          postalCode: response.customer.adresse.code_postal,
          country: response.customer.adresse.pays,
        } : undefined,
        metadata: response.customer.reference_id ? { referenceId: response.customer.reference_id } : undefined,
      };
    } catch (error) {
      this.handleError(error, 'update L\'Addition customer');
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
      this.handleError(error, 'delete L\'Addition customer');
    }
  }

  async createSubscription(subscription: Omit<POSSubscription, 'id'>): Promise<POSSubscription> {
    try {
      const response = await this.makeRequest('/abonnements', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          client_id: subscription.customerId,
          montant: Math.round(subscription.amount * 100), // Convert to cents
          devise: subscription.currency,
          frequence: subscription.interval === 'month' ? 'mensuel' : 'annuel',
          date_debut: subscription.nextBillingDate.toISOString(),
          statut: subscription.status,
          metadata: subscription.metadata,
        }),
      });

      return {
        id: response.abonnement.id,
        customerId: response.abonnement.client_id,
        status: this.mapLAdditionStatus(response.abonnement.statut),
        amount: response.abonnement.montant / 100,
        currency: response.abonnement.devise,
        interval: response.abonnement.frequence === 'mensuel' ? 'month' : 'year',
        nextBillingDate: new Date(response.abonnement.date_debut),
        metadata: response.abonnement.metadata,
      };
    } catch (error) {
      this.handleError(error, 'create L\'Addition subscription');
    }
  }

  async getSubscription(subscriptionId: string): Promise<POSSubscription | null> {
    try {
      const response = await this.makeRequest(`/abonnements/${subscriptionId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.abonnement) return null;

      return {
        id: response.abonnement.id,
        customerId: response.abonnement.client_id,
        status: this.mapLAdditionStatus(response.abonnement.statut),
        amount: response.abonnement.montant / 100,
        currency: response.abonnement.devise,
        interval: response.abonnement.frequence === 'mensuel' ? 'month' : 'year',
        nextBillingDate: new Date(response.abonnement.date_debut),
        metadata: response.abonnement.metadata,
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) return null;
      this.handleError(error, 'get L\'Addition subscription');
    }
  }

  async updateSubscription(subscriptionId: string, updates: Partial<POSSubscription>): Promise<POSSubscription> {
    try {
      const response = await this.makeRequest(`/abonnements/${subscriptionId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          montant: updates.amount ? Math.round(updates.amount * 100) : undefined,
          devise: updates.currency,
          frequence: updates.interval === 'month' ? 'mensuel' : 'annuel',
          date_debut: updates.nextBillingDate?.toISOString(),
          statut: updates.status,
          metadata: updates.metadata,
        }),
      });

      return {
        id: response.abonnement.id,
        customerId: response.abonnement.client_id,
        status: this.mapLAdditionStatus(response.abonnement.statut),
        amount: response.abonnement.montant / 100,
        currency: response.abonnement.devise,
        interval: response.abonnement.frequence === 'mensuel' ? 'month' : 'year',
        nextBillingDate: new Date(response.abonnement.date_debut),
        metadata: response.abonnement.metadata,
      };
    } catch (error) {
      this.handleError(error, 'update L\'Addition subscription');
    }
  }

  async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd: boolean = true): Promise<POSSubscription> {
    try {
      const response = await this.makeRequest(`/abonnements/${subscriptionId}/annuler`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          annuler_fin_periode: cancelAtPeriodEnd,
          date_annulation: cancelAtPeriodEnd ? undefined : new Date().toISOString(),
        }),
      });

      return {
        id: response.abonnement.id,
        customerId: response.abonnement.client_id,
        status: this.mapLAdditionStatus(response.abonnement.statut),
        amount: response.abonnement.montant / 100,
        currency: response.abonnement.devise,
        interval: response.abonnement.frequence === 'mensuel' ? 'month' : 'year',
        nextBillingDate: new Date(response.abonnement.date_debut),
        metadata: response.abonnement.metadata,
      };
    } catch (error) {
      this.handleError(error, 'cancel L\'Addition subscription');
    }
  }

  async capturePayment(paymentId: string): Promise<POSPayment> {
    try {
      const response = await this.makeRequest(`/paiements/${paymentId}/capturer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      return {
        id: response.paiement.id,
        amount: response.paiement.montant / 100,
        currency: response.paiement.devise,
        status: this.mapPaymentStatus(response.paiement.statut),
        paymentMethod: response.paiement.methode_paiement || 'unknown',
        customerId: response.paiement.client_id,
        subscriptionId: response.paiement.abonnement_id,
        metadata: response.paiement.metadata,
      };
    } catch (error) {
      this.handleError(error, 'capture L\'Addition payment');
    }
  }

  async getPayment(paymentId: string): Promise<POSPayment | null> {
    try {
      const response = await this.makeRequest(`/paiements/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.paiement) return null;

      return {
        id: response.paiement.id,
        amount: response.paiement.montant / 100,
        currency: response.paiement.devise,
        status: this.mapPaymentStatus(response.paiement.statut),
        paymentMethod: response.paiement.methode_paiement || 'unknown',
        customerId: response.paiement.client_id,
        subscriptionId: response.paiement.abonnement_id,
        metadata: response.paiement.metadata,
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) return null;
      this.handleError(error, 'get L\'Addition payment');
    }
  }

  async refundPayment(paymentId: string, amount?: number): Promise<POSPayment> {
    try {
      const response = await this.makeRequest(`/paiements/${paymentId}/rembourser`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          montant: amount ? Math.round(amount * 100) : undefined,
        }),
      });

      // Return the original payment with refund information
      const payment = await this.getPayment(paymentId);
      if (!payment) throw new Error('Payment not found after refund');

      return {
        ...payment,
        metadata: {
          ...payment.metadata,
          refundId: response.remboursement.id,
          refundAmount: amount?.toString() || '0',
        },
      };
    } catch (error) {
      this.handleError(error, 'refund L\'Addition payment');
    }
  }

  async createProduct(product: Omit<POSProduct, 'id'>): Promise<POSProduct> {
    try {
      const response = await this.makeRequest('/produits', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          nom: product.name,
          description: product.description,
          prix: Math.round(product.price * 100), // Convert to cents
          devise: product.currency,
          quantite_stock: product.inventoryQuantity,
          metadata: product.metadata,
        }),
      });

      return {
        id: response.produit.id,
        name: response.produit.nom,
        description: response.produit.description,
        price: response.produit.prix / 100,
        currency: response.produit.devise,
        inventoryQuantity: response.produit.quantite_stock,
        metadata: response.produit.metadata,
      };
    } catch (error) {
      this.handleError(error, 'create L\'Addition product');
    }
  }

  async getProduct(productId: string): Promise<POSProduct | null> {
    try {
      const response = await this.makeRequest(`/produits/${productId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.produit) return null;

      return {
        id: response.produit.id,
        name: response.produit.nom,
        description: response.produit.description,
        price: response.produit.prix / 100,
        currency: response.produit.devise,
        inventoryQuantity: response.produit.quantite_stock,
        metadata: response.produit.metadata,
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) return null;
      this.handleError(error, 'get L\'Addition product');
    }
  }

  async updateProduct(productId: string, updates: Partial<POSProduct>): Promise<POSProduct> {
    try {
      const response = await this.makeRequest(`/produits/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          nom: updates.name,
          description: updates.description,
          prix: updates.price ? Math.round(updates.price * 100) : undefined,
          devise: updates.currency,
          quantite_stock: updates.inventoryQuantity,
          metadata: updates.metadata,
        }),
      });

      return {
        id: response.produit.id,
        name: response.produit.nom,
        description: response.produit.description,
        price: response.produit.prix / 100,
        currency: response.produit.devise,
        inventoryQuantity: response.produit.quantite_stock,
        metadata: response.produit.metadata,
      };
    } catch (error) {
      this.handleError(error, 'update L\'Addition product');
    }
  }

  async updateInventory(productId: string, quantity: number): Promise<POSProduct> {
    try {
      const response = await this.makeRequest(`/produits/${productId}/stock`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          quantite: quantity,
        }),
      });

      return {
        id: response.produit.id,
        name: response.produit.nom,
        description: response.produit.description,
        price: response.produit.prix / 100,
        currency: response.produit.devise,
        inventoryQuantity: quantity,
        metadata: response.produit.metadata,
      };
    } catch (error) {
      this.handleError(error, 'update L\'Addition inventory');
    }
  }

  async verifyWebhook(payload: string, signature: string): Promise<boolean> {
    // L'Addition webhook verification would go here
    // For now, return true as a placeholder
    return true;
  }

  async parseWebhookEvent(payload: string): Promise<any> {
    try {
      return JSON.parse(payload);
    } catch (error) {
      this.handleError(error, 'parse L\'Addition webhook');
    }
  }

  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; details?: string }> {
    try {
      await this.makeRequest('/sante', {
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
  private mapLAdditionStatus(ladditionStatus: string): 'active' | 'canceled' | 'past_due' | 'unpaid' {
    switch (ladditionStatus) {
      case 'ACTIF': return 'active';
      case 'ANNULE': return 'canceled';
      case 'EN_RETARD': return 'past_due';
      case 'IMPAYE': return 'unpaid';
      default: return 'unpaid';
    }
  }

  private mapPaymentStatus(ladditionStatus: string): 'succeeded' | 'failed' | 'pending' {
    switch (ladditionStatus) {
      case 'TERMINE': return 'succeeded';
      case 'ECHOUE': return 'failed';
      case 'EN_ATTENTE': return 'pending';
      default: return 'pending';
    }
  }
} 