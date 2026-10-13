/**
 * BUILD-TIME head model and route inventory (Node only — it reads every data
 * module, including the build-only blogPosts.js, and must never reach the
 * browser bundle).
 *
 *   headFor(path)   the <head> for any route: the prerenderer calls it. For
 *                   every route it resolves exactly the options the page itself
 *                   passes to usePageSeo, through the same seo.js
 *                   resolvePageSeo(), so the static HTML and the client render
 *                   cannot drift.
 *   SITE_ROUTES     every route that is prerendered: static pages (PAGE_SEO),
 *                   live service pages (src/data/services.js), live cost guides,
 *                   published community pages, case studies and videos, and
 *                   published blog posts — each with lastmod and noindex.
 *                   build-seo-files.mjs (sitemap, prerender list, llms files)
 *                   and sync-redirects.mjs (planned redirects) read it.
 *   SEO_ENTRIES     path -> { title, description, robots, updated } for every
 *                   route in SITE_ROUTES (for the audit).
 */
import { existsSync } from 'node:fs';
import { SITE_FAQS } from './faqs.js';
import { buildPostHead } from './postContent.js';
import { LIVE_SERVICE_PAGES } from './projects.js';
import { serviceBySlug } from './services.js';
import { PAGE_SEO, buildBlogNode, resolvePageSeo, seoFor, serviceSeo } from './seo.js';

/* --------------------------------------------------------- data modules */
// Template and blog data are owned by their own modules; a missing module
// only drops its routes (with a warning), a broken one fails the build.
async function optionalModule(rel) {
  const url = new URL(rel, import.meta.url);
  if (!existsSync(url)) {
    console.warn(`[head] src/data/${rel.replace(/^\.\//, '')} not found — its routes are skipped`);
    return {};
  }
  return import(url.href);
}

const blogIndex = await optionalModule('./blogIndex.js');
const blogFull = await optionalModule('./blogPosts.js');
const costGuides = await optionalModule('./costGuides/index.js');
const areasContent = await optionalModule('./serviceAreasContent.js');
const caseStudies = await optionalModule('./caseStudies.js');
const videos = await optionalModule('./videos.js');

const isPublished = (post) => post && (post.status || 'published') === 'published';

/** Published posts' metadata, newest first — the list /blog renders (blogIndex.js). */
export const PUBLISHED_POSTS = (blogIndex.BLOG_POSTS || blogFull.BLOG_POSTS || []).filter(isPublished);

const fullPost = (slug) =>
  (typeof blogFull.getPostBySlug === 'function' ? blogFull.getPostBySlug(slug) : null) ||
  (blogFull.BLOG_POSTS || []).find((post) => post.slug === slug) ||
  null;

/** Live cost guides (src/data/costGuides/), hub first. */
const ALL_COST_GUIDES =
  typeof costGuides.loadCostGuides === 'function' ? await costGuides.loadCostGuides() : costGuides.COST_GUIDES || [];
const isLiveCostGuide = costGuides.isLiveCostGuide || ((guide) => Boolean(guide && guide.status === 'live'));
export const LIVE_COST_GUIDES = ALL_COST_GUIDES.filter(isLiveCostGuide);
for (const guide of LIVE_COST_GUIDES) {
  const service = guide.serviceSlug ? serviceBySlug(guide.serviceSlug) : null;
  if (guide.serviceSlug && (!service || service.status !== 'live')) {
    console.warn(`[head] cost guide ${guide.path} is live but its service page (${guide.serviceSlug}) is not`);
  }
}

const SERVICE_AREAS_CONTENT = areasContent.SERVICE_AREAS_CONTENT || areasContent.default || null;
export const PUBLISHED_AREAS =
  typeof areasContent.publishedServiceAreas === 'function' ? areasContent.publishedServiceAreas() : [];

const caseStudyPath = caseStudies.caseStudyPath || ((study) => `/projects/${study.slug}`);
export const PUBLISHED_CASE_STUDIES =
  typeof caseStudies.publishedCaseStudies === 'function' ? caseStudies.publishedCaseStudies() : [];
for (const study of PUBLISHED_CASE_STUDIES) {
  // /projects/<service> are the old project URLs (client <Navigate> + server
  // redirects); a case study may never take one of those slugs.
  if ((caseStudies.LEGACY_PROJECT_SLUGS || []).includes(study.slug)) {
    throw new Error(`case study slug "${study.slug}" collides with a legacy /projects/<service> redirect`);
  }
}

const videoPath = videos.videoPath || ((video) => `/videos/${video.slug}`);
export const PUBLISHED_VIDEOS = typeof videos.publishedVideos === 'function' ? videos.publishedVideos() : [];

/* ------------------------------------------- usePageSeo options per route */
// For every route, the exact options its page passes to usePageSeo. Template
// pages and this file call the same exported builder (named below), so the
// two cannot disagree; the fallbacks only apply if a builder is missing.
const ROUTE_OPTIONS = new Map();
const optionsOr = (builder, fallback) => (typeof builder === 'function' ? builder : fallback);

// ServiceRoute.jsx -> seo.js serviceSeo(content)
for (const { service, content } of LIVE_SERVICE_PAGES) {
  ROUTE_OPTIONS.set(service.path, () => serviceSeo(content));
}

