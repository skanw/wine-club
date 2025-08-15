import { HttpError } from 'wasp/server';

interface Wine {
  id: string;
  name: string;
  description?: string;
  price: number;
  varietal?: string;
  vintage?: string;
  averageRating?: number;
  ratings: Array<{ rating: number }>;
  metadata?: Record<string, any>;
}

interface WineRecommendation {
  id: string;
  name: string;
  varietal?: string;
  vintage?: string;
  price: number;
  averageRating?: number;
  recommendationScore: number;
  description?: string;
  [key: string]: any; // Index signature for Wasp Payload compatibility
}

export const generateWineRecommendations = async (args: { 
  memberId: string; 
  wineCaveId?: string; 
  limit?: number; 
}, context: any): Promise<WineRecommendation[]> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  try {
    // Get member preferences
    const memberPreferences = await context.entities.MemberPreferences.findUnique({
      where: { memberId: args.memberId },
    });

    // Get candidate wines based on preferences
    const whereClause: any = {};
    if (args.wineCaveId) {
      whereClause.wineCaveId = args.wineCaveId;
    }

    const candidateWines = await context.entities.Wine.findMany({
      where: whereClause,
      include: {
        ratings: true,
      },
    }) as Wine[];

    // Score wines based on preferences and ratings
    const scoredWines = candidateWines.map((wine: Wine) => {
      let score = 0;

      // Base score from average rating
      let averageRating = 0;
      if (wine.ratings && wine.ratings.length > 0) {
        averageRating = wine.ratings.reduce((sum: number, rating: { rating: number }) => sum + rating.rating, 0) / wine.ratings.length;
        score += averageRating * 2; // Weight ratings heavily
      }

      // Preference matching (if we have member preferences)
      if (memberPreferences) {
        // Add preference-based scoring logic here
        // This is a simplified version - you'd want more sophisticated matching
        if (memberPreferences.preferredPriceRange && 
            wine.price >= memberPreferences.preferredPriceRange.min && 
            wine.price <= memberPreferences.preferredPriceRange.max) {
          score += 5;
        }
      }

      return {
        id: wine.id,
        name: wine.name,
        varietal: wine.varietal,
        vintage: wine.vintage,
        price: wine.price,
        averageRating,
        recommendationScore: score,
        description: wine.description,
      };
    });

    // Sort by recommendation score and return top results
    return scoredWines
      .sort((a: WineRecommendation, b: WineRecommendation) => b.recommendationScore - a.recommendationScore)
      .slice(0, args.limit || 10);

  } catch (error) {
    throw new HttpError(500, 'Failed to generate wine recommendations');
  }
};

export const generateTastingNotes = async (args: { 
  wineId: string; 
  memberId: string; 
}, context: any): Promise<{ notes: string; pairings: string[] }> => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  try {
    // Get wine details
    const wine = await context.entities.Wine.findUnique({
      where: { id: args.wineId },
      include: {
        ratings: true,
      },
    }) as Wine;

    if (!wine) {
      throw new HttpError(404, 'Wine not found');
    }

    // Calculate average rating
    const avgRating = wine.ratings && wine.ratings.length > 0
      ? wine.ratings.reduce((sum: number, rating: { rating: number }) => sum + rating.rating, 0) / wine.ratings.length
      : 0;

    // Generate tasting notes based on wine characteristics
    // This is a simplified version - in production, you'd use AI/ML models
    const notes = `This ${wine.name} offers a complex bouquet with notes of dark fruit, 
    subtle oak, and a hint of spice. The palate is well-balanced with smooth tannins 
    and a lingering finish. Average rating: ${avgRating.toFixed(1)}/5.`;

    const pairings = [
      'Grilled red meats',
      'Aged cheeses',
      'Dark chocolate',
      'Herb-roasted vegetables'
    ];

    return {
      notes,
      pairings,
    };

  } catch (error) {
    throw new HttpError(500, 'Failed to generate tasting notes');
  }
};

export const updateMemberPreferences = async (args: {
  memberId: string;
  preferences: {
    wineTypes?: string[];
    priceRangeMin?: number;
    priceRangeMax?: number;
    excludeVarietals?: string[];
    includeVarietals?: string[];
    specialRequests?: string;
  };
}, context: any): Promise<any> => {
  if (!context.user) throw new HttpError(401, 'User not authenticated');

  try {
    return await context.entities.MemberPreferences.upsert({
      where: { memberId: args.memberId },
      update: args.preferences,
      create: { memberId: args.memberId, ...args.preferences },
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw new HttpError(500, 'Failed to update preferences');
  }
}; 