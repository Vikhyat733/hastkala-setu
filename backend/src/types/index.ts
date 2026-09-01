export type SupportedLanguage = 'en' | 'hi' | 'bn' | 'te' | 'ta' | 'mr' | 'gu' | 'kn';

export interface MultilingualText {
  [key: string]: string | undefined;
  en: string;
  hi: string;
  bn?: string;
  te?: string;
  ta?: string;
  mr?: string;
  gu?: string;
  kn?: string;
}

export interface ArtisanProfile {
  id: string;
  name: string;
  avatar: string;
  village: string;
  state: string;
  craftSpecialty: string;
  experienceYears: number;
  bio: MultilingualText;
  verified: boolean;
  giCertifiedArtisan: boolean;
  nationalAwardee?: boolean;
  totalProductsSold: number;
  rating: number;
  storyQuote: string;
}

export interface CraftPriceBreakdown {
  rawMaterialCost: number;
  artisanLaborHours: number;
  hourlyFairWageRate: number;
  fairLaborCost: number;
  packagingAndLogistics: number;
  suggestedPrice: number;
  minPrice: number;
  artisanDirectSharePercent: number;
}

export interface ProductReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  title: MultilingualText;
  shortDescription: MultilingualText;
  fullStory: MultilingualText;
  category: 'pottery' | 'paintings' | 'textiles' | 'woodcraft' | 'metalwork' | 'jewelry' | 'homedecor' | 'leathercraft';
  price: number;
  originalPrice?: number;
  images: string[];
  artisan: ArtisanProfile;
  originState: string;
  originRegion: string;
  giTagStatus: {
    hasGiTag: boolean;
    giTagNumber?: string;
    registeredName?: string;
  };
  materialsUsed: string[];
  craftTechnique: string;
  dimensions?: string;
  weight?: string;
  productionTimeDays: number;
  ecoFriendly: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  priceBreakdown: CraftPriceBreakdown;
  socialBlurbs?: {
    whatsapp: string;
    instagram: string;
  };
  audioNarrationUrl?: string;
  tags: string[];
  createdAt: string;
  isAiGenerated?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  artisanTip: number;
  discount: number;
  deliveryFee: number;
  total: number;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: 'upi' | 'card' | 'cod';
  paymentStatus: 'completed' | 'pending';
  orderDate: string;
  estimatedDelivery: string;
  trackingNumber: string;
}

export interface AIVisionResult {
  title: MultilingualText;
  category: Product['category'];
  craftTechnique: string;
  materials: string[];
  originRegion: string;
  originState: string;
  hasGiTag: boolean;
  giTagName?: string;
  priceBreakdown: CraftPriceBreakdown;
  shortDescription: MultilingualText;
  fullStory: MultilingualText;
  careInstructions: string;
  socialBlurbWhatsApp: string;
  socialBlurbInstagram: string;
  confidenceScore: number;
  detectedVisualFeatures: string[];
  rawGeminiResponse?: string;
}
