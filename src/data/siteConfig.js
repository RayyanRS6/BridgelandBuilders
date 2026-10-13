// Single source of truth for everything URL- and identity-related.
// When the domain changes, change CANONICAL_SITE_URL here (or pass SITE_URL= to
// the build) and every canonical, Open Graph tag, sitemap entry and JSON-LD id
// follows. Redirects in vercel.json always use CANONICAL_SITE_URL, so a build
// environment that sets SITE_URL (e.g. a preview) can't make them look stale.
export const CANONICAL_SITE_URL = 'https://bridgelandbuilders.com';
export const SITE_URL = (
  typeof process !== 'undefined' && process.env && process.env.SITE_URL
) || CANONICAL_SITE_URL;

export const SITE_NAME = 'Bridgeland Builders';
// One phone number everywhere (HTML, schema, citations). Display, schema and
// link formats of the same number — never introduce a second number.
export const SITE_PHONE = '431-866-5644';
export const SITE_PHONE_E164 = '+1-431-866-5644';
export const SITE_PHONE_TEL = 'tel:+14318665644';
export const SITE_EMAIL = 'info@bridgelandbuilders.com';

// Service-area business (SAB) decision: the business is presented as serving
// Winnipeg and nearby communities with no public street address — not on the
// site, in schema, on Google Business Profile or in citations. The schema
// address is locality-only (Winnipeg, MB).
// 845 Dakota St is a mailing address only. It appears, labelled "Mailing
// address", on the legal pages (Privacy Policy, Terms of Service, and /contact
// only if A2P 10DLC registration requires it) because text-message (A2P) and
// CASL rules require a sender's mailing address. It must never appear in JSON-LD
// or be used as the business location. Unit/box number to be supplied by the owner.
export const MAILING_ADDRESS = {
  street: '845 Dakota St',
  city: 'Winnipeg',
  region: 'MB',
  postalCode: 'R2M 5M3',
  country: 'Canada',
};
export const MAILING_ADDRESS_LINE = `${MAILING_ADDRESS.street}, ${MAILING_ADDRESS.city}, ${MAILING_ADDRESS.region} ${MAILING_ADDRESS.postalCode}, ${MAILING_ADDRESS.country}`;
/** @deprecated Use MAILING_ADDRESS (kept so existing imports keep working). */
export const SITE_ADDRESS = MAILING_ADDRESS;
/** @deprecated Use MAILING_ADDRESS_LINE (kept so existing imports keep working). */
export const SITE_ADDRESS_LINE = MAILING_ADDRESS_LINE;
export const SITE_LOCALE = 'en_CA';

