import { AsYouType } from "libphonenumber-js";
import { detectRegion, isValidPhone, phoneMaskAsYouType, phoneUnmask } from "./phone";
import { parsePhoneNumber } from "libphonenumber-js/min";

describe('phoneMaskAsYouType', () => {
  it('should mask incomplete phones without any previous masking with default region passed', () => {
    // Incomplete phones for masking with default region (assume 'BR' default region)
    const incompletePhones = [
      '119',                // São Paulo DDD, incomplete local number
      '1191',               // São Paulo DDD, start of mobile
      '11912',              // São Paulo DDD, incomplete mobile
      '119123',             // São Paulo DDD, incomplete mobile
      '1191234',            // São Paulo DDD, incomplete mobile
      '11912345',           // São Paulo DDD, incomplete mobile
      '119123456',          // São Paulo DDD, incomplete mobile
      '+5511',              // country code + DDD only
      '+551191',            // country code + DDD + start of number
      '+5511912',           // country code + DDD + part of number
      '+55119123',          // country code + DDD + more digits
      '+551191234',         // country code + DDD + partial number
      '+5511912345',        // country code + DDD + almost complete mobile
    ];
    expect.assertions(incompletePhones.length * 2)
    for (const phone of incompletePhones) {
      const maskedResult = phoneMaskAsYouType(phone);
      expect(typeof maskedResult).toBe('string');
      expect(maskedResult).toStrictEqual(new AsYouType('BR').input(phone))
    }
  })

  it('should mask incomplete phones with previous masking with default region passed', () => {
    const previouslyMaskedPhones = [
      '(11) 9123',           // part-masked DDD + start mobile
      '+55 11 9123',         // semi-masked with + and DDD
      '+55 11 91234',        // semi-masked almost mobile
      '(11) 91234-5',        // masked, partial number
      '+55 (11) 9123-45',    // mixed mask with +55, DDD, part mobile
      '(11) 91234-56',       // masked, incomplete last two digits
      '+55 (11) 91234-56',   // mixed mask, incomplete last two digits
      '+55 11 91234-56',     // mixed mask, incomplete last two digit
      '(11) 9',              // just DDD and start of mobile
      '+55 (11) 9',          // country and just start
      '(11) 912',            // DDD + partial mobile
    ];
    expect.assertions(previouslyMaskedPhones.length * 2)
    for (const phone of previouslyMaskedPhones) {
      const maskedResult = phoneMaskAsYouType(phone);
      expect(typeof maskedResult).toBe('string');
      expect(maskedResult).toStrictEqual(new AsYouType('BR').input(phone))
    }
  })

  it('should mask complete phones without any previous masking with default region passed', () => {
    const completePhones = [
      // Brazil
      '+5511912345678',
      '+5521998765432',
      '+5531991234567',
      '+5548997654321',

      // US
      '+12025550198',
      '+14155552671',
      '+13105552368',
      '+16175552819',

      // Spain
      '+34612345678',
      '+34678901234',
      '+34911223344',

      // UK
      '+447911123456',
      '+447700900123',

      // Germany
      '+4915123456789',
      '+49891234567',

      // France
      '+33612345678',
      '+33123456789',

      // Russia
      '+79261234567',

      // China
      '+8613800138000',

      // India
      '+919876543210'
    ];

    expect.assertions(completePhones.length * 2);
    for (const phone of completePhones) {
      const maskedResult = phoneMaskAsYouType(phone);
      expect(typeof maskedResult).toBe('string');
      expect(maskedResult).toStrictEqual(parsePhoneNumber(new AsYouType('BR').input(phone)).format('INTERNATIONAL'))
    }
  })

  it('should mask complete phones with previous masking with default region passed', () => {
    const completeMaskedPhones = [
      // Brazil
      '+55 11 91234-5678',        // international with country code and mask
      '+55 (11) 91234-5678',      // international with mask and parentheses
      '+55 21 99876-5432',        // Rio de Janeiro masked
      '+55 (31) 99123-4567',      // Belo Horizonte masked
      '+55 48 99765-4321',        // Florianópolis masked
      '+55 (85) 98888-1234',      // Fortaleza masked

      // US
      '+1 (202) 555-0198',        // US international masked
      '+1 202-555-0198',          // international masked
      '+1 (415) 555-2671',        // San Francisco masked
      '+1 310-555-2368',          // Los Angeles masked
      '+1 (617) 555-2819',        // Boston masked

      // Spain
      '+34 612 34 56 78',         // international masked
      '+34 679 80 24 22',         // mobile masked
      '+34 911 22 33 44',         // Madrid masked
      '+34 934 12 34 56',         // Barcelona masked

      // UK
      '+44 7911 123456',          // international masked UK mobile
      '+44 7700 900123',          // another UK mobile
      '+44 20 7123 4567',         // London area masked
      '+44 161 123 4567',         // Manchester masked

      // Germany
      '+49 1512 3456789',         // German international, masked
      '+49 89 1234567',           // Munich masked
      '+49 30 9876543',           // Berlin masked
      '+49 170 1234567',          // Mobile masked

      // France
      '+33 6 12 34 56 78',        // international masked France
      '+33 1 23 45 67 89',        // Paris masked
      '+33 7 89 01 23 45',        // mobile masked
      '+33 4 91 45 67 89',        // Marseille masked

      // Russia
      '+7 926 123-45-67',         // international masked Russia
      '+7 495 123-45-67',         // Moscow masked
      '+7 812 987-65-43',         // St. Petersburg masked
      '+7 903 999-88-77',         // Mobile masked

      // China
      '+86 138 0013 8000',        // international masked China
      '+86 139 1234 5678',        // mobile masked
      '+86 10 1234 5678',         // Beijing masked
      '+86 21 8765 4321',         // Shanghai masked

      // India
      '+91 98765 43210',          // international masked India
      '+91 91234 56789',          // Delhi masked
      '+91 98345 12345',          // Mumbai masked
      '+91 94444 55555',          // Chennai masked
    ];

    expect.assertions(completeMaskedPhones.length * 2);
    for (const maskedPhone of completeMaskedPhones) {
      const maskedResult = phoneMaskAsYouType(maskedPhone);
      expect(typeof maskedResult).toBe('string');
      // The expected output should be equal to the mask, re-normalized to international format
      expect(maskedResult).toStrictEqual(
        parsePhoneNumber(new AsYouType('BR').input(maskedPhone)).format('INTERNATIONAL')
      );
    }
  })

  it('should mask incomplete phones without any previous masking passing the specific region (US)', () => {
    // Incomplete US phone numbers (local/international, no previous mask)
    const incompleteUSPhones = [
      '202',              // area code only
      '2025',             // area code + part of number
      '20255',            // area code + more part
      '202555',           // area code + prefix
      '2025550',          // area code + prefix + digit
      '20255501',         // area code + prefix + 2 digits
      '202555019',        // almost full local number
      '+120',             // country code + area code part
      '+1202555',         // country code + area code + prefix
      '+120255501',       // country code + area code + prefix + 2 digits
      '+12025550198',     // complete international unmasked
    ];

    expect.assertions(incompleteUSPhones.length * 2);
    for (const phone of incompleteUSPhones) {
      const maskedResult = phoneMaskAsYouType(phone, 'US');
      expect(typeof maskedResult).toBe('string');
      expect(maskedResult).toStrictEqual(new AsYouType('US').input(phone));
    }
  })

  it('should mask incomplete phones with previous masking passing the specific region (US)', () => {
    const previouslyMaskedUSPhones = [
      '(202) 555',           // masked area code + prefix
      '(202) 555-0',         // masked, partial subscriber
      '(202) 555-01',        // masked, more digits
      '(202) 555-019',       // almost full
      '+1 (202) 555',        // country + masked area code/prefix
      '+1 202-555',          // country + more masked
      '+1 (202) 555-01',     // country + masked
      '+1 202-555-01',       // country + masked, hyphen
      '202-555',             // partial local (with hyphen)
      '202-555-0',           // local, hyphen, first digit of subscriber
      '+1 202',              // country code + area only
      '+1 (202)',            // country code + masked area only
    ];

    expect.assertions(previouslyMaskedUSPhones.length * 2);
    for (const phone of previouslyMaskedUSPhones) {
      const maskedResult = phoneMaskAsYouType(phone, 'US');
      expect(typeof maskedResult).toBe('string');
      expect(maskedResult).toStrictEqual(new AsYouType('US').input(phone));
    }
  })

  it('should mask complete phones without any previous masking passing the specific region (US)', () => {
    const completeUSPhones = [
      '2025550198',         // local, unmasked
      '12025550198',        // country code, no plus
      '+12025550198',       // E.164 format
      '1 2025550198',       // country code, spaced
      '1-202-555-0198',     // country code, hyphens
      '202-555-0198',       // local, hyphens
      '(202)5550198',       // local, masked area, no spaces
      '(202) 555-0198',     // local, masked area, typical formatting
      '+1 (202) 555-0198',  // international, masked
      '+1 202 555 0198',    // international, spaces
      '202 555 0198',       // local, spaced
      '1 (202) 5550198',    // country code, masked area, no hyphens
      '(202) 5550198',      // local, masked area only
    ];

    expect.assertions(completeUSPhones.length * 2);
    for (const phone of completeUSPhones) {
      const maskedResult = phoneMaskAsYouType(phone, 'US');
      expect(typeof maskedResult).toBe('string');
      expect(maskedResult).toStrictEqual(parsePhoneNumber(new AsYouType('US').input(phone), 'US').format('INTERNATIONAL'));
    }
  })

  it('should mask complete phones with previous masking passing the specific region (US)', () => {
    const previouslyMaskedCompleteUSPhones = [
      '(202) 555-0198',
      '+1 (202) 555-0198',
      '+1 202-555-0198',
      '202-555-0198',
      '(202)555-0198',
      '1 (202) 555-0198',
      '+1 202 555 0198',
      '202 555 0198',
      '1-202-555-0198',
      // Add more if covering additional real-world formatting
    ];

    expect.assertions(previouslyMaskedCompleteUSPhones.length * 2);
    for (const phone of previouslyMaskedCompleteUSPhones) {
      const maskedResult = phoneMaskAsYouType(phone, 'US');
      expect(typeof maskedResult).toBe('string');
      expect(maskedResult).toStrictEqual(parsePhoneNumber(new AsYouType('US').input(phone), 'US').format('INTERNATIONAL'));
    }
  })

  it('should mask properly any other incomplete phones with country codes ignoring passed region', () => {
    const incompletePhonesWithCountryCodes = [
      '+1 202-555',        // US incomplete
      '+1 (202)',          // US, only area code
      '+55 11 9123',       // Brazil incomplete
      '+44 20 7946',       // UK, missing last block
      '+34612',            // Spain, incomplete
      '+49 1512',          // Germany, incomplete
      '+86 138',           // China, too short
      '+7 495 12',         // Russia, incomplete
    ];

    expect.assertions(incompletePhonesWithCountryCodes.length * 2);

    for (const phone of incompletePhonesWithCountryCodes) {
      // The passed region should be ignored because a country code is present.
      // The function is expected to mask/format as it can with the available digits
      const maskedResult = phoneMaskAsYouType(phone, 'US');
      expect(typeof maskedResult).toBe('string');

      // The expected: parse as-you-type with country, ignoring region
      expect(maskedResult).toStrictEqual(
        new AsYouType().input(phone)
      );
    }
  })

  it('should mask properly any other complete phones with country codes ignoring passed region', () => {
    const completePhonesWithCountryCodes = [
      '+12025550198',         // US E.164
      '+1 202-555-0198',      // US international masked
      '+5511912345678',       // Brazil E.164
      '+55 11 91234-5678',    // Brazil international masked
      '+34612345678',         // Spain E.164
      '+34 612 34 56 78',     // Spain international masked
      '+44 20 7946 0958',     // UK international masked
      '+4915123456789',       // Germany E.164
      '+7 495 123-45-67',     // Russia international masked
      '+8613800138000',       // China E.164
      // Add more real-world complete numbers as needed
    ];

    expect.assertions(completePhonesWithCountryCodes.length * 2);

    for (const phone of completePhonesWithCountryCodes) {
      // The passed region should be ignored because a country code is present.
      // The function is expected to mask/format as it can with the available digits
      const maskedResult = phoneMaskAsYouType(phone, 'US');
      expect(typeof maskedResult).toBe('string');

      // The expected: parse as-you-type with country, ignoring region
      expect(maskedResult).toStrictEqual(
        parsePhoneNumber(new AsYouType().input(phone)).format('INTERNATIONAL')
      );
    }
  })

  it('should ensure output can\'t have more than 18 characters considering the + sign at beggining', () => {
    const longPhones = [
      '+5511912345678900123456789', // Much longer than 18 digits, Brazil
      '55119123456789001234',       // 17 digits, without "+"
      '+123456789012345678901234',  // Way too long, arbitrary country
      '+441632960960123456',        // UK, overly long
      '+8612345678901234567',       // China, overly long
      '+12025550198123456789',      // US E.164, too long
    ];

    expect.assertions(longPhones.length);

    for (const phone of longPhones) {
      const result = phoneMaskAsYouType(phone, 'BR');
      // Should not exceed 18 chars total (including the +). Output can be less, but not more.
      expect(result.length).toBeLessThanOrEqual(18);
    }
  })

  it('should not have invalid characters or + signs after beggining of phone number', () => {
    const invalidPhone = '+1+2025A50198'

    expect(phoneMaskAsYouType(invalidPhone)).toStrictEqual(phoneMaskAsYouType('+1202550198')) // same value, but without the invalid chars
  })
})

