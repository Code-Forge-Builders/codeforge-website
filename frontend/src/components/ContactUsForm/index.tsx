import Input from "../Input";
import PhoneInput from "../PhoneInput";
import Select, { ISelectOption } from "../Select";
import { fetchCountryData } from "./fetchCountryData";
import { getTranslations } from "next-intl/server";

export async function ContactUsForm() {
  const t = await getTranslations();

  const SelectOptions: ISelectOption[] = t.raw("ContactUs.fields.serviceField.options") as ISelectOption[];

  const countryData = await fetchCountryData();

  return <section id="our-team" className="bg-zinc-900 w-screen flex justify-center">
    <section className="flex flex-col w-11/12 md:w-4/12 gap-4 pb-8">
      <div id="our-services-header" className="flex flex-col p-8 mt-[63px] gap-4">
        <h2 className="text-center text-4xl md:text-6xl font-semibold">{t('ContactUs.title')}</h2>
      </div>
      <form className="flex flex-col gap-4">
        <Input id="name-input" label={t('ContactUs.fields.nameField.label')} placeholder={t('ContactUs.fields.nameField.placeholder')} />
        <Input id="email-input" type="email" label={t('ContactUs.fields.emailField.label')} placeholder={t('ContactUs.fields.emailField.placeholder')} />
        <div className="flex flex-col md:flex-row gap-2">
          <PhoneInput className="grow" id="phone-input" label={t('ContactUs.fields.phoneWhatsappField.label')} countries={countryData} />
          <Select className="grow shrink min-w-0" id="service-input" label={t('ContactUs.fields.serviceField.label')} emptyOptionLabel={t('ContactUs.fields.serviceField.placeholder')} options={SelectOptions} />
        </div>
      </form>
    </section>
  </section>
}
