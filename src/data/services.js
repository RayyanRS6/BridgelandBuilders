/**
 * Service page registry (SEO plan D7, §5): one small, client-safe list of
 * every service page the site has or plans. The navbar, footer, /services
 * directory, router, breadcrumbs, sitemap and redirects all read it, so a page
 * appears everywhere at once when its status flips to 'live'.
 *
 * Keep this file tiny and free of imports: it ships to the browser and is
 * imported by siteConfig.js and seo.js (never the reverse). Page content lives
 * in src/data/services/<slug>.js (one module per page, loaded lazily by
 * src/pages/services/ServiceRoute.jsx; build tooling reads them through
 * src/data/projects.js).
 *
 * Fields:
 *   slug          URL slug and content module name (src/data/services/<slug>.js)
 *   path          the page URL
 *   label         page name on related-service cards and "See our …" links
 *   crumb         page name in breadcrumbs (visible trail = schema trail); the
 *                 singular form the first six pages always showed
 *   navLabel      name used in menus, the footer and the llms files
 *   summary       one-line description for directory / related-service cards
 *   category      'residential' | 'commercial' | 'additional'
 *   parent        path of the parent service page (nested breadcrumbs), or null
 *   status        'live'  = routed, prerendered, in the sitemap and linked
 *                 'draft' = not routed (404), not linked: menus show a plain label
 *   projectSlug   key into PROJECT_ESTIMATORS (estimators.js); the old project
 *                 slugs of the first six pages are kept so estimator links stay
 *   estimatorKey  ESTIMATOR_URLS key used when PROJECT_ESTIMATORS has no entry
 *   formType      "Type of renovation" option the page's booking form pre-ticks
 *                 (an option from QUOTE_QUESTIONS in quoteForm.js), or null
 *   order         sort order inside its category (menus, footer)
 *
 * To launch a page: fill its content module (seo, copy, owner sign-off), set
 * status: 'live' here, then run `npm run seo` (sitemap + llms files, and
 * vercel.json via sync-redirects: planned redirects in src/data/redirects.js
 * that point at the page become permanent) and commit vercel.json with it.
 * Vercel reads vercel.json before the build runs, so the build only checks it
 * (sync-redirects --check) and fails until the regenerated file is committed.
 */
