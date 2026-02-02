import { HttpError } from 'wasp/server';
import type {
  AnalyzeMembersStructure,
  ImportMembersFromFile,
} from 'wasp/server/operations';
import { requireAuthenticatedCave } from '../server/utils/tenant';
import { detectStructureFromContent } from '../shared/aiStructureDetector';
import { parseMembersFile, parseExcelFile, parseCsvFile, detectFileType, type ParseResult, type ColumnMapping } from './fileParser';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

/**
 * Analyze Excel/CSV structure to detect column mappings
 */
export const analyzeMembersStructure: AnalyzeMembersStructure<
  { fileData: string; fileName: string }, // fileData is base64 encoded
  {
    mapping: ColumnMapping;
    confidence: Record<string, number>;
    sampleRows: Array<Record<string, any>>;
    hasHeaders: boolean;
  }
> = async (args, context) => {
  try {
    const caveId = requireAuthenticatedCave(context);

    // Validate input
    if (!args.fileData || args.fileData.length === 0) {
      throw new HttpError(400, 'Aucune donnée de fichier fournie.');
    }

    // Convert base64 to buffer
    let fileBuffer: Buffer;
    try {
      fileBuffer = Buffer.from(args.fileData, 'base64');
      if (fileBuffer.length === 0) {
        throw new HttpError(400, 'Le fichier est vide.');
      }
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(400, 'Données de fichier invalides. Vérifiez que le fichier est bien encodé en base64.');
    }

    const fileType = detectFileType(args.fileName);

    let headers: string[] = [];
    let sampleRows: Array<Record<string, any>> = [];

    // Parse file to extract headers and sample data
    if (fileType === 'csv') {
      try {
        // Use PapaParse for proper CSV parsing (handles quoted fields, commas in values, etc.)
        const csvText = fileBuffer.toString('utf-8');
        
        // Parse with PapaParse for proper CSV handling
        // PapaParse handles large files efficiently and respects quoted fields
        const parsed = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header: string) => header.trim(),
          preview: 11, // Only parse first 11 rows (header + 10 data rows) for analysis
        });

        if (parsed.data && parsed.data.length > 0) {
          // Get headers from parsed result
          headers = parsed.meta.fields || Object.keys(parsed.data[0] || {});
          
          // Get sample rows (first 10)
          sampleRows = parsed.data.slice(0, 10).map((row: any) => {
            const cleanRow: Record<string, any> = {};
            headers.forEach(header => {
              cleanRow[header] = row[header] || '';
            });
            return cleanRow;
          });
        }
      } catch (error: any) {
        console.error('CSV parsing error:', error);
        throw new HttpError(400, `Erreur lors de l'analyse du fichier CSV: ${error.message || 'Format invalide'}`);
      }
    } else {
      try {
        // Parse Excel
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          throw new HttpError(400, 'Le fichier Excel ne contient aucune feuille');
        }
        
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON to get headers
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null, header: 1 });
        if (Array.isArray(jsonData) && jsonData.length > 0) {
          headers = (jsonData[0] as any[]).map(h => String(h || '')).filter(Boolean);
          
          // Get sample rows
          for (let i = 1; i < Math.min(11, jsonData.length); i++) {
            const rowData = jsonData[i] as any[];
            const row: Record<string, any> = {};
            headers.forEach((header, idx) => {
              row[header] = rowData[idx] || '';
            });
            sampleRows.push(row);
          }
        }
      } catch (error: any) {
        console.error('Excel parsing error:', error);
        throw new HttpError(400, `Erreur lors de l'analyse du fichier Excel: ${error.message || 'Format invalide'}`);
      }
    }

    if (headers.length === 0) {
      throw new HttpError(400, 'Impossible de détecter les colonnes dans le fichier. Vérifiez que le fichier contient des en-têtes.');
    }

    // Use AI to detect structure
    let aiMapping;
    try {
      aiMapping = await detectStructureFromContent(
        sampleRows,
        headers,
        'members'
      );
    } catch (error: any) {
      console.error('AI structure detection error:', error);
      // Fallback: return empty mapping and let user map manually
      return {
        mapping: {} as ColumnMapping,
        confidence: {},
        sampleRows: sampleRows.slice(0, 5),
        hasHeaders: true,
      };
    }

    return {
      mapping: aiMapping.columns as ColumnMapping,
      confidence: aiMapping.confidence,
      sampleRows: sampleRows.slice(0, 5), // Return first 5 for preview
      hasHeaders: true,
    };
  } catch (error: any) {
    // Re-throw HttpError as-is
    if (error instanceof HttpError) {
      throw error;
    }
    // Wrap other errors
    console.error('analyzeMembersStructure error:', error);
    throw new HttpError(500, `Erreur lors de l'analyse: ${error.message || 'Erreur inconnue'}`);
  }
};

/**
 * Import members from Excel/CSV file
 */
export const importMembersFromFile: ImportMembersFromFile<
  {
    fileData: string; // base64 encoded
    fileName: string;
    columnMapping: ColumnMapping;
    duplicateHandling: 'skip' | 'update' | 'create';
  },
  {
    successful: number;
    failed: number;
    skipped: number;
    errors: Array<{ row: number; reason: string }>;
  }
> = async (args, context) => {
  const caveId = requireAuthenticatedCave(context);

  // Convert base64 to buffer
  const fileBuffer = Buffer.from(args.fileData, 'base64');

  // Parse and validate file
  const parseResult = await parseMembersFile(
    fileBuffer,
    args.fileName,
    args.columnMapping,
    caveId
  );

  const result = {
    successful: 0,
    failed: 0,
    skipped: 0,
    errors: [] as Array<{ row: number; reason: string }>,
  };

  // Process valid members
  for (const memberData of parseResult.valid) {
    try {
      // Check for duplicates
      const existing = await context.entities.Member.findFirst({
        where: {
          caveId,
          OR: [
            { phone: memberData.phone },
            ...(memberData.email ? [{ email: memberData.email }] : []),
          ],
        },
      });

      if (existing) {
        if (args.duplicateHandling === 'skip') {
          result.skipped++;
          continue;
        } else if (args.duplicateHandling === 'update') {
          // Update existing member
          await context.entities.Member.update({
            where: { id: existing.id },
            data: {
              name: memberData.name,
              email: memberData.email,
              preferredRegion: memberData.preferredRegion,
              tags: memberData.tags,
              customFields: memberData.customFields || {},
              consentEmail: memberData.consentEmail,
              consentSms: memberData.consentSms,
              consentGdprLoggedAt: memberData.consentEmail || memberData.consentSms ? new Date() : null,
            },
          });
          result.successful++;
          continue;
        }
        // If 'create', continue to try creating (will fail on unique constraint)
      }

      // Create new member
      await context.entities.Member.create({
        data: {
          caveId,
          name: memberData.name,
          email: memberData.email,
          phone: memberData.phone,
          preferredRegion: memberData.preferredRegion,
          tags: memberData.tags,
          customFields: memberData.customFields || {},
          consentEmail: memberData.consentEmail,
          consentSms: memberData.consentSms,
          consentGdprLoggedAt: memberData.consentEmail || memberData.consentSms ? new Date() : null,
        },
      });
      result.successful++;
    } catch (error: any) {
      result.failed++;
      result.errors.push({
        row: 0, // We'll need to track row numbers better
        reason: error.message || 'Erreur lors de la création du membre',
      });
    }
  }

  // Add parse errors
  result.errors.push(...parseResult.errors.map(e => ({ row: e.row, reason: e.reason })));
  result.failed += parseResult.errors.length;

  return result;
};
