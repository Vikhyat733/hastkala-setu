import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import { playSoundEffect } from '../../../services/voiceAssistant';
import { useMarketplace } from '../../../context/MarketplaceContext';

interface AIProcessingScreenProps {
  onBack: () => void;
  onComplete: () => void;
}

export const AIProcessingScreen: React.FC<AIProcessingScreenProps> = ({
  onBack,
  onComplete
}) => {
  const { t } = useMarketplace();
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, title: t('enhancingPhoto') },
    { id: 2, title: t('recognizingCraft') },
    { id: 3, title: t('writingDescription') },
    { id: 4, title: t('calculatingPrice') }
  ];

  useEffect(() => {
    // Step 1
    playSoundEffect('tick');
    const t1 = setTimeout(() => {
      setCurrentStep(2);
      playSoundEffect('tick');
    }, 1000);

    // Step 2
    const t2 = setTimeout(() => {
      setCurrentStep(3);
      playSoundEffect('tick');
    }, 2000);

    // Step 3
    const t3 = setTimeout(() => {
      setCurrentStep(4);
      playSoundEffect('tick');
    }, 3000);

    // Step 4 Complete
    const t4 = setTimeout(() => {
      setCurrentStep(5);
      playSoundEffect('success_bell');
      onComplete();
    }, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div className="min-h-full flex flex-col justify-between bg-[#FAF6ED] text-[#2C241E] select-none p-5 max-w-xl mx-auto w-full">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => {
            playSoundEffect('tap');
            onBack();
          }}
          className="p-2.5 rounded-2xl bg-white border border-[#E5DAC8] text-[#3B3026] shadow-sm hover:bg-[#F4EDE0]"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        <h1 className="text-lg font-black text-[#1E3A1E] font-sans">
          {t('aiWorking')}
        </h1>

        <div className="w-10"></div>
      </div>

      {/* Center Animated Robot Mascot */}
      <div className="my-auto py-6 flex flex-col items-center">
        
        {/* AI Bot Mascot Illustration */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-[#3A6B35]/20 blur-xl animate-pulse"></div>
          
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-b from-[#EAF4E6] to-[#D5EAD0] border-3 border-[#A5CD84] flex flex-col items-center justify-center shadow-lg animate-float">
            <div className="w-16 h-12 rounded-2xl bg-[#1E3A1E] border-2 border-[#8AC172] flex items-center justify-around px-2 shadow-inner">
              <div className="w-3 h-3 rounded-full bg-[#52D34E] shadow-[0_0_8px_#52D34E] animate-pulse"></div>
              <div className="w-3 h-3 rounded-full bg-[#52D34E] shadow-[0_0_8px_#52D34E] animate-pulse"></div>
            </div>
            
            <div className="absolute -top-3 w-1.5 h-3.5 bg-[#8AC172] rounded-t-full flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-[#E67E22] -mt-3 shadow-md animate-bounce-short"></div>
            </div>

            <div className="mt-2 flex items-center gap-1 text-[11px] font-black text-[#2C5528]">
              <Sparkles className="w-3.5 h-3.5 text-[#E67E22]" />
              <span>{t('hastakalaAI')}</span>
            </div>
          </div>
        </div>

        {/* 4-Step Animated Checklist */}
        <div className="w-full max-w-sm space-y-3.5 bg-white p-5 rounded-3xl border border-[#E5DAC8] shadow-sm">
          {steps.map((step) => {
            const isDone = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 transition-all duration-300 ${
                  isDone || isCurrent ? 'opacity-100 scale-100' : 'opacity-40 scale-98'
                }`}
              >
                {/* Circle Status Icon */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    isDone
                      ? 'bg-[#3A6B35] text-white shadow-sm'
                      : isCurrent
                      ? 'bg-[#EAF4E6] border-2 border-[#3A6B35] text-[#3A6B35] animate-pulse'
                      : 'bg-[#F0EBE1] text-[#A09384]'
                  }`}
                >
                  {isDone ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : isCurrent ? (
                    <div className="w-2 h-2 rounded-full bg-[#3A6B35]"></div>
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#A09384]"></div>
                  )}
                </div>

                {/* Step Text */}
                <div className="flex-1">
                  <p className={`text-sm font-extrabold leading-tight ${
                    isDone || isCurrent ? 'text-[#1E3A1E]' : 'text-[#8C7D6F]'
                  }`}>
                    {step.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Bottom Status Text */}
      <div className="text-center py-2">
        <p className="text-sm font-black text-[#5A4838] animate-pulse">
          {t('justAMoment')}
        </p>
        <p className="text-xs font-semibold text-[#8A7B6E] mt-0.5">
          {t('aiReadingPhoto')}
        </p>
      </div>

    </div>
  );
};
