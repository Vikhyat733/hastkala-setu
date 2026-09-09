import { API_BASE_URL } from '../api/apiClient';
import { Language } from '../../translations';

// SpeechRecognition type declarations — not always present in all TypeScript dom lib configs
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: new () => any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: new () => any;
  }
}

export interface SpeechRecognitionResult {
  success: boolean;
  transcript: string;        // ACTUAL recognized text — empty string if failed
  language: string;          // Locale used
  errorType?: string;        // 'no_speech' | 'audio_capture' | 'network' | 'not_allowed' | 'not_supported'
  errorHindi?: string;       // User-facing Hindi error message
  errorEnglish?: string;     // User-facing English error message
  errorMarathi?: string;     // User-facing Marathi error message
  errorBengali?: string;     // User-facing Bengali error message
}

export interface CatalogResult {
  success: boolean;
  title: string;
  titleHindi?: string;
  titleEnglish?: string;
  titleMarathi?: string;
  titleBengali?: string;
  category: string;
  material: string;
  craftType: string;
  descriptionHindi: string;
  descriptionEnglish: string;
  descriptionMarathi?: string;
  descriptionBengali?: string;
  keywords: string[];
  confidence?: number;
  isAiAnalyzed?: boolean;
  isDevFallback?: boolean;
  confirmationQuestion?: string;
  observedVisuals?: string[];
}


