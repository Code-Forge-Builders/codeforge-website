import Image from 'next/image';
import { allowedLocales } from '../consts/locales'
import { useTranslations } from 'next-intl';

export const generateStaticParams = (): { locale: string }[] => {
  return allowedLocales.map((locale: string): { locale: string } => ({ locale }))
};

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
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
