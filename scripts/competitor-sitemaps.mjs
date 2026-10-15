/**
 * Competitor sitemap topic gap (SEO plan §17 competitors, §18 quarterly
 * content-gap loop). Reads each competitor's public sitemaps, sorts their URLs
 * into renovation topics by URL path and sets every topic against our pages in
 * the keyword map (scripts/keyword-map.json): which topics competitors publish
 * pages on where we have no live page. Reporting only: never part of the build.
 *
 *   node scripts/competitor-sitemaps.mjs --dry-run            (no network)
 *   node scripts/competitor-sitemaps.mjs --out=competitor-topics.csv [options]
 *   npm run competitors:sitemaps -- --out=competitor-topics.csv
 *
 *   --out=<file>           topic CSV (default: stdout)
 *   --urls=<file>          also write every competitor URL with its topics (CSV)
 *   --config=<file>        competitor list (default scripts/competitors.json)
 *   --map=<file>           keyword map (default scripts/keyword-map.json)
 *   --only=<id|domain,…>   only these competitors
 *   --delay=<ms>           pause between requests (default and minimum 1000)
 *   --max-sitemaps=<n>     sitemap files per competitor (default 50)
 *   --max-urls=<n>         URLs kept per competitor (default 20000)
 *   --dry-run              print what would be fetched and our pages per topic
 *
 * Requests, one at a time with at least --delay between them, GET only, with a
 * user agent that names this site: per competitor, robots.txt (on the bare
 * domain, then www.), every "Sitemap:" file it lists (or /sitemap.xml,
 * /sitemap_index.xml and /wp-sitemap.xml when it lists none) and the child
 * sitemaps of any sitemap index, gzipped (.gz) ones included. Nothing outside
 * the competitor's own domain and no HTML page is ever requested.
 *
 * Topic CSV columns: topic, our live and planned keyword-map pages for it,
 * how many competitors have URLs on it, their URL total and one count column
 * per competitor, status (GAP = competitors have pages, we have no live one),
 * and up to three example URLs. "(no topic)" counts the URLs no topic matched.
 * Topics are matched on the URL path only, so the counts are a pointer for a
 * person to check, not a measure of content quality. Node built-ins only.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';
import { readKeywordMap } from './lib/audit/keywords.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));

const args = process.argv.slice(2);
// --name=value or --name value
function option(name, fallback) {
  const i = args.findIndex((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (i === -1) return fallback;
  return args[i].includes('=') ? args[i].slice(name.length + 3) : args[i + 1];
}
const DRY_RUN = args.includes('--dry-run');
const OUT = option('out');
const URLS_OUT = option('urls');
const CONFIG_FILE = resolve(process.cwd(), option('config', resolve(ROOT, 'scripts/competitors.json')));
const MAP_FILE = resolve(process.cwd(), option('map', resolve(ROOT, 'scripts/keyword-map.json')));
const ONLY = (option('only', '') || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
const DELAY_MS = Math.max(1000, Number(option('delay', '1000')) || 1000);
const MAX_SITEMAPS = Number(option('max-sitemaps', '50'));
const MAX_URLS = Number(option('max-urls', '20000'));
const TIMEOUT_MS = 30000;
const MAX_BYTES = 50 * 1024 * 1024; // per response, and per unzipped sitemap
const USER_AGENT = 'BridgelandBuilders-SitemapCheck/1.0 (+https://bridgelandbuilders.com; read-only sitemap fetch, 1 request per second)';
const FALLBACK_SITEMAPS = ['/sitemap.xml', '/sitemap_index.xml', '/wp-sitemap.xml'];

if (args.includes('--help') || !(MAX_SITEMAPS > 0) || !(MAX_URLS > 0)) {
  console.error('usage: node scripts/competitor-sitemaps.mjs [--dry-run] [--out=topics.csv] [--urls=urls.csv] [--only=id,…] [--config=scripts/competitors.json] [--map=scripts/keyword-map.json] [--delay=1000] [--max-sitemaps=50] [--max-urls=20000]');
  process.exit(2);
}

/* ------------------------------------------------------------------ topics */

