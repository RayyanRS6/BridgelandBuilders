import { NEARBY_AREAS_TEXT, SERVICE_AREA_NAMES } from './areas.js';
import { liveServices } from './services.js';

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

// The booking form can't take photo uploads yet (what uploads would need: the
// "Photo uploads" note in src/data/quoteForm.js), so the booking aside and the
// form's confirmation invite photos and floor plans by email instead. The
// link carries a fixed subject only, never anything the visitor typed.
export const PHOTOS_EMAIL_SUBJECT = 'Photos for my renovation quote';
export const PHOTOS_MAILTO = `mailto:${SITE_EMAIL}?subject=${encodeURIComponent(PHOTOS_EMAIL_SUBJECT)}`;

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

// Service area: Winnipeg plus nearby communities within about an hour. The
// list and its helpers live in areas.js (import-free, so the service content
// modules can read it too); re-exported here under the existing names.
export {
  NEARBY_AREA_NAMES,
  NEARBY_AREAS_TEXT,
  NEARBY_AREAS_TEXT_OR,
  NEARBY_AREAS_TEXT_SHORT,
  SERVICE_AREAS,
  SERVICE_AREA_NAMES,
  listJoin,
} from './areas.js';

/** The one sentence used wherever the service area is described. */
export const SERVICE_AREA_STATEMENT = `${SITE_NAME} serves Winnipeg and nearby communities within about an hour of the city, including ${NEARBY_AREAS_TEXT}.`;

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
// ludocid 6390477049138999065). reviewUrl is Google's write-a-review form for
// placeId; the Place ID embeds that same CID (its last 8 bytes, little-endian,
// checked 2026-10-15). Not shown on the site: /review and /reviews redirect
// here (EXTERNAL_REDIRECTS in src/data/redirects.js) for QR codes, texts and
// email signatures. mapsUrl is linked directly from the Google rating badge
// (TrustStrip.jsx) and the "Read our reviews on Google" link (Testimonial.jsx).
// The listing's map embed lives in ContactPage.jsx (the only page that shows
// it), so its long URL stays out of every page's entry chunk.
export const GBP = {
  mapsUrl: 'https://maps.google.com/?cid=6390477049138999065',
  placeId: 'ChIJx06HPnAAgmoRGW83mwSJr1g',
  reviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJx06HPnAAgmoRGW83mwSJr1g',
};

// Google review summary, read from the live profile (update monthly, plan §20).
// Never output as aggregateRating/review schema: rating markup on our own
// business is not allowed (plan §3.5). Plan §19 held any visible display back
// until count >= 10; on 2026-10-22 the owner asked for it to be shown now
// (competitor review: "a live Google review count and star rating"), so the
// trust strip (src/components/TrustStrip.jsx) shows it as text with the count
// and a link to the profile. Re-read the profile before changing a number,
// and update asOf with it (last checked on Google Maps 2026-10-23).
export const REVIEW_STATS = {
  rating: 5.0,
  count: 4,
  asOf: '2026-10-23',
  source: 'Google',
  url: GBP.mapsUrl,
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

// The renovation cost hub (plan §8). Its page only renders once its guide is
// live. Defined here rather than in seo.js so the app shell can link to it
// without pulling the schema builders into the entry chunk; seo.js re-exports it.
export const COST_HUB_PATH = '/renovation-cost-winnipeg';

// The category line (plan §12): what the business is, in one phrase, the same
// on listings and social bios as in the schema disambiguation below.
export const CATEGORY_LINE = 'Renovation and construction contractor based in Winnipeg, Manitoba';

// Verified facts only — taken from the live site. Nothing here is invented.
export const BUSINESS = {
  name: SITE_NAME,
  legalName: 'Bridgeland Builders',
  // Long form, for a page that genuinely needs a full paragraph. Schema and
  // the llms files use shortDescription.
  description:
    'Bridgeland Builders is a Winnipeg renovation and construction company handling whole-home, kitchen, bathroom, basement and commercial renovations, home additions and general contracting across Winnipeg and nearby communities.',
  // The short (≤25-word) description reused across schema, llms files and
  // listings, so every source describes the business the same way.
  shortDescription:
    'Bridgeland Builders is a Winnipeg renovation contractor for kitchens, bathrooms, basements, whole-home renovations, home additions and commercial fit-ups in Winnipeg and nearby communities.',
  disambiguatingDescription: `${CATEGORY_LINE}, Canada. Not affiliated with Bridgeland, Texas or the Bridgeland neighbourhood of Calgary.`,
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
    'Home additions',
    'Commercial renovations',
    // Commercial verticals the owner confirmed on 2026-10-13 (hotels included).
    'Office renovations',
    'Retail renovations',
    'Restaurant and hospitality renovations',
    'Medical and dental office renovations',
    'General contracting',
    'Windows and doors installation',
    'Exterior painting',
    'Masonry and stucco',
    'Flooring installation',
    'Demolition',
  ],
};

// Every live service page, from the registry (src/data/services.js): the
// Organization's hasOfferCatalog and the llms files list exactly these.
export const SERVICE_CATALOG = liveServices().map((service) => ({
  name: service.navLabel,
  path: service.path,
  projectSlug: service.projectSlug,
}));
