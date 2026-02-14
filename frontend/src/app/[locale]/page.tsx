import { use } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Menu from '@/components/Menu';
import Hero from '@/components/Hero';
import OurServices from '@/components/OurServices';
import AboutUs from '@/components/AboutUs';
import OurTeam from '@/components/OurTeam';
import { ContactUsForm } from '@/components/ContactUsForm';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/components/Toast/ToastContext';
import { ToastContainer } from '@/components/Toast/ToastContainer';
import Metrics from '@/components/Metrics';

export default function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Again, ensure next-intl knows the locale
  setRequestLocale(locale);
  
  return (
    <>
      <Metrics locale={locale} />
      <ToastProvider>
        <div>
          <Menu />
          <Hero />
          <OurServices />
          <AboutUs />
          <OurTeam />
          <ContactUsForm locale={locale} />
          <Footer />
        </div>
        <ToastContainer/>
      </ToastProvider>
    </>
  );
}
