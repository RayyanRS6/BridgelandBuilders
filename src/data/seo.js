import { SERVICES, serviceByPath, serviceBySlug } from './services.js';
import {
  BBB_PROFILE_URL,
  BUSINESS,
  BUSINESS_HOURS,
  COST_HUB_PATH,
  GBP,
  NEARBY_AREAS_TEXT_SHORT,
  SERVICE_AREAS,
  SERVICE_CATALOG,
  SITE_EMAIL,
  SITE_NAME,
  SITE_PHONE,
  SITE_URL,
  SOCIAL_PROFILES,
} from './siteConfig.js';
import { EXPERIENCE_YEARS, PROJECT_COUNT, REPLY_TIME } from './facts.js';
import { ROUTE_TRAILS, pageName, serviceTrail, trailFor } from './trails.js';

/**
 * The renovation cost hub (plan §8), defined in siteConfig.js. Re-exported for
 * existing imports; new code should import it from siteConfig.js.
 */
export { COST_HUB_PATH };

/**
 * Breadcrumb trails, defined in trails.js (light enough for a page to render
 * its breadcrumb without this module). Re-exported for existing imports.
 */
export { ROUTE_TRAILS, serviceTrail, trailFor };

/**
 * Branded 1200x630 share image (public/og/, made by scripts/build-images.mjs),
 * used wherever a page has no image of its own (plan §3.3).
 */
export const DEFAULT_IMAGE = `${SITE_URL}/og/default-1200x630.jpg`;
export const DEFAULT_IMAGE_ALT = 'Bridgeland Builders logo: Winnipeg renovation and construction contractor';

/** A site-relative URL ("/images/…") as an absolute one; absolute URLs unchanged. */
export const absoluteUrl = (url) =>
  url && !/^https?:\/\//.test(url) ? `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}` : url;

const IMAGE_TYPES = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', avif: 'image/avif' };

/**
 * og:image width/height/type when they can be known: from explicit values,
 * else from a "-1200x630." file name (the default and the self-hosted blog OG
 * images, optionally followed by a content hash) or a Wix transform URL
 * (".../w_1200,h_630,..."); the type from the file extension. Shared by the
 * prerender (scripts/prerender.mjs) and useSeo, so both emit the same tags.
 */