export const SERVICES = [
  /* ---------------------------------------------------------- residential */
  {
    slug: 'basement-renovations',
    path: '/services/basement-renovations',
    label: 'Basement Renovations',
    crumb: 'Basement Renovation',
    navLabel: 'Basement renovations',
    summary: 'Turn an unfinished or outdated basement into warm, dry, useful living space.',
    category: 'residential',
    parent: null,
    status: 'live',
    projectSlug: 'basement-renovation',
    estimatorKey: 'basement',
    formType: 'Basement',
    order: 10,
  },
  {
    slug: 'basement-suites',
    path: '/services/basement-suites',
    label: 'Basement Suites',
    crumb: 'Basement Suite',
    navLabel: 'Basement suites',
    summary: 'Self-contained basement suites, with permits, egress windows and the layout planned before framing starts.',
    category: 'residential',
    parent: '/services/basement-renovations',
    status: 'draft',
    projectSlug: 'basement-suites',
    estimatorKey: 'basement',
    formType: 'Basement',
    order: 15,
  },
  {
    slug: 'bathroom-renovations',
    path: '/services/bathroom-renovations',
    label: 'Bathroom Renovations',
    crumb: 'Bathroom Renovation',
    navLabel: 'Bathroom renovations',
    summary: 'Well-planned bathrooms with reliable waterproofing, durable finishes, and practical storage.',
    category: 'residential',
    parent: null,
    status: 'live',
    projectSlug: 'bathroom-renovation',
    estimatorKey: 'bathroom',
    formType: 'Bathroom',
    order: 20,
  },
  {
    slug: 'home-additions',
    path: '/services/home-additions',
    label: 'Home Additions',
    crumb: 'Home Addition',
    navLabel: 'Home additions',
    summary: 'Add the room your home is missing with an addition designed to feel like it has always belonged.',
    category: 'residential',
    parent: null,
    status: 'live',
    // Renamed from /services/home-extensions (plan D6). The project slug and
    // the estimator's service parameter stay 'home-extension'.
    projectSlug: 'home-extension',
    estimatorKey: 'homeExtension',
    // No matching "Type of renovation" option: the form leaves it open.
    formType: null,
    order: 30,
  },
  {
    slug: 'kitchen-renovations',
    path: '/services/kitchen-renovations',
    label: 'Kitchen Renovations',
    crumb: 'Kitchen Renovation',
    navLabel: 'Kitchen renovations',
    summary: 'Improve the layout, storage, lighting, and finishes in the hardest-working room in your home.',
    category: 'residential',
    parent: null,
    status: 'live',
    projectSlug: 'kitchen-renovation',
    estimatorKey: 'kitchen',
    formType: 'Kitchen',
    order: 40,
  },
  {
    slug: 'whole-home-renovations',
    path: '/services/whole-home-renovations',
    label: 'Whole Home Renovations',
    crumb: 'Whole Home Renovation',
    navLabel: 'Whole home renovations',
    summary: 'Coordinate every room under one clear plan and one consistent finish.',
    category: 'residential',
    parent: null,
    status: 'live',
    projectSlug: 'whole-home-renovation',
    estimatorKey: 'wholeHome',
    formType: 'Whole Home Renovation',
    order: 50,
  },

  /* ----------------------------------------------------------- commercial */
  {
    slug: 'commercial-renovations',
    path: '/services/commercial-renovations',
    label: 'Commercial Renovations',
    crumb: 'Commercial Renovation',
    navLabel: 'Commercial renovations',
    summary: 'Commercial spaces planned around your opening date, operating hours, customers, and staff.',
    category: 'commercial',
    parent: null,
    status: 'live',
    projectSlug: 'commercial-renovation',
    estimatorKey: 'commercial',
    formType: 'Commercial',
    order: 100,
  },
  {
    slug: 'office-renovations',
    path: '/services/office-renovations',
    label: 'Office Renovations',
    crumb: 'Office Renovation',
    navLabel: 'Office renovations',
    summary: 'Workspaces, meeting rooms, lighting, and layouts built around your team.',
    category: 'commercial',
    parent: '/services/commercial-renovations',
    status: 'draft',
    projectSlug: 'office-renovations',
    estimatorKey: 'commercial',
    formType: 'Commercial',
    order: 110,
  },
  {
    slug: 'retail-renovations',
    path: '/services/retail-renovations',
    label: 'Retail Renovations',
    crumb: 'Retail Renovation',
    navLabel: 'Retail renovations',
    summary: 'Customer-ready retail layouts, finishes, displays, and service areas.',
    category: 'commercial',
    parent: '/services/commercial-renovations',
    status: 'draft',
    projectSlug: 'retail-renovations',
    estimatorKey: 'commercial',
    formType: 'Commercial',
    order: 120,
  },
  {
    slug: 'restaurant-renovations',
    path: '/services/restaurant-renovations',
    label: 'Restaurant Renovations',
    crumb: 'Restaurant Renovation',
    navLabel: 'Restaurants & hospitality',
    summary: 'Guest-facing spaces and back-of-house areas delivered around your operating schedule.',
    category: 'commercial',
    parent: '/services/commercial-renovations',
    status: 'draft',
    projectSlug: 'restaurant-renovations',
    estimatorKey: 'commercial',
    formType: 'Commercial',
    order: 130,
  },
  {
    slug: 'medical-dental-office-renovations',
    path: '/services/medical-dental-office-renovations',
    label: 'Medical & Dental Office Renovations',
    crumb: 'Medical & Dental Office Renovation',
    navLabel: 'Medical & dental offices',
    summary: 'Professional clinical environments planned for workflow, privacy, and accessibility.',
    category: 'commercial',
    parent: '/services/commercial-renovations',
    status: 'draft',
    projectSlug: 'medical-dental-office-renovations',
    estimatorKey: 'commercial',
    formType: 'Commercial',
    order: 140,
  },
  {
    slug: 'general-contracting',
    path: '/services/general-contracting',
    label: 'General Contracting',
    crumb: 'General Contracting',
    navLabel: 'General contracting',
    summary: 'One contractor to run the work from drawings to handover: trades, schedule, permits and inspections.',
    category: 'commercial',
    parent: null,
    status: 'draft',
    projectSlug: 'general-contracting',
    estimatorKey: 'overall',
    // Residential or commercial: the form leaves the type open.
    formType: null,
    order: 150,
  },

  /* ---------------------------------------------------------- additional */
  {
    slug: 'windows-and-doors',
    path: '/services/windows-and-doors',
    label: 'Windows & Doors',
    crumb: 'Windows & Doors',
    navLabel: 'Windows and doors installation',
    summary: 'Secure, weather-tight installations with clean interior and exterior finishing.',
    category: 'additional',
    parent: null,
    status: 'draft',
    projectSlug: 'windows-and-doors',
    estimatorKey: 'overall',
    formType: 'Other',
    order: 200,
  },
  {
    slug: 'exterior-painting',
    path: '/services/exterior-painting',
    label: 'Exterior Painting',
    crumb: 'Exterior Painting',
    navLabel: 'Exterior painting',
    summary: 'Careful preparation and durable exterior coatings suited to Winnipeg conditions.',
    category: 'additional',
    parent: null,
    status: 'draft',
    projectSlug: 'exterior-painting',
    estimatorKey: 'overall',
    formType: 'Other',
    order: 210,
  },
  {
    slug: 'masonry-stucco',
    path: '/services/masonry-stucco',
    label: 'Masonry & Stucco',
    crumb: 'Masonry & Stucco',
    navLabel: 'Masonry & stucco',
    summary: 'Repairs, upgrades, and new masonry finishes for homes and commercial properties.',
    category: 'additional',
    parent: null,
    status: 'draft',
    projectSlug: 'masonry-stucco',
    estimatorKey: 'overall',
    formType: 'Other',
    order: 220,
  },
  {
    slug: 'flooring',
    path: '/services/flooring',
    label: 'Flooring',
    crumb: 'Flooring',
    navLabel: 'Flooring',
    summary: 'Removal, preparation, and installation for durable, level, finished floors.',
    category: 'additional',
    parent: null,
    status: 'draft',
    projectSlug: 'flooring',
    estimatorKey: 'overall',
    formType: 'Other',
    order: 230,
  },
  {
    slug: 'demolition',
    path: '/services/demolition',
    label: 'Demolition',
    crumb: 'Demolition',
    navLabel: 'Demolition',
    summary: 'Controlled demolition, removal, and cleanup that leaves the space ready for its next stage.',
    category: 'additional',
    parent: null,
    status: 'draft',
    projectSlug: 'demolition',
    estimatorKey: 'overall',
    formType: 'Other',
    order: 240,
  },
];

const byOrder = (a, b) => a.order - b.order;

/** Live service pages in display order (category, then order). */
export function liveServices() {
  return SERVICES.filter((service) => service.status === 'live').sort(byOrder);
}

export const serviceByPath = (path) => SERVICES.find((service) => service.path === path);

export const serviceBySlug = (slug) => SERVICES.find((service) => service.slug === slug);

/** Live services of one category, in display order. */
export const liveServicesIn = (category) => liveServices().filter((service) => service.category === category);
