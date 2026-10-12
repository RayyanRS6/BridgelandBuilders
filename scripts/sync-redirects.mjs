/**
 * Writes the legacy-URL redirects from src/data/redirects.js into the
 * "redirects" block of vercel.json, which Vercel serves as real 307/308
 * responses before it looks for a file.
 *
 *   npm run redirects               validate, then rewrite vercel.json
 *   npm run redirects -- --check    validate only; exit 1 if vercel.json is stale
 *   npm run redirects -- --allow-live-posts
 *                                   treat "source is a published blog post" as a
 *                                   warning (only while a merge is in progress)
 *
 * What it does:
 *   - resolves chains (A -> B -> C becomes A -> C; any temporary hop makes the
 *     whole rule temporary) and rejects loops;
 *   - errors: duplicate or malformed sources, a source that is a live route
 *     (PAGE_SEO / SERVICE_SEO key or published blog post), a wildcard that
 *     swallows a live route or a LEAVE_404 URL, an off-site destination;
 *   - warnings: destinations that are not a known route or file, destinations
 *     that are noindex, sources still listed in a stale prerender-routes.json,
 *     interim (307) rules older than 45 days;
 *   - writes absolute apex destinations (SITE_URL + path, plan §1: a legacy
 *     URL served on another host still lands on the apex in one hop),
 *     explicit rules first and wildcard rules last, and leaves every other
 *     part of vercel.json exactly as it was.
 *
 * The build runs this with --check, so a vercel.json that no longer matches
 * src/data/redirects.js (destination, 307/308 or a missing rule) fails it.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { SITE_URL } from '../src/data/siteConfig.js';

const ROOT = new URL('../', import.meta.url);
const VERCEL_JSON = new URL('vercel.json', ROOT);
const PRERENDER_ROUTES = new URL('prerender-routes.json', ROOT);

// Files served from public/ that a redirect may legitimately point at.
const STATIC_FILES = ['/sitemap.xml', '/robots.txt', '/llms.txt', '/llms-full.txt'];
const STALE_INTERIM_DAYS = 45;
const EVIDENCE = new Set(['W', 'S', 'A']);

/* --------------------------------------------------------------- helpers */

/** The only pattern form used: a literal prefix plus a trailing "/:path*". */
const WILDCARD_RE = /^((?:\/[a-z0-9._-]+)+)\/:path\*$/;
const LITERAL_RE = /^\/(?:[a-z0-9._-]+(?:\/[a-z0-9._-]+)*)?$/;

export const isPattern = (source) => /[:*()?+{}\\]/.test(source);

/** RegExp equivalent of a source, for local matching. */
export function sourceToRegExp(source) {
  const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const wildcard = WILDCARD_RE.exec(source);
  if (wildcard) return new RegExp(`^${escape(wildcard[1])}(?:/.*)?$`);
  return new RegExp(`^${escape(source)}$`);
}

/** A concrete URL path that a source matches (used by the live check). */
export function samplePath(source) {
  const wildcard = WILDCARD_RE.exec(source);
  return wildcard ? `${wildcard[1]}/legacy-url-check` : source;
}

const pathOnly = (to) => to.replace(/[?#].*$/, '');

/**
 * Follows each rule's destination through the other rules until it reaches a
 * URL that is not itself redirected. Returns new rule objects with the final
 * `to`, the effective `temporary` flag and the `chain` that was collapsed.
 */
export function resolveRedirects(rules) {
  const explicit = new Map();
  const wildcards = [];
  for (const rule of rules) {
    if (isPattern(rule.from)) wildcards.push({ rule, re: sourceToRegExp(rule.from) });
    else if (!explicit.has(rule.from)) explicit.set(rule.from, rule);
  }
  const next = (to) => {
    const path = pathOnly(to);
    return explicit.get(path) || (wildcards.find((w) => w.re.test(path)) || {}).rule;
  };

  return rules.map((rule) => {
    let to = rule.to;
    let temporary = Boolean(rule.temporary);
    const chain = [];
    const seen = new Set([rule.from]);
    for (let hop = next(to); hop; hop = next(to)) {
      if (seen.has(hop.from)) {
        return { ...rule, to, temporary, chain, loop: [...seen, hop.from] };
      }
      seen.add(hop.from);
      chain.push(to);
      to = hop.to;
      temporary = temporary || Boolean(hop.temporary);
    }
    return { ...rule, to, temporary, chain };
  });
}

/** Explicit rules first (file order), then wildcard rules (file order). */
export function orderRules(rules) {
  return [...rules.filter((r) => !isPattern(r.from)), ...rules.filter((r) => isPattern(r.from))];
}

/** Absolute apex URL for a site path ("/services" -> "https://…/services"). */
export const absoluteDestination = (to) => `${SITE_URL.replace(/\/+$/, '')}${to}`;

export const toVercelRules = (rules) =>
  orderRules(rules).map((r) => ({ source: r.from, destination: absoluteDestination(r.to), permanent: !r.temporary }));

/* ------------------------------------------------- vercel.json rewriting */

function endOfString(text, start) {
  for (let i = start + 1; i < text.length; i += 1) {
    if (text[i] === '\\') i += 1;
    else if (text[i] === '"') return i;
  }
  throw new Error('vercel.json: unterminated string');
}

function endOfValue(text, start) {
  const open = text[start];
  if (open === '"') return endOfString(text, start) + 1;
  if (open === '[' || open === '{') {
    let depth = 0;
    for (let i = start; i < text.length; i += 1) {
      const ch = text[i];
      if (ch === '"') i = endOfString(text, i);
      else if (ch === '[' || ch === '{') depth += 1;
      else if (ch === ']' || ch === '}') {
        depth -= 1;
        if (depth === 0) return i + 1;
      }
    }
    throw new Error('vercel.json: unbalanced brackets');
  }
  return start + /^[^,}\]\s]*/.exec(text.slice(start))[0].length;
}

