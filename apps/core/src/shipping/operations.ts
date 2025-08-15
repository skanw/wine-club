import { HttpError } from 'wasp/server';
import { ShippingService } from './carrier-integrations';

export type CreateShipmentInput = {
  subscriptionId: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: Date;
  deliveryAddress: string;
  deliveryInstructions?: string;
};

export type UpdateShipmentInput = {
  shipmentId: string;
  status?: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: Date;
  actualDeliveryDate?: Date;
};

export type GenerateLabelInput = {
  shipmentId: string;
  carrier: string;
};

export const createShipment = async (args: CreateShipmentInput, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  // Verify subscription exists and user has access
  const subscription = await context.entities.WineSubscription.findFirst({
    where: {
      id: args.subscriptionId,
      OR: [
        { memberId: context.user.id },
        { wineCave: { ownerId: context.user.id } },
      ],
    },
    include: {
      wineCave: true,
      subscriptionTier: true,
      member: true,
    },
  });

  if (!subscription) {
    throw new HttpError(404, 'Subscription not found');
  }

  // Create shipment
  const shipment = await context.entities.Shipment.create({
    data: {
      subscriptionId: args.subscriptionId,
      wineCaveId: subscription.wineCaveId,
      status: 'PENDING',
      trackingNumber: args.trackingNumber,
      carrier: args.carrier || 'Chronopost',
      estimatedDelivery: args.estimatedDelivery,
    },
  });

  // Add wines to shipment based on subscription tier
  const wines = await context.entities.Wine.findMany({
    where: {
      wineCaveId: subscription.wineCaveId,
      stockQuantity: { gt: 0 },
    },
    take: subscription.subscriptionTier.bottlesPerMonth,
    orderBy: { createdAt: 'desc' },
  });

  for (const wine of wines) {
    await context.entities.ShipmentItem.create({
      data: {
        shipmentId: shipment.id,
        wineId: wine.id,
        quantity: 1,
      },
    });

    // Update wine stock
    await context.entities.Wine.update({
      where: { id: wine.id },
      data: { stockQuantity: wine.stockQuantity - 1 },
    });
  }

  return shipment;
};

export const generateShippingLabel = async (args: GenerateLabelInput, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  // Get shipment with all necessary data
  const shipment = await context.entities.Shipment.findFirst({
    where: {
      id: args.shipmentId,
      subscription: {
        OR: [
          { memberId: context.user.id },
          { wineCave: { ownerId: context.user.id } },
        ],
      },
    },
    include: {
      subscription: {
        include: {
          wineCave: true,
          member: true,
        },
      },
      shipmentItems: {
        include: {
          wine: true,
        },
      },
    },
  });

  if (!shipment) {
    throw new HttpError(404, 'Shipment not found');
  }

  try {
    // Prepare shipping label request
    const labelRequest = {
      fromAddress: {
        name: shipment.subscription.wineCave.name,
        company: shipment.subscription.wineCave.name,
        address1: shipment.subscription.wineCave.location || '123 Wine Street',
        city: 'Bordeaux',
        state: 'Nouvelle-Aquitaine',
        postalCode: '33000',
        country: 'France',
        phone: shipment.subscription.wineCave.contactEmail || '+33 1 23 45 67 89',
      },
      toAddress: {
        name: shipment.subscription.member.username || 'Customer',
        address1: shipment.subscription.deliveryAddress || 'Customer Address',
        city: 'Customer City',
        state: 'Customer State',
        postalCode: 'Customer Postal Code',
        country: 'France',
        phone: shipment.subscription.phoneNumber || '+33 1 23 45 67 89',
      },
      packages: shipment.shipmentItems.map((item: any) => ({
        weight: 1.5, // Standard wine bottle weight
        length: 30,
        width: 10,
        height: 10,
        description: `${item.wine.name} - ${item.wine.varietal}`,
      })),
      service: 'standard',
      reference: `WINE-${shipment.id}`,
    };

    // Generate label using carrier API
    const labelResponse = await ShippingService.generateLabel(
      args.carrier,
      labelRequest
    );

    // Update shipment with tracking information
    await context.entities.Shipment.update({
      where: { id: args.shipmentId },
      data: {
        trackingNumber: labelResponse.trackingNumber,
        carrier: labelResponse.carrier,
        status: 'SHIPPED',
        estimatedDelivery: labelResponse.estimatedDelivery,
      },
    });

    // Create tracking info record
    await context.entities.TrackingInfo.create({
      data: {
        trackingNumber: labelResponse.trackingNumber,
        carrier: labelResponse.carrier,
        status: 'in_transit',
        shipmentId: shipment.id,
        estimatedDelivery: labelResponse.estimatedDelivery,
      },
    });

    return {
      success: true,
      trackingNumber: labelResponse.trackingNumber,
      labelUrl: labelResponse.labelUrl,
      estimatedDelivery: labelResponse.estimatedDelivery,
      cost: labelResponse.cost,
    };
  } catch (error) {
    console.error('Error generating shipping label:', error);
    throw new HttpError(500, 'Failed to generate shipping label');
  }
};

