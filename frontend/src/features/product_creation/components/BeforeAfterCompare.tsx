import React, { useState } from 'react';
import { SlidersHorizontal, Image as ImageIcon, Check, Info } from 'lucide-react';

interface BeforeAfterCompareProps {
  originalImage: string;
  enhancedImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  operations?: string[];
  isDevFallback?: boolean;
  wasEnhanced?: boolean;
}

export const BeforeAfterCompare: React.FC<BeforeAfterCompareProps> = ({
  originalImage,
  enhancedImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  operations = [],
  isDevFallback = true,
  wasEnhanced = false,
}) => {
  const [activeView, setActiveView] = useState<'after' | 'before' | 'split'>('after');
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  const displayEnhanced = enhancedImage || originalImage;

  return (
    <div className="space-y-4">
      {/* View Toggle Pill */}
      <div className="flex bg-[#EFE9DF] p-1 rounded-2xl">
        <button
          type="button"
          onClick={() => setActiveView('after')}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeView === 'after'
              ? 'bg-[#1B4D3E] text-white shadow-sm'
              : 'text-[#6B5E59] hover:text-[#261D1A]'
          }`}
        >
          {wasEnhanced ? (
            <Check className="w-3.5 h-3.5 text-emerald-300" />
          ) : (
            <ImageIcon className="w-3.5 h-3.5" />
          )}
          {afterLabel}
        </button>

        <button
          type="button"
          onClick={() => setActiveView('before')}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeView === 'before'
              ? 'bg-white text-[#261D1A] shadow-sm'
              : 'text-[#6B5E59] hover:text-[#261D1A]'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          {beforeLabel}
        </button>

        <button
          type="button"
          onClick={() => setActiveView('split')}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeView === 'split'
              ? 'bg-[#C04B27] text-white shadow-sm'
              : 'text-[#6B5E59] hover:text-[#261D1A]'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          स्लाइडर
        </button>
      </div>

      {/* Image Display Area */}
      <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-stone-100 border-2 border-[#E0D8CE] shadow-md select-none">
        {/* AFTER view — the actual enhanced/processed image */}
        {activeView === 'after' && (
          <div className="relative w-full h-full">
            <img
              src={displayEnhanced}
              alt={afterLabel}
              className="w-full h-full object-cover"
            />
            {wasEnhanced && (
              <div className="absolute top-3 right-3 bg-[#1B4D3E]/90 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Check className="w-3 h-3 text-emerald-300" />
                Enhanced
              </div>
            )}
          </div>
        )}

        {/* BEFORE view — the user's actual original upload */}
        {activeView === 'before' && (
          <div className="relative w-full h-full">
            <img
              src={originalImage}
              alt={beforeLabel}
              className="w-full h-full object-cover"
              style={{ filter: wasEnhanced ? 'saturate(0.8) brightness(0.92)' : 'none' }}
            />
            <div className="absolute top-3 left-3 bg-black/70 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
              Original
            </div>
          </div>
        )}

        {/* SPLIT slider view */}
        {activeView === 'split' && (
          <div className="relative w-full h-full">
            {/* Enhanced on right */}
            <img
              src={displayEnhanced}
              alt="Enhanced"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Original on left, clipped */}
            <div
              className="absolute inset-0 overflow-hidden border-r-2 border-white shadow-2xl"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={originalImage}
                alt="Original"
                className="absolute inset-0 h-full object-cover"
                style={{ width: '100%', maxWidth: 'none', filter: wasEnhanced ? 'saturate(0.8) brightness(0.92)' : 'none' }}
              />
              <span className="absolute top-3 left-3 bg-black/80 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                Before
              </span>
            </div>
            <span className="absolute top-3 right-3 bg-[#1B4D3E]/90 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
              After
            </span>
            {/* Invisible range input for dragging */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 opacity-0 w-full h-full cursor-ew-resize z-20"
              aria-label="Before/After slider"
            />
            {/* Visual handle */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-8 h-8 -ml-4 bg-white text-[#1B4D3E] rounded-full shadow-lg flex items-center justify-center pointer-events-none z-10 border-2 border-[#1B4D3E] text-sm font-bold"
              style={{ left: `${sliderPosition}%` }}
            >
              ↔
            </div>
          </div>
        )}
      </div>

      {/* Operations Applied — honest accurate labels */}
      {operations.length > 0 && (
        <div className="p-3.5 bg-white rounded-2xl border border-[#E8E2D9] space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B5E59] flex items-center gap-1">
            {isDevFallback ? (
              <>
                <Info className="w-3.5 h-3.5 text-amber-500" />
                <span>Photo Corrections Applied (Dev Mode):</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Enhancements Applied:</span>
              </>
            )}
          </p>
          <ul className="space-y-1">
            {operations.map((op, idx) => (
              <li key={idx} className="text-xs text-[#6B5E59] flex items-start gap-2 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] mt-1.5 flex-shrink-0" />
                {op}
              </li>
            ))}
          </ul>
          {isDevFallback && (
            <p className="text-[10px] text-[#8C7E77] italic pt-1 border-t border-[#EFE9DF]">
              Development mode: Standard photo filters applied. Production: AI background removal & studio processing.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
