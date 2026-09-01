import React, { useState } from 'react';
import { Product } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';
import { Heart, ShoppingBag, Eye, Award, Star, Sparkles, Volume2 } from 'lucide-react';
import { speakText } from '../services/geminiVision';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    activeLanguage,
    formatPrice,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setSelectedProductForModal,
    t
  } = useMarketplace();

  const [isHovered, setIsHovered] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const title = product.title[activeLanguage] || product.title.en;
  const desc = product.shortDescription[activeLanguage] || product.shortDescription.en;

  const handleAudioSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakText(`${title}. ${desc}`, activeLanguage);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white rounded-3xl overflow-hidden border border-artisan-terracotta/15 hover:border-artisan-terracotta/40 shadow-craft hover:shadow-craft-hover transition-all duration-300 flex flex-col justify-between relative"
    >
      {/* Top Image Container */}
      <div className="relative h-60 w-full overflow-hidden bg-artisan-sand">
        <img
          src={product.images[0]}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges (GI Tag, AI Verified) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.giTagStatus.hasGiTag && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
              <Award className="w-3 h-3" />
              <span>GI Tagged</span>
            </span>
          )}
          {product.isAiGenerated && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-artisan-indigo/90 backdrop-blur-md text-amber-300 text-[9px] font-bold uppercase tracking-wider">
              <Sparkles className="w-2.5 h-2.5" />
              <span>AI Studio Live</span>
            </span>
          )}
        </div>

        {/* Wishlist and Audio Buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={handleAudioSpeak}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-artisan-indigo flex items-center justify-center shadow-md hover:scale-110 transition-all"
            title="Listen to product audio description"
          >
            <Volume2 className="w-4 h-4 text-artisan-terracotta" />
          </button>
          
          <button
            onClick={() => toggleWishlist(product.id)}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-artisan-indigo flex items-center justify-center shadow-md hover:scale-110 transition-all"
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-500 text-red-500' : 'text-artisan-indigo'}`} />
          </button>
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
          <button
            onClick={() => setSelectedProductForModal(product)}
            className="pointer-events-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-artisan-indigo font-bold text-xs shadow-lg hover:bg-artisan-sand hover:scale-105 transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-artisan-terracotta" />
            <span>{t('quickView')}</span>
          </button>
        </div>

        {/* Artisan Signature Badge on Image Bottom */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-full px-2.5 py-1 shadow-sm">
            <img
              src={product.artisan.avatar}
              alt={product.artisan.name}
              className="w-5 h-5 rounded-full object-cover border border-artisan-terracotta/40"
            />
            <span className="text-[11px] font-bold text-artisan-indigo truncate max-w-[120px]">
              {product.artisan.name}
            </span>
          </div>

          <span className="text-[10px] font-bold bg-artisan-indigo/80 backdrop-blur-md text-amber-300 px-2 py-0.5 rounded-full">
            {product.originState}
          </span>
        </div>
      </div>

      {/* Product Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div>
          {/* Rating and Craft Category */}
          <div className="flex items-center justify-between text-xs text-artisan-slate/70 mb-1.5">
            <span className="capitalize font-semibold text-artisan-terracotta text-[11px] tracking-wide uppercase">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-artisan-slate/40 text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={() => setSelectedProductForModal(product)}
            className="font-serif font-bold text-base text-artisan-indigo hover:text-artisan-terracotta cursor-pointer line-clamp-2 leading-snug transition-colors"
          >
            {title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-artisan-slate/80 line-clamp-2 mt-1 leading-relaxed">
            {desc}
          </p>
        </div>

        {/* Fair Price Transparency Block */}
        <div className="pt-3 border-t border-artisan-terracotta/10 space-y-2">
          
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-artisan-indigo">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-artisan-slate/50 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Direct Artisan Share Tag */}
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <span>{product.priceBreakdown.artisanDirectSharePercent}% Direct</span>
            </span>
          </div>

          {/* Action Buttons: Add to Cart and Quick Story */}
          <div className="grid grid-cols-5 gap-2 pt-1">
            <button
              onClick={() => setSelectedProductForModal(product)}
              className="col-span-2 py-2 px-2 rounded-xl bg-artisan-sand hover:bg-artisan-sand-dark text-artisan-indigo font-bold text-xs border border-artisan-terracotta/20 transition-all flex items-center justify-center gap-1"
            >
              <Eye className="w-3.5 h-3.5 text-artisan-terracotta" />
              <span>Story</span>
            </button>

            <button
              onClick={() => addToCart(product, 1)}
              className="col-span-3 py-2 px-3 rounded-xl bg-artisan-terracotta hover:bg-artisan-terracotta-dark text-white font-bold text-xs shadow-sm shadow-artisan-terracotta/30 hover:scale-102 transition-all flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{t('addToCart')}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
