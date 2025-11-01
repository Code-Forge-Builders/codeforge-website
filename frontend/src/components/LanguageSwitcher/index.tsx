'use client';

import { usePathname, useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LanguageSwitcher({ languages }: { languages: string[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();

  const [hash, setHash] = useState('')

  const handleClick = (locale: string) => {
    // set cookie valid for 1 year
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
  };

  useEffect(() => {
    setHash(window.location.hash)
  }, [pathname, searchParams, params]);

  const currentLocale = params.locale as string | undefined;

  return (
    <div className='flex gap-2'>
      {languages.map((locale) => {
        const segments = pathname.split('/');

        // Replace or insert the locale at position 1
        if (currentLocale && segments[1] === currentLocale) {
          segments[1] = locale;
        } else {
          // Insert locale before other segments (so /about → /es/about)
          segments.splice(1, 0, locale);
        }

        // Join back into a URL
        const newPath = segments.join('/') || '/'

        const queryString = searchParams.toString();
        const search = queryString ? `?${queryString}` : '';

        const href =
          `${newPath}${search}${hash || ''}`

        return (
          <a className={`px-1 rounded ${locale === params.locale ? 'bg-background-light text-foreground-light' : ''}`} key={locale} href={href} onClick={() => handleClick(locale)}>
            {locale.toUpperCase()}
          </a>
        );
      })}
    </div>
  );
}

