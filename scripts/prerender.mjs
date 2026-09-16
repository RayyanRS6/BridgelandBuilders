/**
 * Renders every route to static HTML using React's server renderer, so the
 * deployed site ships real content and complete <head> tags instead of an empty
 * app shell. No browser or Chromium download involved, which means this runs
 * identically on Vercel, Netlify, GitHub Actions or a laptop.
 *
 * Expects two builds to have run already:
 *   vite build                                  -> dist/         (client)
 *   vite build --ssr src/entry-server.jsx       -> dist-ssr/     (server)
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const DIST = join(ROOT, 'dist');
const SSR_ENTRY = join(ROOT, 'dist-ssr', 'entry-server.js');

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

const meta = (attr, key, content) =>
  content ? `  <meta ${attr}="${key}" content="${escapeAttr(content)}" />\n` : '';

/** Builds the per-route <head> block that replaces the template's defaults. */
function headHtml(head) {
  const canonical = head.path ? `${SITE_URL}${head.path}` : undefined;
  const image = head.image;
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
  html += meta('property', 'og:image:alt', image ? head.title : undefined);
  html += meta('property', 'article:published_time', head.publishedTime);
  html += meta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
  html += meta('name', 'twitter:title', head.title);
  html += meta('name', 'twitter:description', head.description);
  html += meta('name', 'twitter:image', image);
  if (head.jsonLd) {
    html += `  <script type="application/ld+json" data-seo="page">${JSON.stringify(head.jsonLd)}</script>\n`;
  }
  return html;
}

function pageHtml(head, appHtml) {
  return template
    .replace(/<!-- seo:head:start -->[\s\S]*?<!-- seo:head:end -->/, `<!-- seo:head:start -->\n${headHtml(head)}  <!-- seo:head:end -->`)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
}

let written = 0;
for (const route of routes) {
  const head = headFor(route);
  if (!head) {
    console.warn(`[prerender] no head model for ${route} — skipped`);
    continue;
  }
  const appHtml = await render(route);
  const outPath = route === '/' ? join(DIST, 'index.html') : join(DIST, route, 'index.html');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, pageHtml(head, appHtml));
  written += 1;
}

// A URL that matches no route renders the 404 page; hosts serve this file with
// a real 404 status.
const notFoundHtml = await render('/__not-found__');
writeFileSync(join(DIST, '404.html'), pageHtml(NOT_FOUND_HEAD, notFoundHtml));

console.log(`prerendered ${written} routes + 404.html`);
