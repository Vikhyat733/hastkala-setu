import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { LANGUAGES } from '../data/translations';
import melaLogo from '../assets/mela_logo.png';
import { 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  Store, 
  Compass, 
  BookOpen, 
  Globe, 
  Menu, 
  X,
  Search,
  PackageCheck
} from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ searchQuery, setSearchQuery }) => {
  const {
    activeLanguage,
    setActiveLanguage,
    activeCurrency,
    setActiveCurrency,
    currentView,
    setCurrentView,
    cart,
    wishlist,
    setIsCartOpen,
    t
  } = useMarketplace();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNav = (view: typeof currentView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentLangObj = LANGUAGES.find((l) => l.code === activeLanguage) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-artisan-terracotta/15 shadow-sm transition-all">
      {/* Top Heritage Notice Bar */}
      <div className="bg-gradient-to-r from-artisan-indigo via-artisan-terracotta to-artisan-indigo text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="inline-block animate-pulse text-amber-300">🪔</span>
        <span>
          <strong>{t('navBannerPrefix')}</strong> {t('navBanner')}
        </span>
        <span className="hidden md:inline bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
          Gemini Vision Powered
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleNav('marketplace')}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          >
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md shadow-amber-950/20 border-2 border-amber-600/30 group-hover:scale-105 transition-transform duration-200 bg-[#FAF6ED] flex items-center justify-center flex-shrink-0">
              <img 
                src={melaLogo} 
                alt="mela logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-serif font-black tracking-tight bg-gradient-to-r from-[#3D2314] via-[#B84A1C] to-[#2C5E43] bg-clip-text text-transparent capitalize leading-none">
                  {t('appTitle')}
                </span>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-800 border border-amber-500/20 font-extrabold tracking-wider hidden sm:inline-block">
                  AI Mela
                </span>
              </div>
              <p className="text-[11px] text-artisan-slate/70 font-semibold tracking-wide hidden md:block mt-0.5">
                {t('appSubtitle')}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-2">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full bg-artisan-sand/60 border border-artisan-terracotta/20 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-artisan-terracotta/30 focus:border-artisan-terracotta transition-all placeholder:text-artisan-slate/50"
              />
              <Search className="w-4 h-4 text-artisan-slate/50 absolute left-3.5 top-3" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-artisan-slate/60 hover:text-artisan-indigo"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => handleNav('marketplace')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentView === 'marketplace'
                  ? 'bg-artisan-terracotta text-white shadow-sm shadow-artisan-terracotta/30'
                  : 'text-artisan-indigo hover:bg-artisan-terracotta/10'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>{t('marketplaceNav')}</span>
            </button>

            {/* Dedicated Rural Artisan Mobile App Mode */}
            <button
              onClick={() => handleNav('rural-artisan-app')}
              className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-extrabold transition-all ${
                currentView === 'rural-artisan-app'
                  ? 'bg-[#3A6B35] text-white shadow-md shadow-[#3A6B35]/30 ring-2 ring-[#8AC172]'
                  : 'bg-[#E8F0E3] text-[#2C5528] border-2 border-[#A5CD84] hover:bg-[#D5EAD0] hover:scale-102 shadow-sm'
              }`}
            >
              <span className="text-base">🌾</span>
              <span>{t('ruralAppNav')}</span>
              <span className="bg-[#E67E22] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-tighter shadow-sm animate-pulse">
                New
              </span>
            </button>

            {/* AI Vision Studio Primary Action Button */}
            <button
              onClick={() => handleNav('ai-studio')}
              className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                currentView === 'ai-studio'
                  ? 'bg-gradient-to-r from-artisan-indigo to-artisan-indigo-light text-white ring-2 ring-artisan-saffron'
                  : 'bg-gradient-to-r from-artisan-terracotta/10 to-amber-500/15 text-artisan-terracotta border border-artisan-terracotta/30 hover:shadow-md hover:scale-102'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>{t('aiStudioNav')}</span>
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-tighter shadow-sm animate-bounce">
                AI Vision
              </span>
            </button>

            <button
              onClick={() => handleNav('artisan-dashboard')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentView === 'artisan-dashboard'
                  ? 'bg-artisan-terracotta text-white'
                  : 'text-artisan-indigo hover:bg-artisan-terracotta/10'
              }`}
            >
              <Store className="w-4 h-4" />
              <span className="hidden lg:inline">{t('artisanHubNav')}</span>
              <span className="lg:hidden">Seller</span>
            </button>

            <button
              onClick={() => handleNav('b2b-linkage')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentView === 'b2b-linkage'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'text-artisan-indigo hover:bg-purple-50'
              }`}
            >
              <span>🏢 {t('b2bNav')}</span>
            </button>

            <button
              onClick={() => handleNav('artisan-stories')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentView === 'artisan-stories'
                  ? 'bg-artisan-terracotta text-white'
                  : 'text-artisan-indigo hover:bg-artisan-terracotta/10'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden xl:inline">{t('artisanStoriesNav')}</span>
              <span className="xl:hidden">Stories</span>
            </button>
          </nav>

          {/* Right Action Icons: Language, Currency, Wishlist, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-artisan-terracotta/20 hover:bg-artisan-sand text-xs font-semibold text-artisan-indigo transition-all shadow-xs"
                title="Switch Indian Language"
              >
                <Globe className="w-3.5 h-3.5 text-artisan-terracotta" />
                <span className="text-sm">{currentLangObj.flag}</span>
                <span className="hidden sm:inline font-bold">{currentLangObj.native}</span>
              </button>

              {langDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-2xl border border-artisan-terracotta/20 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setLangDropdownOpen(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-bold text-artisan-slate/60 uppercase tracking-wider border-b border-gray-100">
                    {t('selectLanguageHeading')}
                  </div>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setActiveLanguage(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium hover:bg-artisan-sand transition-colors ${
                        activeLanguage === lang.code ? 'bg-artisan-terracotta/10 text-artisan-terracotta font-bold' : 'text-artisan-indigo'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.native}</span>
                      </span>
                      <span className="text-[10px] text-artisan-slate/60">({lang.label})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Currency Selector */}
            <div className="hidden sm:flex bg-artisan-sand/80 border border-artisan-terracotta/20 rounded-xl p-0.5 text-xs font-bold">
              {(['INR', 'USD', 'EUR'] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setActiveCurrency(curr)}
                  className={`px-2 py-1 rounded-lg transition-all ${
                    activeCurrency === curr
                      ? 'bg-artisan-indigo text-white shadow-xs'
                      : 'text-artisan-slate hover:text-artisan-indigo'
                  }`}
                >
                  {curr === 'INR' ? '₹' : curr === 'USD' ? '$' : '€'}
                </button>
              ))}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => handleNav('marketplace')}
              className="relative p-2.5 rounded-xl border border-artisan-terracotta/20 hover:bg-artisan-sand text-artisan-indigo transition-all hidden sm:flex"
              title="Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-artisan-terracotta text-white hover:bg-artisan-terracotta-dark shadow-md shadow-artisan-terracotta/25 font-bold text-xs sm:text-sm transition-all group"
            >
              <ShoppingBag className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline font-semibold">{t('cart')}</span>
              {totalCartItems > 0 && (
                <span className="bg-white text-artisan-terracotta font-black text-xs px-1.5 py-0.5 rounded-full">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-artisan-terracotta/20 text-artisan-indigo hover:bg-artisan-sand"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-artisan-sand/70 border border-artisan-terracotta/20 rounded-full pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-artisan-terracotta/30 focus:border-artisan-terracotta transition-all"
            />
            <Search className="w-4 h-4 text-artisan-slate/50 absolute left-3.5 top-2.5" />
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-artisan-terracotta/10 py-3 space-y-2 animate-in fade-in slide-in-from-top duration-200">
            <button
              onClick={() => handleNav('rural-artisan-app')}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-extrabold bg-[#E8F0E3] text-[#2C5528] border border-[#A5CD84]"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">🌾</span>
                <span>{t('ruralAppNav')}</span>
              </div>
              <span className="text-[10px] bg-[#3A6B35] text-white px-2 py-0.5 rounded-full font-black">
                {t('appView')}
              </span>
            </button>
            <button
              onClick={() => handleNav('marketplace')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-left text-artisan-indigo hover:bg-artisan-sand"
            >
              <Compass className="w-4 h-4 text-artisan-terracotta" />
              <span>{t('marketplaceNav')}</span>
            </button>
            <button
              onClick={() => handleNav('ai-studio')}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold bg-artisan-terracotta/10 text-artisan-terracotta"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>{t('aiStudioNav')}</span>
              </div>
              <span className="text-[10px] bg-artisan-terracotta text-white px-2 py-0.5 rounded-full">
                Gemini AI
              </span>
            </button>
            <button
              onClick={() => handleNav('b2b-linkage')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-left text-purple-900 bg-purple-50 hover:bg-purple-100"
            >
              <span>🏢</span>
              <span>{t('b2bWholesaleLeads')}</span>
            </button>
            <button
              onClick={() => handleNav('artisan-dashboard')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-left text-artisan-indigo hover:bg-artisan-sand"
            >
              <Store className="w-4 h-4 text-artisan-terracotta" />
              <span>{t('artisanHubNav')}</span>
            </button>
            <button
              onClick={() => handleNav('artisan-stories')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-left text-artisan-indigo hover:bg-artisan-sand"
            >
              <BookOpen className="w-4 h-4 text-artisan-terracotta" />
              <span>{t('artisanStoriesNav')}</span>
            </button>
            <button
              onClick={() => handleNav('my-orders')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-left text-artisan-indigo hover:bg-artisan-sand"
            >
              <PackageCheck className="w-4 h-4 text-artisan-terracotta" />
              <span>{t('myOrdersNav')}</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
