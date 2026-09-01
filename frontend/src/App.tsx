import React, { useState } from 'react';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductGrid } from './components/ProductGrid';
import { ProductModal } from './components/ProductModal';
import { AIVisionStudio } from './components/AIVisionStudio';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ArtisanDashboard } from './components/ArtisanDashboard';
import { ArtisanStories } from './components/ArtisanStories';
import { MyOrdersView } from './components/MyOrdersView';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { 
  Sparkles, 
  ShoppingBag, 
  Compass, 
  Store, 
  BookOpen 
} from 'lucide-react';

const MarketplaceContent: React.FC = () => {
  const { currentView, setCurrentView, products, cart, setIsCartOpen } = useMarketplace();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('All Regions');
  const [giOnly, setGiOnly] = useState(false);
  const [ecoOnly, setEcoOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [searchQuery, setSearchQuery] = useState('');

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col justify-between craft-pattern-bg">
      
      {/* Top Sticky Navbar */}
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Main View Router */}
      <main className="flex-1 pb-16 md:pb-0">
        
        {currentView === 'marketplace' && (
          <div className="animate-in fade-in duration-300">
            <HeroBanner />
            <CategoryFilter
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              giOnly={giOnly}
              setGiOnly={setGiOnly}
              ecoOnly={ecoOnly}
              setEcoOnly={setEcoOnly}
              sortBy={sortBy}
              setSortBy={setSortBy}
              totalCount={products.length}
            />
            <ProductGrid
              products={products}
              selectedCategory={selectedCategory}
              selectedState={selectedState}
              giOnly={giOnly}
              ecoOnly={ecoOnly}
              sortBy={sortBy}
              searchQuery={searchQuery}
            />
          </div>
        )}

        {currentView === 'ai-studio' && <AIVisionStudio />}

        {currentView === 'artisan-dashboard' && <ArtisanDashboard />}

        {currentView === 'artisan-stories' && <ArtisanStories />}

        {currentView === 'my-orders' && <MyOrdersView />}

      </main>

      {/* Global Modals & Drawers */}
      <ProductModal />
      <CartDrawer />
      <CheckoutModal />
      <Toast />

      {/* Footer */}
      <Footer />

      {/* Mobile Floating Bottom App Bar (Flutter / Native App Feel) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-artisan-terracotta/20 py-2 px-4 flex items-center justify-around shadow-2xl">
        
        <button
          onClick={() => {
            setCurrentView('marketplace');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            currentView === 'marketplace' ? 'text-artisan-terracotta' : 'text-artisan-slate'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Home</span>
        </button>

        {/* AI Studio Floating Action */}
        <button
          onClick={() => {
            setCurrentView('ai-studio');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-1 -mt-5"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-artisan-terracotta to-artisan-saffron-gold text-white flex items-center justify-center shadow-lg shadow-artisan-terracotta/40 border-2 border-white animate-bounce-short">
            <Sparkles className="w-6 h-6 text-amber-200" />
          </div>
          <span className="text-[10px] font-bold text-artisan-terracotta">AI Studio</span>
        </button>

        <button
          onClick={() => {
            setCurrentView('artisan-dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            currentView === 'artisan-dashboard' ? 'text-artisan-terracotta' : 'text-artisan-slate'
          }`}
        >
          <Store className="w-5 h-5" />
          <span>Seller Hub</span>
        </button>

        <button
          onClick={() => {
            setCurrentView('artisan-stories');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            currentView === 'artisan-stories' ? 'text-artisan-terracotta' : 'text-artisan-slate'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span>Stories</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-1 text-[10px] font-bold text-artisan-slate"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Cart</span>
          {totalCartCount > 0 && (
            <span className="absolute -top-1 right-2 bg-artisan-terracotta text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {totalCartCount}
            </span>
          )}
        </button>

      </div>

    </div>
  );
};

export function App() {
  return (
    <MarketplaceProvider>
      <MarketplaceContent />
    </MarketplaceProvider>
  );
}

export default App;