/** [start, end) of the value of a top-level key, or null. */
function topLevelValueSpan(text, key) {
  let depth = 0;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === '"') {
      const end = endOfString(text, i);
      if (depth === 1 && JSON.parse(text.slice(i, end + 1)) === key) {
        let j = end + 1;
        while (/\s/.test(text[j])) j += 1;
        if (text[j] === ':') {
          j += 1;
          while (/\s/.test(text[j])) j += 1;
          return [j, endOfValue(text, j)];
        }
      }
      i = end;
    } else if (ch === '{' || ch === '[') depth += 1;
    else if (ch === '}' || ch === ']') depth -= 1;
  }
  return null;
}

function renderRedirects(vercelRules, eol) {
  if (!vercelRules.length) return '[]';
  const lines = vercelRules.map(
    (r) => `    { "source": ${JSON.stringify(r.source)}, "destination": ${JSON.stringify(r.destination)}, "permanent": ${r.permanent} }`
  );
  return `[${eol}${lines.join(`,${eol}`)}${eol}  ]`;
}

/** vercel.json text with only its "redirects" value replaced (or added). */
export function writeRedirectsInto(text, vercelRules) {
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const value = renderRedirects(vercelRules, eol);
  const span = topLevelValueSpan(text, 'redirects');
  let out;
  if (span) {
    out = text.slice(0, span[0]) + value + text.slice(span[1]);
  } else {
    const close = text.lastIndexOf('}');
    const before = text.slice(0, close).replace(/\s*$/, '');
    out = `${before},${eol}  "redirects": ${value}${eol}${text.slice(close)}`;
  }
  // Everything except "redirects" must be untouched.
  const a = JSON.parse(text);
  const b = JSON.parse(out);
  delete a.redirects;
  delete b.redirects;
  if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error('vercel.json: rewrite changed other keys');
  return out;
}

/* ----------------------------------------------------------- validation */

export async function loadKnownRoutes() {
  const seo = await import('../src/data/seo.js');
  const blog = await import('../src/data/blogPosts.js');
  const pageRoutes = new Set(['/', ...Object.keys(seo.PAGE_SEO || {}), ...Object.keys(seo.SERVICE_SEO || {})]);
  const postRoutes = new Set(
    blog.BLOG_POSTS.filter((p) => (p.status || 'published') === 'published').map((p) => `/blog/${p.slug}`)
  );
  const prerendered = existsSync(PRERENDER_ROUTES)
    ? new Set(JSON.parse(readFileSync(PRERENDER_ROUTES, 'utf8')))
    : new Set();
  // Retired posts (build-blog-data.mjs): each needs a rule here.
  const retiredPosts = (blog.BLOG_REDIRECTS || []).map((b) => ({
    from: b.from || `/blog/${b.slug}`,
    to: b.to || b.redirectTo || null,
    temporary: b.temporary === true || b.permanent === false,
  }));
  return { pageRoutes, postRoutes, prerendered, retiredPosts, noindex: new Set(seo.NOINDEX_ROUTES || []) };
}

