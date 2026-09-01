import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { SupportedLanguage } from '../types';
import { LANGUAGES } from '../data/translations';
import { speakText, stopSpeech } from '../services/geminiVision';
import { 
  X, 
  Award, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  Clock, 
  Leaf, 
  Star, 
  Share2,
  Check
} from 'lucide-react';

export const ProductModal: React.FC = () => {
  const {
    selectedProductForModal,
    setSelectedProductForModal,
    activeLanguage,
    formatPrice,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setIsCheckoutOpen,
    t
  } = useMarketplace();

  const [activeStoryLang, setActiveStoryLang] = useState<SupportedLanguage>(activeLanguage);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!selectedProductForModal) return null;

  const product = selectedProductForModal;
  const wishlisted = isWishlisted(product.id);

  const title = product.title[activeStoryLang as any] || product.title.en;
  const desc = product.shortDescription[activeStoryLang as any] || product.shortDescription.en;
  const story = product.fullStory[activeStoryLang as any] || product.fullStory.en;

  const handleAudioToggle = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      const audioScript = `${title}. Handcrafted in ${product.originState} by Master Artisan ${product.artisan.name}. ${story || desc}`;
      speakText(audioScript, (activeStoryLang as any) || 'en');
      setIsPlayingAudio(true);
    }
  };

  const handleClose = () => {
    stopSpeech();
    setIsPlayingAudio(false);
    setSelectedProductForModal(null);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    handleClose();
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div 
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-artisan-terracotta/20 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-artisan-terracotta/10 flex items-center justify-between bg-artisan-sand/60">
          <div className="flex items-center gap-2">
            {product.giTagStatus.hasGiTag && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold shadow-xs">
                <Award className="w-3.5 h-3.5" />
                <span>{product.giTagStatus.registeredName || 'GI Certified Heritage'}</span>
              </span>
            )}
            <span className="text-xs font-bold text-artisan-slate/70 bg-white px-2.5 py-1 rounded-full border border-artisan-terracotta/15">
              {product.originState}, India
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-artisan-sand text-artisan-indigo transition-colors"
              title="Share Craft Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-artisan-sand text-artisan-indigo transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-4 sm:p-8 space-y-8 flex-1">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: Image Gallery */}
            <div className="space-y-4">
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-artisan-sand border border-artisan-terracotta/15 shadow-inner">
                <img
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                
                {/* Audio Read-Aloud Floating Button */}
                <button
                  onClick={handleAudioToggle}
                  className={`absolute bottom-4 right-4 flex items-center gap-2 px-3.5 py-2 rounded-full backdrop-blur-md font-bold text-xs shadow-lg transition-all ${
                    isPlayingAudio
                      ? 'bg-artisan-terracotta text-white animate-pulse'
                      : 'bg-white/90 text-artisan-indigo hover:bg-white hover:scale-105'
                  }`}
                >
                  {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-artisan-terracotta" />}
                  <span>{isPlayingAudio ? t('stopAudio') : t('listenStory')}</span>
                </button>
              </div>

              {/* Thumbnails if multiple images */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImageIndex === idx ? 'border-artisan-terracotta scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Artisan Profile Card */}
              <div className="bg-gradient-to-br from-artisan-sand to-white p-4 sm:p-5 rounded-2xl border border-artisan-terracotta/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.artisan.avatar}
                      alt={product.artisan.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-artisan-terracotta"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-artisan-indigo">{product.artisan.name}</h4>
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      </div>
                      <p className="text-[11px] text-artisan-slate/70">
                        {product.artisan.village}, {product.artisan.state}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold bg-artisan-terracotta/10 text-artisan-terracotta px-2.5 py-1 rounded-full">
                    {product.artisan.experienceYears} Yrs Master
                  </span>
                </div>

                <p className="text-xs italic text-artisan-slate/80 font-serif border-l-2 border-artisan-terracotta pl-3">
                  "{product.artisan.storyQuote}"
                </p>
              </div>

            </div>

            {/* Right Column: Title, Multilingual Story, Pricing & Actions */}
            <div className="space-y-6">
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-artisan-terracotta uppercase tracking-wider">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{product.rating.toFixed(1)}</span>
                    <span className="text-artisan-slate/50">({product.reviewCount} reviews)</span>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-artisan-indigo leading-tight">
                  {title}
                </h2>
              </div>

              {/* Price & Artisan Fair Share Badge */}
              <div className="p-4 rounded-2xl bg-artisan-sand/70 border border-artisan-terracotta/15 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-artisan-indigo">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-artisan-slate/50 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
                    ✓ <strong>{product.priceBreakdown.artisanDirectSharePercent}%</strong> ({formatPrice(Math.round(product.price * (product.priceBreakdown.artisanDirectSharePercent / 100)))}) goes directly to {product.artisan.name}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                    Fair-Trade Certified
                  </span>
                </div>
              </div>

              {/* Multilingual Story Tabs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-artisan-slate/70">
                    Read Story in Language:
                  </span>
                  <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] scrollbar-none">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setActiveStoryLang(lang.code);
                          if (isPlayingAudio) stopSpeech();
                          setIsPlayingAudio(false);
                        }}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
                          activeStoryLang === lang.code
                            ? 'bg-artisan-terracotta text-white'
                            : 'bg-artisan-sand text-artisan-indigo hover:bg-artisan-sand-dark'
                        }`}
                      >
                        {lang.flag} {lang.native}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-artisan-sand/40 p-4 rounded-2xl border border-artisan-terracotta/10 space-y-2">
                  <p className="text-sm font-medium text-artisan-indigo leading-relaxed">
                    {story || desc}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-artisan-slate/80">
                    <span className="font-semibold text-artisan-indigo">Craft Technique:</span>
                    <span>{product.craftTechnique}</span>
                  </div>
                </div>
              </div>

              {/* Transparent Price Breakdown Modal Accordion */}
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-artisan-indigo">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>{t('transparentPricing')}</span>
                  </span>
                  <span className="text-emerald-700">Zero Middleman Markup</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
                  <div className="bg-white p-2.5 rounded-xl border border-amber-500/10">
                    <p className="text-artisan-slate/60 text-[10px]">{t('rawMaterials')}</p>
                    <p className="font-bold text-artisan-indigo">{formatPrice(product.priceBreakdown.rawMaterialCost)}</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-amber-500/10">
                    <p className="text-artisan-slate/60 text-[10px]">{t('laborHours')}</p>
                    <p className="font-bold text-artisan-indigo">{product.priceBreakdown.artisanLaborHours} hrs (@₹{product.priceBreakdown.hourlyFairWageRate}/hr)</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-amber-500/10">
                    <p className="text-artisan-slate/60 text-[10px]">Artisan Take-Home</p>
                    <p className="font-bold text-emerald-700">{formatPrice(product.priceBreakdown.fairLaborCost)}</p>
                  </div>
                </div>
              </div>

              {/* Quantity Selector and Purchase Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-artisan-terracotta/20 rounded-xl overflow-hidden bg-artisan-sand">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-2 font-bold text-sm hover:bg-artisan-sand-dark transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-bold text-sm text-artisan-indigo">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3.5 py-2 font-bold text-sm hover:bg-artisan-sand-dark transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="p-2.5 rounded-xl border border-artisan-terracotta/20 hover:bg-artisan-sand transition-all text-artisan-indigo"
                  >
                    <Heart className={`w-5 h-5 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      addToCart(product, quantity);
                      handleClose();
                    }}
                    className="py-3 px-4 rounded-2xl border-2 border-artisan-terracotta text-artisan-terracotta hover:bg-artisan-terracotta hover:text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t('addToCart')}</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="py-3 px-4 rounded-2xl bg-gradient-to-r from-artisan-terracotta to-artisan-saffron-gold text-white font-bold text-sm shadow-md shadow-artisan-terracotta/30 hover:scale-102 transition-all flex items-center justify-center gap-2"
                  >
                    <span>{t('buyNow')}</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
