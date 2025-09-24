import { allowedLocales } from '../consts/locales'

export const generateStaticParams = (): { locale: string }[] => {
  return allowedLocales.map((locale: string): { locale: string } => ({ locale }))
};

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div>
      <h1>Current locale: {locale}</h1>
    </div>
  );
}
