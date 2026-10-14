import { caseStudiesForArea } from './caseStudyData.js';
import { NEARBY_AREAS_TEXT, SERVICE_AREAS, SITE_PHONE, listJoin } from './siteConfig.js';

/**
 * Content for /service-areas (plan §14.5) and the gated community pages
 * /service-areas/<slug> (plan D9). The communities themselves — names, types,
 * which are confirmed — come from SERVICE_AREAS in siteConfig.js; this file
 * only adds what each page says about them.
 *
 * PERMIT AUTHORITIES: each entry with an `accessed` date was checked on the
 * authority's own website on that date (Selkirk is still to be checked in a
 * browser, see its entry). `permitUrl` is the authority's permit page; `sourceUrl`
 * (when different) is the official page that confirms who handles permits for
 * that community. Re-check yearly, and whenever a community page is published.
 *
 * AREA ENTRY SHAPE (areas[<slug>], slug = SERVICE_AREAS[].slug)
 *   {
 *     permitAuthority: 'City of Winnipeg',      // overrides siteConfig's value
 *     permitUrl, permitLabel,                   // link to the authority's permit page
 *     sourceUrl?, sourceLabel?,                 // official page confirming jurisdiction
 *     accessed: 'YYYY-MM-DD',
 *     notes: 'one or two verified sentences shown on the hub card',
 *     published: false,                         // true only when the D9 gate is met:
 *                                               // ≥3 documented jobs here, ≥600 unique
 *                                               // words, sourced local facts, GBP area,
 *                                               // owner sign-off. The page goes live only
 *                                               // with ≥3 published case studies for the
 *                                               // area and ownerSignoff as well
 *                                               // (passesAreaGate); the build audit checks
 *                                               // the words and sources (areas.page-gate).
 *     // Needed only when published (AreaPage):
 *     seo?: { title, description, updated: 'YYYY-MM-DD', serviceType? },   // usePageSeo `meta`
 *     h1?: { title: 'RENOVATIONS IN', highlight: 'HEADINGLEY' },
 *     intro?: 'hero description',
 *     blocks?: [RichBody blocks],              // the page's own local content
 *     faqs?: [{ q, a }],
 *     sources?: [{ label, url, accessed }],
 *     ownerSignoff?: { name, role, date },
 *   }
 */

const PERMIT_SOURCES_ACCESSED = '2026-10-13';

const MANITOBA_PERMITS_URL = 'https://www.gov.mb.ca/labour/its/bldg_codes/permits_and_inspections.html';
const RRPD_PERMITS_URL = 'https://www.redriverplanning.com/residential_permits';

