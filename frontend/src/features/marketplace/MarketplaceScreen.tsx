import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Sparkles,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  Tag,
  Heart,
  MessageSquare,
  ShieldCheck,
  RefreshCw,
  X,
  Package,
  Layers,
  Award,
  Check,
  PhoneCall,
  User,
  Truck,
  AlertTriangle,
} from 'lucide-react';
import { useMela } from '../../context/MelaContext';
import { AppHeader } from '../../core/design-system/AppHeader';
import { PrimaryButton } from '../../core/design-system/PrimaryButton';
import { formatCurrency } from '../../utils/currency';
import {
  marketplaceService,
  MarketplaceProduct,
  CategoryItem,
  STATIC_CATEGORIES,
} from '../../services/marketplace/marketplaceService';
import { orderService, Order, DefaultAddress } from '../../services/orders/orderService';

export const MarketplaceScreen: React.FC = () => {
  const { selectedLanguage, setLanguage, currentUser, navigate, t, goBack, viewMode } = useMela();
  const lang = selectedLanguage;
  const isDesktop = viewMode === 'desktop';
  const nextLangMap = { hi: 'en', en: 'mr', mr: 'bn', bn: 'hi' } as const;

  // State
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>(STATIC_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceProduct | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  // Modals for Buyer actions
  const [showOrderModal, setShowOrderModal] = useState<boolean>(false);
  const [showInquiryModal, setShowInquiryModal] = useState<boolean>(false);
  const [inquiryText, setInquiryText] = useState<string>('');
  const [inquirySubmitted, setInquirySubmitted] = useState<boolean>(false);

  // Buyer 4-Step Checkout State
  type CheckoutStep = 'quantity' | 'address' | 'summary' | 'success';
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('quantity');
  const [orderQty, setOrderQty] = useState<number>(1);
  const [shippingName, setShippingName] = useState<string>('');
  const [shippingPhone, setShippingPhone] = useState<string>('');
  const [shippingAddress, setShippingAddress] = useState<string>('');
  const [shippingCity, setShippingCity] = useState<string>('');
  const [shippingState, setShippingState] = useState<string>('');
  const [shippingPincode, setShippingPincode] = useState<string>('');
  const [saveAsDefaultAddress, setSaveAsDefaultAddress] = useState<boolean>(true);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Initialize Address from saved default or current user profile
  const initializeCheckoutAddress = () => {
    const saved = orderService.getDefaultAddress();
    if (saved) {
      setShippingName(saved.name || '');
      setShippingPhone(saved.phone || '');
      setShippingAddress(saved.address || '');
      setShippingCity(saved.city || '');
      setShippingState(saved.state || '');
      setShippingPincode(saved.pincode || '');
    } else if (currentUser) {
      setShippingName(currentUser.name || '');
      setShippingPhone(currentUser.phone || '');
      setShippingAddress(currentUser.district || '');
      setShippingCity(currentUser.district || 'Lucknow');
      setShippingState(currentUser.state || 'Uttar Pradesh');
      setShippingPincode('226001');
    } else {
      setShippingName('');
      setShippingPhone('9876543210');
      setShippingAddress('');
      setShippingCity('Lucknow');
      setShippingState('Uttar Pradesh');
      setShippingPincode('226001');
    }
  };

  const handleStartCheckout = () => {
    if (!selectedProduct) return;
    setCheckoutError(null);

    // Validation 1: Available & published & stock > 0
    if (selectedProduct.stock <= 0) {
      setCheckoutError(lang === 'hi' ? 'यह सामान अभी उपलब्ध नहीं है।' : 'This product is currently unavailable.');
      return;
    }

    // Validation 2: Buyer is not artisan
    if (currentUser && selectedProduct.artisan_id && currentUser.id === selectedProduct.artisan_id) {
      setCheckoutError(
        lang === 'hi'
          ? 'आप अपना ही सामान नहीं खरीद सकते (You cannot purchase your own product).'
          : 'You cannot purchase your own product.'
      );
      return;
    }

    setOrderQty(1);
    initializeCheckoutAddress();
    setCheckoutStep('quantity');
    setShowOrderModal(true);
  };

  const handleValidateAddress = () => {
    setCheckoutError(null);
    if (!shippingName.trim()) {
      setCheckoutError(lang === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Please enter full name.');
      return;
    }
    if (!shippingPhone.trim() || shippingPhone.trim().length !== 10) {
      setCheckoutError(lang === 'hi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!shippingAddress.trim()) {
      setCheckoutError(lang === 'hi' ? 'कृपया डिलीवरी का पता दर्ज करें।' : 'Please enter street address.');
      return;
    }
    if (!shippingCity.trim()) {
      setCheckoutError(lang === 'hi' ? 'कृपया शहर का नाम दर्ज करें।' : 'Please enter city.');
      return;
    }
    if (!shippingState.trim()) {
      setCheckoutError(lang === 'hi' ? 'कृपया राज्य का नाम दर्ज करें।' : 'Please enter state.');
      return;
    }
    if (!shippingPincode.trim() || shippingPincode.trim().length !== 6) {
      setCheckoutError(lang === 'hi' ? 'कृपया 6 अंकों का भारतीय पिन कोड दर्ज करें।' : 'Please enter 6-digit Indian PIN code.');
      return;
    }

    if (saveAsDefaultAddress) {
      orderService.saveDefaultAddress({
        name: shippingName.trim(),
        phone: shippingPhone.trim(),
        address: shippingAddress.trim(),
        city: shippingCity.trim(),
        state: shippingState.trim(),
        pincode: shippingPincode.trim(),
      });
    }

    setCheckoutStep('summary');
  };

  const handlePlaceOrder = async () => {
    if (!selectedProduct || isSubmittingOrder) return;
    setIsSubmittingOrder(true);
    setCheckoutError(null);

    try {
      const order = await orderService.createOrder({
        buyer_id: currentUser?.id || 'buyer_guest',
        shipping_name: shippingName.trim(),
        shipping_phone: shippingPhone.trim(),
        shipping_address: shippingAddress.trim(),
        shipping_city: shippingCity.trim(),
        shipping_state: shippingState.trim(),
        shipping_pincode: shippingPincode.trim(),
        items: [
          {
            product_id: selectedProduct.id,
            quantity: orderQty,
          },
        ],
      });

      setCreatedOrder(order);
      setCheckoutStep('success');

      // Update remaining local stock for selected product immediately
      setSelectedProduct((prev) =>
        prev ? { ...prev, stock: Math.max(0, prev.stock - orderQty) } : null
      );
    } catch (err: any) {
      console.error('Order creation error:', err);
      setCheckoutError(
        err.message ||
          (lang === 'hi'
            ? 'ऑर्डर नहीं हो सका। कृपया फिर से कोशिश करें।'
            : 'Order creation failed. Please try again.')
      );
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Load Categories & Products
  const loadMarketData = async (cat = activeCategory, query = searchQuery) => {
    setIsLoading(true);
    setHasError(false);
    try {
      const [cats, prods] = await Promise.all([
        marketplaceService.getCategories(),
        marketplaceService.getProducts({
          category: cat !== 'all' ? cat : undefined,
          search: query.trim() || undefined,
        }),
      ]);
      setCategories(cats);
      setProducts(prods);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMarketData(activeCategory, searchQuery);
  }, [activeCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadMarketData(activeCategory, searchQuery);
  };

  const handleCategorySelect = (catId: string) => {
    setActiveCategory(catId);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    loadMarketData(activeCategory, '');
  };

  const handleToggleFavorite = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    const isFav = marketplaceService.toggleFavorite(productId);
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, is_favorite: isFav } : p))
    );
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct((prev) => (prev ? { ...prev, is_favorite: isFav } : null));
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // ── DETAIL VIEW (with standard "← Marketplace" header) ───────────────────────
  // ─────────────────────────────────────────────────────────────────────────────
  if (selectedProduct) {
    const isOutOfStock = selectedProduct.stock <= 0;
    const localizedDesc =
      selectedLanguage === 'en'
        ? selectedProduct.description_english || selectedProduct.description || selectedProduct.description_hindi
        : selectedLanguage === 'mr'
        ? (selectedProduct as any).description_marathi || selectedProduct.description_hindi || selectedProduct.description
        : selectedLanguage === 'bn'
        ? (selectedProduct as any).description_bengali || selectedProduct.description_hindi || selectedProduct.description
        : selectedProduct.description_hindi || selectedProduct.description || selectedProduct.description_english;

    return (
      <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-between pb-12">
        <AppHeader
          title="Product Details"
          subtitle="MELA Marketplace"
          onBack={() => setSelectedProduct(null)}
          showLanguageToggle={true}
          currentLanguage={selectedLanguage}
          onLanguageToggle={() => setLanguage(nextLangMap[selectedLanguage])}
        />

        <main className={`flex-1 w-full mx-auto p-4 ${isDesktop ? 'max-w-7xl md:p-6 pb-20 md:pb-6' : 'max-w-md pb-24 space-y-5'}`}>
          <div className={isDesktop ? "md:grid md:grid-cols-2 md:gap-8 items-start" : "space-y-5"}>
            
            {/* ── LEFT COLUMN: Image & Status ── */}
            <div className="bg-white rounded-3xl overflow-hidden border-2 border-[#E0D8CE] shadow-lg">
              {/* Hero Image */}
            <div className="relative aspect-[4/3] w-full bg-stone-100">
              <img
                src={selectedProduct.enhanced_image_url || selectedProduct.image_url || 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600'}
                alt={selectedProduct.title}
                className="w-full h-full object-cover"
              />

              {/* Status Badges */}
              <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                {isOutOfStock ? (
                  <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-black shadow-sm flex items-center gap-1">
                    {lang === 'hi' ? 'स्टॉक समाप्त' : 'Out of Stock'}
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-[#1B4D3E] text-white text-[10px] font-black shadow-sm flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-amber-300" />
                    {lang === 'hi' ? `उपलब्ध (स्टॉक: ${selectedProduct.stock})` : `In Stock (${selectedProduct.stock} left)`}
                  </span>
                )}
              </div>

              {/* Favorite Button */}
              <button
                type="button"
                onClick={(e) => handleToggleFavorite(e, selectedProduct.id)}
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center transition-transform active:scale-90"
              >
                <Heart
                  className={`w-5 h-5 ${
                    selectedProduct.is_favorite ? 'fill-red-500 text-red-500' : 'text-stone-600'
                  }`}
                />
              </button>

              {/* Origin Location overlay */}
              <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-[#261D1A] shadow-md flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#C04B27]" />
                <span>{selectedProduct.artisan_location}</span>
              </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: Details & Actions ── */}
            <div className={`space-y-5 ${isDesktop ? 'mt-5 md:mt-0' : ''}`}>
              
              <div className="bg-white rounded-3xl p-5 border-2 border-[#E0D8CE] shadow-sm space-y-4 relative">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-[#C04B27] uppercase tracking-wider block truncate">
                    {selectedProduct.category}
                  </span>
                  <h3 className="text-xl font-black text-[#261D1A] mt-0.5 leading-snug">
                    {selectedProduct.title}
                  </h3>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] font-bold text-[#6B5E59] uppercase block">
                    {lang === 'hi' ? 'सीधा शिल्पकार मूल्य' : 'Direct Price'}
                  </span>
                  <span className="text-2xl font-black text-[#1B4D3E]">
                    {formatCurrency(selectedProduct.price)}
                  </span>
                </div>
              </div>

              {/* Material & Craft info */}
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                {selectedProduct.material && (
                  <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EAE2D5]">
                    <span className="text-[9px] font-bold uppercase text-[#6B5E59] block">
                      {lang === 'hi' ? 'सामग्री' : 'Material'}
                    </span>
                    <span className="text-[#261D1A] truncate block">{selectedProduct.material}</span>
                  </div>
                )}
                {selectedProduct.craft_type && (
                  <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EAE2D5]">
                    <span className="text-[9px] font-bold uppercase text-[#6B5E59] block">
                      {lang === 'hi' ? 'शिल्प विधा' : 'Craft'}
                    </span>
                    <span className="text-[#261D1A] truncate block">{selectedProduct.craft_type}</span>
                  </div>
                )}
              </div>

              {/* Rich Description */}
              {localizedDesc && (
                <div className="bg-[#FAF6F0] p-3.5 rounded-2xl border border-[#EAE2D5] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B5E59] block">
                    {lang === 'hi' ? 'उत्पाद विवरण' : 'Product Story & Details'}
                  </span>
                  <p className="text-xs text-[#261D1A] font-medium leading-relaxed">
                    {localizedDesc}
                  </p>
                </div>
              )}
            </div>

          {/* ── MEET THE ARTISAN SECTION (Human Story) ── */}
          <div className="bg-white rounded-3xl p-5 border border-[#E0D8CE] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#1B4D3E] flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#C04B27]" />
                {lang === 'hi' ? 'कारीगर से मिलें' : 'Meet the Artisan'}
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {lang === 'hi' ? 'सत्यापित शिल्पकार' : 'Verified Artisan'}
              </span>
            </div>

            <div className="flex items-center gap-3.5 pt-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1B4D3E] to-[#C04B27] text-white text-2xl font-black flex items-center justify-center flex-shrink-0 shadow-sm">
                🏺
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-black text-[#261D1A] truncate">
                  {selectedProduct.artisan_name}
                </h4>
                <p className="text-xs font-semibold text-[#6B5E59] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#C04B27]" />
                  {selectedProduct.artisan_location}
                </p>
                <p className="text-[11px] font-medium text-[#1B4D3E] mt-0.5">
                  {selectedProduct.artisan_craft}
                </p>
              </div>
            </div>

            {selectedProduct.artisan_bio && (
              <p className="text-xs text-[#6B5E59] italic bg-[#FAF6F0] p-3 rounded-xl border border-[#E8E2D9] leading-relaxed">
                "{selectedProduct.artisan_bio}"
              </p>
            )}
          </div>

          {/* ── PRODUCT ACTIONS (Buy / Ask) ── */}
          <div className="space-y-2.5 pt-2">
            <PrimaryButton
              onClick={() => handleStartCheckout()}
              disabled={isOutOfStock}
            >
              <span className="flex items-center justify-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                {isOutOfStock
                  ? (lang === 'hi' ? 'यह सामान अभी उपलब्ध नहीं है' : 'Currently Unavailable')
                  : (lang === 'hi' ? 'अभी खरीदें (Buy Now)' : 'Buy Now')}
              </span>
            </PrimaryButton>

            <button
              type="button"
              onClick={() => { setInquirySubmitted(false); setShowInquiryModal(true); }}
              className="w-full py-3.5 px-4 rounded-2xl border-2 border-[#E0D8CE] bg-white text-[#1B4D3E] font-bold text-xs flex items-center justify-center gap-2 shadow-2xs hover:bg-stone-50 active:scale-98 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[#C04B27]" />
              {lang === 'hi' ? 'सामान के बारे में पूछें (Ask Artisan)' : 'Ask About Product'}
            </button>
          </div>
          </div>
          </div>
        </main>

        {/* ── 4-STEP BUYER ORDER CHECKOUT MODAL ── */}
        {showOrderModal && (
          <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4 animate-in fade-in">
            <div className="w-full max-w-md bg-white rounded-3xl p-5 md:p-6 border-2 border-[#1B4D3E] shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto animate-in zoom-in-95">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🛍️</span>
                  <h3 className="text-base font-black text-[#1B4D3E]">
                    {checkoutStep === 'quantity' && (lang === 'hi' ? 'मात्रा चुनें (Quantity)' : 'Select Quantity')}
                    {checkoutStep === 'address' && (lang === 'hi' ? 'डिलीवरी का पता (Address)' : 'Delivery Address')}
                    {checkoutStep === 'summary' && (lang === 'hi' ? 'ऑर्डर सारांश (Summary)' : 'Order Summary')}
                    {checkoutStep === 'success' && (lang === 'hi' ? 'ऑर्डर सफल!' : 'Order Placed!')}
                  </h3>
                </div>
                {checkoutStep !== 'success' && (
                  <button
                    type="button"
                    onClick={() => setShowOrderModal(false)}
                    className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Validation Warning Alert */}
              {checkoutError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{checkoutError}</span>
                </div>
              )}

              {/* ── STEP 1: QUANTITY SELECTION ── */}
              {checkoutStep === 'quantity' && (
                <div className="space-y-4 py-1">
                  {/* Product Mini Snapshot */}
                  <div className="flex items-center gap-3 p-3 bg-[#FAF6F0] rounded-2xl border border-[#E0D8CE]">
                    <img
                      src={selectedProduct.enhanced_image_url || selectedProduct.image_url || 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=200'}
                      alt={selectedProduct.title}
                      className="w-14 h-14 rounded-xl object-cover border border-[#E0D8CE]"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-black text-[#261D1A] truncate">{selectedProduct.title}</h4>
                      <p className="text-xs text-[#6B5E59]">{formatCurrency(selectedProduct.price)} / {lang === 'hi' ? 'इकाई' : 'piece'}</p>
                      <p className="text-[11px] font-bold text-[#1B4D3E]">
                        {lang === 'hi' ? `उपलब्ध स्टॉक: ${selectedProduct.stock}` : `Available: ${selectedProduct.stock}`}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="p-4 bg-white rounded-2xl border-2 border-[#E0D8CE] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#261D1A] block">
                        {lang === 'hi' ? 'मात्रा (Quantity)' : 'Quantity'}
                      </span>
                      <span className="text-[11px] text-[#6B5E59]">
                        {lang === 'hi' ? `अधिकतम: ${selectedProduct.stock}` : `Max: ${selectedProduct.stock}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setOrderQty((q) => Math.max(1, q - 1))}
                        disabled={orderQty <= 1}
                        className="w-10 h-10 rounded-xl bg-[#FAF6F0] border border-[#E0D8CE] text-lg font-black text-[#261D1A] disabled:opacity-40 flex items-center justify-center hover:bg-stone-100 active:scale-95 transition-all"
                      >
                        -
                      </button>
                      <span className="text-lg font-black text-[#1B4D3E] min-w-[28px] text-center">
                        {orderQty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setOrderQty((q) => Math.min(selectedProduct.stock, q + 1))}
                        disabled={orderQty >= selectedProduct.stock}
                        className="w-10 h-10 rounded-xl bg-[#FAF6F0] border border-[#E0D8CE] text-lg font-black text-[#261D1A] disabled:opacity-40 flex items-center justify-center hover:bg-stone-100 active:scale-95 transition-all"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Live Subtotal */}
                  <div className="flex justify-between items-center p-3 bg-[#1B4D3E]/5 rounded-2xl border border-[#1B4D3E]/20">
                    <span className="text-xs font-bold text-[#6B5E59]">
                      {lang === 'hi' ? 'उप-कुल (Subtotal):' : 'Subtotal:'}
                    </span>
                    <span className="text-base font-black text-[#1B4D3E]">
                      {formatCurrency(selectedProduct.price * orderQty)}
                    </span>
                  </div>

                  <PrimaryButton onClick={() => setCheckoutStep('address')}>
                    <span>{lang === 'hi' ? 'डिलीवरी पता दर्ज करें ➔' : 'Proceed to Delivery Address ➔'}</span>
                  </PrimaryButton>
                </div>
              )}

              {/* ── STEP 2: DELIVERY ADDRESS FORM ── */}
              {checkoutStep === 'address' && (
                <div className="space-y-3.5 py-1">
                  <p className="text-xs text-[#6B5E59]">
                    {lang === 'hi' ? 'कृपया सामान भेजने के लिए सही पता दर्ज करें:' : 'Please provide accurate delivery coordinates:'}
                  </p>

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-[#261D1A] block mb-1">
                        {lang === 'hi' ? 'पूरा नाम (Full Name) *' : 'Full Name *'}
                      </label>
                      <input
                        type="text"
                        value={shippingName}
                        onChange={(e) => setShippingName(e.target.value)}
                        placeholder={lang === 'hi' ? 'उदा. राहुल वर्मा' : 'e.g. Rahul Verma'}
                        className="w-full p-2.5 text-xs rounded-xl bg-[#FAF6F0] border border-[#E0D8CE] focus:border-[#1B4D3E] focus:outline-hidden font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#261D1A] block mb-1">
                        {lang === 'hi' ? 'मोबाइल नंबर (10 अंक) *' : 'Mobile Number (10 digits) *'}
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        value={shippingPhone}
                        onChange={(e) => setShippingPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="w-full p-2.5 text-xs rounded-xl bg-[#FAF6F0] border border-[#E0D8CE] focus:border-[#1B4D3E] focus:outline-hidden font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#261D1A] block mb-1">
                        {lang === 'hi' ? 'मकान नं., गली, इलाका (Address) *' : 'Street Address / Landmark *'}
                      </label>
                      <textarea
                        rows={2}
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder={lang === 'hi' ? 'उदा. मकान नं. 14, गांधी मार्ग' : 'e.g. House #14, Gandhi Marg'}
                        className="w-full p-2.5 text-xs rounded-xl bg-[#FAF6F0] border border-[#E0D8CE] focus:border-[#1B4D3E] focus:outline-hidden font-medium resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-[#261D1A] block mb-1">
                          {lang === 'hi' ? 'शहर / ज़िला (City) *' : 'City / District *'}
                        </label>
                        <input
                          type="text"
                          value={shippingCity}
                          onChange={(e) => setShippingCity(e.target.value)}
                          placeholder="Lucknow"
                          className="w-full p-2.5 text-xs rounded-xl bg-[#FAF6F0] border border-[#E0D8CE] focus:border-[#1B4D3E] focus:outline-hidden font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#261D1A] block mb-1">
                          {lang === 'hi' ? 'राज्य (State) *' : 'State *'}
                        </label>
                        <input
                          type="text"
                          value={shippingState}
                          onChange={(e) => setShippingState(e.target.value)}
                          placeholder="Uttar Pradesh"
                          className="w-full p-2.5 text-xs rounded-xl bg-[#FAF6F0] border border-[#E0D8CE] focus:border-[#1B4D3E] focus:outline-hidden font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#261D1A] block mb-1">
                        {lang === 'hi' ? 'पिन कोड (PIN Code - 6 अंक) *' : 'PIN Code (6 digits) *'}
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={shippingPincode}
                        onChange={(e) => setShippingPincode(e.target.value.replace(/\D/g, ''))}
                        placeholder="226001"
                        className="w-full p-2.5 text-xs rounded-xl bg-[#FAF6F0] border border-[#E0D8CE] focus:border-[#1B4D3E] focus:outline-hidden font-medium"
                      />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={saveAsDefaultAddress}
                        onChange={(e) => setSaveAsDefaultAddress(e.target.checked)}
                        className="w-4 h-4 rounded-md accent-[#1B4D3E]"
                      />
                      <span className="text-[11px] font-bold text-[#261D1A]">
                        {lang === 'hi' ? 'डिफ़ॉल्ट पते के रूप में सहेजें (Save as default)' : 'Save as default delivery address'}
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('quantity')}
                      className="w-1/3 py-3 px-3 rounded-2xl border-2 border-[#E0D8CE] text-xs font-bold text-[#261D1A] hover:bg-stone-50"
                    >
                      {lang === 'hi' ? '← पीछे' : '← Back'}
                    </button>
                    <div className="w-2/3">
                      <PrimaryButton onClick={() => handleValidateAddress()}>
                        <span>{lang === 'hi' ? 'ऑर्डर सारांश देखें ➔' : 'Review Summary ➔'}</span>
                      </PrimaryButton>
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 3: ORDER SUMMARY & DEMO CONFIRMATION ── */}
              {checkoutStep === 'summary' && (
                <div className="space-y-4 py-1">
                  {/* Demo Mode Notice */}
                  <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl text-[11px] text-amber-900 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold uppercase tracking-wider">
                        {lang === 'hi' ? 'डेमो ऑर्डर मोड (DEMO ORDER MODE)' : 'DEMO ORDER MODE'}
                      </p>
                      <p className="text-[10px] text-amber-800 mt-0.5">
                        {lang === 'hi'
                          ? 'भुगतान अगले चरण में जोड़ा जाएगा। अभी केवल ऑर्डर का वास्तविक जीवन चक्र और स्टॉक परीक्षण किया जा रहा है।'
                          : 'Payment gateway will be integrated in the next phase. Real order lifecycle and atomic stock decrement are fully active.'}
                      </p>
                    </div>
                  </div>

                  {/* Summary Breakdown */}
                  <div className="p-3.5 bg-[#FAF6F0] rounded-2xl border border-[#E0D8CE] space-y-2 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-[#E8E2D9]">
                      <div className="min-w-0">
                        <span className="font-black text-[#261D1A] block truncate">{selectedProduct.title}</span>
                        <span className="text-[10px] text-[#6B5E59]">
                          {selectedProduct.artisan_name} • {selectedProduct.artisan_location}
                        </span>
                      </div>
                      <span className="font-bold text-[#261D1A] flex-shrink-0">
                        {orderQty} × {formatCurrency(selectedProduct.price)}
                      </span>
                    </div>

                    <div className="flex justify-between text-[#6B5E59]">
                      <span>{lang === 'hi' ? 'उप-कुल (Subtotal):' : 'Subtotal:'}</span>
                      <span className="font-bold text-[#261D1A]">{formatCurrency(selectedProduct.price * orderQty)}</span>
                    </div>

                    <div className="flex justify-between text-[#6B5E59]">
                      <span>{lang === 'hi' ? 'डिलीवरी शुल्क:' : 'Delivery Charge:'}</span>
                      <span className="font-bold text-emerald-700">{formatCurrency(0)} ({lang === 'hi' ? 'डेमो / निःशुल्क' : 'Demo / Free'})</span>
                    </div>

                    <div className="flex justify-between pt-2 border-t border-[#E8E2D9] text-sm font-black">
                      <span className="text-[#261D1A]">{lang === 'hi' ? 'कुल देय राशि:' : 'Total Payable:'}</span>
                      <span className="text-[#1B4D3E] text-base">{formatCurrency(selectedProduct.price * orderQty)}</span>
                    </div>
                  </div>

                  {/* Delivery destination preview */}
                  <div className="p-3 bg-white rounded-2xl border border-[#E0D8CE] text-xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#6B5E59] block mb-1">
                      {lang === 'hi' ? 'डिलीवरी गंतव्य:' : 'Deliver To:'}
                    </span>
                    <p className="font-bold text-[#261D1A]">{shippingName} ({shippingPhone})</p>
                    <p className="text-[#6B5E59] text-[11px] leading-snug">
                      {shippingAddress}, {shippingCity}, {shippingState} - {shippingPincode}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('address')}
                      disabled={isSubmittingOrder}
                      className="w-1/3 py-3 px-3 rounded-2xl border-2 border-[#E0D8CE] text-xs font-bold text-[#261D1A] hover:bg-stone-50 disabled:opacity-50"
                    >
                      {lang === 'hi' ? '← पीछे' : '← Back'}
                    </button>
                    <div className="w-2/3">
                      <PrimaryButton
                        onClick={() => handlePlaceOrder()}
                        disabled={isSubmittingOrder}
                      >
                        <span>
                          {isSubmittingOrder
                            ? (lang === 'hi' ? 'ऑर्डर किया जा रहा है...' : 'Placing Order...')
                            : (lang === 'hi' ? 'ऑर्डर करें (Place Order)' : 'Place Order')}
                        </span>
                      </PrimaryButton>
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 4: ORDER SUCCESS ── */}
              {checkoutStep === 'success' && createdOrder && (
                <div className="space-y-4 py-3 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center text-3xl shadow-sm animate-bounce">
                    🎉
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-[#1B4D3E]">
                      {lang === 'hi' ? 'ऑर्डर सफलतापूर्वक हो गया!' : 'Order Placed Successfully!'}
                    </h3>
                    <p className="text-xs text-[#6B5E59]">
                      {lang === 'hi'
                        ? 'आपका ऑर्डर सीधे शिल्पकार को भेज दिया गया है।'
                        : 'Your order was recorded and dispatched directly to the artisan.'}
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#FAF6F0] rounded-2xl border border-[#E0D8CE] text-left text-xs font-medium space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[#6B5E59]">{lang === 'hi' ? 'ऑर्डर संख्या:' : 'Order ID:'}</span>
                      <span className="font-mono font-black text-[#1B4D3E]">{createdOrder.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#6B5E59]">{lang === 'hi' ? 'सामान:' : 'Product:'}</span>
                      <span className="font-bold text-[#261D1A] truncate max-w-[180px]">{selectedProduct.title}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#6B5E59]">{lang === 'hi' ? 'मात्रा:' : 'Quantity:'}</span>
                      <span className="font-bold text-[#261D1A]">{orderQty}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#6B5E59]">{lang === 'hi' ? 'शिल्पकार:' : 'Artisan:'}</span>
                      <span className="font-bold text-[#261D1A]">{selectedProduct.artisan_name}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1.5 border-t border-[#E8E2D9]">
                      <p className="text-[10px] text-[#6B5E59] uppercase font-bold">{lang === 'hi' ? 'कुल भुगतान' : 'Amount Paid'}</p>
                      <span className="font-black text-[#1B4D3E] text-sm">{formatCurrency(createdOrder.total)}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <PrimaryButton
                      onClick={() => {
                        setShowOrderModal(false);
                        navigate('/orders');
                      }}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Truck className="w-4 h-4" />
                        {lang === 'hi' ? 'ऑर्डर ट्रैक करें (Track Order)' : 'Track Order'}
                      </span>
                    </PrimaryButton>

                    <button
                      type="button"
                      onClick={() => {
                        setShowOrderModal(false);
                        setSelectedProduct(null);
                        loadMarketData();
                      }}
                      className="w-full py-3 px-4 rounded-2xl border-2 border-[#E0D8CE] bg-white text-[#261D1A] font-bold text-xs hover:bg-stone-50 active:scale-98 transition-all"
                    >
                      {lang === 'hi' ? 'खरीदारी जारी रखें (Continue Shopping)' : 'Continue Shopping'}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ── INQUIRY MODAL (Ask Artisan) ── */}
        {showInquiryModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 animate-in fade-in">
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center border-2 border-[#1B4D3E] shadow-2xl space-y-4 animate-in zoom-in-95">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowInquiryModal(false)}
                  className="p-1 rounded-xl text-stone-500 hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!inquirySubmitted ? (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-[#C04B27]/10 text-[#C04B27] mx-auto flex items-center justify-center text-2xl">
                    💬
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-[#1B4D3E]">
                      {lang === 'hi' ? 'कारीगर से प्रश्न पूछें' : 'Ask the Artisan'}
                    </h3>
                    <p className="text-xs text-[#6B5E59]">
                      {lang === 'hi'
                        ? `${selectedProduct.artisan_name} से आकार, रंग या कस्टमाइज़ेशन के बारे में पूछें:`
                        : `Ask ${selectedProduct.artisan_name} about size, color or customization:`}
                    </p>
                  </div>

                  <textarea
                    rows={3}
                    value={inquiryText}
                    onChange={(e) => setInquiryText(e.target.value)}
                    placeholder={
                      lang === 'hi'
                        ? 'जैसे: क्या यह अन्य रंगों या आकार में उपलब्ध है?'
                        : 'e.g. Is this available in other sizes or custom colors?'
                    }
                    className="w-full p-3 rounded-2xl bg-[#FAF6F0] border-2 border-[#E0D8CE] text-xs text-[#261D1A] focus:border-[#C04B27] focus:outline-hidden resize-none"
                  />

                  <PrimaryButton
                    onClick={() => setInquirySubmitted(true)}
                    disabled={!inquiryText.trim()}
                  >
                    <span>{lang === 'hi' ? 'संदेश भेजें' : 'Send Message'}</span>
                  </PrimaryButton>
                </>
              ) : (
                <div className="space-y-4 py-2">
                  <div className="text-4xl">✉️</div>
                  <h3 className="text-xl font-black text-[#1B4D3E]">
                    {lang === 'hi' ? 'संदेश भेजा गया!' : 'Message Sent!'}
                  </h3>
                  <p className="text-xs text-[#6B5E59]">
                    {lang === 'hi'
                      ? 'शिल्पकार को आपका संदेश प्राप्त हो गया है।'
                      : 'The artisan has received your question.'}
                  </p>
                  <PrimaryButton onClick={() => setShowInquiryModal(false)}>
                    <span>{lang === 'hi' ? 'बंद करें' : 'Close'}</span>
                  </PrimaryButton>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // ── MAIN MARKETPLACE HOME VIEW ───────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-between pb-12">
      {/* Top Header */}
      <AppHeader
        title={t.marketplace.title}
        subtitle={t.marketplace.subtitle}
        onBack={() => navigate('/dashboard')}
        showLanguageToggle={true}
        currentLanguage={selectedLanguage}
        onLanguageToggle={() => setLanguage(nextLangMap[selectedLanguage])}
      />

      <main className={`flex-1 w-full mx-auto p-4 md:p-6 space-y-5 ${isDesktop ? 'max-w-7xl' : 'max-w-md'}`}>
        {/* Title & Trust Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B4D3E]/10 text-[#1B4D3E] text-[11px] font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C04B27]" />
            <span>{t.marketplace.directTrustBadge || 'Direct from Artisans'}</span>
          </div>
          <h2 className="text-2xl font-black text-[#261D1A] tracking-tight">
            {t.marketplace.title}
          </h2>
          <p className="text-xs text-[#6B5E59] font-medium">
            {t.marketplace.subtitle}
          </p>
        </div>

        {/* Large Accessible Search Field */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-[#8C7E77] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'hi' ? 'उत्पाद खोजें (जैसे: जूट बैग, फूलदान)...' : 'Search products (e.g. jute bag, vase)...'}
            className="w-full pl-10 pr-10 py-3.5 rounded-2xl bg-white border-2 border-[#E0D8CE] text-xs md:text-sm font-semibold text-[#261D1A] focus:outline-hidden focus:border-[#1B4D3E] shadow-2xs placeholder:text-[#8C7E77]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Visual Category Cards (Horizontal scrollable & tap-friendly) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#6B5E59]">
              {lang === 'hi' ? 'शिल्प श्रेणियाँ' : 'Craft Categories'}
            </h3>
            <span className="text-[11px] font-bold text-[#C04B27]">
              {categories.length} {lang === 'hi' ? 'श्रेणियाँ' : 'Categories'}
            </span>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.id;
              const catName = lang === 'hi' ? cat.name_hindi : cat.name_english;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-2xl border-2 transition-all cursor-pointer shadow-2xs ${
                    isSelected
                      ? 'bg-[#1B4D3E] border-[#1B4D3E] text-white shadow-md scale-102'
                      : 'bg-white border-[#E0D8CE] text-[#261D1A] hover:border-[#1B4D3E]/40'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span className="text-xs font-bold whitespace-nowrap">{catName}</span>
                  {cat.product_count > 0 && (
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#FAF6F0] text-[#6B5E59]'
                      }`}
                    >
                      {cat.product_count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product List Header */}
        <div className="flex items-center justify-between px-1 pt-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#6B5E59]">
            {lang === 'hi' ? 'उपलब्ध हस्तशिल्प' : 'Available Products'}
          </h3>
          <span className="text-xs font-bold text-[#1B4D3E]">
            {products.length} {lang === 'hi' ? 'सामान' : 'items'}
          </span>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="p-10 text-center space-y-3 bg-white rounded-3xl border border-[#E0D8CE] shadow-2xs">
            <RefreshCw className="w-8 h-8 text-[#1B4D3E] animate-spin mx-auto" />
            <p className="text-xs font-bold text-[#6B5E59]">
              {lang === 'hi' ? 'बाज़ार तैयार हो रहा है...' : 'Loading marketplace...'}
            </p>
          </div>
        ) : hasError ? (
          /* Error State */
          <div className="p-8 text-center bg-white rounded-3xl border-2 border-red-200 space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center text-2xl">
              ⚠️
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-black text-red-700">
                {lang === 'hi' ? 'बाज़ार अभी उपलब्ध नहीं है' : 'Marketplace Temporarily Unavailable'}
              </h4>
              <p className="text-xs text-[#6B5E59]">
                {lang === 'hi'
                  ? 'कृपया अपना इंटरनेट जांचें और फिर से कोशिश करें।'
                  : 'Please check your connection and try again.'}
              </p>
            </div>
            <PrimaryButton onClick={() => loadMarketData(activeCategory, searchQuery)}>
              <span>{lang === 'hi' ? 'फिर से कोशिश करें (Retry)' : 'Retry'}</span>
            </PrimaryButton>
          </div>
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="p-8 text-center bg-white rounded-3xl border-2 border-dashed border-[#E0D8CE] space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-[#C04B27] mx-auto flex items-center justify-center text-3xl">
              🔍
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-black text-[#261D1A]">
                {lang === 'hi' ? 'हमें ऐसा कोई सामान नहीं मिला' : 'No products match your search'}
              </h4>
              <p className="text-xs text-[#6B5E59] max-w-xs mx-auto">
                {lang === 'hi'
                  ? 'कृपया अन्य कीवर्ड या श्रेणी चुनकर देखें।'
                  : 'Try exploring different categories or clearing your search term.'}
              </p>
            </div>
            <div className="flex gap-2 justify-center pt-2">
              <button
                type="button"
                onClick={() => { setActiveCategory('all'); handleClearSearch(); }}
                className="px-4 py-2.5 rounded-xl bg-[#1B4D3E] text-white font-bold text-xs shadow-2xs hover:bg-[#143d31]"
              >
                {lang === 'hi' ? 'सभी सामान देखें' : 'View All Products'}
              </button>
            </div>
          </div>
        ) : (
          /* Products List */
          <div className={`grid gap-4 md:gap-5 ${isDesktop ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {products.map((item) => {
              const isOutOfStock = item.stock <= 0;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedProduct(item)}
                  className="bg-white rounded-3xl p-3.5 border border-[#E0D8CE] shadow-xs flex flex-col gap-3.5 hover:shadow-md transition-all cursor-pointer relative group"
                >
                  {/* Thumbnail Image */}
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-[#EAE2D5]">
                    <img
                      src={item.enhanced_image_url || item.image_url || 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=300'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />

                    {/* Favorite Button on Card */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleFavorite(e, item.id)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/85 backdrop-blur-xs flex items-center justify-center shadow-xs"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          item.is_favorite ? 'fill-red-500 text-red-500' : 'text-stone-600'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5 justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C04B27] truncate">
                        {item.category}
                      </span>
                      {isOutOfStock ? (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-red-100 text-red-800 flex-shrink-0">
                          {lang === 'hi' ? 'समाप्त' : 'Out of Stock'}
                        </span>
                      ) : (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-0.5 flex-shrink-0">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          {lang === 'hi' ? 'उपलब्ध' : 'Available'}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-black text-[#261D1A] truncate leading-tight mt-1">
                      {item.title}
                    </h4>

                    {/* Artisan Name & Location */}
                    <p className="text-[11px] font-medium text-[#6B5E59] truncate flex items-center gap-1 mt-1">
                      <User className="w-3 h-3 text-[#1B4D3E] flex-shrink-0" />
                      <span className="truncate">{item.artisan_name}</span>
                    </p>

                    <div className="flex items-center justify-between pt-2 mt-auto">
                      <span className="text-lg font-black text-[#1B4D3E]">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
