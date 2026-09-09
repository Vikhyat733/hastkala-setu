import React, { useState, useEffect } from 'react';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShoppingBag,
  ArrowLeft,
  X,
  MapPin,
  Phone,
  User,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Ban,
  Check,
  Send,
  Box,
  Gift,
} from 'lucide-react';
import { useMela } from '../../context/MelaContext';
import { AppHeader } from '../../core/design-system/AppHeader';
import { PrimaryButton } from '../../core/design-system/PrimaryButton';
import { orderService, Order, OrderStatus } from '../../services/orders/orderService';
import { formatCurrency } from '../../utils/currency';

export const MyOrdersScreen: React.FC = () => {
  const { selectedLanguage, setLanguage, currentUser, navigate, t, goBack } = useMela();
  const lang = selectedLanguage;
  const nextLangMap = { hi: 'en', en: 'mr', mr: 'bn', bn: 'hi' } as const;

  const [activeTab, setActiveTab] = useState<'artisan' | 'buyer'>('artisan');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const all = await orderService.listOrders();
      setOrders(all);
    } catch (err) {
      console.warn('Fetch orders error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const artisanOrders = orders.filter((o) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'NEW') return o.status === 'PENDING';
    if (statusFilter === 'PREPARING') return o.status === 'ACCEPTED' || o.status === 'PREPARING';
    if (statusFilter === 'READY') return o.status === 'READY_TO_DISPATCH';
    if (statusFilter === 'DISPATCHED') return o.status === 'DISPATCHED';
    if (statusFilter === 'COMPLETED') return o.status === 'DELIVERED' || o.status === 'COMPLETED';
    if (statusFilter === 'CANCELLED') return o.status === 'CANCELLED';
    return true;
  });

  const buyerOrders = orders; // Buyer can track all placed orders

  // Status progression action handler
  const handleUpdateStatus = async (orderId: string, nextStatus: OrderStatus) => {
    setIsActionLoading(orderId);
    setActionMessage(null);
    try {
      const updated = await orderService.updateOrderStatus(orderId, nextStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      if (selectedOrderForTracking && selectedOrderForTracking.id === orderId) {
        setSelectedOrderForTracking(updated);
      }
      const msgMap = {
        hi: 'ऑर्डर की स्थिति अपडेट कर दी गई।',
        en: 'Order status updated successfully.',
        mr: 'ऑर्डरची स्थिती यशस्वीरित्या अपडेट केली.',
        bn: 'অর্ডারের স্থিতি সফলভাবে আপডেট করা হয়েছে।',
      };
      setActionMessage(msgMap[selectedLanguage as keyof typeof msgMap]);
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Status update failed');
    } finally {
      setIsActionLoading(null);
    }
  };

  // Cancel order action handler
  const handleCancelOrder = async (orderId: string) => {
    const confirmMsgMap = {
      hi: 'क्या आप निश्चित रूप से इस ऑर्डर को रद्द करना चाहते हैं? स्टॉक वापस जोड़ दिया जाएगा।',
      en: 'Are you sure you want to cancel this order? Stock will be restored.',
      mr: 'तुम्हाला खात्री आहे की तुम्ही ही ऑर्डर रद्द करू इच्छिता? स्टॉक परत जोडला जाईल.',
      bn: 'আপনি কি নিশ্চিত যে এই অর্ডারটি বাতিল করতে চান? স্টক পুনর্বহাল করা হবে।',
    };
    if (!window.confirm(confirmMsgMap[selectedLanguage as keyof typeof confirmMsgMap])) return;

    setIsActionLoading(orderId);
    try {
      const cancelled = await orderService.cancelOrder(orderId);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? cancelled : o)));
      if (selectedOrderForTracking && selectedOrderForTracking.id === orderId) {
        setSelectedOrderForTracking(cancelled);
      }
      const cancelSuccessMap = {
        hi: 'ऑर्डर रद्द कर दिया गया। स्टॉक वापस जोड़ दिया गया।',
        en: 'Order cancelled. Product stock restored.',
        mr: 'ऑर्डर रद्द केली. स्टॉक परत जोडला गेला.',
        bn: 'অর্ডার বাতিল করা হয়েছে। স্টক পুনরুদ্ধার করা হয়েছে।',
      };
      setActionMessage(cancelSuccessMap[selectedLanguage as keyof typeof cancelSuccessMap]);
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Cancellation failed');
    } finally {
      setIsActionLoading(null);
    }
  };

  // Canonical Timeline Steps Definition
  const TIMELINE_STEPS: { key: OrderStatus; label: string; desc: string }[] = [
    {
      key: 'PENDING',
      label: t.orders.placed || 'Order Placed',
      desc: selectedLanguage === 'mr' ? 'ग्राहकाने ऑर्डर दिली आहे.' : selectedLanguage === 'bn' ? 'ক্রেতা অর্ডার জমা দিয়েছেন।' : selectedLanguage === 'hi' ? 'ग्राहक ने ऑर्डर दिया है।' : 'Buyer submitted the order.',
    },
    {
      key: 'ACCEPTED',
      label: t.orders.accepted || 'Accepted by Artisan',
      desc: selectedLanguage === 'mr' ? 'कारागिराने ऑर्डर स्वीकारली आहे.' : selectedLanguage === 'bn' ? 'কারিগর অর্ডার গ্রহণ করেছেন।' : selectedLanguage === 'hi' ? 'कारीगर ने ऑर्डर स्वीकार कर लिया।' : 'Artisan confirmed the request.',
    },
    {
      key: 'PREPARING',
      label: t.orders.preparing || 'Preparing Product',
      desc: selectedLanguage === 'mr' ? 'कारागीर वस्तू तयार करत आहेत.' : selectedLanguage === 'bn' ? 'কারিগর পণ্য প্রস্তুত করছেন।' : selectedLanguage === 'hi' ? 'कारीगर हस्तशिल्प तैयार कर रहे हैं।' : 'Artisan is handcrafting the item.',
    },
    {
      key: 'READY_TO_DISPATCH',
      label: t.orders.readyToDispatch || 'Ready to Dispatch',
      desc: selectedLanguage === 'mr' ? 'माल पाठवण्यासाठी तयार आहे.' : selectedLanguage === 'bn' ? 'পণ্য পাঠানোর জন্য প্রস্তুত।' : selectedLanguage === 'hi' ? 'सामान पैक होकर तैयार है।' : 'Packed and ready for pickup.',
    },
    {
      key: 'DISPATCHED',
      label: t.orders.dispatched || 'Dispatched',
      desc: selectedLanguage === 'mr' ? 'माल पाठवला गेला आहे.' : selectedLanguage === 'bn' ? 'পণ্য পাঠানো হয়েছে।' : selectedLanguage === 'hi' ? 'सामान गंतव्य की ओर निकल चुका है।' : 'In transit to delivery address.',
    },
    {
      key: 'DELIVERED',
      label: t.orders.completed || 'Delivered / Completed',
      desc: selectedLanguage === 'mr' ? 'ग्राहकाला माल मिळाला आहे.' : selectedLanguage === 'bn' ? 'ক্রেতার কাছে পণ্য পৌঁছেছে।' : selectedLanguage === 'hi' ? 'ग्राहक को सामान मिल गया है।' : 'Package delivered to buyer.',
    },
  ];

  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'ACCEPTED':
        return 1;
      case 'PREPARING':
        return 2;
      case 'READY_TO_DISPATCH':
        return 3;
      case 'DISPATCHED':
        return 4;
      case 'DELIVERED':
      case 'COMPLETED':
        return 5;
      case 'CANCELLED':
        return -1;
      default:
        return 0;
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-700" />
            {t.orders.pending}
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 text-[10px] font-black flex items-center gap-1">
            <Check className="w-3 h-3 text-blue-700" />
            {t.orders.accepted}
          </span>
        );
      case 'PREPARING':
        return (
          <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-900 text-[10px] font-black flex items-center gap-1">
            <Box className="w-3 h-3 text-indigo-700" />
            {t.orders.preparing}
          </span>
        );
      case 'READY_TO_DISPATCH':
        return (
          <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 text-[10px] font-black flex items-center gap-1">
            <Package className="w-3 h-3 text-purple-700" />
            {t.orders.readyToDispatch}
          </span>
        );
      case 'DISPATCHED':
        return (
          <span className="px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-900 text-[10px] font-black flex items-center gap-1">
            <Truck className="w-3 h-3 text-cyan-700" />
            {t.orders.dispatched}
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black flex items-center gap-1">
            <Gift className="w-3 h-3 text-emerald-700" />
            {t.orders.delivered}
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-amber-300" />
            {t.orders.completed}
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-[10px] font-black flex items-center gap-1">
            <Ban className="w-3 h-3 text-red-600" />
            {selectedLanguage === 'hi' ? 'रद्द (Cancelled)' : 'Cancelled'}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-between pb-12">
      <AppHeader
        title={t.orders.myOrders}
        subtitle="MELA Order Hub"
        onBack={() => navigate('/dashboard')}
        showLanguageToggle={true}
        currentLanguage={selectedLanguage}
        onLanguageToggle={() => setLanguage(nextLangMap[selectedLanguage])}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-5 pb-20 md:pb-6">
        {/* Notice alert */}
        {actionMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* ── ROLE TAB SWITCHER: Artisan (Incoming) vs Buyer (Purchases) ── */}
        <div className="bg-[#EDE5DA] p-1 rounded-2xl flex gap-1 border border-[#E0D8CE]">
          <button
            type="button"
            onClick={() => setActiveTab('artisan')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'artisan'
                ? 'bg-[#1B4D3E] text-white shadow-sm'
                : 'text-[#6B5E59] hover:text-[#261D1A]'
            }`}
          >
            📦 {t.orders.artisanOrdersTab || (selectedLanguage === 'hi' ? 'प्राप्त ऑर्डर (कारीगर)' : selectedLanguage === 'mr' ? 'प्राप्त ऑर्डर्स (कारागीर)' : selectedLanguage === 'bn' ? 'গৃহীত অর্ডার (কারিগর)' : 'Artisan Orders')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('buyer')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'buyer'
                ? 'bg-[#1B4D3E] text-white shadow-sm'
                : 'text-[#6B5E59] hover:text-[#261D1A]'
            }`}
          >
            🛍️ {t.orders.buyerOrdersTab || (selectedLanguage === 'hi' ? 'मेरी खरीदारी (ट्रैक)' : selectedLanguage === 'mr' ? 'माझी खरेदी (ट्रॅक)' : selectedLanguage === 'bn' ? 'আমার কেনাকাটা (ট্র্যাক)' : 'My Purchases')}
          </button>
        </div>

        {/* ── ARTISAN VIEW: Filter Chips ── */}
        {activeTab === 'artisan' && (
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] font-black no-scrollbar">
            {[
              { id: 'ALL', labelHi: 'सभी', labelEn: 'All' },
              { id: 'NEW', labelHi: 'नया', labelEn: 'New' },
              { id: 'PREPARING', labelHi: 'तैयारी में', labelEn: 'Preparing' },
              { id: 'READY', labelHi: 'तैयार', labelEn: 'Ready' },
              { id: 'COMPLETED', labelHi: 'पूर्ण', labelEn: 'Completed' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatusFilter(f.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  statusFilter === f.id
                    ? 'bg-[#C04B27] border-[#C04B27] text-white shadow-xs'
                    : 'bg-white border-[#E0D8CE] text-[#6B5E59] hover:border-[#C04B27]'
                }`}
              >
                {selectedLanguage === 'hi' ? f.labelHi : f.labelEn}
              </button>
            ))}
          </div>
        )}

        {/* ── ORDER LIST ── */}
        {isLoading ? (
          <div className="py-12 text-center text-[#6B5E59] space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#1B4D3E]" />
            <p className="text-xs font-bold">{selectedLanguage === 'hi' ? 'ऑर्डर लोड हो रहे हैं...' : 'Loading orders...'}</p>
          </div>
        ) : (activeTab === 'artisan' ? artisanOrders : buyerOrders).length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border-2 border-dashed border-[#E0D8CE] text-center space-y-4">
            <div className="text-5xl">📭</div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-[#261D1A]">
                {activeTab === 'artisan'
                  ? (selectedLanguage === 'hi' ? 'अभी कोई नया ऑर्डर नहीं है।' : 'No incoming customer orders yet.')
                  : (selectedLanguage === 'hi' ? 'अभी आपका कोई ऑर्डर नहीं है।' : 'You have not placed any orders yet.')}
              </h3>
              <p className="text-xs text-[#6B5E59]">
                {activeTab === 'artisan'
                  ? (selectedLanguage === 'hi' ? 'ग्राहकों द्वारा ऑर्डर दिए जाने पर यहाँ दिखाई देंगे।' : 'When buyers purchase your items, they will appear here.')
                  : (selectedLanguage === 'hi' ? 'मेला बाज़ार से प्रामाणिक हस्तशिल्प खरीदें।' : 'Browse MELA marketplace to discover handcrafted items.')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/marketplace')}
              className="py-2.5 px-5 rounded-2xl bg-[#1B4D3E] text-white text-xs font-black shadow-md hover:bg-[#153e32] transition-colors"
            >
              {selectedLanguage === 'hi' ? 'बाज़ार देखें (Browse Marketplace)' : 'Browse Marketplace'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {(activeTab === 'artisan' ? artisanOrders : buyerOrders).map((order) => {
              const firstItem = order.items && order.items[0];
              const isWorking = isActionLoading === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-4 border border-[#E0D8CE] shadow-xs flex flex-col justify-between hover:shadow-md transition-all space-y-4 h-full"
                >
                  <div className="space-y-4">
                    {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-black text-[#1B4D3E]">
                        #{order.id}
                      </span>
                      <span className="text-[10px] text-[#6B5E59]">
                        • {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  {/* Product Snapshot details */}
                  <div className="flex gap-3 items-center bg-[#FAF6F0] p-2.5 rounded-2xl border border-[#EAE2D5]">
                    <img
                      src={
                        firstItem?.product_image_snapshot ||
                        'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=200'
                      }
                      alt={firstItem?.product_title_snapshot || 'Product'}
                      className="w-14 h-14 rounded-xl object-cover border border-[#E0D8CE] flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-black text-[#261D1A] truncate">
                        {firstItem?.product_title_snapshot || 'Handcrafted Craft'}
                      </h4>
                      <p className="text-xs text-[#6B5E59]">
                        {firstItem?.quantity || 1} × {formatCurrency(firstItem?.unit_price || order.total)}
                      </p>
                      <p className="text-xs font-black text-[#1B4D3E] mt-0.5">
                        {selectedLanguage === 'hi' ? 'कुल राशि: ' : 'Total: '}{formatCurrency(order.total)}
                      </p>
                    </div>
                  </div>

                  {/* Customer / Delivery Coordinates */}
                  <div className="text-[11px] text-[#6B5E59] space-y-0.5 px-1">
                    <div className="flex items-center gap-1 text-[#261D1A] font-bold">
                      <User className="w-3.5 h-3.5 text-[#C04B27]" />
                      <span>{order.shipping_name}</span>
                      <span className="font-normal text-[#6B5E59]">({order.shipping_phone})</span>
                    </div>
                    <div className="flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C04B27] flex-shrink-0 mt-0.5" />
                      <span className="truncate">
                        {order.shipping_address}, {order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}
                      </span>
                    </div>
                  </div>

                  </div>

                  {/* ── ACTION BUTTONS BASED ON ROLE & STATUS ── */}
                  <div className="pt-3 border-t border-[#F0EBE1] mt-auto flex flex-wrap gap-2 items-center justify-between">
                    {/* Buyer tracking action */}
                    <button
                      type="button"
                      onClick={() => setSelectedOrderForTracking(order)}
                      className="py-2 px-3 rounded-xl border border-[#1B4D3E] bg-[#1B4D3E]/5 text-[#1B4D3E] font-bold text-xs flex items-center gap-1 hover:bg-[#1B4D3E]/10"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>{selectedLanguage === 'hi' ? 'ऑर्डर ट्रैक करें' : 'Track Timeline'}</span>
                    </button>

                    {/* Artisan Lifecycle State Progression Buttons */}
                    {activeTab === 'artisan' && order.status !== 'CANCELLED' && (
                      <div className="flex items-center gap-1.5 ml-auto">
                        {order.status === 'PENDING' && (
                          <button
                            type="button"
                            disabled={isWorking}
                            onClick={() => handleUpdateStatus(order.id, 'ACCEPTED')}
                            className="py-2 px-3.5 rounded-xl bg-[#1B4D3E] text-white font-black text-xs hover:bg-[#143d31] active:scale-95 transition-all"
                          >
                            {selectedLanguage === 'hi' ? '✓ स्वीकार करें (Accept)' : '✓ Accept Order'}
                          </button>
                        )}

                        {order.status === 'ACCEPTED' && (
                          <button
                            type="button"
                            disabled={isWorking}
                            onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                            className="py-2 px-3.5 rounded-xl bg-[#C04B27] text-white font-black text-xs hover:bg-[#a53f1f] active:scale-95 transition-all"
                          >
                            {selectedLanguage === 'hi' ? '🔨 सामान तैयार करें' : '🔨 Start Preparing'}
                          </button>
                        )}

                        {order.status === 'PREPARING' && (
                          <button
                            type="button"
                            disabled={isWorking}
                            onClick={() => handleUpdateStatus(order.id, 'READY_TO_DISPATCH')}
                            className="py-2 px-3.5 rounded-xl bg-purple-700 text-white font-black text-xs hover:bg-purple-800 active:scale-95 transition-all"
                          >
                            {selectedLanguage === 'hi' ? '📦 तैयार है (Mark Ready)' : '📦 Mark Ready'}
                          </button>
                        )}

                        {order.status === 'READY_TO_DISPATCH' && (
                          <button
                            type="button"
                            disabled={isWorking}
                            onClick={() => handleUpdateStatus(order.id, 'DISPATCHED')}
                            className="py-2 px-3.5 rounded-xl bg-cyan-800 text-white font-black text-xs hover:bg-cyan-900 active:scale-95 transition-all"
                          >
                            {selectedLanguage === 'hi' ? '🚚 सामान भेजें (Dispatch)' : '🚚 Mark Dispatched'}
                          </button>
                        )}

                        {order.status === 'DISPATCHED' && (
                          <button
                            type="button"
                            disabled={isWorking}
                            onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                            className="py-2 px-3.5 rounded-xl bg-emerald-700 text-white font-black text-xs hover:bg-emerald-800 active:scale-95 transition-all"
                          >
                            {selectedLanguage === 'hi' ? '🎁 पहुंचा दिया (Demo)' : '🎁 Mark Delivered (Demo)'}
                          </button>
                        )}

                        {order.status === 'DELIVERED' && (
                          <button
                            type="button"
                            disabled={isWorking}
                            onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                            className="py-2 px-3.5 rounded-xl bg-emerald-800 text-white font-black text-xs hover:bg-emerald-900 active:scale-95 transition-all"
                          >
                            {selectedLanguage === 'hi' ? '🎉 पूरा करें (Complete)' : '🎉 Complete Order'}
                          </button>
                        )}

                        {/* Cancellation option before dispatched */}
                        {['PENDING', 'ACCEPTED', 'PREPARING', 'READY_TO_DISPATCH'].includes(order.status) && (
                          <button
                            type="button"
                            disabled={isWorking}
                            onClick={() => handleCancelOrder(order.id)}
                            className="py-2 px-2.5 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 text-[11px] font-bold"
                            title="Cancel Order"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="pt-2">
          <PrimaryButton onClick={() => navigate('/marketplace')}>
            <span className="flex items-center justify-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              {selectedLanguage === 'hi' ? 'बाज़ार से और सामान देखें' : 'Explore Marketplace'}
            </span>
          </PrimaryButton>
        </div>
      </main>

      {/* ── VISUAL ORDER TRACKING TIMELINE MODAL ── */}
      {selectedOrderForTracking && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 md:p-6 border-2 border-[#1B4D3E] shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
              <div>
                <h3 className="text-base font-black text-[#1B4D3E] flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#C04B27]" />
                  {selectedLanguage === 'hi' ? 'ऑर्डर ट्रैकिंग' : 'Order Tracking Timeline'}
                </h3>
                <p className="text-[11px] text-[#6B5E59] font-mono">
                  #{selectedOrderForTracking.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderForTracking(null)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Status Badge & Notice */}
            <div className="flex items-center justify-between bg-[#FAF6F0] p-3 rounded-2xl border border-[#E0D8CE]">
              <span className="text-xs font-bold text-[#6B5E59]">
                {selectedLanguage === 'hi' ? 'वर्तमान स्थिति:' : 'Current Status:'}
              </span>
              {getStatusBadge(selectedOrderForTracking.status)}
            </div>

            {/* ── VISUAL TIMELINE STEPPER ── */}
            {selectedOrderForTracking.status !== 'CANCELLED' ? (
              <div className="py-2 px-1 space-y-4">
                {TIMELINE_STEPS.map((step, idx) => {
                  const currentIdx = getStepIndex(selectedOrderForTracking.status);
                  const isDone = currentIdx > idx || selectedOrderForTracking.status === 'COMPLETED';
                  const isCurrent = currentIdx === idx && selectedOrderForTracking.status !== 'COMPLETED';

                  return (
                    <div key={step.key} className="flex items-start gap-3 relative">
                      {/* Vertical line connecting steps */}
                      {idx < TIMELINE_STEPS.length - 1 && (
                        <div
                          className={`absolute left-3.5 top-7 bottom-0 w-0.5 -mb-4 ${
                            isDone ? 'bg-[#1B4D3E]' : 'bg-stone-200'
                          }`}
                        />
                      )}

                      {/* Step Indicator Circle */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 z-10 transition-all ${
                          isDone
                            ? 'bg-[#1B4D3E] text-white shadow-sm'
                            : isCurrent
                            ? 'bg-[#C04B27] text-white ring-4 ring-[#C04B27]/20 shadow-md animate-pulse'
                            : 'bg-stone-100 text-stone-400 border border-stone-300'
                        }`}
                      >
                        {isDone ? '✓' : isCurrent ? '●' : '○'}
                      </div>

                      {/* Step Text Info */}
                      <div className="flex-1 min-w-0 pb-1">
                        <h5
                          className={`text-xs font-black ${
                            isDone || isCurrent ? 'text-[#261D1A]' : 'text-stone-400'
                          }`}
                        >
                          {step.label}
                        </h5>
                        <p className="text-[11px] text-[#6B5E59] leading-snug">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-center space-y-1 text-red-800">
                <Ban className="w-8 h-8 text-red-600 mx-auto" />
                <h4 className="text-sm font-black">{selectedLanguage === 'hi' ? 'यह ऑर्डर रद्द किया जा चुका है' : 'Order Cancelled'}</h4>
                <p className="text-xs text-red-700">
                  {selectedLanguage === 'hi'
                    ? 'स्टॉक को पुनः उपलब्ध करवा दिया गया है।'
                    : 'The stock has been restored to the artisan inventory.'}
                </p>
              </div>
            )}

            {/* Order Price & Snapshot Details */}
            <div className="p-3.5 bg-[#FAF6F0] rounded-2xl border border-[#E0D8CE] space-y-2 text-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#6B5E59] block">
                {selectedLanguage === 'hi' ? 'खरीद के समय का विवरण (Price Snapshot):' : 'Purchase Snapshot:'}
              </span>
              {selectedOrderForTracking.items?.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-[#261D1A]">
                  <span className="font-bold truncate max-w-[200px]">{item.product_title_snapshot}</span>
                  <span>{item.quantity} × {formatCurrency(item.unit_price)} = {formatCurrency(item.subtotal)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-1.5 border-t border-[#E8E2D9] font-black text-sm text-[#1B4D3E]">
                <span>{selectedLanguage === 'hi' ? 'कुल देय राशि:' : 'Total Amount:'}</span>
                <span>{formatCurrency(selectedOrderForTracking.total)}</span>
              </div>
            </div>

            {/* Buyer cancellation button if allowed */}
            {['PENDING', 'ACCEPTED', 'PREPARING', 'READY_TO_DISPATCH'].includes(selectedOrderForTracking.status) && (
              <button
                type="button"
                onClick={() => handleCancelOrder(selectedOrderForTracking.id)}
                className="w-full py-2.5 px-4 rounded-xl border border-red-300 text-red-600 font-bold text-xs hover:bg-red-50 transition-colors"
              >
                {lang === 'hi' ? 'यह ऑर्डर रद्द करें (Cancel Order)' : 'Cancel Order'}
              </button>
            )}

            <PrimaryButton onClick={() => setSelectedOrderForTracking(null)}>
              <span>{lang === 'hi' ? 'बंद करें (Close)' : 'Close'}</span>
            </PrimaryButton>
          </div>
        </div>
      )}
    </div>
  );
};

