import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { routing } from "@/i18n/routing";

const locales = routing.locales

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound()

  return {
    locale: locale || 'en',
    messages: (await import(`./translations/${locale}.json`)).default
  }
})

