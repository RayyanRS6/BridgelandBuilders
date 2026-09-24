// Single source of truth for everything URL- and identity-related.
// When the domain changes, change SITE_URL here (or pass SITE_URL= to the build)
// and every canonical, Open Graph tag, sitemap entry and JSON-LD id follows.
export const SITE_URL = (
  typeof process !== 'undefined' && process.env && process.env.SITE_URL
) || 'https://bridgelandbuilders.com';

export const SITE_NAME = 'Bridgeland Builders';
export const SITE_PHONE = '431-866-5644';
export const SITE_PHONE_E164 = '+1-431-866-5644';
export const SITE_LOCALE = 'en_CA';

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
