import React, { useState } from 'react';
import melaLogo from '../../../assets/mela_logo.png';
import { Search, Heart, Volume2 } from 'lucide-react';
import { RURAL_CATEGORIES } from '../data/ruralAppDefaults';
import { RuralAppProductItem } from '../../../types';
import { speakText, playSoundEffect } from '../../../services/voiceAssistant';
import { useMarketplace } from '../../../context/MarketplaceContext';

interface RuralBazaarScreenProps {
  products: RuralAppProductItem[];
  onOpenProduct: (product: RuralAppProductItem) => void;
}

export const RuralBazaarScreen: React.FC<RuralBazaarScreenProps> = ({
  products,
  onOpenProduct
}) => {
  const { t, activeLanguage } = useMarketplace();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    playSoundEffect('tap');
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(f => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'all') return matchesSearch;
    return matchesSearch && p.category.includes(selectedCategory);
  });

  const handleVoiceSearch = () => {
    playSoundEffect('tap');
    if (activeLanguage === 'en') {
      speakText('Welcome to the Artisan Bazaar. You can browse fellow artisans crafts, prices and ideas here.');
    } else {
      speakText('कारीगर मेला बाज़ार में आपका स्वागत है। आप यहाँ अन्य कारीगरों के सामान और बाज़ार की कीमतें देख सकते हैं।');
    }
  };

  return (
    <div className="min-h-full flex flex-col justify-between bg-[#FAF6ED] text-[#2C241E] select-none p-4 sm:p-6 space-y-6 w-full">
      
      {/* Top Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-[#E5DAC8] shadow-xs flex items-center justify-center flex-shrink-0">
              <img src={melaLogo} alt="mela logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1E3A1E] font-sans leading-none">
              {t('artisanBazaar')}
            </h1>
          </div>

          <button
            onClick={handleVoiceSearch}
            className="p-2.5 rounded-2xl bg-[#E8F0E3] border border-[#3A6B35]/30 text-[#3A6B35] shadow-sm hover:bg-[#DCEAD5]"
            title="Listen"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchItems')}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border-2 border-[#E5DAC8] focus:border-[#3A6B35] focus:outline-none text-sm font-bold text-[#2C241E] placeholder-[#9E8E7F] shadow-sm"
          />
          <Search className="w-5 h-5 text-[#8A7B6E] absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category Icons Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          <button
            onClick={() => {
              playSoundEffect('tap');
              setSelectedCategory('all');
            }}
            className={`flex flex-col items-center gap-1 p-2.5 rounded-2xl min-w-[70px] border-2 transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#3A6B35] border-[#2C5528] text-white shadow-md'
                : 'bg-white border-[#E5DAC8] text-[#3B3026] hover:bg-[#F9F5EC]'
            }`}
          >
            <span className="text-xl">🌟</span>
            <span className="text-[11px] font-extrabold">{t('all')}</span>
          </button>

          {RURAL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  playSoundEffect('tap');
                  setSelectedCategory(cat.name === 'और' ? 'all' : cat.name);
                }}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-2xl min-w-[70px] border-2 transition-all ${
                  isSelected
                    ? 'bg-[#3A6B35] border-[#2C5528] text-white shadow-md'
                    : 'bg-white border-[#E5DAC8] text-[#3B3026] hover:bg-[#F9F5EC]'
                }`}
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="text-[11px] font-extrabold">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section: Popular Items Grid */}
      <div className="space-y-3 flex-1">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-[#1E3A1E]">
            {t('popularItems')}
          </h2>
          <span className="text-xs font-bold text-[#7D6E5D]">
            {filteredProducts.length} {t('itemsFound')}
          </span>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredProducts.map((item) => {
            const isFav = favorites.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => {
                  playSoundEffect('tap');
                  onOpenProduct(item);
                }}
                className="p-3.5 rounded-2xl bg-white border-2 border-[#E5DAC8] shadow-sm flex items-center justify-between cursor-pointer hover:border-[#3A6B35]/40 transition-all active:scale-[0.99] hover:shadow-md"
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
                    <span className="text-[10px] font-bold text-[#8A7B6E] bg-[#FAF6ED] px-2 py-0.5 rounded-md mt-1 inline-block border border-[#E5DAC8]">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Heart / Wishlist Toggle */}
                <button
                  onClick={(e) => toggleFavorite(e, item.id)}
                  className={`p-2.5 rounded-xl transition-colors flex-shrink-0 ${
                    isFav
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-[#FAF6ED] text-[#8A7B6E] hover:text-rose-500'
                  }`}
                  title={t('like')}
                >
                  <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
