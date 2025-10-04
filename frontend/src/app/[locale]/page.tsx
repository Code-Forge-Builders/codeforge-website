import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { use } from 'react';
import { setRequestLocale } from 'next-intl/server';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export default function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Again, ensure next-intl knows the locale
  setRequestLocale(locale);


  const t = useTranslations();

  return (
    <div>
      <nav>
        <Image width={300} height={63} src="/banner-logo-dark-300x63.webp" alt={t("LogoAltText")} />
        <ul>
          <li>
            <Link href="#">{t('Menu.Home')}</Link>
          </li>
          <li>
            <Link href="#">{t('Menu.Services')}</Link>
          </li>
          <li>
            <Link href="#">{t('Menu.Products')}</Link>
          </li>
          <li>
            <Link href="#">{t('Menu.AboutUs')}</Link>
          </li>
          <li>
            <Link href="#">{t('Menu.Team')}</Link>
          </li>
          <li>
            <Link href="#">{t('Menu.ContactUs')}</Link>
          </li>
        </ul>
        <LanguageSwitcher languages={['en', 'pt', 'es']} />
      </nav>
    </div>
  );
}
