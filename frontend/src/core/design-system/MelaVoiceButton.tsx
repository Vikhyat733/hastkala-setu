import React from 'react';
import { Mic } from 'lucide-react';

interface MelaVoiceButtonProps {
  label: string;
  subLabel?: string;
  onClick: () => void;
  isListening?: boolean;
}

export const MelaVoiceButton: React.FC<MelaVoiceButtonProps> = ({
  label,
  subLabel,
  onClick,
  isListening = false,
}) => {
  return (
    <button
      onClick={onClick}
      aria-label={`${label} - Voice Assistant`}
      className={`
        w-full p-4 rounded-2xl
        border-2 transition-all duration-200 active:scale-[0.98]
        flex items-center gap-4 text-left select-none
        ${
          isListening
            ? 'bg-[#C04B27]/10 border-[#C04B27] shadow-md shadow-[#C04B27]/15 animate-pulse'
            : 'bg-gradient-to-r from-[#FAF6F0] to-[#FFFBF5] border-[#C04B27]/30 hover:border-[#C04B27] shadow-sm'
        }
      `}
    >
      <div
        className={`
          w-13 h-13 min-w-[52px] min-h-[52px] rounded-full
          flex items-center justify-center text-white
          shadow-md transition-transform
          ${isListening ? 'bg-[#C04B27] scale-105' : 'bg-[#C04B27] hover:bg-[#A83E1E]'}
        `}
      >
        <Mic className="w-6 h-6 text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-base md:text-lg font-bold text-[#261D1A]">
            {label}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider bg-[#C04B27]/15 text-[#C04B27] px-2 py-0.5 rounded-md">
            Voice
          </span>
        </div>
        {subLabel && (
          <p className="text-xs md:text-sm text-[#6B5E59] mt-0.5 truncate">
            {subLabel}
          </p>
        )}
      </div>

      <div className="w-8 h-8 rounded-full bg-white border border-[#E0D8CE] flex items-center justify-center text-[#C04B27] font-bold text-sm">
        🎙️
      </div>
    </button>
  );
};
