import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  QrCode, 
  CreditCard, 
  Banknote, 
  Truck, 
  Download, 
  Printer, 
  ArrowRight,
  PackageCheck,
  Sparkles
} from 'lucide-react';
import { Order } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    artisanTip,
    formatPrice,
    createOrder,
    setCurrentView,
    activeLanguage,
    t
  } = useMarketplace();

  // Form State
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [customerName, setCustomerName] = useState('Prasoon Kumar');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [shippingAddress, setShippingAddress] = useState('Flat 402, Hastkala Towers, Heritage Marg, Jaipur, Rajasthan - 302001');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [upiVpa, setUpiVpa] = useState('prasoon@okhdfcbank');
  
  // Created order ref
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal > 2000 || subtotal === 0 ? 0 : 99;
  const grandTotal = subtotal + artisanTip + deliveryFee;

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !shippingAddress) return;
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder = createOrder({
      items: [...cart],
      subtotal,
      artisanTip,
      discount: 0,
      deliveryFee,
      total: grandTotal,
      customerName,
      customerPhone,
      shippingAddress,
      paymentMethod,
      paymentStatus: 'completed'
    });
    setConfirmedOrder(newOrder);
    setStep('success');
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep('details');
    setConfirmedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-artisan-terracotta/20 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-artisan-terracotta/10 flex items-center justify-between bg-artisan-sand/60">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-artisan-terracotta text-white flex items-center justify-center font-bold text-xs">
              {step === 'details' ? '1' : step === 'payment' ? '2' : '✓'}
            </span>
            <div>
              <h3 className="font-serif font-bold text-base text-artisan-indigo">
                {step === 'details' ? t('deliveryAddress') : step === 'payment' ? t('paymentSimulated') : t('orderConfirmed')}
              </h3>
              <p className="text-[11px] text-artisan-slate/70">
                {t('directFulfillment')}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-artisan-sand text-artisan-indigo transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          
          {/* STEP 1: Address Details Form */}
          {step === 'details' && (
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-artisan-indigo">{t('fullName')}:</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-artisan-sand/50 border border-artisan-terracotta/20 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-artisan-terracotta/30"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-artisan-indigo">{t('phoneWhatsApp')}:</label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-artisan-sand/50 border border-artisan-terracotta/20 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-artisan-terracotta/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-artisan-indigo">{t('deliveryAddressLabel')}:</label>
                <textarea
                  rows={3}
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full bg-artisan-sand/50 border border-artisan-terracotta/20 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-artisan-terracotta/30 resize-none"
                />
              </div>

              {/* Order Summary Snapshot */}
              <div className="p-4 rounded-2xl bg-artisan-sand/70 border border-artisan-terracotta/15 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-artisan-indigo">{cart.length} {t('handcraftedProducts')}</p>
                  <p className="text-[11px] text-artisan-slate/70">{t('directArtisanTipIncluded')} {formatPrice(artisanTip)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-artisan-slate/60 uppercase font-bold">{t('totalPayable')}</p>
                  <p className="text-lg font-black text-artisan-terracotta">{formatPrice(grandTotal)}</p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-artisan-terracotta hover:bg-artisan-terracotta-dark text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{t('proceedToPayment')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          )}

          {/* STEP 2: Payment Simulation */}
          {step === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              
              {/* Payment Methods Tabs */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-artisan-terracotta/10 border-artisan-terracotta text-artisan-terracotta font-bold'
                      : 'bg-artisan-sand/50 border-artisan-terracotta/15 text-artisan-slate hover:bg-artisan-sand'
                  }`}
                >
                  <QrCode className="w-6 h-6" />
                  <span className="text-xs">{t('upiPayment')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-artisan-terracotta/10 border-artisan-terracotta text-artisan-terracotta font-bold'
                      : 'bg-artisan-sand/50 border-artisan-terracotta/15 text-artisan-slate hover:bg-artisan-sand'
                  }`}
                >
                  <CreditCard className="w-6 h-6" />
                  <span className="text-xs">{t('cardPayment')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-artisan-terracotta/10 border-artisan-terracotta text-artisan-terracotta font-bold'
                      : 'bg-artisan-sand/50 border-artisan-terracotta/15 text-artisan-slate hover:bg-artisan-sand'
                  }`}
                >
                  <Banknote className="w-6 h-6" />
                  <span className="text-xs">{t('cashOnDelivery')}</span>
                </button>
              </div>

              {/* UPI QR Code Interactive Visual */}
              {paymentMethod === 'upi' && (
                <div className="p-6 rounded-2xl bg-artisan-sand border border-artisan-terracotta/20 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="w-36 h-36 bg-white p-2.5 rounded-2xl border border-artisan-terracotta/30 shadow-inner flex flex-col items-center justify-center">
                    {/* Simulated Authentic SVG QR Code */}
                    <svg viewBox="0 0 100 100" className="w-full h-full text-artisan-indigo">
                      <path fill="currentColor" d="M10 10h30v30h-30z M20 20h10v10h-10z M60 10h30v30h-30z M70 20h10v10h-10z M10 60h30v30h-30z M20 70h10v10h-10z M60 60h10v10h-10z M80 60h10v10h-10z M70 70h10v10h-10z M60 80h10v10h-10z M80 80h10v10h-10z M45 20h10v10h-10z M45 45h10v10h-10z M20 45h10v10h-10z M70 45h10v10h-10z" />
                    </svg>
                    <span className="text-[9px] font-bold text-artisan-slate/60 mt-1">{t('scanGpayPhonePe')}</span>
                  </div>

                  <div className="flex-1 space-y-2 text-left">
                    <p className="text-xs font-bold text-artisan-indigo">{t('orPayViaUpi')}</p>
                    <input
                      type="text"
                      value={upiVpa}
                      onChange={(e) => setUpiVpa(e.target.value)}
                      className="w-full bg-white border border-artisan-terracotta/20 rounded-xl px-3 py-2 text-xs font-mono text-artisan-indigo focus:outline-none"
                    />
                    <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> {t('encryptedVerifiedEscrow')}
                    </p>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-3 p-4 rounded-2xl bg-artisan-sand border border-artisan-terracotta/20 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold">{t('cardNumber')}:</label>
                    <input type="text" defaultValue="4242 •••• •••• 4242" className="w-full bg-white border border-artisan-terracotta/20 rounded-xl px-3 py-2 font-mono" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold">{t('expiryDate')}:</label>
                      <input type="text" defaultValue="08/28" className="w-full bg-white border border-artisan-terracotta/20 rounded-xl px-3 py-2 font-mono" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold">{t('cvv')}:</label>
                      <input type="password" defaultValue="888" className="w-full bg-white border border-artisan-terracotta/20 rounded-xl px-3 py-2 font-mono" />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="px-4 py-2 text-xs font-bold text-artisan-slate hover:bg-artisan-sand rounded-xl"
                >
                  {t('backToAddress')}
                </button>

                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-200" />
                  <span>{t('simulatePaymentBtn')} ({formatPrice(grandTotal)})</span>
                </button>
              </div>

            </form>
          )}

          {/* STEP 3: Order Success Confirmation */}
          {step === 'success' && confirmedOrder && (
            <div className="space-y-6 text-center animate-in zoom-in-95 duration-300">
              
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif font-bold text-2xl text-artisan-indigo">
                  {t('orderConfirmed')}
                </h3>
                <p className="text-xs text-artisan-slate/70">
                  {t('orderNumber')} <strong className="font-mono text-artisan-indigo">{confirmedOrder.id}</strong>
                </p>
                <p className="text-xs text-emerald-700 font-bold">
                  {t('estimatedDeliveryBy')} {confirmedOrder.estimatedDelivery}
                </p>
              </div>

              {/* Order Receipt Box */}
              <div className="p-5 rounded-2xl bg-artisan-sand border border-artisan-terracotta/15 text-left space-y-3 text-xs">
                <div className="flex justify-between border-b border-artisan-terracotta/10 pb-2">
                  <span className="font-bold text-artisan-indigo">{t('deliveryTo')}</span>
                  <span className="text-artisan-slate/80">{confirmedOrder.customerName}</span>
                </div>
                <div className="flex justify-between border-b border-artisan-terracotta/10 pb-2">
                  <span className="font-bold text-artisan-indigo">{t('trackingCode')}</span>
                  <span className="font-mono font-bold text-artisan-terracotta">{confirmedOrder.trackingNumber}</span>
                </div>
                <div className="flex justify-between border-b border-artisan-terracotta/10 pb-2">
                  <span className="font-bold text-artisan-indigo">{t('artisanGuildTip')}</span>
                  <span className="font-bold text-emerald-700">+{formatPrice(confirmedOrder.artisanTip)} {t('directlyCredited')}</span>
                </div>
                <div className="flex justify-between pt-1 font-black text-sm text-artisan-indigo">
                  <span>{t('grandTotalPaid')}</span>
                  <span className="text-artisan-terracotta">{formatPrice(confirmedOrder.total)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handlePrintInvoice}
                  className="px-4 py-2.5 rounded-xl border border-artisan-terracotta/20 text-artisan-indigo font-bold text-xs hover:bg-artisan-sand flex items-center gap-2"
                >
                  <Printer className="w-4 h-4 text-artisan-terracotta" />
                  <span>{t('printInvoice')}</span>
                </button>

                <button
                  onClick={() => {
                    handleClose();
                    setCurrentView('my-orders');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-artisan-terracotta text-white font-bold text-xs hover:bg-artisan-terracotta-dark transition-all flex items-center gap-2"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>{t('viewInMyOrders')}</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
