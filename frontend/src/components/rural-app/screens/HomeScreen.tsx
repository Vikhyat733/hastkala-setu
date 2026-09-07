import React from 'react';
import { Bell, Menu, Plus, Volume2, ChevronRight, Sparkles } from 'lucide-react';
import { RuralArtisanUser } from '../data/ruralAppDefaults';
import { RuralAppProductItem } from '../../../types';
import { speakText, playSoundEffect } from '../../../services/voiceAssistant';
import { useMarketplace } from '../../../context/MarketplaceContext';

interface HomeScreenProps {
  artisan: RuralArtisanUser;
  products: RuralAppProductItem[];
  onAddNewCraft: () => void;
  onViewMyItems: () => void;
  onOpenItem: (item: RuralAppProductItem) => void;
  onOpenNotifications: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  artisan,
  products,
  onAddNewCraft,
  onViewMyItems,
  onOpenItem,
  onOpenNotifications
}) => {
  const { t, activeLanguage } = useMarketplace();

  const handleVoiceGreeting = () => {
    playSoundEffect('tap');
    if (activeLanguage === 'en') {
      speakText(`Hello ${artisan.name}! What handcrafted item would you like to sell today? Tap the green button to add a new craft.`);
    } else {
      speakText(`नमस्ते ${artisan.name}! आज आप क्या सामान बेचना चाहेंगी? नया सामान जोड़ने के लिए बड़े हरे बटन पर टैप करें।`);
    }
  };

  return (
    <div className="min-h-full flex flex-col justify-between bg-[#FAF6ED] text-[#2C241E] select-none w-full">
      
      <div className="p-4 sm:p-6 space-y-6">
        
        {/* Top Header Bar with Menu & Notification */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#1E3A1E] font-sans">
              {t('namaste')}
            </h1>
            <span className="text-sm font-extrabold text-[#7D6E5D] bg-[#EADCC9]/50 px-2.5 py-0.5 rounded-lg">
              {artisan.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleVoiceGreeting}
              className="p-2.5 rounded-2xl bg-[#E8F0E3] border border-[#3A6B35]/30 text-[#3A6B35] shadow-sm hover:bg-[#DCEAD5] flex items-center gap-1.5"
              title="Listen"
            >
              <Volume2 className="w-4 h-4" />
              <span className="text-xs font-bold hidden xs:inline">{t('listen')}</span>
            </button>

            <button
              onClick={() => {
                playSoundEffect('tap');
                onOpenNotifications();
              }}
              className="relative p-2.5 rounded-2xl bg-white border border-[#E5DAC8] text-[#3B3026] shadow-sm hover:bg-[#F4EDE0]"
              title={t('notifications')}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#D95D39] rounded-full ring-2 ring-white animate-ping"></span>
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#D95D39] rounded-full ring-2 ring-white"></span>
            </button>
          </div>
        </div>

        {/* Responsive Grid: Hero Card on one side, Items & Info on the other on tablet/desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* GIANT HERO CARD: "Add New Item" */}
          <div 
            onClick={() => {
              playSoundEffect('tap');
              onAddNewCraft();
            }}
            className="group relative cursor-pointer overflow-hidden rounded-3xl bg-gradient-to-b from-white to-[#F9F5EC] border-2 border-[#D7E8CC] p-6 sm:p-8 shadow-md hover:shadow-xl hover:border-[#3A6B35] transition-all transform active:scale-[0.98] flex flex-col items-center justify-center text-center"
          >
            {/* Subtle Background Accent */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#E9F4E3]/60 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

            {/* Basket & Plus Badge Illustration */}
            <div className="relative mb-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#FAF0DD] border-2 border-[#EAD0A8] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                <span className="text-5xl sm:text-6xl drop-shadow-sm select-none">🧺</span>
              </div>
              
              {/* Plus Badge */}
              <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-[#3A6B35] border-2 border-white text-white flex items-center justify-center shadow-lg group-hover:rotate-90 transition-transform">
                <Plus className="w-5 h-5 stroke-[3]" />
              </div>
            </div>

            {/* Main Action Title */}
            <h2 className="text-xl sm:text-2xl font-black text-[#1E3A1E] tracking-tight flex items-center gap-1.5">
              <span>{t('addNewItem')}</span>
              <Sparkles className="w-5 h-5 text-[#E67E22] animate-bounce-short" />
            </h2>

            {/* Description / Instruction */}
            <p className="text-xs sm:text-sm font-bold text-[#5A6E50] mt-1.5 max-w-[280px]">
              {t('takePhotoAndAI')}
            </p>

            {/* Quick Touch Button */}
            <div className="mt-5 py-2.5 px-6 rounded-xl bg-[#3A6B35] text-white font-extrabold text-sm flex items-center gap-2 shadow-md shadow-[#3A6B35]/30 group-hover:bg-[#2F582B] transition-colors">
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{t('startNow')}</span>
            </div>
          </div>

          {/* Right Column: "My Items" Summary & Advice */}
          <div className="flex flex-col justify-between space-y-4">
            
            {/* SECTION: "My Items" Summary */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#3B3026]">
                    {t('myItems')}
                  </h3>
                  <p className="text-xs text-[#7D6E5D]">
                    {t('whatToSellToday')}
                  </p>
                </div>
                {products.length > 0 && (
                  <button 
                    onClick={() => {
                      playSoundEffect('tap');
                      onViewMyItems();
                    }}
                    className="text-xs font-bold text-[#3A6B35] flex items-center hover:underline"
                  >
                    <span>{t('viewAll')} ({products.length})</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {products.length === 0 ? (
                /* Empty State */
                <div className="p-6 rounded-2xl bg-white border border-[#E5DAC8] text-center shadow-sm">
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF0DD] flex items-center justify-center text-2xl mb-2">
                    🧺
                  </div>
                  <p className="text-sm font-bold text-[#6D5D4E]">
                    {t('noItemsYet')}
                  </p>
                  <p className="text-xs text-[#9E8E7F] mt-0.5">
                    {t('addFirstItemHint')}
                  </p>
                </div>
              ) : (
                /* Mini List of Recent Items */
                <div className="space-y-2.5">
                  {products.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        playSoundEffect('tap');
                        onOpenItem(item);
                      }}
                      className="p-3 rounded-2xl bg-white border border-[#E5DAC8] shadow-sm flex items-center justify-between cursor-pointer hover:border-[#3A6B35]/50 transition-all hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-xl object-cover border border-[#E5DAC8]"
                        />
                        <div>
                          <h4 className="font-extrabold text-[#2C241E] text-sm leading-tight">
                            {item.name}
                          </h4>
                          <p className="text-xs font-black text-[#3A6B35] mt-0.5">
                            ₹{item.price.toLocaleString('en-IN')}
                          </p>
                          <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E8F0E3] text-[#3A6B35]">
                            {item.status === 'published' ? t('published') : item.status === 'order_received' ? t('orderReceived') : t('sold')}
                          </span>
                        </div>
                      </div>

                      <ChevronRight className="w-5 h-5 text-[#8A7B6E]" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Audio Advice Banner */}
            <div className="p-3.5 rounded-2xl bg-[#E8F0E3] border border-[#3A6B35]/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">💡</span>
                <p className="text-xs font-bold text-[#2A4E26] leading-tight">
                  {t('aiHelpsYou')}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
