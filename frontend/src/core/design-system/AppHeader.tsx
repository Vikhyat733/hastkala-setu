import React from 'react';
import { ArrowLeft, Globe, Monitor, Smartphone } from 'lucide-react';
import { useMela } from '../../context/MelaContext';
import { IconButton } from './IconButton';

export interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  showLanguageToggle?: boolean;
  onLanguageToggle?: () => void;
  currentLanguage?: string;
  rightAction?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title = 'MELA',
  subtitle,
  showBack,
  onBack,
  showLanguageToggle = false,
  onLanguageToggle,
  currentLanguage = 'hi',
  rightAction,
}) => {
  // Automatically show back button whenever onBack handler is provided
  const shouldShowBack = showBack !== undefined ? showBack : Boolean(onBack);
  const { viewMode, setViewMode } = useMela();

  return (
    <header className="sticky top-0 z-30 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#E8E2D9] px-3.5 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {shouldShowBack && (
          <IconButton
            icon={<ArrowLeft className="w-5 h-5 text-[#261D1A]" />}
            label="Back"
            onClick={onBack}
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h1 className="text-base sm:text-lg font-black tracking-tight text-[#1B4D3E] truncate">
              {title}
            </h1>
            <span className="text-[9px] sm:text-[10px] font-bold bg-[#C04B27]/10 text-[#C04B27] px-1.5 sm:px-2 py-0.5 rounded-full border border-[#C04B27]/20 flex-shrink-0">
              SIH26090
            </span>
          </div>
          {subtitle && (
            <p className="text-[11px] sm:text-xs text-[#6B5E59] font-medium leading-none mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        <div className="hidden sm:flex items-center p-1 bg-[#E8E2D9] rounded-xl border border-[#D5C9B5] mr-1">
          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'desktop' ? 'bg-white text-[#1B4D3E] shadow-[0_2px_4px_rgba(0,0,0,0.05)]' : 'text-[#6B5E59] hover:bg-white/50'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            Desktop
          </button>
          <button
            onClick={() => setViewMode('android')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'android' ? 'bg-white text-[#1B4D3E] shadow-[0_2px_4px_rgba(0,0,0,0.05)]' : 'text-[#6B5E59] hover:bg-white/50'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Android
          </button>
        </div>

        {showLanguageToggle && (
          <button
            type="button"
            onClick={onLanguageToggle}
            aria-label="Change Language"
            className="
              min-h-[38px] px-2.5 sm:px-3 py-1.5 rounded-xl
              bg-white border border-[#E0D8CE] hover:border-[#1B4D3E]
              text-xs font-bold text-[#1B4D3E] flex items-center gap-1.5
              transition-colors active:scale-95 shadow-2xs cursor-pointer
            "
          >
            <Globe className="w-3.5 h-3.5 text-[#C04B27]" />
            <span className="font-bold text-[11px]">
              {currentLanguage === 'hi'
                ? 'हिन्दी'
                : currentLanguage === 'mr'
                ? 'मराठी'
                : currentLanguage === 'bn'
                ? 'বাংলা'
                : 'English'}
            </span>
          </button>
        )}
        {rightAction}
      </div>
    </header>
  );
};

export const MelaPageHeader = AppHeader;
export const MelaBackHeader = AppHeader;

