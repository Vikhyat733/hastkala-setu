import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Battery, 
  Signal, 
  Smartphone, 
  Maximize2, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  ArrowLeft,
  Store,
  Sparkles,
  Info
} from 'lucide-react';
import { VALUE_PROPOSITIONS } from './data/ruralAppDefaults';
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
  currentScreenTitle = 'हुनर से बाजार तक'
}) => {
  const [currentTime, setCurrentTime] = useState('10:25');
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#EDE5D8] py-4 px-2 sm:px-6 flex flex-col items-center justify-between font-sans">
      
      {/* Top Demo Bar for Hackathon Judges & Evaluators */}
      <div className="w-full max-w-5xl mb-4 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-[#D8C9B4] px-4 py-3 shadow-md flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: App Title & Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#FAF6ED] border border-amber-600/30 shadow flex items-center justify-center flex-shrink-0">
            <img src="/mela_logo.png" alt="mela" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-[#1E3A1E] leading-tight">
                mela • हुनर से बाज़ार तक (Artisan App)
              </h2>
              <span className="text-[10px] font-extrabold bg-[#E8F0E3] text-[#3A6B35] px-2 py-0.5 rounded-md border border-[#3A6B35]/30">
                AI Onboarding Studio
              </span>
            </div>
            <p className="text-xs font-semibold text-[#7D6E5D] hidden sm:block">
              Designed specifically for low-literacy & rural artisans (Zero typing • Voice-first • 1-Click AI Listing)
            </p>
          </div>
        </div>

        {/* Right: Actions (Switch to Web Marketplace & Reset App) */}
        <div className="flex items-center gap-2">
          
          <button
            onClick={() => {
              playSoundEffect('tap');
              onResetApp();
            }}
            className="px-3 py-2 rounded-xl bg-[#FAF6ED] hover:bg-[#EAE1D2] text-[#3B3026] text-xs font-black flex items-center gap-1.5 border border-[#D8C9B4] transition-colors"
            title="शुरुआत से शुरू करें"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">रीसेट करें</span>
          </button>

          <button
            onClick={() => {
              playSoundEffect('tap');
              onSwitchToWebMarketplace();
            }}
            className="px-4 py-2 rounded-xl bg-[#D95D39] hover:bg-[#B54424] text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-[#D95D39]/20 transition-all active:scale-95"
          >
            <Store className="w-4 h-4" />
            <span>खरीदार बाज़ार पोर्टल (Web Marketplace)</span>
          </button>

        </div>

      </div>

      {/* SMARTPHONE FRAME CONTAINER */}
      <div className="relative my-auto flex flex-col items-center">
        
        {/* Realistic Phone Body / Hardware Bezel */}
        <div className={`relative bg-[#1A1A1A] rounded-[48px] p-3.5 sm:p-4 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.1)] border-4 border-[#333333] transition-all duration-300 ${
          isFullscreenMode ? 'w-full max-w-[420px]' : 'w-[360px] sm:w-[390px]'
        }`}>
          
          {/* Hardware Buttons on sides (Simulated) */}
          <div className="hidden sm:block absolute -left-5 top-28 w-1 h-12 bg-[#2D2D2D] rounded-l-md"></div>
          <div className="hidden sm:block absolute -left-5 top-44 w-1 h-12 bg-[#2D2D2D] rounded-l-md"></div>
          <div className="hidden sm:block absolute -right-5 top-32 w-1 h-16 bg-[#2D2D2D] rounded-r-md"></div>

          {/* Screen Glass Container */}
          <div className="relative rounded-[36px] overflow-hidden bg-[#FAF6ED] h-[680px] sm:h-[720px] flex flex-col border border-black/20 shadow-inner">
            
            {/* Top Smartphone Status Bar */}
            <div className="bg-[#FAF6ED] px-6 pt-3 pb-1 flex items-center justify-between text-xs font-bold text-[#2C241E] z-30 select-none">
              
              {/* Time */}
              <span className="font-extrabold text-[13px]">{currentTime}</span>

              {/* Dynamic Camera Punch-Hole & Speaker */}
              <div className="w-24 h-4.5 bg-black rounded-full flex items-center justify-center gap-2 px-2 shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-neutral-700"></div>
                <div className="w-8 h-1 bg-neutral-800 rounded-full"></div>
              </div>

              {/* Network / Battery Icons */}
              <div className="flex items-center gap-1.5 text-[#333]">
                <Signal className="w-3.5 h-3.5" />
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4" />
              </div>
            </div>

            {/* Application Inside Viewport */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
              {children}
            </div>

            {/* Bottom Android / iOS Home Indicator Pill */}
            <div className="bg-[#FAF6ED] pb-2 pt-1 flex justify-center z-30 select-none">
              <div className="w-32 h-1 bg-neutral-400/80 rounded-full"></div>
            </div>

          </div>

        </div>

      </div>

      {/* BOTTOM VALUE PROPOSITIONS STRIP (Matching the mockup footer) */}
      <div className="w-full max-w-5xl mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-[#D8C9B4] shadow-sm">
          {VALUE_PROPOSITIONS.map((prop, idx) => (
            <div key={idx} className="flex items-start gap-3 p-2 rounded-xl bg-[#FAF6ED]/70 border border-[#E5DAC8]/60">
              <span className="text-2xl flex-shrink-0">{prop.icon}</span>
              <div>
                <h4 className="text-xs font-black text-[#1E3A1E] leading-tight">
                  {prop.title}
                </h4>
                <p className="text-[11px] font-semibold text-[#7D6E5D] mt-0.5 leading-snug">
                  {prop.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