// CostGuidePage.jsx -> costGuides/index.js costGuideSeoOptions(guide)
// (resolvePageSeo adds the Article node for cost guide paths)
const costGuideOptions = optionsOr(costGuides.costGuideSeoOptions, (guide) => ({
  meta: guide.seo,
  faqs: guide.faqs && guide.faqs.length ? guide.faqs : undefined,
}));
for (const guide of LIVE_COST_GUIDES) {
  ROUTE_OPTIONS.set(guide.path, () => costGuideOptions(guide));
}

// ServiceAreasPage.jsx -> serviceAreasContent.js serviceAreasSeoOptions()
if (SERVICE_AREAS_CONTENT) {
  const hubOptions = optionsOr(areasContent.serviceAreasSeoOptions, () => ({ faqs: SERVICE_AREAS_CONTENT.faqs }));
  ROUTE_OPTIONS.set('/service-areas', () => hubOptions());
}

// AreaPage.jsx -> serviceAreasContent.js serviceAreaSeoOptions(area)
const areaOptions = optionsOr(areasContent.serviceAreaSeoOptions, (area) => ({
  meta: area.seo,
  faqs: area.faqs && area.faqs.length ? area.faqs : undefined,
}));
for (const area of PUBLISHED_AREAS) {
  ROUTE_OPTIONS.set(area.path, () => areaOptions(area));
}

// CaseStudyPage.jsx -> caseStudies.js caseStudySeoOptions(study)
const caseStudyOptions = optionsOr(caseStudies.caseStudySeoOptions, (study) => ({
  meta: study.seo,
  faqs: study.faqs && study.faqs.length ? study.faqs : undefined,
}));
for (const study of PUBLISHED_CASE_STUDIES) {
  ROUTE_OPTIONS.set(caseStudyPath(study), () => caseStudyOptions(study));
}

// VideoPage.jsx -> videos.js videoSeoOptions(video)
const videoOptions = optionsOr(videos.videoSeoOptions, (video) => ({
  meta: video.seo,
  nodes: typeof videos.buildVideoNode === 'function' ? [videos.buildVideoNode(video)] : [],
  image: video.thumbnail,
}));
for (const video of PUBLISHED_VIDEOS) {
  ROUTE_OPTIONS.set(videoPath(video), () => videoOptions(video));
}

// EditorialPolicyPage.jsx and every other static page: usePageSeo(path), PAGE_SEO only.

// FaqsPage.jsx
ROUTE_OPTIONS.set('/faqs', () => ({ faqs: SITE_FAQS }));

// BlogPage.jsx: the Blog node and the latest post's 1200x630 image.
ROUTE_OPTIONS.set('/blog', () => {
  const latest = PUBLISHED_POSTS[0];
  return {
    image: latest && (latest.ogImage || latest.hero),
    nodes: [buildBlogNode({ posts: PUBLISHED_POSTS, description: seoFor('/blog').description })],
  };
});

/* ---------------------------------------------------------------- heads */

export function headFor(path) {
  if (path.startsWith('/blog/')) {
    const slug = path.slice('/blog/'.length);
    if (!PUBLISHED_POSTS.some((post) => post.slug === slug)) return null;
    const post = fullPost(slug);
    return post ? buildPostHead(post) : null;
  }

  const options = ROUTE_OPTIONS.has(path) ? ROUTE_OPTIONS.get(path)() : PAGE_SEO[path] ? {} : null;
  if (!options) return null;
  const head = resolvePageSeo(path, options);
  if (!head.title) return null;
  return {
    title: head.title,
    description: head.description,
    path,
    image: head.image,
    imageAlt: head.imageAlt,
    robots: head.robots,
    updated: head.updated,
    jsonLd: head.jsonLd,
  };
}

/** The 404 page is rendered but never indexed. */
export const NOT_FOUND_HEAD = {
  title: 'Page Not Found | Bridgeland Builders',
  description: 'That page does not exist. Browse our Winnipeg renovation services or get in touch for a free quote.',
  robots: 'noindex, follow',
};

/* ------------------------------------------------------- route inventory */
const pagePaths = [
  '/',
  '/services',
  ...LIVE_SERVICE_PAGES.map(({ service }) => service.path),
  ...Object.keys(PAGE_SEO),
  ...LIVE_COST_GUIDES.map((guide) => guide.path),
  ...PUBLISHED_AREAS.map((area) => area.path),
  ...PUBLISHED_CASE_STUDIES.map(caseStudyPath),
  ...PUBLISHED_VIDEOS.map(videoPath),
];

/**
 * Every prerendered route, in sitemap order: { path, lastmod, noindex, kind }.
 * A route whose head cannot be built is left out with a warning (prerender
 * would skip it, so it must not be listed either).
 */
export const SITE_ROUTES = [
  ...[...new Set(pagePaths)].map((path) => ({ path, kind: 'page' })),
  ...PUBLISHED_POSTS.map((post) => ({ path: `/blog/${post.slug}`, kind: 'post' })),
]
  .map((route) => {
    const head = headFor(route.path);
    if (!head) {
      console.warn(`[head] no head model for ${route.path} — not prerendered or listed`);
      return null;
    }
    return { ...route, lastmod: head.updated, noindex: /noindex/i.test(head.robots || ''), head };
  })
  .filter(Boolean);

/** path -> { title, description, robots, updated } for every prerendered route. */
export const SEO_ENTRIES = Object.fromEntries(
  SITE_ROUTES.map(({ path, head }) => [
    path,
    { title: head.title, description: head.description, robots: head.robots, updated: head.updated },
  ])
);

/** Every live route path (prerendered, indexable or not). */
export const LIVE_ROUTE_PATHS = new Set(SITE_ROUTES.map((route) => route.path));