// Service area: Winnipeg plus nearby communities within about an hour. One
// list feeds schema areaServed, llms files, the service-area page and the quote
// form. `confirmed: true` = already claimed on the site; `confirmed: false` =
// candidate awaiting owner confirmation (never published until confirmed).
// `type` is the schema.org type (City covers cities and towns; Place = an
// unincorporated community inside a rural municipality). `wikipedia` URLs were
// checked against the Wikipedia API (canonical article titles) on 2026-10-13.
// `permitAuthority: 'verify'` = not yet confirmed; never publish it as-is.
export const SERVICE_AREAS = [
  {
    name: 'Winnipeg',
    slug: 'winnipeg',
    type: 'City',
    municipality: 'City of Winnipeg',
    wikipedia: 'https://en.wikipedia.org/wiki/Winnipeg',
    permitAuthority: 'City of Winnipeg',
    confirmed: true,
  },
  {
    name: 'Headingley',
    slug: 'headingley',
    type: 'AdministrativeArea',
    municipality: 'RM of Headingley',
    wikipedia: 'https://en.wikipedia.org/wiki/Rural_Municipality_of_Headingley',
    permitAuthority: 'RM of Headingley',
    confirmed: true,
  },
  {
    name: 'East St. Paul',
    slug: 'east-st-paul',
    type: 'AdministrativeArea',
    municipality: 'RM of East St. Paul',
    wikipedia: 'https://en.wikipedia.org/wiki/Rural_Municipality_of_East_St._Paul',
    permitAuthority: 'Red River Planning District',
    confirmed: true,
  },
  {
    name: 'West St. Paul',
    slug: 'west-st-paul',
    type: 'AdministrativeArea',
    municipality: 'RM of West St. Paul',
    wikipedia: 'https://en.wikipedia.org/wiki/Rural_Municipality_of_West_St._Paul',
    permitAuthority: 'Red River Planning District',
    confirmed: true,
  },
  {
    name: 'Oak Bluff',
    slug: 'oak-bluff',
    type: 'Place',
    municipality: 'RM of Macdonald',
    wikipedia: 'https://en.wikipedia.org/wiki/Oak_Bluff,_Manitoba',
    permitAuthority: 'verify',
    confirmed: true,
  },
  {
    name: 'Selkirk',
    slug: 'selkirk',
    type: 'City',
    municipality: 'City of Selkirk',
    wikipedia: 'https://en.wikipedia.org/wiki/Selkirk,_Manitoba',
    permitAuthority: 'verify',
    confirmed: true,
  },
  {
    name: 'Steinbach',
    slug: 'steinbach',
    type: 'City',
    municipality: 'City of Steinbach',
    wikipedia: 'https://en.wikipedia.org/wiki/Steinbach,_Manitoba',
    permitAuthority: 'verify',
    confirmed: true,
  },
  {
    name: 'Stonewall',
    slug: 'stonewall',
    type: 'City',
    municipality: 'Town of Stonewall',
    wikipedia: 'https://en.wikipedia.org/wiki/Stonewall,_Manitoba',
    permitAuthority: 'verify',
    confirmed: false,
  },
  {
    name: 'Niverville',
    slug: 'niverville',
    type: 'City',
    municipality: 'Town of Niverville',
    wikipedia: 'https://en.wikipedia.org/wiki/Niverville,_Manitoba',
    permitAuthority: 'verify',
    confirmed: false,
  },
  {
    name: 'La Salle',
    slug: 'la-salle',
    type: 'Place',
    municipality: 'RM of Macdonald',
    wikipedia: 'https://en.wikipedia.org/wiki/La_Salle,_Manitoba',
    permitAuthority: 'verify',
    confirmed: false,
  },
  {
    name: 'Lorette',
    slug: 'lorette',
    type: 'Place',
    municipality: 'RM of Taché',
    wikipedia: 'https://en.wikipedia.org/wiki/Lorette,_Manitoba',
    permitAuthority: 'verify',
    confirmed: false,
  },
  {
    name: 'Île-des-Chênes',
    slug: 'ile-des-chenes',
    type: 'Place',
    municipality: 'RM of Ritchot',
    wikipedia: 'https://en.wikipedia.org/wiki/%C3%8Ele-des-Ch%C3%AAnes',
    permitAuthority: 'verify',
    confirmed: false,
  },
  {
    name: 'Oakbank',
    slug: 'oakbank',
    type: 'Place',
    municipality: 'RM of Springfield',
    wikipedia: 'https://en.wikipedia.org/wiki/Oakbank,_Manitoba',
    permitAuthority: 'verify',
    confirmed: false,
  },
];

/** Confirmed service-area names, Winnipeg first. */
export const SERVICE_AREA_NAMES = SERVICE_AREAS.filter((area) => area.confirmed).map((area) => area.name);

const listJoin = (items) =>
  items.length > 1 ? `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}` : items.join('');

/** The one sentence used wherever the service area is described. */
export const SERVICE_AREA_STATEMENT = `${SITE_NAME} serves Winnipeg and nearby communities within about an hour of the city, including ${listJoin(
  SERVICE_AREA_NAMES.filter((name) => name !== 'Winnipeg')
)}.`;

// The business's own profiles (found in the SEO audit; each carries the same
// phone number and website). Used as Organization sameAs and for footer links.
export const SOCIAL_PROFILES = {
  facebook: 'https://www.facebook.com/profile.php?id=61567968356924',
  instagram: 'https://www.instagram.com/bridgelandbuilder/',
  linkedin: 'https://www.linkedin.com/company/bridgeland-builders/',
  youtube: 'https://www.youtube.com/channel/UCKN758eCYFdf-eH9_FFwjgw',
  tiktok: 'https://www.tiktok.com/@bridgeland.builder',
  // Listed on the Google Business Profile (auto-generated handle; rename it on X).
  x: 'https://x.com/bridgeland58384',
};

