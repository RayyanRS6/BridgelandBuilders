import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const routes = JSON.parse(readFileSync(new URL('../prerender-routes.json', import.meta.url)));

const grab = (html, re) => { const m = html.match(re); return m ? m[1] : null; };
const problems = [];
const typeCount = {};

for (const route of routes) {
  const file = route === '/' ? join(DIST, 'index.html') : join(DIST, route, 'index.html');
  if (!existsSync(file)) { problems.push(`${route}: MISSING html`); continue; }
  const html = readFileSync(file, 'utf8');

  const title = grab(html, /<title>([^<]*)<\/title>/);
  const desc = grab(html, /<meta name="description" content="([^"]*)"/);
  const canon = grab(html, /<link rel="canonical" href="([^"]*)"/);
  const ogt = grab(html, /<meta property="og:title" content="([^"]*)"/);
  const ogi = grab(html, /<meta property="og:image" content="([^"]*)"/);

  if (!title) problems.push(`${route}: no title`);
  else if (title.length > 70) problems.push(`${route}: title ${title.length} chars — "${title}"`);
  if (!desc) problems.push(`${route}: no meta description`);
  else if (desc.length < 70 || desc.length > 165) problems.push(`${route}: description ${desc.length} chars`);
  if (!canon) problems.push(`${route}: no canonical`);
  else if (!canon.endsWith(route) && !(route === '/' && canon.endsWith('/'))) problems.push(`${route}: canonical mismatch -> ${canon}`);
  if (!ogt) problems.push(`${route}: no og:title`);
  if (!ogi) problems.push(`${route}: no og:image`);

  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  if (!blocks.length) problems.push(`${route}: no JSON-LD`);
  for (const [, raw] of blocks) {
    let data;
    try { data = JSON.parse(raw); } catch (e) { problems.push(`${route}: JSON-LD parse error — ${e.message}`); continue; }
    for (const node of data['@graph'] || [data]) {
      const t = Array.isArray(node['@type']) ? node['@type'][0] : node['@type'];
      typeCount[t] = (typeCount[t] || 0) + 1;
    }
  }
  const h1s = [...html.matchAll(/<h1[\s>]/g)].length;
  if (h1s !== 1) problems.push(`${route}: ${h1s} h1 tags`);

  const pageLd = [...html.matchAll(/data-seo="page"/g)].length;
  if (pageLd !== 1) problems.push(`${route}: ${pageLd} page-level JSON-LD blocks (expected 1)`);
}

// static artefacts
for (const f of ['robots.txt', 'sitemap.xml', 'llms.txt', 'llms-full.txt', '_headers', '_redirects', '404.html', 'favicon.svg']) {
  if (!existsSync(join(DIST, f))) problems.push(`dist/${f} MISSING`);
}
const notFound = readFileSync(join(DIST, '404.html'), 'utf8');
if (!/noindex/.test(notFound)) problems.push('404.html is not noindex');

console.log(`routes audited: ${routes.length}`);
console.log('schema types across site:', Object.entries(typeCount).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k}×${v}`).join(', '));
console.log(problems.length ? `\nISSUES (${problems.length}):\n` + problems.join('\n') : '\nNo issues found.');
