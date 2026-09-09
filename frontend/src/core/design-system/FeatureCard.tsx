import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  onClick: () => void;
  accentColor?: string;
  isDominant?: boolean;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  subtitle,
  badge,
  onClick,
  accentColor = '#1B4D3E',
  isDominant = false,
}) => {
  if (isDominant) {
    return (
      <button
        onClick={onClick}
        className="
          w-full text-left p-5 md:p-6 rounded-3xl
          bg-gradient-to-br from-[#1B4D3E] to-[#143B30]
          text-white shadow-xl shadow-[#1B4D3E]/25
          border border-[#2C5E43]
          transition-all duration-200 active:scale-[0.98]
          hover:shadow-2xl hover:shadow-[#1B4D3E]/30
          group relative overflow-hidden select-none
        "
      >
        {/* Subtle decorative background circle */}
        <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center text-3xl flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform">
            {icon}
          </div>
          <div className="flex-1">
            {badge && (
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-[#C04B27] text-white px-2.5 py-0.5 rounded-full mb-1">
                {badge}
              </span>
            )}
            <h2 className="text-xl md:text-2xl font-black tracking-tight leading-snug">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-emerald-100 font-medium mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white flex-shrink-0">
            →
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="
        w-full text-left p-4 rounded-2xl
        bg-white border-2 border-[#EAE3DA] hover:border-[#C04B27]/40
        shadow-sm hover:shadow-md
        transition-all duration-200 active:scale-[0.98]
        flex items-center gap-3 group select-none min-h-[80px]
      "
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform group-hover:scale-105"
        style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-[#261D1A] leading-snug group-hover:text-[#C04B27] transition-colors">
          {title}
        </div>
        {subtitle && (
          <div className="text-[11px] text-[#6B5E59] leading-snug mt-0.5 line-clamp-2">
            {subtitle}
          </div>
        )}
      </div>
      <div className="text-gray-400 group-hover:text-[#C04B27] transition-colors text-lg">
        ›
      </div>
    </button>
  );
};
