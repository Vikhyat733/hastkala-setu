import React, { useMemo } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { useMarketplace } from '../context/MarketplaceContext';
import { Sparkles, SearchX } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  selectedCategory: string;
  selectedState: string;
  giOnly: boolean;
  ecoOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
  searchQuery: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedCategory,
  selectedState,
  giOnly,
  ecoOnly,
  sortBy,
  searchQuery
}) => {
  const { activeLanguage } = useMarketplace();

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // State filter
      if (selectedState !== 'All Regions' && p.originState !== selectedState) {
        return false;
      }
      // GI tag filter
      if (giOnly && !p.giTagStatus.hasGiTag) {
        return false;
      }
      // Eco friendly filter
      if (ecoOnly && !p.ecoFriendly) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleEn = p.title.en?.toLowerCase() || '';
        const titleHi = p.title.hi?.toLowerCase() || '';
        const titleActive = p.title[activeLanguage]?.toLowerCase() || '';
        const artisanName = p.artisan.name.toLowerCase();
        const origin = p.originState.toLowerCase();
        const category = p.category.toLowerCase();
        const tags = p.tags.join(' ').toLowerCase();

        return (
          titleEn.includes(q) ||
          titleHi.includes(q) ||
          titleActive.includes(q) ||
          artisanName.includes(q) ||
          origin.includes(q) ||
          category.includes(q) ||
          tags.includes(q)
        );
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // default featured
    });
  }, [products, selectedCategory, selectedState, giOnly, ecoOnly, sortBy, searchQuery, activeLanguage]);

  if (filteredProducts.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 text-center p-8 bg-white rounded-3xl border border-artisan-terracotta/20 shadow-sm space-y-4">
        <div className="w-16 h-16 bg-artisan-sand rounded-2xl flex items-center justify-center mx-auto text-artisan-slate/50">
          <SearchX className="w-8 h-8 text-artisan-terracotta" />
        </div>
        <h3 className="font-serif font-bold text-xl text-artisan-indigo">
          No Crafts Matched Your Filter
        </h3>
        <p className="text-xs text-artisan-slate/80 leading-relaxed">
          Try clearing your search filters or browse other GI-certified artisan regions across India.
        </p>
      </div>
    );
  }

  return (
    <div id="marketplace-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      
      {/* Newly Published AI Studio Highlight Banner if any recent crafts */}
      {products.some(p => p.isAiGenerated) && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-artisan-terracotta/10 to-transparent border border-amber-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <p className="text-xs font-bold text-artisan-indigo">
                Live AI Vision Uploads Active
              </p>
              <p className="text-[11px] text-artisan-slate/80">
                Products freshly onboarded with Gemini Vision are marked with the "AI Studio Live" badge.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
