import React from 'react';
import {
  Award,
  LogOut,
  CheckCircle2,
  Globe,
  Shield,
  Coins,
  CreditCard,
  Package,
  ChevronRight,
} from 'lucide-react';
import { useMela } from '../../context/MelaContext';
import { AppHeader } from '../../core/design-system/AppHeader';
import { Language } from '../../translations';

export const ProfileScreen: React.FC = () => {
  const { currentUser, selectedLanguage, setLanguage, logout, navigate, t, goBack } = useMela();

  const artisanName = currentUser?.name || (
    selectedLanguage === 'hi' ? 'राधा देवी' :
    selectedLanguage === 'mr' ? 'राधा देवी' :
    selectedLanguage === 'bn' ? 'রাধা দেবী' : 'Radha Devi'
  );
  const artisanPhone = currentUser?.phone || '9876543210';

  const languages: { code: Language; nativeName: string; englishName: string }[] = [
    { code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi' },
    { code: 'en', nativeName: 'English', englishName: 'English' },
    { code: 'mr', nativeName: 'मराठी', englishName: 'Marathi' },
    { code: 'bn', nativeName: 'বাংলা', englishName: 'Bengali' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-between pb-12">
      <AppHeader
        title={t.profile.title}
        subtitle="MELA Account & Business"
        onBack={goBack}
        showLanguageToggle={true}
        currentLanguage={selectedLanguage}
        onLanguageToggle={() => {
          const nextLangMap: Record<Language, Language> = {
            hi: 'en',
            en: 'mr',
            mr: 'bn',
            bn: 'hi',
          };
          setLanguage(nextLangMap[selectedLanguage]);
        }}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 space-y-5 pb-20 md:pb-6">
        <div className="md:grid md:grid-cols-2 md:gap-6 space-y-4 md:space-y-0">
          
          {/* Left Column */}
          <div className="space-y-4 md:space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-3xl p-5 border border-[#E0D8CE] shadow-sm text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#1B4D3E] to-[#C04B27] text-white text-3xl font-black mx-auto flex items-center justify-center shadow-lg">
                🏺
              </div>
              <div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t.profile.statusActive}
                </div>
                <h3 className="text-xl font-black text-[#261D1A] mt-1">
                  {artisanName}
                </h3>
                <p className="text-xs text-[#6B5E59] font-medium">
                  +91 {artisanPhone}
                </p>
              </div>
            </div>

            {/* ─── BUSINESS & EARNINGS SHORTCUTS ─── */}
            <div className="bg-white rounded-3xl p-4 border border-[#E0D8CE] shadow-xs space-y-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#6B5E59] px-1">
                {t.profile.businessSection}
              </h4>

              <div className="space-y-1.5">
                {/* My Earnings Link */}
                <button
                  type="button"
                  onClick={() => navigate('/earnings')}
                  className="w-full p-3 rounded-2xl bg-[#FAF6F0] hover:bg-stone-100 border border-[#E0D8CE] flex items-center justify-between transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Coins className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-[#261D1A] block">
                        {t.profile.myEarningsLink}
                      </span>
                      <span className="text-[10px] text-[#6B5E59]">
                        {t.profile.earningsDesc}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#1B4D3E]" />
                </button>

                {/* Payout Account Setup Link */}
                <button
                  type="button"
                  onClick={() => navigate('/earnings')}
                  className="w-full p-3 rounded-2xl bg-[#FAF6F0] hover:bg-stone-100 border border-[#E0D8CE] flex items-center justify-between transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-[#261D1A] block">
                        {t.profile.payoutLink}
                      </span>
                      <span className="text-[10px] text-[#6B5E59]">
                        {t.profile.payoutDesc}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#1B4D3E]" />
                </button>

                {/* My Products Link */}
                <button
                  type="button"
                  onClick={() => navigate('/my-products')}
                  className="w-full p-3 rounded-2xl bg-[#FAF6F0] hover:bg-stone-100 border border-[#E0D8CE] flex items-center justify-between transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-[#261D1A] block">
                        {t.profile.myProductsLink}
                      </span>
                      <span className="text-[10px] text-[#6B5E59]">
                        {t.profile.productsDesc}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#1B4D3E]" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 md:space-y-6">
            {/* ─── 4-LANGUAGE SELECTION CARD ─── */}
            <div className="bg-white rounded-3xl p-4 border border-[#E0D8CE] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#6B5E59] flex items-center gap-1.5 px-1">
                  <Globe className="w-4 h-4 text-[#1B4D3E]" />
                  {t.profile.activeLang}
                </h4>
                <span className="text-[10px] font-bold text-[#C04B27] bg-[#C04B27]/10 px-2 py-0.5 rounded-full">
                  4 Languages Ready
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {languages.map((item) => {
                  const isSelected = selectedLanguage === item.code;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => setLanguage(item.code)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#1B4D3E] text-white border-[#1B4D3E] shadow-sm'
                          : 'bg-[#FAF6F0] text-[#261D1A] border-[#E0D8CE] hover:border-[#1B4D3E]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-base font-black leading-tight">
                          {item.nativeName}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-amber-300" />
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-medium mt-1 ${
                          isSelected ? 'text-white/80' : 'text-[#6B5E59]'
                        }`}
                      >
                        {item.englishName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Details & Settings List */}
            <div className="bg-white rounded-3xl p-4 border border-[#E0D8CE] shadow-xs space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-[#F0EBE1]">
                <span className="text-[#6B5E59] font-semibold flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#C04B27]" />
                  {t.profile.craftSpec}
                </span>
                <span className="font-bold text-[#261D1A]">
                  {selectedLanguage === 'hi'
                    ? 'जूट शिल्प और मिट्टी कला'
                    : selectedLanguage === 'mr'
                    ? 'जूट शिल्प आणि मातीची कला'
                    : selectedLanguage === 'bn'
                    ? 'পাট শিল্প ও মৃৎশিল্প'
                    : 'Jute Craft & Terracotta'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-[#6B5E59] font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-700" />
                  {t.profile.securityStatus}
                </span>
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {t.profile.statusActive}
                </span>
              </div>
            </div>

            {/* Brand Tagline */}
            <div className="text-center py-2">
              <p className="text-xs font-bold text-[#1B4D3E]/80">
                {t.common.brandMessage}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={logout}
                className="w-full py-3 px-4 rounded-2xl border-2 border-red-200 bg-white text-red-700 font-bold text-xs flex items-center justify-center gap-2 shadow-xs hover:bg-red-50 active:scale-98 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                {t.profile.logout}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

