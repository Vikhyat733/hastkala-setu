import { en } from './en';
import { hi } from './hi';
import { mr } from './mr';
import { bn } from './bn';

export type Language = 'hi' | 'en' | 'mr' | 'bn';

export const translations = {
  hi,
  en,
  mr,
  bn,
};

export type Translations = typeof hi;

export const getTranslations = (lang: Language): Translations => {
  return translations[lang] || translations.hi;
};

