'use client'
import { useTranslations } from "use-intl";
import Input from "../Input";
import Select, { ISelectOption } from "../Select";
import Textarea from "../Textarea";
import { CountryData } from "./fetchCountryData";
import { FormEvent, useState } from "react";
import PrimaryButton from "../PrimaryButton";

interface ContactUsFormClientComponentProps {
  countryData: CountryData[]
}

export function ContactUsFormClientComponent({ countryData }: ContactUsFormClientComponentProps) {
  const t = useTranslations();

  const [loading, setLoading] = useState(false);

  const SelectOptions: ISelectOption[] = t.raw("ContactUs.fields.serviceField.options") as ISelectOption[];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    setTimeout(() => {
      setLoading(false) // Add actual logic later
    }, 1500)
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  function handlePhoneChange(event: any) {

  }

  return <section id="contact-us" className="bg-zinc-900 w-screen flex justify-center">
    <section className="flex flex-col w-11/12 md:w-6/12 gap-4 pb-8">
      <div id="our-services-header" className="flex flex-col p-8 mt-[63px] gap-4">
        <h2 className="text-center text-4xl md:text-6xl font-semibold">{t('ContactUs.title')}</h2>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input required id="name-input" name="name-input" label={t('ContactUs.fields.nameField.label')} placeholder={t('ContactUs.fields.nameField.placeholder')} />
        <Input required id="email-input" name="email-input" type="email" label={t('ContactUs.fields.emailField.label')} placeholder={t('ContactUs.fields.emailField.placeholder')} />
        <div className="flex flex-col md:flex-row gap-2">
          <Input required id="phone-input" className="grow shrink min-w-0" name="phone-input" type="tel" label={t('ContactUs.fields.phoneWhatsappField.label')} onChange={handlePhoneChange} />
          <Select required name="service-input" className="grow shrink min-w-0" id="service-input" label={t('ContactUs.fields.serviceField.label')} emptyOptionLabel={t('ContactUs.fields.serviceField.placeholder')} options={SelectOptions} />
        </div>
        <Textarea required name="project-description-input" label={t('ContactUs.fields.projectDescriptionField.label')} placeholder={t('ContactUs.fields.projectDescriptionField.placeholder')} rows={4} />
        <div className="flex justify-end">
          <PrimaryButton loading={loading}>{t('Hero.CTAButtonLabel')}</PrimaryButton>
        </div>
      </form>
    </section>
  </section>
}
