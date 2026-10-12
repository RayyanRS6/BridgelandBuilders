import {
  BBB_PROFILE_URL,
  BUSINESS,
  GBP,
  SERVICE_AREAS,
  SERVICE_CATALOG,
  SITE_NAME,
  SITE_URL,
  SOCIAL_PROFILES,
} from './siteConfig.js';

export const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80';

/**
 * Date (YYYY-MM-DD) every route's `updated` was seeded with. Each entry below
 * carries its own `updated`: bump it only when that page's content really
 * changes. It feeds the sitemap lastmod and the WebPage dateModified.
 */
export const SEO_DEFAULT_UPDATED = '2026-10-13';

/**
 * Per-route title and meta description. Titles stay under ~60 characters and
 * descriptions under ~155 so they are not truncated in results. Every claim
 * here appears on the site itself — nothing is invented.
 */
export const PAGE_SEO = {
  '/': {
    title: 'Winnipeg Renovation & Construction Company | Bridgeland Builders',
    description:
      'Winnipeg renovation contractor for kitchens, bathrooms, basement development, home additions and commercial fit-ups. Written quotes and permits handled.',
    image: DEFAULT_IMAGE,
    updated: '2026-10-13',
  },
  '/services': {
    title: 'Renovation Services & Business Remodeling | Bridgeland Builders',
    description:
      'Expert renovation services and business remodeling in Winnipeg: whole-home, kitchen, bathroom, basement, commercial fit-outs, flooring, masonry, windows and more.',
    updated: '2026-10-13',
  },
  '/about-us': {
    title: 'About Bridgeland Builders | Winnipeg Renovation Team',
    description:
      'Meet Bridgeland Builders, a Winnipeg renovation and construction team working on residential and commercial projects in Winnipeg and nearby communities.',
    updated: '2026-10-13',
  },
  '/our-process': {
    title: 'Our Renovation Process | Bridgeland Builders Winnipeg',
    description:
      'How a Bridgeland Builders renovation runs, from the first walkthrough and written quote through permits, construction and the final inspection.',
    updated: '2026-10-13',
  },
  '/projects': {
    title: 'Renovation Projects & Ideas | Bridgeland Builders Winnipeg',
    description:
      'Design ideas for kitchen, bathroom, basement, whole-home and commercial renovations. Case studies of our Winnipeg projects are on the way.',
    updated: '2026-10-13',
  },
  '/faqs': {
    title: 'Renovation FAQs | Bridgeland Builders Winnipeg',
    description:
      'Answers to common Winnipeg renovation questions: written quotes, permits and inspections, living in your home during work, timelines and how to get started.',
    updated: '2026-10-13',
  },
  '/instant-quote': {
    title: 'Free Instant Renovation Quote | Bridgeland Builders Winnipeg',
    description:
      'Get a free instant renovation quote from Bridgeland Builders in Winnipeg. Choose your project, answer a few quick questions and see a starting price range.',
    updated: '2026-10-13',
  },
  '/book-online': {
    title: 'Book an Appointment Online | Bridgeland Builders Winnipeg',
    description:
      'Book a free on-site renovation consultation with Bridgeland Builders in Winnipeg. Pick a date and time in our calendar and get instant confirmation.',
    updated: '2026-10-13',
  },
  '/contact-us': {
    title: 'Contact Bridgeland Builders | Winnipeg Renovations',
    description:
      'Contact Bridgeland Builders about your Winnipeg renovation. Call 431-866-5644 or send your project details and we reply within one business day.',
    updated: '2026-10-13',
  },
  '/outside-winnipeg': {
    title: 'Service Areas Around Winnipeg | Bridgeland Builders',
    description:
      'Bridgeland Builders serves Winnipeg and nearby communities, including Headingley, East St. Paul, West St. Paul, Oak Bluff, Selkirk and Steinbach.',
    updated: '2026-10-13',
  },
  '/blog': {
    title: 'Renovation Blogs & Articles | Bridgeland Builders Winnipeg',
    description:
      'Renovation inspiration, expert tips and industry insights from Bridgeland Builders, covering residential and commercial renovation ideas for Winnipeg properties.',
    updated: '2026-10-13',
  },
  // Second contact page, holding the GoHighLevel form with the SMS consent
  // checkbox that the Privacy Policy and Terms of Service point to (A2P). Kept
  // out of search so /contact-us stays the one canonical contact page; still
  // prerendered and linked from the legal pages.
  '/contact': {
    title: 'Get in Touch | Bridgeland Builders Winnipeg',
    description:
      'Send Bridgeland Builders a message about your renovation or project. Call 431-866-5644, email info@bridgelandbuilders.com, or use our contact form.',
    robots: 'noindex, follow',
    updated: '2026-10-13',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | Bridgeland Builders',
    description:
      'How Bridgeland Builders collects, uses and protects personal information from our website, forms, booking calendar, price guide, live chat and text messages.',
    updated: '2026-10-13',
  },
  '/terms-of-service': {
    title: 'Terms of Service | Bridgeland Builders',
    description:
      'The terms for using the Bridgeland Builders website and services, including our text messaging terms, message frequency, and how to opt out.',
    updated: '2026-10-13',
  },
  // Paid-traffic landing page. Kept out of search (noindex) and out of the
  // sitemap so it never competes with the organic pages it overlaps, but still
  // prerendered so an ad click gets real HTML on first paint. Link previews in
  // Meta ads read the Open Graph tags, which noindex does not affect.
  '/free-quote': {
    title: 'Free Renovation Quote in Winnipeg | Bridgeland Builders',
    description:
      'Get a free, no-obligation renovation quote in Winnipeg. Kitchens, bathrooms and basements with clear written pricing and a reply within one business day.',
    image: DEFAULT_IMAGE,
    robots: 'noindex, follow',
    updated: '2026-10-13',
  },
};

