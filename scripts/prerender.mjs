/**
 * Renders every route to static HTML using React's server renderer, so the
 * deployed site ships real content and complete <head> tags instead of an empty
 * app shell. No browser or Chromium download involved, which means this runs
 * identically on Vercel, Netlify, GitHub Actions or a laptop.
 *
 * Expects two builds to have run already:
 *   vite build                                  -> dist/         (client)
 *   vite build --ssr src/entry-server.jsx       -> dist-ssr/     (server)
 *
 * Per page it also adds (plan §4 "Preloads"):
 *   - <link rel="modulepreload"> for the route's page chunk and the chunks it
 *     imports (plus a per-page content chunk such as src/data/services/<slug>.js),
 *     so hydration doesn't wait on a second round trip. Routes are mapped to
 *     page files by reading src/AppShell.jsx (its lazy() imports and <Route>s)
 *     and the client build's manifest (dist/.vite/manifest.json, which is then
 *     moved to dist-ssr/client-manifest.json so it is never served);
 *   - <link rel="preload" as="image"> for the page's LCP image: the first
 *     <img fetchpriority="high"> (or its <picture>'s first <source>).
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const DIST = join(ROOT, 'dist');
const SSR_ENTRY = join(ROOT, 'dist-ssr', 'entry-server.js');
const MANIFEST_IN_DIST = join(DIST, '.vite', 'manifest.json');
const MANIFEST_KEPT = join(ROOT, 'dist-ssr', 'client-manifest.json');
const APP_SHELL = join(ROOT, 'src', 'AppShell.jsx');

if (!existsSync(SSR_ENTRY)) {
  console.error('[prerender] missing dist-ssr/entry-server.js — run the SSR build first.');
  process.exit(1);
}

const { render } = await import(pathToFileURL(SSR_ENTRY).href);
const { headFor, NOT_FOUND_HEAD } = await import(pathToFileURL(join(ROOT, 'src/data/head.js')).href);

const routes = JSON.parse(readFileSync(join(ROOT, 'prerender-routes.json'), 'utf8'));
const template = readFileSync(join(DIST, 'index.html'), 'utf8');
const SITE_URL = (await import(pathToFileURL(join(ROOT, 'src/data/siteConfig.js')).href)).SITE_URL;

const escapeAttr = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// data-seo marks the tag as managed by useSeo.js, so a client-side move to a
// page that does not set it (e.g. a post's article:published_time on the way
// to /services) removes it instead of leaving it stale.
const meta = (attr, key, content) =>
  content ? `  <meta ${attr}="${key}" content="${escapeAttr(content)}" data-seo="" />\n` : '';

// og:image width/height/type: the same helper useSeo.js uses on the client,
// so a page's prerendered tags and its in-browser tags always agree.
const { imageMeta } = await import(pathToFileURL(join(ROOT, 'src/data/seo.js')).href);
const imageInfo = (head, image) =>
  imageMeta(image, { width: head.imageWidth, height: head.imageHeight, type: head.imageType });

/** Builds the per-route <head> block that replaces the template's defaults. */
function headHtml(head) {
  const canonical = head.path ? `${SITE_URL}${head.path}` : undefined;
  const image = head.image && !/^https?:\/\//.test(head.image) ? `${SITE_URL}${head.image}` : head.image;
  const imageAlt = image ? head.imageAlt || head.title : undefined;
  const info = imageInfo(head, image);
  const robots = head.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  let html = `  <title>${escapeAttr(head.title)}</title>\n`;
  html += meta('name', 'description', head.description);
  html += meta('name', 'robots', robots);
  if (canonical) html += `  <link rel="canonical" href="${escapeAttr(canonical)}" />\n`;
  html += meta('property', 'og:type', head.type || 'website');
  html += meta('property', 'og:site_name', 'Bridgeland Builders');
  html += meta('property', 'og:locale', 'en_CA');
  html += meta('property', 'og:title', head.title);
  html += meta('property', 'og:description', head.description);
  html += meta('property', 'og:url', canonical);
  html += meta('property', 'og:image', image);
  html += meta('property', 'og:image:type', info.type);
  html += meta('property', 'og:image:width', info.width);
  html += meta('property', 'og:image:height', info.height);
  html += meta('property', 'og:image:alt', imageAlt);
  html += meta('property', 'article:published_time', head.publishedTime);
  html += meta('property', 'article:modified_time', head.modifiedTime);
  html += meta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
  html += meta('name', 'twitter:title', head.title);
  html += meta('name', 'twitter:description', head.description);
  html += meta('name', 'twitter:image', image);
  html += meta('name', 'twitter:image:alt', imageAlt);
  if (head.jsonLd) {
    html += `  <script type="application/ld+json" data-seo="page">${JSON.stringify(head.jsonLd)}</script>\n`;
  }
  return html;
}

