// French TVA (VAT) utilities for compliant invoicing
// Compliant with Article 289 du CGI (Code Général des Impôts)

export interface TVARate {
  rate: number;
  description: string;
  code: string;
}

export const FRENCH_TVA_RATES: Record<string, TVARate> = {
  'standard': {
    rate: 20.0,
    description: 'TVA standard',
    code: 'TVA20'
  },
  'reduced': {
    rate: 10.0,
    description: 'TVA réduite',
    code: 'TVA10'
  },
  'super_reduced': {
    rate: 5.5,
    description: 'TVA super réduite',
    code: 'TVA5.5'
  },
  'zero': {
    rate: 0.0,
    description: 'TVA zéro',
    code: 'TVA0'
  }
};

export interface InvoiceLine {
  description: string;
  quantity: number;
  unitPrice: number;
  tvaRate: string;
  tvaAmount: number;
  totalHT: number;
  totalTTC: number;
}

export interface FrenchInvoice {
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  supplier: {
    name: string;
    address: string;
    siret: string;
    tvaNumber: string;
  };
  customer: {
    name: string;
    address: string;
    email: string;
  };
  lines: InvoiceLine[];
  subtotalHT: number;
  totalTVA: number;
  totalTTC: number;
  paymentTerms: string;
  legalMentions: string[];
}

export function calculateTVA(amountHT: number, tvaRate: string): number {
  const rate = FRENCH_TVA_RATES[tvaRate]?.rate || 20.0;
  return Math.round(amountHT * (rate / 100) * 100) / 100;
}

export function calculateTTC(amountHT: number, tvaRate: string): number {
  const tva = calculateTVA(amountHT, tvaRate);
  return amountHT + tva;
}

export function generateInvoiceNumber(prefix: string = 'FACT'): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${year}${month}-${random}`;
}

export function getLegalMentions(): string[] {
  return [
    "Conformément à l'article 289 du CGI, cette facture est obligatoire.",
    "TVA non applicable, art. 293 B du CGI (pour les entreprises non assujetties).",
    "En cas de retard de paiement, une pénalité de 3 fois le taux d'intérêt légal sera appliquée.",
    "Aucun escompte en cas de paiement anticipé.",
    "En cas de litige, les tribunaux français sont seuls compétents."
  ];
}

export function formatFrenchCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(amount);
}

export function formatFrenchDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

// Alias for backward compatibility
export const calculateTva = calculateTVA;

export function getTvaRates(): Record<string, TVARate> {
  return FRENCH_TVA_RATES;
}

export function generateInvoice(data: {
  supplier: FrenchInvoice['supplier'];
  customer: FrenchInvoice['customer'];
  lines: Omit<InvoiceLine, 'tvaAmount' | 'totalHT' | 'totalTTC'>[];
  paymentTerms?: string;
}): FrenchInvoice {
  const invoiceNumber = generateInvoiceNumber();
  const date = new Date();
  const dueDate = new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

  const lines: InvoiceLine[] = data.lines.map(line => {
    const totalHT = line.quantity * line.unitPrice;
    const tvaAmount = calculateTVA(totalHT, line.tvaRate);
    const totalTTC = totalHT + tvaAmount;
    
    return {
      ...line,
      tvaAmount,
      totalHT,
      totalTTC
    };
  });

  const subtotalHT = lines.reduce((sum, line) => sum + line.totalHT, 0);
  const totalTVA = lines.reduce((sum, line) => sum + line.tvaAmount, 0);
  const totalTTC = subtotalHT + totalTVA;

  return {
    invoiceNumber,
    date,
    dueDate,
    supplier: data.supplier,
    customer: data.customer,
    lines,
    subtotalHT,
    totalTVA,
    totalTTC,
    paymentTerms: data.paymentTerms || 'Paiement à 30 jours',
    legalMentions: getLegalMentions()
  };
} 