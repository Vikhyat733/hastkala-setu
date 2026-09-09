import React, { useState } from 'react';
import { Sparkles, CheckCircle2, PackageCheck, Edit3, RefreshCw, MapPin, Home, Package } from 'lucide-react';
import { useProductCreation } from '../context/ProductCreationContext';
import { useMela } from '../../../context/MelaContext';
import { AppHeader } from '../../../core/design-system/AppHeader';
import { PrimaryButton } from '../../../core/design-system/PrimaryButton';

export const ProductPreviewScreen: React.FC = () => {
  const {
    state,
    setStep,
    publishToMarket,
    isPublishing,
    resetState,
    errorMessage,
  } = useProductCreation();

  const { t, selectedLanguage, navigate, currentUser } = useMela();
  const lang = selectedLanguage as 'hi' | 'en';
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handlePublish = async () => {
    const success = await publishToMarket();
    if (success) {
      setShowSuccessModal(true);
    }
  };

  const handleGoHome = () => {
    resetState();
    navigate('/dashboard');
  };

  const handleGoToMyProducts = () => {
    resetState();
    navigate('/my-products');
  };

  const activeDescription =
    lang === 'en'
      ? (state.descriptionEnglish || state.descriptionHindi)
      : (state.descriptionHindi || state.descriptionEnglish);

  const artisanName = currentUser?.name || (lang === 'hi' ? 'राधा जी' : 'Radha');

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col">
      <AppHeader
        title={lang === 'hi' ? 'पूर्वावलोकन (Preview)' : 'Product Preview'}
        subtitle={lang === 'hi' ? 'बाज़ार में ऐसा दिखेगा' : 'Marketplace Preview'}
        onBack={() => setStep('pricing')}
        showLanguageToggle={false}
      />

      <main className="flex-1 max-w-md w-full mx-auto p-4 md:p-6 space-y-5 pb-8">
        {/* Title */}
        <div className="text-center space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-[#261D1A]">
            {t.sellProduct.preview.title}
          </h2>
          <p className="text-xs text-[#6B5E59] font-medium">
            {t.sellProduct.preview.subtitle}
          </p>
        </div>

        {/* Error banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
            {errorMessage}
          </div>
        )}

        {/* Marketplace Product Card — using actual product data */}
        <div className="bg-white rounded-3xl overflow-hidden border-2 border-[#E0D8CE] shadow-lg">
          {/* Hero Image — actual uploaded/enhanced image */}
          <div className="relative aspect-[4/3] w-full bg-stone-100">
            {(state.enhancedImage || state.image) ? (
              <img
                src={state.enhancedImage || state.image}
                alt={state.title || 'Product'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-400 text-4xl">
                📦
              </div>
            )}

            {/* Status badges */}
            <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
              <span className="px-2.5 py-1 rounded-full bg-emerald-700 text-white text-[10px] font-black shadow-sm flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {lang === 'hi' ? 'उपलब्ध' : 'In Stock'}
              </span>
            </div>

            {/* Origin tag */}
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-[#261D1A] shadow-md flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#C04B27]" />
              <span>{lang === 'hi' ? 'भारत' : 'India'}</span>
            </div>
          </div>

          {/* Product Details */}
          <div className="p-5 space-y-4 pt-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {state.category && (
                  <span className="text-[11px] font-bold text-[#C04B27] uppercase tracking-wider block truncate">
                    {state.category}
                    {state.material ? ` • ${state.material}` : ''}
                  </span>
                )}
                <h3 className="text-lg font-black text-[#261D1A] mt-0.5 leading-snug">
                  {state.title || (lang === 'hi' ? 'हस्तनिर्मित शिल्पकृति' : 'Handcrafted Item')}
                </h3>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-[10px] font-bold text-[#6B5E59] uppercase block">
                  {lang === 'hi' ? 'मूल्य' : 'Price'}
                </span>
                <span className="text-2xl font-black text-[#1B4D3E]">
                  ₹{state.finalPrice > 0 ? state.finalPrice : (state.suggestedPrice > 0 ? state.suggestedPrice : '--')}
                </span>
              </div>
            </div>

            {/* Description — actual generated description */}
            {activeDescription && (
              <div className="bg-[#FAF6F0] p-3.5 rounded-2xl border border-[#EAE2D5] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B5E59]">
                  {lang === 'hi' ? 'विवरण:' : 'Description:'}
                </span>
                <p className="text-xs text-[#261D1A] font-medium leading-relaxed">
                  {activeDescription}
                </p>
              </div>
            )}

            {/* Artisan info */}
            <div className="flex items-center justify-between text-xs text-[#6B5E59] pt-1 border-t border-[#F0EBE1]">
              <span className="flex items-center gap-1 font-semibold">
                <PackageCheck className="w-4 h-4 text-[#1B4D3E]" />
                {lang === 'hi' ? `शिल्पकार: ${artisanName}` : `Artisan: ${artisanName}`}
              </span>
              <span className="font-bold text-[#1B4D3E]">
                {lang === 'hi' ? 'सत्यापित' : 'Verified'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <PrimaryButton onClick={handlePublish} disabled={isPublishing}>
            <span className="flex items-center justify-center gap-2">
              {isPublishing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>{lang === 'hi' ? 'प्रकाशित हो रहा है...' : 'Publishing...'}</span>
                </>
              ) : (
                <span>{t.sellProduct.preview.publishNow}</span>
              )}
            </span>
          </PrimaryButton>

          <button
            type="button"
            onClick={() => setStep('catalog')}
            disabled={isPublishing}
            className="w-full py-3.5 px-4 rounded-2xl border-2 border-[#E0D8CE] bg-white text-[#6B5E59] hover:text-[#261D1A] font-bold text-xs flex items-center justify-center gap-2 shadow-xs hover:bg-stone-50 active:scale-98 transition-all cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            {t.sellProduct.preview.editDetails}
          </button>
        </div>
      </main>

      {/* ─── SUCCESS MODAL ─── */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center border-2 border-[#1B4D3E] shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="text-5xl">🎉</div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-[#1B4D3E]">
                {t.sellProduct.preview.successTitle}
              </h3>
              <p className="text-xs text-[#6B5E59] leading-relaxed">
                {t.sellProduct.preview.successDesc}
              </p>
            </div>

            {/* Product summary card */}
            <div className="p-3 bg-[#FAF6F0] rounded-2xl border border-[#E0D8CE] text-left text-xs font-medium space-y-1.5">
              {state.title && (
                <div className="flex justify-between gap-2">
                  <span className="text-[#6B5E59] flex-shrink-0">{lang === 'hi' ? 'सामान:' : 'Item:'}</span>
                  <span className="font-bold text-[#261D1A] truncate">{state.title}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#6B5E59]">{lang === 'hi' ? 'कीमत:' : 'Price:'}</span>
                <span className="font-black text-[#1B4D3E]">
                  ₹{state.finalPrice > 0 ? state.finalPrice : (state.suggestedPrice > 0 ? state.suggestedPrice : '--')}
                </span>
              </div>
            </div>

            {/* PRIMARY: Go to Home */}
            <PrimaryButton onClick={handleGoHome}>
              <span className="flex items-center justify-center gap-2">
                <Home className="w-5 h-5" />
                {lang === 'hi' ? '🏠 होम पर जाएँ' : '🏠 Go to Home'}
              </span>
            </PrimaryButton>

            {/* SECONDARY: View My Products */}
            <button
              type="button"
              onClick={handleGoToMyProducts}
              className="w-full py-3 rounded-2xl border-2 border-[#1B4D3E] text-[#1B4D3E] font-black text-sm flex items-center justify-center gap-2 hover:bg-[#1B4D3E]/5 transition-colors"
            >
              <Package className="w-4 h-4" />
              {lang === 'hi' ? '📦 मेरे सामान देखें' : '📦 View My Products'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
