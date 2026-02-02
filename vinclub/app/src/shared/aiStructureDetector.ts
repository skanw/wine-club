import OpenAI from 'openai';

// Lazy-load OpenAI client to avoid requiring API key at startup
let _openai: OpenAI | undefined = undefined;

function getOpenAIClient(): OpenAI {
  if (!_openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured. Please set it in your environment variables.');
    }
    _openai = new OpenAI({
      apiKey,
    });
  }
  return _openai;
}

export type FileType = 'members' | 'inventory';

export interface ColumnMapping extends Record<string, any> {
  name?: string;
  email?: string;
  phone?: string;
  region?: string;
  tags?: string;
  consentEmail?: string;
  consentSms?: string;
  notes?: string;
  customFields?: Record<string, string>; // columnName -> customFieldName
}

export interface SheetMapping {
  sheetName: string;
  columns: ColumnMapping;
  confidence: Record<string, number>;
  [key: string]: any; // Index signature for SuperJSON compatibility
}

export interface StructureDetectionResult {
  mappings: SheetMapping[];
  fileType: FileType;
  hasHeaders: boolean;
}

/**
 * Detect spreadsheet structure using AI
 * Analyzes Excel/CSV files to automatically identify column mappings
 */
export async function detectSpreadsheetStructure(
  file: Buffer,
  fileType: FileType,
  sheetNames?: string[]
): Promise<StructureDetectionResult> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  // Extract sample data from file (first 20 rows)
  // For now, we'll pass file metadata and let AI analyze
  // In practice, you'd parse the file first to extract sample rows

  const prompt = fileType === 'members' 
    ? getMembersPrompt(sheetNames)
    : getInventoryPrompt(sheetNames);

  try {
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at analyzing spreadsheet structures. Return only valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const response = JSON.parse(completion.choices[0]?.message?.content || '{}');
    
    // Transform AI response to our format
    return {
      mappings: response.mappings || [],
      fileType,
      hasHeaders: response.hasHeaders ?? true,
    };
  } catch (error: unknown) {
    console.error('AI structure detection error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to detect structure: ${errorMessage}`);
  }
}

function getMembersPrompt(sheetNames?: string[]): string {
  return `
Analyze this client/member spreadsheet and identify the column structure.
${sheetNames ? `Sheet(s): ${sheetNames.join(', ')}` : 'Single sheet/CSV file'}

Identify which columns contain:
- Name (Nom, Name, Nom complet, Full Name, Client Name)
- Email (Email, E-mail, Mail, Courriel)
- Phone (Téléphone, Phone, Tel, Mobile, Portable) - may include country codes
- Region (Région, Region, Preferred Region, Région préférée)
- Tags (Tags, Labels, Catégories, Categories) - may be comma-separated
- Email consent (Email Consent, Consent Email, Consentement Email, OK Email, Email OK)
- SMS consent (SMS Consent, Consent SMS, Consentement SMS, OK SMS, SMS OK)
- Notes/Description (Notes, Description, Commentaires, Remarks)

Return JSON in this format:
{
  "hasHeaders": true,
  "mappings": [
    {
      "sheetName": "Sheet1",
      "columns": {
        "name": "Nom",
        "email": "Email",
        "phone": "Téléphone",
        "region": "Région",
        "tags": "Tags",
        "consentEmail": "OK Email",
        "consentSms": "OK SMS"
      },
      "confidence": {
        "name": 0.95,
        "email": 0.98,
        "phone": 0.92
      }
    }
  ]
}

If file has multiple sheets, analyze each sheet separately.
`;
}

function getInventoryPrompt(sheetNames?: string[]): string {
  return `
Analyze this wine inventory spreadsheet and identify the column structure.
${sheetNames ? `Sheet(s): ${sheetNames.join(', ')}` : 'Single sheet/CSV file'}

For each sheet, identify which columns contain:
- Wine name (Nom, Name, Nom du vin, Wine Name, Produit, Product)
- Vintage (Millésime, Vintage, Year, Année)
- Region (Région, Region, AOC, Appellation)
- Price (Prix, Price, €, EUR, Prix unitaire, Unit Price)
- Stock quantity (Stock, Quantity, Quantité, Available, Qty)
- Wine type (Type, Type de vin, Red/White/Rosé, Rouge/Blanc/Rosé)
- Description (Description, Notes, Commentaires, Remarks)

Return JSON in this format:
{
  "hasHeaders": true,
  "mappings": [
    {
      "sheetName": "Rouges",
      "columns": {
        "name": "Nom du vin",
        "vintage": "Millésime",
        "region": "Région",
        "price": "Prix",
        "stockQuantity": "Stock",
        "wineType": "Type",
        "description": "Description"
      },
      "confidence": {
        "name": 0.95,
        "vintage": 0.90,
        "price": 0.98
      }
    }
  ]
}

If file has multiple sheets, analyze each sheet separately.
`;
}

