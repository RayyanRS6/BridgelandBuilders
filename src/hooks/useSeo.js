import { useEffect, useMemo } from 'react';
import { SITE_LOCALE, SITE_NAME, SITE_URL } from '../data/siteConfig.js';
import {
  ROUTE_PAGE_TYPES,
  ROUTE_TRAILS,
  buildBreadcrumbs,
  buildFaqPage,
  buildService,
  buildWebPage,
  graph,
  seoFor,
} from '../data/seo.js';

const MANAGED = 'data-seo';

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
  if (!href) return;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    el.setAttribute(MANAGED, '');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Keeps title, description, canonical, Open Graph/Twitter tags and JSON-LD in
 * sync with the current page. Purely head-level: it never touches the DOM the
 * user sees.
 */
export default function useSeo({ title, description, path, image, jsonLd, type, publishedTime, robots }) {
  useEffect(() => {
    if (title) document.title = title;
    const canonical = path ? `${SITE_URL}${path}` : undefined;
    const absoluteImage = image && image.startsWith('http') ? image : image ? `${SITE_URL}${image}` : undefined;

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
    upsertMeta('property', 'og:image:alt', absoluteImage ? title : undefined);
    upsertMeta('property', 'article:published_time', publishedTime);

    upsertMeta('name', 'twitter:card', absoluteImage ? 'summary_large_image' : 'summary');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', absoluteImage);
  }, [title, description, path, image, type, publishedTime, robots]);

  useEffect(() => {
    if (!jsonLd) return undefined;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute(MANAGED, 'page');
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [jsonLd]);
}

/**
 * One-line SEO for a standard page: pulls the title/description for the route
 * and emits WebPage + BreadcrumbList, plus any extra schema nodes supplied.
 *
 * @param {string} path        route path, e.g. '/about-us'
 * @param {object} [options]
 * @param {Array}  [options.trail]  breadcrumb trail as [name, path] pairs
 * @param {Array}  [options.faqs]   [{ q, a }] to emit as FAQPage
 * @param {string} [options.serviceType] emit Service schema for this page
 * @param {string} [options.pageType]    WebPage subtype (e.g. 'CollectionPage')
 */
export function usePageSeo(path, options = {}) {
  const { faqs, image } = options;
  const trail = options.trail || ROUTE_TRAILS[path] || [];
  const pageType = options.pageType || ROUTE_PAGE_TYPES[path];
  const meta0 = seoFor(path);
  const serviceType = options.serviceType || meta0.serviceType;
  const meta = seoFor(path);

  const jsonLd = useMemo(() => {
    return graph(
      buildWebPage({ path, title: meta.title, description: meta.description, type: pageType }),
      buildBreadcrumbs(trail),
      serviceType ? buildService({ path, serviceType, description: meta.description }) : null,
      buildFaqPage(path, faqs)
    );
  }, [path, meta.title, meta.description, pageType, serviceType, trail, faqs]);

  useSeo({
    title: meta.title,
    description: meta.description,
    path,
    image: image || meta.image,
    jsonLd,
  });
}
