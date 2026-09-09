import React, { useState, useRef, useEffect } from 'react';
import { KeyRound, CheckCircle2 } from 'lucide-react';
import { useMela } from '../../context/MelaContext';
import { AppHeader } from '../../core/design-system/AppHeader';
import { PrimaryButton } from '../../core/design-system/PrimaryButton';
import { authService, MOCK_OTP_CODE } from '../../services/auth/mockAuthService';

export const OtpScreen: React.FC = () => {
  const { navigate, t, pendingPhone, loginSuccess, goBack } = useMela();
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const maskedPhone =
    pendingPhone.length >= 10
      ? `+91 ${pendingPhone.slice(0, 2)}******${pendingPhone.slice(-2)}`
      : '+91 98******10';

  const handleDigitChange = (index: number, val: string) => {
    setErrorMessage(null);
    const cleaned = val.replace(/\D/g, '');

    if (!cleaned) {
      const updated = [...otpDigits];
      updated[index] = '';
      setOtpDigits(updated);
      return;
    }

    // Single digit or paste
    if (cleaned.length === 1) {
      const updated = [...otpDigits];
      updated[index] = cleaned;
      setOtpDigits(updated);

      // Move focus to next input
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (cleaned.length === 6) {
      // Pasted full 6-digit OTP
      const digits = cleaned.split('').slice(0, 6);
      setOtpDigits(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const fullOtp = otpDigits.join('');

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    if (fullOtp.length !== 6) {
      setErrorMessage(t.otp.invalidOtp);
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.verifyOtp(pendingPhone, fullOtp);
      if (res.success && res.user) {
        loginSuccess(res.user);
      } else {
        setErrorMessage(res.message || t.otp.invalidOtp);
      }
    } catch {
      setErrorMessage(t.common.errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFillMock = () => {
    setOtpDigits(MOCK_OTP_CODE.split(''));
    setErrorMessage(null);
  };

  const handleResendOtp = async () => {
    setResendStatus(t.otp.mockHint);
    await authService.requestOtp(pendingPhone);
    setTimeout(() => setResendStatus(null), 3500);
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
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-3xl bg-[#C04B27]/10 text-[#C04B27] mx-auto flex items-center justify-center text-3xl mb-3 shadow-inner">
              <KeyRound className="w-8 h-8 text-[#C04B27]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-[#1B4D3E] tracking-tight">
              {t.otp.title}
            </h2>
            <p className="text-sm font-medium text-[#6B5E59] mt-1">
              {t.otp.subtitle} <span className="font-bold text-[#261D1A]">{maskedPhone}</span>
            </p>
          </div>

          {/* 6 OTP Input Boxes */}
          <div className="flex justify-center gap-2.5 my-6">
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`
                  w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-black rounded-2xl
                  border-2 bg-white transition-all shadow-sm
                  focus:outline-none focus:ring-4
                  ${
                    digit
                      ? 'border-[#1B4D3E] text-[#1B4D3E] focus:ring-[#1B4D3E]/20'
                      : 'border-[#E0D8CE] text-[#261D1A] focus:border-[#C04B27] focus:ring-[#C04B27]/20'
                  }
                `}
              />
            ))}
          </div>

          {errorMessage && (
            <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-600 text-center">
              {errorMessage}
            </div>
          )}

          {/* Development Quick-Fill Helper */}
          <div className="p-3 mb-4 rounded-2xl bg-white border border-[#E0D8CE] flex items-center justify-between shadow-2xs">
            <div className="text-xs text-[#6B5E59]">
              <span className="font-bold text-[#1B4D3E]">Demo Helper: </span>
              <span>Code is <b>{MOCK_OTP_CODE}</b></span>
            </div>
            <button
              type="button"
              onClick={handleQuickFillMock}
              className="text-xs font-bold text-[#C04B27] bg-[#C04B27]/10 hover:bg-[#C04B27]/20 px-2.5 py-1 rounded-lg transition-colors"
            >
              Fill 123456
            </button>
          </div>

          {/* Verify Button */}
          <PrimaryButton onClick={() => handleVerify()} isLoading={isLoading}>
            {t.otp.verifyBtn}
          </PrimaryButton>

          {/* Resend OTP */}
          <div className="text-center mt-5">
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-sm font-bold text-[#6B5E59] hover:text-[#C04B27] transition-colors"
            >
              {t.common.resendOtp}
            </button>
            {resendStatus && (
              <p className="text-xs font-semibold text-[#1B4D3E] mt-1.5 animate-in fade-in">
                ✓ {resendStatus}
              </p>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center py-4">
          <p className="text-xs text-[#8C7E77]">
            🔒 Secured with Artisan Authentication Protocol
          </p>
        </div>
      </main>
    </div>
  );
};
