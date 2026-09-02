import React, { useState } from 'react';
import { Menu, Plus, ChevronRight, Volume2, Sparkles, Tag, Eye, ShoppingCart } from 'lucide-react';
import { RuralAppProductItem } from '../../../types';
import { speakText, playSoundEffect } from '../../../services/voiceAssistant';

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
  const [activeFilter, setActiveFilter] = useState<'all' | 'published' | 'orders'>('all');

  const filteredProducts = products.filter(p => {
    if (activeFilter === 'published') return p.status === 'published';
    if (activeFilter === 'orders') return p.status === 'order_received' || (p.ordersCount && p.ordersCount > 0);
    return true;
  });

  const handleVoiceSummary = () => {
    playSoundEffect('tap');
    speakText(`आपके पास कुल ${products.length} सामान बाज़ार में सूचीबद्ध हैं। नया सामान जोड़ने के लिए नीचे दिए गए हरे बटन पर टैप करें।`);
  };

  return (
    <div className="min-h-full flex flex-col justify-between bg-[#FAF6ED] text-[#2C241E] select-none">
      
      {/* Content Container */}
      <div className="p-4 sm:p-5 space-y-4">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pt-1">
          <h1 className="text-xl sm:text-2xl font-black text-[#1E3A1E] font-sans">
            मेरे सामान
          </h1>

          <button
            onClick={handleVoiceSummary}
            className="p-2.5 rounded-2xl bg-[#E8F0E3] border border-[#3A6B35]/30 text-[#3A6B35] shadow-sm hover:bg-[#DCEAD5] flex items-center gap-1"
            title="विवरण सुनें"
          >
            <Volume2 className="w-4 h-4" />
            <span className="text-xs font-bold hidden xs:inline">सुनें</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => {
              playSoundEffect('tap');
              setActiveFilter('all');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeFilter === 'all'
                ? 'bg-[#3A6B35] text-white shadow-sm'
                : 'bg-white text-[#5A4838] border border-[#E5DAC8]'
            }`}
          >
            सभी सामान ({products.length})
          </button>

          <button
            onClick={() => {
              playSoundEffect('tap');
              setActiveFilter('published');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeFilter === 'published'
                ? 'bg-[#3A6B35] text-white shadow-sm'
                : 'bg-white text-[#5A4838] border border-[#E5DAC8]'
            }`}
          >
            प्रकाशित
          </button>

          <button
            onClick={() => {
              playSoundEffect('tap');
              setActiveFilter('orders');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeFilter === 'orders'
                ? 'bg-[#3A6B35] text-white shadow-sm'
                : 'bg-white text-[#5A4838] border border-[#E5DAC8]'
            }`}
          >
            ऑर्डर प्राप्त
          </button>
        </div>

        {/* Products List */}
        {filteredProducts.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-[#E5DAC8] text-center shadow-sm my-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF0DD] flex items-center justify-center text-3xl mb-2">
              🧺
            </div>
            <h3 className="font-extrabold text-[#2C241E] text-base">
              कोई सामान नहीं मिला
            </h3>
            <p className="text-xs text-[#7D6E5D] mt-1">
              नीचे दिए गए बटन से नया सामान जोड़ें
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  playSoundEffect('tap');
                  onOpenItem(item);
                }}
                className="p-3.5 rounded-2xl bg-white border-2 border-[#E5DAC8] shadow-sm flex items-center justify-between cursor-pointer hover:border-[#3A6B35]/50 transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover border border-[#E5DAC8] shadow-sm flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-black text-[#1E3A1E] text-sm leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-xs font-extrabold text-[#3A6B35] mt-0.5">
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#E8F0E3] text-[#3A6B35]">
                        {item.status === 'published' ? 'प्रकाशित' : item.status === 'order_received' ? 'ऑर्डर आया!' : 'बिक गया'}
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

                <div className="flex items-center gap-1 text-[#8A7B6E]">
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Sticky Bottom "+ नया सामान जोड़ें" Button */}
      <div className="p-4 bg-white/95 backdrop-blur-md border-t border-[#E5DAC8] sticky bottom-0">
        <button
          onClick={() => {
            playSoundEffect('tap');
            onAddNewCraft();
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#3A6B35] hover:bg-[#2F582B] active:scale-[0.98] text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#3A6B35]/30 transition-all"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span>+ नया सामान जोड़ें</span>
        </button>
      </div>

    </div>
  );
};
