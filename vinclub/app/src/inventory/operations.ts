import { HttpError } from 'wasp/server';
import type {
  AnalyzeInventoryStructure,
  ImportInventoryFromFile,
  GetPaginatedProducts,
  GetProductById,
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
} from 'wasp/server/operations';
import { requireAuthenticatedCave } from '../server/utils/tenant';
import { detectStructureFromContent, type ColumnMapping } from '../shared/aiStructureDetector';
import { 
  parseInventoryFile, 
  parseExcelFileMultiSheet, 
  parseCsvFile, 
  detectFileType,
  type SheetMapping,
  type ParseResult 
} from './fileParser';
import * as XLSX from 'xlsx';
import { ensureArgsSchemaOrThrowHttpError } from '../server/validation';
import * as z from 'zod';

const productIdSchema = z.object({
  id: z.string().uuid('ID de produit invalide'),
});

const createProductSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(200),
  vintage: z.number().int().min(1900).max(2100).optional().nullable(),
  region: z.string().max(100).optional().nullable(),
  appellation: z.string().max(100).optional().nullable(),
  wineType: z.enum(['red', 'white', 'rosé', 'sparkling']).optional().nullable(),
  price: z.number().min(0, 'Le prix doit être positif'),
  stockQuantity: z.number().int().min(0).default(0),
  description: z.string().max(1000).optional().nullable(),
  tags: z.array(z.string()).max(10).default([]),
});

const updateProductSchema = createProductSchema.partial();

const getPaginatedProductsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  region: z.string().optional(),
  wineType: z.string().optional(),
  stockStatus: z.enum(['all', 'in_stock', 'out_of_stock', 'low_stock']).optional(),
});

/**
 * Analyze Excel/CSV structure to detect column mappings
 */
export const analyzeInventoryStructure: AnalyzeInventoryStructure<
  { fileData: string; fileName: string }, // fileData is base64 encoded
  {
    mappings: Array<{
      sheetName: string;
      columns: ColumnMapping;
      confidence: Record<string, number>;
    }>;
    sampleRows: Array<{ sheetName: string; rows: Array<Record<string, any>> }>;
    hasHeaders: boolean;
  }
> = async (args, context) => {
  const caveId = requireAuthenticatedCave(context);

  const fileBuffer = Buffer.from(args.fileData, 'base64');
  const fileType = detectFileType(args.fileName);

  let sheets: Map<string, Array<Record<string, any>>>;

  if (fileType === 'csv') {
    const rows = await parseCsvFile(fileBuffer);
    sheets = new Map([['Sheet1', rows]]);
  } else {
    sheets = parseExcelFileMultiSheet(fileBuffer);
  }

  const mappings: Array<{
    sheetName: string;
    columns: ColumnMapping;
    confidence: Record<string, number>;
  }> = [];
  const sampleRows: Array<{ sheetName: string; rows: Array<Record<string, any>> }> = [];

  // Analyze each sheet
  for (const [sheetName, rows] of sheets.entries()) {
    if (rows.length === 0) continue;

    // Extract headers and sample data
    const headers = Object.keys(rows[0] || {});
    const sample = rows.slice(0, 10);

    if (headers.length === 0) continue;

    // Use AI to detect structure
    try {
      const aiMapping = await detectStructureFromContent(
        sample,
        headers,
        'inventory',
        sheetName
      );

      mappings.push({
        sheetName,
        columns: aiMapping.columns as ColumnMapping,
        confidence: aiMapping.confidence,
      });

      sampleRows.push({
        sheetName,
        rows: sample.slice(0, 5),
      });
    } catch (error: any) {
      console.error(`Failed to analyze sheet ${sheetName}:`, error);
      // Continue with other sheets
    }
  }

  return {
    mappings,
    sampleRows,
    hasHeaders: true,
  };
};

/**
 * Import inventory from Excel/CSV file
 */
export const importInventoryFromFile: ImportInventoryFromFile<
  {
    fileData: string; // base64 encoded
    fileName: string;
    columnMappings: SheetMapping[];
    selectedSheets?: string[]; // If empty, import all sheets
    duplicateHandling: 'skip' | 'update';
  },
  {
    successful: number;
    failed: number;
    skipped: number;
    errors: Array<{ row: number; sheet: string; reason: string }>;
  }
