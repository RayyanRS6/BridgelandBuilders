/**
 * Cost guide registry (plan §8). One module per guide in this folder, each
 * with a default export in the shape below. Nothing else needs registering:
 * drop a file in, set `status: 'live'` when it is signed off, and the routes,
 * head and sitemap pick it up from here.
 *
 * FILE NAME → ROUTE (the route is known without loading the file)
 *   renovation-cost-winnipeg.js   → /renovation-cost-winnipeg          (the hub)
 *   <service-slug>.js             → /services/<service-slug>/cost       (a spoke)
 *   e.g. kitchen-renovations.js   → /services/kitchen-renovations/cost
 * The module's own `path` must match; a mismatch is reported in dev and the
 * page renders as not found.
 *
 * GUIDE SHAPE (default export)
 *   {
 *     id: 'kitchen-renovations',
 *     path: '/services/kitchen-renovations/cost',
 *     serviceSlug: 'kitchen-renovations' | null,     // services.js slug; null for the hub
 *     status: 'live' | 'draft',                       // only 'live' renders / is prerendered
 *     seo: {                                          // passed to usePageSeo as `meta`
 *       title, description, updated: 'YYYY-MM-DD', primaryKeyword,
 *       published?: 'YYYY-MM-DD', headline?,          // Article node (seo.js)
 *     },
 *     eyebrow: 'Kitchen Renovation Cost',
 *     h1: { title: 'KITCHEN RENOVATION COST', highlight: 'IN WINNIPEG' },
 *     intro?: 'one-line hero description (defaults to seo.description)',
 *     answer: '40–60 words, the number in sentence one (inline markdown allowed)',
 *     dataBasis: { source, period, note },            // methodology box (owner data only, plan §8)
 *     tables: [{ caption, head: [], rows: [[]], note }],   // rendered as RichBody table blocks
 *     driversTitle?, driversTag?, driversDesc?,
 *     drivers: [{ title, text }],
 *     sections: [{ h2, blocks: [RichBody blocks] }],  // ≤2 budget H2s + PAA H2s
 *     faqs: [{ q, a }],                               // FAQPage comes only from these
 *     sources: [{ label, url, accessed: 'YYYY-MM-DD' }],
 *     estimatorKey: 'kitchen',                        // key of ESTIMATOR_URLS (estimators.js)
 *     estimatorTitle?, estimatorDesc?,
 *     related: ['/services/kitchen-renovations', ...],
 *     ownerSignoff?: { name, role, date },            // `signoff` is accepted too
 *   }
 * Prices come only from Bridgeland's own estimator ranges / contracts — never
 * competitor or third-party numbers. Title year = the data period.
 *
 * EXPORTS
 *   COST_GUIDES          every guide (any status), hub first. Filled under Vite
 *                        (client, SSR build) and in plain Node (build scripts).
 *                        Importing it into a client component bundles every
 *                        guide into that component's chunk — prefer the
 *                        loaders / route helpers below on the client.
 *   COST_GUIDE_LOADERS   { [routePath]: () => Promise<guide> }, one lazy chunk
 *                        per guide on the client (used by CostGuidePage).
 *   COST_GUIDE_ROUTES    every guide route (from the file names; any status).
 *   loadCostGuides()     async; every guide, in any environment.
 *   costGuideSeoOptions(guide)  the usePageSeo options (page and head.js).
 */

export const COST_HUB_ID = 'renovation-cost-winnipeg';
export const COST_HUB_PATH = `/${COST_HUB_ID}`;

const FILE_NAME = /(?:^|\/)([a-z0-9-]+)\.js$/;

/** './kitchen-renovations.js' → '/services/kitchen-renovations/cost'. */
export function costGuidePathForFile(file) {
  const match = FILE_NAME.exec(file);
  if (!match || match[1] === 'index') return null;
  return match[1] === COST_HUB_ID ? COST_HUB_PATH : `/services/${match[1]}/cost`;
}

