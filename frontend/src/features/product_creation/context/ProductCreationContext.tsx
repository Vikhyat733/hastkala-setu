import React, { createContext, useContext, useState, useCallback } from 'react';
import { SellStep, ProductCreationState, INITIAL_PRODUCT_CREATION_STATE } from '../types';
import { imageEnhancementService } from '../../../services/ai/imageEnhancementService';
import { voiceCatalogService } from '../../../services/ai/voiceCatalogService';
import { pricingService } from '../../../services/ai/pricingService';
import { productService } from '../../../services/products/productService';
import { Language } from '../../../translations';

interface ProductCreationContextType {
  currentStep: SellStep;
  setStep: (step: SellStep) => void;
  state: ProductCreationState;
  updateState: (updates: Partial<ProductCreationState>) => void;
  resetState: () => void;

  // Step actions
  setImageAndEnhance: (imageDataUrl: string) => Promise<boolean>;
  retakeImage: () => void;

  // Voice: start/stop recognition (returns actual transcript via callback)
  startVoiceRecognition: (lang: Language) => Promise<void>;
  stopVoiceRecognition: () => void;
  isRecognitionSupported: boolean;

  generateCatalogFromVoice: (transcriptOverride?: string) => Promise<boolean>;
  calculatePricing: () => Promise<void>;
  publishToMarket: () => Promise<boolean>;

  // Loading & state flags
  isEnhancing: boolean;
  isRecording: boolean;
  isTranscribing: boolean;
  isGeneratingCatalog: boolean;
  isCalculatingPrice: boolean;
  isPublishing: boolean;

  enhancementOperations: string[];
  enhancementIsDevFallback: boolean;
  pricingExplanationHindi: string;
  pricingExplanationEnglish: string;

  // Errors
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
  clearError: () => void;
}

const ProductCreationContext = createContext<ProductCreationContextType | undefined>(undefined);

