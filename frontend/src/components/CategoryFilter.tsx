import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Product } from '../types';
import { Award, Leaf, SlidersHorizontal, MapPin } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedState: string;
  setSelectedState: (state: string) => void;
  giOnly: boolean;
  setGiOnly: (gi: boolean) => void;
  ecoOnly: boolean;
  setEcoOnly: (eco: boolean) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
  setSortBy: (sort: 'featured' | 'price-asc' | 'price-desc' | 'rating') => void;
  totalCount: number;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedState,
  setSelectedState,
  giOnly,
  setGiOnly,
  ecoOnly,
  setEcoOnly,
  sortBy,
  setSortBy,
  totalCount
}) => {
  const { t } = useMarketplace();

  const categories: { id: string; labelKey: string; icon: string }[] = [
    { id: 'all', labelKey: 'allCategories', icon: '✨' },
    { id: 'pottery', labelKey: 'pottery', icon: '🏺' },
    { id: 'paintings', labelKey: 'paintings', icon: '🎨' },
    { id: 'textiles', labelKey: 'textiles', icon: '🧵' },
    { id: 'woodcraft', labelKey: 'woodcraft', icon: '🪵' },
    { id: 'metalwork', labelKey: 'metalwork', icon: '🪔' },
    { id: 'homedecor', labelKey: 'homedecor', icon: '🏮' }
  ];

  const states = [
    'All Regions',
    'Rajasthan',
    'Bihar',
    'Karnataka',
    'Chhattisgarh',
    'West Bengal',
    'Gujarat',
    'Uttar Pradesh'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8 space-y-5">
      
      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === cat.id
                ? 'bg-artisan-terracotta text-white shadow-md shadow-artisan-terracotta/30 scale-102'
                : 'bg-white text-artisan-indigo border border-artisan-terracotta/15 hover:border-artisan-terracotta/40 hover:bg-artisan-sand'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{t(cat.labelKey)}</span>
          </button>
        ))}
      </div>

      {/* Secondary Filter & Sort Controls Row */}
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-artisan-terracotta/15 shadow-sm flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Quick Toggles (GI Tag, Eco-Friendly, State Selector) */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* GI Tag Certified Filter */}
          <button
            onClick={() => setGiOnly(!giOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              giOnly
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-artisan-sand text-artisan-indigo hover:bg-amber-100/50 border border-artisan-terracotta/15'
            }`}
          >
            <Award className={`w-3.5 h-3.5 ${giOnly ? 'text-white' : 'text-amber-600'}`} />
            <span>{t('giTaggedOnly')}</span>
          </button>

          {/* Eco Friendly Filter */}
          <button
            onClick={() => setEcoOnly(!ecoOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              ecoOnly
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-artisan-sand text-artisan-indigo hover:bg-emerald-100/50 border border-artisan-terracotta/15'
            }`}
          >
            <Leaf className={`w-3.5 h-3.5 ${ecoOnly ? 'text-white' : 'text-emerald-600'}`} />
            <span>{t('ecoFriendlyOnly')}</span>
          </button>

          {/* State / Region Dropdown */}
          <div className="relative flex items-center">
            <MapPin className="w-3.5 h-3.5 text-artisan-terracotta absolute left-3 pointer-events-none" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              aria-label="Filter crafts by Indian state or region"
              className="bg-artisan-sand border border-artisan-terracotta/15 rounded-xl pl-8 pr-4 py-1.5 text-xs font-semibold text-artisan-indigo focus:outline-none focus:ring-2 focus:ring-artisan-terracotta/30 cursor-pointer"
            >
              {states.map((st) => (
                <option key={st} value={st}>
                  {st === 'All Regions' ? t('allStates') : st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Results Count & Sort Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-artisan-slate/70 font-semibold">
            Showing <strong className="text-artisan-indigo">{totalCount}</strong> authentic creations
          </span>

          <div className="flex items-center gap-1.5 bg-artisan-sand rounded-xl px-2.5 py-1 border border-artisan-terracotta/15">
            <SlidersHorizontal className="w-3.5 h-3.5 text-artisan-terracotta" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort craft items"
              className="bg-transparent text-xs font-bold text-artisan-indigo focus:outline-none cursor-pointer"
            >
              <option value="featured">✨ Featured Heritage</option>
              <option value="price-asc">{t('priceLowHigh')}</option>
              <option value="price-desc">{t('priceHighLow')}</option>
              <option value="rating">⭐ {t('ratingHighLow')}</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
};
