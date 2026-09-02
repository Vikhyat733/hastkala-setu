import React, { useState } from 'react';
import { ArrowLeft, Zap, ZapOff, RefreshCw, Volume2, Sparkles, Check } from 'lucide-react';
import { DEMO_CRAFT_PRESETS } from '../data/ruralAppDefaults';
import { speakText, playSoundEffect } from '../../../services/voiceAssistant';

interface CameraScreenProps {
  onBack: () => void;
  onCapture: (capturedImage: string, craftPresetIndex: number) => void;
}

export const CameraScreen: React.FC<CameraScreenProps> = ({
  onBack,
  onCapture
}) => {
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [isShutterFired, setIsShutterFired] = useState(false);

  const currentCraft = DEMO_CRAFT_PRESETS[selectedPresetIdx];

  const handleVoiceAdvice = () => {
    playSoundEffect('tap');
    speakText('सामान को अच्छी रोशनी में रखकर बीच में लाएं और नीचे दिए गए बड़े हरे बटन को दबाकर फोटो लें।');
  };

  const handleToggleFlash = () => {
    playSoundEffect('tap');
    setIsFlashOn(!isFlashOn);
    speakText(isFlashOn ? 'फ्लैश बंद' : 'फ्लैश चालू');
  };

  const handleSwitchCraftPreset = () => {
    playSoundEffect('tap');
    const nextIdx = (selectedPresetIdx + 1) % DEMO_CRAFT_PRESETS.length;
    setSelectedPresetIdx(nextIdx);
  };

  const handleSnapPhoto = () => {
    setIsShutterFired(true);
    playSoundEffect('camera_click');

    setTimeout(() => {
      setIsShutterFired(false);
      onCapture(currentCraft.image, selectedPresetIdx);
    }, 450);
  };

  return (
    <div className="min-h-full flex flex-col justify-between bg-[#1B2A1E] text-white select-none">
      
      {/* Top Controls Bar */}
      <div className="p-4 flex items-center justify-between z-10">
        <button
          onClick={() => {
            playSoundEffect('tap');
            onBack();
          }}
          className="p-2.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 shadow"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        <h1 className="text-lg font-black tracking-tight text-white">
          फोटो लें
        </h1>

        <button
          onClick={handleVoiceAdvice}
          className="p-2.5 rounded-2xl bg-[#3A6B35]/80 backdrop-blur-md border border-[#4E8D47] text-white hover:bg-[#3A6B35] flex items-center gap-1"
          title="सलाह सुनें"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Camera Viewfinder with Framing Guides */}
      <div className="relative flex-1 mx-3 my-1 rounded-3xl overflow-hidden bg-black flex items-center justify-center border-2 border-white/20 shadow-2xl">
        
        {/* Craft Image Preview */}
        <img
          src={currentCraft.image}
          alt={currentCraft.name}
          className="w-full h-full object-cover select-none"
        />

        {/* Shutter Flash Animation Overlay */}
        {isShutterFired && (
          <div className="absolute inset-0 bg-white z-30 animate-in fade-in duration-75"></div>
        )}

        {/* Flash Simulation Ring */}
        {isFlashOn && (
          <div className="absolute inset-0 bg-yellow-100/10 pointer-events-none z-10"></div>
        )}

        {/* 4 Corner Framing Brackets */}
        <div className="absolute inset-5 pointer-events-none z-20 flex flex-col justify-between">
          <div className="flex justify-between">
            <div className="w-8 h-8 border-t-4 border-l-4 border-white/90 rounded-tl-lg shadow-sm"></div>
            <div className="w-8 h-8 border-t-4 border-r-4 border-white/90 rounded-tr-lg shadow-sm"></div>
          </div>
          <div className="flex justify-between">
            <div className="w-8 h-8 border-b-4 border-l-4 border-white/90 rounded-bl-lg shadow-sm"></div>
            <div className="w-8 h-8 border-b-4 border-r-4 border-white/90 rounded-br-lg shadow-sm"></div>
          </div>
        </div>

        {/* Center Target Indicator */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="w-12 h-12 rounded-full border border-white/40 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white/70"></div>
          </div>
        </div>

        {/* Sample Craft Switcher Pill inside Viewfinder */}
        <div className="absolute top-3 left-0 right-0 flex justify-center z-20">
          <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-200 flex items-center gap-1.5 shadow">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{currentCraft.name.split('(')[0]}</span>
          </div>
        </div>

        {/* Advice Pill at Bottom of Viewfinder */}
        <div className="absolute bottom-3 left-4 right-4 z-20">
          <div className="p-2.5 rounded-2xl bg-black/65 backdrop-blur-md border border-white/20 text-center">
            <p className="text-xs font-black text-white leading-tight">
              अच्छी फोटो लें
            </p>
            <p className="text-[10px] font-semibold text-white/80">
              साफ और रोशनी में रखें
            </p>
          </div>
        </div>

      </div>

      {/* Quick Craft Switcher Carousel Strip */}
      <div className="px-4 py-1.5 flex items-center justify-center gap-2 overflow-x-auto">
        <span className="text-[10px] font-bold text-white/60">नमूना:</span>
        {DEMO_CRAFT_PRESETS.map((preset, idx) => (
          <button
            key={preset.id}
            onClick={() => {
              playSoundEffect('tap');
              setSelectedPresetIdx(idx);
            }}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
              selectedPresetIdx === idx
                ? 'bg-[#3A6B35] text-white border border-[#529E4B] shadow'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {preset.name.split('(')[0].trim()}
          </button>
        ))}
      </div>

      {/* Bottom Camera Controls (Flash, Big Round Green Shutter, Switch) */}
      <div className="p-5 bg-black/80 backdrop-blur-md border-t border-white/10 flex items-center justify-around z-10">
        
        {/* Flash Toggle */}
        <button
          onClick={handleToggleFlash}
          className={`p-3 rounded-full border transition-all flex flex-col items-center gap-0.5 ${
            isFlashOn
              ? 'bg-amber-400 text-black border-amber-300 shadow-lg shadow-amber-400/30'
              : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
          }`}
          title="फ्लैश"
        >
          {isFlashOn ? <Zap className="w-5 h-5 fill-black" /> : <ZapOff className="w-5 h-5" />}
        </button>

        {/* BIG ROUND GREEN SHUTTER BUTTON */}
        <button
          onClick={handleSnapPhoto}
          className="relative w-20 h-20 rounded-full bg-white/20 p-1.5 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-xl"
        >
          <div className="w-full h-full rounded-full bg-[#3A6B35] hover:bg-[#2F582B] border-4 border-white flex items-center justify-center shadow-inner">
            <div className="w-8 h-8 rounded-full bg-[#4E8D47]"></div>
          </div>
        </button>

        {/* Craft / Camera Switcher */}
        <button
          onClick={handleSwitchCraftPreset}
          className="p-3 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all flex flex-col items-center gap-0.5"
          title="बदलें"
        >
          <RefreshCw className="w-5 h-5" />
        </button>

      </div>

    </div>
  );
};
