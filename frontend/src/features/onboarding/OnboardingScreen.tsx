import React, { useState } from 'react';
import { Camera, Mic, Store } from 'lucide-react';
import { useMela } from '../../context/MelaContext';
import { AppHeader } from '../../core/design-system/AppHeader';
import { PrimaryButton } from '../../core/design-system/PrimaryButton';

export const OnboardingScreen: React.FC = () => {
  const { navigate, t, completeOnboarding, goBack } = useMela();
  const [currentStep, setCurrentStep] = useState<number>(0);

  const steps = [
    {
      icon: <Camera className="w-16 h-16 text-[#C04B27]" />,
      badge: 'Step 1',
      title: t.onboarding.step1.title,
      description: t.onboarding.step1.description,
      illustrationEmoji: '📸',
    },
    {
      icon: <Mic className="w-16 h-16 text-[#1B4D3E]" />,
      badge: 'Step 2',
      title: t.onboarding.step2.title,
      description: t.onboarding.step2.description,
      illustrationEmoji: '🎙️',
    },
    {
      icon: <Store className="w-16 h-16 text-[#F2A33A]" />,
      badge: 'Step 3',
      title: t.onboarding.step3.title,
      description: t.onboarding.step3.description,
      illustrationEmoji: '🛍️',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
      navigate('/login');
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    navigate('/login');
  };

  const step = steps[currentStep];

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-between">
      <AppHeader
        title={t.common.appName}
        subtitle="SIH26090"
        showBack={true}
        onBack={() => {
          if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
          } else {
            goBack();
          }
        }}
        rightAction={
          <button
            onClick={handleSkip}
            className="px-3 py-1.5 text-sm font-bold text-[#6B5E59] hover:text-[#C04B27] rounded-xl transition-colors"
          >
            {t.common.skip}
          </button>
        }
      />

      <main className="flex-1 max-w-md w-full mx-auto p-6 flex flex-col items-center justify-between text-center">
        {/* Step Progress Dots */}
        <div className="flex items-center gap-2 pt-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              aria-label={`Go to step ${index + 1}`}
              className={`
                h-2.5 rounded-full transition-all duration-300
                ${currentStep === index ? 'w-8 bg-[#1B4D3E]' : 'w-2.5 bg-[#D5CABE]'}
              `}
            />
          ))}
        </div>

        {/* Visual Card / Illustration */}
        <div className="w-full my-auto py-6">
          <div className="w-40 h-40 md:w-44 md:h-44 mx-auto mb-6 rounded-3xl bg-white shadow-xl shadow-[#1B4D3E]/10 border-2 border-[#E0D8CE] flex flex-col items-center justify-center relative">
            <div className="text-4xl mb-1">{step.illustrationEmoji}</div>
            {step.icon}
            <span className="absolute -top-3 bg-[#C04B27] text-white text-[11px] font-black uppercase px-3 py-0.5 rounded-full shadow-sm">
              {step.badge}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-[#1B4D3E] tracking-tight mb-3">
            {step.title}
          </h2>

          <p className="text-base text-[#6B5E59] font-medium max-w-xs mx-auto leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="w-full pb-4 flex flex-col gap-3">
          <PrimaryButton onClick={handleNext}>
            {currentStep === steps.length - 1 ? t.common.start : t.common.next}
          </PrimaryButton>

          {currentStep < steps.length - 1 && (
            <button
              onClick={handleSkip}
              className="py-2.5 text-sm font-bold text-[#6B5E59] hover:text-[#261D1A] transition-colors"
            >
              {t.common.skip}
            </button>
          )}
        </div>
      </main>
    </div>
  );
};
