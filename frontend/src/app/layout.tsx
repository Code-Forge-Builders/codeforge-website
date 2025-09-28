import { notFound } from 'next/navigation';
import type { Metadata } from "next";
import { Open_Sans, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "CodeForge Builders",
  description: "Desenvolvimento web e mobile para empresas em busca de crescimento",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>
}>) {
  let { locale } = await params;

  if (!locale) {
    locale = routing.defaultLocale
  }

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages()

  // This is the key line: set the locale for next-intl
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body
        className={`${openSans.variable} ${sourceCodePro.variable} bg-background text-foreground antialiased `}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