const AREAS = {
  winnipeg: {
    permitAuthority: 'City of Winnipeg',
    permitUrl: 'https://www.winnipeg.ca/building-development/building-renovating/home-improvement-projects/home-renovations',
    permitLabel: 'City of Winnipeg: home renovations',
    accessed: PERMIT_SOURCES_ACCESSED,
    notes:
      'The City says kitchens, bathrooms and new or larger exterior doors and windows may need a building permit; cosmetic work such as painting and flooring does not. Applications go through Permits Online.',
    published: false,
  },
  headingley: {
    permitAuthority: 'RM of Headingley',
    permitUrl: 'https://rmofheadingley.ca/p/residential-building-fees-permits',
    permitLabel: 'RM of Headingley: building and development',
    accessed: PERMIT_SOURCES_ACCESSED,
    notes: 'The RM of Headingley issues building permits and takes applications through its online Cloudpermit portal.',
    published: false,
  },
  'east-st-paul': {
    permitAuthority: 'Red River Planning District',
    permitUrl: RRPD_PERMITS_URL,
    permitLabel: 'Red River Planning District: residential permits',
    sourceUrl: 'https://www.eaststpaul.com/p/building-permits',
    sourceLabel: 'RM of East St. Paul: building permits',
    accessed: PERMIT_SOURCES_ACCESSED,
    notes: 'The RM of East St. Paul is part of the Red River Planning District, which handles planning and building permits for it.',
    published: false,
  },
  'west-st-paul': {
    permitAuthority: 'Red River Planning District',
    permitUrl: RRPD_PERMITS_URL,
    permitLabel: 'Red River Planning District: residential permits',
    sourceUrl: 'https://weststpaul.com/planning-development',
    sourceLabel: 'RM of West St. Paul: planning and development',
    accessed: PERMIT_SOURCES_ACCESSED,
    notes: 'The RM of West St. Paul says all land use planning and building permit matters are handled by the Red River Planning District.',
    published: false,
  },
  'oak-bluff': {
    permitAuthority: 'RM of Macdonald',
    permitUrl: 'https://rmofmacdonald.com/p/do-i-need-a-permit-',
    permitLabel: 'RM of Macdonald: do I need a permit?',
    accessed: PERMIT_SOURCES_ACCESSED,
    notes:
      'Oak Bluff is in the RM of Macdonald, which issues building permits. The RM lists renovations such as garage conversions, basement finishing and kitchen expansions among work that usually needs one.',
    published: false,
  },
  selkirk: {
    permitAuthority: 'City of Selkirk',
    // NOT YET CHECKED ON THE CITY'S SITE: it refused automated requests (HTTP
    // 403) on 2026-10-13, so the page and its title were confirmed only
    // through the search index of the City's own domain. No `accessed` date
    // (the hub card shows no "Checked" line) until someone opens the page in
    // a browser and confirms it; then add accessed: 'YYYY-MM-DD'.
    permitUrl: 'https://www.myselkirk.ca/city-services/planninganddevelopment/permitsandapplications/renovations/',
    permitLabel: 'City of Selkirk: renovations and basement development',
    notes: 'The City of Selkirk’s Planning and Development department takes building permit applications, including for renovations and basement development.',
    published: false,
  },
  steinbach: {
    permitAuthority: 'City of Steinbach',
    permitUrl: 'https://www.steinbach.ca/home-property-community/building-home-improvements/building-permits-resources/',
    permitLabel: 'City of Steinbach: permits and fees',
    accessed: PERMIT_SOURCES_ACCESSED,
    notes: 'The City of Steinbach issues building permits and takes applications through its online Cloudpermit system.',
    published: false,
  },
};

/** The issuing authority for a community, or null when it is not verified. */
function authorityFor(area, content) {
  if (content && content.permitAuthority) return content.permitAuthority;
  if (area.permitAuthority && area.permitAuthority !== 'verify') return area.permitAuthority;
  return null;
}

/** "City of Winnipeg in Winnipeg; RM of Headingley in Headingley; …" — confirmed areas only. */
function authoritySentence() {
  const byAuthority = new Map();
  SERVICE_AREAS.filter((area) => area.confirmed).forEach((area) => {
    const authority = authorityFor(area, AREAS[area.slug]) || 'the local municipality';
    if (!byAuthority.has(authority)) byAuthority.set(authority, []);
    byAuthority.get(authority).push(area.name);
  });
  const parts = [...byAuthority.entries()].map(([authority, names]) =>
    `the ${authority} in ${listJoin(names)}`.replace(/^the the /, 'the ')
  );
  return parts.length > 1 ? `${parts.slice(0, -1).join('; ')}; and ${parts[parts.length - 1]}` : parts.join('');
}

