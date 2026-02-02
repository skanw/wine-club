import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export interface ColumnMapping {
  name?: string;
  vintage?: string;
  region?: string;
  appellation?: string;
  wineType?: string;
  price?: string;
  stockQuantity?: string;
  description?: string;
  [key: string]: string | undefined; // Index signature for SuperJSON compatibility
}

export interface SheetMapping {
  sheetName: string;
  columns: ColumnMapping;
  [key: string]: any; // Index signature for SuperJSON compatibility
}

export interface ParseResult {
  valid: Array<{
    name: string;
    vintage: number | null;
    region: string | null;
    appellation: string | null;
    wineType: string | null;
    price: number;
    stockQuantity: number;
    description: string | null;
    tags: string[];
  }>;
  errors: Array<{
    row: number;
    sheet: string;
    reason: string;
    data: Record<string, any>;
  }>;
}

/**
 * Detect file type from filename
 */
export function detectFileType(fileName: string): 'excel' | 'csv' {
  const ext = fileName.toLowerCase().split('.').pop();
  return ext === 'csv' ? 'csv' : 'excel';
}

/**
 * Parse numeric value, handling various formats
 */
function parseNumber(value: any): number | null {
  if (typeof value === 'number') return value;
  if (!value) return null;
  
  const str = String(value).trim().replace(/\s+/g, '');
  // Remove currency symbols and commas
  const cleaned = str.replace(/[€$£,\s]/g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  
  return isNaN(num) ? null : num;
}

/**
 * Parse integer value
 */
function parseIntSafe(value: any): number | null {
  const num = parseNumber(value);
  return num !== null ? Math.round(num) : null;
}

/**
 * Parse Excel file and extract data from all sheets
 */
export function parseExcelFileMultiSheet(
  fileBuffer: Buffer
): Map<string, Array<Record<string, any>>> {
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  const sheets = new Map<string, Array<Record<string, any>>>();
  
  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { defval: null });
    sheets.set(sheetName, rows as Array<Record<string, any>>);
  }
  
  return sheets;
}

/**
 * Parse CSV file and extract data
 */
export async function parseCsvFile(
  fileBuffer: Buffer
): Promise<Array<Record<string, any>>> {
  const csvText = fileBuffer.toString('utf-8');
  
  return new Promise<Array<Record<string, any>>>((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn('CSV parsing warnings:', results.errors);
        }
        resolve(results.data as Array<Record<string, any>>);
      },
      error: (error: Error) => {
        reject(new Error(`CSV parsing failed: ${error.message}`));
      },
    });
  });
}

/**
 * Parse inventory file (Excel or CSV) and validate data
 */
export async function parseInventoryFile(
  fileBuffer: Buffer,
  fileName: string,
  columnMappings: SheetMapping[], // One mapping per sheet
  caveId: string
): Promise<ParseResult> {
  const fileType = detectFileType(fileName);
  const result: ParseResult = {
    valid: [],
    errors: [],
  };

  if (fileType === 'csv') {
    // CSV is single sheet
    const rows = await parseCsvFile(fileBuffer);
    const mapping = columnMappings[0] || columnMappings.find(m => m.sheetName === 'Sheet1');
    
    if (!mapping) {
      throw new Error('Aucun mapping de colonnes fourni');
    }

    processSheet(rows, mapping.sheetName, mapping.columns, result);
  } else {
    // Excel with multiple sheets
    const sheets = parseExcelFileMultiSheet(fileBuffer);
    
    for (const [sheetName, rows] of sheets.entries()) {
      const mapping = columnMappings.find(m => m.sheetName === sheetName);
      if (!mapping) {
        // Skip sheets without mapping
        continue;
      }
      
      processSheet(rows, sheetName, mapping.columns, result);
    }
  }

  return result;
}

function processSheet(
  rows: Array<Record<string, any>>,
  sheetName: string,
  columnMapping: ColumnMapping,
  result: ParseResult
) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNumber = i + 2; // +2 because header is row 1, and we're 0-indexed
    
    try {
      // Extract values using column mapping
      const nameRaw = columnMapping.name ? row[columnMapping.name] : null;
      const vintageRaw = columnMapping.vintage ? row[columnMapping.vintage] : null;
      const regionRaw = columnMapping.region ? row[columnMapping.region] : null;
      const appellationRaw = columnMapping.appellation ? row[columnMapping.appellation] : null;
      const wineTypeRaw = columnMapping.wineType ? row[columnMapping.wineType] : null;
      const priceRaw = columnMapping.price ? row[columnMapping.price] : null;
      const stockRaw = columnMapping.stockQuantity ? row[columnMapping.stockQuantity] : null;
      const descriptionRaw = columnMapping.description ? row[columnMapping.description] : null;
      
      // Validate required fields
      const name = nameRaw ? String(nameRaw).trim() : '';
      if (!name || name.length === 0) {
        result.errors.push({
          row: rowNumber,
          sheet: sheetName,
          reason: 'Le nom du produit est requis',
          data: row,
        });
        continue;
      }
      
      const price = parseNumber(priceRaw);
      if (price === null || price < 0) {
        result.errors.push({
          row: rowNumber,
          sheet: sheetName,
          reason: 'Le prix est invalide ou manquant',
          data: row,
        });
        continue;
      }
      
      // Process optional fields
      const vintage = parseIntSafe(vintageRaw);
      const stockQuantity = parseIntSafe(stockRaw) || 0;
      const region = regionRaw ? String(regionRaw).trim() || null : null;
      const appellation = appellationRaw ? String(appellationRaw).trim() || null : null;
      const wineType = wineTypeRaw ? String(wineTypeRaw).trim().toLowerCase() || null : null;
      const description = descriptionRaw ? String(descriptionRaw).trim() || null : null;
      
      // Normalize wine type
      let normalizedWineType: string | null = null;
      if (wineType) {
        if (['rouge', 'red'].includes(wineType)) normalizedWineType = 'red';
        else if (['blanc', 'white'].includes(wineType)) normalizedWineType = 'white';
        else if (['rosé', 'rose', 'rosé'].includes(wineType)) normalizedWineType = 'rosé';
        else if (['sparkling', 'mousseux', 'champagne'].includes(wineType)) normalizedWineType = 'sparkling';
      }
      
      result.valid.push({
        name: name,
        vintage: vintage,
        region: region,
        appellation: appellation,
        wineType: normalizedWineType,
        price: price,
        stockQuantity: stockQuantity,
        description: description,
        tags: [], // Tags can be added later
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      result.errors.push({
        row: rowNumber,
        sheet: sheetName,
        reason: `Erreur de traitement: ${errorMessage}`,
        data: row,
      });
    }
  }
}
