import { BUSINESS, SERVICE_CATALOG, SITE_NAME, SITE_URL } from './siteConfig.js';

export const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80';

/**
 * Per-route title and meta description. Titles stay under ~60 characters and
 * descriptions under ~160 so they are not truncated in results. Every claim
 * here appears on the site itself — nothing is invented.
 */
export const PAGE_SEO = {
  '/': {
    title: 'Winnipeg Renovation & Construction Company | Bridgeland Builders',
    description:
      'Bridgeland Builders is a top construction and renovation company in Winnipeg, Manitoba, with expert craftsmanship on residential renovation and commercial projects.',
    image: DEFAULT_IMAGE,
  },
  '/services': {
    title: 'Renovation Services & Business Remodeling | Bridgeland Builders',
    description:
      'Expert renovation services and business remodeling in Winnipeg: whole-home, kitchen, bathroom, basement, commercial fit-outs, flooring, masonry, windows and more.',
  },
  '/about-us': {
    title: 'About Bridgeland Builders | Winnipeg Renovation Team',
    description:
      'A trusted name in construction and renovation in Winnipeg, with 60+ years of combined experience across residential and commercial projects and 100+ completed jobs.',
  },
  '/our-process': {
    title: 'Our Renovation Process | Bridgeland Builders Winnipeg',
    description:
      'How a Bridgeland Builders renovation runs, from the first walkthrough and written quote through permits, construction and the final inspection.',
  },
  '/projects': {
    title: 'Winnipeg Renovation Projects & Gallery | Bridgeland Builders',
    description:
      'Browse completed Winnipeg renovation projects by Bridgeland Builders — kitchens, bathrooms, basements, whole-home remodels and commercial fit-outs.',
  },
  '/faqs': {
    title: 'Renovation FAQs | Bridgeland Builders Winnipeg',
    description:
      'Answers to common Winnipeg renovation questions: written quotes, permits and inspections, living in your home during work, timelines and how to get started.',
  },
  '/book-online': {
    title: 'Book an Appointment Online | Bridgeland Builders Winnipeg',
    description:
      'Book a free on-site renovation consultation with Bridgeland Builders in Winnipeg. Pick a date and time in our calendar and get instant confirmation.',
  },
  '/contact-us': {
    title: 'Contact Bridgeland Builders | Winnipeg Renovations',
    description:
      'Request a free renovation quote from Bridgeland Builders in Winnipeg. Call 431-866-5644 or send your project details and we reply within one business day.',
  },
  '/outside-winnipeg': {
    title: 'Renovations Outside Winnipeg | Bridgeland Builders',
    description:
      'Bridgeland Builders takes on renovation and construction projects beyond Winnipeg across Manitoba. Tell us where the property is and we will plan the trip.',
  },
  '/blog': {
    title: 'Renovation Blogs & Articles | Bridgeland Builders Winnipeg',
    description:
      'Renovation inspiration, expert tips and industry insights from Bridgeland Builders, covering residential and commercial renovation ideas for Winnipeg properties.',
  },
};

/** Service pages get their own titles, descriptions and Service schema. */
export const SERVICE_SEO = {
  '/services/whole-home-renovations': {
    title: 'Whole Home Renovations Winnipeg | Bridgeland Builders',
    description:
      'Whole home renovations in Winnipeg under one crew and one plan — layout, kitchen, baths, flooring and paint coordinated to a single finish date. Free walkthrough.',
    serviceType: 'Whole home renovation',
  },
  '/services/kitchen-renovations': {
    title: 'Kitchen Renovations Winnipeg | Bridgeland Builders',
    description:
      'Kitchen renovations in Winnipeg: better layout, storage, lighting and durable finishes, installed by one crew with a clear written scope. Book a free walkthrough.',
    serviceType: 'Kitchen renovation',
  },
  '/services/bathroom-renovations': {
    title: 'Bathroom Renovations Winnipeg | Bridgeland Builders',
    description:
      'Bathroom renovations in Winnipeg with reliable waterproofing, durable tile and practical storage. Clear written quotes and a free in-home walkthrough.',
    serviceType: 'Bathroom renovation',
  },
  '/services/basement-renovations': {
    title: 'Basement Renovations Winnipeg | Bridgeland Builders',
    description:
      'Basement renovations in Winnipeg — turn an unfinished or dated basement into warm, dry, usable living space. Framing, insulation, egress and finishing handled.',
    serviceType: 'Basement renovation',
  },
  '/services/home-extensions': {
    title: 'Home Extensions Winnipeg | Bridgeland Builders',
    description:
      'Home extensions and additions in Winnipeg designed to match the existing house, with permits, structure and finishing coordinated by one contractor.',
    serviceType: 'Home extension',
  },
  '/services/commercial-renovations': {
    title: 'Commercial Renovation Contractors Winnipeg | Bridgeland Builders',
    description:
      'Commercial renovation contractors in Winnipeg and Manitoba: office renovation, retail, restaurants, medical and dental clinics, hotels and warehouse spaces.',
    serviceType: 'Commercial renovation',
  },
};

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

