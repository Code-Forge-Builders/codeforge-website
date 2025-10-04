'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';

export default function LanguageSwitcher({ languages }: { languages: string[] }) {
  const pathname = usePathname();
  const params = useParams();

  const handleClick = (locale: string) => {
    // set cookie valid for 1 year
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
  };

  return (
    <div className='flex gap-2'>
      {languages.map((locale) => {
        let href: string;

        if (pathname === '/' || pathname === '') {
          href = `/${locale}`;
        } else if (params.locale) {
          href = pathname.replace(`/${params.locale}`, `/${locale}`);
        } else {
          href = `/${locale}${pathname}`;
        }

        return (
          <Link className={`px-1 rounded ${locale === params.locale ? 'bg-background-light text-foreground-light' : ''}`} key={locale} href={href} onClick={() => handleClick(locale)}>
            {locale.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}

