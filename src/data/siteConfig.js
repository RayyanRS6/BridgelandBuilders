// Single source of truth for everything URL- and identity-related.
// When the domain changes, change SITE_URL here (or pass SITE_URL= to the build)
// and every canonical, Open Graph tag, sitemap entry and JSON-LD id follows.
export const SITE_URL = (
  typeof process !== 'undefined' && process.env && process.env.SITE_URL
) || 'https://bridgelandbuilders.com';

export const SITE_NAME = 'Bridgeland Builders';
export const SITE_PHONE = '431-866-5644';
export const SITE_PHONE_E164 = '+1-431-866-5644';
export const SITE_EMAIL = 'info@bridgelandbuilders.com';
export const SITE_ADDRESS = {
  street: '845 Dakota St',
  city: 'Winnipeg',
  region: 'MB',
  postalCode: 'R2M 5M3',
  country: 'Canada',
};
export const SITE_ADDRESS_LINE = `${SITE_ADDRESS.street}, ${SITE_ADDRESS.city}, ${SITE_ADDRESS.region} ${SITE_ADDRESS.postalCode}, ${SITE_ADDRESS.country}`;
export const SITE_LOCALE = 'en_CA';

// Text messages: the page whose form carries the SMS consent checkbox, and the
// confirmation text sent after someone opts in. The Privacy Policy and Terms of
// Service quote both, and our SMS (A2P 10DLC) registration is checked against
// them, so the message sent from GoHighLevel must match this word for word.
export const SMS_OPT_IN_PATH = '/contact';
export const SMS_CONFIRMATION =
  'You are now subscribed to messages from Bridgeland Builders. Msg & data rates may apply. Reply STOP to unsubscribe, HELP for help.';

// Every "book a consultation" button on the site leads to the quote form page.
// Rename the offer here and every button follows.
export const CONSULTATION_PATH = '/free-quote';
export const CONSULTATION_LABEL = 'Free On-Site Consultation';

// Verified facts only — taken from the live site. Nothing here is invented.
export const BUSINESS = {
  name: SITE_NAME,
  legalName: 'Bridgeland Builders',
  description:
    'Bridgeland Builders is a Winnipeg renovation and construction company handling whole-home, kitchen, bathroom, basement and commercial renovations, home extensions and general contracting across Winnipeg and Manitoba.',
  slogan: 'Bridging dreams into reality',
  telephone: SITE_PHONE_E164,
  addressLocality: 'Winnipeg',
  addressRegion: 'MB',
  addressCountry: 'CA',
  // Service-area business: no storefront address is published, so the schema
  // describes the area served rather than a street address.
  areaServed: ['Winnipeg', 'Manitoba', 'Headingley', 'East St. Paul', 'West St. Paul', 'Oak Bluff', 'Steinbach', 'Selkirk'],
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
