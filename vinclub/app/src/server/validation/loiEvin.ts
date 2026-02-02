/**
 * Loi Evin content validation for campaign messages.
 * Prohibits wording that suggests lifestyle, social success, or sexual appeal.
 * French-only user-facing messages per PRD.
 */

export interface LoiEvinResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}

// Prohibited words/phrases (lifestyle, success, sexual appeal). To be refined with legal/research.
const PROHIBITED_PATTERNS: Array<{ pattern: RegExp | string; message: string }> = [
  { pattern: /\bparty\b/i, message: 'Le mot "party" n\'est pas conforme à la Loi Evin.' },
  { pattern: /\bfête\b/i, message: 'Le mot "fête" peut suggérer un contexte festif non factuel.' },
  { pattern: /\bsuccès\b/i, message: 'Le mot "succès" n\'est pas conforme (éviter la notion de succès social).' },
  { pattern: /\bsexy\b/i, message: 'Le mot "sexy" n\'est pas conforme à la Loi Evin.' },
  { pattern: /\bplaisir\b/i, message: 'Le mot "plaisir" en contexte promotionnel peut être non conforme.' },
  { pattern: /\bivresse\b/i, message: 'Référence à l\'ivresse non autorisée.' },
  { pattern: /\bsoûl\b/i, message: 'Référence à l\'alcoolisation non autorisée.' },
  { pattern: /\bdrunk\b/i, message: 'Référence à l\'alcoolisation non autorisée.' },
  { pattern: /\baddict/i, message: 'Référence à l\'addiction non autorisée.' },
  { pattern: /!\s*!\s*!/i, message: 'Trop d\'exclamations peut donner un ton promotionnel excessif.' },
];

// Heuristic: all-caps long stretch suggests shouting/promotional tone
const ALL_CAPS_REGEX = /[A-Z]{5,}/;

/**
 * Validates a campaign message against Loi Evin rules.
 * Returns valid/invalid and user-facing French error/warning messages.
 */
export function validateMessageLoiEvin(message: string): LoiEvinResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const normalized = message.trim();
  if (!normalized.length) {
    return { valid: false, errors: ['Le message ne peut pas être vide.'] };
  }

  for (const { pattern, message: msg } of PROHIBITED_PATTERNS) {
    const re = typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern;
    if (re.test(normalized)) {
      errors.push(msg);
    }
  }

  if (ALL_CAPS_REGEX.test(normalized)) {
    warnings.push('Évitez les passages en majuscules pour rester factuel.');
  }

  // Optional factual tone: we don't block if no product/price tokens; we only block prohibited content
  const valid = errors.length === 0;
  return {
    valid,
    ...(errors.length > 0 && { errors }),
    ...(warnings.length > 0 && { warnings }),
  };
}

export interface PlaceholderContext {
  productName?: string;
  productPrice?: number;
  caveName?: string;
  quantity?: string;
  month?: string;
  region?: string;
  appellation?: string;
  vintage?: string;
  tastingNotes?: string;
  count?: string | number;
}

const PLACEHOLDERS: Array<{ key: string; token: string }> = [
  { key: 'productName', token: '[Nom du vin]' },
  { key: 'productPrice', token: '[Prix]' },
  { key: 'caveName', token: '[Cave]' },
  { key: 'quantity', token: '[quantité]' },
  { key: 'month', token: '[mois]' },
  { key: 'region', token: '[région(s)]' },
  { key: 'appellation', token: '[Appellation]' },
  { key: 'vintage', token: '[Millésime]' },
  { key: 'tastingNotes', token: '[notes de dégustation]' },
  { key: 'count', token: '[Nombre]' },
];

/**
 * Replaces Evin template placeholders in a message with context values.
 * Used when creating a campaign from a template (server-side).
 */
export function substitutePlaceholders(
  message: string,
  context: PlaceholderContext
): string {
  let result = message;
  for (const { key, token } of PLACEHOLDERS) {
    const value = context[key as keyof PlaceholderContext];
    const str =
      value !== undefined && value !== null
        ? typeof value === 'number'
          ? String(value)
          : String(value)
        : token; // leave placeholder if missing
    result = result.split(token).join(str);
  }
  return result;
}