// The hub's title, description and `updated` date live in PAGE_SEO['/service-areas']
// (seo.js), which both the page and the prerender read. Bump that `updated`
// whenever the hub's content here changes.
export const SERVICE_AREAS_CONTENT = {
  intro:
    'Building permits come from different offices around Winnipeg. In Manitoba they are issued by a municipality, a planning district or the province’s Inspection and Technical Services, depending on where the property is. Here is who issues them in each community we serve.',
  introSource: { label: 'Government of Manitoba: building permits and inspections', url: MANITOBA_PERMITS_URL, accessed: PERMIT_SOURCES_ACCESSED },
  faqs: [
    {
      q: 'Do you work outside Winnipeg?',
      a: `Yes. Along with Winnipeg, we work in nearby communities within about an hour of the city: ${NEARBY_AREAS_TEXT}.`,
    },
    {
      q: 'Who issues building permits in the communities around Winnipeg?',
      a: `It depends on the community. For the ones we serve, permits are issued by ${authoritySentence()}. Where your project needs a permit, we look after the application and the inspections.`,
    },
    {
      q: 'Do you work in all Winnipeg neighbourhoods?',
      a: 'Yes. Our service area covers all of the City of Winnipeg, as well as the nearby communities listed on this page.',
    },
    {
      q: 'How far do you travel for a project?',
      a: `We work within about an hour of Winnipeg, which covers the communities listed on this page. If your project is further out, call us at ${SITE_PHONE} and we’ll tell you honestly whether we can take it on.`,
    },
  ],
  areas: AREAS,
};

export default SERVICE_AREAS_CONTENT;

/** Published case studies a community needs before its page can go live (plan D9). */
export const AREA_PAGE_MIN_CASE_STUDIES = 3;

/**
 * The D9 gate in code: a community page is routed, prerendered, listed and
 * linked only when its entry says `published: true`, at least three published
 * case studies are set in that community (caseStudyData.js) and the owner has
 * signed it off. The build audit (scripts/audit-seo.mjs, areas.page-gate) also
 * checks the built page for 600+ words of its own and its sources.
 */
export function passesAreaGate(slug, content) {
  const signoff = content && content.ownerSignoff;
  return Boolean(
    content &&
      content.published &&
      signoff &&
      signoff.name &&
      signoff.date &&
      caseStudiesForArea(slug).length >= AREA_PAGE_MIN_CASE_STUDIES
  );
}

/**
 * Confirmed communities (siteConfig order, Winnipeg first) merged with their
 * content: { ...siteConfigEntry, ...content, permitAuthority, path }.
 * `published` and `path` are set only for community pages that pass the gate.
 */
export function confirmedServiceAreas() {
  return SERVICE_AREAS.filter((area) => area.confirmed).map((area) => {
    const content = AREAS[area.slug] || {};
    const published = passesAreaGate(area.slug, content);
    return {
      ...area,
      ...content,
      permitAuthority: authorityFor(area, content),
      published,
      path: published ? `/service-areas/${area.slug}` : null,
    };
  });
}

/**
 * A published community page's data by slug, or null (unconfirmed, unknown,
 * unpublished, or short of the gate: three published case studies there and
 * the owner's sign-off).
 */
export function publishedServiceArea(slug) {
  return confirmedServiceAreas().find((area) => area.slug === slug && area.published) || null;
}

/** Every published community page (for routes, prerender and the sitemap). */
export function publishedServiceAreas() {
  return confirmedServiceAreas().filter((area) => area.published);
}

/**
 * usePageSeo / resolvePageSeo options for /service-areas. ServiceAreasPage and
 * the prerender (head.js) must both use this: title and description come from
 * PAGE_SEO, the FAQPage from these FAQs.
 */
export function serviceAreasSeoOptions() {
  return { faqs: SERVICE_AREAS_CONTENT.faqs };
}

/**
 * usePageSeo / resolvePageSeo options for a published community page (an item
 * from publishedServiceArea()). Its Service node names this one community as
 * areaServed (plan §14.5); `seo.serviceType` switches the Service node on.
 * AreaPage and head.js must both use this.
 */
export function serviceAreaSeoOptions(area) {
  return {
    meta: area.seo,
    faqs: area.faqs && area.faqs.length ? area.faqs : undefined,
    areaServed: { '@type': area.type, name: area.name, sameAs: area.wikipedia },
  };
}
