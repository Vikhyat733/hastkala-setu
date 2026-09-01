import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, SupportedLanguage, ViewMode, ArtisanProfile, AIVisionResult } from '../types';
import { SAMPLE_CRAFTS } from '../data/sampleCrafts';
import { UI_TRANSLATIONS } from '../data/translations';
import confetti from 'canvas-confetti';

interface MarketplaceContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  activeLanguage: SupportedLanguage;
  activeCurrency: 'INR' | 'USD' | 'EUR';
  currentView: ViewMode;
  selectedProductForModal: Product | null;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  artisanTip: number;
  recentOrders: Order[];
  activeArtisan: ArtisanProfile;
  toastMessage: { text: string; type: 'success' | 'info' | 'warning' } | null;
  
  // Actions
  setActiveLanguage: (lang: SupportedLanguage) => void;
  setActiveCurrency: (cur: 'INR' | 'USD' | 'EUR') => void;
  setCurrentView: (view: ViewMode) => void;
  setSelectedProductForModal: (product: Product | null) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setArtisanTip: (amount: number) => void;
  
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  
  publishNewCraft: (aiResult: AIVisionResult, image: string, customEdits?: Partial<Product>) => Product;
  createOrder: (orderData: Omit<Order, 'id' | 'orderDate' | 'trackingNumber' | 'estimatedDelivery'>) => Order;
  
  t: (key: string) => string;
  formatPrice: (amountInInr: number) => string;
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
  triggerConfetti: () => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

