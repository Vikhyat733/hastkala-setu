import React, { useState } from 'react';
import { Plus, ChevronRight, Volume2, Eye } from 'lucide-react';
import { RuralAppProductItem } from '../../../types';
import { speakText, playSoundEffect } from '../../../services/voiceAssistant';
import { useMarketplace } from '../../../context/MarketplaceContext';

interface MyItemsScreenProps {
  products: RuralAppProductItem[];
  onAddNewCraft: () => void;
  onOpenItem: (item: RuralAppProductItem) => void;
}

export const MyItemsScreen: React.FC<MyItemsScreenProps> = ({
  products,
  onAddNewCraft,
  onOpenItem
}) => {
  const { t, activeLanguage } = useMarketplace();
  const [activeFilter, setActiveFilter] = useState<'all' | 'published' | 'orders'>('all');

  const filteredProducts = products.filter(p => {
    if (activeFilter === 'published') return p.status === 'published';
    if (activeFilter === 'orders') return p.status === 'order_received' || (p.ordersCount && p.ordersCount > 0);
    return true;
  });

  const handleVoiceSummary = () => {
    playSoundEffect('tap');
    if (activeLanguage === 'en') {
      speakText(`You have ${products.length} crafts listed in the marketplace. Tap the green button below to add a new item.`);
    } else {
      speakText(`आपके पास कुल ${products.length} सामान बाज़ार में सूचीबद्ध हैं। नया सामान जोड़ने के लिए नीचे दिए गए हरे बटन पर टैप करें।`);
    }
  };

  return (
    <div className="min-h-full flex flex-col justify-between bg-[#FAF6ED] text-[#2C241E] select-none w-full">
      
      {/* Content Container */}
      <div className="p-4 sm:p-6 space-y-4 flex-1">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pt-1">
          <h1 className="text-xl sm:text-2xl font-black text-[#1E3A1E] font-sans">
            {t('myItemsTitle')}
          </h1>

          <button
            onClick={handleVoiceSummary}
            className="p-2.5 rounded-2xl bg-[#E8F0E3] border border-[#3A6B35]/30 text-[#3A6B35] shadow-sm hover:bg-[#DCEAD5] flex items-center gap-1.5"
            title="Listen"
          >
            <Volume2 className="w-4 h-4" />
            <span className="text-xs font-bold hidden xs:inline">{t('listen')}</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => {
              playSoundEffect('tap');
              setActiveFilter('all');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-[#3A6B35] text-white shadow-sm'
                : 'bg-white text-[#5A4838] border border-[#E5DAC8]'
            }`}
          >
            {t('allItems')} ({products.length})
          </button>

          <button
            onClick={() => {
              playSoundEffect('tap');
              setActiveFilter('published');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeFilter === 'published'
                ? 'bg-[#3A6B35] text-white shadow-sm'
                : 'bg-white text-[#5A4838] border border-[#E5DAC8]'
            }`}
          >
            {t('publishedFilter')}
          </button>

          <button
            onClick={() => {
              playSoundEffect('tap');
              setActiveFilter('orders');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeFilter === 'orders'
                ? 'bg-[#3A6B35] text-white shadow-sm'
                : 'bg-white text-[#5A4838] border border-[#E5DAC8]'
            }`}
          >
            {t('ordersReceived')}
          </button>
        </div>

        {/* Products Responsive Grid */}
        {filteredProducts.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E5DAC8] text-center shadow-sm my-6 max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF0DD] flex items-center justify-center text-3xl mb-2">
              🧺
            </div>
            <h3 className="font-extrabold text-[#2C241E] text-base">
              {t('noItemsFound')}
            </h3>
            <p className="text-xs text-[#7D6E5D] mt-1">
              {t('addItemBelow')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  playSoundEffect('tap');
                  onOpenItem(item);
                }}
                className="p-3.5 rounded-2xl bg-white border-2 border-[#E5DAC8] shadow-sm flex items-center justify-between cursor-pointer hover:border-[#3A6B35]/50 transition-all active:scale-[0.99] hover:shadow-md"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover border border-[#E5DAC8] shadow-sm flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-black text-[#1E3A1E] text-sm leading-tight truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs font-extrabold text-[#3A6B35] mt-0.5">
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#E8F0E3] text-[#3A6B35]">
                        {item.status === 'published' ? t('published') : item.status === 'order_received' ? t('orderReceived') : t('sold')}
                      </span>
                      {item.viewsCount && (
                        <span className="text-[10px] font-bold text-[#7D6E5D] flex items-center gap-0.5">
                          <Eye className="w-3 h-3" />
                          <span>{item.viewsCount}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[#8A7B6E] flex-shrink-0">
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Sticky Bottom Add Item Button */}
      <div className="p-4 bg-white/95 backdrop-blur-md border-t border-[#E5DAC8] sticky bottom-0">
        <button
          onClick={() => {
            playSoundEffect('tap');
            onAddNewCraft();
          }}
          className="w-full max-w-xl mx-auto py-3.5 px-6 rounded-2xl bg-[#3A6B35] hover:bg-[#2F582B] active:scale-[0.98] text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#3A6B35]/30 transition-all"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span>{t('addNewItemBtn')}</span>
        </button>
      </div>

    </div>
  );
};
