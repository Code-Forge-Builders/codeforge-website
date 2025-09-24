import { notFound } from 'next/navigation';
import type { Metadata } from "next";
import { Open_Sans, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { allowedLocales } from '../consts/locales'

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

export const generateStaticParams = (): { locale: string }[] => {
  return allowedLocales.map((locale: string): { locale: string } => ({ locale }))
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params;
  if (!allowedLocales.includes(locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body
        className={`${openSans.variable} ${sourceCodePro.variable} bg-background text-foreground antialiased `}
      >
        {children}
      </body>
    </html>
  );
}
