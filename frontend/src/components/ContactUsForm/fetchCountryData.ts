interface FetchedCountryData {
  name?: {
    common?: string
  },
  cca2?: string,
  idd?: {
    root?: string
  }
}

export interface CountryData {
  name: string
  phoneCode: string
  code: string
  flagUrl: string
}

export async function fetchCountryData(): Promise<CountryData[]> {
  const revalidatePeriod = 60 * 60 * 4; // revalidate every 4 hours

  const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd', {
    next: {
      revalidate: revalidatePeriod
    }
  });

  if (!response.ok) throw new Error('Failed to fetch country info');

  const data: FetchedCountryData[] = await response.json();

  return data.map(country => ({
    name: country.name?.common ?? '',
    phoneCode: country.idd?.root ?? '',
    code: country.cca2 ?? ''
  })).filter(country => country.name && country.phoneCode && country.code)
    .map(country => ({
      ...country,
      flagUrl: `https://flagcdn.com/w40/${country.code.toLocaleLowerCase()}.png`
    }))
    .sort((a, b) => {
      const nameCompare = a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });

      if (nameCompare === 0) {
        return a.code.localeCompare(b.code, 'en', { sensitivity: 'base' });
      }

      return nameCompare;
    });
}
