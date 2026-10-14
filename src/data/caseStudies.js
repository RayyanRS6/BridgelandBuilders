/**
 * Case studies of real Bridgeland Builders jobs, one page each at
 * /projects/<slug> (CaseStudyPage.jsx, plan §5/§13). The entries, their shape
 * and the plain helpers live in caseStudyData.js (import-free); this module
 * re-exports them and adds caseStudySeoOptions, which needs the seo.js
 * schema builders.
 */
import { absoluteUrl, buildArticle } from './seo.js';
import { serviceByPath } from './services.js';
import { SITE_URL } from './siteConfig.js';
import { caseStudyCover, caseStudyPath } from './caseStudyData.js';

export {
  CASE_STUDIES,
  CASE_STUDY_SLUG_PATTERN,
  LEGACY_PROJECT_SLUGS,
  caseStudiesForArea,
  caseStudiesForService,
  caseStudyBySlug,
  caseStudyCover,
  caseStudyPath,
  isValidCaseStudySlug,
  publishedCaseStudies,
} from './caseStudyData.js';

/**
 * usePageSeo / resolvePageSeo options for a case study. CaseStudyPage and the
 * prerender (head.js) must both use this. The breadcrumb comes from seo.js
 * trailFor() (Projects › <seo title>).
 */
export function caseStudySeoOptions(study) {
  const cover = caseStudyCover(study);
  const seo = study.seo || {};
  const service = study.service ? serviceByPath(study.service) : null;
  return {
    meta: seo,
    faqs: study.faqs && study.faqs.length ? study.faqs : undefined,
    image: cover ? cover.src : undefined,
    imageAlt: cover ? cover.alt : undefined,
    // The write-up itself (plan §3.5), about the service page's Service node
    // when that page is live, so every @id resolves.
    nodes: [
      buildArticle({
        path: caseStudyPath(study),
        headline: study.title || seo.title,
        description: seo.description,
        image: cover ? absoluteUrl(cover.src) : undefined,
        datePublished: seo.published || seo.updated,
        dateModified: seo.updated,
        about: service && service.status === 'live' ? { '@id': `${SITE_URL}${service.path}#service` } : undefined,
      }),
    ],
  };
}