> = async (args, context) => {
  const caveId = requireAuthenticatedCave(context);

  const fileBuffer = Buffer.from(args.fileData, 'base64');

  // Filter mappings to selected sheets only
  const mappingsToUse = args.selectedSheets && args.selectedSheets.length > 0
    ? args.columnMappings.filter(m => args.selectedSheets!.includes(m.sheetName))
    : args.columnMappings;

  // Parse and validate file
  const parseResult = await parseInventoryFile(
    fileBuffer,
    args.fileName,
    mappingsToUse,
    caveId
  );

  const result = {
    successful: 0,
    failed: 0,
    skipped: 0,
    errors: [] as Array<{ row: number; sheet: string; reason: string }>,
  };

  // Process valid products
  for (const productData of parseResult.valid) {
    try {
      // Check for duplicates (based on name + vintage + cave)
      const existing = await context.entities.Product.findFirst({
        where: {
          caveId,
          name: productData.name,
          vintage: productData.vintage,
        },
      });

      if (existing) {
        if (args.duplicateHandling === 'skip') {
          result.skipped++;
          continue;
        } else if (args.duplicateHandling === 'update') {
          // Update existing product
          await context.entities.Product.update({
            where: { id: existing.id },
            data: {
              region: productData.region,
              appellation: productData.appellation,
              wineType: productData.wineType,
              price: productData.price,
              stockQuantity: productData.stockQuantity,
              description: productData.description,
              tags: productData.tags,
            },
          });
          result.successful++;
          continue;
        }
      }

      // Create new product
      await context.entities.Product.create({
        data: {
          caveId,
          name: productData.name,
          vintage: productData.vintage,
          region: productData.region,
          appellation: productData.appellation,
          wineType: productData.wineType,
          price: productData.price,
          stockQuantity: productData.stockQuantity,
          description: productData.description,
          tags: productData.tags,
        },
      });
      result.successful++;
    } catch (error: any) {
      result.failed++;
      result.errors.push({
        row: 0,
        sheet: '',
        reason: error.message || 'Erreur lors de la création du produit',
      });
    }
  }

  // Add parse errors
  result.errors.push(...parseResult.errors.map(e => ({ 
    row: e.row, 
    sheet: e.sheet, 
    reason: e.reason 
  })));
  result.failed += parseResult.errors.length;

  return result;
};

/**
 * Get paginated list of products
 */
export const getPaginatedProducts: GetPaginatedProducts<
  z.infer<typeof getPaginatedProductsSchema>,
  {
    data: Array<{
      id: string;
      name: string;
      vintage: number | null;
      region: string | null;
      wineType: string | null;
      price: number;
      stockQuantity: number;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }
> = async (rawArgs, context) => {
  const caveId = requireAuthenticatedCave(context);

  const { page, limit, search, region, wineType, stockStatus } =
    ensureArgsSchemaOrThrowHttpError(getPaginatedProductsSchema, rawArgs);

  const skip = (page - 1) * limit;

  const where: any = {
    caveId,
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { region: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (region) {
    where.region = region;
  }

  if (wineType) {
    where.wineType = wineType;
  }

  if (stockStatus === 'in_stock') {
    where.stockQuantity = { gt: 0 };
  } else if (stockStatus === 'out_of_stock') {
    where.stockQuantity = 0;
  } else if (stockStatus === 'low_stock') {
    where.stockQuantity = { lte: 10, gt: 0 };
  }

  const [products, total] = await Promise.all([
    context.entities.Product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        vintage: true,
        region: true,
        wineType: true,
        price: true,
        stockQuantity: true,
      },
    }),
    context.entities.Product.count({ where }),
  ]);

  return {
    data: products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get product by ID
 */
export const getProductById: GetProductById<
  { id: string },
  {
    id: string;
    name: string;
    vintage: number | null;
    region: string | null;
    appellation: string | null;
    wineType: string | null;
    price: number;
    stockQuantity: number;
    description: string | null;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
  }
> = async (rawArgs, context) => {
  const caveId = requireAuthenticatedCave(context);

  const { id } = ensureArgsSchemaOrThrowHttpError(productIdSchema, rawArgs);

  const product = await context.entities.Product.findFirst({
    where: {
      id,
      caveId,
    },
  });

  if (!product) {
    throw new HttpError(404, 'Produit introuvable');
  }

  return {
    ...product,
    tags: (product.tags as string[]) || [],
  };
};

/**
 * Create a new product
 */
export const createProduct: CreateProduct<
  z.infer<typeof createProductSchema>,
  { id: string }
> = async (rawArgs, context) => {
  const caveId = requireAuthenticatedCave(context);

  const data = ensureArgsSchemaOrThrowHttpError(createProductSchema, rawArgs);

  try {
    const product = await context.entities.Product.create({
      data: {
        caveId,
        name: data.name,
        vintage: data.vintage,
        region: data.region,
        appellation: data.appellation,
        wineType: data.wineType,
        price: data.price,
        stockQuantity: data.stockQuantity,
        description: data.description,
        tags: data.tags || [],
      },
    });

    return { id: product.id };
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw new HttpError(409, 'Un produit avec ce nom et ce millésime existe déjà');
    }
    throw error;
  }
};

/**
 * Update product
 */
export const updateProduct: UpdateProduct<
  { id: string } & z.infer<typeof updateProductSchema>,
  { id: string }
> = async (rawArgs, context) => {
  const caveId = requireAuthenticatedCave(context);

  const { id, ...updateData } = rawArgs;
  const { id: validatedId } = ensureArgsSchemaOrThrowHttpError(productIdSchema, { id });
  const validatedData = ensureArgsSchemaOrThrowHttpError(updateProductSchema, updateData);

  const product = await context.entities.Product.findFirst({
    where: {
      id: validatedId,
      caveId,
    },
  });

  if (!product) {
    throw new HttpError(404, 'Produit introuvable');
  }

  const updated = await context.entities.Product.update({
    where: { id: validatedId },
    data: validatedData,
  });

  return { id: updated.id };
};

/**
 * Delete product
 */
export const deleteProduct: DeleteProduct<
  { id: string },
  void
> = async (rawArgs, context) => {
  const caveId = requireAuthenticatedCave(context);

  const { id } = ensureArgsSchemaOrThrowHttpError(productIdSchema, rawArgs);

  const product = await context.entities.Product.findFirst({
    where: {
      id,
      caveId,
    },
  });

  if (!product) {
    throw new HttpError(404, 'Produit introuvable');
  }

  await context.entities.Product.delete({
    where: { id },
  });
}
