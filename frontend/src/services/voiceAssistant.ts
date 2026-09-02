/**
 * Voice Assistant & Audio Sound Effects Service
 * Specially designed for low-literacy rural artisans
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Text-to-Speech synthesis in Hindi or selected Indian language
 */
export function speakText(
  text: string, 
  lang: string = 'hi-IN', 
  onEnd?: () => void,
  rate: number = 0.95
): void {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported on this browser');
    if (onEnd) onEnd();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate; // Slightly slower for clarity
  utterance.pitch = 1.0;

  // Try to find a good Hindi voice if available
  const voices = window.speechSynthesis.getVoices();
  const hindiVoice = voices.find(v => v.lang.startsWith('hi') || v.name.includes('Hindi') || v.name.includes('India'));
  if (hindiVoice && lang.startsWith('hi')) {
    utterance.voice = hindiVoice;
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.warn('Speech synthesis error:', e);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

/**
 * Stop any running speech synthesis
 */
export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Check if voice is actively speaking
 */
export function isSpeaking(): boolean {
  if ('speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
}

/**
 * Tactile audio sound effects using Web Audio API (Zero external assets needed)
 */
export function playSoundEffect(effect: 'camera_click' | 'success_bell' | 'tap' | 'celebrate' | 'tick'): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (effect === 'camera_click') {
      // Shutter click sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (effect === 'success_bell') {
      // Pleasant chime (G-major chord)
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        gain.gain.setValueAtTime(0, now + i * 0.06);
        gain.gain.linearRampToValueAtTime(0.18, now + i * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.7);
      });
    } else if (effect === 'tap') {
      // Soft gentle tap
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (effect === 'tick') {
      // Progress tick
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    } else if (effect === 'celebrate') {
      // Celebration fanfare
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.2, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.5);
      });
    }
  } catch (err) {
    console.log('Audio feedback not triggered:', err);
  }
}
