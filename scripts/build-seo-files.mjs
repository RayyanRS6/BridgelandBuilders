/**
 * Generates every static SEO/AEO artefact from one source of truth:
 *   public/robots.txt    — one rule group for every crawler (AI crawlers welcome)
 *   public/sitemap.xml   — every indexable route and published post, with lastmod
 *   public/llms.txt      — concise site map for AI answer engines
 *   public/llms-full.txt — fuller context (services, service area, FAQs, articles)
 *   index.html           — sitewide JSON-LD injected between markers
 *   prerender-routes.json
 *
 * Headers and redirects live in vercel.json (redirects are generated from
 * src/data/redirects.js by `npm run redirects`).
 */
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { BLOG_POSTS } from '../src/data/blogPosts.js';
import { SITE_FAQS } from '../src/data/faqs.js';
import { PROJECTS } from '../src/data/projects.js';
import {
  SITE_URL,
  SITE_NAME,
  SITE_PHONE,
  BUSINESS,
  SERVICE_CATALOG,
  SERVICE_AREA_NAMES,
  SERVICE_AREA_STATEMENT,
  SOCIAL_PROFILES,
  BBB_PROFILE_URL,
  GBP,
} from '../src/data/siteConfig.js';
import {
  NOINDEX_ROUTES,
  PAGE_SEO,
  SERVICE_SEO,
  SEO_DEFAULT_UPDATED,
  buildOrganizationGraph,
} from '../src/data/seo.js';

const PUBLIC = new URL('../public/', import.meta.url);
const out = (name, body) => writeFileSync(new URL(name, PUBLIC), body);
mkdirSync(PUBLIC, { recursive: true });

/* ---------------------------------------------------------------- routes */
const seoEntry = (path) => PAGE_SEO[path] || SERVICE_SEO[path];
const isNoindex = (path) =>
  NOINDEX_ROUTES.includes(path) || /noindex/.test((seoEntry(path) || {}).robots || '');

// Every page with an SEO entry: home, the services hub, service pages, then
// the rest in PAGE_SEO order. A route without an SEO entry is never
// prerendered (prerender.mjs skips it), so it can't be listed either.
const SEO_ROUTES = [...new Set(['/', '/services', ...Object.keys(SERVICE_SEO), ...Object.keys(PAGE_SEO)])]
  .filter((path) => seoEntry(path));
const STATIC_ROUTES = SEO_ROUTES.filter((path) => !isNoindex(path));
const NOINDEX_PAGES = [...new Set([...NOINDEX_ROUTES, ...SEO_ROUTES.filter(isNoindex)])];

// BLOG_POSTS should already hold published posts only; filter again so a
// draft can never reach the sitemap.
const POSTS = BLOG_POSTS.filter((post) => (post.status || 'published') === 'published');

const urls = [
  ...STATIC_ROUTES.map((path) => ({ path, lastmod: seoEntry(path).updated || SEO_DEFAULT_UPDATED })),
  ...POSTS.map((post) => ({ path: `/blog/${post.slug}`, lastmod: post.updated || post.date })),
];

/* --------------------------------------------------------------- sitemap */
// No changefreq/priority (ignored by Google) and no image entries until blog
// images are self-hosted.
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

out('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
    .map((u) => `  <url>
    <loc>${esc(`${SITE_URL}${u.path}`)}</loc>
    <lastmod>${esc(u.lastmod)}</lastmod>
  </url>`)
    .join('\n')}
</urlset>
`);

/* ---------------------------------------------------------------- robots */
// One group for every crawler. Search engines and AI search/answer engines
// are all allowed on purpose: being quotable in ChatGPT/Claude/Perplexity
// answers is part of the AEO work. The agents are listed for reference only;
// a separate group per agent would replace the * rules for that agent.
const AI_AGENTS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot',
  'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot', 'Applebot-Extended',
  'Amazonbot', 'meta-externalagent', 'FacebookBot', 'Bytespider', 'CCBot', 'cohere-ai',
  'DuckAssistBot', 'MistralAI-User', 'YouBot', 'Diffbot',
];
const agentComment = [];
for (let i = 0; i < AI_AGENTS.length; i += 7) agentComment.push(`#   ${AI_AGENTS.slice(i, i + 7).join(', ')}`);

out('robots.txt', `# ${SITE_NAME} — ${SITE_URL}
# Search engines and AI assistants / answer engines are welcome to read and
# cite this site. AI crawlers covered by the rule below include:
${agentComment.join('\n')}
User-agent: *
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`);

/* ---------------------------------------------------- shared llms content */
const serviceLines = SERVICE_CATALOG.filter((s) => SERVICE_SEO[s.path])
  .map((s) => `- [${s.name}](${SITE_URL}${s.path}): ${SERVICE_SEO[s.path].description || ''}`)
  .join('\n');

const keyPage = (label, path, description) =>
  seoEntry(path) ? `- [${label}](${SITE_URL}${path}): ${description || seoEntry(path).description}` : null;

const keyPages = [
  keyPage('Home', '/'),
  keyPage('All services', '/services'),
  keyPage('Our process', '/our-process'),
  keyPage('Projects', '/projects', 'Renovation project categories, each linking to its service page with details and booking.'),
  keyPage('FAQs', '/faqs'),
  keyPage('Contact', '/contact-us'),
  keyPage('Instant quote', '/instant-quote'),
  keyPage('Book online', '/book-online'),
  keyPage('Blog', '/blog'),
].filter(Boolean).join('\n');

