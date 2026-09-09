import React from 'react';
import { Volume2, CheckCircle2 } from 'lucide-react';

interface LanguageCardProps {
  name: string;
  nativeName: string;
  isSelected?: boolean;
  isComingSoon?: boolean;
  comingSoonText?: string;
  onSelect: () => void;
  onSpeakerClick?: (e: React.MouseEvent) => void;
}

export const LanguageCard: React.FC<LanguageCardProps> = ({
  name,
  nativeName,
  isSelected = false,
  isComingSoon = false,
  comingSoonText = 'Coming Soon',
  onSelect,
  onSpeakerClick,
}) => {
  return (
    <div
      onClick={isComingSoon ? undefined : onSelect}
      role="button"
      tabIndex={isComingSoon ? -1 : 0}
      onKeyDown={(e) => {
        if (!isComingSoon && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-pressed={isSelected}
      className={`
        relative w-full min-h-[76px] p-4 rounded-2xl
        flex items-center justify-between
        transition-all duration-200 cursor-pointer
        select-none border-2
        ${
          isSelected
            ? 'bg-[#1B4D3E]/5 border-[#1B4D3E] shadow-md shadow-[#1B4D3E]/10'
            : isComingSoon
            ? 'bg-white/60 border-[#E8E2D9] opacity-60 cursor-not-allowed'
            : 'bg-white border-[#E8E2D9] hover:border-[#1B4D3E]/50 shadow-sm'
        }
      `}
    >
      <div className="flex items-center gap-4">
        {/* Speaker Icon for Voice guidance */}
        <button
          type="button"
          aria-label={`Listen to ${nativeName}`}
          onClick={(e) => {
            e.stopPropagation();
            onSpeakerClick?.(e);
          }}
          className={`
            w-11 h-11 rounded-xl flex items-center justify-center
            transition-colors duration-150 flex-shrink-0
            ${isSelected ? 'bg-[#1B4D3E] text-white' : 'bg-[#FAF6F0] text-[#1B4D3E] hover:bg-[#EFE9DF]'}
          `}
        >
          <Volume2 className="w-5 h-5" />
        </button>

        {/* Text Details */}
        <div className="text-left">
          <div className="text-xl font-bold text-[#261D1A] tracking-wide">
            {nativeName}
          </div>
          <div className="text-xs font-medium text-[#6B5E59]">
            {name}
          </div>
        </div>
      </div>

      {/* Right status indicator */}
      <div>
        {isSelected && (
          <div className="flex items-center gap-1.5 text-[#1B4D3E] font-bold text-sm bg-[#1B4D3E]/10 px-3 py-1 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-[#1B4D3E]" />
            <span className="hidden sm:inline">Selected</span>
          </div>
        )}
        {isComingSoon && (
          <span className="text-xs font-semibold text-[#8B2C0D] bg-[#F6E6DF] px-2.5 py-1 rounded-full">
            {comingSoonText}
          </span>
        )}
      </div>
    </div>
  );
};
