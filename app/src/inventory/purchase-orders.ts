import { HttpError } from 'wasp/server';

interface PurchaseOrderItem {
  wineId: string;
  wineName: string;
  currentStock: number;
  minimumStock: number;
  suggestedQuantity: number;
  unitPrice: number;
  supplierId: string;
  supplierName: string;
}

interface PurchaseOrder {
  id: string;
  wineCaveId: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled';
  createdAt: Date;
  expectedDeliveryDate?: Date;
  notes?: string;
}

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    line1: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentTerms: string;
  leadTimeDays: number;
}

export const generatePurchaseOrders = async (args: { 
  wineCaveId: string; 
  autoSend?: boolean;
}, context: any): Promise<PurchaseOrder[]> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  try {
    // Get wines with low stock
    const lowStockWines = await context.entities.Wine.findMany({
      where: {
        wineCaveId: args.wineCaveId,
        stockQuantity: {
          lte: 10, // Low stock threshold
        },
      },
      include: {
        supplier: true,
      },
    });

    if (lowStockWines.length === 0) {
      return [];
    }

    // Group wines by supplier
    const supplierGroups = new Map<string, PurchaseOrderItem[]>();
    
    for (const wine of lowStockWines) {
      if (!wine.supplier) continue;
      
      const supplierId = wine.supplier.id;
      const suggestedQuantity = Math.max(20, wine.stockQuantity * 2); // Order 2x current stock or minimum 20
      
      const item: PurchaseOrderItem = {
        wineId: wine.id,
        wineName: wine.name,
        currentStock: wine.stockQuantity,
        minimumStock: wine.lowStockThreshold || 10,
        suggestedQuantity,
        unitPrice: wine.costPrice || wine.price * 0.6, // Assume 40% margin
        supplierId: wine.supplier.id,
        supplierName: wine.supplier.name,
      };

      if (!supplierGroups.has(supplierId)) {
        supplierGroups.set(supplierId, []);
      }
      supplierGroups.get(supplierId)!.push(item);
    }

    // Create purchase orders for each supplier
    const purchaseOrders: PurchaseOrder[] = [];

    for (const [supplierId, items] of supplierGroups) {
      const supplier = await context.entities.Supplier.findUnique({
        where: { id: supplierId },
      });

      if (!supplier) continue;

      const totalAmount = items.reduce((sum, item) => sum + (item.unitPrice * item.suggestedQuantity), 0);
      const expectedDeliveryDate = new Date();
      expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + (supplier.leadTimeDays || 7));

      const purchaseOrder: PurchaseOrder = {
        id: `po_${Date.now()}_${supplierId}`,
        wineCaveId: args.wineCaveId,
        supplierId: supplier.id,
        supplierName: supplier.name,
        items,
        totalAmount,
        status: args.autoSend ? 'sent' : 'draft',
        createdAt: new Date(),
        expectedDeliveryDate,
        notes: `Auto-generated purchase order for low stock items. Generated on ${new Date().toLocaleDateString()}`,
      };

      // Save to database
      await context.entities.PurchaseOrder.create({
        data: {
          id: purchaseOrder.id,
          wineCaveId: purchaseOrder.wineCaveId,
          supplierId: purchaseOrder.supplierId,
          totalAmount: purchaseOrder.totalAmount,
          status: purchaseOrder.status,
          expectedDeliveryDate: purchaseOrder.expectedDeliveryDate,
          notes: purchaseOrder.notes,
          items: {
            create: purchaseOrder.items.map(item => ({
              wineId: item.wineId,
              quantity: item.suggestedQuantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
      });

      // Send email to supplier if autoSend is enabled
      if (args.autoSend && supplier.email) {
        await sendPurchaseOrderEmail(purchaseOrder, supplier);
      }

      purchaseOrders.push(purchaseOrder);
    }

    return purchaseOrders;

  } catch (error) {
    throw new HttpError(500, 'Failed to generate purchase orders');
  }
};

export const sendPurchaseOrderEmail = async (purchaseOrder: PurchaseOrder, supplier: Supplier): Promise<void> => {
  try {
    const emailContent = generatePurchaseOrderEmail(purchaseOrder);
    
    // Send email using your email service
    // This would integrate with your email service (SendGrid, Mailgun, etc.)
    console.log(`Sending purchase order ${purchaseOrder.id} to ${supplier.email}`);
    console.log('Email content:', emailContent);
    
  } catch (error) {
    console.error('Failed to send purchase order email:', error);
  }
};

export const generatePurchaseOrderEmail = (purchaseOrder: PurchaseOrder): string => {
  const itemsList = purchaseOrder.items.map(item => 
    `- ${item.wineName}: ${item.suggestedQuantity} bottles @ €${item.unitPrice.toFixed(2)} each`
  ).join('\n');

  return `
Bonjour ${purchaseOrder.supplierName},

Nous souhaitons passer une commande pour les vins suivants :

${itemsList}

Total de la commande : €${purchaseOrder.totalAmount.toFixed(2)}
Date de livraison souhaitée : ${purchaseOrder.expectedDeliveryDate?.toLocaleDateString()}

Numéro de commande : ${purchaseOrder.id}

Merci de confirmer cette commande par retour d'email.

Cordialement,
L'équipe Wine Club
  `.trim();
};

export const getPurchaseOrders = async (args: { 
  wineCaveId: string; 
  status?: string;
}, context: any): Promise<PurchaseOrder[]> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  try {
    const whereClause: any = { wineCaveId: args.wineCaveId };
    if (args.status) {
      whereClause.status = args.status;
    }

    const purchaseOrders = await context.entities.PurchaseOrder.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            wine: true,
          },
        },
        supplier: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return purchaseOrders.map(po => ({
      id: po.id,
      wineCaveId: po.wineCaveId,
      supplierId: po.supplierId,
      supplierName: po.supplier.name,
      items: po.items.map(item => ({
        wineId: item.wineId,
        wineName: item.wine.name,
        currentStock: item.wine.stockQuantity,
        minimumStock: item.wine.lowStockThreshold || 10,
        suggestedQuantity: item.quantity,
        unitPrice: item.unitPrice,
        supplierId: po.supplierId,
        supplierName: po.supplier.name,
      })),
      totalAmount: po.totalAmount,
      status: po.status,
      createdAt: po.createdAt,
      expectedDeliveryDate: po.expectedDeliveryDate,
      notes: po.notes,
    }));

  } catch (error) {
    throw new HttpError(500, 'Failed to get purchase orders');
  }
};

