import { AsYouType, CountryCode, isPossiblePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
import { parsePhoneNumber } from "libphonenumber-js/min";

export function phoneMaskAsYouType(phone: string, region: CountryCode = 'BR') {
  const rawPhone = phone
                      .replace(/[^\d+]/g, '')
                      .split('')
                      .reduce((prev, curr) => {
                        if (prev !== '' && curr === '+') {
                          return prev;
                        }
                        return prev + curr;
                      }, '')
                      .slice(0, 17);

  let formattedPhone = new AsYouType(region).input(rawPhone);

  if (isValidPhoneNumber(formattedPhone, region)) {
    formattedPhone = parsePhoneNumber(formattedPhone, region).format('INTERNATIONAL');
  }

  return formattedPhone;
}

export function phoneUnmask(phone: string) {
  return parsePhoneNumber(phone).format('E.164')
}

export function isValidPhone(phone: string) {
  return isPossiblePhoneNumber(phone) && isValidPhoneNumber(phone);
}

export function detectRegion(locale: string): CountryCode {
  // Check if the user's locale is Brazilian Portuguese (pt-BR)
  if (locale === 'pt') {
    return 'BR';  // Set region to Brazil if the locale is pt-BR
  }
  
  // Check if the user's locale is Spanish (es-*)
  if (locale === 'es') {
    // Here you could refine further to check for specific Spanish-speaking countries
    return 'ES';  // Default to Spain for Spanish speakers; modify based on your needs
  }
  
  // Default region for other locales could be "US", or any other default you'd like
  return 'US';
}
