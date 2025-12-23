'use client'
import { useTranslations } from "use-intl";
import Input from "../Input";
import Select, { ISelectOption } from "../Select";
import Textarea from "../Textarea";
import { FormEvent, useRef, useState } from "react";
import PrimaryButton from "../PrimaryButton";
import { detectRegion, isValidPhone, phoneMaskAsYouType } from "@/utils/phone";
import { InquiryBodyPayload, submitInquiry } from "./submitInquiry";

export function ContactUsForm({locale}: {locale: string}) {
  const t = useTranslations();

  const [loading, setLoading] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const serviceSelectRef = useRef<HTMLSelectElement>(null);
  const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null);

  const SelectOptions: ISelectOption[] = t.raw("ContactUs.fields.serviceField.options") as ISelectOption[];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    if (
    !nameInputRef.current ||
    !emailInputRef.current ||
    !phoneInputRef.current ||
    !serviceSelectRef.current ||
    !descriptionTextareaRef.current
  ) {
    setLoading(false);
    return;
  }

  const customer_name = nameInputRef.current.value || "";
  const customer_email = emailInputRef.current.value || "";
  const customer_phone = phoneInputRef.current.value || "";
  const service_key = serviceSelectRef.current.value || "";
  const project_description = descriptionTextareaRef.current.value || "";
  
  const payload: InquiryBodyPayload = {
    customer_name,
    customer_email,
    customer_phone,
    service_key,
    project_description
  }

  submitInquiry(payload)
    .then(() => {
      if (
        !nameInputRef.current ||
        !emailInputRef.current ||
        !phoneInputRef.current ||
        !serviceSelectRef.current ||
        !descriptionTextareaRef.current
      ) {
        return;
      }
      nameInputRef.current.value = "";
      emailInputRef.current.value = "";
      phoneInputRef.current.value = "";
      serviceSelectRef.current.value = "";
      descriptionTextareaRef.current.value = "";
    }).finally(() => setLoading(false))
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  function handlePhoneChange(event: any) {
    const region = detectRegion(locale);
    const formatted = phoneMaskAsYouType(event.target.value, region);

    event.target.value = formatted;

    if (!isValidPhone(event.target.value)) {
      event.target.setCustomValidity('Phone number is invalid')
    }
    else {
      event.target.setCustomValidity('')
    }
  }

  return <section id="contact-us" className="bg-zinc-900 w-screen flex justify-center">
    <section className="flex flex-col w-11/12 md:w-6/12 gap-4 pb-8">
      <div id="our-services-header" className="flex flex-col p-8 mt-[63px] gap-4">
        <h2 className="text-center text-4xl md:text-6xl font-semibold">{t('ContactUs.title')}</h2>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input ref={nameInputRef} required id="name-input" name="name-input" label={t('ContactUs.fields.nameField.label')} placeholder={t('ContactUs.fields.nameField.placeholder')} />
        <Input ref={emailInputRef} required id="email-input" name="email-input" type="email" label={t('ContactUs.fields.emailField.label')} placeholder={t('ContactUs.fields.emailField.placeholder')} />
        <div className="flex flex-col md:flex-row gap-2">
          <Input ref={phoneInputRef} required id="phone-input" className="grow shrink min-w-0" name="phone-input" type="tel" label={t('ContactUs.fields.phoneWhatsappField.label')} onChange={handlePhoneChange} />
          <Select ref={serviceSelectRef} required name="service-input" className="grow shrink min-w-0" id="service-input" label={t('ContactUs.fields.serviceField.label')} emptyOptionLabel={t('ContactUs.fields.serviceField.placeholder')} options={SelectOptions} />
        </div>
        <Textarea ref={descriptionTextareaRef} required name="project-description-input" label={t('ContactUs.fields.projectDescriptionField.label')} placeholder={t('ContactUs.fields.projectDescriptionField.placeholder')} rows={4} />
        <div className="flex justify-end">
          <PrimaryButton loading={loading}>{t('Hero.CTAButtonLabel')}</PrimaryButton>
        </div>
      </form>
    </section>
  </section>
}
