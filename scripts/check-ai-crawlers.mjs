/**
 * Can ChatGPT, Bing and Perplexity read the live site?
 *
 *   node scripts/check-ai-crawlers.mjs [site]      default https://bridgelandbuilders.com
 *
 * ChatGPT search reads pages with OpenAI's OAI-SearchBot, opens a page for a
 * user with ChatGPT-User, and also draws on Bing's index (bingbot). GPTBot is
 * OpenAI's training crawler and PerplexityBot is Perplexity's. A firewall rule
 * (on Vercel: Firewall, Bot Management, AI Bots), a robots.txt edit or a stray
 * noindex can lock them out while the site still looks fine in a browser.
 *
 * Each crawler's user agent fetches robots.txt, sitemap.xml, llms.txt, the
 * home page, the first service page and the newest blog post in the sitemap.
 * The check fails when, for any crawler:
 *   - robots.txt disallows it for a checked URL
 *   - a URL answers anything but 200 (a firewall challenge answers 403, 429 or
 *     503), redirects, or comes back marked by Vercel's firewall
 *   - a page is not the prerendered page a browser gets: no <h1>, no JSON-LD,
 *     under 150 words of main text, or a different <title>
 *   - a page is noindex for it (robots meta, a meta named after it, or the
 *     X-Robots-Tag header)
 * A browser user agent fetches every URL first. When that fails as well, the
 * page itself is down and the report says so. Network errors and 5xx answers
 * are tried three times.
 *
 * Runs after every production deploy (.github/workflows/post-deploy.yml) and
 * every week (.github/workflows/ai-crawler-check.yml), because a firewall
 * setting can change without a deploy. Exit code 1 on any failure. Node
 * built-ins only.
 */
import { appendFileSync } from 'node:fs';
import { byTag, decodeEntities, mainRange, parseHtml, textBetween, textOf, wordCount } from './lib/audit/html.mjs';
import { parseRobots, parseSitemap, robotsAllows } from './lib/audit/site.mjs';

const SITE = (process.argv[2] || 'https://bridgelandbuilders.com').replace(/\/+$/, '');
const MIN_WORDS = 150;
const TRIES = 3;

const BROWSER = {
  name: 'Browser',
  ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
};
// User agents as their owners publish them; `token` is the robots.txt name.
const CRAWLERS = [
  {
    name: 'OAI-SearchBot',
    token: 'oai-searchbot',
    role: 'ChatGPT search',
    ua: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.3; +https://openai.com/searchbot',
  },
  {
    name: 'ChatGPT-User',
    token: 'chatgpt-user',
    role: 'ChatGPT opening a page for a user',
    ua: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot',
  },
  {
    name: 'GPTBot',
    token: 'gptbot',
    role: "OpenAI's training crawler",
    ua: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.3; +https://openai.com/gptbot',
  },
  {
    name: 'bingbot',
    token: 'bingbot',
    role: 'Bing, which ChatGPT search and Copilot draw on',
    ua: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/116.0.1938.76 Safari/537.36',
  },
  {
    name: 'PerplexityBot',
    token: 'perplexitybot',
    role: 'Perplexity',
    ua: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)',
  },
];

const CHALLENGE_TITLE = /security checkpoint|just a moment|attention required|access denied|captcha|are you a robot/i;
// X-Robots-Tag directives that carry a colon of their own (not a crawler name).
const COLON_DIRECTIVES = new Set(['max-snippet', 'max-image-preview', 'max-video-preview', 'unavailable_after']);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function get(path, agent) {
  let last = null;
  for (let attempt = 1; attempt <= TRIES; attempt += 1) {
    try {
      const res = await fetch(`${SITE}${path}`, {
        redirect: 'manual',
        headers: {
          'user-agent': agent.ua,
          accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5',
        },
        signal: AbortSignal.timeout(20000),
      });
      last = { status: res.status, headers: res.headers, body: await res.text() };
      if (res.status < 500) return last;
    } catch (error) {
      last = { status: 0, headers: new Headers(), body: '', error: (error.cause && error.cause.code) || error.message };
    }
    if (attempt < TRIES) await sleep(3000 * attempt);
  }
  return last;
}

/** Robots directives that apply to `token` in one X-Robots-Tag value. */
function headerDirectives(value, token) {
  const out = [];
  let scope = null;
  for (const raw of String(value || '').toLowerCase().split(',')) {
    let part = raw.trim();
    const named = part.match(/^([a-z0-9_-]+)\s*:\s*(.*)$/);
    if (named && !COLON_DIRECTIVES.has(named[1])) {
      scope = named[1];
      part = named[2].trim();
    }
    if (part && (scope === null || scope === token)) out.push(part);
  }
  return out;
}