function validate(rules, resolved, known, leave404, { allowLivePosts }) {
  const errors = [];
  const warnings = [];
  const live = new Set([...known.pageRoutes, ...known.postRoutes]);

  const seen = new Map();
  rules.forEach((rule, i) => {
    const where = `#${i + 1} ${rule.from}`;
    if (typeof rule.from !== 'string' || typeof rule.to !== 'string') {
      errors.push(`${where}: "from" and "to" must be strings`);
      return;
    }
    if (isPattern(rule.from) ? !WILDCARD_RE.test(rule.from) : !LITERAL_RE.test(rule.from)) {
      errors.push(`${where}: source must be a lowercase path without trailing slash, query or hash (wildcards: "/prefix/:path*")`);
    }
    if (!/^\/(?!\/)/.test(rule.to) || /\s/.test(rule.to)) {
      errors.push(`${where}: destination "${rule.to}" must be a path on this site`);
    }
    if (!EVIDENCE.has(rule.evidence)) errors.push(`${where}: evidence must be W, S or A`);
    if (seen.has(rule.from)) errors.push(`${where}: duplicate source (also #${seen.get(rule.from) + 1})`);
    else seen.set(rule.from, i);

    if (isPattern(rule.from)) {
      const re = sourceToRegExp(rule.from);
      const hit = [...live].find((route) => re.test(route));
      if (hit) errors.push(`${where}: wildcard matches live route ${hit}`);
    } else if (known.pageRoutes.has(rule.from)) {
      errors.push(`${where}: source is a live page (PAGE_SEO/SERVICE_SEO)`);
    } else if (known.postRoutes.has(rule.from)) {
      const msg = `${where}: source is a published blog post — unpublish it (status in blog-raw) before redirecting`;
      (allowLivePosts ? warnings : errors).push(msg);
    } else if (known.prerendered.has(rule.from)) {
      warnings.push(`${where}: still listed in prerender-routes.json (stale file? run npm run seo)`);
    }

    if (rule.temporary && rule.since) {
      const days = (Date.now() - Date.parse(rule.since)) / 86400000;
      if (days > STALE_INTERIM_DAYS) {
        warnings.push(`${where}: interim 307 is ${Math.floor(days)} days old — launch ${rule.planned || 'the page'} and flip to 308`);
      }
    }
  });

  for (const post of known.retiredPosts) {
    const rule = rules.find((r) => r.from === post.from);
    if (!rule) {
      errors.push(`retired post ${post.from}: no rule in src/data/redirects.js (blog data says -> ${post.to || '?'})`);
    } else if ((post.to && rule.to !== post.to) || Boolean(rule.temporary) !== post.temporary) {
      warnings.push(`retired post ${post.from}: blog data says ${post.temporary ? '307' : '308'} -> ${post.to}, redirects.js says ${rule.temporary ? '307' : '308'} -> ${rule.to}`);
    }
  }

  for (const path of leave404) {
    const target = samplePath(path);
    const hit = rules.find((r) => sourceToRegExp(r.from).test(target));
    if (hit) errors.push(`LEAVE_404 ${path}: matched by redirect ${hit.from}`);
  }

  const knownDestinations = new Set([...live, ...known.prerendered, ...STATIC_FILES]);
  for (const rule of resolved) {
    const where = `${rule.from}`;
    if (rule.loop) {
      errors.push(`${where}: redirect loop ${rule.loop.join(' -> ')}`);
      continue;
    }
    const dest = pathOnly(rule.to);
    if (dest === rule.from) errors.push(`${where}: redirects to itself`);
    if (!knownDestinations.has(dest)) warnings.push(`${where}: destination ${dest} is not a known route or file`);
    else if (known.noindex.has(dest)) warnings.push(`${where}: destination ${dest} is noindex`);
  }
  return { errors, warnings };
}

/* ------------------------------------------------------------------ main */

async function main() {
  const args = new Set(process.argv.slice(2));
  const checkOnly = args.has('--check');
  const allowLivePosts = args.has('--allow-live-posts');

  const { REDIRECTS, LEAVE_404 = [] } = await import('../src/data/redirects.js');
  const resolved = resolveRedirects(REDIRECTS);
  const known = await loadKnownRoutes();
  const { errors, warnings } = validate(REDIRECTS, resolved, known, LEAVE_404, { allowLivePosts });

  for (const w of warnings) console.warn(`[redirects] warning: ${w}`);
  if (errors.length) {
    for (const e of errors) console.error(`[redirects] error: ${e}`);
    console.error(`[redirects] ${errors.length} error(s); vercel.json not written.`);
    process.exit(1);
  }

  const vercelRules = toVercelRules(resolved);
  const current = readFileSync(VERCEL_JSON, 'utf8');
  const updated = writeRedirectsInto(current, vercelRules);

  const permanent = vercelRules.filter((r) => r.permanent).length;
  const wildcard = vercelRules.filter((r) => isPattern(r.source)).length;
  const chained = resolved.filter((r) => r.chain.length).length;
  const summary = `${vercelRules.length} redirects (${permanent} permanent 308, ${vercelRules.length - permanent} temporary 307, ${wildcard} wildcard; ${chained} chain(s) collapsed)`;

  if (checkOnly) {
    if (updated !== current) {
      console.error(`[redirects] vercel.json is out of date — run npm run redirects. Expected ${summary}.`);
      process.exit(1);
    }
    console.log(`[redirects] vercel.json is up to date: ${summary}`);
    return;
  }
  if (updated !== current) writeFileSync(VERCEL_JSON, updated);
  console.log(`[redirects] ${updated !== current ? 'wrote' : 'unchanged'} vercel.json: ${summary}`);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
