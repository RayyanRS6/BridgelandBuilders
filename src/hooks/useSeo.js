import { useEffect, useMemo } from 'react';
import { SITE_LOCALE, SITE_NAME, SITE_URL } from '../data/siteConfig.js';
import { imageMeta, resolvePageSeo } from '../data/seo.js';

const MANAGED = 'data-seo';
const PAGE_JSON_LD = `script[${MANAGED}="page"]`;

function upsertMeta(attr, key, content) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector(selector);
  if (!content) {
    if (el && el.hasAttribute(MANAGED)) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    el.setAttribute(MANAGED, '');
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!href) {
    // e.g. a client-side move to the 404 page: a canonical left over from the
    // previous page (prerendered or not) would point at the wrong URL.
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    el.setAttribute(MANAGED, '');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Keeps the one page-level JSON-LD block in sync. The prerendered HTML already
 * carries it, so on first load this finds that block and leaves it alone when
 * the content matches; later navigations overwrite it in place. It is never
 * appended a second time and never removed on unmount (the next page's render
 * replaces it), only when a page has no JSON-LD at all.
 */
function syncJsonLd(jsonLd) {
  const existing = document.head.querySelectorAll(PAGE_JSON_LD);
  let script = existing[0];
  for (let i = 1; i < existing.length; i += 1) existing[i].remove();

  if (!jsonLd) {
    if (script) script.remove();
    return;
  }

  const text = JSON.stringify(jsonLd);
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute(MANAGED, 'page');
    document.head.appendChild(script);
  }
  if (script.textContent !== text) script.textContent = text;
}

/**
 * Keeps title, description, canonical, Open Graph/Twitter tags and JSON-LD in
 * sync with the current page. Purely head-level: it never touches the DOM the
 * user sees.
 */
export default function useSeo({ title, description, path, image, imageAlt, jsonLd, type, publishedTime, modifiedTime, robots }) {
  useEffect(() => {
    if (title) document.title = title;
    const canonical = path ? `${SITE_URL}${path}` : undefined;
    const absoluteImage = image && image.startsWith('http') ? image : image ? `${SITE_URL}${image}` : undefined;
    // Same values the prerender writes (scripts/prerender.mjs uses imageMeta too).
    const info = imageMeta(absoluteImage);
    const alt = absoluteImage ? imageAlt || title : undefined;

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    upsertLink('canonical', canonical);

    upsertMeta('property', 'og:type', type || 'website');
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:locale', SITE_LOCALE);
    upsertMeta('property', 'og:image', absoluteImage);
    upsertMeta('property', 'og:image:type', info.type);
    upsertMeta('property', 'og:image:width', info.width);
    upsertMeta('property', 'og:image:height', info.height);
    upsertMeta('property', 'og:image:alt', alt);
    upsertMeta('property', 'article:published_time', publishedTime);
    upsertMeta('property', 'article:modified_time', modifiedTime);

    upsertMeta('name', 'twitter:card', absoluteImage ? 'summary_large_image' : 'summary');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', absoluteImage);
    upsertMeta('name', 'twitter:image:alt', alt);
  }, [title, description, path, image, imageAlt, type, publishedTime, modifiedTime, robots]);

  useEffect(() => {
    syncJsonLd(jsonLd);
  }, [jsonLd]);
}

/**
 * One-line SEO for a standard page: the title/description for the route and
 * the same JSON-LD document the prerender emits. Both sides call
 * seo.js resolvePageSeo(path, options), so they cannot drift:
 * WebPage + BreadcrumbList, plus Service/FAQPage and any extra nodes supplied.
 *
 * Pages whose title/description live in a data module get their options from
 * a builder exported next to that data, and head.js (src/data/head.js) calls
 * the same builder for the prerender:
 *   service page  serviceSeo(content)             src/data/seo.js
 *   cost guide    costGuideSeoOptions(guide)      src/data/costGuides/index.js
 *   area pages    serviceAreasSeoOptions() / serviceAreaSeoOptions(area)
 *   case study    caseStudySeoOptions(study)      src/data/caseStudies.js
 *   video         videoSeoOptions(video)          src/data/videos.js
 * Cost guide routes also get an Article node automatically (resolvePageSeo).
 * A new template page must follow the same pattern and be added to head.js.
 *
 * @param {string} path        route path, e.g. '/about-us'
 * @param {object} [options]
 * @param {string} [options.title]        page title (overrides PAGE_SEO/SERVICE_SEO)
 * @param {string} [options.description] meta description (same)
 * @param {string} [options.updated]      YYYY-MM-DD, WebPage dateModified
 * @param {string} [options.robots]       robots meta
 * @param {object} [options.meta]   a whole seo object ({ title, description,
 *                                  robots, image, serviceType, audience,
 *                                  updated }), merged last
 * @param {Array}  [options.trail]  breadcrumb trail as [name, path] pairs
 *                                  (default: seo.js trailFor(path, title))
 * @param {Array}  [options.faqs]   [{ q, a }] to emit as FAQPage
 * @param {string} [options.serviceType] emit Service schema for this page
 * @param {Array}  [options.areaServed]  Service areaServed override (area pages)
 * @param {string} [options.pageType]    WebPage subtype (e.g. 'CollectionPage')
 * @param {string} [options.image]       Open Graph image
 * @param {Array}  [options.nodes]       extra JSON-LD nodes (e.g. buildBlogNode)
 */
export function usePageSeo(path, options = {}) {
  const head = resolvePageSeo(path, options);
  // Options built inline (or by a helper) are new objects on every render;
  // keep the JSON-LD object stable while its content is unchanged.
  const jsonText = JSON.stringify(head.jsonLd);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const jsonLd = useMemo(() => head.jsonLd, [jsonText]);

  useSeo({
    title: head.title,
    description: head.description,
    path,
    image: head.image,
    imageAlt: head.imageAlt,
    jsonLd,
    robots: head.robots,
  });
}