/** Service pages get their own titles, descriptions and Service schema. */
export const SERVICE_SEO = {
  '/services/whole-home-renovations': {
    title: 'Whole Home Renovations Winnipeg | Bridgeland Builders',
    description:
      'Whole home renovations in Winnipeg under one plan — layout, kitchen, baths, flooring and paint coordinated to a single finish date. Free walkthrough.',
    serviceType: 'Whole home renovation',
    updated: '2026-10-13',
  },
  '/services/kitchen-renovations': {
    title: 'Kitchen Renovations Winnipeg | Bridgeland Builders',
    description:
      'Kitchen renovations in Winnipeg: better layout, storage, lighting and durable finishes, installed to a clear written scope. Book a free walkthrough.',
    serviceType: 'Kitchen renovation',
    updated: '2026-10-13',
  },
  '/services/bathroom-renovations': {
    title: 'Bathroom Renovations Winnipeg | Bridgeland Builders',
    description:
      'Bathroom renovations in Winnipeg with reliable waterproofing, durable tile and practical storage. Clear written quotes and a free in-home walkthrough.',
    serviceType: 'Bathroom renovation',
    updated: '2026-10-13',
  },
  '/services/basement-renovations': {
    title: 'Basement Renovations Winnipeg | Bridgeland Builders',
    description:
      'Basement renovations in Winnipeg — turn an unfinished or dated basement into warm, dry, usable living space. Framing, insulation, egress and finishing handled.',
    serviceType: 'Basement renovation',
    updated: '2026-10-13',
  },
  '/services/home-extensions': {
    title: 'Home Extensions Winnipeg | Bridgeland Builders',
    description:
      'Home extensions and additions in Winnipeg designed to match the existing house, with permits, structure and finishing coordinated by one contractor.',
    serviceType: 'Home extension',
    updated: '2026-10-13',
  },
  '/services/commercial-renovations': {
    title: 'Commercial Renovation Contractors Winnipeg | Bridgeland Builders',
    description:
      'Commercial renovation contractors in Winnipeg for offices, retail stores, restaurants and hospitality spaces, and medical and dental clinics.',
    serviceType: 'Commercial renovation',
    // Service schema audience (plan §3.5). The page is written for business
    // owners and the people who run commercial property.
    audience: { '@type': 'BusinessAudience', audienceType: 'Businesses and commercial property owners' },
    updated: '2026-10-13',
  },
};

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;
const BLOG_ID = `${SITE_URL}/blog#blog`;

export const organizationRef = { '@id': ORG_ID };

/**
 * Reference that also carries the name. Kept for compatibility only: do not
 * use it for author/publisher — its '@type' would re-type the GeneralContractor
 * entity as a plain Organization. Use organizationRef instead.
 */
