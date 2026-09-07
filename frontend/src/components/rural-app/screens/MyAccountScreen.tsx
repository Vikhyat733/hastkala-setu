import React, { useState } from 'react';
import { User, ClipboardList, Wallet, HelpCircle, Globe, LogOut, ChevronRight, Phone, ShieldCheck, Volume2 } from 'lucide-react';
import { RuralArtisanUser } from '../data/ruralAppDefaults';
import { speakText, playSoundEffect } from '../../../services/voiceAssistant';
import { useMarketplace } from '../../../context/MarketplaceContext';

interface MyAccountScreenProps {
  artisan: RuralArtisanUser;
  onSelectLanguageChange: () => void;
  onLogout: () => void;
}

export const MyAccountScreen: React.FC<MyAccountScreenProps> = ({
  artisan,
  onSelectLanguageChange,
  onLogout
}) => {
  const { t, activeLanguage } = useMarketplace();
  const [activeModal, setActiveModal] = useState<'earnings' | 'orders' | 'help' | null>(null);

  const handleVoiceProfile = () => {
    playSoundEffect('tap');
    if (activeLanguage === 'en') {
      speakText(`Hello ${artisan.name}! Your total earnings are eighteen thousand four hundred and fifty rupees. For assistance, contact village coordinator Ramesh Kumar.`);
    } else {
      speakText(`नमस्ते ${artisan.name}! आपकी कुल कमाई अठारह हज़ार चार सौ पचास रुपये है। सहायता के लिए ग्राम समन्वयक रमेश कुमार से संपर्क करें।`);
    }
  };

  return (
    <div className="min-h-full flex flex-col justify-between bg-[#FAF6ED] text-[#2C241E] select-none p-4 sm:p-6 space-y-6 w-full">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <h1 className="text-xl sm:text-2xl font-black text-[#1E3A1E] font-sans">
          {t('myAccount')}
        </h1>

        <button
          onClick={handleVoiceProfile}
          className="p-2.5 rounded-2xl bg-[#E8F0E3] border border-[#3A6B35]/30 text-[#3A6B35] shadow-sm hover:bg-[#DCEAD5]"
          title="Listen"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Top Section: Profile Card & Earnings Summary in Responsive 2-column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Artisan Profile Card */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-[#E5DAC8] shadow-sm flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <img
              src={artisan.avatar}
              alt={artisan.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#3A6B35] shadow-sm"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#3A6B35] text-white flex items-center justify-center text-[10px] shadow">
              ✓
            </div>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#1E3A1E] leading-tight flex items-center gap-1.5">
              <span>{artisan.name}</span>
              <ShieldCheck className="w-4 h-4 text-[#3A6B35]" />
            </h2>
            <p className="text-xs font-bold text-[#5A4838] mt-1">
              📱 {artisan.phone}
            </p>
            <p className="text-xs font-semibold text-[#8A7B6E] mt-0.5">
              🏡 {t('village')}: {artisan.village}, {artisan.state}
            </p>
          </div>
        </div>

        {/* Quick Earnings Summary Widget */}
        <div 
          onClick={() => {
            playSoundEffect('tap');
            setActiveModal('earnings');
          }}
          className="p-5 rounded-3xl bg-gradient-to-r from-[#2C5E43] to-[#1E4732] text-white shadow-md flex items-center justify-between cursor-pointer hover:shadow-lg transition-all active:scale-[0.99]"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-2xl flex-shrink-0">
              💰
            </div>
            <div>
              <p className="text-xs font-bold text-white/80">
                {t('totalEarnings')}
              </p>
              <p className="text-2xl sm:text-3xl font-black text-amber-300 mt-0.5">
                ₹{artisan.totalEarnings.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <ChevronRight className="w-6 h-6 text-white/80" />
        </div>

      </div>

      {/* Touch Menu Options List — Responsive 2-column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        {/* 1. Profile */}
        <button
          onClick={() => {
            playSoundEffect('tap');
            if (activeLanguage === 'en') {
              speakText(`Name: ${artisan.name}, Village: ${artisan.village}, State: ${artisan.state}`);
            } else {
              speakText(`नाम: ${artisan.name}, गाँव: ${artisan.village}, राज्य: ${artisan.state}`);
            }
          }}
          className="w-full p-4 rounded-2xl bg-white border border-[#E5DAC8] shadow-sm flex items-center justify-between hover:border-[#3A6B35]/40 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#FAF0DD] text-[#935213]">
              <User className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-[#2C241E] text-sm">
              {t('myProfile')}
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-[#8A7B6E]" />
        </button>

        {/* 2. Orders */}
        <button
          onClick={() => {
            playSoundEffect('tap');
            setActiveModal('orders');
          }}
          className="w-full p-4 rounded-2xl bg-white border border-[#E5DAC8] shadow-sm flex items-center justify-between hover:border-[#3A6B35]/40 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#EEF6EB] text-[#3A6B35]">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-[#2C241E] text-sm block">
                {t('myOrders')}
              </span>
              <span className="text-[10px] font-bold text-[#3A6B35]">
                {artisan.totalOrders} {t('ordersCompleted')}
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#8A7B6E]" />
        </button>

        {/* 3. Payment */}
        <button
          onClick={() => {
            playSoundEffect('tap');
            setActiveModal('earnings');
          }}
          className="w-full p-4 rounded-2xl bg-white border border-[#E5DAC8] shadow-sm flex items-center justify-between hover:border-[#3A6B35]/40 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#FFF9E6] text-[#E67E22]">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-[#2C241E] text-sm block">
                {t('paymentEarnings')}
              </span>
              <span className="text-[10px] font-bold text-[#7D6E5D]">
                {t('bankAccount')}: {artisan.bankName}
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#8A7B6E]" />
        </button>

        {/* 4. Help & Coordinator */}
        <button
          onClick={() => {
            playSoundEffect('tap');
            setActiveModal('help');
          }}
          className="w-full p-4 rounded-2xl bg-white border border-[#E5DAC8] shadow-sm flex items-center justify-between hover:border-[#3A6B35]/40 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#F4EEF9] text-[#7B4BA4]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-[#2C241E] text-sm block">
                {t('helpAndCoordinator')}
              </span>
              <span className="text-[10px] font-bold text-[#7B4BA4]">
                {t('phoneHelpAvailable')}
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#8A7B6E]" />
        </button>

        {/* 5. Language */}
        <button
          onClick={() => {
            playSoundEffect('tap');
            onSelectLanguageChange();
          }}
          className="w-full p-4 rounded-2xl bg-white border border-[#E5DAC8] shadow-sm flex items-center justify-between hover:border-[#3A6B35]/40 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#E8F0E3] text-[#3A6B35]">
              <Globe className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-[#2C241E] text-sm">
              {t('changeLanguage')}
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-[#8A7B6E]" />
        </button>

        {/* 6. Logout */}
        <button
          onClick={() => {
            playSoundEffect('tap');
            onLogout();
          }}
          className="w-full p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 shadow-sm flex items-center justify-center gap-2 font-black text-sm hover:bg-rose-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('logout')}</span>
        </button>

      </div>

      {/* EARNINGS MODAL */}
      {activeModal === 'earnings' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF6ED] w-full max-w-md rounded-3xl p-6 border-2 border-[#E5DAC8] shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[#1E3A1E]">{t('earningsAndBank')}</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-lg font-black">✕</button>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E5DAC8] space-y-3">
              <p className="text-xs font-bold text-[#7D6E5D]">{t('totalReceived')}</p>
              <p className="text-3xl font-black text-[#3A6B35]">₹{artisan.totalEarnings.toLocaleString('en-IN')}</p>
              <div className="pt-3 border-t border-[#E5DAC8] text-xs font-semibold text-[#5A4838] space-y-1">
                <p>{t('bankName')}: {artisan.bankName}</p>
                <p>{t('accountNumber')}: {artisan.accountNumberMasked} ({t('verified')})</p>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3.5 rounded-xl bg-[#3A6B35] text-white font-bold"
            >
              {t('ok')}
            </button>
          </div>
        </div>
      )}

      {/* HELP / GRAM SAMANVAYAK MODAL */}
      {activeModal === 'help' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF6ED] w-full max-w-md rounded-3xl p-6 border-2 border-[#E5DAC8] shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[#1E3A1E]">{t('villageCoordinatorHelp')}</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-lg font-black">✕</button>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E5DAC8] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#FAF0DD] flex items-center justify-center text-2xl flex-shrink-0">
                  👨‍💼
                </div>
                <div>
                  <h4 className="font-extrabold text-[#1E3A1E] text-sm">{artisan.sahayakName}</h4>
                  <p className="text-xs text-[#7D6E5D]">{artisan.village} {t('serviceCenterLabel')}</p>
                </div>
              </div>

              <a
                href={`tel:${artisan.sahayakPhone}`}
                className="w-full py-3.5 rounded-xl bg-[#3A6B35] text-white font-bold flex items-center justify-center gap-2 shadow"
              >
                <Phone className="w-4 h-4" />
                <span>{t('callCoordinator')} ({artisan.sahayakPhone})</span>
              </a>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 rounded-xl bg-white border border-[#E5DAC8] text-[#3B3026] font-bold text-sm"
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}

      {/* ORDERS MODAL */}
      {activeModal === 'orders' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF6ED] w-full max-w-md rounded-3xl p-6 border-2 border-[#E5DAC8] shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[#1E3A1E]">{t('customerOrders')}</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-lg font-black">✕</button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-white rounded-2xl border border-[#E5DAC8]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#1E3A1E]">{t('orderLabel')} #HK-8821</span>
                  <span className="text-[10px] font-black text-[#3A6B35] bg-[#E8F0E3] px-2 py-0.5 rounded">{t('delivered')}</span>
                </div>
                <p className="text-xs font-bold text-[#5A4838] mt-1">बाँस की टोकरी (x1) • ₹800</p>
                <p className="text-[10px] text-[#8A7B6E] mt-0.5">{t('customerLabel')}: अनिता शर्मा (दिल्ली)</p>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-[#E5DAC8]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#1E3A1E]">{t('orderLabel')} #HK-7914</span>
                  <span className="text-[10px] font-black text-[#3A6B35] bg-[#E8F0E3] px-2 py-0.5 rounded">{t('paymentReceived')}</span>
                </div>
                <p className="text-xs font-bold text-[#5A4838] mt-1">मिट्टी का घड़ा (x2) • ₹1,200</p>
                <p className="text-[10px] text-[#8A7B6E] mt-0.5">{t('customerLabel')}: विक्रम सिंह (जयपुर)</p>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3.5 rounded-xl bg-[#3A6B35] text-white font-bold text-sm"
            >
              {t('ok')}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
