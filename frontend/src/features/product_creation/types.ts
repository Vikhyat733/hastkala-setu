import { Language } from '../../translations';

export type SellStep =
  | 'camera'
  | 'studio'
  | 'voice'
  | 'catalog'
  | 'pricing'
  | 'preview';

export interface ProductCreationState {
  image: string;
  enhancedImage: string;
  voiceTranscript: string;
  language: Language;
  title: string;
  titleMarathi?: string;
  titleBengali?: string;
  descriptionHindi: string;
  descriptionEnglish: string;
  descriptionMarathi?: string;
  descriptionBengali?: string;
  category: string;
  material: string;
  craftType: string;
  keywords: string[];
  confidence?: number;
  isAiAnalyzed?: boolean;
  isDevFallback?: boolean;
  confirmationQuestion?: string;
  manuallyEditedFields?: Record<string, boolean>;
  estimatedMaterialCost: number;
  estimatedMakingCost: number;
  suggestedPrice: number;
  finalPrice: number;
  status: 'draft' | 'published';
}


export const INITIAL_PRODUCT_CREATION_STATE: ProductCreationState = {
  image: '',
  enhancedImage: '',
  voiceTranscript: '',
  language: 'hi',
  title: '',
  descriptionHindi: '',
  descriptionEnglish: '',
  category: '',
  material: '',
  craftType: '',
  keywords: [],
  estimatedMaterialCost: 0,
  estimatedMakingCost: 0,
  suggestedPrice: 0,
  finalPrice: 0,
  status: 'draft',
};

