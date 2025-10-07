import Link from "next/link";
import LanguageSwitcher from "../LanguageSwitcher";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { IMenuItem } from "./interfaces/menu-item.interface";
import PrimaryLinkButton from "../PrimaryLinkButton";

export default function Menu() {
  const t = useTranslations();

  const menuItems: IMenuItem[] = [
    {
      title: t('Menu.Home'),
      url: '#'
    },
    {
      title: t('Menu.Services'),
      url: '#'
    }, {
      title: t('Menu.Products'),
      url: '#'
    }, {
      title: t('Menu.AboutUs'),
      url: '#'
    }, {
      title: t('Menu.Team'),
      url: '#'
    },
  ]

  return <section className="w-full bg-background flex justify-center sticky">
    <nav className="w-11/12 flex gap-2 justify-between items-center">
      <Link href="/"><Image width={300} height={63} src="/banner-logo-dark-300x63.webp" alt={t("LogoAltText")} /></Link>
      <ul className="flex gap-4">
        {
          menuItems.map((item, i) => (
            <li key={i}>
              <Link className="px-4 py-2" href={item.url}>{item.title}</Link>
            </li>
          ))
        }
      </ul>
      <section className="flex gap-2 items-center">
        <LanguageSwitcher languages={['en', 'pt', 'es']} />
        <PrimaryLinkButton href="#">{t('Menu.ContactUs')}</PrimaryLinkButton>
      </section>
    </nav>
  </section>
}
