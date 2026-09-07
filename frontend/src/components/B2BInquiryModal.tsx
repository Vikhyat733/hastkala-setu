import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Product } from '../types';
import { X, Building2, CheckCircle2, Clock, Truck, ShieldCheck, ArrowRight } from 'lucide-react';

interface B2BInquiryModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const B2BInquiryModal: React.FC<B2BInquiryModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const { submitB2BInquiry, formatPrice, activeLanguage, t } = useMarketplace();

  const [quantity, setQuantity] = useState(100);
  const [targetDate, setTargetDate] = useState('2026-04-30');
  const [buyerName, setBuyerName] = useState('');
  const [buyerOrg, setBuyerOrg] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerType, setBuyerType] = useState<'hotel' | 'boutique' | 'corporate_gift' | 'retailer' | 'interior_designer' | 'exporter' | 'other'>('hotel');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const estimatedUnitPrice = product 
    ? Math.round(product.price * 0.82) // Volume fair wholesale price
    : 1200;
  const estimatedTotal = estimatedUnitPrice * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerOrg || !buyerEmail || !buyerPhone) return;

    submitB2BInquiry({
      productId: product?.id,
      productTitle: product ? (product.title[activeLanguage] || product.title.en) : undefined,
      craftCategory: product?.category || 'handicraft',
      artisanId: product?.artisan.id,
      artisanName: product?.artisan.name,
      quantity,
      targetDeliveryDate: targetDate,
      buyerName,
      buyerOrganization: buyerOrg,
      buyerEmail,
      buyerPhone,
      buyerType,
      customizationNotes: notes
    });

    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#2A1810] to-[#5C2416] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">{t('b2bWholesaleTitle')}</h3>
              <p className="text-xs text-amber-100/80">
                {t('b2bWholesaleSubtitle')}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-[#1B2A4A]">
                {t('b2bSuccess')}
              </h4>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                {t('b2bSuccessMsg')}
              </p>
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#1B2A4A] text-white text-xs font-bold hover:bg-black transition-all"
                >
                  {t('done')}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Product Reference */}
              {product && (
                <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <img 
                    src={product.images[0]} 
                    alt={product.title.en} 
                    className="w-14 h-14 rounded-xl object-cover" 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#1B2A4A] truncate">{product.title[activeLanguage] || product.title.en}</p>
                    <p className="text-[11px] text-stone-500">{product.artisan.name} • {product.originRegion}, {product.originState}</p>
                    <p className="text-xs font-black text-emerald-700 mt-0.5">
                      {t('wholesaleEstPrice')} ~{formatPrice(estimatedUnitPrice)} / {t('pieces')}
                    </p>
                  </div>
                </div>
              )}

              {/* Volume & Delivery Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t('b2bQuantity')} *
                  </label>
                  <input
                    type="number"
                    min={25}
                    step={25}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm font-bold text-[#1B2A4A] focus:outline-none focus:ring-2 focus:ring-[#B84A1C]/30"
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">{t('minWholesaleQty')}</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t('b2bTargetDate')} *
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm text-[#1B2A4A] focus:outline-none focus:ring-2 focus:ring-[#B84A1C]/30"
                  />
                </div>
              </div>

              {/* Buyer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t('b2bBuyerName')} *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Verma"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-[#1B2A4A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t('b2bOrg')} *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Heritage Resorts"
                    value={buyerOrg}
                    onChange={(e) => setBuyerOrg(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-[#1B2A4A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t('b2bEmail')} *
                  </label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-[#1B2A4A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t('b2bPhone')} *
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-[#1B2A4A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Buyer Category */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t('buyerCategory')}
                </label>
                <select
                  value={buyerType}
                  onChange={(e) => setBuyerType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-[#1B2A4A] focus:outline-none"
                >
                  <option value="hotel">Hotel / Hospitality</option>
                  <option value="boutique">Boutique / Retailer</option>
                  <option value="corporate_gift">Corporate Gifting</option>
                  <option value="interior_designer">Interior Designer</option>
                  <option value="exporter">Handicraft Exporter</option>
                  <option value="other">Other Institutional Buyer</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t('b2bCustomization')}
                </label>
                <textarea
                  rows={2}
                  placeholder="..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-[#1B2A4A] focus:outline-none"
                />
              </div>

              {/* Estimated Total Card */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-[#FAF6ED] rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-stone-600 block">{t('estimatedWholesaleTotal')}</span>
                  <span className="text-xl font-black text-[#1B2A4A]">{formatPrice(estimatedTotal)}</span>
                </div>
                <div className="text-right text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{t('giFairTradeGuarantee')}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#B84A1C] to-amber-700 text-white font-bold text-sm shadow-md hover:scale-101 transition-all flex items-center justify-center gap-2"
              >
                <span>🏢 {t('b2bSubmit')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          )}
        </div>
      </div>
    </div>
  );
};