// Matched against a URL path in lower case with every non-alphanumeric run
// turned into one space ("/services/basement-suites/" -> " services basement
// suites "), so \b marks the edges of words in the slug.
const TOPICS = [
  { topic: 'kitchen', match: /\bkitchens?\b|\bcabinet|\bcountertop/ },
  { topic: 'bathroom', match: /\bbath(room)?s?\b|\bensuites?\b|\bshowers?\b|\bwashrooms?\b|\bvanit(y|ies)\b/ },
  { topic: 'basement', match: /\bbasements?\b|\blower level\b/ },
  { topic: 'suite', match: /\bsuites?\b|\bsecondary units?\b|\bin law\b|\blaneway\b/, exclude: /\ben suites?\b/ },
  { topic: 'permit', match: /\bpermits?\b|\bzoning\b|\bby ?laws?\b|\bbuilding codes?\b/ },
  { topic: 'cost', match: /\bcosts?\b|\bprices?\b|\bpricing\b|\bbudgets?\b|\bhow much\b/ },
  { topic: 'office', match: /\boffices?\b|\bfit ?(ups?|outs?)\b|\btenant improvements?\b|\bworkplaces?\b/, exclude: /\bmedical\b|\bdental\b|\bclinics?\b/ },
  { topic: 'restaurant', match: /\brestaurants?\b|\bcaf(e|es)\b|\bhospitality\b|\bbrewer(y|ies)\b|\bfood service\b|\bcommercial kitchens?\b/ },
  { topic: 'retail', match: /\bretail\b|\bstores?\b|\bstorefronts?\b|\bshops?\b|\bboutiques?\b|\bshowrooms?\b/ },
  { topic: 'medical/dental', match: /\bmedical\b|\bdental\b|\bdentists?\b|\bclinics?\b|\bhealth ?care\b|\bphysio|\bchiropract|\bveterinar|\bpharmac(y|ies)\b|\boptometr/ },
  { topic: 'flooring', match: /\bfloor(ing|s)?\b|\bhardwood\b|\blaminate\b|\bvinyl plank\b|\blvp\b|\bcarpet/, exclude: /\bfloor ?plans?\b/ },
  { topic: 'windows/doors', match: /\bwindows?\b|\bdoors?\b/ },
  { topic: 'painting', match: /\bpaint(s|ing|ers?)?\b/ },
  { topic: 'masonry', match: /\bmasonry\b|\bstucco\b|\bbrick|\bstone ?work\b|\bparging\b|\brepointing\b|\btuck ?pointing\b/ },
  { topic: 'demolition', match: /\bdemo(lition)?\b/ },
  { topic: 'additions', match: /\badditions?\b|\bsunrooms?\b|\bhome extensions?\b|\bsecond stor(e)?y\b/ },
];
const NO_TOPIC = '(no topic)';

const slugText = (text) => ` ${String(text).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()} `;
const topicsOf = (text) => {
  const t = slugText(text);
  return TOPICS.filter(({ match, exclude }) => match.test(t) && !(exclude && exclude.test(t))).map(({ topic }) => topic);
};

/** Path of a URL, decoded where possible. */
function pathOf(url) {
  let path = '/';
  try {
    path = new URL(url).pathname;
  } catch {
    return '';
  }
  try {
    return decodeURI(path);
  } catch {
    return path;
  }
}

/* -------------------------------------------------------------- our pages */

const map = readKeywordMap(JSON.parse(readFileSync(MAP_FILE, 'utf8')));
// A page belongs to a topic when its path or a primary keyword names it.
const ourPages = new Map(TOPICS.map(({ topic }) => [topic, { live: [], planned: [] }]));
for (const page of map.pages) {
  const topics = new Set([page.path, ...page.primary].flatMap((text) => topicsOf(text)));
  for (const topic of topics) ourPages.get(topic)[page.status === 'live' ? 'live' : 'planned'].push(page.path);
}

/* ------------------------------------------------------------- competitors */

const config = JSON.parse(readFileSync(CONFIG_FILE, 'utf8'));
const competitors = (config.competitors || [])
  .map((c) => ({ id: String(c.id || c.domain), domain: String(c.domain || '').toLowerCase().replace(/^www\./, '') }))
  .filter((c) => c.domain && (!ONLY.length || ONLY.includes(c.id.toLowerCase()) || ONLY.includes(c.domain)));
if (!competitors.length) {
  console.error(`No competitors to check (${CONFIG_FILE}${ONLY.length ? `, --only=${ONLY.join(',')}` : ''}).`);
  process.exit(1);
}

if (DRY_RUN) {
  const lines = [];
  lines.push('Competitor sitemap check: dry run (no requests made)', '');
  lines.push(`Competitors (${competitors.length}, from ${CONFIG_FILE}):`);
  for (const c of competitors) {
    lines.push(`  ${c.id.padEnd(22)} https://${c.domain}/robots.txt (then https://www.${c.domain}/robots.txt if that fails)`);
  }
  lines.push(
    '',
    'Then, per competitor: every "Sitemap:" URL in robots.txt, or when it lists none',
    `  ${FALLBACK_SITEMAPS.join(', ')} on the robots.txt origin;`,
    '  the children of any sitemap index (gzip .gz files unzipped with node:zlib);',
    `  only URLs on the competitor's own domain, GET only, at most ${MAX_SITEMAPS} sitemap files and ${MAX_URLS} URLs each.`,
    `Pause between requests: ${DELAY_MS} ms. Timeout: ${TIMEOUT_MS / 1000} s. Size cap: ${MAX_BYTES / 1024 / 1024} MB per file.`,
    `User agent: ${USER_AGENT}`,
    '',
    `Topics and our keyword-map pages (${MAP_FILE}):`
  );
  for (const { topic } of TOPICS) {
    const { live, planned } = ourPages.get(topic);
    lines.push(`  ${topic.padEnd(15)} live ${String(live.length).padStart(2)}: ${live.join(', ') || '—'}${planned.length ? ` | planned: ${planned.join(', ')}` : ''}`);
  }
  lines.push('', `Would write the topic CSV to ${OUT || 'stdout'}${URLS_OUT ? ` and every URL to ${URLS_OUT}` : ''}.`);
  console.log(lines.join('\n'));
  process.exit(0);
}