export const trackShipment = async (args: { trackingNumber: string }, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  // Get tracking info from database
  const trackingInfo = await context.entities.TrackingInfo.findUnique({
    where: { trackingNumber: args.trackingNumber },
    include: {
      shipment: {
        include: {
          subscription: {
            include: {
              member: true,
              wineCave: true,
            },
          },
        },
      },
    },
  });

  if (!trackingInfo) {
    throw new HttpError(404, 'Tracking information not found');
  }

  // Verify user has access to this shipment
  const hasAccess = trackingInfo.shipment?.subscription?.memberId === context.user.id ||
                   trackingInfo.shipment?.subscription?.wineCave?.ownerId === context.user.id;

  if (!hasAccess) {
    throw new HttpError(403, 'Access denied');
  }

  try {
    // Get real-time tracking from carrier
    const trackingResponse = await ShippingService.trackShipment(
      trackingInfo.carrier,
      args.trackingNumber
    );

    // Update tracking info in database
    await context.entities.TrackingInfo.update({
      where: { trackingNumber: args.trackingNumber },
      data: {
        status: trackingResponse.status,
        events: trackingResponse.events,
        estimatedDelivery: trackingResponse.estimatedDelivery,
      },
    });

    return trackingResponse;
  } catch (error) {
    console.error('Error tracking shipment:', error);
    // Return cached tracking info if API fails
    return {
      trackingNumber: trackingInfo.trackingNumber,
      status: trackingInfo.status,
      events: trackingInfo.events,
      estimatedDelivery: trackingInfo.estimatedDelivery,
    };
  }
};

export const getShipments = async (args: { wineCaveId?: string }, context: any): Promise<any[]> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  const whereClause: any = {};
  
  if (args.wineCaveId) {
    whereClause.subscription = {
      wineCaveId: args.wineCaveId,
    };
  }

  return await context.entities.Shipment.findMany({
    where: whereClause,
    include: {
      subscription: {
        include: {
          member: true,
          wineCave: true,
          subscriptionTier: true,
        },
      },
      shipmentItems: {
        include: {
          wine: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const updateShipment = async (args: UpdateShipmentInput, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  // Verify shipment exists and user has access
  const shipment = await context.entities.Shipment.findFirst({
    where: {
      id: args.shipmentId,
      subscription: {
        OR: [
          { memberId: context.user.id },
          { wineCave: { ownerId: context.user.id } },
        ],
      },
    },
  });

  if (!shipment) {
    throw new HttpError(404, 'Shipment not found');
  }

  const updateData: any = {};
  Object.keys(args).forEach(key => {
    if (key !== 'shipmentId' && args[key as keyof UpdateShipmentInput] !== undefined) {
      updateData[key] = args[key as keyof UpdateShipmentInput];
    }
  });

  return await context.entities.Shipment.update({
    where: { id: args.shipmentId },
    data: updateData,
  });
};

export const getShippingRates = async (args: {
  fromAddress: any;
  toAddress: any;
  packages: any[];
}, context: any): Promise<any[]> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  try {
    // Get real-time rates from carriers
    const rates = await ShippingService.getShippingRates(
      args.fromAddress,
      args.toAddress,
      args.packages
    );

    return rates;
  } catch (error) {
    console.error('Error getting shipping rates:', error);
    
    // Return fallback rates if API fails
    return [
      {
        id: '1',
        name: 'Standard Shipping',
        price: 15.00,
        currency: 'EUR',
        deliveryTime: '5-7 business days',
        description: 'Standard ground shipping within France',
        carrier: 'Chronopost',
      },
      {
        id: '2',
        name: 'Express Shipping',
        price: 25.00,
        currency: 'EUR',
        deliveryTime: '2-3 business days',
        description: 'Express shipping within France',
        carrier: 'Colissimo',
      },
      {
        id: '3',
        name: 'International Shipping',
        price: 45.00,
        currency: 'EUR',
        deliveryTime: '7-14 business days',
        description: 'International shipping to EU countries',
        carrier: 'Chronopost',
      },
    ];
  }
}; 