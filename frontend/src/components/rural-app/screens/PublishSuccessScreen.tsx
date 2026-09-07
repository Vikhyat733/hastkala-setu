import React, { useEffect } from 'react';
import { Check, Plus, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakText, playSoundEffect } from '../../../services/voiceAssistant';
import { useMarketplace } from '../../../context/MarketplaceContext';

interface PublishSuccessScreenProps {
  image: string;
  name: string;
  price: number;
  onViewMyItems: () => void;
  onAddNewCraft: () => void;
}

export const PublishSuccessScreen: React.FC<PublishSuccessScreenProps> = ({
  image,
  name,
  price,
  onViewMyItems,
  onAddNewCraft
}) => {
  const { t, activeLanguage } = useMarketplace();

  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#3A6B35', '#E67E22', '#D95D39', '#F1C40F', '#27AE60']
      });
    } catch (e) {
      console.log('Confetti');
    }

    playSoundEffect('celebrate');
    if (activeLanguage === 'en') {
      speakText(`Congratulations! Your craft ${name} has been successfully published to the live marketplace.`);
    } else {
      speakText(`बधाई हो! आपका सामान ${name} सफलतापूर्वक बाज़ार में प्रकाशित हो गया है।`);
    }
  }, [name, activeLanguage]);

  return (
    <div className="min-h-full flex flex-col justify-between bg-[#FAF6ED] text-[#2C241E] select-none p-5 text-center max-w-xl mx-auto w-full">
      
      {/* Top Confetti Decor */}
      <div className="pt-2">
        <div className="flex justify-center gap-3 text-2xl animate-bounce-short">
          <span>🎊</span>
          <span>🎉</span>
          <span>✨</span>
        </div>
      </div>

      {/* Main Success Content */}
      <div className="my-auto py-2 flex flex-col items-center">
        
        {/* Giant Green Check Circle Badge */}
        <div className="relative mb-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#EAF4E6] border-4 border-[#3A6B35] flex items-center justify-center shadow-xl shadow-[#3A6B35]/20 animate-scale-up">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#3A6B35] flex items-center justify-center text-white shadow-inner">
              <Check className="w-10 h-10 sm:w-12 sm:h-12 stroke-[3.5]" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black text-[#1E3A1E] font-sans tracking-tight">
          {t('congratulations')}
        </h1>

        <p className="text-sm font-bold text-[#4E6C47] mt-1 max-w-[280px]">
          {t('itemPublishedSuccess')}
        </p>

        {/* Published Craft Preview Card */}
        <div className="mt-5 p-3.5 rounded-3xl bg-white border-2 border-[#D7E8CC] shadow-md w-full max-w-[320px] flex items-center gap-3.5 text-left">
          <img
            src={image}
            alt={name}
            className="w-16 h-16 rounded-2xl object-cover border border-[#E5DAC8] shadow-sm flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <span className="inline-block text-[10px] font-black px-2 py-0.5 rounded-md bg-[#E8F0E3] text-[#3A6B35] mb-1">
              {t('liveInMarketplace')}
            </span>
            <h3 className="font-extrabold text-[#1E3A1E] text-sm truncate">
              {name}
            </h3>
            <p className="text-xs font-black text-[#3A6B35]">
              ₹{price.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

      </div>

      {/* 2 Primary Action Buttons */}
      <div className="space-y-3 pt-4 w-full max-w-md mx-auto">
        
        {/* Button 1: View My Items */}
        <button
          onClick={() => {
            playSoundEffect('tap');
            onViewMyItems();
          }}
          className="w-full py-4 px-6 rounded-2xl bg-[#3A6B35] hover:bg-[#2F582B] active:scale-[0.98] text-white font-extrabold text-base flex items-center justify-center gap-2.5 shadow-lg shadow-[#3A6B35]/30 transition-all"
        >
          <Eye className="w-5 h-5 stroke-[2.5]" />
          <span>{t('viewMyItems')}</span>
        </button>

        {/* Button 2: Add Another Item */}
        <button
          onClick={() => {
            playSoundEffect('tap');
            onAddNewCraft();
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-white border-2 border-[#E5DAC8] hover:bg-[#F4EDE0] active:scale-[0.98] text-[#3B3026] font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3] text-[#3A6B35]" />
          <span>{t('addAnotherItem')}</span>
        </button>

      </div>

    </div>
  );
};
