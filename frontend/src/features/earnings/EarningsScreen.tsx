import React, { useState, useEffect } from 'react';
import {
  Coins,
  TrendingUp,
  Package,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Calendar,
  CreditCard,
  Building2,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Plus,
  X,
  User,
  MapPin,
  Sparkles,
  ShoppingBag,
  Camera,
} from 'lucide-react';
import { useMela } from '../../context/MelaContext';
import { AppHeader } from '../../core/design-system/AppHeader';
import { PrimaryButton } from '../../core/design-system/PrimaryButton';
import {
  earningsService,
  EarningsSummary,
  RecentSaleItem,
  PayoutAccount,
  TimePeriod,
} from '../../services/earnings/earningsService';
import { formatCurrency } from '../../utils/currency';

export const EarningsScreen: React.FC = () => {
  const { selectedLanguage, setLanguage, currentUser, navigate, t, goBack } = useMela();
  const nextLangMap = { hi: 'en', en: 'mr', mr: 'bn', bn: 'hi' } as const;

  const [period, setPeriod] = useState<TimePeriod>('this_month');
  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [recentSales, setRecentSales] = useState<RecentSaleItem[]>([]);
  const [payoutAccount, setPayoutAccount] = useState<PayoutAccount | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Payout configuration modal
  const [showPayoutModal, setShowPayoutModal] = useState<boolean>(false);
  const [payoutName, setPayoutName] = useState<string>('');
  const [payoutUpi, setPayoutUpi] = useState<string>('');
  const [payoutBank, setPayoutBank] = useState<string>('');
  const [isSavingPayout, setIsSavingPayout] = useState<boolean>(false);
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState<string | null>(null);

  // Selected sale detail modal
  const [selectedSaleDetail, setSelectedSaleDetail] = useState<RecentSaleItem | null>(null);

  const loadEarningsData = async (selectedPeriod: TimePeriod = period) => {
    setIsLoading(true);
    try {
      const [sum, recent, payout] = await Promise.all([
        earningsService.getSummary(selectedPeriod, currentUser?.id),
        earningsService.getRecentSales(10, currentUser?.id),
        earningsService.getPayoutAccount(currentUser?.id),
      ]);
      setSummary(sum);
      setRecentSales(recent);
      setPayoutAccount(payout);
      if (payout.account_holder_name) setPayoutName(payout.account_holder_name);
      if (payout.upi_id) setPayoutUpi(payout.upi_id);
      if (payout.bank_name) setPayoutBank(payout.bank_name);
    } catch (err) {
      console.warn('Earnings load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEarningsData(period);
  }, [period]);

  const handlePeriodChange = (newPeriod: TimePeriod) => {
    setPeriod(newPeriod);
  };

  const handleSavePayoutAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutName.trim()) {
      alert(t.errors.nameRequired || 'Please enter account holder name');
      return;
    }
    if (!payoutUpi.trim() && !payoutBank.trim()) {
      alert(t.errors.fieldRequired || 'Please enter UPI ID or bank name');
      return;
    }

    setIsSavingPayout(true);
    try {
      const updated = await earningsService.savePayoutAccount(
        {
          account_holder_name: payoutName.trim(),
          payout_type: 'UPI',
          upi_id: payoutUpi.trim() || undefined,
          bank_name: payoutBank.trim() || undefined,
          is_verified: true,
        },
        currentUser?.id
      );
      setPayoutAccount(updated);
      setPayoutSuccessMsg(t.earnings.payoutSavedSuccess || 'Payout account saved successfully.');
      setTimeout(() => {
        setPayoutSuccessMsg(null);
        setShowPayoutModal(false);
      }, 2000);
    } catch (err: any) {
      console.warn('Save payout account error:', err);
      alert(t.errors.networkError || 'Failed to save payout account');
    } finally {
      setIsSavingPayout(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-between pb-12">
      {/* Top Header */}
      <AppHeader
        title={t.earnings.title}
        subtitle="MELA Business"
        onBack={() => navigate('/dashboard')}
        showLanguageToggle={true}
        currentLanguage={selectedLanguage}
        onLanguageToggle={() => setLanguage(nextLangMap[selectedLanguage])}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 space-y-5 pb-20 md:pb-6">
        <div className="md:grid md:grid-cols-12 md:gap-6 space-y-5 md:space-y-0">
          
          {/* Left Column */}
          <div className="md:col-span-7 space-y-5">
        {/* ─── 1. TIME PERIOD TABS ─── */}
        <div className="bg-[#EDE5DA] p-1 rounded-2xl flex gap-1 border border-[#E0D8CE]">
          {[
            { id: 'this_month', label: t.earnings.thisMonth },
            { id: 'last_month', label: t.earnings.lastMonth },
            { id: 'all_time', label: t.earnings.allTime },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handlePeriodChange(item.id as TimePeriod)}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                period === item.id
                  ? 'bg-[#1B4D3E] text-white shadow-sm'
                  : 'text-[#6B5E59] hover:text-[#261D1A]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* ─── 2. HERO SALES & EARNINGS METRIC ─── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1B4D3E] to-[#12362b] rounded-3xl p-5 text-white shadow-lg border border-[#1B4D3E]/40 space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-[11px] font-black uppercase tracking-wider text-amber-200">
              <Coins className="w-3.5 h-3.5 text-amber-300" />
              {t.earnings.totalSales}
            </span>
            <span className="text-[10px] font-bold text-stone-300 bg-white/10 px-2.5 py-0.5 rounded-full">
              {period === 'this_month' && t.earnings.thisMonth}
              {period === 'last_month' && t.earnings.lastMonth}
              {period === 'all_time' && t.earnings.allTime}
            </span>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {formatCurrency(summary?.total_sales)}
            </div>
            <p className="text-xs text-emerald-200 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />
              <span>{t.earnings.totalSalesDesc}</span>
            </p>
          </div>

          {/* Transparent Net Earnings Breakdown */}
          <div className="pt-3 border-t border-white/15 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white/10 p-2 rounded-xl">
              <span className="text-[10px] text-stone-300 block">{t.earnings.totalSales}</span>
              <span className="font-bold text-white">{formatCurrency(summary?.total_sales)}</span>
            </div>
            <div className="bg-white/10 p-2 rounded-xl">
              <span className="text-[10px] text-stone-300 block">{t.earnings.melaFee}</span>
              <span className="font-bold text-amber-300">{t.earnings.melaFeeFree}</span>
            </div>
            <div className="bg-white/10 p-2 rounded-xl">
              <span className="text-[10px] text-stone-300 block">{t.earnings.netEarnings}</span>
              <span className="font-black text-emerald-300">{formatCurrency(summary?.net_earnings)}</span>
            </div>
          </div>
        </div>

        {/* ─── 3. BUSINESS SUMMARY METRICS ─── */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Metric 1: Completed Orders */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#E0D8CE] shadow-2xs space-y-1">
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-lg font-black text-[#261D1A] block">
              {summary?.completed_orders || 0}
            </span>
            <span className="text-[10px] font-bold text-[#6B5E59] uppercase block leading-tight">
              {t.earnings.completedOrders}
            </span>
          </div>

          {/* Metric 2: Products Sold */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#E0D8CE] shadow-2xs space-y-1">
            <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <span className="text-lg font-black text-[#261D1A] block">
              {summary?.products_sold || 0}
            </span>
            <span className="text-[10px] font-bold text-[#6B5E59] uppercase block leading-tight">
              {t.earnings.productsSold}
            </span>
          </div>

          {/* Metric 3: Pending in Pipeline */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#E0D8CE] shadow-2xs space-y-1">
            <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-lg font-black text-amber-800 block">
              {summary?.pending_orders_count || 0}
            </span>
            <span className="text-[10px] font-bold text-[#6B5E59] uppercase block leading-tight">
              {t.earnings.pendingPipeline}
            </span>
          </div>
        </div>

        {/* ─── 4. PAYOUT ACCOUNT SECTION ─── */}
        <div className="bg-white rounded-3xl p-4 md:p-5 border border-[#E0D8CE] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#C04B27]/10 text-[#C04B27] flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#261D1A]">
                  {t.earnings.payoutAccount}
                </h3>
                <p className="text-[10px] text-[#6B5E59]">
                  {t.earnings.payoutAccountSub}
                </p>
              </div>
            </div>

            <span
              className={`text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 ${
                payoutAccount?.is_connected
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {payoutAccount?.is_connected ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {t.earnings.payoutConnected}
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 text-amber-600" />
                  {t.earnings.payoutNotConnected}
                </>
              )}
            </span>
          </div>

          {payoutAccount?.is_connected ? (
            <div className="p-3 bg-[#FAF6F0] rounded-2xl border border-[#E0D8CE] flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs font-black text-[#261D1A] truncate">
                  {payoutAccount.account_holder_name || currentUser?.name || 'Radha Devi'}
                </p>
                <p className="text-[11px] font-mono text-[#1B4D3E] truncate">
                  {payoutAccount.upi_id ? `UPI: ${payoutAccount.upi_id}` : payoutAccount.bank_name || 'Bank Account'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPayoutModal(true)}
                className="py-1.5 px-3 rounded-xl border border-[#E0D8CE] bg-white text-[11px] font-bold text-[#1B4D3E] hover:bg-stone-50"
              >
                {t.earnings.editPayoutBtn}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowPayoutModal(true)}
              className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-[#1B4D3E]/40 bg-[#1B4D3E]/5 text-[#1B4D3E] text-xs font-black flex items-center justify-center gap-2 hover:bg-[#1B4D3E]/10 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.earnings.connectPayoutBtn}</span>
            </button>
          )}
        </div>

        </div>

          {/* Right Column: Recent Sales */}
          <div className="md:col-span-5 space-y-5">
            {/* ─── 5. RECENT COMPLETED SALES ─── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#6B5E59]">
              {t.earnings.recentSalesTitle}
            </h3>
            <span className="text-[11px] font-bold text-[#1B4D3E]">
              {recentSales.length} {t.earnings.salesCountLabel}
            </span>
          </div>

          {isLoading ? (
            <div className="py-8 text-center text-[#6B5E59] space-y-2">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#1B4D3E]" />
              <p className="text-xs font-bold">{t.common.loading}</p>
            </div>
          ) : recentSales.length === 0 ? (
            <div className="bg-white rounded-3xl p-6 border-2 border-dashed border-[#E0D8CE] text-center space-y-3">
              <div className="text-4xl">🏷️</div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-[#261D1A]">
                  {t.earnings.emptySalesTitle}
                </h4>
                <p className="text-xs text-[#6B5E59]">
                  {t.earnings.emptySalesDesc}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/sell')}
                className="py-2.5 px-4 rounded-xl bg-[#C04B27] text-white text-xs font-black shadow-md hover:bg-[#a53f1f] transition-all cursor-pointer"
              >
                {t.earnings.sellProductCTA}
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentSales.map((sale) => (
                <div
                  key={`${sale.order_id}-${sale.product_id}`}
                  onClick={() => setSelectedSaleDetail(sale)}
                  className="bg-white rounded-2xl p-3.5 border border-[#E0D8CE] shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={
                        sale.product_image ||
                        'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=150'
                      }
                      alt={sale.product_title}
                      className="w-12 h-12 rounded-xl object-cover border border-[#E0D8CE] flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-[#261D1A] truncate group-hover:text-[#1B4D3E] transition-colors">
                        {sale.product_title}
                      </h4>
                      <p className="text-[10px] text-[#6B5E59]">
                        {sale.quantity} × {formatCurrency(sale.unit_price)} • {new Date(sale.order_date).toLocaleDateString()}
                      </p>
                      <p className="text-[10px] font-medium text-[#1B4D3E] truncate">
                        {sale.buyer_name} ({sale.buyer_location})
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-black text-[#1B4D3E] block">
                      {formatCurrency(sale.order_total)}
                    </span>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {t.orders.timelineSteps.delivered}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>

        {/* Bottom Navigation CTA */}
        <div className="pt-2">
          <PrimaryButton onClick={() => navigate('/orders')}>
            <span className="flex items-center justify-center gap-2">
              <Package className="w-5 h-5" />
              {t.orders.myOrdersTitle}
            </span>
          </PrimaryButton>
        </div>
      </main>

      {/* ─── PAYOUT ACCOUNT CONFIGURATION MODAL ─── */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 md:p-6 border-2 border-[#1B4D3E] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#1B4D3E]" />
                <h3 className="text-base font-black text-[#1B4D3E]">
                  {t.earnings.payoutModalTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPayoutModal(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {payoutSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{payoutSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSavePayoutAccount} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-[#261D1A] block mb-1">
                  {t.earnings.accountHolderLabel}
                </label>
                <input
                  type="text"
                  required
                  value={payoutName}
                  onChange={(e) => setPayoutName(e.target.value)}
                  placeholder="e.g. Radha Devi"
                  className="w-full p-2.5 text-xs rounded-xl bg-[#FAF6F0] border border-[#E0D8CE] focus:border-[#1B4D3E] focus:outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#261D1A] block mb-1">
                  {t.earnings.upiLabel}
                </label>
                <input
                  type="text"
                  value={payoutUpi}
                  onChange={(e) => setPayoutUpi(e.target.value)}
                  placeholder="e.g. radha.artisan@oksbi"
                  className="w-full p-2.5 text-xs rounded-xl bg-[#FAF6F0] border border-[#E0D8CE] focus:border-[#1B4D3E] focus:outline-hidden font-medium"
                />
                <p className="text-[10px] text-[#6B5E59] mt-0.5">
                  {t.earnings.upiHint}
                </p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#261D1A] block mb-1">
                  {t.earnings.bankNameLabel}
                </label>
                <input
                  type="text"
                  value={payoutBank}
                  onChange={(e) => setPayoutBank(e.target.value)}
                  placeholder="e.g. State Bank of India"
                  className="w-full p-2.5 text-xs rounded-xl bg-[#FAF6F0] border border-[#E0D8CE] focus:border-[#1B4D3E] focus:outline-hidden font-medium"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[10px] text-amber-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <p>
                  {t.earnings.securityNote}
                </p>
              </div>

              <div className="pt-2">
                <PrimaryButton disabled={isSavingPayout}>
                  <span>
                    {isSavingPayout
                      ? t.common.loading
                      : t.earnings.savePayoutBtn}
                  </span>
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── SALE DETAIL MODAL (Price Snapshot Breakdown) ─── */}
      {selectedSaleDetail && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 md:p-6 border-2 border-[#1B4D3E] shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
              <div>
                <h3 className="text-sm font-black text-[#1B4D3E]">
                  {t.earnings.saleSnapshotTitle}
                </h3>
                <p className="text-[10px] text-[#6B5E59] font-mono">
                  #{selectedSaleDetail.order_id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSaleDetail(null)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-3 items-center bg-[#FAF6F0] p-3 rounded-2xl border border-[#EAE2D5]">
              <img
                src={
                  selectedSaleDetail.product_image ||
                  'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=150'
                }
                alt={selectedSaleDetail.product_title}
                className="w-14 h-14 rounded-xl object-cover border border-[#E0D8CE] flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-black text-[#261D1A] truncate">
                  {selectedSaleDetail.product_title}
                </h4>
                <p className="text-xs text-[#6B5E59]">
                  {selectedSaleDetail.quantity} × {formatCurrency(selectedSaleDetail.unit_price)}
                </p>
                <p className="text-xs font-black text-[#1B4D3E] mt-0.5">
                  {t.marketplace.totalPayable}: {formatCurrency(selectedSaleDetail.order_total)}
                </p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#6B5E59]">
                <span>{t.orders.subtitle}:</span>
                <span className="font-bold text-[#261D1A]">{selectedSaleDetail.buyer_name}</span>
              </div>
              <div className="flex justify-between text-[#6B5E59]">
                <span>{t.marketplace.stepAddress}:</span>
                <span className="font-bold text-[#261D1A]">{selectedSaleDetail.buyer_location}</span>
              </div>
              <div className="flex justify-between text-[#6B5E59]">
                <span>{t.orders.timelineModalTitle}:</span>
                <span className="font-bold text-[#261D1A]">
                  {new Date(selectedSaleDetail.order_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-[#6B5E59]">
                <span>{t.orders.currentStatusLabel}:</span>
                <span className="font-black text-emerald-700">{t.orders.timelineSteps.delivered}</span>
              </div>
            </div>

            <PrimaryButton onClick={() => setSelectedSaleDetail(null)}>
              <span>{t.common.cancel || 'Close'}</span>
            </PrimaryButton>
          </div>
        </div>
      )}
    </div>
  );
};
