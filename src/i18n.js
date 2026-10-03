import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import en from './en.json';
import romanUr from './roman-ur.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      'roman-ur': { translation: romanUr },
      // Future: add 'ur' for Urdu script (RTL) here
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'careerraah-lang',
      caches: ['localStorage'],
    },
  });

export default i18n;
