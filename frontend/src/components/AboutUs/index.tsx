import { useTranslations } from "next-intl"
import Image from "next/image";

export default function AboutUs() {
  const t = useTranslations();

  const paragraphs = t.raw('AboutUs.contentItens');

  return <section id="about-us" className="flex w-screen justify-center p-4 ">
    <div className="md:w-11/12 w-full flex md:flex-row flex-col-reverse justify-between items-center">
      <div className="md:w-7/11 w-full md:m-8 flex flex-col gap-3">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-4">{t('AboutUs.title')}</h2>
        {
          paragraphs.map((t: string | { listItems: Array<string> }, idx: number) => {
            if (typeof t === 'string') {
              return <p key={idx} className='md:text-xl text-base' >{t}</p>
            }

            if (typeof t === 'object' && t.listItems && Array.isArray(t.listItems)) {
              return <ul key={idx} className="list-disc ml-8">
                {t.listItems.map((i, idx2) => <li key={idx2} className="py-1 md:text-xl text-base">{i}</li>)}
              </ul>
            }
          })
        }
      </div>
      <Image width={600} height={400} src={'/assets/avatars.webp'} alt="Avatars representing the founders" />
    </div>
  </section>
}
