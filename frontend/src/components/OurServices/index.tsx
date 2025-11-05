import { useTranslations } from "next-intl";
import { CiEdit } from "react-icons/ci";
import { FiServer, FiTool } from "react-icons/fi";
import { IoCloudUploadOutline } from "react-icons/io5";
import { RiCodeView } from "react-icons/ri";

export default function OurServices() {
  const t = useTranslations();

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const iconsArr: Array<any> = [
    CiEdit,
    RiCodeView,
    FiServer,
    IoCloudUploadOutline,
    FiTool
  ]

  const contentItems = t.raw('OurServices.contentItems') as Array<{
    title: string;
    content: string;
  }>;

  return <section id="our-services" className="bg-zinc-900 w-screen min-h-screen flex justify-center">
    <section className="flex flex-col w-11/12 gap-4 pb-8">
      <div id="our-services-header" className="flex flex-col p-8 mt-[63px] gap-4">
        <h2 className="text-center text-4xl md:text-6xl font-semibold">{t('OurServices.title')}</h2>
        <p className="text-center text-base md:text-xl">{t('OurServices.subtitle')}</p>
      </div>
      <div id="our-services-content" className="grid sm:grid-cols-1 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {contentItems.map((item, i) => (
          <div key={i} className="flex flex-wrap justify-start items-start bg-zinc-800 gap-2 p-4 rounded-2xl">
            <span className="rounded-xl bg-zinc-700 p-4">{iconsArr[i]({ size: 60 })}</span>
            <h3 className="text-xl md:text-2xl font-semibold w-full">{item.title}</h3>
            <p>{item.content}</p>
          </div>
        ))}
      </div>
    </section>
  </section>
}
