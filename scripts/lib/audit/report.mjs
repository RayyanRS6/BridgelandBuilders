/**
 * Findings collector + console/JSON output for the SEO audit.
 *
 * Severity model (plan §3.13, D10):
 *   error — an invariant. Fails the build only when run with --strict.
 *   warn  — quality signal; never fails the build.
 *   info  — context (known, accepted states such as Wix-hosted images before
 *           the migration, or 307 interim redirects).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const SEVERITIES = ['error', 'warn', 'info'];

/** Short human titles for the console group headers. Unknown codes print as-is. */
export const CODE_TITLES = {
  'input.missing': 'Input file missing',
  'input.import-failed': 'Input module failed to import',
  'input.export-missing': 'Input module export missing',
  'parity.not-prerendered': 'SEO route missing from prerender-routes.json',
  'parity.no-seo-entry': 'Prerendered route has no SEO entry (prerender skips it -> 404)',
  'parity.missing-html': 'Prerendered route has no HTML in dist/',
  'parity.router-no-seo': 'Router path has no SEO entry',
  'parity.renders-404': 'Route renders the 404 page',
  'parity.stale-html': 'dist/ HTML for a route that is not prerendered',
  'parity.client-redirect': 'Client-side <Navigate> with no server redirect',
  'robots-meta.noindex-expected': 'Noindex route served without noindex',
  'robots-meta.unexpected-noindex': 'Indexable route served with noindex',
  'blog.unpublished-exported': 'Unpublished blog post exported in BLOG_POSTS',
  'sitemap.missing': 'Sitemap missing',
  'sitemap.noindex': 'Noindex page listed in sitemap',
  'sitemap.unknown-route': 'Sitemap URL is not a prerendered SEO route',
  'sitemap.redirect-source': 'Sitemap lists a redirect source',
  'sitemap.missing-route': 'Indexable route missing from sitemap',
  'sitemap.duplicate': 'Duplicate sitemap URL',
  'sitemap.foreign-loc': 'Sitemap URL outside SITE_URL',
  'sitemap.changefreq-priority': 'Sitemap uses changefreq/priority',
  'sitemap.image-meta': 'Sitemap image:title / image:caption',
  'sitemap.image-not-owned': 'Sitemap image entry for third-party media',
  'sitemap.lastmod-uniform': 'All sitemap lastmod values identical',
  'sitemap.lastmod-invalid': 'Invalid or future sitemap lastmod',
  'sitemap.lastmod-mismatch': 'Sitemap lastmod differs from SEO "updated"',
  'sitemap.stale-dist': 'dist/ copy differs from public/',
  'sitemap.stale-updated': '<main> text changed but "updated" (lastmod) did not',
  'sitemap.hash-outdated': '"updated" bumped since the content hash was recorded',
  'sitemap.hash-missing': 'No recorded content hash (scripts/seo-content-hashes.json)',
  'seo.updated-missing': 'SEO entry without "updated" date',
  'content.stale-cost-guide': 'Cost guide due for its yearly refresh',
  'content.stale-source': 'Sources last verified more than a year ago',
  'claims.banned': 'Unconfirmed or removed claim in page copy',
  'facts.timeline-drift': 'Service timeline in page copy differs from facts.js TIMELINES',
  'robots.missing': 'robots.txt missing',
  'robots.blocks-route': 'robots.txt blocks an indexable route',
  'robots.sitemap-line': 'robots.txt Sitemap line',
  'robots.legacy-rule': 'robots.txt legacy rule (plan §3.1)',
  'robots.stale-dist': 'dist/robots.txt differs from public/',
  'head.title-missing': 'Missing <title>',
  'head.title-too-long': 'Title too long',
  'head.description-missing': 'Missing meta description',
  'head.description-length': 'Meta description outside 70-155 chars',
  'head.canonical-missing': 'Missing canonical',
  'head.canonical-mismatch': 'Canonical does not match route',
  'head.og-missing': 'Missing Open Graph tag',
  'head.duplicate-title': 'Duplicate title across indexable pages',
  'head.duplicate-description': 'Duplicate description across indexable pages',
  'jsonld.missing': 'No JSON-LD on page',
  'jsonld.parse-error': 'JSON-LD fails to parse',
  'jsonld.page-block-count': 'More than one data-seo="page" JSON-LD block',
  'jsonld.page-block-missing': 'No data-seo="page" JSON-LD block',
  'jsonld.sitewide-missing': 'Sitewide JSON-LD block missing',
  'jsonld.unresolved-id': '@id reference does not resolve',
  'jsonld.cross-page-id': '@id reference resolves only on another page',
  'jsonld.type-conflict': 'Same @id declared with conflicting @type',
  'schema.forbidden': 'Forbidden schema',
  'schema.self-review': 'Review / rating markup',
  'schema.street-address': 'Street address in JSON-LD',
  'schema.postal-code': 'Postal code in JSON-LD (SAB: locality only)',
  'schema.telephone': 'JSON-LD telephone not +1-431-866-5644',
  'faq.missing-from-html': 'FAQPage Q&A text missing from page HTML',
  'html.h1': 'Not exactly one <h1>',
  'html.main': 'Not exactly one <main>',
  'html.loading-fallback': '"Loading page..." Suspense fallback in HTML',
  'html.reveal-gated': '.reveal hides hero / form / article body until JS',
  'html.long-paragraph': 'Paragraphs over 90 words',
  'nap.tel': 'tel: link other than tel:+14318665644',
  'nap.mailing-address': '"845 Dakota" outside the allowed legal/contact pages',
  'nap.phone-format': 'Phone number in a non-allowlisted format',
  'nap.other-phone': 'Other phone number in page copy',
  'nap.gmail': 'Gmail address on page',
  'img.wix-host': 'Images on static.wixstatic.com (until migration)',
  'img.stock-claim': 'Stock (Unsplash) image captioned as own/Winnipeg work',
  'img.attributes': '<img> without width/height/alt',
  'links.broken': 'Internal link to an unknown path',
  'links.to-redirect': 'Internal link to a redirect source',
  'links.category-query': 'Internal link with ?category=',
  'links.to-noindex': 'Contextual link to a noindex page',
  'links.orphan': 'Orphan page (0 contextual inbound links)',
  'links.few-inbound': 'Fewer than 3 contextual inbound links',
  'redirects.missing-config': 'No redirects in vercel.json',
  'redirects.destination': 'Redirect destination is not a live indexable route',
  'redirects.destination-pattern': 'Redirect destination uses a pattern (not checked)',
  'redirects.source-is-route': 'Redirect source shadows a prerendered route',
  'redirects.chain': 'Redirect chain / loop',
  'redirects.duplicate-source': 'Duplicate redirect source',
  'redirects.temporary': 'Temporary (307) redirect',
  'redirects.stale-temporary': '307 redirect older than 45 days',
  'redirects.not-synced': 'redirects.js entry missing from vercel.json',
  'redirects.unmanaged': 'vercel.json redirect not in redirects.js',
  'redirects.blog-not-redirected': 'Retired blog URL not redirected',
  'estimator.missing': 'Service page without an estimator iframe',
  'perf.js-budget': 'JS before interaction over budget',
  'keywords.unassigned': 'Keyword list entries not in the keyword map',
  'keywords.double-owned': 'Keyword listed more than once across the map buckets',
  'keywords.not-in-list': 'Keyword map entries not in the keyword list',
  'keywords.primary-not-in-title': 'Primary keyword words missing from <title>',
  'keywords.primary-not-in-h1': 'Primary keyword words missing from <h1>',
  'keywords.page-not-live': 'Keyword map page not live yet',
  'keywords.blocked-holds-keywords': 'Blocked keyword map page still lists keywords',
  'keywords.status-mismatch': 'Keyword map status disagrees with the prerendered routes',
  'keywords.fallback-unknown': 'GBP-only keyword falls back to an unknown page',
  'keywords.skipped': 'Keyword map checks skipped',
  'files.missing': 'Expected file missing from dist/',
  'files.netlify-only': 'Netlify-only file (Vercel ignores it)',
  'files.404-indexable': '404.html is not noindex',
};

