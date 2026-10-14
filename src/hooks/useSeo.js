import { useEffect, useRef } from 'react';
import { SITE_URL } from '../data/siteConfig.js';
import { isChunkLoadError, onInitialPage, reloadOnce, retryLoad } from '../lib/lazyRetry.js';

/*
 * A prerendered page already has its complete <head>: scripts/prerender.mjs
 * writes it with the same seo.js builders, via head.js. So nothing is written
 * while the visitor is still on that page, and the code that writes a head
 * (headWriter.js, with the seo.js builders and PAGE_SEO) is fetched the first
 * time a head has to change, i.e. on the first client-side navigation. None of
 * it is part of a page's first load. This module itself is small and used by
 * every page, so it ships in the entry chunk (AppShell imports
 * preloadHeadWriter) rather than as one more request per page.
 */
let writer = null;
let writerRequest = null;
function loadWriter() {
  if (!writerRequest) {
    writerRequest = retryLoad(() => import('./headWriter.js')).then(
      (module) => {
        writer = module;
        return module;
      },
      (error) => {
        writerRequest = null; // the next head change tries again
        throw error;
      }
    );
  }
  return writerRequest;
}

/**
 * Starts downloading headWriter.js. AppShell calls it as soon as a client-side
 * navigation begins, so it loads alongside the new page's own chunk instead of
 * after it. Idempotent (one request), so it is safe to call while rendering.
 */
export function preloadHeadWriter() {
  if (!writer) loadWriter().catch(() => {});
}

/**
 * Calls apply(writer) right away once headWriter.js is loaded, else when it
 * arrives, unless the returned cancel function ran first. If it can't be
 * downloaded (typically an open tab after a deploy replaced the chunk), the
 * page is reloaded once (reloadOnce), so the visitor never keeps reading
 * pages under the previous page's title and description.
 */
function withWriter(apply) {
  if (writer) {
    apply(writer);
    return undefined;
  }
  let cancelled = false;
  loadWriter().then(
    (module) => {
      if (!cancelled) apply(module);
    },
    (error) => {
      if (!cancelled && !onInitialPage() && isChunkLoadError(error)) reloadOnce();
    }
  );
  return () => {
    cancelled = true;
  };
}

/**
 * True while the document still has the <head> the prerender wrote for this
 * page: the visitor is on the first, server-rendered page (lib/lazyRetry.js)
 * and its canonical is this page's (the 404 page has neither path nor
 * canonical). A client route answered with the 404 file fails the check, so
 * its head is written as usual.
 */
function hasServerHead(path) {
  if (!onInitialPage()) return false;
  const canonical = document.head.querySelector('link[rel="canonical"]');
  if (!path) return !canonical;
  return Boolean(canonical) && canonical.getAttribute('href') === `${SITE_URL}${path}`;
}

/**
 * Writes the head that build(writer) returns whenever `deps` change, except
 * on the first run on the prerendered page, whose head is already this one:
 * hydration never rewrites the head.
 */
function useHeadSync(path, deps, build) {
  const firstRun = useRef(true);
  useEffect(() => {
    const first = firstRun.current;
    firstRun.current = false;
    if (first && hasServerHead(path)) return undefined;
    return withWriter((module) => module.writeHead(build(module)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Keeps title, description, canonical, Open Graph/Twitter tags and JSON-LD in
 * sync with the current page, from a ready-made head (a blog post's
 * buildPostHead, the 404 page). Purely head-level: it never touches the DOM
 * the user sees.
 */
export default function useSeo({ title, description, path, image, imageAlt, jsonLd, type, publishedTime, modifiedTime, robots }) {
  useHeadSync(
    path,
    [title, description, path, image, imageAlt, jsonLd, type, publishedTime, modifiedTime, robots],
    () => ({ title, description, path, image, imageAlt, jsonLd, type, publishedTime, modifiedTime, robots })
  );
}

/** Content key for an options object that is built anew on every render. */
function contentKey(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return value;
  }
}

/**
 * One-line SEO for a standard page: the title/description for the route and
 * the same JSON-LD document the prerender emits. Both sides call
 * seo.js resolvePageSeo(path, options), so they cannot drift:
 * WebPage (+ BreadcrumbList where the page shows a breadcrumb), plus
 * Service/FAQPage and any extra nodes supplied. In the browser the call is
 * made only when the head has to change (headWriter.js pageHead).
 *
 * Pages whose title/description live in a data module get their options from
 * a builder exported next to that data, and head.js (src/data/head.js) calls
 * the same builder for the prerender:
 *   service page  serviceSeo(content)             src/data/services.js
 *   cost guide    costGuideSeoOptions(guide)      src/data/costGuides/index.js
 *   area pages    serviceAreasSeoOptions() / serviceAreaSeoOptions(area)
 *   case study    caseStudySeoOptions(study)      src/data/caseStudies.js
 *   video         videoSeoOptions(video)          src/data/videos.js
 * Cost guide routes also get an Article node automatically (resolvePageSeo),
 * and /services the ItemList of live services.
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
 *                                  (default: trails.js trailFor(path, title))
 * @param {Array}  [options.faqs]   [{ q, a }] to emit as FAQPage
 * @param {string} [options.serviceType] emit Service schema for this page
 * @param {Array}  [options.areaServed]  Service areaServed override (area pages)
 * @param {string} [options.pageType]    WebPage subtype (e.g. 'CollectionPage')
 * @param {string} [options.image]       Open Graph image
 * @param {Array}  [options.nodes]       extra JSON-LD nodes (e.g. buildBlogNode)
 */
export function usePageSeo(path, options = {}) {
  // Options built inline (or by a helper) are new objects on every render;
  // the head is rebuilt only when their content changes.
  useHeadSync(path, [path, contentKey(options)], (module) => module.pageHead(path, options));
}
