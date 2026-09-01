import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  TrendingUp, 
  Sparkles, 
  Store, 
  Package, 
  Coins, 
  HeartHandshake, 
  Plus, 
  ArrowUpRight, 
  Eye, 
  Calendar,
  Award
} from 'lucide-react';

export const ArtisanDashboard: React.FC = () => {
  const {
    products,
    activeArtisan,
    formatPrice,
    setCurrentView,
    setSelectedProductForModal,
    activeLanguage
  } = useMarketplace();

  const artisanProducts = products.filter(
    (p) => p.artisan.id === activeArtisan.id || p.isAiGenerated
  );

  const totalEarnings = artisanProducts.reduce((sum, p) => sum + p.price * 12, 142800);
  const totalItemsSold = activeArtisan.totalProductsSold + (artisanProducts.length > 0 ? 14 : 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Seller Profile Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-artisan-terracotta/20 shadow-craft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="flex items-center gap-5">
          <img
            src={activeArtisan.avatar}
            alt={activeArtisan.name}
            className="w-20 h-20 rounded-3xl object-cover border-4 border-artisan-sand shadow-md"
          />

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-2xl text-artisan-indigo">
                {activeArtisan.name}
              </h2>
              {activeArtisan.nationalAwardee && (
                <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Award className="w-3 h-3" /> National Master
                </span>
              )}
            </div>
            <p className="text-xs text-artisan-slate/70">
              {activeArtisan.craftSpecialty} • {activeArtisan.village}, {activeArtisan.state}
            </p>
            <p className="text-xs font-semibold text-emerald-700">
              ✓ Verified SIH Mela Master Guild • GI Certified Artisan
            </p>
          </div>
        </div>

        {/* Primary Action */}
        <button
          onClick={() => {
            setCurrentView('ai-studio');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-artisan-terracotta to-artisan-saffron-gold text-white font-bold text-xs sm:text-sm shadow-md shadow-artisan-terracotta/30 hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Craft with Gemini AI</span>
        </button>

      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="bg-white p-5 rounded-3xl border border-artisan-terracotta/15 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-artisan-slate/70">Total Fair Earnings</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-artisan-indigo">{formatPrice(totalEarnings)}</p>
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +24% from previous Mela
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-artisan-terracotta/15 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-artisan-slate/70">Crafts Sold</span>
            <div className="w-8 h-8 rounded-xl bg-artisan-sand text-artisan-terracotta flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-artisan-indigo">{totalItemsSold}</p>
          <p className="text-[11px] text-artisan-slate/60 font-semibold">
            Across 18 Indian States & Export
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-artisan-terracotta/15 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-artisan-slate/70">Direct Patron Tips</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-artisan-indigo">{formatPrice(14600)}</p>
          <p className="text-[11px] text-amber-800 font-semibold">
            100% Direct to Artisan Account
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-artisan-terracotta/15 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-artisan-slate/70">Master Rating</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-artisan-indigo">4.95 / 5.0</p>
          <p className="text-[11px] text-purple-800 font-semibold">
            From 94 Verified Patrons
          </p>
        </div>

      </div>

      {/* AI Demand & Festival Advisor */}
      <div className="bg-gradient-to-r from-artisan-indigo to-[#2A3E6B] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 relative overflow-hidden">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            <h3 className="font-serif font-bold text-xl text-amber-300">
              AI Mela Trend & Festive Demand Advisor
            </h3>
          </div>
          <span className="text-xs bg-white/10 px-3 py-1 rounded-full font-mono text-slate-200">
            Updated Today
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl">
          Based on upcoming festival seasons and buyer search trends, here are recommended production insights:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300">Diwali & Autumn Mela</span>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-200 font-bold px-2 py-0.5 rounded">
                +62% Demand
              </span>
            </div>
            <p className="text-xs text-slate-300">
              High search volume for <strong>Terracotta Hand-Painted Diyas</strong> & <strong>Jaipur Blue Glaze Planters</strong>. Suggested production batch: 40 units.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300">Wedding Season</span>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-200 font-bold px-2 py-0.5 rounded">
                +45% Demand
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Buyers favor <strong>Banarasi Silk Brocade Shawls</strong> and <strong>Bastar Dhokra Elephant Centerpieces</strong> for traditional gifting.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300">Global Fair Trade Export</span>
              <span className="text-[10px] bg-amber-400/30 text-amber-200 font-bold px-2 py-0.5 rounded">
                High Value
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Eco-friendly <strong>Channapatna Wooden Toys</strong> and <strong>Mithila Paintings</strong> qualify for international GI premium catalog.
            </p>
          </div>

        </div>

      </div>

      {/* Active Listings Manager */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-artisan-terracotta/20 shadow-craft space-y-5">
        
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-xl text-artisan-indigo">
            Your Active Craft Catalog ({products.length})
          </h3>
          <span className="text-xs text-artisan-slate/60">
            Live in SIH Mela Store
          </span>
        </div>

        <div className="space-y-3">
          {products.map((p) => {
            const title = p.title[activeLanguage] || p.title.en;
            return (
              <div
                key={p.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-artisan-sand/40 border border-artisan-terracotta/10 hover:border-artisan-terracotta/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={p.images[0]}
                    alt={title}
                    className="w-16 h-16 rounded-xl object-cover border border-artisan-terracotta/20 flex-shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-artisan-indigo">{title}</h4>
                    <p className="text-xs text-artisan-slate/70">
                      {p.category} • {p.originState} • Stock: {p.stockCount} units
                    </p>
                    {p.giTagStatus.hasGiTag && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded mt-1 inline-block">
                        GI Tagged
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-left sm:text-right">
                    <p className="font-black text-base text-artisan-indigo">{formatPrice(p.price)}</p>
                    <p className="text-[10px] text-emerald-700 font-bold">
                      {p.priceBreakdown.artisanDirectSharePercent}% Direct Share
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedProductForModal(p)}
                    className="p-2.5 rounded-xl bg-white hover:bg-artisan-sand text-artisan-indigo border border-artisan-terracotta/20 font-bold text-xs flex items-center gap-1.5"
                  >
                    <Eye className="w-4 h-4 text-artisan-terracotta" />
                    <span>View Modal</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