export const organizationNamed = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
};

/**
 * ISO 8601 date-time for a YYYY-MM-DD date, at midnight in Winnipeg with the
 * offset in force that day (-06:00 CST or -05:00 CDT). Values that already
 * carry a time are returned unchanged. If the runtime has no time-zone data
 * the bare date is returned rather than a guessed offset.
 */
export function isoWinnipeg(date) {
  if (!date) return undefined;
  const value = String(date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  // 06:00 UTC is midnight CST / 1 am CDT — always before the 2 am DST switch,
  // so this instant has the offset that applied at local midnight.
  const offset = winnipegOffset(new Date(`${value}T06:00:00Z`));
  return offset ? `${value}T00:00:00${offset}` : value;
}

function winnipegOffset(instant) {
  try {
    const part = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Winnipeg', timeZoneName: 'longOffset' })
      .formatToParts(instant)
      .find((item) => item.type === 'timeZoneName');
    if (part) {
      const match = /^GMT([+-]\d{2}:\d{2})$/.exec(part.value);
      if (match) return match[1];
      if (part.value === 'GMT') return '+00:00';
    }
  } catch {
    // older engines without 'longOffset': fall through to the manual method
  }
  try {
    const parts = {};
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Winnipeg',
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
      .formatToParts(instant)
      .forEach((item) => {
        parts[item.type] = item.value;
      });
    const wall = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute);
    const minutes = Math.round((wall - instant.getTime()) / 60000);
    if (!Number.isFinite(minutes)) return undefined;
    const sign = minutes < 0 ? '-' : '+';
    const abs = Math.abs(minutes);
    return `${sign}${String(Math.floor(abs / 60)).padStart(2, '0')}:${String(abs % 60).padStart(2, '0')}`;
  } catch {
    return undefined;
  }
}

/** Confirmed service areas as schema.org places, each tied to its Wikipedia article. */
export function areaServedNodes() {
  return SERVICE_AREAS.filter((area) => area.confirmed).map((area) => ({
    '@type': area.type,
    name: area.name,
    sameAs: area.wikipedia,
  }));
}

/** The business's own profiles: social accounts, BBB and Google Maps. */
function sameAsLinks() {
  return [...Object.values(SOCIAL_PROFILES), BBB_PROFILE_URL, GBP.mapsUrl].filter(Boolean);
}

/**
 * The sitewide entity: who this business is, where it works, what it does.
 * Locality-only address (service-area business). Never add aggregateRating or
 * review here — self-serving review markup on our own entity is not allowed.
 */
export function buildOrganizationGraph() {
  return [
    {
      '@type': ['GeneralContractor', 'HomeAndConstructionBusiness', 'LocalBusiness'],
      '@id': ORG_ID,
      name: BUSINESS.name,
      // No legalName until the registered name is confirmed (plan §3.5, O-5).
      url: `${SITE_URL}/`,
      description: BUSINESS.description,
      disambiguatingDescription: BUSINESS.disambiguatingDescription,
      slogan: BUSINESS.slogan,
      telephone: BUSINESS.telephone,
      email: BUSINESS.email,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo-on-light.png`,
        width: 460,
        height: 426,
      },
      image: `${SITE_URL}/logo-on-light.png`,
      priceRange: '$$',
      currenciesAccepted: 'CAD',
      // Service-area business: the area served is the entity's location claim,
      // deliberately without a street address.
      address: {
        '@type': 'PostalAddress',
        addressLocality: BUSINESS.addressLocality,
        addressRegion: BUSINESS.addressRegion,
        addressCountry: BUSINESS.addressCountry,
      },
      areaServed: areaServedNodes(),
      hasMap: GBP.mapsUrl || undefined,
      sameAs: sameAsLinks(),
      knowsAbout: BUSINESS.knowsAbout,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: BUSINESS.telephone,
        email: BUSINESS.email,
        contactType: 'customer service',
        // No areaServed here: "CA" claimed all of Canada; the organisation's
        // areaServed above is the service area.
        availableLanguage: 'English',
      },
      // The service pages' own Service nodes (same @id, type and name as
      // buildService emits there), with no Offer wrapper and no prices.
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Renovation and construction services',
        itemListElement: SERVICE_CATALOG.map((service) => ({
          '@type': 'Service',
          '@id': `${SITE_URL}${service.path}#service`,
          name: (SERVICE_SEO[service.path] && SERVICE_SEO[service.path].serviceType) || service.name,
          url: `${SITE_URL}${service.path}`,
        })),
      },
    },
    {
      '@type': 'WebSite',
      '@id': SITE_ID,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      alternateName: ['Bridgeland Builders Winnipeg'],
      description: BUSINESS.description,
      publisher: organizationRef,
      inLanguage: 'en-CA',
    },
  ];
}