export function imageMeta(image, { width, height, type } = {}) {
  if (!image) return {};
  const path = String(image).split(/[?#]/)[0];
  const named = /-(\d{2,4})x(\d{2,4})(?:\.[a-f0-9]{8})?\.(?:jpe?g|png|webp|avif)$/i.exec(path);
  const wix = /\/w_(\d+),h_(\d+)[,/]/.exec(path);
  const dims = width && height ? [width, height] : (named || wix || []).slice(1, 3);
  const ext = (/\.([a-z0-9]+)$/i.exec(path) || [])[1];
  return {
    width: dims[0] ? String(dims[0]) : undefined,
    height: dims[1] ? String(dims[1]) : undefined,
    type: type || IMAGE_TYPES[(ext || '').toLowerCase()],
  };
}

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
    title: 'Winnipeg Renovation Contractor | Bridgeland Builders',
    description:
      'Winnipeg renovation contractor for kitchens, bathrooms, basement development, additions and commercial spaces. Free on-site visit and free written quote.',
    image: DEFAULT_IMAGE,
    updated: '2026-10-15',
  },
  '/services': {
    title: 'Renovation Services in Winnipeg | Bridgeland Builders',
    description:
      'Renovation services in Winnipeg for homes and businesses: kitchens, bathrooms, basements, whole homes, additions, commercial fit-ups, flooring and more.',
    updated: '2026-10-15',
  },
  '/about-us': {
    title: 'About Bridgeland Builders | Winnipeg Renovation Contractor',
    description:
      `Bridgeland Builders renovates homes and businesses in Winnipeg and nearby communities, with over ${EXPERIENCE_YEARS} years of combined experience and ${PROJECT_COUNT}+ projects.`,
    updated: '2026-10-15',
  },
  '/our-process': {
    title: 'Our Renovation Process | Bridgeland Builders Winnipeg',
    description:
      'How a Bridgeland Builders renovation runs, from a free on-site visit and written quote to permits, weekly updates, inspections and handover.',
    updated: '2026-10-14',
  },
  '/projects': {
    title: 'Renovation Projects & Ideas | Bridgeland Builders Winnipeg',
    description:
      'Design ideas for kitchen, bathroom, basement, whole-home and commercial renovations, with links to each service. Case studies of our own work to follow.',
    updated: '2026-10-13',
  },
  '/faqs': {
    title: 'Winnipeg Renovation FAQs | Bridgeland Builders',
    description:
      'Answers to common Winnipeg renovation questions: costs and written quotes, permits, timelines, living through the work, where we work and how to start.',
    updated: '2026-10-15',
  },
  '/instant-quote': {
    title: 'Free Renovation Quote & Estimate Winnipeg | Bridgeland',
    description:
      'Get a free instant renovation quote in Winnipeg. Answer a few questions for a starting price range, then book a free on-site visit for a written quote.',
    updated: '2026-10-15',
  },
  '/book-online': {
    title: 'Book a Free On-Site Renovation Visit | Bridgeland Builders',
    description:
      'Book a free on-site renovation visit in Winnipeg or a nearby community. We look at the space with you, then send a free written quote. No obligation.',
    updated: '2026-10-14',
  },
  '/contact-us': {
    title: 'Contact Bridgeland Builders | Winnipeg Renovations',
    description:
      `Contact Bridgeland Builders about your Winnipeg renovation. Call ${SITE_PHONE}, email us or send your project details. We reply within ${REPLY_TIME}.`,
    updated: '2026-10-14',
  },
  // Replaces /outside-winnipeg (308 in src/data/redirects.js). Page content:
  // src/data/serviceAreasContent.js; communities: SERVICE_AREAS in areas.js.
  // The page passes the content module's seo (same values) to usePageSeo.
  '/service-areas': {
    title: 'Service Areas: Winnipeg & Nearby | Bridgeland Builders',
    description:
      `Renovation contractor serving Winnipeg and communities within about an hour: ${NEARBY_AREAS_TEXT_SHORT}.`,
    updated: '2026-10-15',
  },
  // How guides, cost pages and service pages are written, sourced and reviewed
  // (plan §11.3). Page content: src/data/editorialPolicy.js.
  '/editorial-policy': {
    title: 'Editorial Policy | Bridgeland Builders',
    description:
      'How Bridgeland Builders writes, sources, reviews and updates the renovation guides, cost information and service pages published on this website.',
    updated: '2026-10-15',
  },
  '/blog': {
    title: 'Winnipeg Renovation Guides | Bridgeland Builders',
    description:
      'Renovation guides for Winnipeg homes and businesses: costs, permits, basements, kitchens and bathrooms, hiring a contractor, commercial work and money.',
    updated: '2026-10-14',
  },
  // Second contact page, holding the GoHighLevel form with the SMS consent
  // checkbox that the Privacy Policy and Terms of Service point to (A2P). Kept
  // out of search so /contact-us stays the one canonical contact page; still
  // prerendered and linked from the legal pages.
  '/contact': {
    title: 'Get in Touch | Bridgeland Builders Winnipeg',
    description:
      `Send Bridgeland Builders a message about your renovation or project. Call ${SITE_PHONE}, email ${SITE_EMAIL}, or use our contact form.`,
    robots: 'noindex, follow',
    updated: '2026-10-13',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | Bridgeland Builders',
    description:
      'How Bridgeland Builders collects, uses and protects personal information from our website, forms, booking calendar, price guide, chat and texts.',
    updated: '2026-10-14',
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
      `Get a free, no-obligation renovation quote in Winnipeg. Kitchens, bathrooms and basements with clear written pricing and a reply within ${REPLY_TIME}.`,
    image: DEFAULT_IMAGE,
    robots: 'noindex, follow',
    updated: '2026-10-14',
  },
};

/**
 * Service pages' SEO entries ({ title, description, serviceType, audience?,
 * primaryKeyword, updated }), keyed by path, for LIVE services only.
 *
 * The source of truth is each page's content module (`seo` in
 * src/data/services/<slug>.js). This object is deliberately EMPTY in the
 * browser — seo.js must not import the service modules, and a service page
 * passes its module's `seo` to usePageSeo instead. It is filled at build time
 * by src/data/projects.js (which imports every module), so any build script
 * that needs it (head.js, build-seo-files, sync-redirects, the audit) must
 * import src/data/projects.js (or head.js) before reading it.
 */
