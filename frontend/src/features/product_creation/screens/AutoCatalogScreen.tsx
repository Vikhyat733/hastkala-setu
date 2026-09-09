import React, { useState } from 'react';
import { Sparkles, Edit3, CheckCircle2, ArrowRight, Tag, Layers, RefreshCw, HelpCircle, Check } from 'lucide-react';
import { useProductCreation } from '../context/ProductCreationContext';
import { useMela } from '../../../context/MelaContext';
import { AppHeader } from '../../../core/design-system/AppHeader';
import { PrimaryButton } from '../../../core/design-system/PrimaryButton';
import { EditFieldModal } from '../components/EditFieldModal';

export const AutoCatalogScreen: React.FC = () => {
  const {
    state,
    updateState,
    setStep,
    calculatePricing,
    isCalculatingPrice,
  } = useProductCreation();

  const { t, selectedLanguage } = useMela();
  const lang = selectedLanguage as 'hi' | 'en';

  // Active language tab for description
  const [descLangTab, setDescLangTab] = useState<'hi' | 'en'>(lang);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  // Edit modal state
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    key: string;
    val: string;
    isTextArea?: boolean;
  }>({
    isOpen: false,
    title: '',
    key: '',
    val: '',
    isTextArea: false,
  });

  const openEditModal = (title: string, key: string, val: string, isTextArea = false) => {
    setModalConfig({
      isOpen: true,
      title,
      key,
      val,
      isTextArea,
    });
  };

  const handleSaveModal = (newValue: string) => {
    const updatedManual = {
      ...(state.manuallyEditedFields || {}),
      [modalConfig.key]: true,
    };

    switch (modalConfig.key) {
      case 'title':
        updateState({ title: newValue, manuallyEditedFields: updatedManual });
        break;
      case 'category':
        updateState({ category: newValue, manuallyEditedFields: updatedManual });
        break;
      case 'material':
        updateState({ material: newValue, manuallyEditedFields: updatedManual });
        break;
      case 'craftType':
        updateState({ craftType: newValue, manuallyEditedFields: updatedManual });
        break;
      case 'descriptionHindi':
        updateState({ descriptionHindi: newValue, manuallyEditedFields: updatedManual });
        break;
      case 'descriptionEnglish':
        updateState({ descriptionEnglish: newValue, manuallyEditedFields: updatedManual });
        break;
    }
  };

  const handleNext = async () => {
    await calculatePricing();
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-between">
      {/* Header with Standardized Back Button */}
      <AppHeader
        title={lang === 'hi' ? 'उत्पाद विवरण' : 'Product Details'}
        subtitle={state.isAiAnalyzed ? 'MELA AI Catalog' : (lang === 'hi' ? 'MELA विवरण' : 'MELA Catalog')}
        onBack={() => setStep('voice')}
        showLanguageToggle={false}
      />

      <main className="flex-1 max-w-md w-full mx-auto p-4 md:p-6 space-y-4 pb-8">
        {/* Title & AI / Source Indicator */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[#261D1A]">
              {lang === 'hi' ? 'उत्पाद विवरण' : 'Product Details'}
            </h2>
            <p className="text-xs text-[#6B5E59]">
              {lang === 'hi'
                ? 'आपकी फोटो और आवाज़ से तैयार किया गया'
                : 'Created from your photo and voice description'}
            </p>
          </div>
          {state.isAiAnalyzed ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1B4D3E]/10 text-[#1B4D3E] text-[11px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#C04B27]" />
              {lang === 'hi' ? 'MELA AI विश्लेषित' : 'Analyzed by MELA AI'}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1B4D3E]/10 text-[#1B4D3E] text-[11px] font-black uppercase tracking-wider">
              <CheckCircle2 className="w-3 h-3 text-[#1B4D3E]" />
              {lang === 'hi' ? 'आवाज़ विवरण' : 'Voice Details'}
            </span>
          )}
        </div>

        {/* Optional AI Confirmation Banner for Uncertain Detections */}
        {state.confirmationQuestion && !isConfirmed && (
          <div className="p-3.5 bg-amber-50 rounded-2xl border-2 border-amber-200/80 shadow-2xs space-y-2 animate-in fade-in">
            <div className="flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                  {lang === 'hi' ? 'पुष्टि करें (Confirmation)' : 'Confirm Details'}
                </span>
                <p className="text-xs font-bold text-[#261D1A]">
                  {state.confirmationQuestion}
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <button
                type="button"
                onClick={() => openEditModal(t.sellProduct.catalog.productTitle, 'title', state.title)}
                className="px-3 py-1 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-100/50"
              >
                {lang === 'hi' ? 'बदलें (Edit)' : 'Edit'}
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmed(true)}
                className="px-3 py-1 rounded-xl bg-[#1B4D3E] text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
              >
                <Check className="w-3 h-3" />
                {lang === 'hi' ? 'हाँ, सही है (Yes)' : 'Yes, Correct'}
              </button>
            </div>
          </div>
        )}

        {/* Small thumbnail preview */}
        <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#E0D8CE] shadow-2xs">
          <img
            src={state.enhancedImage || state.image || 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=300'}
            alt="Craft Thumbnail"
            className="w-14 h-14 rounded-xl object-cover border border-[#E8E2D9] flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-[#6B5E59] uppercase">
              {lang === 'hi' ? 'उत्पाद फोटो' : 'Product Photo'}
            </p>
            <p className="text-sm font-black text-[#261D1A] truncate">
              {state.title || (lang === 'hi' ? 'हस्तनिर्मित उत्पाद' : 'Handcrafted Item')}
            </p>
          </div>
        </div>

        {/* Structured Product Information Cards */}
        <div className="space-y-3">
          {/* 1. Title */}
          <div className="p-4 bg-white rounded-2xl border border-[#E0D8CE] shadow-2xs flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B5E59] block">
                {t.sellProduct.catalog.productTitle}
              </span>
              <p className="text-base font-black text-[#261D1A] truncate">
                {state.title || (lang === 'hi' ? 'हस्तनिर्मित उत्पाद' : 'Handcrafted Item')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => openEditModal(t.sellProduct.catalog.productTitle, 'title', state.title)}
              className="p-2 rounded-xl text-[#C04B27] hover:bg-[#C04B27]/10 flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer flex-shrink-0"
            >
              <Edit3 className="w-4 h-4" />
              <span>{t.sellProduct.catalog.edit}</span>
            </button>
          </div>

          {/* 2. Category & Material in Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-white rounded-2xl border border-[#E0D8CE] shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B5E59] block">
                  {t.sellProduct.catalog.category}
                </span>
                <p className="text-xs font-bold text-[#261D1A] mt-0.5 line-clamp-2">
                  {state.category || (lang === 'hi' ? 'हस्तशिल्प' : 'Handicrafts')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => openEditModal(t.sellProduct.catalog.category, 'category', state.category)}
                className="mt-2 text-[11px] font-bold text-[#C04B27] hover:underline text-left flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                {t.sellProduct.catalog.edit}
              </button>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-[#E0D8CE] shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B5E59] block">
                  {t.sellProduct.catalog.material}
                </span>
                <p className="text-xs font-bold text-[#261D1A] mt-0.5 line-clamp-2">
                  {state.material || (lang === 'hi' ? 'प्राकृतिक सामग्री' : 'Natural Material')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => openEditModal(t.sellProduct.catalog.material, 'material', state.material)}
                className="mt-2 text-[11px] font-bold text-[#C04B27] hover:underline text-left flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                {t.sellProduct.catalog.edit}
              </button>
            </div>
          </div>

          {/* 3. Craft Type */}
          <div className="p-3.5 bg-white rounded-2xl border border-[#E0D8CE] shadow-2xs flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B5E59] block">
                {t.sellProduct.catalog.craftType}
              </span>
              <p className="text-xs font-bold text-[#261D1A] mt-0.5 truncate">
                {state.craftType || (lang === 'hi' ? 'हस्तनिर्मित शिल्प' : 'Handcrafted')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => openEditModal(t.sellProduct.catalog.craftType, 'craftType', state.craftType)}
              className="p-1.5 rounded-xl text-[#C04B27] hover:bg-[#C04B27]/10 flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer flex-shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t.sellProduct.catalog.edit}</span>
            </button>
          </div>

          {/* 4. Multilingual Description with Tabs */}
          <div className="bg-white rounded-2xl border border-[#E0D8CE] shadow-2xs p-4 space-y-3">
            <div className="flex items-center justify-between">
              {/* Language Switch Tabs */}
              <div className="flex bg-[#EFE9DF] p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setDescLangTab('hi')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    descLangTab === 'hi'
                      ? 'bg-[#1B4D3E] text-white shadow-xs'
                      : 'text-[#6B5E59] hover:text-[#261D1A]'
                  }`}
                >
                  हिन्दी विवरण
                </button>
                <button
                  type="button"
                  onClick={() => setDescLangTab('en')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    descLangTab === 'en'
                      ? 'bg-[#1B4D3E] text-white shadow-xs'
                      : 'text-[#6B5E59] hover:text-[#261D1A]'
                  }`}
                >
                  English Description
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  openEditModal(
                    descLangTab === 'hi' ? t.sellProduct.catalog.descHindi : t.sellProduct.catalog.descEnglish,
                    descLangTab === 'hi' ? 'descriptionHindi' : 'descriptionEnglish',
                    descLangTab === 'hi' ? state.descriptionHindi : state.descriptionEnglish,
                    true
                  )
                }
                className="text-xs font-bold text-[#C04B27] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                {t.sellProduct.catalog.edit}
              </button>
            </div>

            <p className="text-xs text-[#261D1A] font-medium leading-relaxed bg-[#FAF6F0] p-3 rounded-xl border border-[#EAE2D5]">
              {descLangTab === 'hi'
                ? state.descriptionHindi || 'शिल्पकार द्वारा पूरे समर्पण और कौशल के साथ तैयार किया गया उत्पाद।'
                : state.descriptionEnglish || 'Thoughtfully handcrafted artisan item made with authentic skill and quality materials.'}
            </p>
          </div>

          {/* 5. Keywords / Tags */}
          {state.keywords && state.keywords.length > 0 && (
            <div className="p-3 bg-white rounded-2xl border border-[#E0D8CE] shadow-2xs space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B5E59] block">
                {t.sellProduct.catalog.keywords}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {state.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#FAF6F0] text-[#1B4D3E] text-[11px] font-bold border border-[#E0D8CE]"
                  >
                    <Tag className="w-2.5 h-2.5 text-[#C04B27]" />
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dominant Next Action: "दाम तय करें" */}
        <div className="pt-2">
          <PrimaryButton onClick={handleNext} disabled={isCalculatingPrice}>
            <span className="flex items-center justify-center gap-2">
              {isCalculatingPrice ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  {t.sellProduct.pricing.calculating}
                </>
              ) : (
                <>
                  <span>{t.sellProduct.catalog.nextPricing}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </span>
          </PrimaryButton>
        </div>
      </main>

      {/* Reusable Edit Modal */}
      <EditFieldModal
        isOpen={modalConfig.isOpen}
        fieldTitle={modalConfig.title}
        fieldKey={modalConfig.key}
        initialValue={modalConfig.val}
        isTextArea={modalConfig.isTextArea}
        onSave={handleSaveModal}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
