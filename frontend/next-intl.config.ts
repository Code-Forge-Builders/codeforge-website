import { allowedLocales } from '@/app/consts/locales';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  // All supported locales
  locales: allowedLocales,

  // Default fallback locale
  defaultLocale: 'en',

  // Load the messages for this locale
  messages: (await import(`./public/locales/${locale}/common.json`)).default,
}));