export const organizationRef = { '@id': ORG_ID };

/** Reference that also carries the name, for author/publisher slots. */
export const organizationNamed = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
};

/** The sitewide entity: who this business is, where it works, what it does. */
export function buildOrganizationGraph() {
  return [
    {
      '@type': ['GeneralContractor', 'HomeAndConstructionBusiness', 'LocalBusiness'],
      '@id': ORG_ID,
      name: BUSINESS.name,
      legalName: BUSINESS.legalName,
      url: `${SITE_URL}/`,
      description: BUSINESS.description,
      slogan: BUSINESS.slogan,
      telephone: BUSINESS.telephone,
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
      areaServed: BUSINESS.areaServed.map((name) => ({ '@type': 'Place', name })),
      knowsAbout: BUSINESS.knowsAbout,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: BUSINESS.telephone,
        contactType: 'customer service',
        areaServed: 'CA',
        availableLanguage: 'English',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Renovation and construction services',
        itemListElement: SERVICE_CATALOG.map((service) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service.name,
            url: `${SITE_URL}${service.path}`,
          },
        })),
      },
    },
    {
      '@type': 'WebSite',
      '@id': SITE_ID,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      description: BUSINESS.description,
      publisher: organizationRef,
      inLanguage: 'en-CA',
    },
  ];
}

/** BreadcrumbList from a list of [name, path] pairs. Home is added for you. */
export function buildBreadcrumbs(trail) {
  const items = [['Home', '/'], ...trail];
  return {
    '@type': 'BreadcrumbList',
    '@id': `${SITE_URL}${trail.length ? trail[trail.length - 1][1] : '/'}#breadcrumb`,
    itemListElement: items.map(([name, path], index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: `${SITE_URL}${path === '/' ? '/' : path}`,
    })),
  };
}

/**
 * WebPage node tying the page to the site and organisation. `speakable` marks
 * the parts a voice assistant should read aloud.
 */
export function buildWebPage({ path, title, description, type = 'WebPage' }) {
  return {
    '@type': type,
    '@id': `${SITE_URL}${path}#webpage`,
    url: `${SITE_URL}${path}`,
    name: title,
    description,
    isPartOf: { '@id': SITE_ID },
    about: organizationRef,
    inLanguage: 'en-CA',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.page-hero-card > p', '.hero-subtitle'],
    },
  };
}

/** Service schema for a single service page. */
export function buildService({ path, serviceType, description }) {
  return {
    '@type': 'Service',
    '@id': `${SITE_URL}${path}#service`,
    serviceType,
    name: serviceType,
    description,
    provider: organizationRef,
    areaServed: BUSINESS.areaServed.map((name) => ({ '@type': 'Place', name })),
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

/** Wraps nodes in a single @graph document. */
export function graph(...nodes) {
  return { '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) };
}

/** Breadcrumb trail per route, as [label, path] pairs (Home is implicit). */
export const ROUTE_TRAILS = {
  '/': [],
  '/services': [['Services', '/services']],
  '/about-us': [['About Us', '/about-us']],
  '/our-process': [['Our Process', '/our-process']],
  '/projects': [['Projects', '/projects']],
  '/faqs': [['FAQs', '/faqs']],
  '/contact-us': [['Contact Us', '/contact-us']],
  '/book-online': [['Book Online', '/book-online']],
  '/outside-winnipeg': [['Outside Winnipeg', '/outside-winnipeg']],
  '/blog': [['Blog', '/blog']],
  '/services/whole-home-renovations': [['Services', '/services'], ['Whole Home Renovations', '/services/whole-home-renovations']],
  '/services/bathroom-renovations': [['Services', '/services'], ['Bathroom Renovations', '/services/bathroom-renovations']],
  '/services/kitchen-renovations': [['Services', '/services'], ['Kitchen Renovations', '/services/kitchen-renovations']],
  '/services/basement-renovations': [['Services', '/services'], ['Basement Renovations', '/services/basement-renovations']],
  '/services/home-extensions': [['Services', '/services'], ['Home Extensions', '/services/home-extensions']],
  '/services/commercial-renovations': [['Services', '/services'], ['Commercial Renovations', '/services/commercial-renovations']],
};

/** WebPage subtype per route. */
export const ROUTE_PAGE_TYPES = {
  '/services': 'CollectionPage',
  '/projects': 'CollectionPage',
  '/blog': 'CollectionPage',
  '/contact-us': 'ContactPage',
};

export function seoFor(path) {
  return PAGE_SEO[path] || SERVICE_SEO[path] || {};
}
