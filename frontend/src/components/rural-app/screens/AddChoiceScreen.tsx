import React, { useRef, useState } from 'react';
import { ArrowLeft, Camera, Image as ImageIcon, Mic, Volume2, Sparkles, MicOff } from 'lucide-react';
import { speakText, playSoundEffect } from '../../../services/voiceAssistant';

interface AddChoiceScreenProps {
  onBack: () => void;
  onSelectCamera: () => void;
  onSelectGallery: (file: File) => void;
  onSelectVoice: (spokenDetails: string) => void;
}

export const AddChoiceScreen: React.FC<AddChoiceScreenProps> = ({
  onBack,
  onSelectCamera,
  onSelectGallery,
  onSelectVoice
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [spokenText, setSpokenText] = useState('');

  const handleVoiceListen = () => {
    playSoundEffect('tap');
    speakText('नया सामान कैसे जोड़ना चाहेंगे? पहला विकल्प: कैमरा से फोटो लें। दूसरा: गैलरी से फोटो चुनें। तीसरा: बोलकर बताएं।');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      playSoundEffect('tap');
      onSelectGallery(file);
    }
  };

  const startVoiceInput = () => {
    playSoundEffect('tap');
    
    // Check Speech Recognition API
    const SpeechRecognitionClass = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      // Simulate with standard prompt
      setIsRecording(true);
      speakText('कृपया अपने सामान के बारे में बोलें...');
      setTimeout(() => {
        setIsRecording(false);
        const sampleSpoken = 'यह हाथ से बनी बाँस की टोकरी है, बहुत मजबूत और सुंदर है।';
        setSpokenText(sampleSpoken);
        onSelectVoice(sampleSpoken);
      }, 3000);
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.lang = 'hi-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsRecording(true);
      speakText('अपने सामान का नाम और विवरण बोलें...');

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSpokenText(transcript);
        setIsRecording(false);
        playSoundEffect('success_bell');
        onSelectVoice(transcript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
        // Fallback demo text
        onSelectVoice('हाथ से बनाई गई पारंपरिक सुंदर कलाकृति');
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (err) {
      setIsRecording(false);
      onSelectVoice('बाँस की हस्तनिर्मित टोकरी');
    }
  };

  return (
    <div className="min-h-full flex flex-col justify-between bg-[#FAF6ED] text-[#2C241E] select-none p-4 sm:p-5">
      
      {/* Hidden File Input for Gallery */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="space-y-4">
        
        {/* Top Navigation Header */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => {
              playSoundEffect('tap');
              onBack();
            }}
            className="p-2.5 rounded-2xl bg-white border border-[#E5DAC8] text-[#3B3026] shadow-sm hover:bg-[#F4EDE0]"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          <h1 className="text-lg font-black text-[#1E3A1E] font-sans">
            नया सामान जोड़ें
          </h1>

          <button
            onClick={handleVoiceListen}
            className="p-2.5 rounded-2xl bg-[#E8F0E3] border border-[#3A6B35]/30 text-[#3A6B35] shadow-sm hover:bg-[#DCEAD5]"
            title="निर्देश सुनें"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Section Heading */}
        <div className="pt-2 text-center">
          <h2 className="text-xl sm:text-2xl font-black text-[#2A4424]">
            कैसे जोड़ना चाहेंगे?
          </h2>
          <p className="text-xs font-bold text-[#7D6E5D] mt-0.5">
            नीचे दिए गए 3 विकल्पों में से एक चुनें
          </p>
        </div>

        {/* 3 LARGE TOUCH CHOICE TILES */}
        <div className="space-y-3.5 pt-2">
          
          {/* OPTION 1: 📷 फोटो लें (Take Photo) */}
          <button
            onClick={() => {
              playSoundEffect('tap');
              onSelectCamera();
            }}
            className="w-full p-4 sm:p-5 rounded-3xl bg-[#EEF6EB] border-2 border-[#BCD8B3] hover:border-[#3A6B35] text-left shadow-sm hover:shadow-md transition-all flex items-center gap-4 group active:scale-[0.98]"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#3A6B35] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
              <Camera className="w-7 h-7 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-[#1E3A1E] leading-tight">
                फोटो लें
              </h3>
              <p className="text-xs sm:text-sm font-bold text-[#4E6C47] mt-0.5">
                अभी कैमरे से फोटो लें
              </p>
            </div>
          </button>

          {/* OPTION 2: 🖼️ गैलरी से चुनें (Choose from Gallery) */}
          <button
            onClick={() => {
              playSoundEffect('tap');
              fileInputRef.current?.click();
            }}
            className="w-full p-4 sm:p-5 rounded-3xl bg-[#FEF6E8] border-2 border-[#F5DCB0] hover:border-[#E67E22] text-left shadow-sm hover:shadow-md transition-all flex items-center gap-4 group active:scale-[0.98]"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#E67E22] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
              <ImageIcon className="w-7 h-7 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-[#5C330B] leading-tight">
                गैलरी से चुनें
              </h3>
              <p className="text-xs sm:text-sm font-bold text-[#8C5D2C] mt-0.5">
                फोन में पहले से मौजूद फोटो चुनें
              </p>
            </div>
          </button>

          {/* OPTION 3: 🎤 बोलकर बताएं (Speak to Tell) */}
          <button
            onClick={startVoiceInput}
            className={`w-full p-4 sm:p-5 rounded-3xl border-2 text-left shadow-sm hover:shadow-md transition-all flex items-center gap-4 group active:scale-[0.98] ${
              isRecording
                ? 'bg-[#FBE9E7] border-[#D95D39] animate-pulse'
                : 'bg-[#F4EEF9] border-[#D8C4E8] hover:border-[#7B4BA4]'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform flex-shrink-0 ${
              isRecording ? 'bg-[#D95D39]' : 'bg-[#7B4BA4]'
            }`}>
              {isRecording ? <MicOff className="w-7 h-7 animate-bounce" /> : <Mic className="w-7 h-7 stroke-[2.2]" />}
            </div>
            <div>
              <h3 className={`text-lg sm:text-xl font-black leading-tight ${
                isRecording ? 'text-[#D95D39]' : 'text-[#3E215C]'
              }`}>
                {isRecording ? 'सुन रहा है... बोलिए' : 'बोलकर बताएं'}
              </h3>
              <p className={`text-xs sm:text-sm font-bold mt-0.5 ${
                isRecording ? 'text-[#B54424]' : 'text-[#6C4B88]'
              }`}>
                {isRecording ? 'सामान का नाम और विवरण बोलें' : 'सामान के बारे में बोलें'}
              </p>
            </div>
          </button>

        </div>
      </div>

      {/* Reassurance Banner at Bottom */}
      <div className="mt-6 p-4 rounded-2xl bg-white border border-[#E5DAC8] shadow-sm flex items-start gap-3">
        <div className="p-2 rounded-xl bg-[#FFF9E6] text-[#E67E22] flex-shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-black text-[#2A4424]">
            AI आपकी पूरी मदद करेगा
          </h4>
          <p className="text-[11px] font-semibold text-[#6D5D4E] mt-0.5 leading-snug">
            AI आपके फोटो और जानकारी से सामान का नाम, विवरण और सही कीमत अपने आप बनाएगा।
          </p>
        </div>
      </div>

    </div>
  );
};