export const ProductCreationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setStep] = useState<SellStep>('camera');
  const [state, setState] = useState<ProductCreationState>(INITIAL_PRODUCT_CREATION_STATE);

  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGeneratingCatalog, setIsGeneratingCatalog] = useState(false);
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const [enhancementOperations, setEnhancementOperations] = useState<string[]>([]);
  const [enhancementIsDevFallback, setEnhancementIsDevFallback] = useState(true);
  const [pricingExplanationHindi, setPricingExplanationHindi] = useState('इस कीमत पर आपको अच्छा मुनाफा मिल सकता है।');
  const [pricingExplanationEnglish, setPricingExplanationEnglish] = useState('At this price, you can earn a healthy artisan profit.');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const clearError = () => setErrorMessage(null);

  const isRecognitionSupported = voiceCatalogService.isSpeechRecognitionSupported();

  const updateState = useCallback((updates: Partial<ProductCreationState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetState = useCallback(() => {
    setState(INITIAL_PRODUCT_CREATION_STATE);
    setStep('camera');
    setErrorMessage(null);
    setEnhancementOperations([]);
  }, []);

  // ─── IMAGE: Real enhancement pipeline ────────────────────────────────────────
  const setImageAndEnhance = async (imageDataUrl: string): Promise<boolean> => {
    setIsEnhancing(true);
    clearError();
    updateState({ image: imageDataUrl, enhancedImage: '' });

    try {
      const result = await imageEnhancementService.enhanceImage(imageDataUrl);

      if (result.success) {
        updateState({ enhancedImage: result.enhancedImage });
        setEnhancementOperations(result.operationsApplied);
        setEnhancementIsDevFallback(result.isDevFallback);
        setIsEnhancing(false);
        setStep('studio');
        return true;
      } else {
        // Enhancement technically failed but we still move forward with original
        updateState({ enhancedImage: imageDataUrl });
        setEnhancementOperations(['Original image — enhancement encountered an error']);
        setEnhancementIsDevFallback(true);
        setIsEnhancing(false);
        setStep('studio');
        return true;
      }
    } catch {
      setErrorMessage('फोटो तैयार नहीं हो सकी। फिर से कोशिश करें।');
      updateState({ enhancedImage: imageDataUrl });
      setEnhancementIsDevFallback(true);
      setIsEnhancing(false);
      setStep('studio');
      return false;
    }
  };

  const retakeImage = () => {
    updateState({ image: '', enhancedImage: '' });
    setEnhancementOperations([]);
    setStep('camera');
  };

  // ─── VOICE: Real browser SpeechRecognition ────────────────────────────────────
  const startVoiceRecognition = async (lang: Language): Promise<void> => {
    clearError();
    setIsRecording(true);
    setIsTranscribing(false);

    // Update language in state
    updateState({ language: lang, voiceTranscript: '' });

    try {
      // This calls the real browser SpeechRecognition API
      const result = await voiceCatalogService.startRecognition(lang);

      setIsRecording(false);
      setIsTranscribing(true);

      if (!result.success) {
        // NEVER fabricate — show actual localized error
        const errorMsg =
          lang === 'mr'
            ? (result.errorMarathi || result.errorHindi || 'आम्हाला तुमचा आवाज समजला नाही. कृपया पुन्हा बोला.')
            : lang === 'bn'
            ? (result.errorBengali || result.errorHindi || 'আমরা আপনার কথা বুঝতে পারিনি। অনুগ্রহ করে আবার বলুন।')
            : lang === 'hi'
            ? (result.errorHindi || 'हम आपकी आवाज़ समझ नहीं पाए। कृपया फिर से बोलें।')
            : (result.errorEnglish || "We couldn't understand your voice. Please try again.");
        setErrorMessage(errorMsg);
        updateState({ voiceTranscript: '' });
      } else {
        // Real transcript from the user's actual speech
        updateState({ voiceTranscript: result.transcript, language: lang });
      }
    } catch (err) {
      const genericError =
        lang === 'mr'
          ? 'आवाज ओळखण्यात त्रुटी आली. कृपया पुन्हा प्रयत्न करा.'
          : lang === 'bn'
          ? 'ভয়েস রিকগনিশনে ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
          : lang === 'hi'
          ? 'आवाज़ पहचान में समस्या हुई। कृपया पुनः प्रयास करें।'
          : 'Speech recognition error. Please try again.';
      setErrorMessage(genericError);
      updateState({ voiceTranscript: '' });
    } finally {
      setIsRecording(false);
      setIsTranscribing(false);
    }
  };

  const stopVoiceRecognition = (): void => {
    voiceCatalogService.stopRecognition();
    // Recognition will settle via its onend callback
  };

  // ─── CATALOG: Generate from actual image + transcript ─────────────────────────
  const generateCatalogFromVoice = async (transcriptOverride?: string): Promise<boolean> => {
    const textToUse = transcriptOverride || state.voiceTranscript;

    if (!textToUse.trim()) {
      setErrorMessage(
        state.language === 'hi'
          ? 'जानकारी तैयार करने के लिए पहले कुछ बोलें।'
          : 'Please record your voice before generating details.'
      );
      return false;
    }

    setIsGeneratingCatalog(true);
    clearError();

    try {
      const activeImage = state.enhancedImage || state.image || '';
      const result = await voiceCatalogService.generateCatalog(textToUse, state.language, activeImage);

      if (result.success) {
        // Preserve manual edits if user previously edited any field
        const manual = state.manuallyEditedFields || {};
        updateState({
          title: manual.title ? state.title : (result.title || state.title),
          category: manual.category ? state.category : (result.category || state.category),
          material: manual.material ? state.material : (result.material || state.material),
          craftType: manual.craftType ? state.craftType : (result.craftType || state.craftType),
          descriptionHindi: manual.descriptionHindi ? state.descriptionHindi : (result.descriptionHindi || state.descriptionHindi),
          descriptionEnglish: manual.descriptionEnglish ? state.descriptionEnglish : (result.descriptionEnglish || state.descriptionEnglish),
          keywords: manual.keywords ? state.keywords : (result.keywords.length ? result.keywords : state.keywords),
          confidence: result.confidence,
          isAiAnalyzed: result.isAiAnalyzed,
          isDevFallback: result.isDevFallback,
          confirmationQuestion: result.confirmationQuestion,
        });
      } else {
        // Catalog generation failed — user can still fill manually on catalog screen
        updateState({
          descriptionHindi: state.language === 'hi' ? textToUse : state.descriptionHindi,
          descriptionEnglish: state.language === 'en' ? textToUse : state.descriptionEnglish,
        });
        setErrorMessage(
          state.language === 'hi'
            ? 'जानकारी तैयार नहीं हो सकी। आप नीचे खुद भर सकते हैं।'
            : 'Could not auto-fill details. You can fill them manually below.'
        );
      }
    } catch {
      setErrorMessage(
        state.language === 'hi'
          ? 'जानकारी तैयार नहीं हो सकी। फिर से कोशिश करें।'
          : 'Could not generate details. Please try again.'
      );
    } finally {
      setIsGeneratingCatalog(false);
      setStep('catalog');
    }

    return true;
  };


  // ─── PRICING ─────────────────────────────────────────────────────────────────
  const calculatePricing = async (): Promise<void> => {
    setIsCalculatingPrice(true);
    try {
      const pricing = await pricingService.getSuggestedPrice({
        title: state.title,
        category: state.category,
        material: state.material,
        craftType: state.craftType,
        description: state.language === 'en' ? state.descriptionEnglish : state.descriptionHindi,
        rawMaterialCost: state.estimatedMaterialCost,
        makingCost: state.estimatedMakingCost,
      });

      if (pricing.success) {
        const isPriceManuallyEdited = Boolean(state.manuallyEditedFields?.finalPrice);
        updateState({
          suggestedPrice: pricing.suggestedPrice,
          finalPrice: isPriceManuallyEdited && state.finalPrice > 0 ? state.finalPrice : pricing.suggestedPrice,
          estimatedMaterialCost: pricing.estimatedMaterialCost,
          estimatedMakingCost: pricing.estimatedMakingCost,
        });
        setPricingExplanationHindi(pricing.explanationHindi);
        setPricingExplanationEnglish(pricing.explanationEnglish);
      }
    } catch (err) {
      console.warn('[calculatePricing] Error calculating price:', err);
    } finally {
      setIsCalculatingPrice(false);
      setStep('pricing');
    }
  };

  // ─── PUBLISH ─────────────────────────────────────────────────────────────────
  const publishToMarket = async (): Promise<boolean> => {
    const activePrice = state.finalPrice > 0 ? state.finalPrice : (state.suggestedPrice > 0 ? state.suggestedPrice : 0);

    if (activePrice <= 0) {
      setErrorMessage(
        state.language === 'hi'
          ? 'कृपया सामान की सही कीमत (₹) तय करें।'
          : 'Please enter a valid price for the product.'
      );
      return false;
    }

    setIsPublishing(true);
    clearError();

    try {
      const created = await productService.createProduct({
        title: state.title || (state.language === 'hi' ? 'हस्तनिर्मित शिल्पकृति' : 'Handcrafted Artisan Item'),
        description: state.language === 'en' ? state.descriptionEnglish : state.descriptionHindi,
        description_hindi: state.descriptionHindi,
        description_english: state.descriptionEnglish,
        category: state.category || 'Handicrafts',
        material: state.material || '',
        craft_type: state.craftType || '',
        price: activePrice,
        estimated_material_cost: state.estimatedMaterialCost,
        estimated_making_cost: state.estimatedMakingCost,
        image_url: state.image,
        enhanced_image_url: state.enhancedImage || state.image,
        status: 'published',
      });

      setIsPublishing(false);
      return Boolean(created);
    } catch (err) {
      console.warn('[ProductCreationContext] Publish failed:', err);
      setIsPublishing(false);
      setErrorMessage(
        state.language === 'hi'
          ? 'प्रकाशित करने में समस्या हुई। कृपया पुनः प्रयास करें।'
          : 'Publishing failed. Please try again.'
      );
      return false;
    }
  };


  return (
    <ProductCreationContext.Provider
      value={{
        currentStep,
        setStep,
        state,
        updateState,
        resetState,
        setImageAndEnhance,
        retakeImage,
        startVoiceRecognition,
        stopVoiceRecognition,
        isRecognitionSupported,
        generateCatalogFromVoice,
        calculatePricing,
        publishToMarket,
        isEnhancing,
        isRecording,
        isTranscribing,
        isGeneratingCatalog,
        isCalculatingPrice,
        isPublishing,
        enhancementOperations,
        enhancementIsDevFallback,
        pricingExplanationHindi,
        pricingExplanationEnglish,
        errorMessage,
        setErrorMessage,
        clearError,
      }}
    >
      {children}
    </ProductCreationContext.Provider>
  );
};

export const useProductCreation = (): ProductCreationContextType => {
  const context = useContext(ProductCreationContext);
  if (!context) {
    throw new Error('useProductCreation must be used within a ProductCreationProvider');
  }
  return context;
};
