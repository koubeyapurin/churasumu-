import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ja from './locales/ja.json';
import en from './locales/en.json';
import zh from './locales/zh.json';

const resources = {
  ja: { translation: ja },
  en: { translation: en },
  zh: { translation: zh },
};

// ブラウザから言語設定を取得、デフォルトは日本語
const getBrowserLanguage = (): string => {
  const browserLang = navigator.language.split('-')[0];
  return ['ja', 'en', 'zh'].includes(browserLang) ? browserLang : 'ja';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || getBrowserLanguage(),
    fallbackLng: 'ja',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
