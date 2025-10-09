import { useTranslations } from 'next-intl';
import styles from './Hero.module.css'
import PrimaryLinkButton from '../PrimaryLinkButton';

export default function Hero() {
  const t = useTranslations();

  const paragraphCount = 3;
  const paragraphs = Array.from({ length: paragraphCount }).map((_, i) => t(`Hero.Content.${i}`));

  return <section className={`${styles.heroSection} w-screen h-screen flex justify-center`}>
    <div className="flex justify-start items-center w-11/12">
      <div className='flex flex-wrap w-9/15 gap-6'>
        <h2 className='text-5xl font-semibold w-6/11'>{t('Hero.Title')}</h2>
        {
          paragraphs.map((text, i) => (
            <p className='text-xl' key={i}>{text}</p>
          ))
        }
        <PrimaryLinkButton href="#" className='flex gap-2'>🚀{t('Hero.CTAButtonLabel')}</PrimaryLinkButton>
      </div>
    </div>
  </section>
}
