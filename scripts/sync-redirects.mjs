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
 *   - resolves `planned` rules (SEO plan C8): planned page live -> permanent
 *     308 to it; not live yet -> temporary 307 to the fallback `to`; no
 *     fallback (`to: null`) -> no rule until the planned page is live and the
 *     source is no longer a live route. "Live" = a route src/data/head.js
 *     prerenders (SITE_ROUTES: static pages, live services from
 *     src/data/services.js, live cost guides, published areas / case studies /
 *     videos / blog posts);
 *   - resolves chains (A -> B -> C becomes A -> C; any temporary hop makes the
 *     whole rule temporary) and rejects loops;
 *   - errors: duplicate or malformed sources, a source that is a live route
 *     (static page, live service or published blog post), a wildcard that
 *     swallows a live route or a LEAVE_404 URL, an off-site destination on a
 *     legacy rule; for EXTERNAL_REDIRECTS (short links to Google), a
 *     destination that is not an absolute https URL on EXTERNAL_HOSTS, or a
 *     source that is live, in LEAVE_404, matched by a legacy rule or the
 *     destination of one;
 *   - warnings: destinations that are not a known route or file, destinations
 *     that are noindex, sources still listed in a stale prerender-routes.json,
 *     interim (307) rules older than 45 days;
 *   - writes absolute apex destinations (CANONICAL_SITE_URL + path), explicit
 *     rules first, then the EXTERNAL_REDIRECTS short links (verbatim, always
 *     temporary 307, no chain resolution), then wildcard rules, then the
 *     whole-host rules
 *     (HOST_REDIRECTS: every path on e.g. the public vercel.app alias -> the
 *     same path on the apex), and leaves every other part of vercel.json
 *     exactly as it was. Absolute destinations mean a legacy URL requested on
 *     a host that serves this deployment directly (the vercel.app alias)
 *     lands on its final apex page in one hop. They do not help www or
 *     http://: Vercel's domain-level redirect (www -> apex, http -> https)
 *     runs before vercel.json, so a legacy URL there takes one extra hop
 *     (www -> apex legacy URL -> final page).
 *
 * The build runs this with --check, so a vercel.json that no longer matches
 * src/data/redirects.js (destination, 307/308 or a missing rule) fails it.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { CANONICAL_SITE_URL } from '../src/data/siteConfig.js';

const ROOT = new URL('../', import.meta.url);
const VERCEL_JSON = new URL('vercel.json', ROOT);
const PRERENDER_ROUTES = new URL('prerender-routes.json', ROOT);

// Files served from public/ that a redirect may legitimately point at.
const STATIC_FILES = ['/sitemap.xml', '/robots.txt', '/llms.txt', '/llms-full.txt'];
// The only hosts an EXTERNAL_REDIRECTS short link may send visitors to
// (Google Business Profile: review form, Maps listing, g.page short links).
export const EXTERNAL_HOSTS = new Set(['search.google.com', 'maps.google.com', 'www.google.com', 'g.page']);
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
 * C8: turns `planned` rules into ordinary rules for the current state of the
 * site. `isLive(path)` says whether a path is a live page.
 *   planned live (and, for a rule without fallback, its source not live)
 *                            -> { to: planned, permanent }
 *   not live, fallback `to`  -> { to, temporary }
 *   not live, no fallback    -> dropped
 * Rules without `planned` pass through unchanged. Each output rule carries
 * `state`: 'final' | 'interim' (and the original `planned` for reporting).
 */
export function applyPlanned(rules, isLive) {
  const out = [];
  for (const rule of rules) {
    if (!rule.planned) {
      if (typeof rule.to === 'string') out.push(rule);
      continue;
    }
    const plannedLive = isLive(rule.planned);
    const hasFallback = typeof rule.to === 'string';
    if (plannedLive && (hasFallback || !isLive(rule.from))) {
      out.push({ ...rule, to: rule.planned, temporary: false, state: 'final' });
    } else if (hasFallback) {
      out.push({ ...rule, temporary: true, state: 'interim' });
    }
  }
  return out;
}

