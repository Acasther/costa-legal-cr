import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './assets/i18n/en.json';
import es from './assets/i18n/es.json';

export const LANGUAGES = ['en', 'es'];
const STORAGE_KEY = 'lang';

// Pages are pre-rendered in English, so every visit starts in English and switches after hydration.
i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  resources: {
    en: { global: en },
    es: { global: es },
  },
});

export const preferredLanguage = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (LANGUAGES.includes(stored)) return stored;
  } catch {
    // Storage can be blocked; fall back to the browser language.
  }
  return window.navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en';
};

export const rememberLanguage = (lang) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Ignore: the choice just won't persist.
  }
};

export default i18n;
