import { SITE_LOCALE, SITE_NAME, SITE_URL } from '../data/siteConfig.js';
import { imageMeta, resolvePageSeo } from '../data/seo.js';

/*
 * Writes a page's <head> tags in the browser. Loaded by useSeo.js only when a
 * head has to change (a client-side navigation), together with the seo.js
 * builders it uses, so neither is part of a page's first load: a prerendered
 * page already has its complete head (scripts/prerender.mjs).
 */

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
 * Keeps the one page-level JSON-LD block in sync. Navigations overwrite the
 * prerendered block in place: it is never appended a second time and never
 * removed on unmount (the next page's head replaces it), only when a page has
 * no JSON-LD at all.
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
 * Title, description, canonical, Open Graph/Twitter tags, then the JSON-LD,
 * with the values the prerender writes. Purely head-level: it never touches
 * the DOM the user sees.
 */
export function writeHead({ title, description, path, image, imageAlt, jsonLd, type, publishedTime, modifiedTime, robots }) {
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

  syncJsonLd(jsonLd);
}

/**
 * usePageSeo's head for a route: seo.js resolvePageSeo(path, options), the
 * same call head.js makes for the prerender.
 */
export function pageHead(path, options) {
  const head = resolvePageSeo(path, options);
  return {
    title: head.title,
    description: head.description,
    path,
    image: head.image,
    imageAlt: head.imageAlt,
    jsonLd: head.jsonLd,
    robots: head.robots,
  };
}
