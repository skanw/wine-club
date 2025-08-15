import { type Wine } from 'wasp/entities';
import { HttpError } from 'wasp/server';

export type CreateWineInput = {
  wineCaveId: string;
  name: string;
  vintage: string;
  varietal: string;
  region: string;
  country: string;
  price: number;
  description?: string;
  imageUrl?: string;
  stockQuantity: number;
  alcoholContent?: number;
  tastingNotes?: string;
};

export type UpdateWineInput = {
  wineId: string;
  name?: string;
  vintage?: string;
  varietal?: string;
  region?: string;
  country?: string;
  price?: number;
  description?: string;
  imageUrl?: string;
  stockQuantity?: number;
  alcoholContent?: number;
  tastingNotes?: string;
};

export const createWine = async (args: CreateWineInput, context: any): Promise<Wine> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  // Verify wine cave ownership
  const wineCave = await context.entities.WineCave.findFirst({
    where: {
      id: args.wineCaveId,
      ownerId: context.user.id,
    },
  });

  if (!wineCave) {
    throw new HttpError(403, 'Not authorized to add wine to this cave');
  }

  return await context.entities.Wine.create({
    data: {
      wineCaveId: args.wineCaveId,
      name: args.name,
      vintage: args.vintage,
      varietal: args.varietal,
      region: args.region,
      country: args.country,
      price: args.price,
      description: args.description,
      imageUrl: args.imageUrl,
      stockQuantity: args.stockQuantity,
      alcoholContent: args.alcoholContent,
      tastingNotes: args.tastingNotes,
    },
  });
};

export const getWine = async (args: { wineId: string }, context: any): Promise<Wine> => {
  const wine = await context.entities.Wine.findUnique({
    where: { id: args.wineId },
    include: {
      wineCave: true,
    },
  });

  if (!wine) {
    throw new HttpError(404, 'Wine not found');
  }

  return wine;
};

export const getWineCaveWines = async (args: { wineCaveId: string }, context: any): Promise<Wine[]> => {
  return await context.entities.Wine.findMany({
    where: { wineCaveId: args.wineCaveId },
    orderBy: { createdAt: 'desc' },
  });
};

export const updateWine = async (args: UpdateWineInput, context: any): Promise<Wine> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  // Verify ownership through wine cave
  const wine = await context.entities.Wine.findFirst({
    where: { id: args.wineId },
    include: {
      wineCave: true,
    },
  });

  if (!wine || wine.wineCave.ownerId !== context.user.id) {
    throw new HttpError(403, 'Not authorized to update this wine');
  }

  const updateData: any = {};
  Object.keys(args).forEach(key => {
    if (key !== 'wineId' && args[key as keyof UpdateWineInput] !== undefined) {
      updateData[key] = args[key as keyof UpdateWineInput];
    }
  });

  return await context.entities.Wine.update({
    where: { id: args.wineId },
    data: updateData,
  });
};

export const deleteWine = async (args: { wineId: string }, context: any): Promise<{ success: boolean }> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  // Verify ownership through wine cave
  const wine = await context.entities.Wine.findFirst({
    where: { id: args.wineId },
    include: {
      wineCave: true,
    },
  });

  if (!wine || wine.wineCave.ownerId !== context.user.id) {
    throw new HttpError(403, 'Not authorized to delete this wine');
  }

  await context.entities.Wine.delete({
    where: { id: args.wineId },
  });

  return { success: true };
};

export const getWineAnalytics = async (args: { wineCaveId: string }, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  const wines = await context.entities.Wine.findMany({
    where: { wineCaveId: args.wineCaveId },
  });

  const totalWines = wines.length;
  const totalValue = wines.reduce((sum, wine) => sum + (wine.price * wine.stockQuantity), 0);
  const lowStockWines = wines.filter(wine => wine.stockQuantity < 10).length;
  const averagePrice = totalWines > 0 ? wines.reduce((sum, wine) => sum + wine.price, 0) / totalWines : 0;

  return {
    totalWines,
    totalValue,
    lowStockWines,
    averagePrice: Math.round(averagePrice * 100) / 100,
  };
};

export const getWineStats = async (args: { wineCaveId: string }, context: any): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  const wines = await context.entities.Wine.findMany({
    where: { wineCaveId: args.wineCaveId },
  });

  const totalWines = wines.length;
  const totalValue = wines.reduce((sum, wine) => sum + (wine.price * wine.stockQuantity), 0);
  const lowStockWines = wines.filter(wine => wine.stockQuantity < 10).length;
  const averagePrice = totalWines > 0 ? wines.reduce((sum, wine) => sum + wine.price, 0) / totalWines : 0;

  return {
    totalWines,
    totalValue,
    lowStockWines,
    averagePrice: Math.round(averagePrice * 100) / 100,
  };
};

export const updateWineStock = async (args: { wineId: string; stockQuantity: number }, context: any): Promise<Wine> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  // Verify ownership through wine cave
  const wine = await context.entities.Wine.findFirst({
    where: { id: args.wineId },
    include: {
      wineCave: true,
    },
  });

  if (!wine || wine.wineCave.ownerId !== context.user.id) {
    throw new HttpError(403, 'Not authorized to update this wine');
  }

  return await context.entities.Wine.update({
    where: { id: args.wineId },
    data: { stockQuantity: args.stockQuantity },
  });
}; 