describe('phoneUnmask', () => {
  it('should unmask all the valid phone numbers', () => {
    const maskedPhones = [
      '+55 11 91234-5678',        // Brazil
      '+1 202-555-0198',          // US
      '+34 612 34 56 78',         // Spain
      '+44 20 7946 0958',         // UK
      '+49 1512 3456789',         // Germany
      '+7 495 123-45-67',         // Russia
      '+86 138 0013 8000',        // China
    ];

    const unmaskedPhones = [
      '+5511912345678',     // Brazil E.164
      '+12025550198',       // US E.164
      '+34612345678',       // Spain E.164
      '+442079460958',      // UK E.164
      '+4915123456789',     // Germany E.164
      '+74951234567',       // Russia E.164
      '+8613800138000',     // China E.164
    ];

    expect.assertions(maskedPhones.length)

    maskedPhones.forEach((phone, i) => {
      expect(phoneUnmask(phone)).toStrictEqual(unmaskedPhones[i])
    })
  })
})

describe('isValidPhone', () => {
  it('should pass to all those valid phones', () => {
    const validPhones = [
      // Brazil with country code
      '+5511912345678',       // international unmasked E.164
      '+55 11 91234-5678',    // international masked

      // US with country code
      '+12025550198',         // E.164
      '+1 202-555-0198',      // international masked

      // Spain with country code
      '+34612345678',         // E.164
      '+34 612 34 56 78',     // international masked

      // Other valid formats with country codes
      '+44 20 7946 0958',     // UK masked international
      '+4915123456789',       // Germany, E.164
      '+7 495 123-45-67',     // Russia international masked
      '+8613800138000',       // China, E.164
    ];

    expect.assertions(validPhones.length);
    for (const phone of validPhones) {
      expect(isValidPhone(phone)).toBe(true);
    }
  });

  it('should not pass to any invalid phones', () => {
    const invalidPhones = [
      '',                              // empty string
      'abcdefg',                       // non-numeric
      '+5511',                         // too short for Brazil
      '+123',                          // too short, ambiguous country
      '+55112345',                     // Brazil, invalid short length
      '5511912345678',                 // missing leading +
      '+55 11 91234 56',               // missing two digits, Brazil
      '2025550198',                    // US without country code, ambiguous
      '+34 612 34 56',                 // Spain too short
      '+3461234567890123',             // Spain too long
      '+44 20 7946 09',                // UK too short
      '+1 202-555-01989999',           // US too long
      '+8613',                         // China too short
      '+7 495 123',                    // Russia too short
      '+999999999999',                 // non-existent country code
      '+550000000000',                 // invalid Brazil phone number pattern
      '++55 11 91234-5678',            // double plus
      '+551191234abcd',                // letters included
      '++1234567890',                  // double plus, random
      '+',                             // plus only
      ' ',                             // space only
    ];

    expect.assertions(invalidPhones.length);
    for (const phone of invalidPhones) {
      expect(isValidPhone(phone)).toBe(false);
    }
  })
})

describe('detectRegion', () => {
  it('should return \'BR\' if locale is \'pt\'', () => {
    expect(detectRegion('pt')).toStrictEqual('BR')
  })

  it('should return \'ES\' if locale is \'es\'', () => {
    expect(detectRegion('es')).toStrictEqual('ES')
  })

  it('should return \'US\' if locale is any other', () => {
    expect(detectRegion('us')).toStrictEqual('US')
    expect(detectRegion('uk')).toStrictEqual('US')
    expect(detectRegion('fr')).toStrictEqual('US')
    expect(detectRegion('ru')).toStrictEqual('US')
  })
})