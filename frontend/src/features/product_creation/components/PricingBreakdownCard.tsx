import React from 'react';
import { Sparkles, CheckCircle, Info, Calculator, Tag } from 'lucide-react';

interface PricingBreakdownCardProps {
  suggestedPrice: number;
  materialCost: number;
  makingCost: number;
  estimatedProfit: number;
  explanation: string;
  isCustomPrice?: boolean;
  finalPrice?: number;
  language?: 'hi' | 'en';
}

export const PricingBreakdownCard: React.FC<PricingBreakdownCardProps> = ({
  suggestedPrice,
  materialCost,
  makingCost,
  estimatedProfit,
  explanation,
  isCustomPrice,
  finalPrice,
  language = 'hi',
}) => {
  const displayPrice = isCustomPrice && finalPrice && finalPrice > 0 ? finalPrice : suggestedPrice;
  const totalCost = materialCost + makingCost;
  const dynamicProfit = Math.max(0, displayPrice - totalCost);
  const profitMargin = displayPrice > 0 ? Math.round((dynamicProfit / displayPrice) * 100) : 0;

  const matPercent = displayPrice > 0 ? Math.min(100, (materialCost / displayPrice) * 100) : 0;
  const makePercent = displayPrice > 0 ? Math.min(100 - matPercent, (makingCost / displayPrice) * 100) : 0;
  const profitPercent = displayPrice > 0 ? Math.max(0, 100 - matPercent - makePercent) : 0;

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border-2 border-[#E0D8CE] shadow-md space-y-4">
      {/* Big Hero Suggested / Active Price */}
      <div className="text-center py-4 bg-gradient-to-b from-[#FAF6F0] to-[#F3ECE0] rounded-2xl border border-[#E8E2D9]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B4D3E]/10 text-[#1B4D3E] text-xs font-black uppercase tracking-wider mb-2">
          {isCustomPrice ? (
            <>
              <Tag className="w-3.5 h-3.5 text-[#C04B27]" />
              {language === 'hi' ? 'आपकी चुनी हुई कीमत' : 'Your Custom Price'}
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-[#C04B27]" />
              {language === 'hi' ? 'मेला की सुझाई गई कीमत' : 'MELA Suggested Price'}
            </>
          )}
        </div>
        <div className="text-4xl md:text-5xl font-black text-[#1B4D3E] tracking-tight">
          ₹{displayPrice}
        </div>
        <p className="text-xs font-semibold text-[#6B5E59] mt-1.5 px-4 flex items-center justify-center gap-1.5 text-center leading-relaxed">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{explanation}</span>
        </p>
      </div>

      {/* Visual Breakdown Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-[#6B5E59]">
          <span>{language === 'hi' ? `कुल लागत: ₹${totalCost}` : `Total Cost: ₹${totalCost}`}</span>
          <span className="text-emerald-700 font-black">
            {language === 'hi' ? `अनुमानित लाभ: ₹${dynamicProfit} (${profitMargin}%)` : `Est. Profit: ₹${dynamicProfit} (${profitMargin}%)`}
          </span>
        </div>
        <div className="h-3.5 w-full bg-stone-100 rounded-full overflow-hidden flex shadow-inner">
          <div
            className="bg-amber-500 transition-all duration-500"
            style={{ width: `${matPercent}%` }}
            title={language === 'hi' ? 'सामग्री खर्च' : 'Material Cost'}
          />
          <div
            className="bg-orange-500 transition-all duration-500"
            style={{ width: `${makePercent}%` }}
            title={language === 'hi' ? 'कारीगरी खर्च' : 'Making Cost'}
          />
          <div
            className="bg-emerald-600 transition-all duration-500"
            style={{ width: `${profitPercent}%` }}
            title={language === 'hi' ? 'अनुमानित लाभ' : 'Estimated Profit'}
          />
        </div>
      </div>

      {/* Clear Breakdown List */}
      <div className="divide-y divide-[#F0EBE1] text-xs font-medium space-y-0.5">
        <div className="flex justify-between items-center py-2">
          <span className="flex items-center gap-2 text-[#6B5E59]">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            {language === 'hi' ? 'सामग्री खर्च (Raw Materials)' : 'Raw Material Cost'}
          </span>
          <span className="font-bold text-[#261D1A]">₹{materialCost}</span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="flex items-center gap-2 text-[#6B5E59]">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            {language === 'hi' ? 'कारीगरी / मेहनत (Labor & Making)' : 'Labor & Crafting Cost'}
          </span>
          <span className="font-bold text-[#261D1A]">₹{makingCost}</span>
        </div>

        <div className="flex justify-between items-center py-2.5 bg-emerald-50/70 px-3 -mx-3 rounded-xl">
          <span className="flex items-center gap-2 text-emerald-800 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            {language === 'hi' ? 'आपका अनुमानित मुनाफा (Artisan Profit)' : 'Estimated Artisan Profit'}
          </span>
          <span className="font-black text-emerald-800 text-sm">₹{dynamicProfit}</span>
        </div>
      </div>

      <div className="text-[11px] text-[#8C7E77] bg-[#FAF6F0] p-3 rounded-xl border border-[#EAE2D5] flex items-start gap-2">
        <Info className="w-4 h-4 text-[#C04B27] flex-shrink-0 mt-0.5" />
        <span>
          {language === 'hi'
            ? 'यह मूल्य उत्पाद की सामग्री व कारीगरी के आधार पर तय किया गया है ताकि उचित मुनाफा मिल सके।'
            : 'This price is calculated from your product details and estimated making costs to ensure a sustainable profit.'}
        </span>
      </div>
    </div>
  );
};
