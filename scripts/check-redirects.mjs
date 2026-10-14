/**
 * Live check of the legacy-URL redirects (src/data/redirects.js) against a
 * deployment.
 *
 *   npm run check:redirects -- <baseUrl> [--mode=preview|production]
 *
 *   preview     (default) each source answers 307 (temporary) or 308
 *               (permanent) with a Location whose path is the expected
 *               destination after chain resolution.
 *   production  the same, plus each destination answers 200.
 *
 * Wildcard rules are tested with one sample path. LEAVE_404 URLs must answer
 * 404 (in production, the firewalled paths below may answer 403 instead).
 * EXTERNAL_REDIRECTS short links (to Google) must answer 307 with exactly
 * their Location; the Google destination itself is never requested.
 * A first hop that only changes the host (www -> apex) is followed once.
 * In production mode against the apex, each HOST_REDIRECTS host (the public
 * vercel.app alias) is also checked: a page and a legacy URL requested there
 * must 308 to their final apex page in one hop.
 * The post-deploy workflow runs production mode against the apex: per-
 * deployment *.vercel.app URLs sit behind Vercel SSO (every request answers
 * 302 /sso-api). For a protected Vercel preview, set
 * VERCEL_AUTOMATION_BYPASS_SECRET.
 * Prints a table and exits 1 if anything fails.
 */
import { REDIRECTS, HOST_REDIRECTS, EXTERNAL_REDIRECTS, LEAVE_404 } from '../src/data/redirects.js';
import { CANONICAL_SITE_URL } from '../src/data/siteConfig.js';
import { EXTERNAL_HOSTS, isPattern, resolveRedirects, samplePath } from './sync-redirects.mjs';

const args = process.argv.slice(2);
const baseArg = args.find((a) => !a.startsWith('--'));
const modeArg = (args.find((a) => a.startsWith('--mode=')) || '--mode=preview').slice('--mode='.length);

if (!baseArg || !['preview', 'production'].includes(modeArg)) {
  console.error('usage: npm run check:redirects -- <baseUrl> [--mode=preview|production]');
  process.exit(2);
}

const BASE = new URL(baseArg);
const MODE = modeArg;
const APEX = new URL(CANONICAL_SITE_URL);
// LEAVE_404 paths the production firewall answers with 403 (Vercel denies
// WordPress probes before routing). Either way the URL leads nowhere.
const FIREWALLED_IN_PRODUCTION = new Set(['/wp-content/:path*']);
const CONCURRENCY = 6;
const TIMEOUT_MS = 20000;
const HEADERS = { 'user-agent': 'bridgeland-redirect-check/1.0' };
if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
  HEADERS['x-vercel-protection-bypass'] = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
}

async function get(url) {
  const res = await fetch(url, { redirect: 'manual', headers: HEADERS, signal: AbortSignal.timeout(TIMEOUT_MS) });
  try { await res.body?.cancel(); } catch { /* body already closed */ }
  const location = res.headers.get('location');
  return { status: res.status, location: location ? new URL(location, url) : null };
}

/** Requests a path; follows one redirect that only changes the host. */
async function request(path) {
  const url = new URL(path, BASE);
  let res = await get(url);
  if (
    [301, 302, 307, 308].includes(res.status) && res.location &&
    res.location.host !== url.host && res.location.pathname === url.pathname
  ) {
    res = await get(res.location);
  }
  return res;
}

const destinationCache = new Map();
function destinationStatus(url) {
  const key = url.href;
  if (!destinationCache.has(key)) {
    destinationCache.set(key, get(url).then((r) => r.status, (e) => `ERR ${e.message}`));
  }
  return destinationCache.get(key);
}