export const SERVICE_SEO = {};

/** Registers a live service page's seo (called by src/data/projects.js). */
export function registerServiceSeo(path, seo) {
  SERVICE_SEO[path] = seo;
}

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
      // The one short entity description (plan §12), as in the llms files.
      description: BUSINESS.shortDescription,
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
      openingHoursSpecification: BUSINESS_HOURS.map(({ days, opens, closes }) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: days.map((day) => `https://schema.org/${day}`),
        opens,
        closes,
      })),
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
      description: BUSINESS.shortDescription,
      publisher: organizationRef,
      inLanguage: 'en-CA',
    },
  ];
}

const breadcrumbId = (path) => `${SITE_URL}${path}#breadcrumb`;

/**
 * BreadcrumbList from a list of [name, path] pairs. Home is added for you.
 * Returns null for an empty trail (home, and the one-level pages that show no
 * visible breadcrumb: see ROUTE_TRAILS). `path` is the page the trail belongs
 * to; it defaults to the trail's last item.
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
 *   BlogPosting, Blog, ItemList, FAQPage or the organisation); omitted when
 *   the page has none.
 * - `primaryImage`: `{ url, width, height }` (absolute url) of an image that
 *   is the page's own (a post's title card, a real project photo), emitted as
 *   primaryImageOfPage with the id `<page>#primaryimage`. Never the branded
 *   default share image.
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
  primaryImage,
}) {
  const crumb = breadcrumb === undefined ? (path !== '/' ? { '@id': breadcrumbId(path) } : undefined) : breadcrumb || undefined;
  const url = `${SITE_URL}${path}`;
  return {
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    isPartOf: { '@id': SITE_ID },
    about: about || undefined,
    mainEntity: mainEntity || undefined,
    primaryImageOfPage:
      primaryImage && primaryImage.url
        ? {
            '@type': 'ImageObject',
            '@id': `${url}#primaryimage`,
            url: primaryImage.url,
            width: Number(primaryImage.width) || undefined,
            height: Number(primaryImage.height) || undefined,
          }
        : undefined,
    breadcrumb: crumb,
    dateModified: dateModified || updatedFor(path),
    inLanguage: 'en-CA',
  };
}

/**
 * Service schema for a single page. `audience` comes from the page's seo
 * (commercial pages: BusinessAudience) and is passed in explicitly, so the
 * prerender and the browser build the same node. `areaServed` defaults to the
 * whole confirmed service area; an area page passes its one community.
 * A registry parent with live child pages (commercial renovations → office,
 * retail, …) lists them in hasOfferCatalog: references to the children's
 * Service nodes, which the sitewide Organization catalog defines. No Offers,
 * no prices.
 */
export function buildService({ path, serviceType, description, audience, areaServed }) {
  return {
    '@type': 'Service',
    '@id': `${SITE_URL}${path}#service`,
    serviceType,
    name: serviceType,
    description,
    provider: organizationRef,
    areaServed: areaServed || areaServedNodes(),
    audience: audience || undefined,
    hasOfferCatalog: childServiceCatalog(path),
    url: `${SITE_URL}${path}`,
  };
}

const serviceId = (path) => `${SITE_URL}${path}#service`;

function childServiceCatalog(path) {
  const parent = serviceByPath(path);
  const children = parent ? SERVICES.filter((service) => service.parent === path && service.status === 'live') : [];
  if (!children.length) return undefined;
  return {
    '@type': 'OfferCatalog',
    name: parent.navLabel,
    itemListElement: children.map((child) => ({ '@id': serviceId(child.path) })),
  };
}

/**
 * VideoObject — only ever on a /videos/<slug> watch page (plan §3.5: the audit
 * forbids it anywhere else). Real footage only. src/data/videos.js
 * buildVideoNode() builds it from a video entry.
 */
export function buildVideoObject({ path, name, description, thumbnailUrl, uploadDate, duration, embedUrl, contentUrl, transcript }) {
  return {
    '@type': 'VideoObject',
    '@id': `${SITE_URL}${path}#video`,
    name,
    description,
    thumbnailUrl: thumbnailUrl || undefined,
    uploadDate: isoWinnipeg(uploadDate),
    duration: duration || undefined,
    embedUrl: embedUrl || undefined,
    contentUrl: contentUrl || undefined,
    transcript: transcript || undefined,
    url: `${SITE_URL}${path}`,
    publisher: organizationRef,
    inLanguage: 'en-CA',
  };
}

