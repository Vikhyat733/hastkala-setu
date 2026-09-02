import React, { useState } from 'react';
import { Check, ArrowRight, Volume2, Globe } from 'lucide-react';
import { speakText, playSoundEffect } from '../../../services/voiceAssistant';

interface WelcomeScreenProps {
  onProceed: () => void;
  selectedLanguage: string;
  onSelectLanguage: (lang: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onProceed,
  selectedLanguage,
  onSelectLanguage
}) => {
  const [showOtherLangs, setShowOtherLangs] = useState(false);

  const handleLangPick = (lang: string, label: string) => {
    playSoundEffect('tap');
    onSelectLanguage(lang);
    if (lang === 'hi') {
      speakText('नमस्ते! मेला ऐप में आपका स्वागत है।');
    } else if (lang === 'en') {
      speakText('Welcome to Mela!', 'en-IN');
    }
  };

  const otherLanguages = [
    { code: 'mr', name: 'मराठी' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'gu', name: 'ગુજરાતી' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'kn', name: 'ಕನ್ನಡ' }
  ];

  return (
    <div className="min-h-full flex flex-col justify-between bg-[#FAF6ED] text-[#2C241E] select-none">
      
      {/* Top Rural Art Illustrated Banner */}
      <div>
        <div className="relative h-48 sm:h-52 w-full overflow-hidden rounded-b-3xl bg-gradient-to-b from-[#E6F0DC] via-[#D2E7BE] to-[#B8DA9B] shadow-sm border-b border-[#A5CD84]">
          {/* Subtle Village Scene Vector Graphics */}
          <div className="absolute top-4 right-6 w-14 h-14 rounded-full bg-[#FFE57F]/80 blur-[1px] animate-pulse-slow"></div>
          
          {/* Flying Birds */}
          <div className="absolute top-6 left-16 text-[#4A5D3E] text-xs font-serif font-black tracking-widest opacity-80">
            🕊️ 🕊️
          </div>
          <div className="absolute top-10 left-32 text-[#4A5D3E] text-xs opacity-70">
            🕊️
          </div>

          {/* Rural Hills & Village Graphics */}
          <svg className="absolute bottom-0 w-full h-32" viewBox="0 0 400 120" preserveAspectRatio="none" fill="none">
            {/* Background rolling hills */}
            <path d="M0,70 Q100,30 200,60 T400,50 L400,120 L0,120 Z" fill="#93C572" opacity="0.6" />
            <path d="M0,85 Q120,55 260,80 T400,75 L400,120 L0,120 Z" fill="#6B9E49" opacity="0.8" />
            
            {/* Village Huts & Trees */}
            <g transform="translate(40, 45) scale(0.65)">
              {/* Tree */}
              <circle cx="20" cy="20" r="18" fill="#2E6930" />
              <rect x="17" y="28" width="6" height="20" fill="#5D4037" />
            </g>

            <g transform="translate(180, 40) scale(0.7)">
              {/* Hut */}
              <polygon points="30,10 5,35 55,35" fill="#C0392B" />
              <rect x="10" y="35" width="40" height="25" fill="#F5EFE0" stroke="#8D6E63" strokeWidth="1" />
              <rect x="25" y="42" width="10" height="18" fill="#5D4037" />
            </g>

            <g transform="translate(300, 30) scale(0.85)">
              {/* Big Tree */}
              <circle cx="30" cy="25" r="24" fill="#1B4D21" />
              <rect x="26" y="35" width="8" height="30" fill="#4E342E" />
            </g>
          </svg>

          {/* Title Overlay with Traditional Rural Aesthetic */}
          <div className="absolute bottom-2 left-0 right-0 px-4 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg border-2 border-white/80 bg-[#FAF6ED] mb-1.5 flex items-center justify-center">
              <img src="/mela_logo.png" alt="mela logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-xl font-black text-[#1E3A1E] tracking-tight drop-shadow-sm font-sans leading-tight">
              mela • हुनर से बाज़ार तक
            </h1>
            <p className="text-[11px] font-bold text-[#3D5C35] mt-0.5">
              आपका सामान, अब पूरे देश के सामने
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-5 py-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-[#3B3026] flex items-center gap-2">
              <span>अपनी भाषा चुनें</span>
              <span className="text-xs text-[#7D6E5D] font-normal">(Choose Language)</span>
            </h2>
            <button 
              onClick={() => {
                playSoundEffect('tap');
                speakText('कृपया अपनी पसंद की भाषा चुनें');
              }}
              className="p-1.5 rounded-full bg-[#EADCC9]/60 hover:bg-[#EADCC9] text-[#5A4838] transition-colors"
              title="बोलकर सुनें"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Language Selection Tiles */}
          <div className="space-y-3">
            
            {/* Hindi (Primary Active by default) */}
            <button
              onClick={() => handleLangPick('hi', 'हिंदी')}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left shadow-sm ${
                selectedLanguage === 'hi'
                  ? 'bg-[#3A6B35] border-[#2C5528] text-white shadow-[#3A6B35]/20 shadow-md font-bold'
                  : 'bg-white border-[#E5DAC8] text-[#3B3026] hover:border-[#3A6B35]/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🇮🇳</span>
                <div>
                  <span className="text-lg font-extrabold block">हिंदी</span>
                  <span className={`text-xs ${selectedLanguage === 'hi' ? 'text-white/80' : 'text-[#8A7B6E]'}`}>
                    (Hindi)
                  </span>
                </div>
              </div>
              {selectedLanguage === 'hi' && (
                <div className="w-7 h-7 rounded-full bg-white text-[#3A6B35] flex items-center justify-center font-bold shadow">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </button>

            {/* English */}
            <button
              onClick={() => handleLangPick('en', 'English')}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left shadow-sm ${
                selectedLanguage === 'en'
                  ? 'bg-[#3A6B35] border-[#2C5528] text-white shadow-[#3A6B35]/20 shadow-md font-bold'
                  : 'bg-white border-[#E5DAC8] text-[#3B3026] hover:border-[#3A6B35]/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🌐</span>
                <div>
                  <span className="text-lg font-bold block">English</span>
                  <span className={`text-xs ${selectedLanguage === 'en' ? 'text-white/80' : 'text-[#8A7B6E]'}`}>
                    (अंग्रेज़ी)
                  </span>
                </div>
              </div>
              {selectedLanguage === 'en' && (
                <div className="w-7 h-7 rounded-full bg-white text-[#3A6B35] flex items-center justify-center font-bold shadow">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </button>

            {/* Other Indian Languages Collapsible / Modal */}
            <div className="pt-1">
              <button
                onClick={() => {
                  playSoundEffect('tap');
                  setShowOtherLangs(!showOtherLangs);
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all text-left bg-white ${
                  showOtherLangs || (selectedLanguage !== 'hi' && selectedLanguage !== 'en')
                    ? 'border-[#3A6B35]/60 bg-[#F4EDE0]'
                    : 'border-[#E5DAC8] text-[#5A4838]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-[#3A6B35]" />
                  <span className="text-base font-semibold text-[#3B3026]">
                    {selectedLanguage !== 'hi' && selectedLanguage !== 'en'
                      ? otherLanguages.find(l => l.code === selectedLanguage)?.name || 'अन्य भाषा'
                      : 'अन्य भाषा (Other Regional Languages)'}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#3A6B35]">
                  {showOtherLangs ? 'बंद करें ▲' : 'खोलें ▼'}
                </span>
              </button>

              {showOtherLangs && (
                <div className="grid grid-cols-2 gap-2 mt-2 p-3 bg-white rounded-2xl border border-[#E5DAC8] shadow-inner animate-in fade-in duration-200">
                  {otherLanguages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        handleLangPick(lang.code, lang.name);
                        setShowOtherLangs(false);
                      }}
                      className={`p-2.5 rounded-xl text-center font-bold text-sm transition-colors border ${
                        selectedLanguage === lang.code
                          ? 'bg-[#3A6B35] text-white border-[#2C5528]'
                          : 'bg-[#FAF6ED] text-[#3B3026] border-[#EADCC9] hover:bg-[#EADCC9]'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Action Section with Big Proceed Button */}
      <div className="p-5 bg-white/90 backdrop-blur-sm border-t border-[#E5DAC8]">
        <button
          onClick={() => {
            playSoundEffect('tap');
            onProceed();
          }}
          className="w-full py-4 px-6 rounded-2xl bg-[#3A6B35] hover:bg-[#2F582B] active:scale-[0.98] text-white font-extrabold text-lg flex items-center justify-center gap-3 shadow-lg shadow-[#3A6B35]/30 transition-all"
        >
          <span>आगे बढ़ें</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
        <p className="text-center text-[11px] text-[#8A7B6E] font-medium mt-2">
          सरल • सुरक्षित • सीधे आपके बैंक खाते में कमाई
        </p>
      </div>

    </div>
  );
};
