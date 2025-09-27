// src/app/page.tsx
import { routing } from '@/i18n/routing';
import { NextIntlClientProvider } from 'next-intl';
import Home from './[locale]/page';

export default async function RootPage() {
  const locale = routing.defaultLocale;

  const messages = (
    await import(`../../translations/${locale}.json`)
  ).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Home params={new Promise((resolve) => {
        resolve({ locale })
      })} />
    </NextIntlClientProvider>
  );
}

