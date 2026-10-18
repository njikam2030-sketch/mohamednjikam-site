// Tous les pays du monde (codes ISO 3166-1), regroupés par région, avec leur nom en anglais et en français.
import type { Lang } from '../i18n/ui';

export const COUNTRY_REGIONS = {
  africa: ['DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CV', 'CM', 'CF', 'TD', 'KM', 'CG', 'CD', 'CI', 'DJ', 'EG', 'GQ', 'ER', 'SZ', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'MW', 'ML', 'MR', 'MU', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD', 'TZ', 'TG', 'TN', 'UG', 'ZM', 'ZW'],
  americas: ['AG', 'AR', 'BS', 'BB', 'BZ', 'BO', 'BR', 'CA', 'CL', 'CO', 'CR', 'CU', 'DM', 'DO', 'EC', 'SV', 'GD', 'GT', 'GY', 'HT', 'HN', 'JM', 'MX', 'NI', 'PA', 'PY', 'PE', 'KN', 'LC', 'VC', 'SR', 'TT', 'US', 'UY', 'VE'],
  europe: ['AL', 'AD', 'AT', 'BY', 'BE', 'BA', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'XK', 'LV', 'LI', 'LT', 'LU', 'MT', 'MD', 'MC', 'ME', 'NL', 'MK', 'NO', 'PL', 'PT', 'RO', 'RU', 'SM', 'RS', 'SK', 'SI', 'ES', 'SE', 'CH', 'UA', 'GB', 'VA'],
  middleeast: ['BH', 'IR', 'IQ', 'IL', 'JO', 'KW', 'LB', 'OM', 'PS', 'QA', 'SA', 'SY', 'TR', 'AE', 'YE'],
  asiapacific: ['AF', 'AM', 'AU', 'AZ', 'BD', 'BT', 'BN', 'KH', 'CN', 'FJ', 'GE', 'IN', 'ID', 'JP', 'KZ', 'KI', 'KG', 'LA', 'MY', 'MV', 'MH', 'FM', 'MN', 'MM', 'NR', 'NP', 'NZ', 'KP', 'PK', 'PW', 'PG', 'PH', 'WS', 'SG', 'SB', 'KR', 'LK', 'TW', 'TJ', 'TH', 'TL', 'TO', 'TM', 'TV', 'UZ', 'VU', 'VN'],
} as const;

export type CountryRegion = keyof typeof COUNTRY_REGIONS;
export const COUNTRY_REGION_NAME: Record<CountryRegion, { en: string; fr: string }> = {
  africa: { en: 'Africa', fr: 'Afrique' },
  americas: { en: 'Americas', fr: 'Amériques' },
  europe: { en: 'Europe', fr: 'Europe' },
  middleeast: { en: 'Middle East', fr: 'Moyen-Orient' },
  asiapacific: { en: 'Asia & Pacific', fr: 'Asie et Pacifique' },
};

export const COUNTRIES: string[] = Object.values(COUNTRY_REGIONS).flat();

// Noms plus courants que ceux donnés par défaut
const OVERRIDES: Record<string, { en: string; fr: string }> = {
  CD: { en: 'DR Congo', fr: 'RD Congo' },
  CG: { en: 'Republic of the Congo', fr: 'République du Congo' },
  PS: { en: 'Palestine', fr: 'Palestine' },
  MM: { en: 'Myanmar', fr: 'Myanmar' },
  KN: { en: 'Saint Kitts and Nevis', fr: 'Saint-Christophe-et-Niévès' },
  LC: { en: 'Saint Lucia', fr: 'Sainte-Lucie' },
  VC: { en: 'Saint Vincent and the Grenadines', fr: 'Saint-Vincent-et-les-Grenadines' },
  BA: { en: 'Bosnia and Herzegovina', fr: 'Bosnie-Herzégovine' },
  AG: { en: 'Antigua and Barbuda', fr: 'Antigua-et-Barbuda' },
  TT: { en: 'Trinidad and Tobago', fr: 'Trinité-et-Tobago' },
  ST: { en: 'São Tomé and Príncipe', fr: 'Sao Tomé-et-Principe' },
  VA: { en: 'Vatican City', fr: 'Vatican' },
  FM: { en: 'Micronesia', fr: 'Micronésie' },
};

const names = { en: new Intl.DisplayNames(['en'], { type: 'region' }), fr: new Intl.DisplayNames(['fr'], { type: 'region' }) };

export function countryName(code: string, lang: Lang) {
  const c = code.toUpperCase();
  return OVERRIDES[c]?.[lang] ?? names[lang].of(c) ?? c;
}

export function regionOf(code: string): CountryRegion | undefined {
  const c = code.toUpperCase();
  return (Object.keys(COUNTRY_REGIONS) as CountryRegion[]).find((r) => (COUNTRY_REGIONS[r] as readonly string[]).includes(c));
}

// Pays d'une région, triés par nom dans la langue demandée
export function countriesIn(region: CountryRegion, lang: Lang) {
  return [...COUNTRY_REGIONS[region]].sort((a, b) => countryName(a, lang).localeCompare(countryName(b, lang), lang));
}
