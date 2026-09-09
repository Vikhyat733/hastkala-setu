import React, { useState } from 'react';
import { useMela } from '../../context/MelaContext';
import { AppHeader } from '../../core/design-system/AppHeader';
import { LanguageCard } from '../../core/design-system/LanguageCard';
import { PrimaryButton } from '../../core/design-system/PrimaryButton';
import { Language } from '../../translations';
import { speakText } from '../../services/voiceAssistant';

export const LanguageScreen: React.FC = () => {
  const { selectedLanguage, setLanguage, navigate, t, goBack } = useMela();
  const [audioFeedback, setAudioFeedback] = useState<string | null>(null);

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    const feedbackMap: Record<Language, string> = {
      hi: 'हिन्दी चुनी गई है',
      en: 'English selected',
      mr: 'मराठी निवडली आहे',
      bn: 'বাংলা নির্বাচন করা হয়েছে',
    };
    const feedback = feedbackMap[lang];
    setAudioFeedback(feedback);
    const langLocaleMap: Record<Language, string> = {
      hi: 'hi-IN',
      en: 'en-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
    };
    speakText(feedback, langLocaleMap[lang]);
    setTimeout(() => setAudioFeedback(null), 2500);
  };

  const handleSpeaker = (name: string, nativeName: string, locale: string) => {
    speakText(nativeName, locale);
    setAudioFeedback(`${nativeName} - ${name}`);
    setTimeout(() => setAudioFeedback(null), 2000);
  };

  const handleContinue = () => {
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-between">
      <AppHeader
        title={t.common.appName}
        subtitle="SIH26090"
        showBack={true}
        onBack={goBack}
      />

      <main className="flex-1 max-w-md w-full mx-auto p-5 md:p-6 flex flex-col justify-between">
        {/* Screen Title & Prompt */}
        <div className="pt-2 pb-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#C04B27]/10 text-[#C04B27] mx-auto flex items-center justify-center text-2xl mb-3 shadow-2xs">
            🗣️
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-[#1B4D3E] tracking-tight leading-snug">
            {t.language.title}
          </h2>
          <p className="text-sm font-medium text-[#6B5E59] mt-1.5">
            {t.language.subtitle}
          </p>

          {/* Accessible Audio Feedback Announcement */}
          {audioFeedback && (
            <div
              role="status"
              className="mt-3 py-1.5 px-3 bg-[#1B4D3E] text-white text-xs font-bold rounded-full inline-flex items-center gap-1.5 animate-in fade-in"
            >
              <span>🔊</span>
              <span>{audioFeedback}</span>
            </div>
          )}
        </div>

        {/* 4 Fully Supported Language Cards */}
        <div className="flex flex-col gap-3.5 mb-8">
          {/* Hindi */}
          <LanguageCard
            name="Hindi"
            nativeName="हिन्दी"
            isSelected={selectedLanguage === 'hi'}
            onSelect={() => handleSelectLanguage('hi')}
            onSpeakerClick={() => handleSpeaker('Hindi', 'हिन्दी', 'hi-IN')}
          />

          {/* English */}
          <LanguageCard
            name="English"
            nativeName="English"
            isSelected={selectedLanguage === 'en'}
            onSelect={() => handleSelectLanguage('en')}
            onSpeakerClick={() => handleSpeaker('English', 'English', 'en-IN')}
          />

          {/* Marathi (Fully Supported) */}
          <LanguageCard
            name="Marathi"
            nativeName="मराठी"
            isSelected={selectedLanguage === 'mr'}
            onSelect={() => handleSelectLanguage('mr')}
            onSpeakerClick={() => handleSpeaker('Marathi', 'मराठी', 'mr-IN')}
          />

          {/* Bengali (Fully Supported) */}
          <LanguageCard
            name="Bengali"
            nativeName="বাংলা"
            isSelected={selectedLanguage === 'bn'}
            onSelect={() => handleSelectLanguage('bn')}
            onSpeakerClick={() => handleSpeaker('Bengali', 'বাংলা', 'bn-IN')}
          />
        </div>

        {/* Primary Action Button */}
        <div className="pt-4 pb-2">
          <PrimaryButton onClick={handleContinue}>
            {t.language.continueBtn}
          </PrimaryButton>
        </div>
      </main>
    </div>
  );
};
