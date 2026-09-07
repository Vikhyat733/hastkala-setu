import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { SAMPLE_CRAFTS } from '../data/sampleCrafts';
import { Award, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

export const ArtisanStories: React.FC = () => {
  const { setSelectedProductForModal, setCurrentView, activeLanguage, t } = useMarketplace();

  // Extract unique artisans
  const artisans = SAMPLE_CRAFTS.map((c) => ({
    artisan: c.artisan,
    craft: c
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-artisan-terracotta/10 text-artisan-terracotta text-xs font-bold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5" />
          <span>{t('heritageGuardians')}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-artisan-indigo">
          {t('voicesOfArtisans')}
        </h2>
        <p className="text-sm text-artisan-slate/80 leading-relaxed">
          {t('voicesSubtitle')}
        </p>
      </div>

      {/* Artisan Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {artisans.map(({ artisan, craft }) => (
          <div
            key={artisan.id}
            className="bg-white rounded-3xl overflow-hidden border border-artisan-terracotta/15 shadow-craft hover:shadow-craft-hover transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Artisan Photo & Cover Banner */}
              <div className="relative h-48 bg-artisan-sand overflow-hidden">
                <img
                  src={craft.images[0]}
                  alt="Craft background"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                <div className="absolute bottom-3 left-4 flex items-center gap-3">
                  <img
                    src={artisan.avatar}
                    alt={artisan.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md"
                  />
                  <div className="text-white">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-serif font-bold text-base leading-snug">{artisan.name}</h4>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-xs text-amber-300 font-medium">
                      {artisan.village}, {artisan.state}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bio & Craft Info */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-artisan-terracotta">
                    {artisan.craftSpecialty}
                  </span>
                  <span className="bg-artisan-sand text-artisan-indigo font-bold px-2.5 py-1 rounded-full text-[10px]">
                    {artisan.experienceYears} {t('yearsExperience')}
                  </span>
                </div>

                <p className="text-xs text-artisan-slate/80 italic font-serif leading-relaxed bg-artisan-sand/50 p-3.5 rounded-2xl border-l-2 border-artisan-terracotta">
                  "{artisan.storyQuote}"
                </p>

                <p className="text-xs text-artisan-slate/80 leading-relaxed">
                  {artisan.bio[activeLanguage] || artisan.bio.en}
                </p>
              </div>
            </div>

            {/* Bottom Card Action */}
            <div className="p-6 pt-0">
              <button
                onClick={() => {
                  setSelectedProductForModal(craft);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-artisan-sand hover:bg-artisan-sand-dark text-artisan-indigo font-bold text-xs border border-artisan-terracotta/20 flex items-center justify-center gap-2 transition-colors"
              >
                <span>{artisan.name.split(' ')[0]} - {t('preview')}</span>
                <ArrowRight className="w-3.5 h-3.5 text-artisan-terracotta" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