export const updatePurchaseOrderStatus = async (args: { 
  purchaseOrderId: string; 
  status: string;
  notes?: string;
}, context: any): Promise<PurchaseOrder> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  try {
    const purchaseOrder = await context.entities.PurchaseOrder.update({
      where: { id: args.purchaseOrderId },
      data: {
        status: args.status,
        notes: args.notes,
      },
      include: {
        items: {
          include: {
            wine: true,
          },
        },
        supplier: true,
      },
    });

    // If order is received, update inventory
    if (args.status === 'received') {
      for (const item of purchaseOrder.items) {
        await context.entities.Wine.update({
          where: { id: item.wineId },
          data: {
            stockQuantity: {
              increment: item.quantity,
            },
          },
        });
      }
    }

    return {
      id: purchaseOrder.id,
      wineCaveId: purchaseOrder.wineCaveId,
      supplierId: purchaseOrder.supplierId,
      supplierName: purchaseOrder.supplier.name,
      items: purchaseOrder.items.map(item => ({
        wineId: item.wineId,
        wineName: item.wine.name,
        currentStock: item.wine.stockQuantity,
        minimumStock: item.wine.lowStockThreshold || 10,
        suggestedQuantity: item.quantity,
        unitPrice: item.unitPrice,
        supplierId: purchaseOrder.supplierId,
        supplierName: purchaseOrder.supplier.name,
      })),
      totalAmount: purchaseOrder.totalAmount,
      status: purchaseOrder.status,
      createdAt: purchaseOrder.createdAt,
      expectedDeliveryDate: purchaseOrder.expectedDeliveryDate,
      notes: purchaseOrder.notes,
    };

  } catch (error) {
    throw new HttpError(500, 'Failed to update purchase order status');
  }
}; 