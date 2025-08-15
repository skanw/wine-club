import { prisma } from 'wasp/server';
import { HttpError } from 'wasp/server';
import type { Shipment, WineSubscription, User } from 'wasp/entities';

type CreateShipmentInput = {
  subscriptionId: string;
  carrier: 'FedEx' | 'UPS';
  wineSelections: { wineId: string; quantity: number }[];
};

type GenerateShippingLabelInput = {
  shipmentId: string;
};

type UpdateShipmentInput = {
  shipmentId: string;
  status?: string;
  trackingNumber?: string;
  carrierReference?: string;
};

type TrackShipmentInput = {
  shipmentId: string;
};

// Mock shipping API configurations
const SHIPPING_CONFIG = {
  FedEx: {
    apiUrl: process.env.FEDEX_API_URL || 'https://apis-sandbox.fedex.com',
    apiKey: process.env.FEDEX_API_KEY || 'sandbox-key',
    accountNumber: process.env.FEDEX_ACCOUNT_NUMBER || '123456789',
  },
  UPS: {
    apiUrl: process.env.UPS_API_URL || 'https://onlinetools.ups.com/api',
    apiKey: process.env.UPS_API_KEY || 'sandbox-key',
    accountNumber: process.env.UPS_ACCOUNT_NUMBER || '987654321',
  }
};

// Create a new shipment for a subscription
export const createShipment = async (args: CreateShipmentInput, context: any): Promise<Shipment> => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to create shipments');
  }

  // Verify subscription ownership
  const subscription = await prisma.wineSubscription.findFirst({
    where: {
      id: args.subscriptionId,
    },
    include: {
      wineCave: true,
      member: true,
    },
  });

  if (!subscription) {
    throw new HttpError(404, 'Subscription not found');
  }

  // Verify wine cave ownership
  if (subscription.wineCave.ownerId !== context.user.id) {
    throw new HttpError(403, 'You do not have permission to create shipments for this subscription');
  }

  // Calculate next shipment date (first of next month)
  const shipmentDate = new Date();
  shipmentDate.setMonth(shipmentDate.getMonth() + 1);
  shipmentDate.setDate(1);

  // Create the shipment
  const shipment = await prisma.shipment.create({
    data: {
      subscriptionId: args.subscriptionId,
      wineCaveId: subscription.wineCaveId,
      carrier: args.carrier,
      shipmentDate,
      status: 'pending',
    },
    include: {
      subscription: {
        include: {
          member: true,
          wineCave: true,
        },
      },
      items: {
        include: {
          wine: true,
        },
      },
    },
  });

  // Add wine selections to shipment
  if (args.wineSelections && args.wineSelections.length > 0) {
    await Promise.all(
      args.wineSelections.map(selection =>
        prisma.shipmentItem.create({
          data: {
            shipmentId: shipment.id,
            wineId: selection.wineId,
            quantity: selection.quantity,
          },
        })
      )
    );
  }

  return shipment;
};

// Generate shipping label using carrier API
export const generateShippingLabel = async (args: GenerateShippingLabelInput, context: any): Promise<Shipment> => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to generate shipping labels');
  }

  const shipment = await prisma.shipment.findFirst({
    where: {
      id: args.shipmentId,
    },
    include: {
      subscription: {
        include: {
          member: true,
          wineCave: true,
        },
      },
      items: {
        include: {
          wine: true,
        },
      },
    },
  });

  if (!shipment) {
    throw new HttpError(404, 'Shipment not found');
  }

  // Verify wine cave ownership
  if (shipment.subscription.wineCave.ownerId !== context.user.id) {
    throw new HttpError(403, 'You do not have permission to generate labels for this shipment');
  }

  try {
    // Mock API call to shipping carrier
    const labelData = await generateCarrierLabel(shipment);
    
    // Update shipment with tracking information
    const updatedShipment = await prisma.shipment.update({
      where: { id: args.shipmentId },
      data: {
        trackingNumber: labelData.trackingNumber,
        status: 'labeled',
        // In real implementation, would store label URL or base64 data
      },
      include: {
        subscription: {
          include: {
            member: true,
            wineCave: true,
          },
        },
        items: {
          include: {
            wine: true,
          },
        },
      },
    });

    return updatedShipment;
  } catch (error) {
    throw new HttpError(500, `Failed to generate shipping label: ${error}`);
  }
};

