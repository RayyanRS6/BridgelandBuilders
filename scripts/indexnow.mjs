/**
 * IndexNow ping after a production deploy (SEO plan §3.6): tells Bing, Yandex,
 * Seznam, Naver and the other IndexNow engines which URLs changed, so they
 * recrawl them within minutes instead of days. (Google does not use IndexNow.)
 *
 *   node scripts/indexnow.mjs                 compare HEAD with HEAD~1 and ping
 *   node scripts/indexnow.mjs --dry-run       print the URLs, send nothing
 *   node scripts/indexnow.mjs --base=<rev> --head=<rev>
 *   node scripts/indexnow.mjs --all           every sitemap URL (e.g. first run)
 *
 * Changed URLs = sitemap entries that are new or whose <lastmod> changed,
 * sitemap entries that were removed (so engines see the 404/redirect), and
 * redirect sources in vercel.json that are new or now point somewhere else.
 * Both files are read from git, so this needs a checkout with the two commits
 * (fetch-depth: 2 in .github/workflows/post-deploy.yml).
 *
 * The key is public/<key>.txt (a 32-character hex name whose content is the
 * same key), served at the site root; INDEXNOW_KEY overrides it. No secrets.
 * Only node built-ins are used, so CI needs no npm install.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const MAX_URLS = 10000;

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name, fallback) => (args.find((a) => a.startsWith(`--${name}=`)) || '').slice(name.length + 3) || fallback;
const DRY_RUN = flag('dry-run');
const ALL = flag('all');
const HEAD = option('head', 'HEAD');
const BASE = option('base', `${HEAD}~1`);

function gitShow(rev, path) {
  try {
    return execFileSync('git', ['show', `${rev}:${path}`], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 32 * 1024 * 1024 });
  } catch {
    return null;
  }
}

/** Map of <loc> -> <lastmod> ('' when absent). */
function sitemapEntries(xml) {
  const entries = new Map();
  for (const m of String(xml || '').matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = /<loc>\s*([^<\s]+)\s*<\/loc>/.exec(m[1]);
    if (!loc) continue;
    const lastmod = /<lastmod>\s*([^<\s]+)\s*<\/lastmod>/.exec(m[1]);
    entries.set(loc[1].replace(/&amp;/g, '&'), lastmod ? lastmod[1] : '');
  }
  return entries;
}

/** Map of literal redirect source -> destination from vercel.json text. */
function redirectEntries(json) {
  const map = new Map();
  try {
    for (const rule of JSON.parse(json || '{}').redirects || []) {
      if (typeof rule.source === 'string' && !/[:*()?+{}\\]/.test(rule.source)) map.set(rule.source, `${rule.destination}|${rule.permanent}`);
    }
  } catch {
    /* unreadable vercel.json: no redirect URLs */
  }
  return map;
}

function findKey() {
  if (process.env.INDEXNOW_KEY && /^[A-Za-z0-9-]{8,128}$/.test(process.env.INDEXNOW_KEY)) return process.env.INDEXNOW_KEY;
  for (const file of readdirSync(join(ROOT, 'public'))) {
    const m = /^([0-9a-f]{32})\.txt$/.exec(file);
    if (m && readFileSync(join(ROOT, 'public', file), 'utf8').trim() === m[1]) return m[1];
  }
  return null;
}

async function siteUrl(fallbackFrom) {
  try {
    const { SITE_URL } = await import(pathToFileURL(join(ROOT, 'src', 'data', 'siteConfig.js')).href);
    if (SITE_URL) return SITE_URL.replace(/\/+$/, '');
  } catch {
    /* fall back to the sitemap's own host */
  }
  const first = fallbackFrom.keys().next().value;
  return first ? new URL(first).origin : null;
}

const headSitemap = sitemapEntries(gitShow(HEAD, 'public/sitemap.xml') ?? readFileSync(join(ROOT, 'public', 'sitemap.xml'), 'utf8'));
const baseSitemapXml = ALL ? null : gitShow(BASE, 'public/sitemap.xml');
const baseSitemap = sitemapEntries(baseSitemapXml);
const SITE = await siteUrl(headSitemap);
if (!SITE) {
  console.error('[indexnow] no site URL (siteConfig.js or sitemap) — nothing sent');
  process.exit(1);
}
const host = new URL(SITE).host;

const urls = new Set();
for (const [loc, lastmod] of headSitemap) {
  if (ALL || baseSitemapXml === null || baseSitemap.get(loc) !== lastmod) urls.add(loc);
}
if (!ALL) {
  for (const loc of baseSitemap.keys()) if (!headSitemap.has(loc)) urls.add(loc);
  const headRedirects = redirectEntries(gitShow(HEAD, 'vercel.json'));
  const baseRedirects = redirectEntries(gitShow(BASE, 'vercel.json'));
  for (const [source, target] of headRedirects) {
    if (baseRedirects.get(source) !== target) urls.add(`${SITE}${source}`);
  }
}

const list = [...urls].filter((url) => {
  try {
    return new URL(url).host === host;
  } catch {
    return false;
  }
}).slice(0, MAX_URLS);

console.log(`[indexnow] ${ALL ? 'all sitemap URLs' : `${BASE}..${HEAD}`}: ${list.length} changed URL(s) on ${host}`);
for (const url of list.slice(0, 50)) console.log(`  ${url}`);
if (list.length > 50) console.log(`  … and ${list.length - 50} more`);

if (!list.length) process.exit(0);
const key = findKey();
if (!key) {
  console.error('[indexnow] no key file (public/<32 hex>.txt containing its own name) and no INDEXNOW_KEY — nothing sent');
  process.exit(1);
}
if (DRY_RUN) {
  console.log(`[indexnow] dry run — would POST ${list.length} URL(s) to ${ENDPOINT} with key ${key.slice(0, 6)}…`);
  process.exit(0);
}

const response = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation: `${SITE}/${key}.txt`, urlList: list }),
  signal: AbortSignal.timeout(30000),
}).catch((error) => ({ ok: false, status: 0, statusText: error.message, text: async () => '' }));

if (response.ok) {
  console.log(`[indexnow] accepted (${response.status})`);
} else {
  const body = await response.text().catch(() => '');
  console.error(`[indexnow] ${response.status} ${response.statusText} ${body.slice(0, 300)}`);
  // 429 (too many requests) is not worth failing a deploy check over.
  process.exit(response.status === 429 ? 0 : 1);
}
