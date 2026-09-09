import React, { useState, useEffect } from 'react';
import { Sparkles, Check, Edit2, ArrowLeft, ArrowRight, CheckCircle2, Calculator, RefreshCw } from 'lucide-react';
import { useProductCreation } from '../context/ProductCreationContext';
import { useMela } from '../../../context/MelaContext';
import { AppHeader } from '../../../core/design-system/AppHeader';
import { PrimaryButton } from '../../../core/design-system/PrimaryButton';
import { PricingBreakdownCard } from '../components/PricingBreakdownCard';
import { pricingService } from '../../../services/ai/pricingService';

export const PricingAssistantScreen: React.FC = () => {
  const {
    state,
    updateState,
    setStep,
    pricingExplanationHindi,
    pricingExplanationEnglish,
  } = useProductCreation();

  const { t, selectedLanguage } = useMela();
  const lang = selectedLanguage as 'hi' | 'en';

  const [isEditingPrice, setIsEditingPrice] = useState<boolean>(false);
  const [showCostAdjuster, setShowCostAdjuster] = useState<boolean>(false);
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);

  // Form states
  const activePrice = state.finalPrice > 0 ? state.finalPrice : state.suggestedPrice;
  const [customPriceInput, setCustomPriceInput] = useState<string>(
    activePrice > 0 ? activePrice.toString() : ''
  );

  const [inputMaterialCost, setInputMaterialCost] = useState<string>(
    state.estimatedMaterialCost > 0 ? state.estimatedMaterialCost.toString() : ''
  );
  const [inputMakingCost, setInputMakingCost] = useState<string>(
    state.estimatedMakingCost > 0 ? state.estimatedMakingCost.toString() : ''
  );

  // Keep customPriceInput synced if suggested price changes and user hasn't typed custom price
  useEffect(() => {
    if (!isEditingPrice && activePrice > 0) {
      setCustomPriceInput(activePrice.toString());
    }
  }, [activePrice, isEditingPrice]);

  const handleKeepSuggestedPrice = () => {
    const finalToSave = state.finalPrice > 0 ? state.finalPrice : state.suggestedPrice;
    updateState({ finalPrice: finalToSave });
    setStep('preview');
  };

  const handleSaveCustomPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(customPriceInput);
    if (!isNaN(parsed) && parsed > 0) {
      const updatedManual = {
        ...(state.manuallyEditedFields || {}),
        finalPrice: true,
      };
      updateState({ finalPrice: parsed, manuallyEditedFields: updatedManual });
      setIsEditingPrice(false);
    }
  };

  const handleApplyCostAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    const matVal = parseFloat(inputMaterialCost) || 0;
    const makeVal = parseFloat(inputMakingCost) || 0;

    setIsRecalculating(true);
    try {
      const result = await pricingService.getSuggestedPrice({
        title: state.title,
        category: state.category,
        material: state.material,
        craftType: state.craftType,
        description: lang === 'en' ? state.descriptionEnglish : state.descriptionHindi,
        rawMaterialCost: matVal,
        makingCost: makeVal,
      });

      if (result.success) {
        updateState({
          suggestedPrice: result.suggestedPrice,
          finalPrice: result.suggestedPrice,
          estimatedMaterialCost: result.estimatedMaterialCost,
          estimatedMakingCost: result.estimatedMakingCost,
        });
        setCustomPriceInput(result.suggestedPrice.toString());
      }
    } catch (err) {
      console.warn('Cost recalculation failed:', err);
    } finally {
      setIsRecalculating(false);
      setShowCostAdjuster(false);
    }
  };

  const currentPrice = state.finalPrice > 0 ? state.finalPrice : state.suggestedPrice;
  const currentProfit = Math.max(
    0,
    currentPrice - (state.estimatedMaterialCost + state.estimatedMakingCost)
  );

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-between">
      {/* App Header */}
      <AppHeader
        title={lang === 'hi' ? 'मेला की कीमत की सलाह' : 'MELA Price Suggestion'}
        subtitle={lang === 'hi' ? 'उत्पाद अनुसार उचित मूल्य' : 'Product-Specific Pricing'}
        onBack={() => setStep('catalog')}
        showLanguageToggle={false}
      />

      <main className="flex-1 max-w-md w-full mx-auto p-4 md:p-6 flex flex-col justify-between space-y-4 pb-8">
        {/* Title */}
        <div className="text-center space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-[#261D1A]">
            {lang === 'hi' ? 'मेला की कीमत की सलाह' : 'MELA Price Suggestion'}
          </h2>
          <p className="text-xs text-[#6B5E59] font-medium">
            {lang === 'hi'
              ? 'सामग्री और कारीगरी की लागत पर आधारित पारदर्शी दाम'
              : 'Transparent price recommendation based on your craft materials and making costs'}
          </p>
        </div>

        {/* Cost & Profit Breakdown Card */}
        <PricingBreakdownCard
          suggestedPrice={state.suggestedPrice}
          finalPrice={state.finalPrice}
          isCustomPrice={state.finalPrice > 0 && state.finalPrice !== state.suggestedPrice}
          materialCost={state.estimatedMaterialCost}
          makingCost={state.estimatedMakingCost}
          estimatedProfit={currentProfit}
          language={lang}
          explanation={
            lang === 'hi'
              ? pricingExplanationHindi
              : pricingExplanationEnglish
          }
        />

        {/* Optional Simple Cost Input Accordion */}
        <div className="bg-white rounded-2xl border border-[#E0D8CE] shadow-2xs overflow-hidden">
          <button
            type="button"
            onClick={() => setShowCostAdjuster(!showCostAdjuster)}
            className="w-full p-3.5 flex items-center justify-between text-left text-xs font-bold text-[#261D1A] hover:bg-stone-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#C04B27]" />
              <span>
                {lang === 'hi'
                  ? 'सामान बनाने में लगभग कितना खर्च आया?'
                  : 'Approximately how much did it cost to make?'}
              </span>
            </span>
            <span className="text-[11px] text-[#C04B27] underline font-bold">
              {showCostAdjuster ? (lang === 'hi' ? 'बंद करें' : 'Close') : (lang === 'hi' ? 'खर्च दर्ज करें' : 'Enter Costs')}
            </span>
          </button>

          {showCostAdjuster && (
            <form onSubmit={handleApplyCostAdjustment} className="p-4 pt-1 space-y-3 border-t border-[#F0EBE1] bg-[#FAF6F0]/60 animate-in fade-in">
              <p className="text-[11px] text-[#6B5E59] font-medium">
                {lang === 'hi'
                  ? 'सामग्री और मेहनत का खर्च भरें। मेला नया दाम खुद जोड़ लेगा।'
                  : 'Enter your raw material and labor costs. MELA will recalculate a fair selling price.'}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B5E59] mb-1">
                    {lang === 'hi' ? 'सामग्री खर्च (₹)' : 'Material Cost (₹)'}
                  </label>
                  <input
                    type="number"
                    value={inputMaterialCost}
                    onChange={(e) => setInputMaterialCost(e.target.value)}
                    placeholder="150"
                    min="0"
                    step="10"
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#E0D8CE] font-bold text-sm text-[#261D1A] focus:outline-hidden focus:border-[#C04B27]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B5E59] mb-1">
                    {lang === 'hi' ? 'कारीगरी खर्च (₹)' : 'Making / Labor (₹)'}
                  </label>
                  <input
                    type="number"
                    value={inputMakingCost}
                    onChange={(e) => setInputMakingCost(e.target.value)}
                    placeholder="200"
                    min="0"
                    step="10"
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#E0D8CE] font-bold text-sm text-[#261D1A] focus:outline-hidden focus:border-[#C04B27]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isRecalculating}
                className="w-full py-2.5 rounded-xl bg-[#1B4D3E] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs hover:bg-[#143d31]"
              >
                {isRecalculating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{lang === 'hi' ? 'गणना हो रही है...' : 'Calculating...'}</span>
                  </>
                ) : (
                  <>
                    <Calculator className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'नया दाम तय करें' : 'Recalculate Price'}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Custom Price Editor Modal / Form */}
        {isEditingPrice ? (
          <form
            onSubmit={handleSaveCustomPrice}
            className="p-4 bg-white rounded-3xl border-2 border-[#C04B27] shadow-lg space-y-3 animate-in fade-in"
          >
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5E59]">
              {lang === 'hi' ? 'अपनी मनपसंद अंतिम कीमत लिखें' : 'Enter your preferred final selling price'}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-[#261D1A]">
                ₹
              </span>
              <input
                type="number"
                value={customPriceInput}
                onChange={(e) => setCustomPriceInput(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-2xl bg-[#FAF6F0] border border-[#E0D8CE] text-xl font-black text-[#261D1A] focus:outline-hidden focus:border-[#C04B27]"
                min="10"
                step="10"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditingPrice(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#E0D8CE] font-bold text-xs text-[#6B5E59]"
              >
                {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#1B4D3E] text-white font-bold text-xs shadow-xs hover:bg-[#143d31]"
              >
                {lang === 'hi' ? 'कीमत सहेजें' : 'Save Price'}
              </button>
            </div>
          </form>
        ) : null}

        {/* Buttons: Dominant "यह कीमत रखें" + Secondary "कीमत बदलना चाहता हूँ" */}
        <div className="space-y-3 pt-2">
          {/* Dominant Primary Action */}
          <PrimaryButton onClick={handleKeepSuggestedPrice} disabled={currentPrice <= 0}>
            <span className="flex items-center justify-center gap-2">
              <Check className="w-5 h-5" />
              {lang === 'hi' ? `यह कीमत रखें (₹${currentPrice})` : `Keep This Price (₹${currentPrice})`}
            </span>
          </PrimaryButton>

          {/* Secondary Action: Change Price */}
          {!isEditingPrice && (
            <button
              type="button"
              onClick={() => setIsEditingPrice(true)}
              className="w-full py-3.5 px-4 rounded-2xl border-2 border-[#E0D8CE] bg-white text-[#6B5E59] hover:text-[#261D1A] font-bold text-xs flex items-center justify-center gap-2 shadow-2xs hover:bg-stone-50 active:scale-98 transition-all cursor-pointer"
            >
              <Edit2 className="w-4 h-4 text-[#C04B27]" />
              {lang === 'hi' ? 'कीमत बदलना चाहता हूँ' : 'Change / Customize Price'}
            </button>
          )}
        </div>
      </main>
    </div>
  );
};
