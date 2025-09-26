
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // fallback if locale is undefined
  const currentLocale = locale ?? 'en';

  return {
    locale: currentLocale,
    messages: (await import(`./public/locales/${locale}/common.json`)).default
  }
});