export const BBB_PROFILE_URL =
  'https://www.bbb.org/ca/mb/winnipeg/profile/commercial-renovation/bridgeland-builders-0057-1000008638';

// Google Business Profile, confirmed by the owner 2026-10-13 (same listing:
// ludocid 6390477049138999065). reviewUrl stays null until the owner supplies
// the "Ask for reviews" link from the profile.
export const GBP = {
  mapsUrl: 'https://maps.google.com/?cid=6390477049138999065',
  placeId: 'ChIJx06HPnAAgmoRGW83mwSJr1g',
  reviewUrl: null,
};

// Opening hours as published on the Google Business Profile (Mon–Fri
// 8:30 am–4:30 pm, closed weekends). Keep in step with the profile.
export const BUSINESS_HOURS = [
  { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:30', closes: '16:30' },
];

// Text messages: the page whose form carries the SMS consent checkbox, and the
// confirmation text sent after someone opts in. The Privacy Policy and Terms of
// Service quote both, and our SMS (A2P 10DLC) registration is checked against
// them, so the message sent from GoHighLevel must match this word for word.
export const SMS_OPT_IN_PATH = '/contact';
export const SMS_CONFIRMATION =
  'You are now subscribed to messages from Bridgeland Builders. Msg & data rates may apply. Reply STOP to unsubscribe, HELP for help.';

// The site's main call to action: the EstimatorX360 price estimator, embedded
// on our own page so visitors never leave the site. Rename the offer here and
// every button follows (the navbar keeps its own shorter label).
export const INSTANT_QUOTE_PATH = '/instant-quote';
export const INSTANT_QUOTE_LABEL = 'Get Free Instant Quote';

// The on-site visit booking form (details, then calendar). The Meta ads land
// here; the service pages and /book-online carry the same form.
export const CONSULTATION_PATH = '/free-quote';

// Verified facts only — taken from the live site. Nothing here is invented.
export const BUSINESS = {
  name: SITE_NAME,
  legalName: 'Bridgeland Builders',
  description:
    'Bridgeland Builders is a Winnipeg renovation and construction company handling whole-home, kitchen, bathroom, basement and commercial renovations, home extensions and general contracting across Winnipeg and nearby communities.',
  // The short (≤25-word) description reused across schema, llms files and
  // listings, so every source describes the business the same way.
  shortDescription:
    'Bridgeland Builders is a Winnipeg renovation contractor for kitchens, bathrooms, basements, whole-home renovations, home additions and commercial fit-ups in Winnipeg and nearby communities.',
  disambiguatingDescription:
    'Renovation and construction contractor based in Winnipeg, Manitoba, Canada. Not affiliated with Bridgeland, Texas or the Bridgeland neighbourhood of Calgary.',
  slogan: 'Bridging dreams into reality',
  telephone: SITE_PHONE_E164,
  email: SITE_EMAIL,
  addressLocality: 'Winnipeg',
  addressRegion: 'MB',
  addressCountry: 'CA',
  // Service-area business (see MAILING_ADDRESS above): the schema describes
  // the confirmed area served rather than a street address.
  areaServed: SERVICE_AREA_NAMES,
  knowsAbout: [
    'Whole home renovations',
    'Kitchen renovations',
    'Bathroom renovations',
    'Basement renovations',
    'Home extensions',
    'Commercial renovations',
    'General contracting',
    'Windows and doors installation',
    'Exterior painting',
    'Masonry and stucco',
    'Flooring installation',
    'Demolition',
  ],
};

export const SERVICE_CATALOG = [
  { name: 'Whole home renovations', path: '/services/whole-home-renovations' },
  { name: 'Kitchen renovations', path: '/services/kitchen-renovations' },
  { name: 'Bathroom renovations', path: '/services/bathroom-renovations' },
  { name: 'Basement renovations', path: '/services/basement-renovations' },
  { name: 'Home extensions', path: '/services/home-extensions' },
  { name: 'Commercial renovations', path: '/services/commercial-renovations' },
];
