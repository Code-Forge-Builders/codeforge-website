import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { readdirSync } from 'fs';
import { join } from 'path';

const localesPath = join(process.cwd(), 'translations')

const locales = readdirSync(localesPath)
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace(/\.json$/, ''))
  .sort();

const defaultLocaleIfFound = 'en'

export const routing = defineRouting({
  locales: locales, // Supported locales
  defaultLocale: locales.find(l => l === defaultLocaleIfFound) || locales[0],  // Fallback locale if none matches
});

// Provides wrappers for Next.js navigation APIs to handle locale routing
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);

