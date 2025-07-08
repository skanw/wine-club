// French address validation using api-adresse.data.gouv.fr
// Compliant with French postal standards

export interface FrenchAddress {
  street: string;
  postalCode: string;
  city: string;
  country: string;
  department?: string;
  region?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  [key: string]: any; // Add index signature for Wasp compatibility
}

export interface AddressValidationResult {
  isValid: boolean;
  suggestions: FrenchAddress[];
  normalizedAddress?: FrenchAddress;
  errors: string[];
  [key: string]: any; // Add index signature for Wasp compatibility
}

export interface AdresseAPIResponse {
  features: Array<{
    properties: {
      label: string;
      score: number;
      housenumber?: string;
      street: string;
      postcode: string;
      city: string;
      context: string;
      type: string;
      geometry: {
        coordinates: [number, number];
      };
    };
  }>;
}

export async function validateFrenchAddress(
  address: Partial<FrenchAddress>
): Promise<AddressValidationResult> {
  const errors: string[] = [];
  const suggestions: FrenchAddress[] = [];

  // Basic validation
  if (!address.postalCode) {
    errors.push('Code postal requis');
  } else if (!/^[0-9]{5}$/.test(address.postalCode)) {
    errors.push('Code postal invalide (format: 75001)');
  }

  if (!address.city) {
    errors.push('Ville requise');
  }

  if (!address.street) {
    errors.push('Adresse requise');
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      suggestions: [],
      errors
    };
  }

  try {
    // Call French government API
    const query = encodeURIComponent(`${address.street}, ${address.postalCode} ${address.city}`);
    const response = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${query}&limit=5`
    );

    if (!response.ok) {
      throw new Error('Erreur lors de la validation de l\'adresse');
    }

    const data: AdresseAPIResponse = await response.json();

    if (data.features.length === 0) {
      return {
        isValid: false,
        suggestions: [],
        errors: ['Adresse non trouvée']
      };
    }

    // Convert API response to our format
    const normalizedAddress: FrenchAddress = {
      street: data.features[0].properties.street,
      postalCode: data.features[0].properties.postcode,
      city: data.features[0].properties.city,
      country: 'FR',
      coordinates: {
        lat: data.features[0].properties.geometry.coordinates[1],
        lng: data.features[0].properties.geometry.coordinates[0]
      }
    };

    // Extract department and region from context
    const context = data.features[0].properties.context;
    const contextParts = context.split(', ');
    if (contextParts.length >= 2) {
      normalizedAddress.department = contextParts[0];
      normalizedAddress.region = contextParts[1];
    }

    // Generate suggestions
    suggestions.push(...data.features.slice(1).map(feature => ({
      street: feature.properties.street,
      postalCode: feature.properties.postcode,
      city: feature.properties.city,
      country: 'FR',
      coordinates: {
        lat: feature.properties.geometry.coordinates[1],
        lng: feature.properties.geometry.coordinates[0]
      }
    })));

    return {
      isValid: true,
      suggestions,
      normalizedAddress,
      errors: []
    };

  } catch (error) {
    return {
      isValid: false,
      suggestions: [],
      errors: ['Erreur de validation: ' + (error as Error).message]
    };
  }
}

export function formatFrenchAddress(address: FrenchAddress): string {
  const parts = [
    address.street,
    address.postalCode,
    address.city
  ].filter(Boolean);

  return parts.join(', ');
}

export function getFrenchDepartments(): Record<string, string> {
  return {
    '01': 'Ain',
    '02': 'Aisne',
    '03': 'Allier',
    '04': 'Alpes-de-Haute-Provence',
    '05': 'Hautes-Alpes',
    '06': 'Alpes-Maritimes',
    '07': 'Ardèche',
    '08': 'Ardennes',
    '09': 'Ariège',
    '10': 'Aube',
    '11': 'Aude',
    '12': 'Aveyron',
    '13': 'Bouches-du-Rhône',
    '14': 'Calvados',
    '15': 'Cantal',
    '16': 'Charente',
    '17': 'Charente-Maritime',
    '18': 'Cher',
    '19': 'Corrèze',
    '21': 'Côte-d\'Or',
    '22': 'Côtes-d\'Armor',
    '23': 'Creuse',
    '24': 'Dordogne',
    '25': 'Doubs',
    '26': 'Drôme',
    '27': 'Eure',
    '28': 'Eure-et-Loir',
    '29': 'Finistère',
    '2A': 'Corse-du-Sud',
    '2B': 'Haute-Corse',
    '30': 'Gard',
    '31': 'Haute-Garonne',
    '32': 'Gers',
    '33': 'Gironde',
    '34': 'Hérault',
    '35': 'Ille-et-Vilaine',
    '36': 'Indre',
    '37': 'Indre-et-Loire',
    '38': 'Isère',
    '39': 'Jura',
    '40': 'Landes',
    '41': 'Loir-et-Cher',
    '42': 'Loire',
    '43': 'Haute-Loire',
    '44': 'Loire-Atlantique',
    '45': 'Loiret',
    '46': 'Lot',
    '47': 'Lot-et-Garonne',
    '48': 'Lozère',
    '49': 'Maine-et-Loire',
    '50': 'Manche',
    '51': 'Marne',
    '52': 'Haute-Marne',
    '53': 'Mayenne',
    '54': 'Meurthe-et-Moselle',
    '55': 'Meuse',
    '56': 'Morbihan',
    '57': 'Moselle',
    '58': 'Nièvre',
    '59': 'Nord',
    '60': 'Oise',
    '61': 'Orne',
    '62': 'Pas-de-Calais',
    '63': 'Puy-de-Dôme',
    '64': 'Pyrénées-Atlantiques',
    '65': 'Hautes-Pyrénées',
    '66': 'Pyrénées-Orientales',
    '67': 'Bas-Rhin',
    '68': 'Haut-Rhin',
    '69': 'Rhône',
    '70': 'Haute-Saône',
    '71': 'Saône-et-Loire',
    '72': 'Sarthe',
    '73': 'Savoie',
    '74': 'Haute-Savoie',
    '75': 'Paris',
    '76': 'Seine-Maritime',
    '77': 'Seine-et-Marne',
    '78': 'Yvelines',
    '79': 'Deux-Sèvres',
    '80': 'Somme',
    '81': 'Tarn',
    '82': 'Tarn-et-Garonne',
    '83': 'Var',
    '84': 'Vaucluse',
    '85': 'Vendée',
    '86': 'Vienne',
    '87': 'Haute-Vienne',
    '88': 'Vosges',
    '89': 'Yonne',
    '90': 'Territoire de Belfort',
    '91': 'Essonne',
    '92': 'Hauts-de-Seine',
    '93': 'Seine-Saint-Denis',
    '94': 'Val-de-Marne',
    '95': 'Val-d\'Oise',
    '971': 'Guadeloupe',
    '972': 'Martinique',
    '973': 'Guyane',
    '974': 'La Réunion',
    '976': 'Mayotte'
  };
}

export function getDepartmentFromPostalCode(postalCode: string): string | null {
  const departmentCode = postalCode.substring(0, 2);
  const departments = getFrenchDepartments();
  return departments[departmentCode] || null;
} 