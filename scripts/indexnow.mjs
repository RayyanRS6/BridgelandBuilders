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
 * Changed URLs = sitemap entries that are new or whose <lastmod> date changed,
 * sitemap entries whose visible text changed on a day they had already been
 * updated (their content hash in scripts/seo-content-hashes.json moved while
 * the lastmod date stayed the same: a second edit on the same day), sitemap
 * entries that were removed (so engines see the 404/redirect), and redirect
 * sources in vercel.json that are new or now point somewhere else (on-site
 * destinations only: off-site short links such as /review are not sent).
 * lastmod is compared by its date (YYYY-MM-DD): the sitemap switched from bare
 * dates to date-times on 2026-10-23 with the same dates, and that format
 * change alone is not a change to a page.
 * The files are read from git, so this needs a checkout with both commits.
 * .github/workflows/post-deploy.yml passes the commit of the previous
 * successful production deployment as --base (fetched for this), else HEAD~1
 * (fetch-depth: 2). A base that cannot be read counts as no base sitemap:
 * every sitemap URL is sent.
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

/**
 * Map of <loc> -> the date of its <lastmod> ('' when absent): "2026-10-23"
 * from either "2026-10-23" or "2026-10-23T00:00:00-05:00". Any other value is
 * kept as written.
 */
function sitemapEntries(xml) {
  const entries = new Map();
  for (const m of String(xml || '').matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = /<loc>\s*([^<\s]+)\s*<\/loc>/.exec(m[1]);
    if (!loc) continue;
    const lastmod = /<lastmod>\s*([^<\s]+)\s*<\/lastmod>/.exec(m[1]);
    const value = lastmod ? lastmod[1] : '';
    const date = /^\d{4}-\d{2}-\d{2}(?=$|T)/.exec(value);
    entries.set(loc[1].replace(/&amp;/g, '&'), date ? date[0] : value);
  }
  return entries;
}

/**
 * Map of literal redirect source -> destination from vercel.json text. Rules
 * whose destination is off-site (the /review short links to Google) are
 * skipped: those URLs never lead to a page of this site.
 */
function redirectEntries(json, siteHosts) {
  const map = new Map();
  const [first] = siteHosts;
  const onSite = (destination) => {
    try {
      return siteHosts.has(new URL(String(destination), `https://${first}`).host);
    } catch {
      return false;
    }
  };
  try {
    for (const rule of JSON.parse(json || '{}').redirects || []) {
      if (typeof rule.source === 'string' && !/[:*()?+{}\\]/.test(rule.source) && onSite(rule.destination)) {
        map.set(rule.source, `${rule.destination}|${rule.permanent}`);
      }
    }
  } catch {
    /* unreadable vercel.json: no redirect URLs */
  }
  return map;
}

/**
 * Map of route -> content hash from scripts/seo-content-hashes.json text (the
 * SEO audit records a hash of each indexable page's visible <main> text there,
 * with --update-hashes). Unreadable or absent: an empty map.
 */
function contentHashes(json) {
  const map = new Map();
  try {
    for (const [route, entry] of Object.entries(JSON.parse(json || '{}') || {})) {
      if (route.startsWith('/') && entry && typeof entry.hash === 'string') map.set(route, entry.hash);
    }
  } catch {
    /* unreadable hash file: no hash changes */
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

let siteConfig = {};
try {
  siteConfig = await import(pathToFileURL(join(ROOT, 'src', 'data', 'siteConfig.js')).href);
} catch {
  /* fall back to the sitemap's own host */
}

function siteUrl(fallbackFrom) {
  if (siteConfig.SITE_URL) return siteConfig.SITE_URL.replace(/\/+$/, '');
  const first = fallbackFrom.keys().next().value;
  return first ? new URL(first).origin : null;
}

const headSitemap = sitemapEntries(gitShow(HEAD, 'public/sitemap.xml') ?? readFileSync(join(ROOT, 'public', 'sitemap.xml'), 'utf8'));
const baseSitemapXml = ALL ? null : gitShow(BASE, 'public/sitemap.xml');
const baseSitemap = sitemapEntries(baseSitemapXml);
const SITE = siteUrl(headSitemap);
if (!SITE) {
  console.error('[indexnow] no site URL (siteConfig.js or sitemap) — nothing sent');
  process.exit(1);
}
const host = new URL(SITE).host;
// Redirect destinations on these hosts lead to a page of this site
// (sync-redirects writes legacy destinations on the canonical apex).
const SITE_HOSTS = new Set([host]);
if (siteConfig.CANONICAL_SITE_URL) SITE_HOSTS.add(new URL(siteConfig.CANONICAL_SITE_URL).host);

const urls = new Set();
for (const [loc, lastmod] of headSitemap) {
  if (ALL || baseSitemapXml === null || baseSitemap.get(loc) !== lastmod) urls.add(loc);
}
if (!ALL) {
  for (const loc of baseSitemap.keys()) if (!headSitemap.has(loc)) urls.add(loc);
  // Same-day text changes: the lastmod date can't move again, the hash does.
  // Only routes still in the sitemap (indexable) are sent.
  const baseHashes = contentHashes(gitShow(BASE, 'scripts/seo-content-hashes.json'));
  if (baseHashes.size) {
    const headHashes = contentHashes(gitShow(HEAD, 'scripts/seo-content-hashes.json'));
    for (const [route, hash] of headHashes) {
      const loc = `${SITE}${route}`;
      if (headSitemap.has(loc) && baseHashes.get(route) !== hash) urls.add(loc);
    }
  }
  const headRedirects = redirectEntries(gitShow(HEAD, 'vercel.json'), SITE_HOSTS);
  const baseRedirects = redirectEntries(gitShow(BASE, 'vercel.json'), SITE_HOSTS);
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