/* ------------------------------------------------------------------ fetching */

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));
let lastRequestAt = 0;

/** One polite GET: waits for the delay, follows redirects, caps the size; unzips gzip bodies. */
async function get(url, allowed) {
  const wait = lastRequestAt + DELAY_MS - Date.now();
  if (wait > 0) await sleep(wait);
  lastRequestAt = Date.now();
  const res = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
    headers: { 'user-agent': USER_AGENT, accept: 'application/xml, text/xml, text/plain;q=0.9, */*;q=0.5' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!allowed(res.url || url)) {
    await res.body?.cancel();
    throw new Error(`redirected off the competitor's domain to ${res.url}`);
  }
  if (!res.ok) {
    await res.body?.cancel();
    throw new Error(`HTTP ${res.status}`);
  }
  const declared = Number(res.headers.get('content-length'));
  if (declared > MAX_BYTES) {
    await res.body?.cancel();
    throw new Error(`too large (${declared} bytes)`);
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of res.body) {
    size += chunk.length;
    if (size > MAX_BYTES) throw new Error(`too large (over ${MAX_BYTES} bytes)`);
    chunks.push(chunk);
  }
  let buf = Buffer.concat(chunks);
  // A .gz sitemap arrives as gzip bytes (fetch only unzips Content-Encoding: gzip).
  if (buf[0] === 0x1f && buf[1] === 0x8b) buf = gunzipSync(buf, { maxOutputLength: MAX_BYTES });
  return { url: res.url || url, text: buf.toString('utf8').replace(/^﻿/, '') };
}

