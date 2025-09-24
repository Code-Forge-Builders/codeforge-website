import { allowedLocales } from './consts/locales.ts'
import { redirect } from "next/navigation";

export default function RootPage() {
  // Detect browser language
  let lang = "en"; // default
  if (typeof navigator !== "undefined") {
    const browserLang = navigator.language.slice(0, 2);
    if (allowedLocales.includes(browserLang)) {
      lang = browserLang;
    }
  }

  // Redirect to the corresponding locale path
  redirect(`/${lang}`);
}

