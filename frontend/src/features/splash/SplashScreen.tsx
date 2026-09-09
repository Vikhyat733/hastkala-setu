import React, { useEffect } from 'react';
import { useMela } from '../../context/MelaContext';
import melaLogo from '../../assets/mela_logo.png';

export const SplashScreen: React.FC = () => {
  const { navigate, t } = useMela();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/language');
    }, 2200);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-between p-8 text-center select-none relative overflow-hidden">
      {/* Background Indian geometric craft motif */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#1B4D3E] via-[#C04B27] to-[#F2A33A]" />

      <div className="w-full pt-4 flex justify-center">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#6B5E59] bg-[#EAE3DA]/60 px-3.5 py-1 rounded-full border border-[#D5CABE]">
          Smart India Hackathon 2026 • SIH26090
        </span>
      </div>

      {/* Main Logo & Identity Section */}
      <div className="flex flex-col items-center max-w-sm mx-auto">
        <div className="relative mb-6">
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-3xl bg-white shadow-xl shadow-[#C04B27]/15 border-2 border-[#E0D8CE] p-3 flex items-center justify-center">
            <img
              src={melaLogo}
              alt="MELA Logo"
              className="w-full h-full object-contain"
            />
          </div>
          {/* Subtle pulsating emblem */}
          <div className="absolute -bottom-2 -right-2 bg-[#1B4D3E] text-white p-2 rounded-xl text-lg shadow-md">
            🏺
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-[#1B4D3E] tracking-tight mb-2">
          {t.splash.title}
        </h1>

        <p className="text-sm md:text-base font-bold text-[#C04B27] uppercase tracking-wider mb-2">
          {t.splash.tagline}
        </p>

        <p className="text-sm font-medium text-[#6B5E59] max-w-xs leading-relaxed">
          "{t.splash.subtitle}"
        </p>
      </div>

      {/* Loading indicator & footer */}
      <div className="w-full max-w-xs pb-4 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1B4D3E] animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-[#C04B27] animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-[#F2A33A] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <p className="text-xs font-semibold text-[#8C7E77]">
          {t.common.loading}
        </p>
      </div>
    </div>
  );
};
