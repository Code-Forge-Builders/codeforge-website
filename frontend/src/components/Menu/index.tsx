'use client'
import { useState } from 'react';
import Link from "next/link";
import LanguageSwitcher from "../LanguageSwitcher";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { IMenuItem } from "./interfaces/menu-item.interface";
import PrimaryLinkButton from "../PrimaryLinkButton";
import { HiX, HiMenu } from "react-icons/hi";

export default function Menu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const t = useTranslations();

  const menuItems: IMenuItem[] = [
    {
      title: t('Menu.Home'),
      url: '#hero'
    },
    {
      title: t('Menu.Services'),
      url: '#our-services'
    },
    {
      title: t('Menu.Products'),
      url: '#'
    },
    {
      title: t('Menu.AboutUs'),
      url: '#'
    },
    {
      title: t('Menu.Team'),
      url: '#'
    },
  ]

  return <section className="w-full bg-background flex justify-center fixed">
    <nav className="w-11/12 flex gap-2 justify-between items-center py-2 md:py-0">
      <Link href="/"><Image width={300} height={63} src="/banner-logo-dark-300x63.webp" alt={t("LogoAltText")} className="w-40 md:w-[300px] h-auto" /></Link>
      {/* Desktop Menu */}
      <ul className="hidden md:flex gap-4">
        {
          menuItems.map((item, i) => (
            <li key={i}>
              <Link className="px-4 py-2" href={item.url}>{item.title}</Link>
            </li>
          ))
        }
      </ul>
      <section className="hidden md:flex gap-2 items-center">
        <LanguageSwitcher languages={['en', 'pt', 'es']} />
        <PrimaryLinkButton href="#">{t('Menu.ContactUs')}</PrimaryLinkButton>
      </section>
      {/* Mobile Hamburger */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden text-2xl cursor-pointer"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <HiX /> : <HiMenu />}
      </button>
    </nav>
    {/* Mobile Overlay Menu */}
      {isMenuOpen && (
        <div className="fixed top-10 left-0 right-0 bottom-0 bg-background bg-opacity-95 z-40 flex flex-col p-2 items-start justify-start space-y-6 text-center pt-8">
        {menuItems.map((item, i) => (
          <Link
            key={i}
            href={item.url}
            className="text-xl"
            onClick={() => setIsMenuOpen(false)}
          >
            {item.title}
          </Link>
        ))}

        <LanguageSwitcher languages={['en', 'pt', 'es']} />
        <PrimaryLinkButton href="#" className="mt-4">
          {t('Menu.ContactUs')}
        </PrimaryLinkButton>
      </div>
    )}
  </section>
}
