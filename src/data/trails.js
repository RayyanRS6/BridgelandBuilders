import { SERVICES, serviceByPath, serviceBySlug } from './services.js';
import { COST_HUB_PATH, SERVICE_AREAS } from './siteConfig.js';

/**
 * Breadcrumb trails: the visible breadcrumb and the BreadcrumbList are built
 * from the same trail (plan §3.5). Kept apart from seo.js, which re-exports
 * them, so a page can render its breadcrumb without loading the head builders:
 * in the browser seo.js only loads on a client-side navigation
 * (src/hooks/useSeo.js).
 */

/** A service page's breadcrumb name: its registry `crumb`, else its label. */
const crumbName = (service) => service.crumb || service.label;

/**
 * A service page's breadcrumb trail from the registry: Services › (parent) ›
 * page, e.g. Services › Commercial Renovations › Office Renovations. The
 * visible breadcrumb on the page renders this same trail.
 */
export function serviceTrail(service) {
  if (!service) return [];
  const trail = [['Services', '/services']];
  const parent = service.parent ? serviceByPath(service.parent) : null;
  if (parent) trail.push([crumbName(parent), parent.path]);
  trail.push([crumbName(service), service.path]);
  return trail;
}

/**
 * Breadcrumb trail per route, as [label, path] pairs (Home is implicit). The
 * labels match the visible breadcrumbs. Service pages come from the registry
 * (src/data/services.js); template routes (cost guides, areas, case studies,
 * videos) are resolved by trailFor().
 *
 * The one-level pages (/services, /about-us, /faqs, /blog, …) show no visible
 * breadcrumb (PageHero renders none), so they have no trail and no
 * BreadcrumbList: visible trail = schema trail (plan §3.5). The cost hub and
 * the watch pages are one level deep too, but they do show theirs.
 */
export const ROUTE_TRAILS = {
  '/': [],
  ...Object.fromEntries(SERVICES.map((service) => [service.path, serviceTrail(service)])),
};

/** "Kitchen Renovation Cost Winnipeg | Bridgeland Builders" -> "Kitchen Renovation Cost Winnipeg". */
export const pageName = (title) => String(title || '').split(' | ')[0].trim();

/**
 * The default breadcrumb trail for any route: ROUTE_TRAILS, else the template
 * routes' pattern (cost hub and /services/<svc>/cost, /service-areas/<slug>,
 * /projects/<slug>, /videos/<slug>). `title` (the page's SEO title) names the
 * last crumb where no registry label exists. A page that renders a different
 * visible breadcrumb passes that trail to usePageSeo (and head.js passes the
 * same one, through the page's *SeoOptions builder).
 */
export function trailFor(path, title) {
  if (ROUTE_TRAILS[path]) return ROUTE_TRAILS[path];
  if (path === COST_HUB_PATH) return [['Renovation Costs', COST_HUB_PATH]];
  let match = /^\/services\/([^/]+)\/cost$/.exec(path);
  if (match) {
    const service = serviceBySlug(match[1]);
    return service ? [['Services', '/services'], [crumbName(service), service.path], ['Cost Guide', path]] : [];
  }
  match = /^\/service-areas\/([^/]+)$/.exec(path);
  if (match) {
    const area = SERVICE_AREAS.find((item) => item.slug === match[1]);
    return [['Service Areas', '/service-areas'], [area ? area.name : pageName(title), path]];
  }
  match = /^\/projects\/([^/]+)$/.exec(path);
  if (match) return [['Projects', '/projects'], [pageName(title), path]];
  match = /^\/videos\/([^/]+)$/.exec(path);
  if (match) return [[pageName(title), path]];
  return [];
}
