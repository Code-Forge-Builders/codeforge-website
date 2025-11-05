import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale ?? routing.defaultLocale

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  if (!routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`../../translations/${locale}.json`)).default
  };
});