/**
 * Article node for cost guides (plan §3.5, §8; added by resolvePageSeo). `about`
 * is an { '@id' } reference to the service page's Service node.
 */
export function buildArticle({ path, headline, description, image, datePublished, dateModified, about }) {
  const url = `${SITE_URL}${path}`;
  return {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline,
    description,
    image: image || undefined,
    datePublished: isoWinnipeg(datePublished || dateModified),
    dateModified: isoWinnipeg(dateModified || datePublished),
    mainEntityOfPage: { '@id': `${url}#webpage` },
    author: organizationRef,
    publisher: organizationRef,
    about: about || undefined,
    isPartOf: { '@id': SITE_ID },
    inLanguage: 'en-CA',
  };
}

/**
 * FAQPage schema from [{ q, a }] items. A blank line in `a` (a paragraph
 * break on the page, FaqAccordion.jsx) becomes a space: one plain-text answer.
 */
export function buildFaqPage(path, faqs) {
  if (!faqs || !faqs.length) return null;
  return {
    '@type': 'FAQPage',
    '@id': `${SITE_URL}${path}#faq`,
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: typeof item.a === 'string' ? item.a.replace(/\s*\n\s*/g, ' ') : item.a },
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
      image: absoluteUrl(post.ogImage || post.hero),
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
export function pageGraph({
  path,
  title,
  description,
  type,
  trail,
  serviceType,
  audience,
  areaServed,
  updated,
  faqs,
  primaryImage,
  nodes = [],
}) {
  const crumbs = buildBreadcrumbs(trail || trailFor(path, title), path);
  const service = serviceType ? buildService({ path, serviceType, description, audience, areaServed }) : null;
  const faqPage = buildFaqPage(path, faqs);
  // The page's main node: its Service, else a main node passed in (the /blog
  // Blog node, the /services ItemList, a cost guide's Article, a watch page's
  // VideoObject), else the FAQ list on the FAQ page itself.
  const main =
    service ||
    nodes.find((node) => node && MAIN_NODE_TYPES.includes(node['@type'])) ||
    (path === '/faqs' ? faqPage : null);
  return graph(
    buildWebPage({
      path,
      title,
      description,
      type: type || ROUTE_PAGE_TYPES[path],
      breadcrumb: crumbs ? { '@id': crumbs['@id'] } : false,
      dateModified: updated,
      mainEntity:
        main && main['@id'] ? { '@id': main['@id'] } : ORGANIZATION_PAGES.includes(path) ? organizationRef : undefined,
      primaryImage,
    }),
    crumbs,
    service,
    faqPage,
    ...nodes
  );
}

const MAIN_NODE_TYPES = ['Blog', 'ItemList', 'Article', 'BlogPosting', 'VideoObject'];

/** Pages about the business itself: their mainEntity is the organisation. */
const ORGANIZATION_PAGES = ['/about-us', '/contact-us', '/contact'];

const SERVICE_LIST_ID = `${SITE_URL}/services#services`;

/**
 * The /services directory as an ItemList of every live service page's Service
 * node (the ids the sitewide Organization catalog defines), in registry order.
 * Added to /services by templateNodes(), so the page passes nothing.
 */
export function buildServiceList() {
  return {
    '@type': 'ItemList',
    '@id': SERVICE_LIST_ID,
    name: 'Renovation and construction services',
    numberOfItems: SERVICE_CATALOG.length,
    itemListElement: SERVICE_CATALOG.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: { '@id': serviceId(service.path) },
    })),
  };
}

/** WebPage subtype per route. */
export const ROUTE_PAGE_TYPES = {
  '/services': 'CollectionPage',
  '/projects': 'CollectionPage',
  '/blog': 'CollectionPage',
  '/about-us': 'AboutPage',
  '/contact-us': 'ContactPage',
  '/contact': 'ContactPage',
};

export function seoFor(path) {
  return PAGE_SEO[path] || SERVICE_SEO[path] || {};
}

const definedOnly = (object) =>
  Object.fromEntries(Object.entries(object || {}).filter(([, value]) => value !== undefined && value !== null));

