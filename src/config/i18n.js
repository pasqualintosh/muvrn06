import I18n from "react-native-i18n";

import { Language } from "./languageApp.js";

I18n.fallbacks = true;

I18n.translations = Language;

I18n.langs = ["en", "it", "es", "nl", "sv", "es", "ca", "pt", "br", "rs"];

export const strings = (name, params = {}) => I18n.t(name, params);
export const switchLanguage = (lang, component) => {
  I18n.locale = lang;
  // component.forceUpdate();
};

export const getLanguageI18n = () => {
  return I18n.locale;
};

// associo una lingua a un indice utile per prendere dati dal db con la stessa lingua
export const convertLanguagesIndexForBackend = (prefLang) => {
  switch (prefLang) {
    case "en":
      return 0;
      break;
    // case "nl":
    //   return 1;
    //   break;
    // case "sv":
    //   return 2;
    //   break;
    case "it":
      return 1;
      break;
    // case "ct":
    //   return 5;
    //   break;
    case "es":
      return 2;
      break;
    case "pt":
      return 3;
      break;
    // case "br":
    //   return 7;
    // case "rs":
    //   return 8;
    // case "pl":
    //   return 9;
    // case "de":
    //   return 10;
    //   break;
    default:
      return 0;
      break;
  }
};

export default I18n;