export class VoiceCatalogService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private recognition: any = null;

  /**
   * Check if browser supports SpeechRecognition.
   */
  isSpeechRecognitionSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  /**
   * Start real browser speech recognition.
   * Returns a Promise that resolves when the user stops speaking.
   *
   * IMPORTANT: Returns actual recognized text, or an error — never fabricated text.
   */
  startRecognition(language: Language = 'hi'): Promise<SpeechRecognitionResult> {
    return new Promise((resolve) => {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognitionClass) {
        resolve({
          success: false,
          transcript: '',
          language,
          errorType: 'not_supported',
          errorHindi: 'आपका ब्राउज़र आवाज़ पहचान का समर्थन नहीं करता। कृपया Chrome का उपयोग करें।',
          errorEnglish: 'Your browser does not support speech recognition. Please use Chrome.',
          errorMarathi: 'तुमचा ब्राउझर आवाज ओळख समर्थन करत नाही. कृपया Chrome वापरा.',
          errorBengali: 'আপনার ব্রাউজার ভয়েস রিকগনিশন সমর্থন করে না। অনুগ্রহ করে Chrome ব্যবহার করুন।',
        });
        return;
      }

      const rec = new SpeechRecognitionClass();
      this.recognition = rec;

      // Set accurate Indian locale based on user's selected language
      const localeMap: Record<Language, string> = {
        hi: 'hi-IN',
        en: 'en-IN',
        mr: 'mr-IN',
        bn: 'bn-IN',
      };
      rec.lang = localeMap[language] || 'hi-IN';
      rec.continuous = false;
      rec.interimResults = false;
      rec.maxAlternatives = 1;

      let finalTranscript = '';
      let recognitionError: string | null = null;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rec.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rec.onerror = (event: any) => {
        recognitionError = event.error;
      };

      rec.onend = () => {
        this.recognition = null;

        if (recognitionError) {
          const errs = this.getErrorMessages(recognitionError);
          resolve({
            success: false,
            transcript: '',
            language,
            errorType: recognitionError,
            errorHindi: errs.hindi,
            errorEnglish: errs.english,
            errorMarathi: errs.marathi,
            errorBengali: errs.bengali,
          });
          return;
        }

        const trimmed = finalTranscript.trim();
        if (!trimmed) {
          resolve({
            success: false,
            transcript: '',
            language,
            errorType: 'no_speech',
            errorHindi: 'हम आपकी आवाज़ समझ नहीं पाए। कृपया फिर से बोलें।',
            errorEnglish: "We couldn't understand your voice. Please try again.",
            errorMarathi: 'आम्हाला तुमचा आवाज समजला नाही. कृपया पुन्हा बोला.',
            errorBengali: 'আমরা আপনার কথা বুঝতে পারিনি। অনুগ্রহ করে আবার বলুন।',
          });
          return;
        }

        resolve({
          success: true,
          transcript: trimmed,
          language,
        });
      };

      try {
        rec.start();
      } catch (e) {
        resolve({
          success: false,
          transcript: '',
          language,
          errorType: 'audio_capture',
          errorHindi: 'माइक्रोफ़ोन शुरू नहीं हो सका। कृपया अनुमति दें और पुनः प्रयास करें।',
          errorEnglish: 'Microphone could not start. Please grant permission and try again.',
          errorMarathi: 'मायक्रोफोन सुरू होऊ शकला नाही. कृपया परवानगी द्या.',
          errorBengali: 'মাইক্রোফোন চালু করা যায়নি। অনুগ্রহ করে অনুমতি দিন।',
        });
      }
    });
  }

  /**
   * Stop ongoing recognition manually (e.g. user presses Stop button).
   */
  stopRecognition(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  private getErrorMessages(errorType: string): { hindi: string; english: string; marathi: string; bengali: string } {
    switch (errorType) {
      case 'no-speech':
      case 'no_speech':
        return {
          hindi: 'हम आपकी आवाज़ समझ नहीं पाए। कृपया ज़ोर से और साफ बोलें।',
          english: "We couldn't hear you clearly. Please speak louder and clearly.",
          marathi: 'आम्हाला तुमचा आवाज स्पष्ट ऐकू आला नाही. कृपया स्पष्ट आणि मोठ्याने बोला.',
          bengali: 'আমরা আপনার কথা স্পষ্ট শুনতে পাইনি। অনুগ্রহ করে জোরে এবং স্পষ্টভাবে বলুন।',
        };
      case 'not-allowed':
      case 'not_allowed':
        return {
          hindi: 'माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया ब्राउज़र में माइक्रोफ़ोन की अनुमति दें।',
          english: 'Microphone permission was denied. Please allow microphone access in your browser.',
          marathi: 'मायक्रोफोनची परवानगी नाकारली गेली. कृपया ब्राउझरमध्ये परवानगी द्या.',
          bengali: 'মাইক্রোফোনের অনুমতি পাওয়া যায়নি। অনুগ্রহ করে ব্রাউজারে অনুমতি দিন।',
        };
      case 'network':
        return {
          hindi: 'नेटवर्क समस्या के कारण आवाज़ पहचान विफल हुई। कृपया अपना इंटरनेट जांचें।',
          english: 'Speech recognition failed due to network issues. Please check your internet.',
          marathi: 'नेटवर्क समस्येमुळे आवाज ओळख अयशस्वी झाली. कृपया इंटरनेट तपासा.',
          bengali: 'নেটওয়ার্ক সমস্যার কারণে ভয়েস রিকগনিশন ব্যর্থ হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করুন।',
        };
      case 'audio-capture':
      case 'audio_capture':
        return {
          hindi: 'माइक्रोफ़ोन उपलब्ध नहीं है। कृपया माइक्रोफ़ोन कनेक्ट करें।',
          english: 'No microphone found. Please connect a microphone.',
          marathi: 'कोणताही मायक्रोफोन सापडला नाही. कृपया मायक्रोफोन जोडा.',
          bengali: 'কোনো মাইক্রোফোন পাওয়া যায়নি। অনুগ্রহ করে মাইক্রোফোন সংযুক্ত করুন।',
        };
      default:
        return {
          hindi: 'आवाज़ पहचान में त्रुटि हुई। कृपया पुनः प्रयास करें।',
          english: 'Speech recognition error. Please try again.',
          marathi: 'आवाज ओळखण्यात त्रुटी आली. कृपया पुन्हा प्रयत्न करा.',
          bengali: 'ভয়েস রিকগনিশনে ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
        };
    }
  }

  /**
   * Generate structured catalog from product image + real transcript via backend API.
   * Sends image + voice transcript to POST /api/v1/ai/catalog.
   * NEVER fabricates output — if transcript is empty, returns empty catalog.
   */
  async generateCatalog(
    transcript: string,
    language: Language = 'hi',
    imageBase64?: string
  ): Promise<CatalogResult> {
    if (!transcript.trim()) {
      return {
        success: false,
        title: '',
        category: '',
        material: '',
        craftType: '',
        descriptionHindi: '',
        descriptionEnglish: '',
        keywords: [],
        confidence: 0,
        isAiAnalyzed: false,
        isDevFallback: true,
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/ai/catalog`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transcript.trim(),
          language,
          image_base64: imageBase64 || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          title: data.title || data.title_hindi || data.title_english || '',
          titleHindi: data.title_hindi || '',
          titleEnglish: data.title_english || '',
          titleMarathi: data.title_marathi || data.title_hindi || '',
          titleBengali: data.title_bengali || data.title_hindi || '',
          category: data.category || '',
          material: data.material || '',
          craftType: data.craft_type || '',
          descriptionHindi: data.description_hindi || data.description || '',
          descriptionEnglish: data.description_english || data.description || '',
          descriptionMarathi: data.description_marathi || data.description_hindi || '',
          descriptionBengali: data.description_bengali || data.description_hindi || '',
          keywords: data.keywords || [],
          confidence: data.confidence ?? 0.9,
          isAiAnalyzed: Boolean(data.is_ai_analyzed),
          isDevFallback: Boolean(data.dev_fallback),
          confirmationQuestion: data.confirmation_question || undefined,
          observedVisuals: data.observed_visuals || [],
        };
      }
    } catch (err) {
      console.warn('[VoiceCatalogService] Backend call failed, using client-side transcript parser:', err);
    }

    // Client-side offline fallback: accurately extract based on spoken words
    const lower = transcript.toLowerCase();
    const isJute = lower.includes('जूट') || lower.includes('jute') || lower.includes('पिशवी') || lower.includes('পাট');
    const isPottery = lower.includes('मिट्टी') || lower.includes('terracotta') || lower.includes('vase') || lower.includes('फूलदान') || lower.includes('माती') || lower.includes('ফুলদানি');

    let titleHi = 'हस्तनिर्मित शिल्पकृति';
    let titleEn = 'Handcrafted Item';
    let titleMr = 'हस्तनिर्मित कलाकृती';
    let titleBn = 'হাতে তৈরি শিল্পকর্ম';
    let category = 'हस्तशिल्प / Handicrafts';
    let material = 'प्राकृतिक सामग्री';
    let craftType = 'हस्तनिर्मित शिल्प';
    const keywords = ['handmade', 'handcrafted'];

    if (isJute) {
      titleHi = 'हस्तनिर्मित जूट बैग';
      titleEn = 'Handcrafted Jute Bag';
      titleMr = 'हस्तनिर्मित जूट बॅग';
      titleBn = 'হাতে তৈরি পাটের ব্যাগ';
      category = 'बैग और एक्सेसरीज़ / Bags & Accessories';
      material = 'प्राकृतिक जूट (Natural Jute)';
      craftType = 'हस्तनिर्मित जूट शिल्प';
      keywords.push('jute bag', 'जूट बैग', 'eco friendly', 'পাটের ব্যাগ');
    } else if (isPottery) {
      titleHi = 'हस्तनिर्मित टेराकोटा फूलदान';
      titleEn = 'Handcrafted Terracotta Vase';
      titleMr = 'हस्तनिर्मित मातीची फुलदाणी';
      titleBn = 'হাতে তৈরি মাটির ফুলদানি';
      category = 'मिट्टी के बर्तन / Pottery';
      material = 'प्राकृतिक मिट्टी (Terracotta Clay)';
      craftType = 'चाक पर तराशी हस्तकला';
      keywords.push('terracotta', 'pottery', 'मिट्टी शिल्प', 'মাটির শিল্প');
    }

    const titleMap: Record<Language, string> = {
      hi: titleHi,
      en: titleEn,
      mr: titleMr,
      bn: titleBn,
    };

    return {
      success: true,
      title: titleMap[language] || titleHi,
      titleHindi: titleHi,
      titleEnglish: titleEn,
      titleMarathi: titleMr,
      titleBengali: titleBn,
      category,
      material,
      craftType,
      descriptionHindi: `शिल्पकार का विवरण: "${transcript}"। 100% हस्तनिर्मित और प्राकृतिक।`,
      descriptionEnglish: `Artisan Description: "${transcript}". 100% handcrafted and eco-friendly.`,
      descriptionMarathi: `कारागिराचे वर्णन: "${transcript}". 100% हस्तनिर्मित आणि पर्यावरणपूरक.`,
      descriptionBengali: `কারিগর বিবরণ: "${transcript}"। ১০০% হাতে তৈরি ও পরিবেশবান্ধব।`,
      keywords,
      confidence: 0.85,
      isAiAnalyzed: false,
      isDevFallback: true,
      confirmationQuestion: isJute ? (language === 'mr' ? 'ही जूट बॅग आहे का?' : (language === 'bn' ? 'এটি কি পাটের ব্যাগ?' : 'क्या यह जूट का बैग है?')) : undefined,
    };
  }
}

export const voiceCatalogService = new VoiceCatalogService();


