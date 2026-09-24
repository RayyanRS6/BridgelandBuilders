// Country list and formatting for the phone field's country picker.
import { AsYouType, getCountries, getCountryCallingCode, parsePhoneNumberFromString } from 'libphonenumber-js';

// Pinned to the top of the picker: nearly every lead is one of these.
const PINNED = ['CA', 'US'];

/** Flag emoji built from the ISO code (desktop Windows shows the letters instead). */
export function flagEmoji(code) {
  return String.fromCodePoint(...[...code].map((letter) => 0x1f1e6 + letter.charCodeAt(0) - 65));
}

export function dialCode(code) {
  return `+${getCountryCallingCode(code)}`;
}

/**
 * Every country, pinned ones first, then A–Z by English name. Names come from
 * the browser's built-in Intl data, so no country-name table ships with the
 * page. Call it on the client only: server and browser Intl data can spell a
 * few names differently, which would upset hydration.
 */
export function countryOptions() {
  const names = typeof Intl.DisplayNames === 'function' ? new Intl.DisplayNames(['en'], { type: 'region' }) : null;
  const toOption = (code) => ({ code, name: names?.of(code) || code, dial: dialCode(code) });
  const rest = getCountries()
    .filter((code) => !PINNED.includes(code))
    .map(toOption)
    .sort((a, b) => a.name.localeCompare(b.name));
  return { pinned: PINNED.map(toOption), rest };
}

/** The country a "+…" number belongs to, once enough digits are typed. */
export function countryFromInternational(value) {
  if (!String(value).trim().startsWith('+')) return undefined;
  const typer = new AsYouType();
  typer.input(value);
  return typer.getCountry();
}

/**
 * Tidies a complete, valid number once the visitor leaves the field, e.g.
 * "204 555 0123" -> "(204) 555-0123". Anything that isn't a valid number yet
 * is left exactly as typed, so a half-finished entry is never mangled.
 */
export function formatForDisplay(value, country) {
  const trimmed = String(value ?? '').trim();
  const parsed = trimmed ? parsePhoneNumberFromString(trimmed, country) : undefined;
  if (!parsed || !parsed.isValid()) return trimmed;
  // Typed without "+" for the selected country: keep the familiar local form.
  return !trimmed.startsWith('+') && parsed.country === country ? parsed.formatNational() : parsed.formatInternational();
}
