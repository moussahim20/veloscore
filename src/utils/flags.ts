/**
 * Country Flag Utility
 * Returns reliable, high-resolution flag image URLs (FlagCDN & API-Sports)
 * Works across all operating systems and browsers (including Windows where emoji flags are unsupported).
 */

const COUNTRY_CODE_MAP: Record<string, string> = {
  // Arab & North Africa
  morocco: 'ma',
  mar: 'ma',
  ma: 'ma',
  saudi: 'sa',
  'saudi arabia': 'sa',
  ksa: 'sa',
  sa: 'sa',
  egypt: 'eg',
  egy: 'eg',
  eg: 'eg',
  algeria: 'dz',
  alg: 'dz',
  dza: 'dz',
  dz: 'dz',
  tunisia: 'tn',
  tun: 'tn',
  tn: 'tn',
  qatar: 'qa',
  qat: 'qa',
  qa: 'qa',
  uae: 'ae',
  are: 'ae',
  ae: 'ae',
  kuwait: 'kw',
  kwt: 'kw',
  kw: 'kw',
  iraq: 'iq',
  irq: 'iq',
  iq: 'iq',

  // Europe
  england: 'gb-eng',
  'gb-eng': 'gb-eng',
  eng: 'gb-eng',
  spain: 'es',
  esp: 'es',
  es: 'es',
  germany: 'de',
  deu: 'de',
  ger: 'de',
  de: 'de',
  italy: 'it',
  ita: 'it',
  it: 'it',
  france: 'fr',
  fra: 'fr',
  fr: 'fr',
  portugal: 'pt',
  por: 'pt',
  pt: 'pt',
  netherlands: 'nl',
  ned: 'nl',
  nl: 'nl',
  turkey: 'tr',
  tur: 'tr',
  tr: 'tr',
  belgium: 'be',
  bel: 'be',
  be: 'be',
  scotland: 'gb-sct',
  'gb-sct': 'gb-sct',
  sco: 'gb-sct',
  wales: 'gb-wls',
  'gb-wls': 'gb-wls',
  wal: 'gb-wls',
  greece: 'gr',
  grc: 'gr',
  gr: 'gr',
  switzerland: 'ch',
  che: 'ch',
  ch: 'ch',
  austria: 'at',
  aut: 'at',
  at: 'at',
  europe: 'eu',
  uefa: 'eu',
  eur: 'eu',
  eu: 'eu',

  // Americas
  brazil: 'br',
  bra: 'br',
  br: 'br',
  argentina: 'ar',
  arg: 'ar',
  ar: 'ar',
  usa: 'us',
  us: 'us',
  'united states': 'us',
  mexico: 'mx',
  mex: 'mx',
  mx: 'mx',
  colombia: 'co',
  col: 'co',
  co: 'co',

  // Global / International
  world: 'un',
  international: 'un',
  int: 'un',
  africa: 'un',
  caf: 'un',
};

/**
 * Resolves a flag image URL for a given country name, code, or existing flag string
 */
export function getCountryFlagUrl(
  countryName?: string,
  countryCode?: string,
  existingFlag?: string
): string {
  // If already an image URL (http/https/data)
  if (existingFlag && (existingFlag.startsWith('http://') || existingFlag.startsWith('https://') || existingFlag.startsWith('data:'))) {
    return existingFlag;
  }

  // Lookup by countryCode
  if (countryCode) {
    const cleanCode = countryCode.toLowerCase().trim();
    if (COUNTRY_CODE_MAP[cleanCode]) {
      return `https://flagcdn.com/w40/${COUNTRY_CODE_MAP[cleanCode]}.png`;
    }
    if (cleanCode.length === 2) {
      return `https://flagcdn.com/w40/${cleanCode}.png`;
    }
  }

  // Lookup by countryName
  if (countryName) {
    const cleanName = countryName.toLowerCase().trim();
    if (COUNTRY_CODE_MAP[cleanName]) {
      return `https://flagcdn.com/w40/${COUNTRY_CODE_MAP[cleanName]}.png`;
    }
  }

  // Fallback to UN / World flag
  return 'https://flagcdn.com/w40/un.png';
}
