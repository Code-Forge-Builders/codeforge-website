export interface IDD {
  root?: string | null;
  suffixes?: string[] | null;
}

export function getCountryPhoneCode(idd: IDD | undefined): string {
  if (!idd?.root) return '';

  const validSuffix =
    idd.suffixes && idd.suffixes.length === 1 && idd.suffixes[0].length === 1
      ? idd.suffixes[0]
      : '';

  return `${idd.root}${validSuffix}`;
}

export function maskGenericPhone(raw: string, prefix: string): string {
  if (!raw) return prefix || '';

  // Ensure prefix starts with "+"
  if (prefix && !prefix.startsWith('+')) prefix = `+${prefix}`;

  // Remove all non-digit characters
  let digits = raw.replace(/\D/g, '');

  // Ensure prefix is included
  if (prefix && !digits.startsWith(prefix.replace('+', ''))) {
    digits = prefix.replace('+', '') + digits;
  }

  // Limit to max 15 digits (E.164 standard)
  digits = digits.slice(0, 15);

  return '+' + digits;
}