const articleLines = POSTS.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.excerpt}`).join('\n');

const PROFILE_LABELS = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  tiktok: 'TikTok',
};
const profileLines = [
  GBP && GBP.mapsUrl ? ['Google Maps (Google Business Profile)', GBP.mapsUrl] : null,
  ...Object.entries(SOCIAL_PROFILES || {}).map(([key, url]) => (url ? [PROFILE_LABELS[key] || key, url] : null)),
  BBB_PROFILE_URL ? ['Better Business Bureau', BBB_PROFILE_URL] : null,
]
  .filter(Boolean)
  .map(([label, url]) => `- ${label}: ${url}`)
  .join('\n');

// Sections are joined with one blank line; empty sections are dropped.
const doc = (...sections) => `${sections.filter(Boolean).join('\n\n')}\n`;

/* ------------------------------------------------------------- llms.txt */
out('llms.txt', doc(
  `# ${SITE_NAME}`,
  `> ${BUSINESS.description} Phone: ${SITE_PHONE}. ${SERVICE_AREA_STATEMENT}`,
  BUSINESS.disambiguatingDescription,
  // The experience/project-count figures stay out of this file until the
  // owner supplies evidence for them (SEO plan §11.1, O-2).
  `${SITE_NAME} is a service-area renovation and construction contractor based in Winnipeg, Manitoba.
Quotes are free and written, and permits and inspections are coordinated with the City of Winnipeg or
the local municipality when a project requires them.`,
  `## Services\n${serviceLines}`,
  `## Key pages\n${keyPages}`,
  articleLines && `## Articles\n${articleLines}`,
  `## Contact
- Phone: ${SITE_PHONE}
- Email: ${BUSINESS.email}
- Location: Winnipeg, Manitoba, Canada
- Service area: ${SERVICE_AREA_STATEMENT}
- Quote requests (instant price estimator): ${SITE_URL}/instant-quote
- Book a call or visit: ${SITE_URL}/book-online
- Contact form: ${SITE_URL}/contact-us`,
  profileLines && `## Profiles\n${profileLines}`,
));

/* --------------------------------------------------------- llms-full.txt */
// The site's own question-and-answer set: the FAQ page plus every service
// page's FAQs, word for word as they appear on the site.
const qa = (faqs) => faqs.map((f) => `**Q: ${f.q}**\nA: ${f.a}`).join('\n\n');

const projectPath = (project) =>
  project.path ||
  (SERVICE_CATALOG.find((s) => s.projectSlug === project.slug) || {}).path ||
  (SERVICE_SEO[`/services/${project.slug}s`] ? `/services/${project.slug}s` : null);

const faqBlocks = [
  SITE_FAQS.length ? `### General questions\n${SITE_URL}/faqs\n\n${qa(SITE_FAQS)}` : null,
  ...PROJECTS.filter((p) => p.faqs && p.faqs.length).map((project) => {
    const path = projectPath(project);
    const service = path && SERVICE_CATALOG.find((s) => s.path === path);
    const heading = (service && service.name) || project.breadcrumb || project.slug;
    return `### ${heading}${path ? `\n${SITE_URL}${path}` : ''}\n\n${qa(project.faqs)}`;
  }),
].filter(Boolean);

out('llms-full.txt', doc(
  `# ${SITE_NAME} — full reference`,
  `> ${BUSINESS.description}`,
  BUSINESS.disambiguatingDescription,
  `Phone: ${SITE_PHONE} · Email: ${BUSINESS.email} · Winnipeg, Manitoba, Canada · Free written quotes`,
  `## Services offered\n${serviceLines}`,
  `## Service area\n${SERVICE_AREA_STATEMENT}\n\nCommunities: ${SERVICE_AREA_NAMES.join(', ')}`,
  BUSINESS.knowsAbout && BUSINESS.knowsAbout.length &&
    `## Expertise\n${BUSINESS.knowsAbout.map((k) => `- ${k}`).join('\n')}`,
  profileLines && `## Profiles\n${profileLines}`,
  faqBlocks.length && `## Frequently asked questions\n\n${faqBlocks.join('\n\n')}`,
  articleLines && `## Articles\n${articleLines}`,
));

/* --------------------------------------------- sitewide JSON-LD in index */
const indexUrl = new URL('../index.html', import.meta.url);
let html = readFileSync(indexUrl, 'utf8');
const jsonLd = JSON.stringify({ '@context': 'https://schema.org', '@graph': buildOrganizationGraph() });
// A replacer function, not a string: in a replacement string "$$" means "$",
// which turned priceRange "$$" into "$".
html = html.replace(
  /<!-- seo:jsonld:start -->[\s\S]*?<!-- seo:jsonld:end -->/,
  () => `<!-- seo:jsonld:start -->\n  <script type="application/ld+json">${jsonLd}</script>\n  <!-- seo:jsonld:end -->`
);
writeFileSync(indexUrl, html);

/* ------------------------------------------------------ prerender routes */
// Every sitemap URL plus the noindex pages (ad landing page, SMS opt-in page).
// Those stay out of the sitemap but still need real HTML: on Vercel a route
// with no prerendered file is served as a 404.
const prerenderRoutes = [...new Set([...urls.map((u) => u.path), ...NOINDEX_PAGES])];
writeFileSync(new URL('../prerender-routes.json', import.meta.url), JSON.stringify(prerenderRoutes, null, 2));

console.log(`sitemap: ${urls.length} urls (${STATIC_ROUTES.length} pages, ${POSTS.length} posts)`);
console.log(`noindex (prerendered, not in sitemap): ${NOINDEX_PAGES.join(', ') || 'none'}`);
console.log(`prerender-routes.json: ${prerenderRoutes.length} routes`);
console.log('robots: one group for all crawlers (Disallow: /api/)');
console.log(`llms.txt + llms-full.txt written (${faqBlocks.length} FAQ blocks)`);
console.log('sitewide JSON-LD injected into index.html');
