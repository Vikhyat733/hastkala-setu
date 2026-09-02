import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Volume2, VolumeX, Sparkles, Tag, ShieldCheck } from 'lucide-react';
import { speakText, stopSpeaking, isSpeaking, playSoundEffect } from '../../../services/voiceAssistant';

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
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleToggleVoice = () => {
    playSoundEffect('tap');
    if (isPlayingAudio || isSpeaking()) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const textToRead = audioText || `${name}। श्रेणी ${category}। ${description}। अनुशंसित कीमत ${priceRange} है।`;
      speakText(textToRead, 'hi-IN', () => {
        setIsPlayingAudio(false);
      });
    }
  };

  return (
    <div className="min-h-full flex flex-col justify-between bg-[#FAF6ED] text-[#2C241E] select-none">
      
      {/* Top Header */}
      <div className="p-4 sm:p-5 flex items-center justify-between">
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

        <div className="flex items-center gap-1.5">
          <Sparkles className="w-5 h-5 text-[#E67E22]" />
          <h1 className="text-lg font-black text-[#1E3A1E] font-sans">
            AI ने तैयार किया
          </h1>
        </div>

        <button
          onClick={handleToggleVoice}
          className={`p-2.5 rounded-2xl border shadow-sm flex items-center gap-1 transition-colors ${
            isPlayingAudio
              ? 'bg-[#D95D39] text-white border-[#B54424] animate-pulse'
              : 'bg-[#E8F0E3] text-[#3A6B35] border-[#3A6B35]/30 hover:bg-[#DCEAD5]'
          }`}
          title="आवाज़ सुनें"
        >
          {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span className="text-xs font-bold hidden xs:inline">
            {isPlayingAudio ? 'रोकें' : 'सुनें'}
          </span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="px-4 sm:px-5 space-y-4">
        
        {/* Craft Photo Card */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-[#E5DAC8] bg-white shadow-md">
          <img
            src={image}
            alt={name}
            className="w-full h-48 sm:h-56 object-cover"
          />
          {/* AI Verified Badge */}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#3A6B35]/30 text-[#2C5528] text-xs font-black flex items-center gap-1 shadow">
            <ShieldCheck className="w-3.5 h-3.5 text-[#3A6B35]" />
            <span>AI द्वारा जाँचा गया</span>
          </div>
        </div>

        {/* Product Details Card */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E5DAC8] shadow-sm space-y-3">
          
          {/* Title & Audio Play Button */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1E3A1E] leading-tight">
                {name}
              </h2>
              <p className="text-xs font-bold text-[#7D6E5D] mt-0.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-[#3A6B35]" />
                <span>श्रेणी: {category}</span>
              </p>
            </div>

            <button
              onClick={handleToggleVoice}
              className="p-2 rounded-xl bg-[#FAF0DD] text-[#935213] hover:bg-[#F3E2C4] transition-colors flex-shrink-0"
              title="विवरण सुनें"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Simple Rural-Friendly Hindi Description */}
          <div className="p-3 rounded-2xl bg-[#F9F6F0] border border-[#EAE1D2]">
            <p className="text-xs sm:text-sm font-semibold text-[#4A3E31] leading-relaxed">
              {description}
            </p>
          </div>

          {/* Estimated Price Range Box */}
          <div className="p-3.5 rounded-2xl bg-[#EAF4E6] border border-[#A5CD84] flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-[#3D6632]">
                कीमत (अनुमान):
              </p>
              <p className="text-lg sm:text-xl font-black text-[#1E3A1E]">
                {priceRange}
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white/80 text-[#2C5528] border border-[#A5CD84]/50">
              उचित बाज़ार मूल्य
            </span>
          </div>

        </div>

      </div>

      {/* Bottom Proceed Action Button */}
      <div className="p-4 sm:p-5 bg-white/90 backdrop-blur-sm border-t border-[#E5DAC8]">
        <button
          onClick={() => {
            playSoundEffect('tap');
            stopSpeaking();
            onProceed();
          }}
          className="w-full py-4 px-6 rounded-2xl bg-[#3A6B35] hover:bg-[#2F582B] active:scale-[0.98] text-white font-extrabold text-lg flex items-center justify-center gap-3 shadow-lg shadow-[#3A6B35]/30 transition-all"
        >
          <span>आगे बढ़ें</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

    </div>
  );
};
