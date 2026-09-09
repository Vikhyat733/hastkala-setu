import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Volume2, RotateCcw, Sparkles, AlertCircle, RefreshCw, MessageSquare, Edit3, Check, Info } from 'lucide-react';
import { useProductCreation } from '../context/ProductCreationContext';
import { useMela } from '../../../context/MelaContext';
import { AppHeader } from '../../../core/design-system/AppHeader';
import { PrimaryButton } from '../../../core/design-system/PrimaryButton';

type VoicePhase =
  | 'idle'       // Initial state — tap mic to start
  | 'recording'  // Actively recording + real SpeechRecognition running
  | 'done'       // Got a real transcript — showing for review
  | 'editing'    // User is editing transcript manually
  | 'error';     // Recognition failed — no fabrication

export const VoiceDescriptionScreen: React.FC = () => {
  const {
    state,
    updateState,
    setStep,
    startVoiceRecognition,
    stopVoiceRecognition,
    generateCatalogFromVoice,
    isRecognitionSupported,
    isRecording,
    isTranscribing,
    isGeneratingCatalog,
    errorMessage,
    setErrorMessage,
    clearError,
  } = useProductCreation();

  const { t, selectedLanguage } = useMela();

  const [phase, setPhase] = useState<VoicePhase>(() =>
    state.voiceTranscript.trim() ? 'done' : 'idle'
  );
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [editedTranscript, setEditedTranscript] = useState(state.voiceTranscript);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Timer for recording duration display
  useEffect(() => {
    if (isRecording) {
      setSecondsElapsed(0);
      timerRef.current = window.setInterval(() => setSecondsElapsed(p => p + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording]);

  // Sync external error state → show error phase
  useEffect(() => {
    if (errorMessage && !isRecording && !isTranscribing) {
      setPhase('error');
    }
  }, [errorMessage, isRecording, isTranscribing]);

  // After transcription completes, update phase
  useEffect(() => {
    if (!isRecording && !isTranscribing && state.voiceTranscript.trim()) {
      setEditedTranscript(state.voiceTranscript);
      setPhase('done');
      clearError();
    }
  }, [isRecording, isTranscribing, state.voiceTranscript]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleStartRecording = async () => {
    if (!isRecognitionSupported) {
      setErrorMessage(
        t.errors.voiceUnavailable || 'Voice recognition is unavailable on this device. Please type your description.'
      );
      setPhase('error');
      return;
    }
    clearError();
    setPhase('recording');
    updateState({ voiceTranscript: '' });
    // Starts browser SpeechRecognition in selectedLanguage ('hi' | 'mr' | 'bn' | 'en')
    await startVoiceRecognition(selectedLanguage as any);
  };

  const handleStopRecording = () => {
    stopVoiceRecognition();
  };

  const handleSpeakAloud = () => {
    const text = editedTranscript || state.voiceTranscript;
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      const ttsMap: Record<string, string> = {
        hi: 'hi-IN',
        mr: 'mr-IN',
        bn: 'bn-IN',
        en: 'en-IN',
      };
      utter.lang = ttsMap[selectedLanguage] || 'en-IN';
      utter.onstart = () => setIsSpeaking(true);
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utter);
    }
  };

  const handleSaveEdit = () => {
    if (editedTranscript.trim()) {
      updateState({ voiceTranscript: editedTranscript.trim() });
      setPhase('done');
    }
  };

  const handleContinueToCatalog = async () => {
    const text = editedTranscript.trim() || state.voiceTranscript.trim();
    if (!text) {
      setErrorMessage(t.errors.fieldRequired || 'Please speak or type your description first.');
      return;
    }
    await generateCatalogFromVoice(text);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col">
      <AppHeader
        title={t.sellProduct.voice.title}
        subtitle={
          selectedLanguage === 'mr'
            ? 'MELA आवाज'
            : selectedLanguage === 'bn'
            ? 'MELA ভয়েস'
            : selectedLanguage === 'hi'
            ? 'MELA आवाज़'
            : 'MELA Voice'
        }
        onBack={() => setStep('studio')}
        showLanguageToggle={false}
      />

      <main className="flex-1 max-w-md w-full mx-auto p-4 md:p-6 flex flex-col gap-5 pb-8">
        {/* Title */}
        <div className="text-center space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-[#261D1A]">
            {t.sellProduct.voice.title}
          </h2>
          <p className="text-xs md:text-sm text-[#6B5E59] font-medium">
            {t.sellProduct.voice.subtitle}
          </p>
        </div>

        {/* Browser not supported warning */}
        {!isRecognitionSupported && phase !== 'done' && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-start gap-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              {t.errors.voiceUnavailable ||
                'Your browser does not support speech recognition on this device. You can type manually below.'}
            </span>
          </div>
        )}

        {/* ── RECORDING PHASE ────────────────────────────────────── */}
        {(phase === 'recording' || isRecording) && (
          <div className="w-full flex flex-col items-center bg-white rounded-3xl border-2 border-[#C04B27]/30 shadow-lg p-6 gap-5 animate-in fade-in zoom-in-95">
            {/* Animated mic */}
            <div className="relative">
              <div className="absolute -inset-3 bg-[#C04B27]/20 rounded-full animate-ping opacity-75 pointer-events-none" />
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#C04B27] to-[#F2A33A] text-white flex items-center justify-center shadow-xl shadow-[#C04B27]/30">
                <Mic className="w-11 h-11 animate-pulse" />
              </div>
            </div>

            {/* Timer + status */}
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-black">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                REC • {formatTime(secondsElapsed)}
              </div>
              <p className="text-sm font-bold text-[#261D1A]">
                {t.sellProduct.voice.listening}
              </p>
              <p className="text-xs text-[#6B5E59]">
                {t.sellProduct.voice.subtitle}
              </p>
            </div>

            {/* Animated waveform bars */}
            <div className="flex items-center justify-center gap-1.5 h-12 w-full max-w-xs px-4">
              {[0.4, 0.8, 0.3, 0.9, 0.6, 1.0, 0.5, 0.7, 0.95, 0.4, 0.85, 0.3, 0.75].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-[#C04B27] rounded-full"
                  style={{
                    height: `${Math.max(8, h * 48)}px`,
                    animation: `bounce ${0.6 + (i % 5) * 0.15}s ease-in-out infinite alternate`,
                  }}
                />
              ))}
            </div>

            {/* Stop button */}
            <button
              type="button"
              onClick={handleStopRecording}
              className="w-full max-w-xs py-3.5 px-6 rounded-2xl bg-[#261D1A] text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-md active:scale-95 cursor-pointer hover:bg-black"
            >
              <Square className="w-4 h-4 fill-white text-white" />
              {t.sellProduct.voice.stop}
            </button>
          </div>
        )}

        {/* ── PROCESSING PHASE ────────────────────────────────────── */}
        {(isTranscribing || isGeneratingCatalog) && (
          <div className="p-8 rounded-3xl bg-white border-2 border-[#E0D8CE] text-center space-y-4 shadow-md animate-in fade-in">
            <RefreshCw className="w-10 h-10 text-[#1B4D3E] animate-spin mx-auto" />
            <p className="text-sm font-black text-[#261D1A]">
              {isTranscribing
                ? t.sellProduct.voice.processing
                : t.sellProduct.voice.generatingDetails}
            </p>
          </div>
        )}

        {/* ── ERROR PHASE ────────────────────────────────────────── */}
        {phase === 'error' && !isRecording && !isTranscribing && (
          <div className="bg-red-50 rounded-3xl border-2 border-red-200 p-5 space-y-4 animate-in fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-black text-red-700">
                  {t.errors.serverError || 'Voice input notice'}
                </p>
                <p className="text-xs text-red-600">{errorMessage}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { clearError(); setPhase('idle'); }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5" />
                {t.sellProduct.voice.recordAgain}
              </button>
              <button
                type="button"
                onClick={() => { clearError(); setPhase('editing'); setEditedTranscript(''); }}
                className="flex-1 py-2.5 rounded-xl border border-red-200 bg-white text-red-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                {t.sellProduct.voice.editTranscript}
              </button>
            </div>
          </div>
        )}

        {/* ── IDLE PHASE ─────────────────────────────────────────── */}
        {phase === 'idle' && !isRecording && !isTranscribing && (
          <div className="flex flex-col items-center bg-white rounded-3xl border-2 border-[#E0D8CE] shadow-md p-6 text-center space-y-4 animate-in fade-in">
            <button
              type="button"
              onClick={handleStartRecording}
              aria-label={t.sellProduct.voice.tapToSpeak}
              className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#C04B27] to-[#F2A33A] text-white flex items-center justify-center shadow-xl shadow-[#C04B27]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Mic className="w-11 h-11" />
            </button>
            <div className="space-y-1">
              <p className="text-base font-black text-[#261D1A]">
                {t.sellProduct.voice.tapToSpeak}
              </p>
              <p className="text-xs text-[#6B5E59] max-w-xs">
                {t.sellProduct.voice.subtitle}
              </p>
            </div>
            <div className="p-3 bg-[#FAF6F0] rounded-2xl border border-[#E8E2D9] text-[11px] text-[#6B5E59] text-left space-y-1 w-full">
              <p className="font-bold text-[#261D1A] flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-[#C04B27]" />
                {selectedLanguage === 'mr'
                  ? 'उदा. वाक्य:'
                  : selectedLanguage === 'bn'
                  ? 'উদাহরণ বাক্য:'
                  : selectedLanguage === 'hi'
                  ? 'उदाहरण वाक्य:'
                  : 'Example:'}
              </p>
              <p className="italic">{t.sellProduct.voice.samplePrompt}</p>
            </div>

            {/* Type instead option */}
            <button
              type="button"
              onClick={() => { setPhase('editing'); setEditedTranscript(''); }}
              className="text-xs text-[#C04B27] font-bold underline underline-offset-2 hover:no-underline cursor-pointer"
            >
              {selectedLanguage === 'mr'
                ? 'किंवा येथे टाइप करा →'
                : selectedLanguage === 'bn'
                ? 'অথবা এখানে টাইপ করুন →'
                : selectedLanguage === 'hi'
                ? 'या यहाँ टाइप करें →'
                : 'Or type manually instead →'}
            </button>
          </div>
        )}

        {/* ── EDITING PHASE (manual text input) ──────────────────── */}
        {phase === 'editing' && !isRecording && !isTranscribing && (
          <div className="bg-white rounded-3xl border-2 border-[#1B4D3E]/30 shadow-md p-5 space-y-3 animate-in fade-in">
            <p className="text-xs font-black uppercase tracking-wider text-[#1B4D3E]">
              {t.sellProduct.voice.editTranscript}
            </p>
            <textarea
              value={editedTranscript}
              onChange={(e) => setEditedTranscript(e.target.value)}
              rows={4}
              className="w-full p-3.5 rounded-2xl bg-[#FAF6F0] border-2 border-[#E0D8CE] text-sm text-[#261D1A] font-medium focus:border-[#C04B27] focus:outline-none resize-none"
              placeholder={t.sellProduct.voice.samplePrompt}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPhase(state.voiceTranscript ? 'done' : 'idle')}
                className="flex-1 py-2.5 rounded-xl border border-[#E0D8CE] font-bold text-xs text-[#6B5E59] cursor-pointer"
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={!editedTranscript.trim()}
                className="flex-1 py-2.5 rounded-xl bg-[#1B4D3E] text-white font-bold text-xs flex items-center justify-center gap-1 disabled:opacity-50 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                {t.common.save}
              </button>
            </div>
            {isRecognitionSupported && (
              <button
                type="button"
                onClick={handleStartRecording}
                className="w-full text-xs text-[#C04B27] font-bold py-1 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5" />
                {t.sellProduct.voice.recordAgain}
              </button>
            )}
          </div>
        )}

        {/* ── DONE PHASE — Transcript Review ─────────────────────── */}
        {phase === 'done' && !isRecording && !isTranscribing && (
          <div className="bg-white rounded-3xl border-2 border-[#1B4D3E]/30 shadow-md p-5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#1B4D3E] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C04B27]" />
                {t.sellProduct.voice.reviewTranscript}
              </span>
              <button
                type="button"
                onClick={handleSpeakAloud}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#FAF6F0] border border-[#E0D8CE] text-xs font-bold text-[#261D1A] hover:bg-stone-100 cursor-pointer"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'text-[#C04B27] animate-pulse' : ''}`} />
                {t.sellProduct.voice.listen}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EAE2D5] text-sm text-[#261D1A] font-medium leading-relaxed">
              "{state.voiceTranscript}"
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setPhase('editing'); setEditedTranscript(state.voiceTranscript); }}
                className="flex-1 py-2.5 px-3 rounded-xl border border-[#E0D8CE] text-xs font-bold text-[#6B5E59] flex items-center justify-center gap-1.5 hover:bg-stone-50 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                {t.sellProduct.voice.editTranscript}
              </button>
              {isRecognitionSupported && (
                <button
                  type="button"
                  onClick={() => { clearError(); setPhase('idle'); updateState({ voiceTranscript: '' }); }}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-[#E0D8CE] text-xs font-bold text-[#6B5E59] flex items-center justify-center gap-1.5 hover:bg-stone-50 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {t.sellProduct.voice.recordAgain}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── CONTINUE BUTTON (always visible when done) ─────────── */}
        {phase === 'done' && !isRecording && !isTranscribing && (
          <PrimaryButton onClick={handleContinueToCatalog} disabled={isGeneratingCatalog}>
            <span className="flex items-center justify-center gap-2">
              {isGeneratingCatalog ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              {t.sellProduct.voice.continueCatalog}
            </span>
          </PrimaryButton>
        )}
      </main>
    </div>
  );
};
