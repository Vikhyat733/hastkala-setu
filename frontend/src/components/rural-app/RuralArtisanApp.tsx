import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Package, 
  ShoppingBag, 
  User, 
  Bell, 
  Volume2, 
  Sparkles 
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { RuralAppScreen, RuralAppProductItem } from '../../types';
import { 
  DEFAULT_RURAL_ARTISAN, 
  INITIAL_RURAL_PRODUCTS, 
  DEMO_CRAFT_PRESETS,
  RuralArtisanUser 
} from './data/ruralAppDefaults';
import { RuralAppFrame } from './RuralAppFrame';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { HomeScreen } from './screens/HomeScreen';
import { AddChoiceScreen } from './screens/AddChoiceScreen';
import { CameraScreen } from './screens/CameraScreen';
import { AIProcessingScreen } from './screens/AIProcessingScreen';
import { AIResultScreen } from './screens/AIResultScreen';
import { EditDetailsScreen } from './screens/EditDetailsScreen';
import { PublishConfirmScreen } from './screens/PublishConfirmScreen';
import { PublishSuccessScreen } from './screens/PublishSuccessScreen';
import { MyItemsScreen } from './screens/MyItemsScreen';
import { RuralBazaarScreen } from './screens/RuralBazaarScreen';
import { MyAccountScreen } from './screens/MyAccountScreen';
import { RuralProductDetailModal } from './screens/RuralProductDetailModal';
import { playSoundEffect, speakText } from '../../services/voiceAssistant';

const LOCAL_STORAGE_RURAL_PRODUCTS = 'hastkala_rural_products_v1';
const LOCAL_STORAGE_RURAL_ONBOARDED = 'hastkala_rural_onboarded_v1';

