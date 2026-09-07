import React, { useState, useRef, useEffect } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  analyzeCraftImageWithGemini, 
  fileToBase64, 
  validateImageFile,
  enhanceCraftImageCanvas,
  CRAFT_DEMO_PRESETS, 
  checkBackendHealth,
  speakText, 
  stopSpeech 
} from '../services/geminiVision';
import { AIVisionResult, SupportedLanguage, Product } from '../types';
import { LANGUAGES } from '../data/translations';
import { 
  Sparkles, 
  Upload, 
  Camera, 
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
  Check,
  Wand2,
  AlertCircle,
  HelpCircle,
  Server,
  Layers,
  CheckCircle2
} from 'lucide-react';

export const AIVisionStudio: React.FC = () => {
  const {
    activeLanguage,
    formatPrice,
    publishNewCraft,
    setCurrentView,
    setSelectedProductForModal,
    showToast,
    t
  } = useMarketplace();

  // Primary State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [showEnhancedPreview, setShowEnhancedPreview] = useState(false);
  const [isEnhancingImage, setIsEnhancingImage] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AIVisionResult | null>(null);
  const [activeStoryTab, setActiveStoryTab] = useState<SupportedLanguage>(activeLanguage);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  // Missing info feedback
  const [artisanNoteInput, setArtisanNoteInput] = useState('');
  
  // Custom edits
  const [customTitle, setCustomTitle] = useState('');
  const [customPrice, setCustomPrice] = useState<number>(0);
  const [customStory, setCustomStory] = useState('');

  // Server health indicator
  const [serverHealth, setServerHealth] = useState<{ online: boolean; geminiConfigured: boolean }>({
    online: false,
    geminiConfigured: false
  });

  // Copy feedback
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [copiedInsta, setCopiedInsta] = useState(false);
  const [publishedProduct, setPublishedProduct] = useState<Product | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth().then(setServerHealth);
  }, []);

  // Update active story tab when language changes
  useEffect(() => {
    setActiveStoryTab(activeLanguage);
  }, [activeLanguage]);

  // Run Vision Analysis
  const runVisionAnalysis = async (imageData: string, hint?: string) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setEnhancedImage(null);
    setShowEnhancedPreview(false);
    setPublishedProduct(null);

    try {
      let base64 = imageData;
      if (imageData.startsWith('data:')) {
        base64 = imageData.split(',')[1];
      }

      const result = await analyzeCraftImageWithGemini(base64, 'image/jpeg', hint);
      setAnalysisResult(result);
      setCustomTitle(result.title[activeLanguage] || result.title.en);
      setCustomPrice(result.priceBreakdown.suggestedPrice);
      setCustomStory(result.fullStory[activeLanguage] || result.fullStory.en);
    } catch (err: any) {
      setAnalysisError(err?.message || 'शिल्प का विश्लेषण करने में असमर्थ। कृपया दूसरी तस्वीर आज़माएं।');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle file select
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setAnalysisError(validation.error || 'अमान्य फ़ाइल');
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      const dataUrl = `data:${file.type};base64,${base64}`;
      setSelectedImage(dataUrl);
      runVisionAnalysis(base64, file.name);
    } catch (err) {
      setAnalysisError('तस्वीर लोड करने में त्रुटि। कृपया पुनः प्रयास करें।');
    }
  };

  // Handle preset select
  const handlePresetSelect = (preset: typeof CRAFT_DEMO_PRESETS[0]) => {
    setSelectedImage(preset.thumbnail);
    runVisionAnalysis('', preset.name);
  };

  // Image Enhancement Workflow
  const handleEnhanceImage = async () => {
    if (!selectedImage) return;
    setIsEnhancingImage(true);
    try {
      const enhanced = await enhanceCraftImageCanvas(selectedImage);
      setEnhancedImage(enhanced);
      setShowEnhancedPreview(true);
      showToast('✨ स्टूडियो लाइटिंग और कंट्रास्ट सुधार लागू किया गया!', 'success');
    } catch (err) {
      showToast('फोटो संवर्धन में असमर्थ', 'warning');
    } finally {
      setIsEnhancingImage(false);
    }
  };

  // Speech Narration
  const handleToggleVoice = () => {
    if (isPlayingVoice) {
      stopSpeech();
      setIsPlayingVoice(false);
    } else {
      if (!analysisResult) return;
      const textToSpeak = customStory || analysisResult.fullStory[activeStoryTab] || analysisResult.shortDescription[activeStoryTab] || analysisResult.title[activeStoryTab] || '';
      speakText(textToSpeak, activeStoryTab);
      setIsPlayingVoice(true);
    }
  };

  // Publish Craft
  const handlePublish = () => {
    if (!analysisResult || !selectedImage) return;

    const finalImage = (showEnhancedPreview && enhancedImage) ? enhancedImage : selectedImage;
    const finalProduct = publishNewCraft(
      analysisResult,
      finalImage,
      {
        title: {
          ...analysisResult.title,
          [activeLanguage]: customTitle || analysisResult.title[activeLanguage]
        },
        price: customPrice || analysisResult.priceBreakdown.suggestedPrice,
        fullStory: {
          ...analysisResult.fullStory,
          [activeLanguage]: customStory || analysisResult.fullStory[activeLanguage]
        }
      }
    );

    setPublishedProduct(finalProduct);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#2A1810] via-[#5C2416] to-[#1E3A2F] text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border border-amber-500/30 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  SIH26090 MoSJE AI Smart Cataloger
                </span>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 ${
                  serverHealth.online 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                }`}>
                  <Server className="w-3 h-3" />
                  {serverHealth.online ? (serverHealth.geminiConfigured ? 'Backend: Gemini Vision Ready' : 'Backend: Active (Reference Model)') : 'Local Reference Mode'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-white mb-2">
                {t('aiStudioTitle')}
              </h1>
              <p className="text-amber-100/80 text-sm sm:text-base max-w-2xl">
                {t('aiStudioSubtitle')}
              </p>
            </div>

            {/* Quick Demo Craft Buttons */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
              <div className="text-[11px] font-bold text-amber-200 uppercase tracking-wider mb-2 flex items-center gap-1">
                <span>⚡</span>
                <span>त्वरित डेमो शिल्प (Quick Presets)</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {CRAFT_DEMO_PRESETS.slice(0, 3).map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className="group flex flex-col items-center text-center p-1.5 rounded-xl hover:bg-white/15 transition-all text-xs text-white/90"
                  >
                    <img 
                      src={preset.thumbnail} 
                      alt={preset.name} 
                      className="w-10 h-10 rounded-lg object-cover mb-1 border border-white/30 group-hover:scale-105 transition-transform" 
                    />
                    <span className="text-[10px] font-medium truncate w-16">{preset.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main 2-Column Workflow */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Image Upload & Photo Studio Enhancement */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Upload / Capture Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80">
              <h2 className="text-lg font-bold text-[#1B2A4A] mb-3 flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#B84A1C]" />
                <span>1. उत्पाद की फोटो (Product Photo)</span>
              </h2>

              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  selectedImage 
                    ? 'border-[#B84A1C]/40 bg-stone-50' 
                    : 'border-stone-300 hover:border-[#B84A1C] hover:bg-[#FAF6ED]'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  accept="image/jpeg,image/png,image/webp" 
                  className="hidden" 
                />

                {selectedImage ? (
                  <div className="relative group">
                    <img 
                      src={(showEnhancedPreview && enhancedImage) ? enhancedImage : selectedImage} 
                      alt="Uploaded Craft" 
                      className="w-full h-64 object-contain rounded-xl bg-[#2A1810]/5 transition-all"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white text-xs font-semibold gap-2">
                      <Upload className="w-4 h-4" /> दूसरी फोटो चुनें (Change Photo)
                    </div>
                  </div>
                ) : (
                  <div className="py-8">
                    <div className="w-16 h-16 rounded-full bg-[#B84A1C]/10 text-[#B84A1C] flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-bold text-stone-800">
                      {t('uploadButton')}
                    </p>
                    <p className="text-xs text-stone-500 mt-1">
                      JPG, PNG, WebP (अधिकतम 15MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {analysisError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-700 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">{analysisError}</p>
                    <button 
                      onClick={() => selectedImage && runVisionAnalysis(selectedImage)}
                      className="mt-1 text-[11px] underline font-bold"
                    >
                      पुनः प्रयास करें (Retry Analysis)
                    </button>
                  </div>
                </div>
              )}

              {/* 2. Image Enhancement Tool (Studio Enhancement Workflow) */}
              {selectedImage && (
                <div className="mt-4 pt-4 border-t border-stone-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                      <Wand2 className="w-4 h-4 text-amber-600" />
                      <span>फोटो संवर्धन (Enhance Photo)</span>
                    </span>
                    {enhancedImage && (
                      <button
                        onClick={() => setShowEnhancedPreview(!showEnhancedPreview)}
                        className="text-xs text-[#B84A1C] font-bold hover:underline flex items-center gap-1"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        {showEnhancedPreview ? 'मूल देखें (Original)' : 'सुधरी फोटो देखें (Enhanced)'}
                      </button>
                    )}
                  </div>

                  <button
                    onClick={handleEnhanceImage}
                    disabled={isEnhancingImage}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-900 hover:bg-amber-500/25 border border-amber-400/40 flex items-center justify-center gap-2 transition-all"
                  >
                    {isEnhancingImage ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-amber-800 border-t-transparent rounded-full animate-spin" />
                        <span>स्टूडियो लाइटिंग सुधारी जा रही है...</span>
                      </>
                    ) : enhancedImage ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>फोटो संवर्धित है (Enhanced) — पुनः सुधारें</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 text-amber-700" />
                        <span>✨ फोटो की गुणवत्ता और रोशनी सुधारें (Enhance Studio Lighting)</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Presets Gallery */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80">
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                या पारंपरिक जीआई शिल्प चुनें (Select Indian Heritage Craft)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {CRAFT_DEMO_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className="flex items-center gap-2.5 p-2 rounded-xl border border-stone-200 hover:border-[#B84A1C] hover:bg-[#FAF6ED] text-left transition-all group"
                  >
                    <img 
                      src={preset.thumbnail} 
                      alt={preset.name} 
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0 group-hover:scale-105 transition-transform" 
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1B2A4A] truncate">{preset.name}</p>
                      <p className="text-[10px] text-stone-500">{preset.originRegion}, {preset.originState}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: AI Auto-Cataloger, GI Verification, Pricing, & Publish */}
          <div className="lg:col-span-7 space-y-6">

            {isAnalyzing ? (
              <div className="bg-white rounded-3xl p-12 shadow-sm border border-stone-200/80 text-center">
                <div className="w-16 h-16 border-4 border-[#B84A1C]/20 border-t-[#B84A1C] rounded-full animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#1B2A4A] mb-1">
                  AI शिल्प का विश्लेषण कर रहा है...
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  शिल्प तकनीक, सामग्री, जीआई भौगोलिक संकेत, सांस्कृतिक कथा और उचित कारीगर मूल्य का आकलन किया जा रहा है।
                </p>
              </div>
            ) : analysisResult ? (
              <>
                {/* Product Identification & GI Verification Status */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-[#B84A1C]/10 text-[#B84A1C] rounded-full text-xs font-bold uppercase tracking-wider">
                        {analysisResult.category}
                      </span>
                      {analysisResult.hasGiTag && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                          analysisResult.giVerificationStatus === 'verified'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          <Award className="w-3.5 h-3.5" />
                          {analysisResult.giVerificationStatus === 'verified' ? '✓ GI Verified' : '? AI-Suggested GI'}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-stone-500 flex items-center gap-1 font-semibold">
                      <span>स्रोत:</span>
                      <span className="font-bold text-stone-700">
                        {analysisResult.resultSource === 'gemini_api' 
                          ? 'Gemini Vision AI' 
                          : analysisResult.resultSource === 'backend_api' 
                          ? 'Mela Backend Engine' 
                          : 'Reference Craft Knowledge'}
                      </span>
                    </div>
                  </div>

                  {/* Editable Title */}
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-stone-500 mb-1">
                      उत्पाद का नाम (Product Title)
                    </label>
                    <input 
                      type="text" 
                      value={customTitle} 
                      onChange={(e) => setCustomTitle(e.target.value)} 
                      className="w-full text-lg sm:text-xl font-bold text-[#1B2A4A] bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B84A1C]/30 focus:border-[#B84A1C]"
                    />
                  </div>

                  {/* Craft Technique & Origin */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                      <span className="text-stone-500 block font-medium">पारंपरिक तकनीक (Technique):</span>
                      <span className="font-bold text-stone-800">{analysisResult.craftTechnique}</span>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                      <span className="text-stone-500 block font-medium">उत्पत्ति क्षेत्र (Origin):</span>
                      <span className="font-bold text-stone-800">{analysisResult.originRegion}, {analysisResult.originState}</span>
                    </div>
                  </div>

                  {/* Materials */}
                  <div className="mb-4">
                    <span className="text-xs font-bold text-stone-500 block mb-1.5">उपयोग की गई प्राकृतिक सामग्रियां (Materials):</span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.materials.map((mat, i) => (
                        <span key={i} className="px-2.5 py-1 bg-stone-100 text-stone-700 rounded-lg text-xs font-medium">
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Info Prompt (Active AI Assistant) */}
                  {analysisResult.missingInfoPrompt && (
                    <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start gap-3 text-xs mb-4">
                      <HelpCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-bold text-amber-900">{analysisResult.missingInfoPrompt}</p>
                        <input 
                          type="text" 
                          placeholder="यहाँ जानकारी दर्ज करें (वैकल्पिक)..." 
                          value={artisanNoteInput} 
                          onChange={(e) => setArtisanNoteInput(e.target.value)}
                          className="mt-2 w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs text-stone-800 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Multilingual Story & Voice Narration */}
                  <div className="border-t border-stone-100 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-stone-700">सांस्कृतिक विवरण व कथा (Story):</span>
                      <button
                        onClick={handleToggleVoice}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isPlayingVoice 
                            ? 'bg-red-500 text-white' 
                            : 'bg-[#B84A1C]/10 text-[#B84A1C] hover:bg-[#B84A1C]/20'
                        }`}
                      >
                        {isPlayingVoice ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        <span>{isPlayingVoice ? 'रोकें (Stop)' : 'बोलकर सुनें (Listen)'}</span>
                      </button>
                    </div>

                    {/* Language Tabs */}
                    <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setActiveStoryTab(lang.code);
                            if (analysisResult.fullStory[lang.code]) {
                              setCustomStory(analysisResult.fullStory[lang.code] || '');
                            }
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                            activeStoryTab === lang.code
                              ? 'bg-[#1B2A4A] text-white'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          {lang.native}
                        </button>
                      ))}
                    </div>

                    <textarea
                      rows={3}
                      value={customStory}
                      onChange={(e) => setCustomStory(e.target.value)}
                      className="w-full text-xs text-stone-700 bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#B84A1C]/30 focus:border-[#B84A1C]"
                    />
                  </div>
                </div>

                {/* Explainable Fair Pricing Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-[#1B2A4A] flex items-center gap-2">
                      <Coins className="w-5 h-5 text-emerald-600" />
                      <span>उचित कारीगर मूल्य निर्धारण (Explainable Fair Price)</span>
                    </h3>
                    <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
                      आधार: {analysisResult.priceBreakdown.estimationBasis === 'ai_analysis' ? 'AI Craft Complexity' : 'Ministry Standard Reference'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-center">
                      <span className="text-[11px] text-stone-500 block">कच्ची सामग्री</span>
                      <span className="text-sm font-bold text-stone-800">₹{analysisResult.priceBreakdown.rawMaterialCost}</span>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-center">
                      <span className="text-[11px] text-stone-500 block">श्रम ({analysisResult.priceBreakdown.artisanLaborHours} घंटे)</span>
                      <span className="text-sm font-bold text-stone-800">₹{analysisResult.priceBreakdown.fairLaborCost}</span>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-center">
                      <span className="text-[11px] text-stone-500 block">पैकेजिंग व सुरक्षा</span>
                      <span className="text-sm font-bold text-stone-800">₹{analysisResult.priceBreakdown.packagingAndLogistics}</span>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                      <span className="text-[11px] text-emerald-700 block font-medium">कारीगर लाभ (Margin)</span>
                      <span className="text-sm font-bold text-emerald-800">₹{analysisResult.priceBreakdown.fairMargin}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-[#FAF6ED] rounded-2xl border border-emerald-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-stone-600 font-medium block">
                        बाज़ार संदर्भ श्रेणी: ₹{analysisResult.priceBreakdown.marketRangeMin} — ₹{analysisResult.priceBreakdown.marketRangeMax}
                      </span>
                      <span className="text-xs text-emerald-800 font-bold">
                        सीधा कारीगर हिस्सा: {analysisResult.priceBreakdown.artisanDirectSharePercent}%
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[11px] text-stone-500 block">अनुशंसित मूल्य:</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xl sm:text-2xl font-black text-[#1B2A4A]">₹</span>
                          <input 
                            type="number" 
                            value={customPrice} 
                            onChange={(e) => setCustomPrice(Number(e.target.value))}
                            className="w-24 text-xl sm:text-2xl font-black text-[#1B2A4A] bg-white border border-stone-300 rounded-lg px-2 py-0.5 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WhatsApp & Instagram Marketing Blurbs */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80">
                  <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-[#B84A1C]" />
                    <span>मार्केटिंग संदेश (Instant Social Blurbs)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-emerald-50/50 border border-emerald-200/60 rounded-xl">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-emerald-800">WhatsApp ब्रॉडकास्ट</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(analysisResult.socialBlurbWhatsApp);
                            setCopiedWhatsApp(true);
                            setTimeout(() => setCopiedWhatsApp(false), 2000);
                          }}
                          className="text-[11px] font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                        >
                          {copiedWhatsApp ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          {copiedWhatsApp ? 'कॉपी किया' : 'कॉपी'}
                        </button>
                      </div>
                      <p className="text-xs text-stone-700 line-clamp-2">{analysisResult.socialBlurbWhatsApp}</p>
                    </div>

                    <div className="p-3 bg-purple-50/50 border border-purple-200/60 rounded-xl">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-purple-800">Instagram कैप्शन</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(analysisResult.socialBlurbInstagram);
                            setCopiedInsta(true);
                            setTimeout(() => setCopiedInsta(false), 2000);
                          }}
                          className="text-[11px] font-semibold text-purple-700 hover:underline flex items-center gap-1"
                        >
                          {copiedInsta ? <Check className="w-3 h-3 text-purple-600" /> : <Copy className="w-3 h-3" />}
                          {copiedInsta ? 'कॉपी किया' : 'कॉपी'}
                        </button>
                      </div>
                      <p className="text-xs text-stone-700 line-clamp-2">{analysisResult.socialBlurbInstagram}</p>
                    </div>
                  </div>
                </div>

                {/* Publish Action Button */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-[#1B2A4A]">तैयार है? बाज़ार में प्रकाशित करें</h4>
                    <p className="text-xs text-stone-500">
                      सीधे लाइव बाज़ार में जुड़ेगा। कोई नकली समीक्षाएं नहीं, केवल प्रामाणिक विवरण।
                    </p>
                  </div>

                  <button
                    onClick={handlePublish}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#B84A1C] to-amber-700 text-white font-bold text-sm shadow-lg shadow-[#B84A1C]/25 hover:shadow-xl hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <span>🚀 बाज़ार में प्रकाशित करें (Publish Now)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Published Success Dialog */}
                {publishedProduct && (
                  <div className="p-6 bg-emerald-50 border-2 border-emerald-300 rounded-3xl animate-in fade-in slide-in-from-bottom-3 duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                        <Check className="w-6 h-6 stroke-[3]" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-emerald-950">
                          बधाई हो! आपका शिल्प लाइव प्रकाशित हो गया है
                        </h4>
                        <p className="text-xs text-emerald-700">
                          उत्पाद अब मेला बाज़ार में खरीदारों के लिए उपलब्ध है।
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => {
                          setSelectedProductForModal(publishedProduct);
                        }}
                        className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:bg-emerald-800 transition-all flex items-center gap-1.5"
                      >
                        <Eye className="w-4 h-4" />
                        <span>लाइव उत्पाद देखें (View Listing)</span>
                      </button>
                      <button
                        onClick={() => setCurrentView('marketplace')}
                        className="px-4 py-2 bg-white text-emerald-800 border border-emerald-300 text-xs font-bold rounded-xl hover:bg-emerald-100 transition-all"
                      >
                        बाज़ार में जाएं (Go to Marketplace)
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-3xl p-12 shadow-sm border border-stone-200/80 text-center">
                <div className="w-20 h-20 rounded-full bg-amber-500/10 text-amber-700 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-[#1B2A4A] mb-1">
                  बाईं ओर से एक फोटो चुनें या अपलोड करें
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto mb-6">
                  फोटो अपलोड करते ही AI स्टूडियो तकनीक, सामग्री, जीआई भौगोलिक स्थिति, उचित मूल्य व बहुभाषी विवरण तैयार कर देगा।
                </p>
                <button
                  onClick={() => handlePresetSelect(CRAFT_DEMO_PRESETS[0])}
                  className="px-6 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-stone-700 transition-all inline-flex items-center gap-2"
                >
                  <span>डेमो जयपुर ब्लू पॉटरी आज़माएं (Try Demo)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
