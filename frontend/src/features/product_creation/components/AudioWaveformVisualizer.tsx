import React from 'react';
import { Mic, Square } from 'lucide-react';

interface AudioWaveformVisualizerProps {
  isRecording: boolean;
  secondsElapsed: number;
  onStop: () => void;
  statusText?: string;
}

export const AudioWaveformVisualizer: React.FC<AudioWaveformVisualizerProps> = ({
  isRecording,
  secondsElapsed,
  onStop,
  statusText = 'आपकी आवाज़ सुनी जा रही है...',
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 bg-white rounded-3xl border-2 border-[#C04B27]/30 shadow-lg space-y-5 animate-in fade-in zoom-in-95">
      {/* Animated Glowing Mic Circle */}
      <div className="relative">
        <div className="absolute -inset-3 bg-[#C04B27]/20 rounded-full animate-ping opacity-75 pointer-events-none" />
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#C04B27] to-[#F2A33A] text-white flex items-center justify-center shadow-xl shadow-[#C04B27]/30">
          <Mic className="w-11 h-11 animate-pulse" />
        </div>
      </div>

      {/* Recording Status & Elapsed Time */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-black">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          REC • {formatTime(secondsElapsed)}
        </div>
        <p className="text-sm font-bold text-[#261D1A]">{statusText}</p>
      </div>

      {/* Simulated Live Audio Waveform Bars */}
      <div className="flex items-center justify-center gap-1.5 h-12 w-full max-w-xs px-4">
        {[0.4, 0.8, 0.3, 0.9, 0.6, 1.0, 0.5, 0.7, 0.95, 0.4, 0.85, 0.3, 0.75].map((height, i) => (
          <div
            key={i}
            className="w-1.5 bg-[#C04B27] rounded-full transition-all duration-150"
            style={{
              height: isRecording ? `${Math.max(12, height * 48)}px` : '6px',
              animation: isRecording ? `bounce ${0.6 + (i % 5) * 0.15}s ease-in-out infinite alternate` : 'none',
            }}
          />
        ))}
      </div>

      {/* Stop Recording Button */}
      <button
        type="button"
        onClick={onStop}
        className="w-full max-w-xs py-3.5 px-6 rounded-2xl bg-[#261D1A] text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-md active:scale-98 transition-transform cursor-pointer hover:bg-black"
      >
        <Square className="w-4 h-4 fill-white text-white" />
        बोलना पूरा हुआ (Stop Recording)
      </button>
    </div>
  );
};