const breadcrumbId = (path) => `${SITE_URL}${path}#breadcrumb`;

/**
 * BreadcrumbList from a list of [name, path] pairs. Home is added for you.
 * Returns null for the home page (an empty trail): a one-item trail is noise.
 * `path` is the page the trail belongs to; it defaults to the trail's last item.
 */
export function buildBreadcrumbs(trail, path) {
  if (!trail || !trail.length) return null;
  const pagePath = path || trail[trail.length - 1][1];
  if (pagePath === '/') return null;
  const items = [['Home', '/'], ...trail];
  return {
    '@type': 'BreadcrumbList',
    '@id': breadcrumbId(pagePath),
    itemListElement: items.map(([name, itemPath], index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: `${SITE_URL}${itemPath === '/' ? '/' : itemPath}`,
    })),
  };
}

/**
 * WebPage node tying the page to the site and organisation.
 * - `breadcrumb`: omitted → a reference to `<page>#breadcrumb` on every page
 *   except home; `false` → no reference; an object → used as given.
 * - `dateModified`: defaults to the route's `updated` date (updatedFor).
 * - `about`: defaults to the organisation; `false` omits it.
 * - `mainEntity`: an `{ '@id' }` reference to the page's main node (Service,
 *   BlogPosting, Blog or FAQPage); omitted when the page has none.
 */
export function buildWebPage({
  path,
  title,
  description,
  type = 'WebPage',
  breadcrumb,
  dateModified,
  about = organizationRef,
  mainEntity,
}) {
  const crumb = breadcrumb === undefined ? (path !== '/' ? { '@id': breadcrumbId(path) } : undefined) : breadcrumb || undefined;
  return {
    '@type': type,
    '@id': `${SITE_URL}${path}#webpage`,
    url: `${SITE_URL}${path}`,
    name: title,
    description,
    isPartOf: { '@id': SITE_ID },
    about: about || undefined,
    mainEntity: mainEntity || undefined,
    breadcrumb: crumb,
    dateModified: dateModified || updatedFor(path),
    inLanguage: 'en-CA',
  };
}

/** Service schema for a single service page (audience from SERVICE_SEO). */
export function buildService({ path, serviceType, description }) {
  return {
    '@type': 'Service',
    '@id': `${SITE_URL}${path}#service`,
    serviceType,
    name: serviceType,
    description,
    provider: organizationRef,
    areaServed: areaServedNodes(),
    audience: (SERVICE_SEO[path] && SERVICE_SEO[path].audience) || undefined,
    url: `${SITE_URL}${path}`,
  };
}

