/**
 * Site-level parsers for the SEO audit: URL/path normalisation, sitemap.xml,
 * robots.txt, Vercel redirect source patterns and redirect inputs.
 */
import { decodeEntities } from './html.mjs';

/* ------------------------------------------------------------------ paths */
/** '/a/b/' -> '/a/b'; '' -> '/'. */
export function cleanPath(path) {
  let p = String(path || '/');
  if (!p.startsWith('/')) p = `/${p}`;
  if (p.length > 1) p = p.replace(/\/+$/, '');
  return p || '/';
}

/**
 * Classifies an href. Returns null for non-navigational links (mailto:, tel:,
 * javascript:, bare #hash). Internal links come back as { internal: true,
 * path, query, hash }; others as { internal: false, url }.
 */
export function classifyHref(href, siteUrl) {
  const value = String(href || '').trim();
  if (!value || value.startsWith('#')) return null;
  if (/^(mailto|tel|sms|javascript|data):/i.test(value)) return null;
  let url;
  try {
    url = new URL(value, `${siteUrl}/`);
  } catch {
    return null;
  }
  if (!/^https?:$/.test(url.protocol)) return null;
  const site = new URL(siteUrl);
  const host = url.hostname.replace(/^www\./, '');
  if (host !== site.hostname.replace(/^www\./, '')) return { internal: false, url: url.href };
  return { internal: true, path: cleanPath(decodeURI(url.pathname)), query: url.search, hash: url.hash };
}

/* ---------------------------------------------------------------- sitemap */
const tagValue = (block, tag) => {
  const m = block.match(new RegExp(`<${tag}>\\s*([\\s\\S]*?)\\s*</${tag}>`, 'i'));
  return m ? decodeEntities(m[1].replace(/^<!\[CDATA\[|\]\]>$/g, '').trim()) : null;
};

export function parseSitemap(xml) {
  const urls = [];
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/gi)) {
    const block = m[1];
    const images = [...block.matchAll(/<image:image>([\s\S]*?)<\/image:image>/gi)].map((im) => ({
      loc: tagValue(im[1], 'image:loc'),
      title: tagValue(im[1], 'image:title'),
      caption: tagValue(im[1], 'image:caption'),
    }));
    urls.push({
      loc: tagValue(block, 'loc'),
      lastmod: tagValue(block, 'lastmod'),
      changefreq: tagValue(block, 'changefreq'),
      priority: tagValue(block, 'priority'),
      images,
    });
  }
  const isIndex = /<sitemapindex[\s>]/i.test(xml);
  return { urls, isIndex };
}

