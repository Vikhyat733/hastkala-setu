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
import { RuralArtisanApp } from './components/rural-app/RuralArtisanApp';


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
      
      {/* If currentView is rural-artisan-app, render directly with zero distractions */}
      {currentView === 'rural-artisan-app' ? (
        <main className="flex-1">
          <RuralArtisanApp />
        </main>
      ) : (
        <>
          {/* Top Sticky Navbar for Web Marketplace mode */}
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
            {currentView === 'b2b-linkage' && <ArtisanDashboard />}
            {currentView === 'artisan-stories' && <ArtisanStories />}
            {currentView === 'my-orders' && <MyOrdersView />}
          </main>

          {/* Footer */}
          <Footer />
        </>
      )}

      {/* Global Modals & Drawers */}
      <ProductModal />
      <CartDrawer />
      <CheckoutModal />
      <Toast />

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
