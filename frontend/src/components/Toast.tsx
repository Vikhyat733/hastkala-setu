import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useMarketplace();

  if (!toastMessage) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-artisan-terracotta flex-shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
  };

  const borderStyles = {
    success: 'border-emerald-500/30 bg-emerald-50/95 text-emerald-950',
    info: 'border-artisan-terracotta/30 bg-amber-50/95 text-artisan-indigo',
    warning: 'border-amber-500/30 bg-amber-50/95 text-amber-950'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short transition-all duration-300">
      <div
        className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl backdrop-blur-md border ${
          borderStyles[toastMessage.type]
        }`}
      >
        {icons[toastMessage.type]}
        <p className="text-sm font-medium pr-2">{toastMessage.text}</p>
      </div>
    </div>
  );
};
