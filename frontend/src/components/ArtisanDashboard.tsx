import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  TrendingUp, 
  Sparkles, 
  Package, 
  Coins, 
  HeartHandshake, 
  Plus, 
  Eye, 
  Award,
  Info,
  Mic,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Building2,
  Phone,
  Mail,
  ArrowRight,
  Clock
} from 'lucide-react';

export const ArtisanDashboard: React.FC = () => {
  const {
    products,
    activeArtisan,
    recentOrders,
    b2bInquiries,
    formatPrice,
    setCurrentView,
    setSelectedProductForModal,
    activeLanguage,
    t
  } = useMarketplace();

  const [aiAssistantActive, setAiAssistantActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'b2b-inquiries' | 'orders'>('products');

  // Honest product filtering: products created by this artisan or published during this session
  const artisanProducts = products.filter(
    (p) => p.artisan.id === activeArtisan.id || p.artisan.id === 'artisan-self' || p.isAiGenerated
  );

  // Honest calculations derived from actual current state
  const totalListedInventory = artisanProducts.reduce((sum, p) => sum + (p.stockCount || 0), 0);
  const totalInventoryValue = artisanProducts.reduce((sum, p) => sum + p.price * (p.stockCount || 0), 0);
  const totalOrdersCount = recentOrders.length;
  const totalSalesRevenue = recentOrders.reduce((sum, o) => sum + o.total, 0);

  // Low stock products alert
  const lowStockProducts = artisanProducts.filter((p) => (p.stockCount || 0) < 5);

  // AI Virtual Business Manager Actionable Insights
  const generateBusinessManagerInsights = () => {
    const insights: string[] = [];

    insights.push(`${t('advisorNoteProducts')} ${artisanProducts.length} ${t('advisorNoteProductsSuffix')}`);

    if (lowStockProducts.length > 0) {
      insights.push(`${t('advisorNoteStockLow')} (${lowStockProducts.map(p => p.title[activeLanguage] || p.title.en).join(', ')})`);
    } else {
      insights.push(`${t('advisorNoteStockGood')} ${totalListedInventory} ${t('advisorNoteUnits')}`);
    }

    if (b2bInquiries.length > 0) {
      insights.push(`🏢 ${b2bInquiries.length} ${t('advisorNoteB2B')} (${b2bInquiries.reduce((s, i) => s + i.quantity, 0)} ${t('pieces')})`);
    }

    insights.push(`💡 ${t('advisorNoteTip')}`);

    return insights;
  };

  const businessInsights = generateBusinessManagerInsights();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Seller Profile Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#B84A1C]/20 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={activeArtisan.avatar}
            alt={activeArtisan.name}
            className="w-20 h-20 rounded-3xl object-cover border-4 border-amber-100 shadow-md"
          />

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-2xl text-[#1B2A4A]">
                {activeArtisan.name}
              </h1>
              {activeArtisan.nationalAwardee && (
                <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Award className="w-3 h-3" /> {t('nationalMaster')}
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500">
              {activeArtisan.craftSpecialty} • {activeArtisan.village}, {activeArtisan.state}
            </p>
            <p className="text-xs font-semibold text-emerald-700">
              ✓ {t('verifiedGuildArtisan')}
            </p>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => {
              setCurrentView('ai-studio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#B84A1C] to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-[#B84A1C]/30 hover:scale-102 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addNewCraftAI')}</span>
          </button>
        </div>
      </div>

      {/* AI Virtual Business Manager Card ("आज मुझे क्या करना चाहिए?") */}
      <div className="bg-gradient-to-r from-[#2A1810] to-[#451B12] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block">
                  AI Virtual Business Manager
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {t('whatShouldIDoToday')} ({t('artisanBusinessAdvisor')})
                </h3>
              </div>
            </div>

            <button
              onClick={() => setAiAssistantActive(!aiAssistantActive)}
              className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 text-xs font-bold hover:bg-amber-400 transition-all flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Mic className="w-4 h-4" />
              <span>{aiAssistantActive ? t('hideAdvice') : `🎤 ${t('viewAdvice')}`}</span>
            </button>
          </div>

          {/* Business Insights Output */}
          <div className="space-y-2 mt-4">
            {businessInsights.map((insight, idx) => (
              <div 
                key={idx} 
                className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 text-xs text-amber-100 flex items-start gap-2.5"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <p className="leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>

          {/* Primary Quick Touch Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6 pt-5 border-t border-white/15">
            <button
              onClick={() => {
                setCurrentView('ai-studio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-center transition-all group"
            >
              <span className="text-lg block mb-1">📸</span>
              <span className="text-xs font-bold text-white block">{t('newCraft')}</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('rural-artisan-app');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-center transition-all group"
            >
              <span className="text-lg block mb-1">🎤</span>
              <span className="text-xs font-bold text-white block">{t('voiceDescribe')}</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('ai-studio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-center transition-all group"
            >
              <span className="text-lg block mb-1">✨</span>
              <span className="text-xs font-bold text-white block">{t('improvePhoto')}</span>
            </button>

            <button
              onClick={() => setActiveTab('b2b-inquiries')}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-center transition-all group"
            >
              <span className="text-lg block mb-1">🏢</span>
              <span className="text-xs font-bold text-white block">{t('b2bWholesaleLeads')}</span>
              <span className="text-[10px] text-amber-200/70">{b2bInquiries.length} {t('pieces')}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Metrics Row (Grounded in Real Data) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">{t('totalActiveProducts')}</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#1B2A4A]">{artisanProducts.length}</p>
          <p className="text-[11px] text-stone-500 font-semibold">
            {t('listedInMarketplace')}
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">{t('availableStockUnits')}</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#1B2A4A]">{totalListedInventory}</p>
          <p className="text-[11px] text-stone-500 font-semibold">
            {t('inventoryValue')}: {formatPrice(totalInventoryValue)}
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">{t('b2bDemand')}</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#1B2A4A]">{b2bInquiries.length}</p>
          <p className="text-[11px] text-purple-700 font-semibold">
            {b2bInquiries.reduce((s, i) => s + i.quantity, 0)} {t('totalDemandPieces')}
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">{t('directCustomerOrders')}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#1B2A4A]">{totalOrdersCount}</p>
          <p className="text-[11px] text-emerald-700 font-semibold">
            {t('revenue')}: {formatPrice(totalSalesRevenue)}
          </p>
        </div>

      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-stone-200 gap-6">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === 'products'
              ? 'text-[#B84A1C] border-b-2 border-[#B84A1C]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>{t('myProductsTab')} ({artisanProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('b2b-inquiries')}
          className={`pb-3 text-sm font-bold transition-all relative flex items-center gap-2 ${
            activeTab === 'b2b-inquiries'
              ? 'text-[#B84A1C] border-b-2 border-[#B84A1C]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>{t('b2bLeadsTab')}</span>
          <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] rounded-full font-extrabold">
            {b2bInquiries.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-sm font-bold transition-all relative flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'text-[#B84A1C] border-b-2 border-[#B84A1C]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>{t('ordersTab')} ({recentOrders.length})</span>
        </button>
      </div>

      {/* Tab 1: Products Grid */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artisanProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 bg-stone-100">
                    <img
                      src={product.images[0]}
                      alt={product.title.en}
                      className="w-full h-full object-cover"
                    />
                    {product.isAiGenerated && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3" /> {t('aiAssistedCatalog')}
                      </span>
                    )}
                    <span className="absolute bottom-3 right-3 bg-black/70 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs">
                      {t('stock')}: {product.stockCount} {t('pieces')}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <h4 className="font-bold text-base text-[#1B2A4A] line-clamp-1">
                      {product.title[activeLanguage] || product.title.en}
                    </h4>
                    <p className="text-xs text-stone-500">
                      {product.craftTechnique}
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-stone-100 text-xs">
                      <span className="font-bold text-stone-700">{t('price')}:</span>
                      <span className="font-extrabold text-[#1B2A4A] text-base">{formatPrice(product.price)}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                      <span>{t('artisanDirectShare')}:</span>
                      <span className="font-bold text-emerald-700">{product.priceBreakdown.artisanDirectSharePercent}%</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => setSelectedProductForModal(product)}
                    className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-[#1B2A4A] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{t('preview')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: B2B Wholesale Leads */}
      {activeTab === 'b2b-inquiries' && (
        <div className="space-y-4">
          <div className="bg-purple-50/60 border border-purple-200 rounded-2xl p-4 text-xs text-purple-900 flex items-start gap-3">
            <Building2 className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{t('b2bMarketLinkage')}</p>
              <p className="text-purple-800/80 mt-0.5">
                {t('b2bMarketLinkageDesc')}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {b2bInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-800">
                      {inquiry.buyerType}
                    </span>
                    <h4 className="font-bold text-base text-[#1B2A4A]">{inquiry.buyerOrganization}</h4>
                  </div>
                  
                  <p className="text-xs text-stone-600">
                    <strong>{t('demand')}:</strong> {inquiry.quantity} {t('pieces')} • <strong>{t('product')}:</strong> {inquiry.productTitle || inquiry.craftCategory}
                  </p>
                  
                  {inquiry.customizationNotes && (
                    <p className="text-xs text-stone-500 italic">
                      "{inquiry.customizationNotes}"
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-stone-500 pt-1">
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {inquiry.buyerEmail}</span>
                    <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {inquiry.buyerPhone}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {t('delivery')}: {inquiry.targetDeliveryDate}</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    inquiry.status === 'connected'
                      ? 'bg-emerald-100 text-emerald-800'
                      : inquiry.status === 'in_review'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {inquiry.status === 'connected' ? `✓ ${t('connectedStatus')}` : inquiry.status === 'in_review' ? t('inReviewStatus') : t('newRequestStatus')}
                  </span>

                  <a
                    href={`tel:${inquiry.buyerPhone}`}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{t('callBuyer')}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Customer Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {recentOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
              <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-stone-700">{t('noOrdersArtisan')}</p>
              <p className="text-xs text-stone-500 mt-1">{t('noOrdersArtisanDesc')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-[11px] font-bold text-stone-500 block">{t('orderNumber')}{order.id}</span>
                    <h4 className="font-bold text-sm text-[#1B2A4A]">{order.customerName}</h4>
                    <p className="text-xs text-stone-500">{order.shippingAddress}</p>
                    <p className="text-xs text-stone-600 mt-1">
                      {t('items')}: {order.items.map(i => `${i.product.title[activeLanguage] || i.product.title.en} (x${i.quantity})`).join(', ')}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-[#1B2A4A]">{formatPrice(order.total)}</span>
                    <span className="block text-[11px] text-emerald-700 font-bold">{t('paidStatus')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