/** FAQPage schema from [{ q, a }] items. */
export function buildFaqPage(path, faqs) {
  if (!faqs || !faqs.length) return null;
  return {
    '@type': 'FAQPage',
    '@id': `${SITE_URL}${path}#faq`,
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

/**
 * The Blog node for /blog, listing every published post. Shared by the
 * prerender (head.js) and the blog page so both emit identical JSON-LD.
 */
export function buildBlogNode({ posts, description }) {
  return {
    '@type': 'Blog',
    '@id': BLOG_ID,
    name: 'Bridgeland Builders Blog',
    url: `${SITE_URL}/blog`,
    description,
    publisher: organizationRef,
    inLanguage: 'en-CA',
    blogPost: (posts || []).map((post) => ({
      '@type': 'BlogPosting',
      '@id': `${SITE_URL}/blog/${post.slug}#article`,
      headline: post.title,
      description: post.metaDescription,
      datePublished: isoWinnipeg(post.date),
      image: post.ogImage || post.hero,
      author: organizationRef,
      url: `${SITE_URL}/blog/${post.slug}`,
    })),
  };
}

/** Wraps nodes in a single @graph document. */
export function graph(...nodes) {
  return { '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) };
}

/**
 * The page-level JSON-LD document for a standard route: WebPage (+ breadcrumb
 * reference), BreadcrumbList, optional Service and FAQPage, then any extra
 * nodes. The prerender (head.js) and the runtime hook (usePageSeo) both call
 * this, so the static HTML and the client render cannot drift.
 */
export function pageGraph({ path, title, description, type, trail, serviceType, faqs, nodes = [] }) {
  const crumbs = buildBreadcrumbs(trail || ROUTE_TRAILS[path] || [], path);
  const service = serviceType ? buildService({ path, serviceType, description }) : null;
  const faqPage = buildFaqPage(path, faqs);
  // The page's main node: its Service, else a Blog node passed in (/blog),
  // else the FAQ list on the FAQ page itself.
  const main =
    service ||
    nodes.find((node) => node && node['@type'] === 'Blog') ||
    (path === '/faqs' ? faqPage : null);
  return graph(
    buildWebPage({
      path,
      title,
      description,
      type: type || ROUTE_PAGE_TYPES[path],
      breadcrumb: crumbs ? { '@id': crumbs['@id'] } : false,
      mainEntity: main && main['@id'] ? { '@id': main['@id'] } : undefined,
    }),
    crumbs,
    service,
    faqPage,
    ...nodes
  );
}

/**
 * Breadcrumb trail per route, as [label, path] pairs (Home is implicit). The
 * labels match the visible breadcrumbs (service pages show project.breadcrumb
 * from projects.js, e.g. "Kitchen Renovation").
 */
export const ROUTE_TRAILS = {
  '/': [],
  '/services': [['Services', '/services']],
  '/about-us': [['About Us', '/about-us']],
  '/our-process': [['Our Process', '/our-process']],
  '/projects': [['Projects', '/projects']],
  '/faqs': [['FAQs', '/faqs']],
  '/contact-us': [['Contact Us', '/contact-us']],
  '/instant-quote': [['Instant Quote', '/instant-quote']],
  '/book-online': [['Book Online', '/book-online']],
  '/outside-winnipeg': [['Outside Winnipeg', '/outside-winnipeg']],
  '/blog': [['Blog', '/blog']],
  '/free-quote': [['Free Quote', '/free-quote']],
  '/contact': [['Get in Touch', '/contact']],
  '/privacy-policy': [['Privacy Policy', '/privacy-policy']],
  '/terms-of-service': [['Terms of Service', '/terms-of-service']],
  '/services/whole-home-renovations': [['Services', '/services'], ['Whole Home Renovation', '/services/whole-home-renovations']],
  '/services/bathroom-renovations': [['Services', '/services'], ['Bathroom Renovation', '/services/bathroom-renovations']],
  '/services/kitchen-renovations': [['Services', '/services'], ['Kitchen Renovation', '/services/kitchen-renovations']],
  '/services/basement-renovations': [['Services', '/services'], ['Basement Renovation', '/services/basement-renovations']],
  '/services/home-extensions': [['Services', '/services'], ['Home Extension', '/services/home-extensions']],
  '/services/commercial-renovations': [['Services', '/services'], ['Commercial Renovation', '/services/commercial-renovations']],
};

/** WebPage subtype per route. */
export const ROUTE_PAGE_TYPES = {
  '/services': 'CollectionPage',
  '/projects': 'CollectionPage',
  '/blog': 'CollectionPage',
  '/contact-us': 'ContactPage',
  '/contact': 'ContactPage',
};

export function seoFor(path) {
  return PAGE_SEO[path] || SERVICE_SEO[path] || {};
}

/**
 * The date (YYYY-MM-DD) a route's content last changed: its own `updated`,
 * else SEO_DEFAULT_UPDATED for any route with an SEO entry. Undefined for
 * paths with no entry (blog posts carry their own `updated`).
 */
export function updatedFor(path) {
  const entry = PAGE_SEO[path] || SERVICE_SEO[path];
  if (!entry) return undefined;
  return entry.updated || SEO_DEFAULT_UPDATED;
}

/** Routes that are rendered and served but kept out of search and the sitemap. */
export const NOINDEX_ROUTES = Object.keys(PAGE_SEO).filter((path) =>
  /noindex/.test(PAGE_SEO[path].robots || '')
);
