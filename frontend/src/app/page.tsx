// app/page.tsx
import { redirect } from "next/navigation";

export default function RootPage() {
  // Detect browser language
  let lang = "en"; // default
  if (typeof navigator !== "undefined") {
    const browserLang = navigator.language.slice(0, 2);
    if (["en", "pt", "es"].includes(browserLang)) {
      lang = browserLang;
    }
  }

  // Redirect to the corresponding locale path
  redirect(`/${lang}`);
}

