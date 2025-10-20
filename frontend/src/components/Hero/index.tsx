import { useTranslations } from 'next-intl';
import styles from './Hero.module.css'
import PrimaryLinkButton from '../PrimaryLinkButton';

export default function Hero() {
  const t = useTranslations();

  const paragraphs = t.raw("Hero.content") as string[];

  return <section id='hero' className={`${styles.heroSection} w-screen h-screen flex justify-center`}>
    <section className="flex justify-start items-center w-11/12">
      <div className='flex flex-wrap w-full md:w-9/15 gap-6'>
        <h2 className='text-2xl md:text-5xl font-semibold w-8/11'>{t('Hero.title')}</h2>
        {
          paragraphs.map((text, i) => (
            <p className='md:text-xl text-base' key={i}>{text}</p>
          ))
        }
        <PrimaryLinkButton href="#" className='flex gap-2'><span>🚀</span> {t('Hero.CTAButtonLabel')}</PrimaryLinkButton>
      </div>
    </section>
  </section>
}
