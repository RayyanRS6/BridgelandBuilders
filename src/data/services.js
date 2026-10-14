import { TIMELINES } from './timelines.js';

/**
 * Service page registry (SEO plan D7, §5): one small, client-safe list of
 * every service page the site has or plans. The navbar, footer, /services
 * directory, router, breadcrumbs, sitemap and redirects all read it, so a page
 * appears everywhere at once when its status flips to 'live'.
 *
 * Keep this file tiny and free of imports (timelines.js, itself import-free,
 * is the one exception): it ships to the browser and is imported by
 * siteConfig.js and seo.js (never the reverse). Page content lives
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
 *   summary       one-line description for related-service cards (and the
 *                 /services card when there is no cardDescription)
 *   cardDescription  25–40 words for the /services directory card, written
 *                 from the page's own intro (owner-confirmed facts only)
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
    cardDescription:
      `Turn an unfinished or outdated basement into warm, dry living space. We check for moisture before framing, insulate the walls for Winnipeg winters and coordinate the permits. A typical basement takes ${TIMELINES.basement.words}.`,
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
    cardDescription:
      'A self-contained suite for a tenant or a family member. We confirm zoning and permits first, then plan the entrance, egress windows, kitchen, bathroom, fire protection and sound control before framing starts.',
    category: 'residential',
    parent: '/services/basement-renovations',
    status: 'live',
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
    cardDescription:
      `Bathrooms, ensuites and powder rooms rebuilt with backer board, a waterproofing membrane and a properly sloped shower base under the tile. Most bathrooms take ${TIMELINES.bathroom.words} from demolition to the final clean.`,
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
    cardDescription:
      'Add the room your home is missing, such as a family room, larger kitchen, main-floor bedroom or mudroom. Foundation, structure, roof, utilities and finishes are planned so it connects with the existing house.',
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
    cardDescription:
      `Layout, cabinets, countertops, backsplash, lighting and appliance fit, planned around how you cook before the finishes are chosen. Most full kitchens take ${TIMELINES.kitchen.words} once the cabinets arrive.`,
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
    cardDescription:
      `Layout, kitchen, bathrooms, flooring, paint, wiring and plumbing under one schedule and one written scope, so the finishes match from room to room. Most whole home renovations take ${TIMELINES.wholeHome.words}.`,
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
    cardDescription:
      'From a single meeting room to a full tenant fit-up, planned around your lease dates and your team’s working hours. Noisy work can be scheduled for evenings and weekends, so your team can keep working where possible.',
    category: 'commercial',
    parent: '/services/commercial-renovations',
    status: 'live',
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
    cardDescription:
      'Store layouts, storefronts, fitting rooms, cash areas and showrooms, planned around your opening date. Much of the work can happen after close and on weekends, and you get a progress update every week.',
    category: 'commercial',
    parent: '/services/commercial-renovations',
    status: 'live',
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
    cardDescription:
      'Dining rooms, bars, cafés and commercial kitchens, front of house and back, scheduled around your service hours and planned with the public health plan review in mind. Evening and weekend work is available.',
    category: 'commercial',
    parent: '/services/commercial-renovations',
    status: 'live',
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
    cardDescription:
      'Operatories, exam and treatment rooms, reception and sterilization areas for dental, medical and physio clinics, phased around patient hours and finished with surfaces that are easy to clean.',
    category: 'commercial',
    parent: '/services/commercial-renovations',
    status: 'live',
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
    cardDescription:
      'One contractor to run your project from start to handover: scheduling and supervising the trades, ordering materials, coordinating permits and inspections, and building to your architect’s or designer’s drawings, for homes and businesses.',
    category: 'commercial',
    parent: null,
    status: 'live',
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
    cardDescription:
      'Replacement windows, entry and patio doors, and new or larger openings with any permit arranged first. Each unit is set level, insulated and sealed against freeze and thaw, and the trim is finished inside and out.',
    category: 'additional',
    parent: null,
    status: 'live',
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
    cardDescription:
      'Siding, trim, stucco and doors repainted on homes and commercial buildings. Most of the work is preparation: washing, scraping, repairs and priming before the finish coats, booked for dry days in the warmer months.',
    category: 'additional',
    parent: null,
    status: 'live',
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
    cardDescription:
      'Cracked stucco, crumbling mortar joints and loose or damaged brick and stone repaired on homes and commercial buildings. We look for the cause of the damage first, then rebuild with compatible materials and blend the finish.',
    category: 'additional',
    parent: null,
    status: 'live',
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
    cardDescription:
      'Old flooring taken up, the subfloor checked for level, moisture and movement, then new floors laid over the right underlayment in homes, basements and commercial spaces, with trim and transitions fitted cleanly.',
    category: 'additional',
    parent: null,
    status: 'live',
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
    cardDescription:
      'Interior strip-outs of kitchens, bathrooms, basements and commercial spaces ahead of a renovation, with dust control, older materials checked before anything comes down, and debris hauled away so the space is ready for the next stage.',
    category: 'additional',
    parent: null,
    status: 'live',
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

/**
 * usePageSeo options for a service page (ServiceRoute.jsx). head.js passes the
 * same object to resolvePageSeo, so prerendered and client JSON-LD match. It
 * lives here (seo.js re-exports it) so service pages don't load seo.js on
 * their first visit.
 */
export function serviceSeo(content) {
  return {
    meta: content.seo,
    faqs: content.faqs,
    // No page image: the intro photos are stock (Unsplash) images, which must
    // not be shared as if they were Bridgeland's work (plan §11.2), and their
    // size is unknown. The branded 1200×630 default is used until a page has
    // a real project photo (content.seo.image / imageAlt).
  };
}
