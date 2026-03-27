// src/app/page.tsx
import { routing } from '@/i18n/routing';
import { NextIntlClientProvider } from 'next-intl';
import Home from './[locale]/page';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import en from '../../translations/en.json';
import pt from '../../translations/pt.json';
import es from '../../translations/es.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const messObj: Record<string, any> = {
  "en": en,
  "pt": pt,
  "es": es,
}

export default async function RootPage() {
  const cookieLocale = (await cookies()).get('NEXT_LOCALE')?.value;

  if (cookieLocale && routing.locales.includes(cookieLocale)) {
    redirect(`/${cookieLocale}`);
  }

  const acceptLanguageHeader = (await headers()).get('accept-language')
  let browserLocale: string | undefined

  if (acceptLanguageHeader) {
    const langs = acceptLanguageHeader.split(',').map(l => l.split(';')[0].trim().slice(0, 2))
    browserLocale = langs.find((l) => routing.locales.includes(l))
  }

  if (browserLocale) {
    redirect(browserLocale)
  }

  const locale = routing.defaultLocale;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages: any = messObj[locale]

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Home params={new Promise((resolve) => {
        resolve({ locale })
      })} />
    </NextIntlClientProvider>
  );
}