// Page fields a page may pass straight in its usePageSeo options — e.g.
// usePageSeo(path, { title, description, updated, trail, faqs }) — or grouped
// under `meta` (a data module's whole `seo` object).
const META_KEYS = ['title', 'description', 'robots', 'updated', 'published', 'audience', 'headline'];
const pickMeta = (options) => definedOnly(Object.fromEntries(META_KEYS.map((key) => [key, options[key]])));

/** /renovation-cost-winnipeg or /services/<slug>/cost. */
export const isCostGuidePath = (path) => path === COST_HUB_PATH || /^\/services\/[^/]+\/cost$/.test(path);

const serviceRef = (service) =>
  service && service.status === 'live' ? { '@id': `${SITE_URL}${service.path}#service` } : undefined;

/**
 * Nodes a template route always carries, built from its path and meta alone,
 * so the page and the prerender add them without the page passing anything:
 *   cost guides  Article, about the service page's Service (plan §3.5, §8),
 *                with the page's og:image as its image
 *   /services    the ItemList of live services (buildServiceList), its
 *                mainEntity; nothing for ServicesPage.jsx to import
 */
function templateNodes(path, meta, nodes, image) {
  if (path === '/services' && !nodes.some((node) => node['@id'] === SERVICE_LIST_ID)) {
    return [buildServiceList()];
  }
  if (isCostGuidePath(path) && !nodes.some((node) => node['@type'] === 'Article')) {
    const match = /^\/services\/([^/]+)\/cost$/.exec(path);
    return [
      buildArticle({
        path,
        headline: meta.headline || pageName(meta.title),
        description: meta.description,
        image: absoluteUrl(image),
        datePublished: meta.published,
        dateModified: meta.updated,
        about: serviceRef(match ? serviceBySlug(match[1]) : null),
      }),
    ];
  }
  return [];
}

/** buildWebPage's primaryImage for an og:image: absolute url, size as og:image:width/height. */
function primaryImageFor(image) {
  const url = absoluteUrl(image);
  const { width, height } = imageMeta(url);
  return { url, width, height };
}

/**
 * Everything a page's <head> needs, from its path and usePageSeo options. The
 * single implementation behind both usePageSeo (browser) and headFor
 * (prerender), so the two cannot drift.
 *
 * options: { title, description, robots, updated, audience, meta, faqs, image,
 *            trail, pageType, nodes, serviceType, areaServed }
 *   title…audience  page fields merged over the route's PAGE_SEO/SERVICE_SEO
 *                   entry; `meta` does the same with a whole seo object (a
 *                   service module's `seo`), and wins over the loose fields.
 */
export function resolvePageSeo(path, options = {}) {
  const meta = { ...seoFor(path), ...pickMeta(options), ...definedOnly(options.meta) };
  const nodes = (options.nodes || []).filter(Boolean);
  // Same fallback on both sides, so hydration keeps the prerendered
  // og:image / summary_large_image card (and the cost-guide Article image).
  const image = options.image || meta.image || DEFAULT_IMAGE;
  const jsonLd = pageGraph({
    path,
    title: meta.title,
    description: meta.description,
    type: options.pageType,
    trail: options.trail,
    serviceType: options.serviceType || meta.serviceType,
    audience: meta.audience,
    areaServed: options.areaServed,
    updated: meta.updated,
    faqs: options.faqs,
    // A page's own image (the /blog lead card, a real project photo) is also
    // its primaryImageOfPage; the branded default never is.
    primaryImage: image !== DEFAULT_IMAGE ? primaryImageFor(image) : undefined,
    nodes: [...nodes, ...templateNodes(path, meta, nodes, image)],
  });
  return {
    title: meta.title,
    description: meta.description,
    path,
    image,
    imageAlt: options.imageAlt || meta.imageAlt || (image === DEFAULT_IMAGE ? DEFAULT_IMAGE_ALT : undefined),
    robots: meta.robots,
    updated: meta.updated || updatedFor(path),
    jsonLd,
  };
}

// usePageSeo options for a service page; defined in services.js.
export { serviceSeo } from './services.js';

/**
 * Head of the 404 page: the prerendered dist/404.html (head.js → prerender)
 * and NotFoundPage.jsx after an in-browser navigation use the same values.
 */
export const NOT_FOUND_HEAD = {
  title: 'Page Not Found | Bridgeland Builders',
  description: 'That page does not exist. Browse our Winnipeg renovation services or get in touch for a free quote.',
  robots: 'noindex, follow',
};

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