/* ----------------------------------------------------------------- robots */
export function parseRobots(text) {
  const groups = [];
  const sitemaps = [];
  let current = null;
  let lastWasAgent = false;
  for (const rawLine of String(text).split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim();
    if (!line) continue;
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const field = m[1].toLowerCase();
    const value = m[2].trim();
    if (field === 'user-agent') {
      if (!current || !lastWasAgent) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (field === 'sitemap') sitemaps.push(value);
    else if ((field === 'allow' || field === 'disallow') && current) current.rules.push({ type: field, path: value });
  }
  return { groups, sitemaps };
}

const robotsPatternToRegExp = (pattern) => {
  const anchored = pattern.endsWith('$');
  const body = (anchored ? pattern.slice(0, -1) : pattern)
    .split('*')
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');
  return new RegExp(`^${body}${anchored ? '$' : ''}`);
};

/** Google-style evaluation: most specific matching rule wins; Allow wins ties. */
export function robotsAllows(robots, agent, path) {
  const name = agent.toLowerCase();
  const group =
    robots.groups.find((g) => g.agents.includes(name)) || robots.groups.find((g) => g.agents.includes('*'));
  if (!group) return true;
  let best = null;
  for (const rule of group.rules) {
    if (!rule.path) continue; // "Disallow:" (empty) allows everything
    if (!robotsPatternToRegExp(rule.path).test(path)) continue;
    const len = rule.path.length;
    if (!best || len > best.len || (len === best.len && rule.type === 'allow')) best = { len, type: rule.type, path: rule.path };
  }
  return !best || best.type === 'allow' ? true : best;
}

/* -------------------------------------------------------------- redirects */
/** Removes regex escapes that sync-redirects adds (e.g. "\\." for dots). */
export const unescapeSource = (source) => String(source || '').replace(/\\([.\-/])/g, '$1');

/** True when a Vercel source uses path-to-regexp syntax rather than a literal path. */
export const isPatternSource = (source) => /[:()*+?]|\\(?![.\-/])/.test(String(source || '').replace(/\\[.\-/]/g, ''));

/**
 * Compiles a Vercel (path-to-regexp style) source to a RegExp:
 *   :name  -> one segment      :name* -> zero or more segments
 *   :name+ -> one or more      :name? -> optional segment
 *   (re)   -> raw regex group  \x     -> literal x
 */
export function compileSource(source) {
  const s = String(source || '');
  let out = '';
  for (let i = 0; i < s.length; i += 1) {
    const ch = s[i];
    if (ch === '\\' && i + 1 < s.length) {
      out += `\\${s[i + 1]}`;
      i += 1;
      continue;
    }
    if (ch === ':' && /[A-Za-z_]/.test(s[i + 1] || '')) {
      let j = i + 1;
      while (j < s.length && /\w/.test(s[j])) j += 1;
      let custom = null;
      if (s[j] === '(') {
        let depth = 0;
        let k = j;
        for (; k < s.length; k += 1) {
          if (s[k] === '\\') { k += 1; continue; }
          if (s[k] === '(') depth += 1;
          else if (s[k] === ')') { depth -= 1; if (depth === 0) break; }
        }
        custom = s.slice(j + 1, k);
        j = k + 1;
      }
      const modifier = /[*+?]/.test(s[j] || '') ? s[j] : '';
      if (modifier) j += 1;
      const seg = custom ? `(?:${custom})` : '[^/]+';
      const hadSlash = out.endsWith('\\/') || out.endsWith('/');
      if (hadSlash && (modifier === '*' || modifier === '?')) {
        out = out.replace(/\\?\/$/, '');
        out += modifier === '*' ? `(?:/${custom ? seg : '.*'})?` : `(?:/${seg})?`;
      } else if (modifier === '*') out += custom ? `(?:${seg})*` : '.*';
      else if (modifier === '+') out += custom ? `(?:${seg})+` : '.+';
      else if (modifier === '?') out += `(?:${seg})?`;
      else out += seg;
      i = j - 1;
      continue;
    }
    if (ch === '(') {
      let depth = 0;
      let k = i;
      for (; k < s.length; k += 1) {
        if (s[k] === '\\') { k += 1; continue; }
        if (s[k] === '(') depth += 1;
        else if (s[k] === ')') { depth -= 1; if (depth === 0) break; }
      }
      out += `(?:${s.slice(i + 1, k)})`;
      i = k;
      if (/[*+?]/.test(s[i + 1] || '')) {
        out += s[i + 1]; // modifier on an unnamed group: "(-winnipeg)?"
        i += 1;
      }
      continue;
    }
    if (ch === '*') {
      out += '.*';
      continue;
    }
    out += ch.replace(/[.+?^${}|[\]\\/]/g, '\\$&');
  }
  try {
    return new RegExp(`^${out}/?$`);
  } catch {
    return null;
  }
}

/** Normalises vercel.json redirects into { source, destination, status, hasConditions, raw }. */
export function vercelRedirects(config) {
  const list = Array.isArray(config && config.redirects) ? config.redirects : [];
  return list.map((r, index) => {
    const status = r.statusCode || (r.permanent === false ? 307 : 308);
    return {
      index,
      source: r.source,
      literal: isPatternSource(r.source) ? null : cleanPath(unescapeSource(r.source)),
      pattern: isPatternSource(r.source) ? compileSource(r.source) : null,
      destination: r.destination,
      status,
      hasConditions: Array.isArray(r.has) && r.has.length > 0,
      raw: r,
    };
  });
}

/**
 * Flexible reader for src/data/redirects.js REDIRECTS and blog BLOG_REDIRECTS:
 * arrays of { from|source|slug, to|destination|redirectTo, temporary?, since? }
 * or a plain { from: to } map. Slugs without a leading slash become /blog/<slug>.
 */
export function normaliseRedirectList(value, { slugBase = null } = {}) {
  if (!value) return [];
  const rows = Array.isArray(value)
    ? value
    : typeof value === 'object'
      ? Object.entries(value).map(([from, to]) => (typeof to === 'object' && to ? { from, ...to } : { from, to }))
      : [];
  return rows
    .map((row) => {
      if (!row || typeof row !== 'object') return null;
      let from = row.from || row.source || row.path || row.slug;
      let to = row.to || row.destination || row.redirectTo || row.target;
      if (!from) return null;
      if (slugBase && !String(from).startsWith('/')) from = `${slugBase}/${from}`;
      if (slugBase && to && !/^(\/|https?:)/.test(String(to))) to = `${slugBase}/${to}`;
      const temporary = row.temporary === true || row.permanent === false || row.statusCode === 307 || row.statusCode === 302;
      const since = row.since || row.added || row.date || row.created || null;
      return { from: String(from), to: to ? String(to) : null, temporary, since, raw: row };
    })
    .filter(Boolean);
}
