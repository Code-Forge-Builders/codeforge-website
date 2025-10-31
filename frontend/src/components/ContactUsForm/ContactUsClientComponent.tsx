'use client'
import { useTranslations } from "use-intl";
import Input from "../Input";
import PhoneInput from "../PhoneInput";
import Select, { ISelectOption } from "../Select";
import Textarea from "../Textarea";
import { CountryData } from "./fetchCountryData";
import { FormEvent } from "react";

interface ContactUsFormClientComponentProps {
  countryData: CountryData[]
}

export function ContactUsFormClientComponent({ countryData }: ContactUsFormClientComponentProps) {
  const t = useTranslations();

  const SelectOptions: ISelectOption[] = t.raw("ContactUs.fields.serviceField.options") as ISelectOption[];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return <section id="our-team" className="bg-zinc-900 w-screen flex justify-center">
    <section className="flex flex-col w-11/12 md:w-6/12 gap-4 pb-8">
      <div id="our-services-header" className="flex flex-col p-8 mt-[63px] gap-4">
        <h2 className="text-center text-4xl md:text-6xl font-semibold">{t('ContactUs.title')}</h2>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input required id="name-input" name="name-input" label={t('ContactUs.fields.nameField.label')} placeholder={t('ContactUs.fields.nameField.placeholder')} />
        <Input required id="email-input" name="email-input" type="email" label={t('ContactUs.fields.emailField.label')} placeholder={t('ContactUs.fields.emailField.placeholder')} />
        <div className="flex flex-col md:flex-row gap-2">
          <PhoneInput required name="phone-input" className="grow" id="phone-input" label={t('ContactUs.fields.phoneWhatsappField.label')} countries={countryData} />
          <Select required name="service-input" className="grow shrink min-w-0" id="service-input" label={t('ContactUs.fields.serviceField.label')} emptyOptionLabel={t('ContactUs.fields.serviceField.placeholder')} options={SelectOptions} />
        </div>
        <Textarea required name="project-description-input" label={t('ContactUs.fields.projectDescriptionField.label')} placeholder={t('ContactUs.fields.projectDescriptionField.placeholder')} rows={4} />
        <div className="flex justify-end">
          <button className="bg-primary px-4 py-2 rounded cursor-pointer">{t('Hero.CTAButtonLabel')}</button>
        </div>
      </form>
    </section>
  </section>
}
