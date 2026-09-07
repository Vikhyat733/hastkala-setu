import React from 'react';
import melaLogo from '../../assets/mela_logo.png';
import { 
  RotateCcw, 
  Store,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { playSoundEffect } from '../../services/voiceAssistant';

interface RuralAppFrameProps {
  children: React.ReactNode;
  onSwitchToWebMarketplace: () => void;
  onResetApp: () => void;
  currentScreenTitle?: string;
}

export const RuralAppFrame: React.FC<RuralAppFrameProps> = ({
  children,
  onSwitchToWebMarketplace,
  onResetApp,
  currentScreenTitle
}) => {
  const { t } = useMarketplace();

  return (
    <div className="min-h-screen bg-[#FAF6ED] flex flex-col font-sans">
      
      {/* Top Navigation Bar — Simple, Responsive, No Phone Simulation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5DAC8] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          
          {/* Left: App Title & Badge */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#FAF6ED] border border-amber-600/30 shadow flex items-center justify-center flex-shrink-0">
              <img src={melaLogo} alt="mela" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-[#1E3A1E] leading-tight truncate">
                  {t('ruralAppTitle')}
                </h2>
                <span className="text-[10px] font-extrabold bg-[#E8F0E3] text-[#3A6B35] px-2 py-0.5 rounded-md border border-[#3A6B35]/30 flex-shrink-0">
                  <Sparkles className="w-3 h-3 inline -mt-0.5 mr-0.5" />
                  {t('ruralAppBadge')}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#7D6E5D] hidden sm:block mt-0.5 truncate">
                {t('ruralAppFrameDesc')}
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            
            <button
              onClick={() => {
                playSoundEffect('tap');
                onResetApp();
              }}
              className="px-3 py-2 rounded-xl bg-[#FAF6ED] hover:bg-[#EAE1D2] text-[#3B3026] text-xs font-black flex items-center gap-1.5 border border-[#D8C9B4] transition-colors"
              title={t('resetApp')}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('resetApp')}</span>
            </button>

            <button
              onClick={() => {
                playSoundEffect('tap');
                onSwitchToWebMarketplace();
              }}
              className="px-3 sm:px-4 py-2 rounded-xl bg-[#D95D39] hover:bg-[#B54424] text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-[#D95D39]/20 transition-all active:scale-95"
            >
              <Store className="w-4 h-4" />
              <span className="hidden sm:inline">{t('switchToMarketplace')}</span>
              <span className="sm:hidden">{t('marketplaceNav')}</span>
            </button>

          </div>

        </div>
      </header>

      {/* Main Application Content — Full Width, Responsive across Mobile, Tablet, Desktop */}
      <main className="flex-1 flex flex-col max-w-6xl w-full mx-auto px-2 sm:px-4 md:px-6 py-2 sm:py-4">
        {children}
      </main>

    </div>
  );
};
