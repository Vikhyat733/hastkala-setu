import React, { useState, useEffect } from 'react';
import {
  Camera,
  Package,
  ShoppingBag,
  Truck,
  Coins,
  Mic,
  Sparkles,
  X,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Clock,
  ArrowRight,
  TrendingUp,
  HelpCircle,
  Volume2,
  VolumeX,
  LogOut,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useMela } from '../../context/MelaContext';
import { AppHeader } from '../../core/design-system/AppHeader';
import { PrimaryButton } from '../../core/design-system/PrimaryButton';
import { productService, ProductItem } from '../../services/products/productService';
import { orderService, Order } from '../../services/orders/orderService';
import { voiceCatalogService } from '../../services/ai/voiceCatalogService';
import { speakText, stopSpeaking, isSpeaking } from '../../services/voiceAssistant';
import { formatCurrency } from '../../utils/currency';

// Curated educational tips for low-digital-literacy artisans in 4 languages
const MELA_TIPS: { hi: string; en: string; mr: string; bn: string }[] = [
  {
    hi: 'अपने सामान की साफ तस्वीरें प्राकृतिक रोशनी में लें ताकि ग्राहक आसानी से कारीगरी देख सकें।',
    en: 'Take clear craft photos in natural daylight so buyers can appreciate your fine craftsmanship.',
    mr: 'आपल्या वस्तूंचे स्पष्ट फोटो नैसर्गिक प्रकाशात घ्या जेणेकरून ग्राहक कारागिरी स्पष्ट पाहू शकतील.',
    bn: 'আপনার পণ্যের পরিষ্কার ছবি দিনের আলোতে তুলুন যাতে ক্রেতারা সূক্ষ্ম কারুকাজ দেখতে পারেন।',
  },
  {
    hi: 'सामान का दाम तय करते समय सामग्री के साथ अपनी मेहनत और समय का खर्च भी जरूर जोड़ें।',
    en: 'When pricing your item, always include your crafting labor hours along with raw material costs.',
    mr: 'किंमत ठरवताना साहित्यासह आपली मेहनत आणि वेळेचा खर्च नक्की जोडा.',
    bn: 'পণ্যের দাম নির্ধারণের সময় কাঁচামালের খরচের সাথে আপনার পরিশ্রমের মূল্যও যোগ করুন।',
  },
  {
    hi: 'ग्राहकों के सवालों का जल्दी जवाब देने से आपका सामान तेजी से बिकता है और भरोसा बढ़ता है।',
    en: 'Responding promptly to buyer inquiries builds trust and significantly increases your sales.',
    mr: 'ग्राहकांच्या प्रश्नांना जलद उत्तर दिल्याने विक्री वाढते आणि विश्वास निर्माण होतो.',
    bn: 'ক্রেতাদের প্রশ্নের দ্রুত উত্তর দিলে বিশ্বাস বৃদ্ধি পায় এবং বিক্রি বাড়ে।',
  },
  {
    hi: 'स्टॉक कम होने से पहले ही नया सामान बनाकर लिस्ट कर लें ताकि दुकान हमेशा चालू रहे।',
    en: 'Craft and publish new inventory before your current stock runs out to maintain steady sales.',
    mr: 'स्टॉक संपण्यापूर्वी नवीन माल तयार करून लिस्ट करा जेणेकरून विक्री सुरू राहील.',
    bn: 'স্টক শেষ হওয়ার আগেই নতুন পণ্য তৈরি করে তালিকাভুক্ত করুন।',
  },
];