async function checkRule(rule) {
  const path = samplePath(rule.from);
  const expectedStatus = rule.temporary ? 307 : 308;
  const expectedPath = rule.to.replace(/[?#].*$/, '');
  const row = { from: path, expect: `${expectedStatus} ${expectedPath}`, got: '', ok: false };
  try {
    const res = await request(path);
    const gotPath = res.location ? res.location.pathname : '';
    row.got = `${res.status} ${gotPath}`.trim();
    const problems = [];
    if (res.status !== expectedStatus) problems.push('status');
    if (gotPath !== expectedPath) problems.push('location');
    if (MODE === 'production' && res.location && !problems.length) {
      const final = await destinationStatus(res.location);
      row.got += ` -> ${final}`;
      if (final !== 200) problems.push('destination not 200');
    }
    row.ok = !problems.length;
    if (!row.ok) row.why = problems.join(', ');
  } catch (error) {
    row.got = `ERR ${error.message}`;
    row.why = 'request failed';
  }
  return row;
}

/**
 * An EXTERNAL_REDIRECTS short link: 307 with exactly its Location. Like
 * request(), one first hop that only changes our own host (www -> apex) is
 * followed; nothing on a Google host is ever requested.
 */
async function checkExternalRule(rule) {
  const expected = new URL(rule.to);
  const row = { from: rule.from, expect: `307 ${expected.href}`, got: '', ok: false };
  try {
    const url = new URL(rule.from, BASE);
    let res = await get(url);
    if (
      [301, 302, 307, 308].includes(res.status) && res.location &&
      !EXTERNAL_HOSTS.has(res.location.host) &&
      res.location.host !== url.host && res.location.pathname === url.pathname
    ) {
      res = await get(res.location);
    }
    row.got = `${res.status} ${res.location ? res.location.href : ''}`.trim();
    const problems = [];
    if (res.status !== 307) problems.push('status');
    if (!res.location || res.location.href !== expected.href) problems.push('location');
    row.ok = !problems.length;
    if (!row.ok) row.why = problems.join(', ');
  } catch (error) {
    row.got = `ERR ${error.message}`;
    row.why = 'request failed';
  }
  return row;
}

async function check404(path) {
  const sample = samplePath(path);
  const allowed = MODE === 'production' && FIREWALLED_IN_PRODUCTION.has(path) ? [404, 403] : [404];
  const expect = allowed.join(' or ');
  const row = { from: sample, expect, got: '', ok: false };
  try {
    const res = await request(sample);
    row.got = `${res.status}${res.location ? ` ${res.location.pathname}` : ''}`;
    row.ok = allowed.includes(res.status);
    if (!row.ok) row.why = `expected ${expect}`;
  } catch (error) {
    row.got = `ERR ${error.message}`;
    row.why = 'request failed';
  }
  return row;
}

/** A path on a HOST_REDIRECTS host: one 308 to `expectedPath` on the apex, which answers 200. */
async function checkHostRule(host, path, expectedPath) {
  const row = { from: `${host}${path}`, expect: `308 ${APEX.host}${expectedPath}`, got: '', ok: false };
  try {
    const res = await get(new URL(path, `https://${host}`));
    row.got = `${res.status} ${res.location ? `${res.location.host}${res.location.pathname}` : ''}`.trim();
    const problems = [];
    if (res.status !== 308) problems.push('status');
    if (!res.location || res.location.origin !== APEX.origin || res.location.pathname !== expectedPath) problems.push('location');
    if (!problems.length) {
      const final = await destinationStatus(res.location);
      row.got += ` -> ${final}`;
      if (final !== 200) problems.push('destination not 200');
    }
    row.ok = !problems.length;
    if (!row.ok) row.why = problems.join(', ');
  } catch (error) {
    row.got = `ERR ${error.message}`;
    row.why = 'request failed';
  }
  return row;
}

async function runAll(tasks) {
  const results = new Array(tasks.length);
  let next = 0;
  async function worker() {
    while (next < tasks.length) {
      const i = next++;
      results[i] = await tasks[i]();
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, tasks.length) }, worker));
  return results;
}

const resolved = resolveRedirects(REDIRECTS);
const ordered = [...resolved.filter((r) => !isPattern(r.from)), ...resolved.filter((r) => isPattern(r.from))];
// Whole-host rules serve the production deployment, so they are only checked
// in a production run against the apex. Samples: a live page, and the first
// explicit legacy rule (it must still reach its final page in one hop).
const hostChecks = MODE === 'production' && BASE.origin === APEX.origin
  ? HOST_REDIRECTS.flatMap(({ host }) => [
    ['/services', '/services'],
    ...(ordered[0] ? [[ordered[0].from, ordered[0].to.replace(/[?#].*$/, '')]] : []),
  ].map(([path, expected]) => () => checkHostRule(host, path, expected)))
  : [];
const rows = await runAll([
  ...ordered.map((rule) => () => checkRule(rule)),
  ...EXTERNAL_REDIRECTS.map((rule) => () => checkExternalRule(rule)),
  ...LEAVE_404.map((path) => () => check404(path)),
  ...hostChecks,
]);

const width = (key, min) => Math.min(70, Math.max(min, ...rows.map((r) => String(r[key]).length)));
const wFrom = width('from', 6);
const wExpect = width('expect', 8);
const line = (a, b, c, d, e) => `${a.padEnd(4)}  ${b.padEnd(wFrom)}  ${c.padEnd(wExpect)}  ${d}${e ? `  (${e})` : ''}`;

console.log(`Redirect check: ${BASE.origin} — mode ${MODE}\n`);
console.log(line('', 'source', 'expected', 'got'));
for (const r of rows) console.log(line(r.ok ? 'ok' : 'FAIL', r.from, r.expect, r.got, r.why));

const failed = rows.filter((r) => !r.ok);
console.log(`\n${rows.length - failed.length}/${rows.length} passed (${ordered.length} redirects, ${EXTERNAL_REDIRECTS.length} external, ${LEAVE_404.length} expected 404s${hostChecks.length ? `, ${hostChecks.length} whole-host` : ''})`);
if (failed.length) process.exit(1);
