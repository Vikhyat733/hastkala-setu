import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ShieldCheck, Heart, Sparkles, Award, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, t } = useMarketplace();

  return (
    <footer className="bg-artisan-indigo text-slate-200 pt-16 pb-12 border-t-4 border-artisan-terracotta mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Guarantee Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 border-b border-white/10">
          
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">GI Tagged Heritage</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Direct certification from Geographical Indication registered craft clusters across India.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">80%+ Direct Fair-Trade</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Eliminating middlemen to ensure artisans receive dignified wages and direct guild tips.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-300 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Gemini Vision AI Engine</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Empowering rural master craftsmen with multi-language product onboarding and automated fair pricing.
              </p>
            </div>
          </div>

        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#FAF6ED] border border-amber-400/40 shadow flex items-center justify-center">
                <img 
                  src="/mela_logo.png" 
                  alt="mela" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <span className="font-serif font-black text-2xl text-white tracking-wide capitalize">
                {t('appTitle')}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Smart India Hackathon Mela initiative empowering 12,400+ traditional Indian artisans through Multimodal AI Vision, Geographical Indication protection, and direct fair-trade commerce.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-amber-400 mb-3">
              Craft Traditions
            </h5>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>Jaipur Blue Pottery (Rajasthan)</li>
              <li>Bastar Dhokra Casting (Chhattisgarh)</li>
              <li>Mithila Madhubani Painting (Bihar)</li>
              <li>Channapatna Wooden Toys (Karnataka)</li>
              <li>Kutch Rogan Silk Art (Gujarat)</li>
              <li>Bankura Terracotta (West Bengal)</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-amber-400 mb-3">
              Platform Features
            </h5>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button onClick={() => setCurrentView('ai-studio')} className="hover:text-amber-300">
                  ✨ Gemini Vision Studio
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('artisan-dashboard')} className="hover:text-amber-300">
                  🏪 Artisan Seller Hub
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('artisan-stories')} className="hover:text-amber-300">
                  📖 Master Craftsmen Stories
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('my-orders')} className="hover:text-amber-300">
                  📦 Track Orders & Invoices
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-xs uppercase tracking-wider text-amber-400">
              Preserve Indian Crafts
            </h5>
            <p className="text-xs text-slate-300">
              Subscribe for regional craft mela announcements and new GI additions:
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 flex-1"
              />
              <button className="px-3.5 py-2 rounded-xl bg-artisan-terracotta hover:bg-artisan-terracotta-dark text-white font-bold text-xs transition-colors">
                Join
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 mela | Smart India Hackathon. Made with ❤️ for Indian Artisans.</p>
          <div className="flex items-center gap-4">
            <span>GI Registry Recognized</span>
            <span>•</span>
            <span>Vocal For Local</span>
            <span>•</span>
            <span>Atmanirbhar Bharat</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
