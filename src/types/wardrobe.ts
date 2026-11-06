export type ClothingCategory =
  | 'Tops'
  | 'Bottoms'
  | 'Dresses'
  | 'Jackets'
  | 'Shoes'
  | 'Accessories';

export type Occasion =
  | 'Casual Wear'
  | 'Formal Wear'
  | 'Party Wear'
  | 'Date Night'
  | 'Work / Office'
  | 'Travel';

export interface ClothingItem {
  id: string;
  userId?: string;
  clothingName: string;
  imageUrl: string;
  category: ClothingCategory;
  clothingType: string;
  dominantColour: string;
  dominantColourHex: string;
  secondaryColours: string[];
  pattern: string;
  style: string;
  suitableOccasions: string[];
  fabricAndTexture?: string;
  pairingTips?: string;
  isFavorite: boolean;
  createdAt: string;
}

export interface OutfitRecommendation {
  id: string;
  title: string;
  occasion: string;
  itemIds: string[];
  items: ClothingItem[];
  explanation: string;
  colorCompatibilityExplanation: string;
  formalityScore: number;
  stylingNotes: string[];
  isFavorite?: boolean;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  stylePreference: string;
  joinedDate: string;
}

export interface SimilarityMatch {
  item: ClothingItem;
  similarityPercentage: number;
  matchReasons: string[];
}