export class Report {
  constructor() {
    this.findings = [];
  }

  add(severity, code, route, message, detail) {
    this.findings.push({ severity, code, route: route || null, message, ...(detail === undefined ? {} : { detail }) });
  }

  error(code, route, message, detail) { this.add('error', code, route, message, detail); }
  warn(code, route, message, detail) { this.add('warn', code, route, message, detail); }
  info(code, route, message, detail) { this.add('info', code, route, message, detail); }

  counts() {
    const counts = { error: 0, warn: 0, info: 0 };
    for (const f of this.findings) counts[f.severity] += 1;
    return counts;
  }

  /** { error: { code: n }, warn: {...}, info: {...} } */
  countsByCode() {
    const out = { error: {}, warn: {}, info: {} };
    for (const f of this.findings) out[f.severity][f.code] = (out[f.severity][f.code] || 0) + 1;
    return out;
  }
}

const LABEL = { error: 'ERRORS', warn: 'WARNINGS', info: 'INFO' };
const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (code, text) => (useColor ? `\x1b[${code}m${text}\x1b[0m` : text);
const COLOR = { error: '31', warn: '33', info: '36' };

/** Grouped console report: severity → check code → findings. */
export function printReport(report, { verbose = false, perCode = 12 } = {}) {
  const lines = [];
  for (const severity of SEVERITIES) {
    const items = report.findings.filter((f) => f.severity === severity);
    if (!items.length) continue;
    lines.push('');
    lines.push(paint(COLOR[severity], `${LABEL[severity]} (${items.length})`));
    const groups = new Map();
    for (const f of items) {
      if (!groups.has(f.code)) groups.set(f.code, []);
      groups.get(f.code).push(f);
    }
    for (const [code, group] of groups) {
      lines.push(`  ${paint(COLOR[severity], `[${code}]`)} ${CODE_TITLES[code] || ''} (${group.length})`);
      const shown = verbose ? group : group.slice(0, perCode);
      for (const f of shown) lines.push(`      ${f.route ? `${f.route} — ` : ''}${f.message}`);
      if (shown.length < group.length) lines.push(`      … ${group.length - shown.length} more (see audit.json or run with --verbose)`);
    }
  }
  console.log(lines.join('\n'));
}

export function writeJson(file, payload) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(payload, null, 2)}\n`);
}
