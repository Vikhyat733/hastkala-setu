import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Sparkles, ShieldCheck, Award, Flame, ArrowRight, HeartHandshake } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { setCurrentView, t } = useMarketplace();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-artisan-indigo via-[#24355A] to-artisan-terracotta-dark text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-6 shadow-2xl border border-amber-500/20">
      {/* Decorative Traditional Geometric Background Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-artisan-terracotta/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
      
      {/* Traditional Indian Mandala Decorative SVG Ring */}
      <div className="absolute -right-16 -bottom-16 w-80 h-80 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow" fill="currentColor">
          <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="1" fill="none" strokeDasharray="3 3"/>
          <circle cx="50" cy="50" r="35" stroke="white" strokeWidth="1.5" fill="none"/>
          <circle cx="50" cy="50" r="25" stroke="white" strokeWidth="1" fill="none" strokeDasharray="2 2"/>
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12 sm:py-16 sm:px-10 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-10">
        
        {/* Left Column: Hero Copy & Actions */}
        <div className="max-w-2xl text-center lg:text-left space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow text-amber-300" />
            <span>{t('sihBadge')}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-[1.15]">
            {t('heroHeadingPart1')} <span className="text-amber-400 italic">{t('heroHeadingPart2')}</span> {t('heroHeadingPart3')} <span className="bg-gradient-to-r from-orange-400 to-amber-200 bg-clip-text text-transparent">{t('heroHeadingPart4')}</span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-xl">
            {t('heroSubtitle')}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <button
              onClick={() => {
                setCurrentView('rural-artisan-app');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#2C5E43] to-[#3A6B35] text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-950/40 border-2 border-[#8AC172] hover:scale-105 hover:shadow-2xl transition-all duration-200"
            >
              <span className="text-xl">🌾</span>
              <span>{t('openRuralApp')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                setCurrentView('ai-studio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group relative inline-flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-artisan-terracotta to-artisan-saffron-gold text-white font-bold text-sm sm:text-base shadow-xl shadow-artisan-terracotta/40 hover:scale-105 transition-all duration-200"
            >
              <Sparkles className="w-5 h-5 text-amber-200" />
              <span>{t('aiStudioNav')}</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('marketplace-products');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-sm border border-white/20 transition-all"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{t('exploreCrafts')}</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t('giAuthentic')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-amber-400" />
              <span>{t('fairWageGuarantee')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-orange-400" />
              <span>{t('nationalAwardCrafts')}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive AI Feature Showcase Card */}
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl relative">
          
          <div className="flex items-center justify-between pb-4 border-b border-white/15">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Live Gemini Vision Scanner
              </span>
            </div>
            <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-md font-mono text-white/90">
              v2.0 Multimodal
            </span>
          </div>

          {/* Preview Image with AI Detection Overlay */}
          <div className="relative my-4 rounded-2xl overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&auto=format&fit=crop&q=80"
              alt="Jaipur Blue Pottery Vase"
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
              <div className="flex items-center gap-2">
                <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  GI-244 Detected
                </span>
                <span className="bg-white/30 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                  Quartz & Cobalt Glaze
                </span>
              </div>
              <p className="text-sm font-bold text-white mt-1 line-clamp-1">
                Hand-Painted Jaipur Blue Pottery Vase
              </p>
            </div>

            {/* Glowing scan target overlay */}
            <div className="absolute top-4 right-4 w-12 h-12 border-2 border-dashed border-amber-300/80 rounded-lg animate-pulse" />
          </div>

          {/* AI Generated Metrics Preview */}
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
              <p className="text-[10px] text-slate-300 font-medium">Estimated Labor Time</p>
              <p className="text-sm font-bold text-amber-300">16 Crafting Hours</p>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
              <p className="text-[10px] text-slate-300 font-medium">Fair Artisan Share</p>
              <p className="text-sm font-bold text-emerald-300">82% Direct (₹1,517)</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-300">Languages Generated:</span>
            <div className="flex items-center gap-1 font-bold text-amber-300">
              <span>EN • हिं • বাং • தமி • తెల • मरा</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
