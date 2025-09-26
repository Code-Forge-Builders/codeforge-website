import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { locales } from '@/i18n/locales';

export const generateStaticParams = (): { locale: string }[] => {
  return locales.map((locale: string): { locale: string } => ({ locale }))
};

export default function Home({ params }: { params: Promise<{ locale: string }> }) {
  const t = useTranslations();

  return (
    <div>
      <nav>
        <Image src="https://placehold.co/800x300" alt={t("logo_alt")} />
        <ul>

        </ul>
      </nav>
    </div>
  );
}
