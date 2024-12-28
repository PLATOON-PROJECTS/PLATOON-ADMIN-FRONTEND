// Define a type for the country codes
type CountryCode = keyof typeof countryCodeMap;

export const countryCodeMap = {
  "234": "NG", // Nigeria
  "1": "US",   // United States
  "44": "GB",  // United Kingdom
  "91": "IN",  // India
  "81": "JP",  // Japan
  "49": "DE",  // Germany
  "33": "FR",  // France
  "39": "IT",  // Italy
  "61": "AU",  // Australia
  "55": "BR",  // Brazil
  "27": "ZA",  // South Africa
};

// Specify the type for phoneCode
export function getCountryCode(phoneCode: string): string | null {
  return countryCodeMap[phoneCode as CountryCode] || null; 
}

  