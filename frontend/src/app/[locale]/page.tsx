import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { use } from 'react';
import { setRequestLocale } from 'next-intl/server';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Menu from '@/components/Menu';

export default function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Again, ensure next-intl knows the locale
  setRequestLocale(locale);



  return (
    <div>
      <Menu />
    </div>
  );
}