const isNoindex = (directives) => directives.some((d) => d === 'noindex' || d === 'none');

function readPage(html) {
  const title = decodeEntities((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '')
    .replace(/\s+/g, ' ')
    .trim();
  let doc = null;
  try {
    doc = parseHtml(html);
  } catch {
    return { title, h1: '', words: 0, jsonLd: false, metas: [] };
  }
  const h1 = byTag(doc, 'h1').map((el) => textOf(doc, el)).find(Boolean) || '';
  const range = mainRange(doc);
  const words = wordCount(textBetween(doc, range.start, range.end));
  const jsonLd = byTag(doc, 'script').some((el) => /application\/ld\+json/i.test(el.attrs.type || ''));
  const metas = byTag(doc, 'meta')
    .filter((el) => el.attrs.name)
    .map((el) => ({ name: el.attrs.name.toLowerCase(), content: (el.attrs.content || '').toLowerCase() }));
  return { title, h1, words, jsonLd, metas };
}

const statusText = (res) => (res.status ? `${res.status}` : `no answer (${res.error || 'network error'})`);

/* ---------------------------------------------------------- which URLs */
const control = new Map();
const problems = [];
const fail = (who, path, message) => problems.push({ who, path, message });

const browserSitemap = await get('/sitemap.xml', BROWSER);
control.set('/sitemap.xml', browserSitemap);
let sitemapUrls = [];
if (browserSitemap.status === 200) {
  sitemapUrls = parseSitemap(browserSitemap.body).urls.filter((u) => u.loc);
} else {
  console.log(`sitemap.xml answered ${statusText(browserSitemap)}: no service page or post to pick, so the home page stands in for them.`);
}
const pathOf = (loc) => {
  try {
    return new URL(loc).pathname.replace(/\/+$/, '') || '/';
  } catch {
    return null;
  }
};
const service = sitemapUrls.map((u) => pathOf(u.loc)).find((p) => p && /^\/services\/[^/]+$/.test(p));
const newestPost = sitemapUrls
  .filter((u) => /^\/blog\/[^/]+$/.test(pathOf(u.loc) || ''))
  .sort((a, b) => String(b.lastmod || '').localeCompare(String(a.lastmod || '')))
  .map((u) => pathOf(u.loc))[0];

const TARGETS = [
  { path: '/robots.txt', kind: 'robots' },
  { path: '/sitemap.xml', kind: 'sitemap' },
  { path: '/llms.txt', kind: 'llms' },
  { path: '/', kind: 'page' },
  ...(service ? [{ path: service, kind: 'page' }] : []),
  ...(newestPost ? [{ path: newestPost, kind: 'page' }] : []),
];

console.log(`AI crawler check: ${SITE}`);
console.log(`URLs: ${TARGETS.map((t) => t.path).join(', ')}`);

/* ------------------------------------------------- browser control run */
for (const target of TARGETS) {
  if (!control.has(target.path)) control.set(target.path, await get(target.path, BROWSER));
  const res = control.get(target.path);
  if (res.status !== 200) fail('Browser', target.path, `answered ${statusText(res)} to a browser too: the URL itself is down`);
}
const controlPage = new Map(
  TARGETS.filter((t) => t.kind === 'page' && control.get(t.path).status === 200).map((t) => [t.path, readPage(control.get(t.path).body)]),
);
const controlRobots = control.get('/robots.txt').status === 200 ? parseRobots(control.get('/robots.txt').body) : null;

/* --------------------------------------------------------- crawler runs */
const rows = [];
for (const crawler of CRAWLERS) {
  const before = problems.length;
  let robots = controlRobots;
  for (const target of TARGETS) {
    const res = await get(target.path, crawler);
    const browserOk = control.get(target.path).status === 200;
    const say = (message) => fail(crawler.name, target.path, message);

    if (res.status !== 200) {
      const location = res.headers.get('location');
      const mitigated = res.headers.get('x-vercel-mitigated');
      let message =
        res.status >= 300 && res.status < 400
          ? `redirects (${res.status}) to ${location || 'no location'}`
          : `answered ${statusText(res)}`;
      if (mitigated) message += `, marked "${mitigated}" by Vercel's firewall`;
      if (!browserOk) message += ' (a browser gets an error too)';
      else if (res.status === 403 || res.status === 429 || res.status === 503 || mitigated) {
        message += ' while a browser gets 200: a firewall or bot rule is turning this crawler away';
      }
      say(message);
      continue;
    }
    if (res.headers.get('x-vercel-mitigated')) say(`marked "${res.headers.get('x-vercel-mitigated')}" by Vercel's firewall`);
    if (target.kind === 'robots') {
      if (!/^\s*user-agent\s*:/im.test(res.body)) say('is not a robots.txt (no User-agent line)');
      else robots = parseRobots(res.body);
    }
    if (target.path !== '/robots.txt' && robots) {
      const verdict = robotsAllows(robots, crawler.token, target.path);
      if (verdict !== true) say(`robots.txt blocks it ("Disallow: ${verdict.path}")`);
    }
    if (target.kind === 'sitemap' && !/<urlset[\s>]/i.test(res.body)) say('is not a sitemap (no <urlset>)');
    if (target.kind === 'llms' && !/^#\s+\S/m.test(res.body)) say('is not an llms.txt (no "# " title line)');
    // noindex only matters on pages. llms.txt carries "X-Robots-Tag: noindex"
    // on purpose (vercel.json): assistants read it, search results don't list it.
    if (target.kind !== 'page') continue;
    if (isNoindex(headerDirectives(res.headers.get('x-robots-tag'), crawler.token))) {
      say(`X-Robots-Tag "${res.headers.get('x-robots-tag')}" keeps it out of the index`);
    }

    const page = readPage(res.body);
    const expected = controlPage.get(target.path);
    if (CHALLENGE_TITLE.test(page.title)) say(`gets a bot challenge page ("${page.title}")`);
    const metaNoindex = page.metas.filter((m) => (m.name === 'robots' || m.name === crawler.token) && isNoindex(m.content.split(/\s*,\s*/)));
    if (metaNoindex.length) say(`<meta name="${metaNoindex[0].name}" content="${metaNoindex[0].content}"> keeps it out of the index`);
    if (!page.h1) say('has no <h1>: the prerendered page is missing');
    if (!page.jsonLd) say('has no JSON-LD business data');
    if (page.words < MIN_WORDS) say(`has only ${page.words} words of main text (expected ${MIN_WORDS}+): the prerendered page is missing`);
    if (expected && page.title !== expected.title) say(`gets the title "${page.title}", a browser gets "${expected.title}"`);
  }
  const mine = problems.slice(before);
  rows.push({ crawler, ok: TARGETS.length - new Set(mine.map((p) => p.path)).size, problems: mine });
}

/* --------------------------------------------------------------- report */
const width = Math.max(...CRAWLERS.map((c) => c.name.length));
for (const row of rows) {
  console.log(`${row.problems.length ? 'FAIL' : 'ok  '}  ${row.crawler.name.padEnd(width)}  ${row.ok}/${TARGETS.length} URLs readable  (${row.crawler.role})`);
}
const browserProblems = problems.filter((p) => p.who === 'Browser');
if (problems.length) {
  console.error('');
  for (const p of problems) console.error(`${p.who} ${p.path}: ${p.message}`);
  console.error('');
  console.error('What to do:');
  if (browserProblems.length) console.error('- The site or a page is down for everyone: check the latest deployment on Vercel first.');
  if (problems.some((p) => p.who !== 'Browser' && /firewall|bot rule/.test(p.message))) {
    console.error('- In Vercel: Project, Firewall. Under Bot Management, "AI Bots" must be Off or Log (not Deny or Challenge),');
    console.error('  and no custom rule may block these user agents. Then run this workflow again.');
  }
  if (problems.some((p) => /robots\.txt blocks|keeps it out of the index/.test(p.message))) {
    console.error('- A robots.txt rule or noindex tag shuts these crawlers out: robots.txt is written by scripts/build-seo-files.mjs.');
  }
  console.error('- Until this is fixed, the crawlers marked FAIL cannot read or quote the URLs listed above.');
  process.exitCode = 1;
} else {
  console.log(`All ${CRAWLERS.length} crawlers can read all ${TARGETS.length} URLs, the same pages a browser gets.`);
}

if (process.env.GITHUB_STEP_SUMMARY) {
  const lines = [
    `### Can ChatGPT, Bing and Perplexity read ${SITE}?`,
    '',
    '| Crawler | Used by | Readable URLs | Problems |',
    '| --- | --- | --- | --- |',
    ...rows.map((r) => `| ${r.crawler.name} | ${r.crawler.role} | ${r.ok}/${TARGETS.length} | ${r.problems.length ? r.problems.map((p) => `\`${p.path}\` ${p.message}`).join('<br>') : 'none'} |`),
    '',
    `URLs checked: ${TARGETS.map((t) => `\`${t.path}\``).join(', ')}`,
    ...(browserProblems.length ? ['', `**Down for a browser too:** ${browserProblems.map((p) => `\`${p.path}\` ${p.message}`).join('; ')}`] : []),
    '',
  ];
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${lines.join('\n')}\n`);
}
