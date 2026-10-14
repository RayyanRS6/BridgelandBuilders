/**
 * BUILD-TIME aggregator for the service page content modules
 * (src/data/services/<slug>.js, one per entry in the registry
 * src/data/services.js). Node only — it uses top-level await to import every
 * module, so never import it from a component: the browser loads one service
 * module at a time (src/pages/services/ServiceRoute.jsx, import.meta.glob).
 *
 * Importing this file also registers each LIVE page's `seo` in seo.js
 * SERVICE_SEO, which build tooling (head.js, build-seo-files, sync-redirects,
 * the audit) reads for titles, descriptions, serviceType and `updated`.
 *
 * Kept for back-compat: PROJECTS (live pages' content, in registry order) and
 * getProject(projectSlug).
 */
import { SERVICES } from './services.js';
import { registerServiceSeo } from './seo.js';

const loaded = await Promise.all(
  SERVICES.map(async (service) => {
    let mod;
    try {
      mod = await import(`./services/${service.slug}.js`);
    } catch (error) {
      throw new Error(`src/data/services/${service.slug}.js: ${error.message} (every registry entry needs a content module)`);
    }
    const content = mod.default;
    if (!content || typeof content !== 'object') {
      throw new Error(`src/data/services/${service.slug}.js has no default export`);
    }
    if (service.status === 'live') {
      const seo = content.seo || {};
      const missing = ['title', 'description', 'serviceType', 'updated'].filter((key) => !seo[key]);
      if (missing.length) {
        throw new Error(`live service ${service.path}: seo.${missing.join(', seo.')} missing in src/data/services/${service.slug}.js`);
      }
      if (!Array.isArray(content.faqs)) {
        throw new Error(`live service ${service.path}: faqs must be an array`);
      }
    }
    return [service.slug, content];
  })
);

/** Every service page's content by registry slug (live and draft). */
export const SERVICE_CONTENT = Object.fromEntries(loaded);

/** Content module for a registry slug. */
export const contentFor = (slug) => SERVICE_CONTENT[slug];

/** Live service pages: [{ service, content }] in display order. */
export const LIVE_SERVICE_PAGES = SERVICES.filter((service) => service.status === 'live')
  .sort((a, b) => a.order - b.order)
  .map((service) => ({ service, content: SERVICE_CONTENT[service.slug] }));

for (const { service, content } of LIVE_SERVICE_PAGES) registerServiceSeo(service.path, content.seo);

/**
 * Live pages' content, each with its page path (back-compat with the old
 * PROJECTS list: build-seo-files reads FAQs from it).
 */
export const PROJECTS = LIVE_SERVICE_PAGES.map(({ service, content }) => ({ ...content, path: service.path }));

/** A page's content by its project slug (e.g. 'kitchen-renovation'), live or draft. */
export const getProject = (projectSlug) => {
  const service = SERVICES.find((item) => item.projectSlug === projectSlug);
  if (service) return SERVICE_CONTENT[service.slug];
  return Object.values(SERVICE_CONTENT).find((content) => content.slug === projectSlug);
};
