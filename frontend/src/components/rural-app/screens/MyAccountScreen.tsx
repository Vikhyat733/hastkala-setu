import React, { useState } from 'react';
import { User, ClipboardList, Wallet, HelpCircle, Globe, LogOut, ChevronRight, Phone, ShieldCheck, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { RuralArtisanUser } from '../data/ruralAppDefaults';
import { speakText, playSoundEffect } from '../../../services/voiceAssistant';

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
  const [activeModal, setActiveModal] = useState<'earnings' | 'orders' | 'help' | null>(null);

  const handleVoiceProfile = () => {
    playSoundEffect('tap');
    speakText(`नमस्ते ${artisan.name}! आपकी कुल कमाई अठारह हज़ार चार सौ पचास रुपये है। सहायता के लिए ग्राम समन्वयक रमेश कुमार से संपर्क करें।`);
  };

  return (
    <div className="min-h-full flex flex-col justify-between bg-[#FAF6ED] text-[#2C241E] select-none p-4 sm:p-5 space-y-4">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <h1 className="text-xl sm:text-2xl font-black text-[#1E3A1E] font-sans">
          मेरा खाता
        </h1>

        <button
          onClick={handleVoiceProfile}
          className="p-2.5 rounded-2xl bg-[#E8F0E3] border border-[#3A6B35]/30 text-[#3A6B35] shadow-sm hover:bg-[#DCEAD5]"
          title="खाता विवरण सुनें"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Artisan Profile Card */}
      <div className="p-4 rounded-3xl bg-white border-2 border-[#E5DAC8] shadow-sm flex items-center gap-3.5">
        <div className="relative">
          <img
            src={artisan.avatar}
            alt={artisan.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#3A6B35] shadow-sm"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#3A6B35] text-white flex items-center justify-center text-[10px] shadow">
            ✓
          </div>
        </div>

        <div>
          <h2 className="text-lg font-black text-[#1E3A1E] leading-tight flex items-center gap-1.5">
            <span>{artisan.name}</span>
            <ShieldCheck className="w-4 h-4 text-[#3A6B35]" />
          </h2>
          <p className="text-xs font-bold text-[#5A4838] mt-0.5">
            📱 {artisan.phone}
          </p>
          <p className="text-xs font-semibold text-[#8A7B6E] mt-0.5">
            🏡 गाँव: {artisan.village}, {artisan.state}
          </p>
        </div>
      </div>

      {/* Quick Earnings Summary Widget */}
      <div 
        onClick={() => {
          playSoundEffect('tap');
          setActiveModal('earnings');
        }}
        className="p-4 rounded-3xl bg-gradient-to-r from-[#2C5E43] to-[#1E4732] text-white shadow-md flex items-center justify-between cursor-pointer hover:shadow-lg transition-all active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-2xl">
            💰
          </div>
          <div>
            <p className="text-[11px] font-bold text-white/80">
              कुल कमाई (सीधे बैंक में)
            </p>
            <p className="text-xl sm:text-2xl font-black text-amber-300">
              ₹{artisan.totalEarnings.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-white/80" />
      </div>

      {/* Touch Menu Options List */}
      <div className="space-y-2.5">
        
        {/* 1. मेरा प्रोफाइल */}
        <button
          onClick={() => {
            playSoundEffect('tap');
            speakText(`नाम: ${artisan.name}, गाँव: ${artisan.village}, राज्य: ${artisan.state}`);
          }}
          className="w-full p-3.5 rounded-2xl bg-white border border-[#E5DAC8] shadow-sm flex items-center justify-between hover:border-[#3A6B35]/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#FAF0DD] text-[#935213]">
              <User className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-[#2C241E] text-sm">
              मेरा प्रोफाइल
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-[#8A7B6E]" />
        </button>

        {/* 2. मेरे ऑर्डर */}
        <button
          onClick={() => {
            playSoundEffect('tap');
            setActiveModal('orders');
          }}
          className="w-full p-3.5 rounded-2xl bg-white border border-[#E5DAC8] shadow-sm flex items-center justify-between hover:border-[#3A6B35]/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#EEF6EB] text-[#3A6B35]">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="font-extrabold text-[#2C241E] text-sm block">
                मेरे ऑर्डर
              </span>
              <span className="text-[10px] font-bold text-[#3A6B35]">
                {artisan.totalOrders} ऑर्डर पूरे हुए
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#8A7B6E]" />
        </button>

        {/* 3. पेमेन्ट (कमाई) */}
        <button
          onClick={() => {
            playSoundEffect('tap');
            setActiveModal('earnings');
          }}
          className="w-full p-3.5 rounded-2xl bg-white border border-[#E5DAC8] shadow-sm flex items-center justify-between hover:border-[#3A6B35]/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#FFF9E6] text-[#E67E22]">
              <Wallet className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="font-extrabold text-[#2C241E] text-sm block">
                पेमेन्ट (कमाई)
              </span>
              <span className="text-[10px] font-bold text-[#7D6E5D]">
                बैंक खाता: {artisan.bankName}
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#8A7B6E]" />
        </button>

        {/* 4. सहायता (Help & Village Sahayak) */}
        <button
          onClick={() => {
            playSoundEffect('tap');
            setActiveModal('help');
          }}
          className="w-full p-3.5 rounded-2xl bg-white border border-[#E5DAC8] shadow-sm flex items-center justify-between hover:border-[#3A6B35]/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#F4EEF9] text-[#7B4BA4]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="font-extrabold text-[#2C241E] text-sm block">
                सहायता व ग्राम समन्वयक
              </span>
              <span className="text-[10px] font-bold text-[#7B4BA4]">
                फ़ोन पर मदद उपलब्ध
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#8A7B6E]" />
        </button>

        {/* 5. भाषा बदलें */}
        <button
          onClick={() => {
            playSoundEffect('tap');
            onSelectLanguageChange();
          }}
          className="w-full p-3.5 rounded-2xl bg-white border border-[#E5DAC8] shadow-sm flex items-center justify-between hover:border-[#3A6B35]/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#E8F0E3] text-[#3A6B35]">
              <Globe className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-[#2C241E] text-sm">
              भाषा बदलें (Change Language)
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-[#8A7B6E]" />
        </button>

        {/* 6. लॉग आउट */}
        <button
          onClick={() => {
            playSoundEffect('tap');
            onLogout();
          }}
          className="w-full p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 shadow-sm flex items-center justify-center gap-2 font-black text-sm hover:bg-rose-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>लॉग आउट</span>
        </button>

      </div>

      {/* EARNINGS MODAL */}
      {activeModal === 'earnings' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF6ED] w-full max-w-sm rounded-3xl p-5 border-2 border-[#E5DAC8] shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[#1E3A1E]">कमाई और बैंक विवरण</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-lg font-black">✕</button>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E5DAC8] space-y-2">
              <p className="text-xs font-bold text-[#7D6E5D]">कुल प्राप्त राशि</p>
              <p className="text-2xl font-black text-[#3A6B35]">₹{artisan.totalEarnings.toLocaleString('en-IN')}</p>
              <div className="pt-2 border-t border-[#E5DAC8] text-xs font-semibold text-[#5A4838]">
                <p>बैंक: {artisan.bankName}</p>
                <p>खाता: {artisan.accountNumberMasked} (सत्यापित ✓)</p>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 rounded-xl bg-[#3A6B35] text-white font-bold"
            >
              ठीक है
            </button>
          </div>
        </div>
      )}

      {/* HELP / GRAM SAMANVAYAK MODAL */}
      {activeModal === 'help' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF6ED] w-full max-w-sm rounded-3xl p-5 border-2 border-[#E5DAC8] shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[#1E3A1E]">ग्राम समन्वयक सहायता</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-lg font-black">✕</button>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E5DAC8] space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#FAF0DD] flex items-center justify-center text-2xl">
                  👨‍💼
                </div>
                <div>
                  <h4 className="font-extrabold text-[#1E3A1E] text-sm">{artisan.sahayakName}</h4>
                  <p className="text-xs text-[#7D6E5D]">रामपुर पंचायत सेवा केंद्र</p>
                </div>
              </div>

              <a
                href={`tel:${artisan.sahayakPhone}`}
                className="w-full py-3 rounded-xl bg-[#3A6B35] text-white font-bold flex items-center justify-center gap-2 shadow"
              >
                <Phone className="w-4 h-4" />
                <span>कॉल करें ({artisan.sahayakPhone})</span>
              </a>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-white border border-[#E5DAC8] text-[#3B3026] font-bold text-sm"
            >
              बंद करें
            </button>
          </div>
        </div>
      )}

      {/* ORDERS MODAL */}
      {activeModal === 'orders' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF6ED] w-full max-w-sm rounded-3xl p-5 border-2 border-[#E5DAC8] shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[#1E3A1E]">ग्राहकों के ऑर्डर</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-lg font-black">✕</button>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 bg-white rounded-2xl border border-[#E5DAC8]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#1E3A1E]">ऑर्डर #HK-8821</span>
                  <span className="text-[10px] font-black text-[#3A6B35] bg-[#E8F0E3] px-2 py-0.5 rounded">डिलिवर हुआ ✓</span>
                </div>
                <p className="text-xs font-bold text-[#5A4838] mt-1">बाँस की टोकरी (x1) • ₹800</p>
                <p className="text-[10px] text-[#8A7B6E]">ग्राहक: अनिता शर्मा (दिल्ली)</p>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-[#E5DAC8]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#1E3A1E]">ऑर्डर #HK-7914</span>
                  <span className="text-[10px] font-black text-[#3A6B35] bg-[#E8F0E3] px-2 py-0.5 rounded">भुगतान प्राप्त ✓</span>
                </div>
                <p className="text-xs font-bold text-[#5A4838] mt-1">मिट्टी का घड़ा (x2) • ₹1,200</p>
                <p className="text-[10px] text-[#8A7B6E]">ग्राहक: विक्रम सिंह (जयपुर)</p>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 rounded-xl bg-[#3A6B35] text-white font-bold text-sm"
            >
              ठीक है
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
