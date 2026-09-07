import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Volume2, VolumeX, Sparkles, Tag, ShieldCheck } from 'lucide-react';
import { speakText, stopSpeaking, isSpeaking, playSoundEffect } from '../../../services/voiceAssistant';
import { useMarketplace } from '../../../context/MarketplaceContext';

interface AIResultScreenProps {
  image: string;
  name: string;
  category: string;
  description: string;
  priceRange: string;
  audioText: string;
  onBack: () => void;
  onProceed: () => void;
}

export const AIResultScreen: React.FC<AIResultScreenProps> = ({
  image,
  name,
  category,
  description,
  priceRange,
  audioText,
  onBack,
  onProceed
}) => {
  const { t, activeLanguage } = useMarketplace();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleToggleVoice = () => {
    playSoundEffect('tap');
    if (isPlayingAudio || isSpeaking()) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const textToRead = audioText || (
        activeLanguage === 'en'
          ? `${name}. Category ${category}. ${description}. Recommended fair price is ${priceRange}.`
          : `${name}। श्रेणी ${category}। ${description}। अनुशंसित कीमत ${priceRange} है।`
      );
      speakText(textToRead, activeLanguage === 'en' ? 'en-IN' : 'hi-IN', () => {
        setIsPlayingAudio(false);
      });
    }
  };

  return (
    <div className="min-h-full flex flex-col justify-between bg-[#FAF6ED] text-[#2C241E] select-none w-full">
      
      {/* Top Header */}
      <div className="p-4 sm:p-6 flex items-center justify-between">
        <button
          onClick={() => {
            playSoundEffect('tap');
            stopSpeaking();
            onBack();
          }}
          className="p-2.5 rounded-2xl bg-white border border-[#E5DAC8] text-[#3B3026] shadow-sm hover:bg-[#F4EDE0]"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#E67E22]" />
          <h1 className="text-xl font-black text-[#1E3A1E] font-sans">
            {t('aiPrepared')}
          </h1>
        </div>

        <button
          onClick={handleToggleVoice}
          className={`p-2.5 rounded-2xl border shadow-sm flex items-center gap-1.5 transition-colors ${
            isPlayingAudio
              ? 'bg-[#D95D39] text-white border-[#B54424] animate-pulse'
              : 'bg-[#E8F0E3] text-[#3A6B35] border-[#3A6B35]/30 hover:bg-[#DCEAD5]'
          }`}
          title="Listen description"
        >
          {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span className="text-xs font-bold hidden xs:inline">
            {isPlayingAudio ? t('stop') : t('listen')}
          </span>
        </button>
      </div>

      {/* Main Content Area — Responsive 2-column on tablet/desktop */}
      <div className="px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          {/* Craft Photo Card */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-[#E5DAC8] bg-white shadow-md">
            <img
              src={image}
              alt={name}
              className="w-full h-64 sm:h-80 md:h-96 object-cover"
            />
            {/* AI Verified Badge */}
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#3A6B35]/30 text-[#2C5528] text-xs font-black flex items-center gap-1.5 shadow">
              <ShieldCheck className="w-4 h-4 text-[#3A6B35]" />
              <span>{t('verifiedByAI')}</span>
            </div>
          </div>

          {/* Product Details Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5DAC8] shadow-sm space-y-4">
            
            {/* Title & Audio Play Button */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#1E3A1E] leading-tight">
                  {name}
                </h2>
                <p className="text-xs sm:text-sm font-bold text-[#7D6E5D] mt-1 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-[#3A6B35]" />
                  <span>{t('categoryLabel')}: {category}</span>
                </p>
              </div>

              <button
                onClick={handleToggleVoice}
                className="p-2.5 rounded-xl bg-[#FAF0DD] text-[#935213] hover:bg-[#F3E2C4] transition-colors flex-shrink-0"
                title="Listen"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <div className="p-4 rounded-2xl bg-[#F9F6F0] border border-[#EAE1D2]">
              <p className="text-xs sm:text-sm font-semibold text-[#4A3E31] leading-relaxed">
                {description}
              </p>
            </div>

            {/* Estimated Price Range Box */}
            <div className="p-4 rounded-2xl bg-[#EAF4E6] border border-[#A5CD84] flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold text-[#3D6632]">
                  {t('priceEstimate')}
                </p>
                <p className="text-xl sm:text-2xl font-black text-[#1E3A1E] mt-0.5">
                  {priceRange}
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-lg bg-white/90 text-[#2C5528] border border-[#A5CD84]/50 shadow-xs">
                {t('fairMarketPrice')}
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* Bottom Proceed Action Button */}
      <div className="p-4 sm:p-6 bg-white/90 backdrop-blur-sm border-t border-[#E5DAC8] mt-6">
        <button
          onClick={() => {
            playSoundEffect('tap');
            stopSpeaking();
            onProceed();
          }}
          className="w-full max-w-xl mx-auto py-4 px-6 rounded-2xl bg-[#3A6B35] hover:bg-[#2F582B] active:scale-[0.98] text-white font-extrabold text-lg flex items-center justify-center gap-3 shadow-lg shadow-[#3A6B35]/30 transition-all"
        >
          <span>{t('proceed')}</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

    </div>
  );
};
