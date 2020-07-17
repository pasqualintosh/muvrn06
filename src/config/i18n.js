import I18n from "react-native-i18n";

import { Language } from "./Language";

I18n.fallbacks = true;

I18n.translations = Language;

I18n.langs = ["en", "it", "nl", "sv", "es", "ca", "pt", "br", "rs"];

export const strings = (name, params = {}) => I18n.t(name, params);
export const switchLanguage = (lang, component) => {
  I18n.locale = lang;
  // component.forceUpdate();
};

export const getLanguageI18n = () => {
  return I18n.locale;
};

export default I18n;