// Update shipment status
export const updateShipment = async (args: UpdateShipmentInput, context: any): Promise<Shipment> => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to update shipments');
  }

  const shipment = await prisma.shipment.findFirst({
    where: {
      id: args.shipmentId,
    },
    include: {
      subscription: {
        include: {
          wineCave: true,
        },
      },
    },
  });

  if (!shipment) {
    throw new HttpError(404, 'Shipment not found');
  }

  // Verify wine cave ownership
  if (shipment.subscription.wineCave.ownerId !== context.user.id) {
    throw new HttpError(403, 'You do not have permission to update this shipment');
  }

  const { shipmentId, ...updateData } = args;

  return prisma.shipment.update({
    where: { id: shipmentId },
    data: updateData,
    include: {
      subscription: {
        include: {
          member: true,
          wineCave: true,
        },
      },
      items: {
        include: {
          wine: true,
        },
      },
    },
  });
};

// Track shipment status
export const trackShipment = async (args: TrackShipmentInput, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to track shipments');
  }

  const shipment = await prisma.shipment.findFirst({
    where: {
      id: args.shipmentId,
    },
    include: {
      subscription: {
        include: {
          member: true,
          wineCave: true,
        },
      },
    },
  });

  if (!shipment) {
    throw new HttpError(404, 'Shipment not found');
  }

  // Allow both wine cave owners and subscribers to track
  const isOwner = shipment.subscription.wineCave.ownerId === context.user.id;
  const isSubscriber = shipment.subscription.memberId === context.user.id;

  if (!isOwner && !isSubscriber) {
    throw new HttpError(403, 'You do not have permission to track this shipment');
  }

  if (!shipment.trackingNumber) {
    return {
      status: shipment.status,
      message: 'Tracking information not yet available',
    };
  }

  try {
    // Mock API call to get tracking information
    const trackingData = await getCarrierTrackingInfo(shipment.carrier!, shipment.trackingNumber!);
    
    // Update shipment status if it has changed
    if (trackingData.status !== shipment.status) {
      await prisma.shipment.update({
        where: { id: args.shipmentId },
        data: { status: trackingData.status },
      });
    }

    return trackingData;
  } catch (error) {
    throw new HttpError(500, `Failed to track shipment: ${error}`);
  }
};

// Mock function to generate shipping label (would integrate with real APIs)
async function generateCarrierLabel(shipment: any): Promise<{ trackingNumber: string; labelUrl: string }> {
  const carrier = shipment.carrier;
  const config = SHIPPING_CONFIG[carrier as keyof typeof SHIPPING_CONFIG];
  
  // Mock API call - in real implementation would call actual carrier APIs
  const mockTrackingNumber = `${carrier.toUpperCase()}${Date.now()}${Math.random().toString(36).substr(2, 6)}`;
  
  console.log(`Generating ${carrier} label for shipment ${shipment.id} to ${shipment.subscription.deliveryAddress}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    trackingNumber: mockTrackingNumber,
    labelUrl: `${config.apiUrl}/labels/${mockTrackingNumber}.pdf`,
  };
}

// Mock function to get tracking information (would integrate with real APIs)
async function getCarrierTrackingInfo(carrier: string, trackingNumber: string): Promise<any> {
  const config = SHIPPING_CONFIG[carrier as keyof typeof SHIPPING_CONFIG];
  
  // Mock tracking data - in real implementation would call actual carrier APIs
  const statuses = ['labeled', 'shipped', 'in_transit', 'out_for_delivery', 'delivered'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  console.log(`Tracking ${carrier} shipment ${trackingNumber}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    trackingNumber,
    status: randomStatus,
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    location: 'Distribution Center',
    updates: [
      {
        timestamp: new Date(),
        status: randomStatus,
        location: 'Distribution Center',
        message: `Package ${randomStatus.replace('_', ' ')}`,
      },
    ],
  };
} 