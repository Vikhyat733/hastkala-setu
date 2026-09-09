import React, { useState } from 'react';
import { ShieldCheck, PhoneCall, Info } from 'lucide-react';
import { useMela } from '../../context/MelaContext';
import { AppHeader } from '../../core/design-system/AppHeader';
import { PrimaryButton } from '../../core/design-system/PrimaryButton';
import { authService } from '../../services/auth/mockAuthService';

export const LoginScreen: React.FC = () => {
  const { navigate, t, setPendingPhone, goBack } = useMela();
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length !== 10) {
      setErrorMessage(t.login.phoneError);
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.requestOtp(clean);
      if (res.success) {
        setPendingPhone(clean);
        navigate('/otp');
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage(t.common.errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-between">
      <AppHeader
        title={t.common.appName}
        subtitle="SIH26090"
        showBack={true}
        onBack={goBack}
      />

      <main className="flex-1 max-w-md w-full mx-auto p-5 md:p-6 flex flex-col justify-between">
        <div className="pt-2">
          {/* Header & Icon */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-3xl bg-[#1B4D3E]/10 text-[#1B4D3E] mx-auto flex items-center justify-center text-3xl mb-3 shadow-inner">
              <PhoneCall className="w-8 h-8 text-[#1B4D3E]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-[#1B4D3E] tracking-tight">
              {t.login.title}
            </h2>
            <p className="text-sm font-medium text-[#6B5E59] mt-1">
              {t.login.subtitle}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="artisan-phone"
                className="text-xs font-bold uppercase tracking-wider text-[#6B5E59] px-1"
              >
                {t.login.phonePlaceholder}
              </label>

              <div className="relative flex items-center">
                {/* Country code prefix */}
                <div className="absolute left-3.5 flex items-center gap-1.5 text-base font-bold text-[#261D1A] pr-2.5 border-r border-[#D5CABE] select-none">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>

                <input
                  id="artisan-phone"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => {
                    setErrorMessage(null);
                    setPhoneNumber(e.target.value.replace(/\D/g, ''));
                  }}
                  placeholder="9876543210"
                  className="
                    w-full min-h-[56px] pl-24 pr-4 py-3 rounded-2xl
                    bg-white border-2 border-[#E0D8CE] focus:border-[#1B4D3E]
                    text-xl font-bold tracking-wider text-[#261D1A]
                    focus:outline-none focus:ring-4 focus:ring-[#1B4D3E]/15
                    transition-all shadow-2xs
                  "
                />
              </div>

              {errorMessage && (
                <p className="text-xs font-bold text-red-600 px-1 mt-1">
                  ⚠️ {errorMessage}
                </p>
              )}
            </div>

            {/* Government Verified Badge Card */}
            <div className="p-4 rounded-2xl bg-white border border-[#E0D8CE] flex items-start gap-3 mt-1 shadow-2xs">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700 flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-[#261D1A] flex items-center gap-1.5">
                  <span>{t.login.govBadgeTitle}</span>
                  <span className="text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-[#6B5E59] mt-0.5 leading-relaxed">
                  {t.login.govBadgeSubtitle}
                </p>
              </div>
            </div>

            {/* Dev Demo Notice */}
            <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#D5CABE] flex items-center gap-2 text-xs font-semibold text-[#8B2C0D]">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>{t.login.devNotice}</span>
            </div>

            <div className="pt-3">
              <PrimaryButton type="submit" isLoading={isLoading}>
                {t.login.sendOtp}
              </PrimaryButton>
            </div>
          </form>
        </div>

        {/* Bottom Helper Note */}
        <div className="text-center py-4">
          <p className="text-xs font-medium text-[#8C7E77]">
            MELA • Smart India Hackathon 2026
          </p>
        </div>
      </main>
    </div>
  );
};