/** Strips a trailing slash so '/x/' and '/x' find the same guide. */
export function normaliseCostPath(path) {
  if (!path) return path;
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

// ---------------------------------------------------------------------------
// Module discovery. Vite (dev, client build and SSR build) replaces
// import.meta.glob at build time. Plain Node (scripts/*.mjs importing data
// files directly) has no import.meta.glob — and no import.meta.env, which is
// how the two are told apart — so there the folder is read from disk instead.
// The calls are marked pure so that, in a client chunk that never reads
// COST_GUIDES, the eager imports are dropped and every guide stays in its own
// lazily loaded chunk.
// ---------------------------------------------------------------------------

function nodeBuiltin(name) {
  const proc = typeof process !== 'undefined' ? process : undefined;
  return proc && typeof proc.getBuiltinModule === 'function' ? proc.getBuiltinModule(name) : undefined;
}

/** Guide file names in this folder (plain Node only). */
function nodeGuideFiles() {
  const fs = nodeBuiltin('node:fs');
  const url = nodeBuiltin('node:url');
  const path = nodeBuiltin('node:path');
  if (!fs || !url || !path) return null;
  const dir = path.dirname(url.fileURLToPath(import.meta.url));
  return {
    dir,
    files: fs
      .readdirSync(dir)
      .filter((name) => name.endsWith('.js') && name !== 'index.js')
      .sort(),
    toUrl: (name) => url.pathToFileURL(path.join(dir, name)).href,
  };
}

/** Plain Node, synchronous: require() of ES modules (Node 20.19+ / 22.12+). */
function nodeEagerModules() {
  try {
    const found = nodeGuideFiles();
    const moduleApi = nodeBuiltin('node:module');
    if (!found || !moduleApi) return {};
    const load = moduleApi.createRequire(import.meta.url);
    const modules = {};
    found.files.forEach((name) => {
      modules[`./${name}`] = load(`${found.dir}/${name}`);
    });
    return modules;
  } catch (error) {
    if (typeof console !== 'undefined') {
      console.warn(`[costGuides] could not load guides synchronously (${error && error.message}); use loadCostGuides()`);
    }
    return {};
  }
}

/** Plain Node, lazy: dynamic import() of each file. */
function nodeLazyModules() {
  const found = nodeGuideFiles();
  if (!found) return {};
  const modules = {};
  found.files.forEach((name) => {
    const href = found.toUrl(name);
    modules[`./${name}`] = () => import(/* @vite-ignore */ href);
  });
  return modules;
}

function pick(viteModules, nodeFallback) {
  return viteModules || nodeFallback();
}

const EAGER_MODULES = /* @__PURE__ */ pick(
  import.meta.env ? import.meta.glob(['./*.js', '!./index.js'], { eager: true }) : null,
  nodeEagerModules
);

const LAZY_MODULES = /* @__PURE__ */ pick(
  import.meta.env ? import.meta.glob(['./*.js', '!./index.js']) : null,
  nodeLazyModules
);

/** The guide object from a module, checked against its file name. */
function guideFromModule(file, mod) {
  const guide = mod && (mod.default || mod);
  const expected = costGuidePathForFile(file);
  if (!guide || typeof guide !== 'object' || !expected) return null;
  if (guide.path !== expected) {
    if (typeof console !== 'undefined') {
      console.warn(`[costGuides] ${file}: path "${guide.path}" should be "${expected}" — guide ignored`);
    }
    return null;
  }
  return guide;
}

const hubFirst = (a, b) =>
  (a.path === COST_HUB_PATH ? -1 : b.path === COST_HUB_PATH ? 1 : 0) || a.path.localeCompare(b.path);

function collectGuides(modules) {
  return Object.keys(modules)
    .map((file) => guideFromModule(file, modules[file]))
    .filter(Boolean)
    .sort(hubFirst);
}

function collectLoaders(modules) {
  const loaders = {};
  Object.keys(modules).forEach((file) => {
    const path = costGuidePathForFile(file);
    if (!path) return;
    loaders[path] = () => Promise.resolve(modules[file]()).then((mod) => guideFromModule(file, mod));
  });
  return loaders;
}

/** Every guide, any status, hub first. */
export const COST_GUIDES = /* @__PURE__ */ collectGuides(EAGER_MODULES);

/** Route path → () => Promise<guide | null>. */
export const COST_GUIDE_LOADERS = /* @__PURE__ */ collectLoaders(LAZY_MODULES);

/** Every guide route, from the file names alone (any status). */
export const COST_GUIDE_ROUTES = /* @__PURE__ */ Object.keys(COST_GUIDE_LOADERS).sort();

/** Loads one guide by route; resolves to null when there is no such file. */
export function loadCostGuide(path) {
  const loader = COST_GUIDE_LOADERS[normaliseCostPath(path)];
  return loader ? loader() : Promise.resolve(null);
}

/** Every guide (any status), in any environment, hub first. */
export async function loadCostGuides() {
  const guides = await Promise.all(Object.values(COST_GUIDE_LOADERS).map((load) => load()));
  return guides.filter(Boolean).sort(hubFirst);
}

export const isLiveCostGuide = (guide) => Boolean(guide && guide.status === 'live');

/** A guide by route from COST_GUIDES (any status). */
export function costGuideByPath(path) {
  const wanted = normaliseCostPath(path);
  return COST_GUIDES.find((guide) => guide.path === wanted) || null;
}

/** Guides that may be linked, prerendered and listed in the sitemap. */
export function liveCostGuides() {
  return COST_GUIDES.filter(isLiveCostGuide);
}

/**
 * usePageSeo / resolvePageSeo options for a guide. CostGuidePage and the
 * prerender (head.js) must both use this, so the static and client JSON-LD
 * match. The breadcrumb trail is left to seo.js trailFor() (hub: Renovation
 * Costs; spoke: Services › <service> › Cost Guide), and seo.js adds the
 * guide's Article node from the path and `seo`.
 */
export function costGuideSeoOptions(guide) {
  return {
    meta: guide.seo,
    faqs: guide.faqs && guide.faqs.length ? guide.faqs : undefined,
  };
}
