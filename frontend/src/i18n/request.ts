import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import en from "../../translations/en.json"
import pt from "../../translations/pt.json"
import es from "../../translations/es.json"

/* eslint-disable @typescript-eslint/no-explicit-any */
const msgMap: Record<string, any> = {
  "en": en,
  "pt": pt,
  "es": es,
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale ?? routing.defaultLocale

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  if (!routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: msgMap[locale]
  };
});