/**
 * Follows each rule's destination through the other rules until it reaches a
 * URL that is not itself redirected. Returns new rule objects with the final
 * `to`, the effective `temporary` flag and the `chain` that was collapsed.
 * `planned` rules are resolved first (applyPlanned) against `isLive`, which
 * defaults to the site's live routes as built from src/data.
 */
export function resolveRedirects(inputRules, isLive = DEFAULT_IS_LIVE) {
  const rules = applyPlanned(inputRules, isLive);
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

/**
 * Absolute apex URL for a site path ("/services" -> "https://…/services").
 * Uses the canonical production origin, never the build's SITE_URL: vercel.json
 * is committed, and a build that sets SITE_URL (Vercel previews can) must still
 * pass --check.
 */
export const absoluteDestination = (to) => `${CANONICAL_SITE_URL.replace(/\/+$/, '')}${to}`;

/**
 * Vercel rules for HOST_REDIRECTS: every path on the host -> the same path on
 * the apex, permanent. They come after every legacy rule (see toVercelRules).
 */
export const hostRulesToVercel = (hostRules = []) =>
  hostRules.map((r) => ({
    source: '/:path*',
    has: [{ type: 'host', value: r.host }],
    destination: absoluteDestination('/:path*'),
    permanent: true,
  }));

/**
 * Vercel rules for EXTERNAL_REDIRECTS: the absolute destination verbatim,
 * always temporary (307) so a short link can be repointed later.
 */
export const externalRulesToVercel = (externalRules = []) =>
  externalRules.map((r) => ({ source: r.from, destination: r.to, permanent: false }));

/**
 * Explicit legacy rules (file order), the external short links, wildcard
 * legacy rules (file order), then the whole-host rules. Every literal source
 * comes before every pattern, so a wildcard can never shadow one.
 */
export const toVercelRules = (rules, hostRules = [], externalRules = []) => {
  const legacy = (r) => ({ source: r.from, destination: absoluteDestination(r.to), permanent: !r.temporary });
  const ordered = orderRules(rules);
  return [
    ...ordered.filter((r) => !isPattern(r.from)).map(legacy),
    ...externalRulesToVercel(externalRules),
    ...ordered.filter((r) => isPattern(r.from)).map(legacy),
    ...hostRulesToVercel(hostRules),
  ];
};

/** One line per rule, for --check (host condition included). */
export const ruleKey = (r) =>
  `${r.source}${r.has ? ` [${r.has.map((h) => `${h.type}=${h.value}`).join(', ')}]` : ''} -> ${r.destination} (${r.permanent ? 308 : 307})`;

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

/** One-line JSON with a space after each ':' and ',' ({ "source": "/a", … }). */
function inlineJson(value) {
  if (Array.isArray(value)) return `[${value.map(inlineJson).join(', ')}]`;
  if (value && typeof value === 'object') {
    return `{ ${Object.entries(value).map(([k, v]) => `${JSON.stringify(k)}: ${inlineJson(v)}`).join(', ')} }`;
  }
  return JSON.stringify(value);
}

function renderRedirects(vercelRules, eol) {
  if (!vercelRules.length) return '[]';
  const lines = vercelRules.map((r) => `    ${inlineJson(r)}`);
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

/**
 * The site's live routes, from the same inventory the prerender and sitemap
 * use (src/data/head.js SITE_ROUTES), split into pages and blog posts.
 */
export async function loadKnownRoutes() {
  const head = await import('../src/data/head.js');
  const seo = await import('../src/data/seo.js');
  const blog = await import('../src/data/blogPosts.js');
  const pageRoutes = new Set(['/', ...head.SITE_ROUTES.filter((r) => r.kind !== 'post').map((r) => r.path)]);
  const postRoutes = new Set(head.SITE_ROUTES.filter((r) => r.kind === 'post').map((r) => r.path));
  const prerendered = existsSync(PRERENDER_ROUTES)
    ? new Set(JSON.parse(readFileSync(PRERENDER_ROUTES, 'utf8')))
    : new Set();
  // Retired posts (build-blog-data.mjs): each needs a rule here.
  const retiredPosts = (blog.BLOG_REDIRECTS || []).map((b) => ({
    from: b.from || `/blog/${b.slug}`,
    to: b.to || b.redirectTo || null,
    temporary: b.temporary === true || b.permanent === false,
  }));
  const noindex = new Set([
    ...(seo.NOINDEX_ROUTES || []),
    ...head.SITE_ROUTES.filter((r) => r.noindex).map((r) => r.path),
  ]);
  const live = new Set([...pageRoutes, ...postRoutes]);
  return { pageRoutes, postRoutes, prerendered, retiredPosts, noindex, live, isLive: (path) => live.has(path) };
}

// Live routes as built from src/data, for resolveRedirects()'s default (so
// check-redirects.mjs resolves planned rules the same way the sync does).
const DEFAULT_KNOWN = await loadKnownRoutes();
const DEFAULT_IS_LIVE = DEFAULT_KNOWN.isLive;

export function validate(rules, effective, resolved, known, leave404, { allowLivePosts }) {
  const errors = [];
  const warnings = [];
  const { live } = known;

  // Every rule as written (planned or not).
  const seen = new Map();
  rules.forEach((rule, i) => {
    const where = `#${i + 1} ${rule.from}`;
    const toOk = typeof rule.to === 'string' || (rule.to === null && typeof rule.planned === 'string');
    if (typeof rule.from !== 'string' || !toOk) {
      errors.push(`${where}: "from" must be a string, "to" a string (or null with "planned")`);
      return;
    }
    if (isPattern(rule.from) ? !WILDCARD_RE.test(rule.from) : !LITERAL_RE.test(rule.from)) {
      errors.push(`${where}: source must be a lowercase path without trailing slash, query or hash (wildcards: "/prefix/:path*")`);
    }
    for (const [field, dest] of [['to', rule.to], ['planned', rule.planned]]) {
      if (typeof dest === 'string' && (!/^\/(?!\/)/.test(dest) || /\s/.test(dest))) {
        errors.push(`${where}: ${field} "${dest}" must be a path on this site`);
      }
    }
    if (rule.planned !== undefined && (typeof rule.planned !== 'string' || isPattern(rule.from))) {
      errors.push(`${where}: "planned" must be a path, on an explicit (non-wildcard) rule`);
    }
    if (!EVIDENCE.has(rule.evidence)) errors.push(`${where}: evidence must be W, S or A`);
    if (seen.has(rule.from)) errors.push(`${where}: duplicate source (also #${seen.get(rule.from) + 1})`);
    else seen.set(rule.from, i);
  });

  // The rules that are written to vercel.json for the site as it is now.
  effective.forEach((rule) => {
    const where = rule.from;
    if (isPattern(rule.from)) {
      const re = sourceToRegExp(rule.from);
      const hit = [...live].find((route) => re.test(route));
      if (hit) errors.push(`${where}: wildcard matches live route ${hit}`);
    } else if (known.pageRoutes.has(rule.from)) {
      errors.push(`${where}: source is a live page`);
    } else if (known.postRoutes.has(rule.from)) {
      const msg = `${where}: source is a published blog post — unpublish it (status in blog-raw) before redirecting`;
      (allowLivePosts ? warnings : errors).push(msg);
    } else if (known.prerendered.has(rule.from)) {
      warnings.push(`${where}: still listed in prerender-routes.json (stale file? run npm run seo)`);
    }

    if (rule.state === 'interim' && rule.since) {
      const days = (Date.now() - Date.parse(rule.since)) / 86400000;
      if (days > STALE_INTERIM_DAYS) {
        warnings.push(`${where}: interim 307 is ${Math.floor(days)} days old — launch ${rule.planned} and it becomes a 308`);
      }
    }
  });

  for (const post of known.retiredPosts) {
    const rule = effective.find((r) => r.from === post.from);
    if (!rule) {
      errors.push(`retired post ${post.from}: no rule in src/data/redirects.js (blog data says -> ${post.to || '?'})`);
    } else if ((post.to && rule.to !== post.to) || Boolean(rule.temporary) !== post.temporary) {
      warnings.push(`retired post ${post.from}: blog data says ${post.temporary ? '307' : '308'} -> ${post.to}, redirects.js says ${rule.temporary ? '307' : '308'} -> ${rule.to}`);
    }
  }

  // Checked against every rule as written, so a planned rule can never start
  // swallowing a URL that must stay 404 when its page launches.
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

/** HOST_REDIRECTS: a plain host name each, never the apex itself (a loop). */
export function validateHostRules(hostRules) {
  const errors = [];
  const apex = new URL(CANONICAL_SITE_URL).host;
  const seen = new Set();
  hostRules.forEach((rule, i) => {
    const host = rule && rule.host;
    const where = `HOST_REDIRECTS #${i + 1} ${host}`;
    if (typeof host !== 'string' || !/^[a-z0-9-]+(?:\.[a-z0-9-]+)+$/.test(host)) {
      errors.push(`${where}: "host" must be a lowercase host name without scheme, port or path`);
    } else if (host === apex) {
      errors.push(`${where}: the apex itself would redirect to itself`);
    } else if (seen.has(host)) {
      errors.push(`${where}: duplicate host`);
    }
    seen.add(host);
  });
  return errors;
}

/**
 * EXTERNAL_REDIRECTS: a literal short path each, sent to an absolute https URL
 * on EXTERNAL_HOSTS. The source must not be a live page, a LEAVE_404 URL or a
 * legacy rule's source (wildcards included), and no legacy rule may point at
 * it (a legacy URL must never chain off-site).
 */
export function validateExternalRules(externalRules, rules, resolved, known, leave404) {
  const errors = [];
  const seen = new Set();
  externalRules.forEach((rule, i) => {
    const from = rule && rule.from;
    const where = `EXTERNAL_REDIRECTS #${i + 1} ${from}`;
    if (typeof from !== 'string' || isPattern(from) || !LITERAL_RE.test(from) || from === '/') {
      errors.push(`${where}: "from" must be a lowercase literal path without trailing slash, query or hash`);
      return;
    }
    if (seen.has(from)) errors.push(`${where}: duplicate source`);
    seen.add(from);

    let url = null;
    try {
      url = new URL(rule.to);
    } catch {
      /* reported below */
    }
    if (!url || url.protocol !== 'https:' || /\s/.test(rule.to)) {
      errors.push(`${where}: "to" must be an absolute https URL`);
    } else if (!EXTERNAL_HOSTS.has(url.host)) {
      errors.push(`${where}: destination host ${url.host} is not one of ${[...EXTERNAL_HOSTS].join(', ')}`);
    }

    if (known.live.has(from)) errors.push(`${where}: source is a live page`);
    const legacy = rules.find((r) => typeof r.from === 'string' && sourceToRegExp(r.from).test(from));
    if (legacy) errors.push(`${where}: source is also matched by legacy redirect ${legacy.from}`);
    const into = resolved.find((r) => typeof r.to === 'string' && pathOnly(r.to) === from);
    if (into) errors.push(`${where}: legacy redirect ${into.from} points at this short link (would chain off-site)`);
    const kept = leave404.find((path) => sourceToRegExp(path).test(from));
    if (kept) errors.push(`${where}: matches LEAVE_404 ${kept}`);
  });
  return errors;
}

/**
 * Vercel compiles every vercel.json `source` (redirects, rewrites, headers)
 * with path-to-regexp, which rejects a capturing group inside a custom (...)
 * group ("Capturing groups are not allowed") and fails the whole deployment.
 * Nothing else in the build parses these patterns, so check them here: inside
 * a group, every "(" must open a non-capturing "(?:".
 */
function sourcePatternErrors(config) {
  const errors = [];
  for (const kind of ['redirects', 'rewrites', 'headers']) {
    (config[kind] || []).forEach((rule, index) => {
      const source = rule.source || '';
      let depth = 0;
      for (let i = 0; i < source.length; i += 1) {
        const ch = source[i];
        if (ch === '\\') {
          i += 1;
        } else if (ch === '(') {
          if (depth > 0 && source[i + 1] !== '?') {
            errors.push(`vercel.json ${kind}[${index}] source "${source}": capturing group inside a group (character ${i + 1}); use (?:...)`);
            break;
          }
          depth += 1;
        } else if (ch === ')') {
          depth = Math.max(0, depth - 1);
        }
      }
    });
  }
  return errors;
}

/* ------------------------------------------------------------------ main */

async function main() {
  const args = new Set(process.argv.slice(2));
  const checkOnly = args.has('--check');
  const allowLivePosts = args.has('--allow-live-posts');

  const { REDIRECTS, HOST_REDIRECTS = [], EXTERNAL_REDIRECTS = [], LEAVE_404 = [] } = await import('../src/data/redirects.js');
  const known = DEFAULT_KNOWN;
  const effective = applyPlanned(REDIRECTS, known.isLive);
  const resolved = resolveRedirects(REDIRECTS, known.isLive);
  const { errors, warnings } = validate(REDIRECTS, effective, resolved, known, LEAVE_404, { allowLivePosts });
  errors.push(...validateHostRules(HOST_REDIRECTS));
  errors.push(...validateExternalRules(EXTERNAL_REDIRECTS, REDIRECTS, resolved, known, LEAVE_404));

  for (const w of warnings) console.warn(`[redirects] warning: ${w}`);
  if (errors.length) {
    for (const e of errors) console.error(`[redirects] error: ${e}`);
    console.error(`[redirects] ${errors.length} error(s); vercel.json not written.`);
    process.exit(1);
  }

  const vercelRules = toVercelRules(resolved, HOST_REDIRECTS, EXTERNAL_REDIRECTS);
  const current = readFileSync(VERCEL_JSON, 'utf8');
  const patternErrors = sourcePatternErrors({ ...JSON.parse(current), redirects: vercelRules });
  if (patternErrors.length) {
    for (const e of patternErrors) console.error(`[redirects] error: ${e}`);
    process.exit(1);
  }
  const updated = writeRedirectsInto(current, vercelRules);

  const permanent = vercelRules.filter((r) => r.permanent).length;
  const hostWide = vercelRules.filter((r) => r.has).length;
  const wildcard = vercelRules.filter((r) => isPattern(r.source) && !r.has).length;
  const chained = resolved.filter((r) => r.chain.length).length;
  const plannedFinal = effective.filter((r) => r.state === 'final').length;
  const plannedInterim = effective.filter((r) => r.state === 'interim').length;
  const plannedPending = REDIRECTS.filter((r) => r.planned).length - plannedFinal - plannedInterim;
  const summary = `${vercelRules.length} redirects (${permanent} permanent 308, ${vercelRules.length - permanent} temporary 307, ${wildcard} wildcard, ${EXTERNAL_REDIRECTS.length} external, ${hostWide} whole-host; ${chained} chain(s) collapsed; planned: ${plannedFinal} live, ${plannedInterim} interim, ${plannedPending} pending)`;

  if (checkOnly) {
    // Compare the redirect rules, not the file's text: Vercel's build rewrites
    // vercel.json (minified, one line) before running the build command, so a
    // text comparison would always fail there.
    const committed = (JSON.parse(current).redirects || []).map((r) => ({
      source: r.source,
      ...(r.has ? { has: r.has } : {}),
      destination: r.destination,
      permanent: r.permanent,
    }));
    const key = ruleKey;
    const index = Math.max(committed.length, vercelRules.length);
    let first = -1;
    for (let i = 0; i < index; i += 1) {
      if (!committed[i] || !vercelRules[i] || key(committed[i]) !== key(vercelRules[i])) {
        first = i;
        break;
      }
    }
    if (first !== -1) {
      console.error(`[redirects] first difference at redirect #${first + 1}:`);
      console.error(`  committed: ${committed[first] ? key(committed[first]) : '(missing)'}`);
      console.error(`  expected:  ${vercelRules[first] ? key(vercelRules[first]) : '(missing)'}`);
      console.error(`[redirects] vercel.json is out of date — run npm run redirects (or npm run seo) and commit vercel.json. Expected ${summary}.`);
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
