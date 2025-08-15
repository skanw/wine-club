import { HttpError } from 'wasp/server';

// Carrier API interfaces
interface CarrierConfig {
  apiKey: string;
  baseUrl: string;
  accountNumber?: string;
}

interface ShippingLabelRequest {
  fromAddress: {
    name: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  toAddress: {
    name: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  packages: Array<{
    weight: number; // in kg
    length: number; // in cm
    width: number;
    height: number;
    description: string;
  }>;
  service: string;
  reference?: string;
}

interface ShippingLabelResponse {
  trackingNumber: string;
  labelUrl: string;
  estimatedDelivery: Date;
  cost: number;
  carrier: string;
}

interface TrackingResponse {
  trackingNumber: string;
  status: string;
  events: Array<{
    timestamp: Date;
    location: string;
    description: string;
    status: string;
  }>;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
}

// Carrier implementations
class ChronopostCarrier {
  private config: CarrierConfig;

  constructor(config: CarrierConfig) {
    this.config = config;
  }

  async generateLabel(request: ShippingLabelRequest): Promise<ShippingLabelResponse> {
    try {
      // Chronopost API integration
      const response = await fetch(`${this.config.baseUrl}/shipping/labels`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shipper: request.fromAddress,
          recipient: request.toAddress,
          packages: request.packages,
          service: request.service,
          reference: request.reference,
        }),
      });

      if (!response.ok) {
        throw new Error(`Chronopost API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        trackingNumber: data.tracking_number,
        labelUrl: data.label_url,
        estimatedDelivery: new Date(data.estimated_delivery),
        cost: data.cost,
        carrier: 'Chronopost',
      };
    } catch (error) {
      console.error('Chronopost label generation error:', error);
      throw new HttpError(500, 'Failed to generate Chronopost shipping label');
    }
  }

  async trackShipment(trackingNumber: string): Promise<TrackingResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/tracking/${trackingNumber}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Chronopost tracking error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        trackingNumber: data.tracking_number,
        status: data.status,
        events: data.events.map((event: any) => ({
          timestamp: new Date(event.timestamp),
          location: event.location,
          description: event.description,
          status: event.status,
        })),
        estimatedDelivery: data.estimated_delivery ? new Date(data.estimated_delivery) : undefined,
        actualDelivery: data.actual_delivery ? new Date(data.actual_delivery) : undefined,
      };
    } catch (error) {
      console.error('Chronopost tracking error:', error);
      throw new HttpError(500, 'Failed to track Chronopost shipment');
    }
  }
}

class ColissimoCarrier {
  private config: CarrierConfig;

  constructor(config: CarrierConfig) {
    this.config = config;
  }

  async generateLabel(request: ShippingLabelRequest): Promise<ShippingLabelResponse> {
    try {
      // Colissimo API integration
      const response = await fetch(`${this.config.baseUrl}/labels`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: request.fromAddress,
          recipient: request.toAddress,
          packages: request.packages,
          service: request.service,
          reference: request.reference,
        }),
      });

      if (!response.ok) {
        throw new Error(`Colissimo API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        trackingNumber: data.tracking_number,
        labelUrl: data.label_url,
        estimatedDelivery: new Date(data.estimated_delivery),
        cost: data.cost,
        carrier: 'Colissimo',
      };
    } catch (error) {
      console.error('Colissimo label generation error:', error);
      throw new HttpError(500, 'Failed to generate Colissimo shipping label');
    }
  }

  async trackShipment(trackingNumber: string): Promise<TrackingResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/tracking/${trackingNumber}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Colissimo tracking error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        trackingNumber: data.tracking_number,
        status: data.status,
        events: data.events.map((event: any) => ({
          timestamp: new Date(event.timestamp),
          location: event.location,
          description: event.description,
          status: event.status,
        })),
        estimatedDelivery: data.estimated_delivery ? new Date(data.estimated_delivery) : undefined,
        actualDelivery: data.actual_delivery ? new Date(data.actual_delivery) : undefined,
      };
    } catch (error) {
      console.error('Colissimo tracking error:', error);
      throw new HttpError(500, 'Failed to track Colissimo shipment');
    }
  }
}

// Carrier factory
export class CarrierFactory {
  private static carriers: Map<string, any> = new Map();

  static getCarrier(carrierName: string): any {
    if (this.carriers.has(carrierName)) {
      return this.carriers.get(carrierName);
    }

    const config = this.getCarrierConfig(carrierName);
    let carrier;

    switch (carrierName.toLowerCase()) {
      case 'chronopost':
        carrier = new ChronopostCarrier(config);
        break;
      case 'colissimo':
        carrier = new ColissimoCarrier(config);
        break;
      default:
        throw new HttpError(400, `Unsupported carrier: ${carrierName}`);
    }

    this.carriers.set(carrierName, carrier);
    return carrier;
  }

  private static getCarrierConfig(carrierName: string): CarrierConfig {
    const envPrefix = carrierName.toUpperCase();
    
    return {
      apiKey: process.env[`${envPrefix}_API_KEY`] || '',
      baseUrl: process.env[`${envPrefix}_BASE_URL`] || '',
      accountNumber: process.env[`${envPrefix}_ACCOUNT_NUMBER`],
    };
  }
}

// Main shipping service
export class ShippingService {
  static async generateLabel(
    carrierName: string,
    request: ShippingLabelRequest
  ): Promise<ShippingLabelResponse> {
    const carrier = CarrierFactory.getCarrier(carrierName);
    return await carrier.generateLabel(request);
  }

  static async trackShipment(
    carrierName: string,
    trackingNumber: string
  ): Promise<TrackingResponse> {
    const carrier = CarrierFactory.getCarrier(carrierName);
    return await carrier.trackShipment(trackingNumber);
  }

  static async getShippingRates(
    fromAddress: any,
    toAddress: any,
    packages: any[]
  ): Promise<any[]> {
    // Get rates from multiple carriers
    const carriers = ['chronopost', 'colissimo'];
    const rates: any[] = [];

    for (const carrierName of carriers) {
      try {
        const carrier = CarrierFactory.getCarrier(carrierName);
        const rate = await carrier.getRates(fromAddress, toAddress, packages);
        rates.push(...rate);
      } catch (error) {
        console.error(`Error getting rates from ${carrierName}:`, error);
      }
    }

    return rates.sort((a: any, b: any) => a.cost - b.cost);
  }
} 