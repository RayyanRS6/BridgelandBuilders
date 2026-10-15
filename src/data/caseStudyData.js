/**
 * Case studies of real Bridgeland Builders jobs, one page each at
 * /projects/<slug> (CaseStudyPage.jsx, plan §5/§13). Empty until the owner
 * supplies documented jobs with photos and client consent — nothing here may
 * be invented, and stock photos never appear on a case study.
 *
 * The entries and the plain helpers live here, free of imports, so a light
 * module (serviceAreasContent.js: a community page needs three published case
 * studies there) can count them without pulling in the schema builders.
 * caseStudies.js re-exports all of it and adds caseStudySeoOptions; import
 * from caseStudies.js unless the importer must stay light.
 *
 * SLUG: <area>-<service>-<yyyy>, e.g. 'river-heights-kitchen-renovation-2027'
 * (lowercase, hyphens, ends in the year the job was finished). The year suffix
 * keeps case studies clear of the six legacy /projects/<service> redirects
 * (LEGACY_PROJECT_SLUGS below), which must never be reused.
 *
 * ENTRY SHAPE
 *   {
 *     slug: 'river-heights-kitchen-renovation-2027',
 *     published: false,                  // true only with the owner's sign-off
 *     seo: { title, description, updated: 'YYYY-MM-DD' },
 *     title: 'Kitchen renovation in River Heights',      // cards, breadcrumb
 *     h1: { title: 'KITCHEN RENOVATION', highlight: 'IN RIVER HEIGHTS' },
 *     summary: '40–60 words: what was built, where, how long (hero + cards)',
 *     service: '/services/kitchen-renovations',          // services.js path
 *     area: {
 *       slug: 'winnipeg',                // SERVICE_AREAS slug (links the area page when published)
 *       community: 'Winnipeg',
 *       neighbourhood: 'River Heights',  // only with the client's consent
 *     },
 *     completed: 'YYYY-MM',              // month the job was handed over
 *     duration: '6 weeks',
 *     budgetBand: '$40,000–$60,000' | null,   // only with consent
 *     permits: 'City of Winnipeg building permit' | null,
 *     stats: [{ num, unit, label }],     // optional stat cards
 *     sections: [{ h2, blocks: [RichBody blocks] }],      // brief, what we found, what we built, result
 *     photos: [{
 *       src, srcSet?, width, height,
 *       alt: 'what is visible, no keywords',
 *       caption: 'short label',
 *       stage: 'before' | 'during' | 'after',
 *     }],
 *     video?: 'video-slug',              // a published entry in videos.js
 *     process?: { tag, title, desc, steps: [{ num, title, text }] },
 *     testimonial?: { quote, name, role, source, date: 'YYYY-MM-DD' },   // with consent
 *     faqs?: [{ q, a }],
 *     related?: ['/services/...', ...],
 *     consent: {                         // from the signed consent form (plan §13)
 *       photos: true, video: false, faces: false, name: false,
 *       neighbourhood: true, budget: false, channels: ['website', 'gbp'],
 *       date: 'YYYY-MM-DD',
 *     },
 *     ownerSignoff: { name, role, date },
 *   }
 */
export const CASE_STUDIES = [];

/** The old /projects/<service> URLs, redirected to the service pages. Never case-study slugs. */
export const LEGACY_PROJECT_SLUGS = [
  'whole-home-renovation',
  'bathroom-renovation',
  'kitchen-renovation',
  'basement-renovation',
  'home-extension',
  'commercial-renovation',
];

/** <area>-<service>-<yyyy>. */
export const CASE_STUDY_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*-(?:19|20)\d{2}$/;

export const isValidCaseStudySlug = (slug) =>
  typeof slug === 'string' && CASE_STUDY_SLUG_PATTERN.test(slug) && !LEGACY_PROJECT_SLUGS.includes(slug);

export const caseStudyPath = (study) => `/projects/${study.slug}`;

/** Published case studies with valid slugs, newest first. */
export function publishedCaseStudies() {
  return CASE_STUDIES.filter((study) => study.published && isValidCaseStudySlug(study.slug)).sort((a, b) =>
    String(b.completed || '').localeCompare(String(a.completed || ''))
  );
}

/** A published case study by slug, or null. */
export function caseStudyBySlug(slug) {
  return publishedCaseStudies().find((study) => study.slug === slug) || null;
}

/** Published case studies in a community (SERVICE_AREAS slug). */
export function caseStudiesForArea(areaSlug) {
  return publishedCaseStudies().filter((study) => study.area && study.area.slug === areaSlug);
}

/** Published case studies for a service page path. */
export function caseStudiesForService(servicePath) {
  return publishedCaseStudies().filter((study) => study.service === servicePath);
}

/** The photo used for cards and Open Graph: the first "after" photo, else the first one. */
export function caseStudyCover(study) {
  const photos = (study && study.photos) || [];
  return photos.find((photo) => photo.stage === 'after') || photos[0] || null;
}
