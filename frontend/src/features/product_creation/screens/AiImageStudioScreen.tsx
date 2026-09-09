import React from 'react';
import { RotateCcw, Check, Info } from 'lucide-react';
import { useProductCreation } from '../context/ProductCreationContext';
import { useMela } from '../../../context/MelaContext';
import { AppHeader } from '../../../core/design-system/AppHeader';
import { PrimaryButton } from '../../../core/design-system/PrimaryButton';
import { BeforeAfterCompare } from '../components/BeforeAfterCompare';

export const AiImageStudioScreen: React.FC = () => {
  const {
    state,
    setStep,
    retakeImage,
    enhancementOperations,
    enhancementIsDevFallback,
  } = useProductCreation();

  const { t, selectedLanguage } = useMela();
  const lang = selectedLanguage as 'hi' | 'en';

  const handleAccept = () => {
    setStep('voice');
  };

  // Check whether actual enhancement happened (before ≠ after)
  const wasActuallyEnhanced: boolean =
    !!(state.enhancedImage &&
    state.image &&
    state.enhancedImage !== state.image &&
    !enhancementOperations.some(op => op.includes('unchanged') || op.includes('unavailable')));

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col">
      <AppHeader
        title={lang === 'hi' ? 'फोटो तैयार हुई' : 'Photo Ready'}
        subtitle={lang === 'hi' ? 'फोटो सुधार' : 'Photo Enhancement'}
        onBack={retakeImage}
        showLanguageToggle={false}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 space-y-6 pb-20 md:pb-6">
        
        <div className="md:grid md:grid-cols-2 md:gap-8 md:items-center">
          {/* LEFT COLUMN: Before / After Comparison */}
          <div className="w-full">
            <BeforeAfterCompare
              originalImage={state.image}
              enhancedImage={state.enhancedImage || state.image}
              beforeLabel={lang === 'hi' ? 'मूल फोटो (Before)' : 'Original (Before)'}
              afterLabel={lang === 'hi' ? 'सुधरी फोटो (After)' : 'Enhanced (After)'}
              operations={enhancementOperations}
              isDevFallback={enhancementIsDevFallback}
              wasEnhanced={wasActuallyEnhanced}
            />
          </div>

          {/* RIGHT COLUMN: Title & Actions */}
          <div className="mt-8 md:mt-0 space-y-6 flex flex-col justify-center">
            {/* Title Header */}
            <div className="text-center md:text-left space-y-1.5">
              {wasActuallyEnhanced ? (
                <>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                    <Sparkles className="w-3.5 h-3.5" />
                    {lang === 'hi' ? 'MELA AI Studio द्वारा सुधारा गया' : 'Enhanced by MELA AI Studio'}
                  </div>
                  <h2 className="text-xl md:text-3xl font-black text-[#261D1A]">
                    {lang === 'hi' ? 'आपकी फोटो तैयार है' : 'Your Photo is Ready'}
                  </h2>
                  <p className="text-xs md:text-sm text-[#6B5E59]">
                    {lang === 'hi'
                      ? 'नीचे Before और After की तुलना करें'
                      : 'Compare Before and After below'}
                  </p>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black">
                    <Info className="w-3.5 h-3.5" />
                    {lang === 'hi' ? 'मूल फोटो' : 'Original Photo'}
                  </div>
                  <h2 className="text-xl md:text-3xl font-black text-[#261D1A]">
                    {lang === 'hi' ? 'आपकी फोटो' : 'Your Photo'}
                  </h2>
                  <p className="text-xs md:text-sm text-[#6B5E59]">
                    {lang === 'hi'
                      ? 'फोटो सुधार उपलब्ध नहीं था — मूल फोटो का उपयोग किया जाएगा'
                      : 'Enhancement unavailable — original photo will be used'}
                  </p>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2 w-full max-w-sm mx-auto md:mx-0">
              <PrimaryButton onClick={handleAccept} className="py-4">
                <span className="flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" />
                  {lang === 'hi' ? 'अच्छा है, आगे बढ़ें' : 'Good, Continue'}
                </span>
              </PrimaryButton>

              <button
                type="button"
                onClick={retakeImage}
                className="w-full py-3.5 px-4 rounded-2xl border-2 border-[#E0D8CE] bg-white text-[#6B5E59] hover:text-[#261D1A] font-bold text-xs flex items-center justify-center gap-2 shadow-xs hover:bg-stone-50 active:scale-98 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                {lang === 'hi' ? 'दोबारा फोटो लें' : 'Retake Photo'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
