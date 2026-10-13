// Country list and formatting for the phone field's country picker.
//
// The picker itself needs no phone library: the calling codes below are a
// static copy of libphonenumber-js getCountries()/getCountryCallingCode()
// (v1.13.14, 245 regions), so the full country list works from the first tap.
// The library (~35 KB compressed with its metadata) is loaded lazily, on first
// focus or idle time (loadPhoneLib), and is only needed to detect the country
// of a "+…" number and to tidy a finished number. Until it has loaded, both of
// those simply leave the field as typed. Validation lives in
// src/data/leadValidation.js and is always run before a lead is saved.

// prettier-ignore
const CALLING_CODES = {
  AC:"247", AD:"376", AE:"971", AF:"93", AG:"1", AI:"1", AL:"355", AM:"374", AO:"244", AR:"54", AS:"1",
  AT:"43", AU:"61", AW:"297", AX:"358", AZ:"994", BA:"387", BB:"1", BD:"880", BE:"32", BF:"226", BG:"359",
  BH:"973", BI:"257", BJ:"229", BL:"590", BM:"1", BN:"673", BO:"591", BQ:"599", BR:"55", BS:"1", BT:"975",
  BW:"267", BY:"375", BZ:"501", CA:"1", CC:"61", CD:"243", CF:"236", CG:"242", CH:"41", CI:"225", CK:"682",
  CL:"56", CM:"237", CN:"86", CO:"57", CR:"506", CU:"53", CV:"238", CW:"599", CX:"61", CY:"357", CZ:"420",
  DE:"49", DJ:"253", DK:"45", DM:"1", DO:"1", DZ:"213", EC:"593", EE:"372", EG:"20", EH:"212", ER:"291",
  ES:"34", ET:"251", FI:"358", FJ:"679", FK:"500", FM:"691", FO:"298", FR:"33", GA:"241", GB:"44", GD:"1",
  GE:"995", GF:"594", GG:"44", GH:"233", GI:"350", GL:"299", GM:"220", GN:"224", GP:"590", GQ:"240", GR:"30",
  GT:"502", GU:"1", GW:"245", GY:"592", HK:"852", HN:"504", HR:"385", HT:"509", HU:"36", ID:"62", IE:"353",
  IL:"972", IM:"44", IN:"91", IO:"246", IQ:"964", IR:"98", IS:"354", IT:"39", JE:"44", JM:"1", JO:"962",
  JP:"81", KE:"254", KG:"996", KH:"855", KI:"686", KM:"269", KN:"1", KP:"850", KR:"82", KW:"965", KY:"1",
  KZ:"7", LA:"856", LB:"961", LC:"1", LI:"423", LK:"94", LR:"231", LS:"266", LT:"370", LU:"352", LV:"371",
  LY:"218", MA:"212", MC:"377", MD:"373", ME:"382", MF:"590", MG:"261", MH:"692", MK:"389", ML:"223", MM:"95",
  MN:"976", MO:"853", MP:"1", MQ:"596", MR:"222", MS:"1", MT:"356", MU:"230", MV:"960", MW:"265", MX:"52",
  MY:"60", MZ:"258", NA:"264", NC:"687", NE:"227", NF:"672", NG:"234", NI:"505", NL:"31", NO:"47", NP:"977",
  NR:"674", NU:"683", NZ:"64", OM:"968", PA:"507", PE:"51", PF:"689", PG:"675", PH:"63", PK:"92", PL:"48",
  PM:"508", PR:"1", PS:"970", PT:"351", PW:"680", PY:"595", QA:"974", RE:"262", RO:"40", RS:"381", RU:"7",
  RW:"250", SA:"966", SB:"677", SC:"248", SD:"249", SE:"46", SG:"65", SH:"290", SI:"386", SJ:"47", SK:"421",
  SL:"232", SM:"378", SN:"221", SO:"252", SR:"597", SS:"211", ST:"239", SV:"503", SX:"1", SY:"963", SZ:"268",
  TA:"290", TC:"1", TD:"235", TG:"228", TH:"66", TJ:"992", TK:"690", TL:"670", TM:"993", TN:"216", TO:"676",
  TR:"90", TT:"1", TV:"688", TW:"886", TZ:"255", UA:"380", UG:"256", US:"1", UY:"598", UZ:"998", VA:"39",
  VC:"1", VE:"58", VG:"1", VI:"1", VN:"84", VU:"678", WF:"681", WS:"685", XK:"383", YE:"967", YT:"262",
  ZA:"27", ZM:"260", ZW:"263",
};

// Pinned to the top of the picker: nearly every lead is one of these.
const PINNED = ['CA', 'US'];

/** Flag emoji built from the ISO code (desktop Windows shows the letters instead). */
export function flagEmoji(code) {
  return String.fromCodePoint(...[...code].map((letter) => 0x1f1e6 + letter.charCodeAt(0) - 65));
}

export function dialCode(code) {
  return CALLING_CODES[code] ? `+${CALLING_CODES[code]}` : '';
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
  const rest = Object.keys(CALLING_CODES)
    .filter((code) => !PINNED.includes(code))
    .map(toOption)
    .sort((a, b) => a.name.localeCompare(b.name));
  return { pinned: PINNED.map(toOption), rest };
}

/* ------------------------------------------------- lazy phone library */

let lib = null;
let loading = null;

/** Loads libphonenumber-js once. Resolves to the module; retries after a failure. */
export function loadPhoneLib() {
  if (lib) return Promise.resolve(lib);
  if (!loading) {
    loading = import('libphonenumber-js')
      .then((mod) => {
        lib = mod;
        return mod;
      })
      .catch((error) => {
        loading = null;
        throw error;
      });
  }
  return loading;
}

/** True once loadPhoneLib() has finished. */
export const phoneLibReady = () => Boolean(lib);

/** The country a "+…" number belongs to, once enough digits are typed (and the library is loaded). */
export function countryFromInternational(value) {
  if (!lib || !String(value).trim().startsWith('+')) return undefined;
  const typer = new lib.AsYouType();
  typer.input(value);
  return typer.getCountry();
}

/**
 * Tidies a complete, valid number once the visitor leaves the field, e.g.
 * "204 555 0123" -> "(204) 555-0123". Anything that isn't a valid number yet
 * (or anything at all before the library has loaded) is left exactly as
 * typed, so a half-finished entry is never mangled.
 */
export function formatForDisplay(value, country) {
  const trimmed = String(value ?? '').trim();
  if (!lib) return trimmed;
  const parsed = trimmed ? lib.parsePhoneNumberFromString(trimmed, country) : undefined;
  if (!parsed || !parsed.isValid()) return trimmed;
  // Typed without "+" for the selected country: keep the familiar local form.
  return !trimmed.startsWith('+') && parsed.country === country ? parsed.formatNational() : parsed.formatInternational();
}