/* ------------------------------------------------- client build manifest */

function loadClientManifest() {
  try {
    if (existsSync(MANIFEST_IN_DIST)) {
      mkdirSync(dirname(MANIFEST_KEPT), { recursive: true });
      copyFileSync(MANIFEST_IN_DIST, MANIFEST_KEPT);
    }
    // Never deploy the manifest (plan §3.4).
    rmSync(join(DIST, '.vite'), { recursive: true, force: true });
    if (!existsSync(MANIFEST_KEPT)) {
      console.warn('[prerender] no client manifest (build.manifest off?) — route modulepreloads skipped');
      return null;
    }
    const manifest = JSON.parse(readFileSync(MANIFEST_KEPT, 'utf8'));
    const entry = Object.values(manifest).find((chunk) => chunk.isEntry);
    if (!entry || !existsSync(join(DIST, entry.file)) || !template.includes(`/${entry.file}`)) {
      console.warn('[prerender] client manifest does not match dist/ (stale?) — route modulepreloads skipped');
      return null;
    }
    return manifest;
  } catch (error) {
    console.warn(`[prerender] could not read the client manifest (${error.message}) — route modulepreloads skipped`);
    return null;
  }
}

/* ------------------------------------------------ routes -> page modules */

const toSrcPath = (specifier) => posix.normalize(posix.join('src', specifier));

/**
 * Reads src/AppShell.jsx: which lazy component each <Route> renders, and the
 * page file behind it. Paths written as {IDENT} or inside {LIST.map((item) =>
 * <Route path={item.field} …/>)} are evaluated from the data modules AppShell
 * imports (e.g. COST_HUB_PATH, liveServices()). Anything it can't read is left
 * out, which only means that route gets no extra preloads.
 */
