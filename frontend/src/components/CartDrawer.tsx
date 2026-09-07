import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  HeartHandshake, 
  ArrowRight, 
  Sparkles, 
  Truck, 
  Tag, 
  Check 
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    artisanTip,
    setArtisanTip,
    formatPrice,
    setIsCheckoutOpen,
    activeLanguage,
    t
  } = useMarketplace();

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal > 2000 || subtotal === 0 ? 0 : 99;
  const grandTotal = Math.max(0, subtotal + artisanTip + deliveryFee - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (couponCode.toUpperCase() === 'HASTKALA2026' || couponCode.toUpperCase() === 'DIWALI100') {
      const discount = Math.round(subtotal * 0.15);
      setDiscountAmount(discount);
      setCouponApplied(true);
    } else {
      setCouponError('Invalid coupon. Try HASTKALA2026 for 15% off!');
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-artisan-terracotta/20 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Cart Header */}
        <div className="p-4 sm:p-5 border-b border-artisan-terracotta/10 flex items-center justify-between bg-artisan-sand/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-artisan-terracotta text-white flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-artisan-indigo">
                {t('cartTitle')}
              </h3>
              <p className="text-[11px] text-artisan-slate/70">
                {cart.length} {t('uniqueItems')}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-artisan-sand text-artisan-indigo transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {cart.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-artisan-sand flex items-center justify-center mx-auto text-artisan-terracotta">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-artisan-indigo">
                {t('emptyCart')}
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-artisan-terracotta text-white font-bold text-xs"
              >
                {t('browseMarketplace')}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => {
                const title = item.product.title[activeLanguage] || item.product.title.en;
                return (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-artisan-sand/40 border border-artisan-terracotta/10"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={title}
                      className="w-16 h-16 rounded-xl object-cover border border-artisan-terracotta/20 flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-artisan-indigo truncate">
                        {title}
                      </h4>
                      <p className="text-[10px] text-artisan-slate/70">
                        By {item.product.artisan.name} • {item.product.originState}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-black text-artisan-indigo">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>

                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-artisan-terracotta/20 rounded-lg overflow-hidden bg-white">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs font-bold hover:bg-artisan-sand"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs font-bold hover:bg-artisan-sand"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-artisan-slate/40 hover:text-red-500 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {cart.length > 0 && (
            <div className="space-y-4 pt-2">
              
              {/* Free Delivery Bar */}
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
                <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  {subtotal >= 2000
                    ? '🎉 You unlocked Free Eco-Friendly Insured Delivery!'
                    : `Add ${formatPrice(2000 - subtotal)} more for Free Shipping!`}
                </span>
              </div>

              {/* Artisan Direct Tip Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-500/20 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-artisan-indigo">
                  <HeartHandshake className="w-4 h-4 text-artisan-terracotta" />
                  <span>{t('artisanTipLabel')}</span>
                </div>
                <p className="text-[10px] text-artisan-slate/70">
                  100% of this tip goes straight to the village artisan guild fund.
                </p>

                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[0, 50, 100, 200].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setArtisanTip(amt)}
                      className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        artisanTip === amt
                          ? 'bg-artisan-terracotta text-white border-artisan-terracotta shadow-xs'
                          : 'bg-white text-artisan-indigo border-amber-300/40 hover:bg-amber-100/50'
                      }`}
                    >
                      {amt === 0 ? t('noTip') : `₹${amt}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Coupon Code Input */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-artisan-slate/40 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. HASTKALA2026)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full bg-artisan-sand/60 border border-artisan-terracotta/20 rounded-xl pl-9 pr-3 py-2 text-xs uppercase font-bold focus:outline-none focus:ring-2 focus:ring-artisan-terracotta/30"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-artisan-indigo text-white font-bold text-xs hover:bg-artisan-indigo-dark transition-all"
                  >
                    {t('apply')}
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> 15% SIH Mela Discount Applied (-{formatPrice(discountAmount)})
                  </p>
                )}
                {couponError && (
                  <p className="text-[11px] text-red-600 font-medium">{couponError}</p>
                )}
              </form>

            </div>
          )}

        </div>

        {/* Bottom Total & Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-artisan-terracotta/15 bg-white space-y-3">
            <div className="space-y-1.5 text-xs text-artisan-slate/80">
              <div className="flex justify-between">
                <span>{t('craftsSubtotal')}</span>
                <span className="font-bold text-artisan-indigo">{formatPrice(subtotal)}</span>
              </div>
              {artisanTip > 0 && (
                <div className="flex justify-between text-amber-700 font-medium">
                  <span>{t('artisanDirectTip')}</span>
                  <span>+{formatPrice(artisanTip)}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>{t('discount')}</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{t('insuredShipping')}</span>
                <span className="font-bold text-artisan-indigo">
                  {deliveryFee === 0 ? <span className="text-emerald-700 font-bold">{t('freeShipping')}</span> : formatPrice(deliveryFee)}
                </span>
              </div>

              <div className="flex justify-between pt-2 border-t border-gray-100 text-sm font-black text-artisan-indigo">
                <span>{t('orderTotal')}</span>
                <span className="text-lg text-artisan-terracotta">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={handleProceedCheckout}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-artisan-terracotta to-artisan-saffron-gold text-white font-bold text-sm shadow-lg shadow-artisan-terracotta/30 hover:scale-102 transition-all flex items-center justify-center gap-2"
            >
              <span>{t('checkout')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
