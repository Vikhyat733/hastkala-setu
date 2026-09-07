import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { SupportedLanguage } from '../types';
import { LANGUAGES } from '../data/translations';
import { speakText, stopSpeech } from '../services/geminiVision';
import { B2BInquiryModal } from './B2BInquiryModal';
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
  Check,
  Building2,
  Coins,
  CheckCircle2,
  HelpCircle
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
  const [isB2BModalOpen, setIsB2BModalOpen] = useState(false);

  React.useEffect(() => {
    setActiveStoryLang(activeLanguage);
  }, [activeLanguage]);

  if (!selectedProductForModal) return null;

  const product = selectedProductForModal;
  const wishlisted = isWishlisted(product.id);

  const title = product.title[activeStoryLang] || product.title.en;
  const desc = product.shortDescription[activeStoryLang] || product.shortDescription.en;
  const story = product.fullStory[activeStoryLang] || product.fullStory.en;

  const handleAudioToggle = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      const audioScript = `${title}. Handcrafted in ${product.originState} by Master Artisan ${product.artisan.name}. ${story || desc}`;
      speakText(audioScript, activeStoryLang || 'hi');
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
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
        
        <div 
          className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Top Header Bar */}
          <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-[#FAF6F0]">
            <div className="flex items-center gap-2">
              {product.giTagStatus.hasGiTag && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-xs ${
                  product.giTagStatus.verificationStatus === 'verified'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-600 text-white'
                }`}>
                  <Award className="w-3.5 h-3.5" />
                  <span>
                    {product.giTagStatus.verificationStatus === 'verified'
                      ? `✓ ${product.giTagStatus.registeredName || 'GI Verified Heritage'}`
                      : `? AI-Suggested GI: ${product.giTagStatus.registeredName || 'Regional Motif'}`}
                  </span>
                </span>
              )}
              <span className="text-xs font-bold text-stone-700 bg-white px-2.5 py-1 rounded-full border border-stone-200">
                {product.originRegion}, {product.originState}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-stone-200 transition-colors text-stone-600"
                title="Share link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>
              
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-stone-200 transition-colors text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto p-4 sm:p-8 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
              
              {/* Left Column: Image Gallery */}
              <div className="md:col-span-6 space-y-3">
                <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                  <img
                    src={product.images[selectedImageIndex] || product.images[0]}
                    alt={title}
                    className="w-full h-full object-cover"
                  />

                  {/* Audio Narration Floating Button */}
                  <button
                    onClick={handleAudioToggle}
                    className={`absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-md transition-all ${
                      isPlayingAudio
                        ? 'bg-red-500 text-white'
                        : 'bg-white/90 text-[#1B2A4A] hover:bg-white'
                    }`}
                  >
                    {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#B84A1C]" />}
                    <span>{isPlayingAudio ? t('stopAudio') : t('listenStory')}</span>
                  </button>
                </div>

                {/* Thumbnail Strip */}
                {product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                          selectedImageIndex === idx
                            ? 'border-[#B84A1C] scale-105'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Artisan Profile Card */}
                <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-stone-200/80 flex items-center gap-3">
                  <img
                    src={product.artisan.avatar}
                    alt={product.artisan.name}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-xs"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#1B2A4A] truncate">{product.artisan.name}</p>
                    <p className="text-[11px] text-stone-500">{product.artisan.craftSpecialty}</p>
                    <p className="text-[10px] text-emerald-700 font-semibold">
                      ✓ {product.artisan.village}, {product.artisan.state}
                    </p>
                  </div>
                </div>

                {/* Subtle Trust Layer Badges */}
                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5 text-xs text-stone-600">
                  <div className="text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t('trustAndVerification')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{t('artisanVerified')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{t('authenticHandicraft')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{t('fairTradeDirectShare')}</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Details & Actions */}
              <div className="md:col-span-6 space-y-4">
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#B84A1C] uppercase tracking-wider">
                      {product.category}
                    </span>
                    {product.reviewCount > 0 ? (
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>{product.rating.toFixed(1)}</span>
                        <span className="text-stone-400">({product.reviewCount} {t('reviews')})</span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        🌱 {t('newCraft')}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1B2A4A] leading-tight">
                    {title}
                  </h2>
                </div>

                {/* Price & Direct Artisan Share */}
                <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-stone-200 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-[#1B2A4A]">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-stone-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
                      ✓ <strong>{product.priceBreakdown.artisanDirectSharePercent}%</strong> ({formatPrice(Math.round(product.price * (product.priceBreakdown.artisanDirectSharePercent / 100)))}) {t('directlyCredited')}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                      {t('giFairTradeGuarantee')}
                    </span>
                  </div>
                </div>

                {/* Multilingual Story */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                      {t('culturalStory')}
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
                              ? 'bg-[#B84A1C] text-white'
                              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                          }`}
                        >
                          {lang.native}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs text-stone-700 leading-relaxed">
                    <p>{story || desc}</p>
                    <div className="pt-2 mt-2 border-t border-stone-200/60 flex flex-wrap gap-2 text-[11px]">
                      <span className="font-semibold text-stone-900">{t('craftTechniqueLabel')}</span>
                      <span>{product.craftTechnique}</span>
                    </div>
                  </div>
                </div>

                {/* Transparent Price Breakdown */}
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#1B2A4A]">
                    <span className="flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-emerald-600" />
                      <span>{t('transparentPriceBreakdown')}</span>
                    </span>
                    <span className="text-[10px] text-stone-500 font-semibold">
                      {product.priceBreakdown.estimationBasis === 'ai_analysis' ? t('aiAnalyzed') : t('standardBenchmark')}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-[11px] pt-1 text-center">
                    <div className="bg-white p-2 rounded-xl border border-amber-500/10">
                      <p className="text-stone-500 text-[10px]">{t('rawMaterials')}</p>
                      <p className="font-bold text-stone-800">{formatPrice(product.priceBreakdown.rawMaterialCost)}</p>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-amber-500/10">
                      <p className="text-stone-500 text-[10px]">{t('labor')} ({product.priceBreakdown.artisanLaborHours}h)</p>
                      <p className="font-bold text-stone-800">{formatPrice(product.priceBreakdown.fairLaborCost)}</p>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-amber-500/10">
                      <p className="text-stone-500 text-[10px]">{t('packaging')}</p>
                      <p className="font-bold text-stone-800">{formatPrice(product.priceBreakdown.packagingAndLogistics)}</p>
                    </div>
                    <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                      <p className="text-emerald-700 text-[10px]">{t('artisanMargin')}</p>
                      <p className="font-bold text-emerald-800">{formatPrice(product.priceBreakdown.fairMargin)}</p>
                    </div>
                  </div>
                </div>

                {/* Actions: Add to Cart, Buy Now, & B2B Bulk Request */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-stone-50">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3.5 py-1.5 font-bold text-sm hover:bg-stone-200 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 py-1.5 font-bold text-sm text-[#1B2A4A]">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3.5 py-1.5 font-bold text-sm hover:bg-stone-200 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="p-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 transition-all text-[#1B2A4A]"
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
                      className="py-3 px-4 rounded-2xl border-2 border-[#B84A1C] text-[#B84A1C] hover:bg-[#B84A1C] hover:text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{t('addToCart')}</span>
                    </button>

                    <button
                      onClick={handleBuyNow}
                      className="py-3 px-4 rounded-2xl bg-gradient-to-r from-[#B84A1C] to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-[#B84A1C]/30 hover:scale-102 transition-all flex items-center justify-center gap-2"
                    >
                      <span>{t('buyNow')}</span>
                    </button>
                  </div>

                  {/* B2B Wholesale Quote Button */}
                  <button
                    onClick={() => setIsB2BModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <Building2 className="w-4 h-4 text-purple-700" />
                    <span>🏢 {t('b2bWholesaleTitle')}</span>
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* B2B Inquiry Modal */}
      <B2BInquiryModal
        product={product}
        isOpen={isB2BModalOpen}
        onClose={() => setIsB2BModalOpen(false)}
      />
    </>
  );
};
