import React from 'react';
import { ArrowLeft, Sparkles, Volume2, Globe, Heart } from 'lucide-react';
import { speakText, playSoundEffect } from '../../../services/voiceAssistant';

interface PublishConfirmScreenProps {
  image: string;
  name: string;
  price: number;
  onBack: () => void;
  onPublish: () => void;
}

export const PublishConfirmScreen: React.FC<PublishConfirmScreenProps> = ({
  image,
  name,
  price,
  onBack,
  onPublish
}) => {
  const handleVoiceAdvice = () => {
    playSoundEffect('tap');
    speakText('बधाई हो! नीचे दिए गए हरे बटन पर टैप करके अपना सामान प्रकाशित करें। पूरे देश के ग्राहक आपका सामान देख और खरीद सकेंगे।');
  };

  return (
    <div className="min-h-full flex flex-col justify-between bg-[#FAF6ED] text-[#2C241E] select-none p-4 sm:p-5">
      
      {/* Top Header */}
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
          सामान प्रकाशित करें
        </h1>

        <button
          onClick={handleVoiceAdvice}
          className="p-2.5 rounded-2xl bg-[#E8F0E3] border border-[#3A6B35]/30 text-[#3A6B35] shadow-sm hover:bg-[#DCEAD5]"
          title="सुनें"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Center Traditional Namaste Artisan Illustration & Message */}
      <div className="my-auto py-2 flex flex-col items-center text-center">
        
        {/* Artisan Mascot Card */}
        <div className="relative mb-5">
          
          {/* Decorative Confetti & Sparkles */}
          <div className="absolute -top-3 -left-3 text-xl animate-bounce-short">✨</div>
          <div className="absolute -top-2 -right-2 text-xl animate-bounce-short">🎉</div>
          
          <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-b from-[#E6F0DC] via-[#D8ECCE] to-[#FAF0DD] border-4 border-[#3A6B35]/30 p-2 flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
            
            {/* Traditional Indian Artisan Woman Vector Character doing Namaste */}
            <div className="relative flex flex-col items-center">
              
              {/* Saree Pallu & Head */}
              <div className="relative w-20 h-20 rounded-full bg-[#FFE0B2] border-2 border-[#D7CCC8] overflow-hidden flex flex-col items-center justify-center shadow-inner">
                {/* Hair */}
                <div className="absolute top-0 w-full h-8 bg-[#2C241E] rounded-b-full"></div>
                {/* Traditional Bindi */}
                <div className="w-2 h-2 rounded-full bg-[#C0392B] -mt-1 z-10"></div>
                {/* Smiling Face */}
                <div className="flex gap-3 mt-1.5 z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3E2723]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3E2723]"></div>
                </div>
                {/* Warm smile curve */}
                <div className="w-4 h-2 border-b-2 border-[#D84315] rounded-full mt-1 z-10"></div>
              </div>

              {/* Saree & Folded Hands (Namaste) */}
              <div className="relative -mt-2 w-28 h-16 bg-[#2E7D32] rounded-t-3xl border border-[#1B5E20] flex items-center justify-center shadow-md">
                {/* Saree border */}
                <div className="absolute top-0 w-full h-2 bg-[#F39C12]"></div>
                {/* Folded Hands (Namaste) */}
                <div className="w-8 h-8 rounded-full bg-[#FFE0B2] border border-[#D7CCC8] flex items-center justify-center text-xs font-bold text-[#5D4037] shadow -mt-2">
                  🙏
                </div>
              </div>

              {/* Small Craft Basket in front */}
              <div className="absolute -bottom-1 right-2 w-10 h-10 rounded-xl bg-[#FAF0DD] border border-[#EAD0A8] flex items-center justify-center text-lg shadow">
                🧺
              </div>

            </div>

          </div>

          <div className="mt-1 flex items-center justify-center gap-1.5 text-xs font-black text-[#2C5528]">
            <Heart className="w-3.5 h-3.5 text-[#D95D39] fill-[#D95D39]" />
            <span>सीता देवी (कारीगर)</span>
          </div>
        </div>

        {/* Message Heading */}
        <h2 className="text-xl sm:text-2xl font-black text-[#1E3A1E] leading-tight">
          आपका सामान लोगों को दिखाई देगा
        </h2>

        <p className="text-xs sm:text-sm font-bold text-[#5A4838] mt-1.5 max-w-[280px]">
          पूरे भारत के खरीदार आपका सामान देख सकेंगे और सीधे ऑर्डर करेंगे।
        </p>

        {/* Item Mini Pill */}
        <div className="mt-4 px-4 py-2 rounded-2xl bg-white border border-[#E5DAC8] shadow-sm flex items-center gap-3">
          <img
            src={image}
            alt={name}
            className="w-9 h-9 rounded-xl object-cover border border-[#E5DAC8]"
          />
          <div className="text-left">
            <p className="text-xs font-black text-[#1E3A1E] leading-tight">{name}</p>
            <p className="text-[11px] font-extrabold text-[#3A6B35]">₹{price.toLocaleString('en-IN')}</p>
          </div>
        </div>

      </div>

      {/* Publish Action Button */}
      <div className="pt-2">
        <button
          onClick={() => {
            playSoundEffect('celebrate');
            onPublish();
          }}
          className="w-full py-4 px-6 rounded-2xl bg-[#3A6B35] hover:bg-[#2F582B] active:scale-[0.98] text-white font-extrabold text-xl flex items-center justify-center gap-2 shadow-xl shadow-[#3A6B35]/40 transition-all animate-pulse-slow"
        >
          <Sparkles className="w-5 h-5 text-amber-200" />
          <span>प्रकाशित करें</span>
        </button>
      </div>

    </div>
  );
};