/**
 * Analyze actual file content and return structure
 * This function parses the file first, then sends sample data to AI
 */
export async function detectStructureFromContent(
  sampleRows: Record<string, any>[],
  headers: string[],
  fileType: FileType,
  sheetName?: string
): Promise<SheetMapping> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const prompt = fileType === 'members'
    ? getMembersAnalysisPrompt(headers, sampleRows)
    : getInventoryAnalysisPrompt(headers, sampleRows, sheetName);

  try {
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at analyzing spreadsheet structures. Return only valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const response = JSON.parse(completion.choices[0]?.message?.content || '{}');
    
    return {
      sheetName: sheetName || 'Sheet1',
      columns: response.columns || {},
      confidence: response.confidence || {},
    };
  } catch (error: unknown) {
    console.error('AI structure detection error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to detect structure: ${errorMessage}`);
  }
}

function getMembersAnalysisPrompt(headers: string[], sampleRows: Record<string, any>[]): string {
  return `
Analyze this client/member spreadsheet structure.

Headers: ${JSON.stringify(headers)}

Sample data (first 5 rows):
${JSON.stringify(sampleRows.slice(0, 5), null, 2)}

Identify which columns contain:
- Name (Nom, Name, Nom complet, Full Name, Client Name)
- Email (Email, E-mail, Mail, Courriel)
- Phone (Téléphone, Phone, Tel, Mobile, Portable) - may include country codes
- Region (Région, Region, Preferred Region, Région préférée)
- Tags (Tags, Labels, Catégories, Categories) - may be comma-separated
- Email consent (Email Consent, Consent Email, Consentement Email, OK Email, Email OK)
- SMS consent (SMS Consent, Consent SMS, Consentement SMS, OK SMS, SMS OK)
- Notes/Description (Notes, Description, Commentaires, Remarks)

Return JSON:
{
  "columns": {
    "name": "Nom",
    "email": "Email",
    "phone": "Téléphone",
    "region": "Région",
    "tags": "Tags",
    "consentEmail": "OK Email",
    "consentSms": "OK SMS"
  },
  "confidence": {
    "name": 0.95,
    "email": 0.98,
    "phone": 0.92
  }
}

Only include fields that were detected. Use null for missing fields.
`;
}

function getInventoryAnalysisPrompt(
  headers: string[],
  sampleRows: Record<string, any>[],
  sheetName?: string
): string {
  return `
Analyze this wine inventory spreadsheet structure.
${sheetName ? `Sheet name: ${sheetName}` : ''}

Headers: ${JSON.stringify(headers)}

Sample data (first 5 rows):
${JSON.stringify(sampleRows.slice(0, 5), null, 2)}

Identify which columns contain:
- Wine name (Nom, Name, Nom du vin, Wine Name, Produit, Product)
- Vintage (Millésime, Vintage, Year, Année)
- Region (Région, Region, AOC, Appellation)
- Price (Prix, Price, €, EUR, Prix unitaire, Unit Price)
- Stock quantity (Stock, Quantity, Quantité, Available, Qty)
- Wine type (Type, Type de vin, Red/White/Rosé, Rouge/Blanc/Rosé)
- Description (Description, Notes, Commentaires, Remarks)

Return JSON:
{
  "columns": {
    "name": "Nom du vin",
    "vintage": "Millésime",
    "region": "Région",
    "price": "Prix",
    "stockQuantity": "Stock",
    "wineType": "Type",
    "description": "Description"
  },
  "confidence": {
    "name": 0.95,
    "vintage": 0.90,
    "price": 0.98
  }
}

Only include fields that were detected. Use null for missing fields.
`;
}