const decodeXml = (s) =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (all, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (all, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, '&');
const tagValue = (block, tag) => {
  const m = new RegExp(`<${tag}>\\s*(?:<!\\[CDATA\\[)?\\s*([\\s\\S]*?)\\s*(?:\\]\\]>)?\\s*</${tag}>`, 'i').exec(block);
  return m ? decodeXml(m[1].trim()) : '';
};

/** Sitemap XML -> { index: [child sitemap URLs] } or { urls: [{ loc, lastmod }] }. */
function parseSitemap(xml) {
  if (/<sitemapindex[\s>]/i.test(xml)) {
    return { index: [...xml.matchAll(/<sitemap>([\s\S]*?)<\/sitemap>/gi)].map((m) => tagValue(m[1], 'loc')).filter(Boolean) };
  }
  if (/<urlset[\s>]/i.test(xml)) {
    return { urls: [...xml.matchAll(/<url>([\s\S]*?)<\/url>/gi)].map((m) => ({ loc: tagValue(m[1], 'loc'), lastmod: tagValue(m[1], 'lastmod') })).filter((u) => u.loc) };
  }
  return null;
}

// Pages only: no files, feeds, archives or paginated lists.
const SKIP_URL = /\.(jpe?g|png|gif|webp|avif|svg|ico|pdf|zip|mp4|mov|webm|mp3|docx?|xlsx?|pptx?|xml|txt|css|js)$|\/(tag|tags|category|categories|author|feed|page)(\/|$)|[?&](p|page|s)=/i;

async function crawl(competitor) {
  const { domain } = competitor;
  const allowed = (url) => {
    try {
      const host = new URL(url).hostname.toLowerCase();
      return host === domain || host.endsWith(`.${domain}`);
    } catch {
      return false;
    }
  };
  const result = { ...competitor, sitemaps: 0, errors: [], urls: new Map() };

  let robots = null;
  for (const origin of [`https://${domain}`, `https://www.${domain}`]) {
    try {
      robots = await get(`${origin}/robots.txt`, allowed);
      break;
    } catch (error) {
      result.errors.push(`${origin}/robots.txt: ${error.message}`);
    }
  }
  const origin = robots ? new URL(robots.url).origin : `https://${domain}`;
  const listed = robots ? [...robots.text.matchAll(/^[ \t]*sitemap[ \t]*:[ \t]*(\S+)/gim)].map((m) => m[1].trim()) : [];
  const queue = [...new Set(listed.filter(allowed))];
  const fromRobots = queue.length > 0;
  const fallbacks = new Set(fromRobots ? [] : FALLBACK_SITEMAPS.map((path) => `${origin}${path}`));
  queue.push(...fallbacks);
  for (const url of listed.filter((u) => !allowed(u))) result.errors.push(`skipped off-domain sitemap ${url}`);

  const seen = new Set();
  while (queue.length && result.sitemaps < MAX_SITEMAPS && result.urls.size < MAX_URLS) {
    const url = queue.shift();
    if (seen.has(url)) continue;
    seen.add(url);
    let parsed;
    try {
      const res = await get(url, allowed);
      parsed = parseSitemap(res.text);
      if (!parsed) throw new Error('not a sitemap');
    } catch (error) {
      // A missing fallback location is expected; only report real failures.
      if (!fallbacks.has(url) || !/HTTP 404|not a sitemap/.test(error.message)) result.errors.push(`${url}: ${error.message}`);
      continue;
    }
    result.sitemaps += 1;
    // The first fallback location that is a real sitemap is enough.
    if (fallbacks.has(url)) {
      for (let i = queue.length - 1; i >= 0; i -= 1) if (fallbacks.has(queue[i])) queue.splice(i, 1);
    }
    if (parsed.index) {
      for (const child of parsed.index) {
        if (allowed(child)) queue.push(child);
        else result.errors.push(`skipped off-domain sitemap ${child}`);
      }
      continue;
    }
    for (const { loc, lastmod } of parsed.urls) {
      if (result.urls.size >= MAX_URLS) break;
      if (!allowed(loc) || SKIP_URL.test(loc)) continue;
      const key = loc.replace(/#.*$/, '').replace(/\/+$/, '');
      if (!result.urls.has(key)) result.urls.set(key, { url: loc, lastmod, sitemap: url, topics: topicsOf(pathOf(loc)) });
    }
  }
  if (queue.length) result.errors.push(`stopped at the limit (${MAX_SITEMAPS} sitemaps / ${MAX_URLS} URLs); ${queue.length} sitemap(s) not read`);
  return result;
}

/* ---------------------------------------------------------------- report */

const csvCell = (value) => {
  const s = String(value ?? '');
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const csv = (rows) => `${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}\r\n`;

const results = [];
for (const competitor of competitors) {
  console.error(`${competitor.id} (${competitor.domain}) …`);
  const result = await crawl(competitor);
  console.error(`  ${result.sitemaps} sitemap file(s), ${result.urls.size} page URL(s)${result.errors.length ? `; ${result.errors.length} note(s):` : ''}`);
  for (const note of result.errors) console.error(`    - ${note}`);
  results.push(result);
}

const header = ['topic', 'our_live_pages', 'our_planned_pages', 'competitors_with_topic', 'competitor_urls', ...results.map((r) => r.id), 'status', 'example_urls'];
const rows = [header];
for (const topic of [...TOPICS.map((t) => t.topic), NO_TOPIC]) {
  const perCompetitor = results.map((r) => [...r.urls.values()].filter((u) => (topic === NO_TOPIC ? !u.topics.length : u.topics.includes(topic))));
  const total = perCompetitor.reduce((n, list) => n + list.length, 0);
  const withTopic = perCompetitor.filter((list) => list.length).length;
  // Examples from different competitors first.
  const examples = [];
  for (let i = 0; examples.length < 3 && perCompetitor.some((list) => list[i]); i += 1) {
    for (const list of perCompetitor) if (list[i] && examples.length < 3) examples.push(list[i].url);
  }
  const ours = ourPages.get(topic) || { live: [], planned: [] };
  const status = topic === NO_TOPIC ? ''
    : !total ? 'no competitor pages'
      : ours.live.length ? 'covered'
        : ours.planned.length ? 'GAP: planned only'
          : 'GAP: no page in the keyword map';
  rows.push([
    topic,
    ours.live.join(' | '),
    ours.planned.join(' | '),
    withTopic,
    total,
    ...perCompetitor.map((list) => list.length),
    status,
    examples.join(' | '),
  ]);
}

const topicCsv = csv(rows);
if (OUT) {
  writeFileSync(resolve(process.cwd(), OUT), topicCsv, 'utf8');
  console.error(`Wrote ${OUT} (${rows.length - 1} topic rows).`);
} else {
  process.stdout.write(topicCsv);
}

if (URLS_OUT) {
  const urlRows = [['competitor', 'domain', 'url', 'topics', 'lastmod', 'sitemap']];
  for (const r of results) {
    for (const u of r.urls.values()) urlRows.push([r.id, r.domain, u.url, u.topics.join(' | '), u.lastmod, u.sitemap]);
  }
  writeFileSync(resolve(process.cwd(), URLS_OUT), csv(urlRows), 'utf8');
  console.error(`Wrote ${URLS_OUT} (${urlRows.length - 1} URLs).`);
}
