import React from 'react';
import { ProductCreationProvider, useProductCreation } from './context/ProductCreationContext';
import { ProductCameraScreen } from './screens/ProductCameraScreen';
import { AiImageStudioScreen } from './screens/AiImageStudioScreen';
import { VoiceDescriptionScreen } from './screens/VoiceDescriptionScreen';
import { AutoCatalogScreen } from './screens/AutoCatalogScreen';
import { PricingAssistantScreen } from './screens/PricingAssistantScreen';
import { ProductPreviewScreen } from './screens/ProductPreviewScreen';

const StepRouter: React.FC = () => {
  const { currentStep } = useProductCreation();

  switch (currentStep) {
    case 'camera':
      return <ProductCameraScreen />;
    case 'studio':
      return <AiImageStudioScreen />;
    case 'voice':
      return <VoiceDescriptionScreen />;
    case 'catalog':
      return <AutoCatalogScreen />;
    case 'pricing':
      return <PricingAssistantScreen />;
    case 'preview':
      return <ProductPreviewScreen />;
    default:
      return <ProductCameraScreen />;
  }
};

export const ProductCreationFlow: React.FC = () => {
  return (
    <ProductCreationProvider>
      <StepRouter />
    </ProductCreationProvider>
  );
};