const LOCAL_STORAGE_PRODUCTS = 'hastkala_products_v1';
const LOCAL_STORAGE_CART = 'hastkala_cart_v1';
const LOCAL_STORAGE_WISHLIST = 'hastkala_wishlist_v1';
const LOCAL_STORAGE_LANG = 'hastkala_lang_v1';
const LOCAL_STORAGE_ORDERS = 'hastkala_orders_v1';

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial products from local storage or sample data
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PRODUCTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return SAMPLE_CRAFTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_CART);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_WISHLIST);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return ['craft-1', 'craft-3'];
  });

  const [activeLanguage, setActiveLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_LANG) as SupportedLanguage;
    return saved || 'en';
  });

  const [activeCurrency, setActiveCurrency] = useState<'INR' | 'USD' | 'EUR'>('INR');
  const [currentView, setCurrentView] = useState<ViewMode>('marketplace');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [artisanTip, setArtisanTip] = useState(100);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const [recentOrders, setRecentOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_ORDERS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  // Current active artisan persona (Radha Devi / Master Ramnarayan)
  const [activeArtisan] = useState<ArtisanProfile>({
    id: 'artisan-self',
    name: 'Radha Devi Kumhar',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    village: 'Kot Jewar, Jaipur',
    state: 'Rajasthan',
    craftSpecialty: 'Blue Pottery & Glaze Art',
    experienceYears: 22,
    bio: {
      en: 'Master potter creating sustainable GI-tagged handcrafted pottery with traditional Egyptian paste recipes.',
      hi: 'पारंपरिक मिस्र के पेस्ट व्यंजनों के साथ टिकाऊ जीआई-टैग वाले हस्तनिर्मित मिट्टी के बर्तन बनाने वाले मास्टर कुम्हार।'
    },
    verified: true,
    giCertifiedArtisan: true,
    nationalAwardee: true,
    totalProductsSold: 340,
    rating: 4.95,
    storyQuote: 'Our hands shape not just clay, but four centuries of Rajasthani pride.'
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_LANG, activeLanguage);
  }, [activeLanguage]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_ORDERS, JSON.stringify(recentOrders));
  }, [recentOrders]);

  const setActiveLanguage = (lang: SupportedLanguage) => {
    setActiveLanguageState(lang);
  };

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D95D39', '#FF9933', '#1B2A4A', '#2C5E43', '#F5B041']
      });
    } catch (e) {
      console.log('Confetti effect');
    }
  };

  // Translation helper
  const t = (key: string): string => {
    const currentLangDict = UI_TRANSLATIONS[activeLanguage];
    if (currentLangDict && currentLangDict[key]) {
      return currentLangDict[key];
    }
    // Fallback to English
    return UI_TRANSLATIONS.en[key] || key;
  };

  // Currency Formatter
  const formatPrice = (amountInInr: number): string => {
    if (activeCurrency === 'USD') {
      return `$${(amountInInr / 83.5).toFixed(2)}`;
    }
    if (activeCurrency === 'EUR') {
      return `€${(amountInInr / 90.2).toFixed(2)}`;
    }
    return `₹${amountInInr.toLocaleString('en-IN')}`;
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`${product.title[activeLanguage] || product.title.en} added to cart!`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to Wishlist ❤️', 'success');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Publish new craft from AI Vision Studio directly to live marketplace
  const publishNewCraft = (
    aiResult: AIVisionResult,
    image: string,
    customEdits?: Partial<Product>
  ): Product => {
    const newProduct: Product = {
      id: `craft-${Date.now()}`,
      title: customEdits?.title || aiResult.title,
      shortDescription: customEdits?.shortDescription || aiResult.shortDescription,
      fullStory: customEdits?.fullStory || aiResult.fullStory,
      category: aiResult.category,
      price: customEdits?.price || aiResult.priceBreakdown.suggestedPrice,
      originalPrice: Math.round((customEdits?.price || aiResult.priceBreakdown.suggestedPrice) * 1.3),
      images: [image],
      artisan: activeArtisan,
      originState: aiResult.originState || activeArtisan.state,
      originRegion: aiResult.originRegion || activeArtisan.village,
      giTagStatus: {
        hasGiTag: aiResult.hasGiTag,
        registeredName: aiResult.giTagName
      },
      materialsUsed: aiResult.materials,
      craftTechnique: aiResult.craftTechnique,
      dimensions: 'Handcrafted Standard Spec',
      weight: 'Approx. 650g',
      productionTimeDays: Math.round(aiResult.priceBreakdown.artisanLaborHours / 3) || 4,
      ecoFriendly: true,
      stockCount: 10,
      rating: 5.0,
      reviewCount: 1,
      reviews: [
        {
          id: `rev-${Date.now()}`,
          userName: 'Marketplace Curator',
          rating: 5,
          date: new Date().toISOString().split('T')[0],
          comment: 'Verified genuine handicraft with authentic GI-grade technique and fair-trade pricing.',
          verifiedPurchase: true
        }
      ],
      priceBreakdown: aiResult.priceBreakdown,
      socialBlurbs: {
        whatsapp: aiResult.socialBlurbWhatsApp,
        instagram: aiResult.socialBlurbInstagram
      },
      tags: [aiResult.category, aiResult.originState, 'Handmade', 'AI Verified', 'Fair Trade'],
      createdAt: new Date().toISOString(),
      isAiGenerated: true
    };

    setProducts((prev) => [newProduct, ...prev]);
    triggerConfetti();
    showToast(t('publishedSuccess'), 'success');
    return newProduct;
  };

  // Create Order
  const createOrder = (
    orderData: Omit<Order, 'id' | 'orderDate' | 'trackingNumber' | 'estimatedDelivery'>
  ): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-HK-${Math.floor(100000 + Math.random() * 900000)}`,
      orderDate: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      trackingNumber: `HK-IND-EXP-${Math.floor(10000000 + Math.random() * 90000000)}`
    };

    setRecentOrders((prev) => [newOrder, ...prev]);
    clearCart();
    triggerConfetti();
    return newOrder;
  };

  return (
    <MarketplaceContext.Provider
      value={{
        products,
        cart,
        wishlist,
        activeLanguage,
        activeCurrency,
        currentView,
        selectedProductForModal,
        isCartOpen,
        isCheckoutOpen,
        artisanTip,
        recentOrders,
        activeArtisan,
        toastMessage,
        setActiveLanguage,
        setActiveCurrency,
        setCurrentView,
        setSelectedProductForModal,
        setIsCartOpen,
        setIsCheckoutOpen,
        setArtisanTip,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isWishlisted,
        publishNewCraft,
        createOrder,
        t,
        formatPrice,
        showToast,
        triggerConfetti
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