export const DashboardScreen: React.FC = () => {
  const { t, currentUser, selectedLanguage, setLanguage, logout, backendHealth, navigate } = useMela();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // MELA Tip state
  const [tipIndex, setTipIndex] = useState<number>(0);

  // Ask MELA Voice Assistant Modal
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [assistantQuery, setAssistantQuery] = useState<string>('');
  const [assistantResponse, setAssistantResponse] = useState<{ hi: string; en: string; mr: string; bn: string } | null>(null);
  const [isListeningVoice, setIsListeningVoice] = useState<boolean>(false);
  const [isSpeakingResponse, setIsSpeakingResponse] = useState<boolean>(false);

  const artisanName = currentUser?.name || (
    selectedLanguage === 'hi' ? 'राधा देवी' :
    selectedLanguage === 'mr' ? 'राधा देवी' :
    selectedLanguage === 'bn' ? 'রাধা দেবী' : 'Radha Devi'
  );

  // Load real data from productService and orderService
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoadingData(true);
      try {
        const prodList = await productService.getProducts();
        setProducts(prodList || []);
        const orderList = await orderService.listOrders();
        setOrders(orderList || []);
      } catch (err) {
        console.warn('Dashboard data fetch warning:', err);
      } finally {
        setIsLoadingData(false);
      }
    };
    loadDashboardData();
  }, []);

  // Compute real metrics
  const publishedProducts = products.filter((p) => p.status === 'published');
  const draftProducts = products.filter((p) => p.status === 'draft');
  const lowStockProducts = products.filter((p) => (p.stock !== undefined ? p.stock <= 2 && p.stock > 0 : false));
  const outOfStockProducts = products.filter((p) => (p.stock !== undefined ? p.stock === 0 : false));
  const pendingOrders = orders.filter((o) =>
    ['PENDING', 'ACCEPTED', 'PREPARING', 'READY_TO_DISPATCH'].includes(o.status)
  );
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED');
  const totalSalesAmount = completedOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);

  // Next Tip
  const handleNextTip = () => {
    setTipIndex((prev) => (prev + 1) % MELA_TIPS.length);
  };

  // Assistant Query Handler
  const handleAskMelaPrompt = (queryType: 'orders' | 'pricing' | 'demand') => {
    if (queryType === 'orders') {
      const resp = {
        hi: `आपके पास वर्तमान में ${pendingOrders.length} पेंडिंग ऑर्डर हैं। आपकी कुल बिक्री ${formatCurrency(totalSalesAmount)} दर्ज हुई है।`,
        en: `You currently have ${pendingOrders.length} pending orders. Your total recorded sales are ${formatCurrency(totalSalesAmount)}.`,
        mr: `तुमच्याकडे सध्या ${pendingOrders.length} प्रलंबित (Pending) ऑर्डर्स आहेत. तुमची एकूण विक्री ${formatCurrency(totalSalesAmount)} नोंदवली गेली आहे.`,
        bn: `আপনার কাছে বর্তমানে ${pendingOrders.length} টি পেন্ডিং অর্ডার রয়েছে। মোট বিক্রি ${formatCurrency(totalSalesAmount)}।`,
      };
      setAssistantResponse(resp);
      const queryMap = {
        hi: 'मेरे कितने ऑर्डर हैं?',
        en: 'How many orders do I have?',
        mr: 'माझ्याकडे किती ऑर्डर आहेत?',
        bn: 'আমার কতগুলি অর্ডার আছে?',
      };
      setAssistantQuery(queryMap[selectedLanguage]);
      speakResponse(resp[selectedLanguage]);
    } else if (queryType === 'pricing') {
      const resp = {
        hi: 'MELA में आप "अपना सामान बेचें" पर जाकर फोटो लें। MELA AI आपकी सामग्री व कारीगरी की लागत जोड़कर पारदर्शी और उचित विक्रय मूल्य सुझाएगा।',
        en: "In MELA, start with 'Sell Your Product' and take a photo. MELA AI will calculate material and labor expenses to recommend a fair selling price.",
        mr: 'MELA मध्ये "सामान विका" वर जाऊन फोटो काढा. MELA AI साहित्य व कारागिरीचा खर्च जोडून योग्य किंमत सुचवेल.',
        bn: 'MELA-তে "পণ্য বিক্রি করুন" এ গিয়ে ছবি তুলুন। MELA AI কাঁচামাল ও শ্রমের খরচ হিসাব করে ন্যায্য মূল্য প্রস্তাব করবে।',
      };
      setAssistantResponse(resp);
      const queryMap = {
        hi: 'इस सामान की कीमत क्या रखूं?',
        en: 'How should I price my product?',
        mr: 'या वस्तूची किंमत कशी ठरवावी?',
        bn: 'পণ্যের সঠিক দাম কীভাবে নির্ধারণ করব?',
      };
      setAssistantQuery(queryMap[selectedLanguage]);
      speakResponse(resp[selectedLanguage]);
    } else if (queryType === 'demand') {
      const resp = {
        hi: 'मेला बाज़ार में वर्तमान में प्राकृतिक जूट बैग, टेराकोटा फूलदान, और हथकरघा सूती वस्त्रों की मांग सबसे अधिक है।',
        en: 'Currently on MELA Marketplace, handcrafted jute bags, terracotta pottery, and handloom cotton textiles have the highest buyer interest.',
        mr: 'मेला बाजारपेठेत सध्या जूट बॅग, मातीची भांडी व हातमाग सुती कापडांना सर्वाधिक मागणी आहे.',
        bn: 'মেলা বাজারে বর্তমানে পাটের ব্যাগ, মাটির শিল্পকর্ম ও তাঁতের কাপড়ের চাহিদা সবচেয়ে বেশি।',
      };
      setAssistantResponse(resp);
      const queryMap = {
        hi: 'आज क्या बेचना चाहिए?',
        en: 'What crafts are in demand?',
        mr: 'बाजारात कशाला जास्त मागणी आहे?',
        bn: 'বর্তমানে কোন পণ্যের চাহিদা বেশি?',
      };
      setAssistantQuery(queryMap[selectedLanguage]);
      speakResponse(resp[selectedLanguage]);
    }
  };

  const handleVoiceListen = async () => {
    setIsListeningVoice(true);
    setAssistantResponse(null);
    try {
      const result = await voiceCatalogService.startRecognition(selectedLanguage);
      setIsListeningVoice(false);
      if (result.success && result.transcript) {
        setAssistantQuery(result.transcript);
        const lower = result.transcript.toLowerCase();
        if (
          lower.includes('ऑर्डर') || lower.includes('order') || lower.includes('बिक्री') || lower.includes('sale') ||
          lower.includes('विक्री') || lower.includes('বিক্রি')
        ) {
          handleAskMelaPrompt('orders');
        } else if (
          lower.includes('दाम') || lower.includes('कीमत') || lower.includes('price') || lower.includes('मूल्य') ||
          lower.includes('किंमत') || lower.includes('দাম')
        ) {
          handleAskMelaPrompt('pricing');
        } else {
          handleAskMelaPrompt('demand');
        }
      }
    } catch {
      setIsListeningVoice(false);
    }
  };

  const speakResponse = (text: string) => {
    setIsSpeakingResponse(true);
    const localeMap = {
      hi: 'hi-IN',
      en: 'en-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
    };
    speakText(text, localeMap[selectedLanguage] || 'hi-IN', () => {
      setIsSpeakingResponse(false);
    });
  };

  const toggleSpeech = () => {
    if (isSpeaking()) {
      stopSpeaking();
      setIsSpeakingResponse(false);
    } else if (assistantResponse) {
      speakResponse(assistantResponse[selectedLanguage]);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-between pb-24">
      {/* ─── 1. TOP APP HEADER ─── */}
      <AppHeader
        title={t.common.appName}
        subtitle="SIH26090"
        showLanguageToggle={true}
        currentLanguage={selectedLanguage}
        onLanguageToggle={() => {
          const nextLangMap = {
            hi: 'en',
            en: 'mr',
            mr: 'bn',
            bn: 'hi',
          } as const;
          setLanguage(nextLangMap[selectedLanguage]);
        }}
        rightAction={
          <button
            onClick={logout}
            title={t.profile.logout}
            aria-label="Logout"
            className="p-2 rounded-xl text-[#6B5E59] hover:text-[#C04B27] hover:bg-white transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
          </button>
        }
      />

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 md:grid md:grid-cols-12 md:gap-6 space-y-5 md:space-y-0 pb-20 md:pb-6">
        
        {/* LEFT MAIN COLUMN (Desktop) */}
        <div className="md:col-span-8 space-y-5">
        {/* ─── 1. GREETING & STATUS CARD ─── */}
        <div className="bg-white p-4 md:p-5 rounded-3xl border border-[#E0D8CE] shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1B4D3E] to-[#C04B27] flex items-center justify-center text-white text-2xl font-black shadow-md flex-shrink-0">
                🏺
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#C04B27]">
                    {t.profile.statusActive}
                  </span>
                  <CheckCircle2 className="w-3 h-3 text-[#1B4D3E]" />
                </div>
                <h2 className="text-lg md:text-xl font-black text-[#261D1A] tracking-tight truncate">
                  {t.dashboard.greeting}, {artisanName} 👋
                </h2>
                <p className="text-xs text-[#6B5E59] font-medium truncate">
                  {t.dashboard.subGreeting}
                </p>
              </div>
            </div>

            {backendHealth && (
              <div
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-800 flex-shrink-0"
                title="MELA Backend Server Connected"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live</span>
              </div>
            )}
          </div>
        </div>

        {/* ─── 2. PRIMARY ACTION: SELL A PRODUCT (HERO) ─── */}
        <section aria-labelledby="hero-sell-heading">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#1B4D3E] to-[#12362b] rounded-3xl p-5 text-white shadow-lg border border-[#1B4D3E]/40">
            {/* Background art accents */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute bottom-0 right-10 text-7xl opacity-15 select-none pointer-events-none">
              📸
            </div>

            <div className="relative z-10 space-y-3.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-[11px] font-black uppercase tracking-wider text-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>MELA Studio</span>
              </div>

              <div className="space-y-1">
                <h3 id="hero-sell-heading" className="text-xl md:text-2xl font-black text-white leading-tight">
                  {t.dashboard.sellAction}
                </h3>
                <p className="text-xs md:text-sm text-stone-200 font-medium leading-relaxed">
                  {t.dashboard.sellActionSubtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/sell')}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#C04B27] hover:bg-[#a93f1f] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer"
              >
                <Camera className="w-5 h-5 text-amber-200" />
                <span>{t.dashboard.startSellBtn || t.dashboard.sellAction}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </section>

        {/* ─── 3. ASK MELA (BUSINESS ASSISTANT) ─── */}
        <section aria-labelledby="ask-mela-heading">
          <div className="bg-white rounded-3xl p-4 border border-[#E0D8CE] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#C04B27]/10 text-[#C04B27] flex items-center justify-center flex-shrink-0">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="ask-mela-heading" className="text-sm font-black text-[#261D1A]">
                    {t.dashboard.askMela}
                  </h3>
                  <p className="text-[11px] text-[#6B5E59] font-medium">
                    {t.dashboard.askMelaSub}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAssistantOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#1B4D3E] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:bg-[#143d31] transition-colors cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{t.dashboard.askMelaBtn || 'Ask'}</span>
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
              <button
                type="button"
                onClick={() => {
                  setIsAssistantOpen(true);
                  handleAskMelaPrompt('orders');
                }}
                className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#E0D8CE] text-[#261D1A] font-bold text-[11px] hover:border-[#1B4D3E] transition-colors cursor-pointer"
              >
                📦 {t.dashboard.quickQuestionOrders}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAssistantOpen(true);
                  handleAskMelaPrompt('pricing');
                }}
                className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#E0D8CE] text-[#261D1A] font-bold text-[11px] hover:border-[#1B4D3E] transition-colors cursor-pointer"
              >
                💰 {t.dashboard.quickQuestionPricing}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAssistantOpen(true);
                  handleAskMelaPrompt('demand');
                }}
                className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#E0D8CE] text-[#261D1A] font-bold text-[11px] hover:border-[#1B4D3E] transition-colors cursor-pointer"
              >
                📈 {t.dashboard.quickQuestionDemand}
              </button>
            </div>
          </div>
        </section>

        {/* ─── 4. BUSINESS SUMMARY METRICS ─── */}
        <section aria-labelledby="business-summary-heading" className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 id="business-summary-heading" className="text-xs font-black uppercase tracking-wider text-[#6B5E59]">
              {t.dashboard.businessSummaryTitle}
            </h3>
            <span className="text-[11px] font-bold text-[#1B4D3E]">
              {t.dashboard.realtimeBadge || 'Live'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {/* Metric 1: Products Listed */}
            <button
              type="button"
              onClick={() => navigate('/my-products')}
              className="bg-white p-3.5 rounded-2xl border border-[#E0D8CE] shadow-2xs text-left hover:border-[#1B4D3E] transition-all flex flex-col justify-between space-y-2 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-[#1B4D3E]/10 text-[#1B4D3E] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xl font-black text-[#261D1A] block">
                  {publishedProducts.length}
                </span>
                <span className="text-[10px] font-bold text-[#6B5E59] uppercase block leading-tight">
                  {t.dashboard.productsListed}
                </span>
              </div>
            </button>

            {/* Metric 2: Pending Orders */}
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="bg-white p-3.5 rounded-2xl border border-[#E0D8CE] shadow-2xs text-left hover:border-[#C04B27] transition-all flex flex-col justify-between space-y-2 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-[#C04B27]/10 text-[#C04B27] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xl font-black text-[#261D1A] block">
                  {pendingOrders.length}
                </span>
                <span className="text-[10px] font-bold text-[#6B5E59] uppercase block leading-tight">
                  {t.dashboard.ordersPending}
                </span>
              </div>
            </button>

            {/* Metric 3: Total Sales */}
            <button
              type="button"
              onClick={() => navigate('/earnings')}
              className="bg-white p-3.5 rounded-2xl border border-[#E0D8CE] shadow-2xs text-left hover:border-[#F2A33A] transition-all flex flex-col justify-between space-y-2 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-[#F2A33A]/15 text-[#F2A33A] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <span className="text-lg font-black text-[#1B4D3E] block truncate">
                  {formatCurrency(totalSalesAmount)}
                </span>
                <span className="text-[10px] font-bold text-[#6B5E59] uppercase block leading-tight">
                  {t.dashboard.totalSales}
                </span>
              </div>
            </button>
          </div>
        </section>

        
        </div> {/* End Left Column */}

        {/* RIGHT SIDEBAR COLUMN (Desktop) */}
        <div className="md:col-span-4 space-y-5">
          {/* ─── 5. NEEDS YOUR ATTENTION ("आपका ध्यान चाहिए") ─── */}
          <section aria-labelledby="needs-attention-heading" className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h3 id="needs-attention-heading" className="text-xs font-black uppercase tracking-wider text-[#6B5E59]">
                {t.dashboard.needsAttentionTitle}
              </h3>
            </div>

            <div className="space-y-2">
              {/* Alert 1: Pending Orders Waiting for Dispatch */}
              {pendingOrders.length > 0 && (
                <button
                  type="button"
                  onClick={() => navigate('/orders')}
                  className="w-full bg-amber-50/90 border border-amber-200 rounded-2xl p-3.5 text-left flex items-center justify-between gap-3 hover:bg-amber-100/70 transition-colors shadow-2xs cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl flex-shrink-0">📦</span>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-amber-900 truncate">
                        {pendingOrders.length} {t.dashboard.ordersWaiting}
                      </p>
                      <p className="text-[10px] text-amber-700 font-medium">
                        {t.dashboard.ordersWaitingDesc || 'Tap to view details and pack'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-800 flex-shrink-0" />
                </button>
              )}

              {/* Alert 2: Low Stock Products */}
              {lowStockProducts.length > 0 && (
                <button
                  type="button"
                  onClick={() => navigate('/my-products')}
                  className="w-full bg-orange-50/90 border border-orange-200 rounded-2xl p-3.5 text-left flex items-center justify-between gap-3 hover:bg-orange-100/70 transition-colors shadow-2xs cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl flex-shrink-0">🟠</span>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-orange-950 truncate">
                        {lowStockProducts[0].title} — {lowStockProducts[0].stock} {t.dashboard.lowStockSuffix}
                      </p>
                      <p className="text-[10px] text-orange-700 font-medium">
                        {t.dashboard.lowStockDesc}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-orange-800 flex-shrink-0" />
                </button>
              )}

              {/* Alert 3: Draft Products */}
              {draftProducts.length > 0 && (
                <button
                  type="button"
                  onClick={() => navigate('/my-products')}
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-left flex items-center justify-between gap-3 hover:bg-stone-100 transition-colors shadow-2xs cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl flex-shrink-0">📝</span>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-[#261D1A] truncate">
                        {draftProducts.length} {t.dashboard.draftsIncomplete}
                      </p>
                      <p className="text-[10px] text-[#6B5E59] font-medium">
                        {t.dashboard.draftsIncompleteDesc}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#6B5E59] flex-shrink-0" />
                </button>
              )}

              {/* All Good State */}
              {pendingOrders.length === 0 && lowStockProducts.length === 0 && draftProducts.length === 0 && (
                <div className="bg-white border border-[#E0D8CE] rounded-2xl p-4 text-center space-y-1 shadow-2xs">
                  <p className="text-sm font-black text-[#1B4D3E]">
                    {t.dashboard.allGood}
                  </p>
                  <p className="text-[11px] text-[#6B5E59]">
                    {t.dashboard.allGoodDesc}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* ─── 6. MELA TIP ("मेला की सलाह") ─── */}
          <section aria-labelledby="mela-tip-heading">
            <div className="bg-gradient-to-r from-amber-50/90 to-[#FAF6F0] rounded-3xl p-4 border border-amber-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
                  <Lightbulb className="w-4 h-4 text-[#C04B27]" />
                  <span id="mela-tip-heading" className="uppercase tracking-wider text-[10px]">
                    {t.dashboard.melaTipTitle}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleNextTip}
                  className="text-[11px] font-bold text-[#C04B27] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{t.dashboard.nextTipBtn}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <p className="text-xs text-[#261D1A] font-medium leading-relaxed">
                "{MELA_TIPS[tipIndex][selectedLanguage]}"
              </p>
            </div>
          </section>
        </div> {/* End Right Column */}

      </main>

      {/* ─── ASK MELA ASSISTANT MODAL ─── */}
      {isAssistantOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 border-2 border-[#1B4D3E]/30 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#C04B27]/10 text-[#C04B27] flex items-center justify-center">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#1B4D3E]">
                    {t.dashboard.askMela}
                  </h4>
                  <p className="text-[10px] text-[#6B5E59]">
                    {t.dashboard.askMelaSub}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setIsAssistantOpen(false);
                }}
                className="p-1.5 rounded-xl text-[#6B5E59] hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Voice Mic Button */}
            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={handleVoiceListen}
                disabled={isListeningVoice}
                className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white shadow-lg transition-all cursor-pointer ${
                  isListeningVoice
                    ? 'bg-[#C04B27] animate-pulse scale-110'
                    : 'bg-[#1B4D3E] hover:bg-[#143d31]'
                }`}
              >
                <Mic className="w-7 h-7" />
              </button>
              <p className="text-xs font-bold text-[#C04B27]">
                {isListeningVoice
                  ? t.dashboard.listeningVoice
                  : t.dashboard.tapMicToSpeak}
              </p>
            </div>

            {/* Response Card if query asked */}
            {assistantResponse && (
              <div className="p-3.5 bg-[#FAF6F0] rounded-2xl border border-[#E0D8CE] space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold text-[#6B5E59]">
                  <span>{t.dashboard.assistantResponseLabel}:</span>
                  <button
                    type="button"
                    onClick={toggleSpeech}
                    className="flex items-center gap-1 text-[#1B4D3E] hover:underline cursor-pointer"
                  >
                    {isSpeakingResponse ? <VolumeX className="w-3.5 h-3.5 text-[#C04B27]" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isSpeakingResponse ? t.dashboard.stopVoice : t.dashboard.playVoice}</span>
                  </button>
                </div>
                <p className="text-xs font-bold text-[#261D1A] leading-relaxed">
                  {assistantResponse[selectedLanguage]}
                </p>
              </div>
            )}

            {/* Quick Prompts */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-[#6B5E59] uppercase tracking-wider block">
                {t.dashboard.faqTitle}
              </span>
              <div className="space-y-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleAskMelaPrompt('orders')}
                  className="w-full text-left p-2 rounded-xl bg-stone-50 hover:bg-[#1B4D3E]/5 border border-stone-200 text-[#261D1A] font-medium flex items-center justify-between cursor-pointer"
                >
                  <span>📦 {t.dashboard.quickQuestionOrders}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#6B5E59]" />
                </button>
                <button
                  type="button"
                  onClick={() => handleAskMelaPrompt('pricing')}
                  className="w-full text-left p-2 rounded-xl bg-stone-50 hover:bg-[#1B4D3E]/5 border border-stone-200 text-[#261D1A] font-medium flex items-center justify-between cursor-pointer"
                >
                  <span>💰 {t.dashboard.quickQuestionPricing}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#6B5E59]" />
                </button>
                <button
                  type="button"
                  onClick={() => handleAskMelaPrompt('demand')}
                  className="w-full text-left p-2 rounded-xl bg-stone-50 hover:bg-[#1B4D3E]/5 border border-stone-200 text-[#261D1A] font-medium flex items-center justify-between cursor-pointer"
                >
                  <span>📈 {t.dashboard.quickQuestionDemand}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#6B5E59]" />
                </button>
              </div>
            </div>

            <PrimaryButton
              onClick={() => {
                stopSpeaking();
                setIsAssistantOpen(false);
              }}
            >
              {t.common.close}
            </PrimaryButton>
          </div>
        </div>
      )}

    </div>
  );
};
