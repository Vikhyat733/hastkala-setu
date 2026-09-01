import React, { useState, useRef } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  analyzeCraftImageWithGemini, 
  fileToBase64, 
  CRAFT_DEMO_PRESETS, 
  getSavedGeminiKey, 
  saveGeminiKey, 
  speakText, 
  stopSpeech 
} from '../services/geminiVision';
import { AIVisionResult, SupportedLanguage } from '../types';
import { LANGUAGES } from '../data/translations';
import { 
  Sparkles, 
  Upload, 
  Camera, 
  Key, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Share2, 
  ArrowRight, 
  Coins, 
  Clock, 
  ShieldCheck, 
  Award, 
  RotateCcw, 
  Eye,
  Sliders,
  Copy,
  Check
} from 'lucide-react';

export const AIVisionStudio: React.FC = () => {
  const {
    activeLanguage,
    formatPrice,
    publishNewCraft,
    setCurrentView,
    setSelectedProductForModal,
    t
  } = useMarketplace();

  // State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIVisionResult | null>(null);
  const [activeStoryTab, setActiveStoryTab] = useState<SupportedLanguage>(activeLanguage);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  
  // Custom edits
  const [customTitle, setCustomTitle] = useState('');
  const [customPrice, setCustomPrice] = useState<number>(0);
  const [customStory, setCustomStory] = useState('');

  // API Key Settings Modal
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getSavedGeminiKey());
  const [apiKeySaved, setApiKeySaved] = useState(false);

  // Copy blurb feedbacks
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [copiedInsta, setCopiedInsta] = useState(false);
  const [publishedProduct, setPublishedProduct] = useState<any | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image upload from user
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setSelectedImage(objectUrl);
    setAnalysisResult(null);
    setPublishedProduct(null);

    // Auto trigger analysis
    runVisionAnalysis(file, file.name);
  };

  // Handle selection of demo craft presets
  const handlePresetSelect = async (preset: typeof CRAFT_DEMO_PRESETS[0]) => {
    setSelectedImage(preset.thumbnail);
    setImageFile(null);
    setAnalysisResult(null);
    setPublishedProduct(null);

    setIsAnalyzing(true);
    try {
      // Analyze preset
      const result = await analyzeCraftImageWithGemini(
        '', 
        'image/jpeg', 
        apiKeyInput, 
        preset.name
      );
      setAnalysisResult(result);
      setCustomTitle(result.title[activeLanguage] || result.title.en);
      setCustomPrice(result.priceBreakdown.suggestedPrice);
      setCustomStory(result.fullStory[activeLanguage] || result.fullStory.en);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Run Vision Analysis
  const runVisionAnalysis = async (file: File, fileNameHint: string) => {
    setIsAnalyzing(true);
    try {
      const base64 = await fileToBase64(file);
      const result = await analyzeCraftImageWithGemini(
        base64,
        file.type || 'image/jpeg',
        apiKeyInput,
        fileNameHint
      );
      setAnalysisResult(result);
      setCustomTitle(result.title[activeLanguage] || result.title.en);
      setCustomPrice(result.priceBreakdown.suggestedPrice);
      setCustomStory(result.fullStory[activeLanguage] || result.fullStory.en);
    } catch (err) {
      console.error('Vision analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Voice Narration
  const handleVoiceToggle = () => {
    if (isPlayingVoice) {
      stopSpeech();
      setIsPlayingVoice(false);
    } else {
      if (!analysisResult) return;
      const textToSpeak = `${customTitle || analysisResult.title[activeStoryTab] || analysisResult.title.en}. ${customStory || analysisResult.fullStory[activeStoryTab] || analysisResult.shortDescription[activeStoryTab] || analysisResult.shortDescription.en}`;
      speakText(textToSpeak, activeStoryTab);
      setIsPlayingVoice(true);
    }
  };

  // Save Custom Gemini Key
  const handleSaveKey = () => {
    saveGeminiKey(apiKeyInput);
    setApiKeySaved(true);
    setTimeout(() => {
      setApiKeySaved(false);
      setShowApiKeyModal(false);
    }, 1200);
  };

  // Copy Social Blurbs
  const handleCopyWhatsApp = () => {
    if (!analysisResult) return;
    navigator.clipboard.writeText(analysisResult.socialBlurbWhatsApp);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2000);
  };

  const handleCopyInsta = () => {
    if (!analysisResult) return;
    navigator.clipboard.writeText(analysisResult.socialBlurbInstagram);
    setCopiedInsta(true);
    setTimeout(() => setCopiedInsta(false), 2000);
  };

  // Publish to Store
  const handlePublish = () => {
    if (!analysisResult || !selectedImage) return;

    const newProd = publishNewCraft(analysisResult, selectedImage, {
      title: {
        ...analysisResult.title,
        [activeLanguage]: customTitle || analysisResult.title[activeLanguage]
      },
      price: customPrice || analysisResult.priceBreakdown.suggestedPrice,
      fullStory: {
        ...analysisResult.fullStory,
        [activeLanguage]: customStory || analysisResult.fullStory[activeLanguage]
      }
    });

    setPublishedProduct(newProd);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Studio Header & API Key Bar */}
      <div className="bg-gradient-to-r from-artisan-indigo via-[#22365A] to-artisan-terracotta text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>AI Multimodal Studio • Gemini 1.5/2.0 Vision</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight">
            Artisan AI Product Onboarding
          </h2>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
            Snap a photo of your handicraft. Our AI automatically generates GI-grade titles, fair pricing calculations, and cultural stories across <strong>8 Indian languages</strong>.
          </p>
        </div>

        {/* API Key Configure Button */}
        <button
          onClick={() => setShowApiKeyModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-xs backdrop-blur-md shadow-sm transition-all"
        >
          <Key className="w-4 h-4 text-amber-400" />
          <span>{apiKeyInput ? 'Gemini API Key: Configured ✓' : 'Custom Gemini Key (Optional)'}</span>
        </button>
      </div>

      {/* Main Content Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Image Upload & Presets (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Upload Dropzone */}
          <div className="bg-white rounded-3xl p-6 border-2 border-dashed border-artisan-terracotta/30 hover:border-artisan-terracotta transition-colors shadow-craft">
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />

            {!selectedImage ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="py-10 flex flex-col items-center justify-center text-center cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-3xl bg-artisan-sand flex items-center justify-center text-artisan-terracotta group-hover:scale-110 group-hover:bg-artisan-terracotta group-hover:text-white transition-all duration-300 shadow-md">
                  <Upload className="w-8 h-8" />
                </div>
                <h4 className="font-serif font-bold text-base text-artisan-indigo mt-4">
                  {t('uploadPhotoTitle')}
                </h4>
                <p className="text-xs text-artisan-slate/70 mt-1 max-w-xs">
                  {t('dragDropText')}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-artisan-sand text-[11px] font-bold text-artisan-terracotta">
                  <Camera className="w-3.5 h-3.5" />
                  <span>JPG, PNG, WebP up to 15MB</span>
                </span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-artisan-sand border border-artisan-terracotta/20">
                  <img
                    src={selectedImage}
                    alt="Craft uploaded"
                    className="w-full h-full object-cover"
                  />

                  {/* Processing Radar Scanner Animation */}
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-artisan-indigo/70 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in">
                      <div className="w-14 h-14 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mb-4" />
                      <p className="font-bold text-sm text-amber-300">
                        {t('analyzingCraft')}
                      </p>
                      <p className="text-xs text-slate-200 mt-1">
                        {t('detectingMaterials')}
                      </p>
                    </div>
                  )}

                  {/* Re-upload Button */}
                  {!isAnalyzing && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Change Photo</span>
                    </button>
                  )}
                </div>

                {/* Status Indicator */}
                {analysisResult && !isAnalyzing && (
                  <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-200 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Gemini Vision AI Analysis Complete</span>
                    </span>
                    <span className="font-mono text-[11px]">
                      {Math.round((analysisResult.confidenceScore || 0.95) * 100)}% Confidence
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Demo Craft Presets */}
          <div className="bg-white rounded-3xl p-5 border border-artisan-terracotta/15 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-artisan-indigo flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{t('useSampleCraft')}</span>
              </span>
              <span className="text-[10px] text-artisan-slate/60 font-semibold">1-Click Test</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {CRAFT_DEMO_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset)}
                  className="group flex flex-col text-left p-1.5 rounded-xl border border-artisan-terracotta/15 hover:border-artisan-terracotta hover:bg-artisan-sand transition-all"
                >
                  <img
                    src={preset.thumbnail}
                    alt={preset.name}
                    className="w-full h-16 object-cover rounded-lg group-hover:scale-102 transition-transform"
                  />
                  <span className="text-[10px] font-bold text-artisan-indigo truncate mt-1">
                    {preset.name}
                  </span>
                  <span className="text-[9px] text-artisan-slate/60">
                    {preset.originState}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: AI Generated Outputs & Customization (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {!analysisResult && !isAnalyzing && (
            <div className="bg-white rounded-3xl p-10 border border-artisan-terracotta/15 shadow-craft text-center space-y-4 flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-16 h-16 rounded-3xl bg-artisan-sand flex items-center justify-center text-amber-500">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-xl text-artisan-indigo">
                Awaiting Craft Photo
              </h3>
              <p className="text-xs text-artisan-slate/70 max-w-md leading-relaxed">
                Upload any handicraft photo on the left or click one of the <strong>Demo Handicrafts</strong> to see Gemini Vision generate titles, pricing, and 8-language stories in real time!
              </p>
            </div>
          )}

          {isAnalyzing && (
            <div className="bg-white rounded-3xl p-10 border border-artisan-terracotta/15 shadow-craft space-y-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded-lg w-3/4" />
              <div className="h-20 bg-gray-100 rounded-2xl" />
              <div className="grid grid-cols-3 gap-3">
                <div className="h-16 bg-gray-100 rounded-xl" />
                <div className="h-16 bg-gray-100 rounded-xl" />
                <div className="h-16 bg-gray-100 rounded-xl" />
              </div>
              <div className="h-32 bg-gray-100 rounded-2xl" />
            </div>
          )}

          {analysisResult && !isAnalyzing && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Output Section 1: Title, Category & GI Tag */}
              <div className="bg-white rounded-3xl p-6 border border-artisan-terracotta/20 shadow-craft space-y-4">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-artisan-terracotta text-white flex items-center justify-center text-xs font-black">
                      1
                    </span>
                    <h3 className="font-serif font-bold text-base text-artisan-indigo">
                      Craft Identity & GI Classification
                    </h3>
                  </div>

                  {analysisResult.hasGiTag && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold">
                      <Award className="w-3.5 h-3.5" />
                      <span>{analysisResult.giTagName || 'GI Tag Certified'}</span>
                    </span>
                  )}
                </div>

                {/* Editable Product Title */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-artisan-slate/70 uppercase tracking-wider">
                    {t('generatedTitle')} ({LANGUAGES.find(l => l.code === activeLanguage)?.native}):
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full font-serif font-bold text-lg text-artisan-indigo bg-artisan-sand/60 border border-artisan-terracotta/20 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-artisan-terracotta/40"
                  />
                </div>

                {/* Visual Attributes Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] font-bold text-artisan-slate/60">Detected Features:</span>
                  {analysisResult.detectedVisualFeatures.map((feat, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-artisan-sand text-artisan-indigo px-2.5 py-1 rounded-lg border border-artisan-terracotta/15 font-medium"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Output Section 2: Fair Price Recommendation Engine */}
              <div className="bg-white rounded-3xl p-6 border border-artisan-terracotta/20 shadow-craft space-y-4">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-artisan-terracotta text-white flex items-center justify-center text-xs font-black">
                      2
                    </span>
                    <h3 className="font-serif font-bold text-base text-artisan-indigo">
                      {t('recommendedPrice')}
                    </h3>
                  </div>

                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    {analysisResult.priceBreakdown.artisanDirectSharePercent}% Goes Directly to Artisan
                  </span>
                </div>

                {/* Price Breakdown Calculation Cards */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-artisan-sand p-3 rounded-2xl border border-artisan-terracotta/15">
                    <p className="text-[10px] text-artisan-slate/70 font-semibold">{t('rawMaterials')}</p>
                    <p className="font-bold text-sm text-artisan-indigo mt-0.5">
                      {formatPrice(analysisResult.priceBreakdown.rawMaterialCost)}
                    </p>
                  </div>

                  <div className="bg-artisan-sand p-3 rounded-2xl border border-artisan-terracotta/15">
                    <p className="text-[10px] text-artisan-slate/70 font-semibold">{t('laborHours')}</p>
                    <p className="font-bold text-sm text-artisan-indigo mt-0.5">
                      {analysisResult.priceBreakdown.artisanLaborHours} hrs (@₹{analysisResult.priceBreakdown.hourlyFairWageRate}/hr)
                    </p>
                  </div>

                  <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                    <p className="text-[10px] text-emerald-800 font-semibold">Artisan Fair Labor</p>
                    <p className="font-black text-sm text-emerald-700 mt-0.5">
                      {formatPrice(analysisResult.priceBreakdown.fairLaborCost)}
                    </p>
                  </div>
                </div>

                {/* Adjustable Selling Price Slider */}
                <div className="bg-amber-500/5 p-4 rounded-2xl border border-amber-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-artisan-indigo flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-artisan-terracotta" />
                      <span>Set Final Selling Price:</span>
                    </span>
                    <span className="text-xl font-black text-artisan-indigo">
                      {formatPrice(customPrice)}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={analysisResult.priceBreakdown.minPrice}
                    max={Math.round(analysisResult.priceBreakdown.suggestedPrice * 1.8)}
                    step={50}
                    value={customPrice}
                    onChange={(e) => setCustomPrice(Number(e.target.value))}
                    className="w-full accent-artisan-terracotta cursor-pointer"
                  />

                  <div className="flex items-center justify-between text-[10px] text-artisan-slate/60 font-semibold">
                    <span>Floor Min: {formatPrice(analysisResult.priceBreakdown.minPrice)}</span>
                    <span className="text-artisan-terracotta font-bold">Suggested: {formatPrice(analysisResult.priceBreakdown.suggestedPrice)}</span>
                    <span>Premium: {formatPrice(Math.round(analysisResult.priceBreakdown.suggestedPrice * 1.8))}</span>
                  </div>
                </div>

              </div>

              {/* Output Section 3: Multi-Lingual Cultural Story & Audio Narration */}
              <div className="bg-white rounded-3xl p-6 border border-artisan-terracotta/20 shadow-craft space-y-4">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-artisan-terracotta text-white flex items-center justify-center text-xs font-black">
                      3
                    </span>
                    <h3 className="font-serif font-bold text-base text-artisan-indigo">
                      {t('generatedStory')}
                    </h3>
                  </div>

                  {/* Audio Narrator Button */}
                  <button
                    onClick={handleVoiceToggle}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      isPlayingVoice
                        ? 'bg-artisan-terracotta text-white animate-pulse'
                        : 'bg-artisan-sand hover:bg-artisan-sand-dark text-artisan-indigo'
                    }`}
                  >
                    {isPlayingVoice ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-artisan-terracotta" />}
                    <span>{isPlayingVoice ? t('stopAudio') : t('listenStory')}</span>
                  </button>
                </div>

                {/* 8 Language Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setActiveStoryTab(lang.code);
                        if (isPlayingVoice) stopSpeech();
                        setIsPlayingVoice(false);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        activeStoryTab === lang.code
                          ? 'bg-artisan-indigo text-white shadow-xs'
                          : 'bg-artisan-sand text-artisan-indigo hover:bg-artisan-sand-dark'
                      }`}
                    >
                      {lang.flag} {lang.native}
                    </button>
                  ))}
                </div>

                {/* Story Content in Selected Language */}
                <div className="space-y-1.5">
                  <div className="p-4 rounded-2xl bg-artisan-sand/50 border border-artisan-terracotta/15">
                    <p className="text-xs font-bold text-artisan-terracotta mb-1">
                      {analysisResult.title[activeStoryTab] || analysisResult.title.en}
                    </p>
                    <p className="text-xs text-artisan-indigo leading-relaxed font-medium">
                      {analysisResult.fullStory[activeStoryTab] ||
                        analysisResult.shortDescription[activeStoryTab] ||
                        analysisResult.shortDescription.en}
                    </p>
                  </div>
                </div>

              </div>

              {/* Output Section 4: Social Media & WhatsApp Kit */}
              <div className="bg-white rounded-3xl p-6 border border-artisan-terracotta/20 shadow-craft space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-artisan-terracotta text-white flex items-center justify-center text-xs font-black">
                      4
                    </span>
                    <h3 className="font-serif font-bold text-base text-artisan-indigo">
                      WhatsApp & Social Seller Kit
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  
                  {/* WhatsApp Broadcast */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                        <span>💬</span> WhatsApp Broadcast Card
                      </span>
                      <button
                        onClick={handleCopyWhatsApp}
                        className="text-[11px] font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-300 hover:bg-emerald-100 flex items-center gap-1 transition-all"
                      >
                        {copiedWhatsApp ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedWhatsApp ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-emerald-950 font-mono line-clamp-2">
                      {analysisResult.socialBlurbWhatsApp}
                    </p>
                  </div>

                  {/* Instagram Post */}
                  <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 flex flex-col justify-between space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                        <span>📸</span> Instagram Caption & Hashtags
                      </span>
                      <button
                        onClick={handleCopyInsta}
                        className="text-[11px] font-bold text-purple-800 bg-white px-2.5 py-1 rounded-lg border border-purple-300 hover:bg-purple-100 flex items-center gap-1 transition-all"
                      >
                        {copiedInsta ? <Check className="w-3 h-3 text-purple-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedInsta ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-purple-950 font-mono line-clamp-2">
                      {analysisResult.socialBlurbInstagram}
                    </p>
                  </div>

                </div>
              </div>

              {/* Publish Action Button / Success Confirmation */}
              {!publishedProduct ? (
                <button
                  onClick={handlePublish}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-artisan-terracotta via-artisan-saffron-gold to-artisan-terracotta text-white font-bold text-base shadow-xl shadow-artisan-terracotta/30 hover:scale-102 hover:shadow-2xl transition-all flex items-center justify-center gap-3"
                >
                  <Sparkles className="w-5 h-5 text-amber-200" />
                  <span>{t('publishToStore')} ({formatPrice(customPrice)})</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <div className="p-5 rounded-3xl bg-emerald-600 text-white shadow-xl space-y-3 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-6 h-6 text-amber-300" />
                      <h4 className="font-bold text-base">
                        Craft Published Live to SIH Mela!
                      </h4>
                    </div>
                    <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-bold">
                      ID: {publishedProduct.id}
                    </span>
                  </div>

                  <p className="text-xs text-emerald-100">
                    Buyers can now discover your creation with full GI provenance, audio narration, and transparent fair-trade pricing.
                  </p>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        setSelectedProductForModal(publishedProduct);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Live Product Card</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentView('marketplace');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 transition-colors"
                    >
                      Browse Marketplace
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-artisan-terracotta/20 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-artisan-sand flex items-center justify-center text-artisan-terracotta">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-artisan-indigo">
                  Google Gemini Vision API Key
                </h3>
                <p className="text-xs text-artisan-slate/70">
                  Optional: Add your key for direct Gemini 1.5/2.0 API calls
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-artisan-slate/70">
                Gemini API Key:
              </label>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-artisan-sand border border-artisan-terracotta/20 rounded-xl px-4 py-2.5 text-xs font-mono text-artisan-indigo focus:outline-none focus:ring-2 focus:ring-artisan-terracotta/30"
              />
              <p className="text-[10px] text-artisan-slate/60">
                Key is stored only in your local browser storage. If empty, the app runs on high-precision built-in craft neural models.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-artisan-slate hover:bg-artisan-sand"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveKey}
                className="px-5 py-2 rounded-xl bg-artisan-terracotta text-white font-bold text-xs shadow-md shadow-artisan-terracotta/25 hover:bg-artisan-terracotta-dark transition-all"
              >
                {apiKeySaved ? 'Saved Successfully ✓' : 'Save Key'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
