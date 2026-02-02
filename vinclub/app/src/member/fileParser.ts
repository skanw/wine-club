import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { e164PhoneRegex } from '../server/validation/member';

export interface ColumnMapping extends Record<string, any> {
  name?: string;
  email?: string;
  phone?: string;
  region?: string;
  tags?: string;
  consentEmail?: string;
  consentSms?: string;
  notes?: string;
  // Custom fields mapping: columnName -> customFieldName
  customFields?: Record<string, string>;
}

export interface ParseResult {
  valid: Array<{
    name: string;
    email: string | null;
    phone: string;
    preferredRegion: string | null;
    tags: string[];
    consentEmail: boolean;
    consentSms: boolean;
    notes?: string;
    customFields?: Record<string, any>;
  }>;
  errors: Array<{
    row: number;
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
 * Parse phone number to E.164 format
 */
export function normalizePhone(phone: string | number | undefined | null): string | null {
  if (!phone) return null;
  
  let phoneStr = String(phone).trim().replace(/\s+/g, '');
  
  // Remove common formatting
  phoneStr = phoneStr.replace(/[().-]/g, '');
  
  // If starts with 0, replace with +33 (France)
  if (phoneStr.startsWith('0') && phoneStr.length === 10) {
    phoneStr = '+33' + phoneStr.substring(1);
  }
  
  // If doesn't start with +, try to add country code
  if (!phoneStr.startsWith('+')) {
    // If looks like French number (10 digits), add +33
    if (/^\d{10}$/.test(phoneStr)) {
      phoneStr = '+33' + phoneStr.substring(1);
    } else if (/^\d{9}$/.test(phoneStr)) {
      // 9 digits, likely French mobile without leading 0
      phoneStr = '+33' + phoneStr;
    }
  }
  
  // Validate E.164 format
  if (e164PhoneRegex.test(phoneStr)) {
    return phoneStr;
  }
  
  return null;
}

/**
 * Parse consent flag from various formats
 */
export function parseConsentFlag(value: any): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  
  const str = String(value).toLowerCase().trim();
  
  if (['oui', 'yes', 'true', '1', 'ok', 'o', 'y'].includes(str)) {
    return true;
  }
  
  if (['non', 'no', 'false', '0', 'n', ''].includes(str)) {
    return false;
  }
  
  // Default to false if unclear
  return false;
}

/**
 * Parse tags from comma-separated string
 */
export function parseTags(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  
  const str = String(value).trim();
  if (!str) return [];
  
  return str
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
    .slice(0, 10); // Max 10 tags
}

/**
 * Parse Excel file and extract data
 */
export function parseExcelFile(
  fileBuffer: Buffer,
  columnMapping: ColumnMapping
): Array<Record<string, any>> {
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0]; // Use first sheet for members
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert to JSON
  const rows = XLSX.utils.sheet_to_json(worksheet, { defval: null });
  
  return rows as Array<Record<string, any>>;
}

/**
 * Parse CSV file and extract data
 */
export async function parseCsvFile(
  fileBuffer: Buffer,
  columnMapping: ColumnMapping
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
 * Parse members file (Excel or CSV) and validate data
 */
export async function parseMembersFile(
  fileBuffer: Buffer,
  fileName: string,
  columnMapping: ColumnMapping,
  caveId: string
): Promise<ParseResult> {
  const fileType = detectFileType(fileName);
  let rows: Array<Record<string, any>>;
  
  // Parse file based on type
  if (fileType === 'csv') {
    rows = await parseCsvFile(fileBuffer, columnMapping);
  } else {
    rows = parseExcelFile(fileBuffer, columnMapping);
  }
  
  const result: ParseResult = {
    valid: [],
    errors: [],
  };
  
  // Process each row
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNumber = i + 2; // +2 because header is row 1, and we're 0-indexed
    
    try {
      // Extract values using column mapping
      const name = columnMapping.name ? String(row[columnMapping.name] || '').trim() : '';
      const emailRaw = columnMapping.email ? row[columnMapping.email] : null;
      const phoneRaw = columnMapping.phone ? row[columnMapping.phone] : null;
      const regionRaw = columnMapping.region ? row[columnMapping.region] : null;
      const tagsRaw = columnMapping.tags ? row[columnMapping.tags] : null;
      const consentEmailRaw = columnMapping.consentEmail ? row[columnMapping.consentEmail] : false;
      const consentSmsRaw = columnMapping.consentSms ? row[columnMapping.consentSms] : false;
      
      // Validate required fields
      if (!name || name.length === 0) {
        result.errors.push({
          row: rowNumber,
          reason: 'Le nom est requis',
          data: row,
        });
        continue;
      }
      
      // Normalize phone
      const phone = normalizePhone(phoneRaw);
      if (!phone) {
        result.errors.push({
          row: rowNumber,
          reason: 'Le téléphone est invalide ou manquant (format requis: +33612345678)',
          data: row,
        });
        continue;
      }
      
      // Normalize email
      const email = emailRaw 
        ? String(emailRaw).trim().toLowerCase() || null
        : null;
      
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        result.errors.push({
          row: rowNumber,
          reason: 'Format d\'email invalide',
          data: row,
        });
        continue;
      }
      
      // Process optional fields
      const preferredRegion = regionRaw ? String(regionRaw).trim() || null : null;
      const tags = parseTags(tagsRaw);
      const consentEmail = parseConsentFlag(consentEmailRaw);
      const consentSms = parseConsentFlag(consentSmsRaw);
      
      // Extract custom fields: all columns not mapped to standard fields
      const customFields: Record<string, any> = {};
      const mappedColumns = new Set([
        columnMapping.name,
        columnMapping.email,
        columnMapping.phone,
        columnMapping.region,
        columnMapping.tags,
        columnMapping.consentEmail,
        columnMapping.consentSms,
        columnMapping.notes,
      ].filter(Boolean));
      
      // Get all columns from the row
      Object.keys(row).forEach((columnName) => {
        // If column is not mapped to a standard field, add it as custom field
        if (!mappedColumns.has(columnName)) {
          const customFieldName = columnMapping.customFields?.[columnName] || columnName;
          const value = row[columnName];
          // Only add non-empty values
          if (value !== null && value !== undefined && String(value).trim() !== '') {
            customFields[customFieldName] = String(value).trim();
          }
        }
      });
      
      result.valid.push({
        name: name,
        email: email,
        phone: phone,
        preferredRegion: preferredRegion,
        tags: tags,
        consentEmail: consentEmail,
        consentSms: consentSms,
        customFields: Object.keys(customFields).length > 0 ? customFields : undefined,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      result.errors.push({
        row: rowNumber,
        reason: `Erreur de traitement: ${errorMessage}`,
        data: row,
      });
    }
  }
  
  return result;
}