async function readRouteTable() {
  const source = readFileSync(APP_SHELL, 'utf8');
  const lazyFiles = new Map();
  for (const m of source.matchAll(/const\s+(\w+)\s*=\s*lazy\(\s*\(\)\s*=>\s*import\(\s*['"]([^'"]+)['"]\s*\)\s*\)/g)) {
    lazyFiles.set(m[1], toSrcPath(m[2]));
  }

  const imports = new Map(); // local name -> { file, exported }
  for (const m of source.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"](\.[^'"]+)['"]/g)) {
    for (const part of m[1].split(',')) {
      const [exported, local = exported] = part.trim().split(/\s+as\s+/).map((s) => s.trim());
      if (exported) imports.set(local, { file: toSrcPath(m[2]), exported });
    }
  }
  const consts = new Map(); // NAME -> { fn, call } for "const NAME = fn();" / "const NAME = OTHER;"
  for (const m of source.matchAll(/const\s+([A-Z_][A-Z0-9_]*)\s*=\s*(\w+)\s*(\(\s*\))?\s*;/g)) {
    consts.set(m[1], { ref: m[2], call: Boolean(m[3]) });
  }

  const evaluate = async (name, depth = 0) => {
    if (depth > 3) return undefined;
    if (imports.has(name)) {
      const { file, exported } = imports.get(name);
      if (!/\.(m?js)$/.test(file)) return undefined; // data modules only, never components
      const mod = await import(pathToFileURL(join(ROOT, file)).href);
      return mod[exported];
    }
    if (consts.has(name)) {
      const { ref, call } = consts.get(name);
      const value = await evaluate(ref, depth + 1);
      return call && typeof value === 'function' ? value() : value;
    }
    return undefined;
  };

  const table = [];
  const add = (path, component) => {
    if (typeof path === 'string' && (path.startsWith('/') || path === '*')) {
      table.push({ path, component, file: lazyFiles.get(component) || null });
    }
  };

  // {LIST.map((item) => (<Route … path={item.field} … element={<Comp
  for (const m of source.matchAll(/\{\s*(\w+)\.map\(\s*\(?\s*(\w+)\s*\)?\s*=>\s*\(?\s*<Route\b([\s\S]*?)element=\{<(\w+)/g)) {
    const [, list, item, attrs, component] = m;
    const field = new RegExp(`path=\\{\\s*${item}\\.(\\w+)\\s*\\}`).exec(attrs);
    if (!field) continue;
    try {
      const values = await evaluate(list);
      if (Array.isArray(values)) for (const value of values) add(value && value[field[1]], component);
    } catch (error) {
      console.warn(`[prerender] could not evaluate ${list} in AppShell.jsx (${error.message})`);
    }
  }

  for (const m of source.matchAll(/<Route\b((?:(?!<Route\b)[\s\S])*?)element=\{<(\w+)/g)) {
    const [, attrs, component] = m;
    const literal = /\bpath="([^"]+)"/.exec(attrs);
    if (literal) {
      add(literal[1], component);
      continue;
    }
    const ident = /\bpath=\{\s*(\w+)\s*\}/.exec(attrs);
    if (ident) {
      try {
        add(await evaluate(ident[1]), component);
      } catch (error) {
        console.warn(`[prerender] could not evaluate ${ident[1]} in AppShell.jsx (${error.message})`);
      }
    }
  }
  return table;
}

/** React Router-style ranking: static segments beat params, params beat "*". */
function matchRoute(table, url) {
  let best = null;
  for (const route of table) {
    let score = 0;
    let ok;
    if (route.path === '*') {
      ok = true;
    } else {
      const want = route.path.split('/').filter(Boolean);
      const have = url.split('/').filter(Boolean);
      ok = want.length === have.length && want.every((seg, i) => seg.startsWith(':') || seg === have[i]);
      score = want.reduce((sum, seg) => sum + (seg.startsWith(':') ? 2 : 10), 1);
    }
    if (ok && (!best || score > best.score)) best = { ...route, score };
  }
  return best;
}

/* --------------------------------------------------- per-page head tags */

const manifest = loadClientManifest();
const routeTable = manifest ? await readRouteTable().catch((error) => {
  console.warn(`[prerender] could not read src/AppShell.jsx routes (${error.message}) — route modulepreloads skipped`);
  return [];
}) : [];

// Chunks the entry already loads (Vite links them in index.html itself).
const entryKeys = new Set();
if (manifest) {
  const visit = (key) => {
    if (entryKeys.has(key) || !manifest[key]) return;
    entryKeys.add(key);
    for (const imp of manifest[key].imports || []) visit(imp);
  };
  for (const [key, chunk] of Object.entries(manifest)) if (chunk.isEntry) visit(key);
}

function chunkClosure(keys) {
  const files = [];
  const css = [];
  const seen = new Set();
  const visit = (key) => {
    if (seen.has(key) || entryKeys.has(key) || !manifest[key]) return;
    seen.add(key);
    const chunk = manifest[key];
    if (chunk.file && /\.m?js$/.test(chunk.file)) files.push(chunk.file);
    for (const file of chunk.css || []) css.push(file);
    for (const imp of chunk.imports || []) visit(imp);
  };
  keys.forEach(visit);
  return { files, css: [...new Set(css)] };
}

/**
 * Tags for a route's page chunk closure: { modules: modulepreload links,
 * styles: stylesheet links for any CSS those chunks would load lazily }.
 */
function routePreloads(url, appHtml = '') {
  const none = { modules: '', styles: '' };
  if (!manifest || !routeTable.length) return none;
  const route = matchRoute(routeTable, url);
  if (!route || !route.file || !manifest[route.file]) return none;
  const keys = [route.file];
  // The page's own content chunk, if the page (or a chunk it imports, e.g.
  // BlogCard.jsx for post bodies) loads one named after the URL's last
  // segment (src/data/services/<slug>.js, src/data/posts/<slug>.js, …).
  const last = url.split('/').filter(Boolean).pop();
  const pageChunks = new Set();
  const collect = (key) => {
    if (pageChunks.has(key) || entryKeys.has(key) || !manifest[key]) return;
    pageChunks.add(key);
    for (const imp of manifest[key].imports || []) collect(imp);
  };
  collect(route.file);
  // A service page with a "Related guides" section loads the blog index right
  // after its content chunk (ServiceRoute.jsx loadGuidePosts); preloading it
  // too saves hydration a round trip.
  const wanted = new Set([last]);
  if (/\bid="guides"/.test(appHtml)) wanted.add('blogIndex');
  for (const key of pageChunks) {
    for (const dyn of manifest[key].dynamicImports || []) {
      const name = posix.basename(dyn).replace(/\.[^.]+$/, '');
      if (name && wanted.has(name) && !keys.includes(dyn)) keys.push(dyn);
    }
  }
  const { files, css } = chunkClosure(keys);
  return {
    modules: files.map((file) => `  <link rel="modulepreload" crossorigin href="/${file}">\n`).join(''),
    styles: css
      .filter((file) => !template.includes(`/${file}`))
      .map((file) => `  <link rel="stylesheet" crossorigin href="/${file}">\n`)
      .join(''),
  };
}

const attrOf = (tag, name) => {
  const m = new RegExp(`\\s${name}="([^"]*)"`, 'i').exec(tag);
  return m ? m[1] : undefined;
};

/**
 * Preload for the first <img fetchpriority="high"> in the page. Attribute
 * values come from React's HTML (already escaped), so they are reused as is.
 */
function lcpImagePreload(appHtml) {
  const img = /<img\b[^>]*\bfetchpriority="high"[^>]*>/i.exec(appHtml);
  if (!img) return '';
  const before = appHtml.slice(0, img.index);
  const pictureStart = before.lastIndexOf('<picture');
  if (pictureStart !== -1 && before.lastIndexOf('</picture>') < pictureStart) {
    const source = /<source\b[^>]*>/i.exec(before.slice(pictureStart));
    const srcset = source && attrOf(source[0], 'srcset');
    if (srcset) {
      const type = attrOf(source[0], 'type');
      const sizes = attrOf(source[0], 'sizes') || attrOf(img[0], 'sizes');
      return `  <link rel="preload" as="image" imagesrcset="${srcset}"${sizes ? ` imagesizes="${sizes}"` : ''}${type ? ` type="${type}"` : ''} fetchpriority="high">\n`;
    }
  }
  const src = attrOf(img[0], 'src');
  if (!src) return '';
  const srcset = attrOf(img[0], 'srcset');
  const sizes = attrOf(img[0], 'sizes');
  return `  <link rel="preload" as="image" href="${src}"${srcset ? ` imagesrcset="${srcset}"` : ''}${srcset && sizes ? ` imagesizes="${sizes}"` : ''} fetchpriority="high">\n`;
}

// Where the extra tags go: the LCP image right after the SEO block (early, so
// it starts downloading first), route chunks right after the entry script,
// and any route stylesheet at the end of <head> (after the entry CSS, the same
// cascade order as when the chunk loads it at runtime).
const ENTRY_SCRIPT = /<script type="module" crossorigin src="[^"]+"><\/script>\r?\n?/;

// Replacer functions, not strings, so a "$$", "$&" or "$'" in the page content
// (prices, for example) is inserted as written instead of read as a pattern.
function pageHtml(head, appHtml, url) {
  const imagePreload = lcpImagePreload(appHtml);
  const { modules, styles } = routePreloads(url, appHtml);
  let html = template
    .replace(/<!-- seo:head:start -->[\s\S]*?<!-- seo:head:end -->/, () => `<!-- seo:head:start -->\n${headHtml(head)}  <!-- seo:head:end -->${imagePreload ? `\n${imagePreload.trimEnd()}` : ''}`)
    .replace('<div id="root"></div>', () => `<div id="root">${appHtml}</div>`);
  if (modules) {
    html = ENTRY_SCRIPT.test(html)
      ? html.replace(ENTRY_SCRIPT, (tag) => `${/\n$/.test(tag) ? tag : `${tag}\n`}${modules}`)
      : html.replace('</head>', () => `${modules}</head>`);
  }
  if (styles) html = html.replace('</head>', () => `${styles}</head>`);
  // The Unsplash preconnect (index.html) only helps pages that show an
  // Unsplash photo; elsewhere it opens a connection for nothing.
  if (!appHtml.includes('images.unsplash.com')) html = html.replace(UNSPLASH_PRECONNECT, '');
  return html;
}

const UNSPLASH_PRECONNECT = /[ \t]*<!-- Unsplash [\s\S]*?-->\r?\n[ \t]*<link rel="preconnect" href="https:\/\/images\.unsplash\.com">\r?\n/;
if (!UNSPLASH_PRECONNECT.test(template)) {
  console.warn('[prerender] Unsplash preconnect block not found in index.html; it is left on every page as written.');
}

let written = 0;
let withPreloads = 0;
for (const route of routes) {
  const head = headFor(route);
  if (!head) {
    console.warn(`[prerender] no head model for ${route} — skipped`);
    continue;
  }
  const appHtml = await render(route);
  const outPath = route === '/' ? join(DIST, 'index.html') : join(DIST, route, 'index.html');
  mkdirSync(dirname(outPath), { recursive: true });
  if (routePreloads(route).modules) withPreloads += 1;
  writeFileSync(outPath, pageHtml(head, appHtml, route));
  written += 1;
}

// A URL that matches no route renders the 404 page; hosts serve this file with
// a real 404 status.
const notFoundHtml = await render('/__not-found__');
writeFileSync(join(DIST, '404.html'), pageHtml(NOT_FOUND_HEAD, notFoundHtml, '/__not-found__'));

console.log(
  `prerendered ${written} routes + 404.html` +
    (manifest ? `; route chunk modulepreloads on ${withPreloads} (${routeTable.length} route patterns in AppShell.jsx)` : '')
);