export const RuralArtisanApp: React.FC = () => {
  // ─── Use GLOBAL language from MarketplaceContext (unified) ───
  const { setCurrentView, publishNewCraft, showToast, activeLanguage, setActiveLanguage, t } = useMarketplace();

  // Artisan State (no more local selectedLanguage!)
  const [artisan, setArtisan] = useState<RuralArtisanUser>(DEFAULT_RURAL_ARTISAN);

  // Products State
  const [products, setProducts] = useState<RuralAppProductItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_RURAL_PRODUCTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_RURAL_PRODUCTS;
  });

  // Current Screen State
  const [currentScreen, setCurrentScreen] = useState<RuralAppScreen>(() => {
    const onboarded = localStorage.getItem(LOCAL_STORAGE_RURAL_ONBOARDED);
    return onboarded === 'true' ? 'home' : 'welcome';
  });

  // Active Bottom Tab
  const [activeTab, setActiveTab] = useState<'home' | 'my-items' | 'bazaar' | 'account'>('home');

  // New Craft Wizard In-Progress State
  const [wizardImage, setWizardImage] = useState<string>(DEMO_CRAFT_PRESETS[0].image);
  const [wizardName, setWizardName] = useState<string>(DEMO_CRAFT_PRESETS[0].name.split('(')[0].trim());
  const [wizardCategory, setWizardCategory] = useState<string>(DEMO_CRAFT_PRESETS[0].category);
  const [wizardPrice, setWizardPrice] = useState<number>(DEMO_CRAFT_PRESETS[0].defaultPrice);
  const [wizardPriceRange, setWizardPriceRange] = useState<string>(DEMO_CRAFT_PRESETS[0].priceRange);
  const [wizardDescription, setWizardDescription] = useState<string>(DEMO_CRAFT_PRESETS[0].description);
  const [wizardAudioText, setWizardAudioText] = useState<string>(DEMO_CRAFT_PRESETS[0].audioText);

  // Modal State
  const [selectedProductModal, setSelectedProductModal] = useState<RuralAppProductItem | null>(null);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  // Persist Products
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_RURAL_PRODUCTS, JSON.stringify(products));
  }, [products]);

  // Navigate to Tab
  const handleTabChange = (tab: 'home' | 'my-items' | 'bazaar' | 'account') => {
    playSoundEffect('tap');
    setActiveTab(tab);
    setCurrentScreen(tab === 'home' ? 'home' : tab === 'my-items' ? 'my-items' : tab === 'bazaar' ? 'bazaar' : 'account');
  };

  // Welcome -> Home
  const handleWelcomeProceed = () => {
    localStorage.setItem(LOCAL_STORAGE_RURAL_ONBOARDED, 'true');
    setCurrentScreen('home');
    setActiveTab('home');
  };

  // Home -> Add Choice
  const handleStartAddCraft = () => {
    setCurrentScreen('add-choice');
  };

  // Add Choice -> Camera
  const handleSelectCamera = () => {
    setCurrentScreen('camera');
  };

  // Add Choice -> Gallery Upload
  const handleSelectGallery = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const imgUrl = reader.result as string;
      setWizardImage(imgUrl);
      setWizardName('हस्तनिर्मित शिल्प (Gallery Craft)');
      setWizardCategory('सजावट');
      setWizardPrice(750);
      setWizardPriceRange('₹650 - ₹850');
      setWizardDescription('फोन गैलरी से चुनी गई पारंपरिक कलाकृति। बहुत आकर्षक और टिकाऊ है।');
      setWizardAudioText('नमस्ते! यह गैलरी से चुनी गई कलाकृति है। अनुमानित कीमत सात सौ पचास रुपये है।');
      setCurrentScreen('ai-processing');
    };
    reader.readAsDataURL(file);
  };

  // Add Choice -> Voice Input
  const handleSelectVoice = (spokenDetails: string) => {
    setWizardImage(DEMO_CRAFT_PRESETS[0].image);
    setWizardName('बाँस की टोकरी (Voice Input)');
    setWizardCategory('घर सजावट');
    setWizardPrice(800);
    setWizardPriceRange('₹700 - ₹900');
    setWizardDescription(`कारीगर द्वारा बोलकर दर्ज किया गया विवरण: "${spokenDetails}"। मजबूत और सुंदर हस्तशिल्प।`);
    setWizardAudioText(`नमस्ते! आपने विवरण दिया: ${spokenDetails}। अनुमानित कीमत आठ सौ रुपये है।`);
    setCurrentScreen('ai-processing');
  };

  // Camera -> Capture Photo
  const handleCapturePhoto = (capturedImg: string, presetIndex: number) => {
    const preset = DEMO_CRAFT_PRESETS[presetIndex] || DEMO_CRAFT_PRESETS[0];
    setWizardImage(capturedImg);
    setWizardName(preset.name.split('(')[0].trim());
    setWizardCategory(preset.category);
    setWizardPrice(preset.defaultPrice);
    setWizardPriceRange(preset.priceRange);
    setWizardDescription(preset.description);
    setWizardAudioText(preset.audioText);
    setCurrentScreen('ai-processing');
  };

  // AI Processing -> AI Result
  const handleAIProcessingComplete = () => {
    setCurrentScreen('ai-result');
  };

  // AI Result -> Edit Details
  const handleAIResultProceed = () => {
    setCurrentScreen('edit-details');
  };

  // Edit Details -> Publish Confirm
  const handleEditDetailsConfirm = (edited: { name: string; category: string; price: number; description: string }) => {
    setWizardName(edited.name);
    setWizardCategory(edited.category);
    setWizardPrice(edited.price);
    setWizardDescription(edited.description);
    setCurrentScreen('publish-confirm');
  };

  // Publish Confirm -> Live Publish to Marketplace!
  const handlePublishCraft = () => {
    const newProductItem: RuralAppProductItem = {
      id: `rural-craft-${Date.now()}`,
      name: wizardName,
      category: wizardCategory,
      price: wizardPrice,
      estimatedPriceRange: wizardPriceRange,
      description: wizardDescription,
      image: wizardImage,
      status: 'published',
      dateAdded: new Date().toISOString().split('T')[0],
      viewsCount: 1,
      ordersCount: 0
    };

    // Update rural products list
    setProducts(prev => [newProductItem, ...prev]);

    // Also sync with global Web Marketplace Context
    publishNewCraft({
      title: {
        en: `${wizardName} (Handmade Rural Craft)`,
        hi: wizardName
      },
      category: wizardCategory === 'कपड़ा' ? 'textiles' : wizardCategory === 'आभूषण' ? 'jewelry' : 'homedecor',
      craftTechnique: 'पारंपरिक ग्रामीण हस्तकला (Traditional Rural Handicraft)',
      materials: ['बाँस', 'प्राकृतिक रंग', 'सूती धागे'],
      originRegion: artisan.village,
      originState: artisan.state,
      hasGiTag: false,
      giVerificationStatus: 'not_verified',
      resultSource: 'backend_api',
      priceBreakdown: {
        rawMaterialCost: Math.round(wizardPrice * 0.3),
        artisanLaborHours: 12,
        hourlyFairWageRate: 45,
        fairLaborCost: Math.round(wizardPrice * 0.55),
        packagingAndLogistics: Math.round(wizardPrice * 0.15),
        fairMargin: Math.round(wizardPrice * 0.2),
        marketRangeMin: Math.round(wizardPrice * 0.85),
        marketRangeMax: Math.round(wizardPrice * 1.3),
        estimationBasis: 'artisan_input',
        suggestedPrice: wizardPrice,
        minPrice: Math.round(wizardPrice * 0.85),
        artisanDirectSharePercent: 92
      },
      shortDescription: {
        en: wizardDescription,
        hi: wizardDescription
      },
      fullStory: {
        en: `Handcrafted by master artisan ${artisan.name} in village ${artisan.village}, ${artisan.state}.`,
        hi: `${artisan.state} के ${artisan.village} गाँव में मास्टर कारीगर ${artisan.name} द्वारा हस्तनिर्मित।`
      },
      careInstructions: 'साफ सूखे कपड़े से पोंछें।',
      socialBlurbWhatsApp: `नमस्ते! मेरा नया सामान ${wizardName} देखें: ₹${wizardPrice}`,
      socialBlurbInstagram: `Handcrafted with love by ${artisan.name}`,
      confidenceScore: 0.98,
      detectedVisualFeatures: ['Handwoven', 'Natural Fibers', 'Authentic Rural Craft']
    }, wizardImage);

    // Navigate to Success Screen
    setCurrentScreen('publish-success');
  };

  // Delete product handler
  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast(t('itemRemoved'), 'info');
  };

  // Reset entire app to initial demo
  const handleResetApp = () => {
    localStorage.removeItem(LOCAL_STORAGE_RURAL_ONBOARDED);
    localStorage.removeItem(LOCAL_STORAGE_RURAL_PRODUCTS);
    setProducts(INITIAL_RURAL_PRODUCTS);
    setCurrentScreen('welcome');
    setActiveTab('home');
    showToast(t('appResetDone'), 'info');
  };

  // Show bottom tab bar on main pages
  const isMainTabScreen = ['home', 'my-items', 'bazaar', 'account'].includes(currentScreen);

  return (
    <RuralAppFrame
      onSwitchToWebMarketplace={() => setCurrentView('marketplace')}
      onResetApp={handleResetApp}
      currentScreenTitle={t('ruralAppTitle')}
    >
      <div className="flex-1 flex flex-col justify-between overflow-y-auto">
        
        {/* SCREEN 1: Welcome & Language Selector — now uses global setActiveLanguage */}
        {currentScreen === 'welcome' && (
          <WelcomeScreen
            selectedLanguage={activeLanguage}
            onSelectLanguage={(lang) => setActiveLanguage(lang as any)}
            onProceed={handleWelcomeProceed}
          />
        )}

        {/* SCREEN 2: Home Screen */}
        {currentScreen === 'home' && (
          <HomeScreen
            artisan={artisan}
            products={products}
            onAddNewCraft={handleStartAddCraft}
            onViewMyItems={() => handleTabChange('my-items')}
            onOpenItem={(item) => setSelectedProductModal(item)}
            onOpenNotifications={() => setShowNotificationsModal(true)}
          />
        )}

        {/* SCREEN 3: Add Choice Screen (Camera / Gallery / Voice) */}
        {currentScreen === 'add-choice' && (
          <AddChoiceScreen
            onBack={() => setCurrentScreen('home')}
            onSelectCamera={handleSelectCamera}
            onSelectGallery={handleSelectGallery}
            onSelectVoice={handleSelectVoice}
          />
        )}

        {/* SCREEN 4: Camera Viewfinder */}
        {currentScreen === 'camera' && (
          <CameraScreen
            onBack={() => setCurrentScreen('add-choice')}
            onCapture={handleCapturePhoto}
          />
        )}

        {/* SCREEN 5: AI Processing Animated Checklist */}
        {currentScreen === 'ai-processing' && (
          <AIProcessingScreen
            onBack={() => setCurrentScreen('add-choice')}
            onComplete={handleAIProcessingComplete}
          />
        )}

        {/* SCREEN 6: AI Generated Result Review */}
        {currentScreen === 'ai-result' && (
          <AIResultScreen
            image={wizardImage}
            name={wizardName}
            category={wizardCategory}
            description={wizardDescription}
            priceRange={wizardPriceRange}
            audioText={wizardAudioText}
            onBack={() => setCurrentScreen('add-choice')}
            onProceed={handleAIResultProceed}
          />
        )}

        {/* SCREEN 7: Edit & Check Details */}
        {currentScreen === 'edit-details' && (
          <EditDetailsScreen
            initialName={wizardName}
            initialCategory={wizardCategory}
            initialPrice={wizardPrice}
            initialDescription={wizardDescription}
            onBack={() => setCurrentScreen('ai-result')}
            onConfirm={handleEditDetailsConfirm}
          />
        )}

        {/* SCREEN 8: Publish Confirmation */}
        {currentScreen === 'publish-confirm' && (
          <PublishConfirmScreen
            image={wizardImage}
            name={wizardName}
            price={wizardPrice}
            onBack={() => setCurrentScreen('edit-details')}
            onPublish={handlePublishCraft}
          />
        )}

        {/* SCREEN 9: Publish Success Celebration */}
        {currentScreen === 'publish-success' && (
          <PublishSuccessScreen
            image={wizardImage}
            name={wizardName}
            price={wizardPrice}
            onViewMyItems={() => handleTabChange('my-items')}
            onAddNewCraft={handleStartAddCraft}
          />
        )}

        {/* SCREEN 10: My Items Inventory */}
        {currentScreen === 'my-items' && (
          <MyItemsScreen
            products={products}
            onAddNewCraft={handleStartAddCraft}
            onOpenItem={(item) => setSelectedProductModal(item)}
          />
        )}

        {/* SCREEN 11: Rural Bazaar */}
        {currentScreen === 'bazaar' && (
          <RuralBazaarScreen
            products={products}
            onOpenProduct={(item) => setSelectedProductModal(item)}
          />
        )}

        {/* SCREEN 12: My Account */}
        {currentScreen === 'account' && (
          <MyAccountScreen
            artisan={artisan}
            onSelectLanguageChange={() => setCurrentScreen('welcome')}
            onLogout={handleResetApp}
          />
        )}

      </div>

      {/* 4-TAB BOTTOM NAVIGATION BAR — Translated & Responsive */}
      {isMainTabScreen && (
        <div className="w-full bg-white/95 backdrop-blur-md border-t border-[#E5DAC8] py-2 px-3 z-30 shadow-lg select-none sticky bottom-0">
          <div className="max-w-md mx-auto flex items-center justify-around">
            
            {/* Tab 1: Home */}
            <button
              onClick={() => handleTabChange('home')}
              className={`flex flex-col items-center gap-0.5 py-1 px-4 rounded-2xl transition-all ${
                activeTab === 'home'
                  ? 'text-[#3A6B35] font-black scale-105'
                  : 'text-[#8A7B6E] font-bold hover:text-[#3B3026]'
              }`}
            >
              <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.8]' : 'stroke-2'}`} />
              <span className="text-[10px]">{t('tabHome')}</span>
            </button>

            {/* Tab 2: My Items */}
            <button
              onClick={() => handleTabChange('my-items')}
              className={`flex flex-col items-center gap-0.5 py-1 px-4 rounded-2xl transition-all ${
                activeTab === 'my-items'
                  ? 'text-[#3A6B35] font-black scale-105'
                  : 'text-[#8A7B6E] font-bold hover:text-[#3B3026]'
              }`}
            >
              <Package className={`w-5 h-5 ${activeTab === 'my-items' ? 'stroke-[2.8]' : 'stroke-2'}`} />
              <span className="text-[10px]">{t('tabMyItems')}</span>
            </button>

            {/* Tab 3: Bazaar */}
            <button
              onClick={() => handleTabChange('bazaar')}
              className={`flex flex-col items-center gap-0.5 py-1 px-4 rounded-2xl transition-all ${
                activeTab === 'bazaar'
                  ? 'text-[#3A6B35] font-black scale-105'
                  : 'text-[#8A7B6E] font-bold hover:text-[#3B3026]'
              }`}
            >
              <ShoppingBag className={`w-5 h-5 ${activeTab === 'bazaar' ? 'stroke-[2.8]' : 'stroke-2'}`} />
              <span className="text-[10px]">{t('tabBazaar')}</span>
            </button>

            {/* Tab 4: Account */}
            <button
              onClick={() => handleTabChange('account')}
              className={`flex flex-col items-center gap-0.5 py-1 px-4 rounded-2xl transition-all ${
                activeTab === 'account'
                  ? 'text-[#3A6B35] font-black scale-105'
                  : 'text-[#8A7B6E] font-bold hover:text-[#3B3026]'
              }`}
            >
              <User className={`w-5 h-5 ${activeTab === 'account' ? 'stroke-[2.8]' : 'stroke-2'}`} />
              <span className="text-[10px]">{t('tabAccount')}</span>
            </button>

          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProductModal && (
        <RuralProductDetailModal
          product={selectedProductModal}
          onClose={() => setSelectedProductModal(null)}
          onDeleteProduct={handleDeleteProduct}
        />
      )}

      {/* Notifications Modal — Translated */}
      {showNotificationsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF6ED] w-full max-w-sm rounded-3xl p-5 border-2 border-[#E5DAC8] shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[#1E3A1E]">{t('notifications')}</h3>
              <button onClick={() => setShowNotificationsModal(false)} className="p-1 font-black">✕</button>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 bg-white rounded-2xl border border-[#E5DAC8]">
                <div className="flex items-center gap-2">
                  <span className="text-base">🎉</span>
                  <p className="text-xs font-black text-[#1E3A1E]">{t('newOrderReceived')}</p>
                </div>
                <p className="text-[11px] text-[#5A4838] mt-1">
                  {activeLanguage === 'en' 
                    ? 'A new order of ₹800 was placed for your "Bamboo Basket".'
                    : 'आपके सामान "बाँस की टोकरी" के लिए ₹800 का नया ऑर्डर आया है।'}
                </p>
                <span className="text-[9px] text-[#8A7B6E] block mt-1">2 {t('hoursAgo')}</span>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-[#E5DAC8]">
                <div className="flex items-center gap-2">
                  <span className="text-base">🌾</span>
                  <p className="text-xs font-black text-[#1E3A1E]">{t('craftMelaEvent')}</p>
                </div>
                <p className="text-[11px] text-[#5A4838] mt-1">
                  {activeLanguage === 'en'
                    ? 'Contact your village coordinator to participate in the upcoming craft mela.'
                    : 'आगामी शिल्प मेले में भाग लेने के लिए ग्राम समन्वयक से संपर्क करें।'}
                </p>
                <span className="text-[9px] text-[#8A7B6E] block mt-1">1 {t('dayAgo')}</span>
              </div>
            </div>

            <button
              onClick={() => setShowNotificationsModal(false)}
              className="w-full py-3 rounded-xl bg-[#3A6B35] text-white font-bold text-sm"
            >
              {t('ok')}
            </button>
          </div>
        </div>
      )}

    </RuralAppFrame>
  );
};
