import { useTranslations } from "next-intl";
import Image from "next/image";
import { IMenuItem } from "../Menu/interfaces/menu-item.interface";
import Link from "next/link";
import PrimaryLinkButton from "../PrimaryLinkButton";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { SlSocialInstagram, SlSocialLinkedin, SlSocialTwitter } from "react-icons/sl";

export default function Footer() {
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
    /** {
      title: t('Menu.Products'),
      url: '#'
    },
    */
    {
      title: t('Menu.AboutUs'),
      url: '#about-us'
    },
    {
      title: t('Menu.Team'),
      url: '#our-team'
    },
  ]

  const whatsappMessageParams = new URLSearchParams();

  whatsappMessageParams.set('text', t('WhatsappMessage'));

  const whatsappUrl = `https://wa.me/+5571984754843?${whatsappMessageParams.toString()}`;

  return <section id="about-us" className="flex w-screen justify-center">
    <div className="md:w-11/12 w-full flex-col">
      <div className="flex flex-col md:flex-row items-start justify-between">
        <Image width={300} height={63} src="/assets/banner-logo-dark-300x63.webp" alt={t("LogoAltText")} className="w-[300px] mx-2 my-1 h-auto" />
        <div className="flex flex-col my-4 mx-4 md:mx-0">
          <ul className="flex flex-col">
            {
              menuItems.map((item, i) => (
                <li className="flex" key={i}>
                  <Link className="px-4 py-2" href={item.url}>{item.title}</Link>
                </li>
              ))
            }
          </ul>
          <PrimaryLinkButton href="#contact-us">{t('Menu.ContactUs')}</PrimaryLinkButton>
        </div>
      </div>
      <div className="flex flex-row justify-center">
        <div className="w-9/12 md:w-full border-2 border-white/20"></div>
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center my-4">
        <span>CodeForge {new Date().getFullYear()} ©</span>
        <div className="flex flex-row gap-2">
          <a href="https://www.linkedin.com/company/codeforge-dev/" target="_blank" rel="noopener noreferrer nofollow" className="border-1 border-white rounded-lg p-2">
            <SlSocialLinkedin size={20} />
          </a>
          <a href="#" className="border-1 border-white rounded-lg p-2">
            <SlSocialTwitter size={20} />
          </a>
          <a href="https://github.com/Code-Forge-Builders" target="_blank" rel="noopener noreferrer nofollow" className="border-1 border-white rounded-lg p-2">
            <FaGithub size={22} />
          </a>
          <a href="https://www.instagram.com/codeforgebr/" target="_blank" rel="noopener noreferrer nofollow" className="border-1 border-white rounded-lg p-2">
            <SlSocialInstagram size={20} />
          </a>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer nofollow" className="border-1 border-white rounded-lg p-2">
            <FaWhatsapp size={22} />
          </a>
        </div>
      </div>
    </div>
  </section>
}
