/**
 * Generates every static SEO/AEO artefact from one source of truth:
 *   public/robots.txt    — one rule group for every crawler (AI crawlers welcome)
 *   public/sitemap.xml   — every indexable route and published post, with lastmod
 *   public/llms.txt      — concise site map for AI answer engines
 *   public/llms-full.txt — fuller context (services, service area, FAQs, posts'
 *                          quick answers, articles)
 *   index.html           — sitewide JSON-LD injected between markers
 *   prerender-routes.json
 *
 * Headers and redirects live in vercel.json (redirects are generated from
 * src/data/redirects.js by `npm run redirects`).
 *
 * The route list comes from src/data/head.js SITE_ROUTES: PAGE_SEO (static
 * pages), live service pages (src/data/services.js), live cost guides,
 * published community pages, case studies and videos, and published blog
 * posts. Draft pages are never prerendered or listed.
 */
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { EXPERIENCE_YEARS, OFFICE_HOURS_TEXT, PROJECT_COUNT, REPLY_TIME } from '../src/data/facts.js';
import { SITE_FAQS } from '../src/data/faqs.js';
import { LIVE_COST_GUIDES, PUBLISHED_POSTS, SITE_ROUTES } from '../src/data/head.js';
import { LIVE_SERVICE_PAGES, PROJECTS } from '../src/data/projects.js';
import {
  SITE_URL,
  SITE_NAME,
  SITE_PHONE,
  BUSINESS,
  SERVICE_AREA_NAMES,
  SERVICE_AREA_STATEMENT,
  SOCIAL_PROFILES,
  BBB_PROFILE_URL,
  GBP,
} from '../src/data/siteConfig.js';
import { COST_HUB_PATH, NOINDEX_ROUTES, buildOrganizationGraph } from '../src/data/seo.js';
import { stripInline } from '../src/lib/inlineText.js';

const PUBLIC = new URL('../public/', import.meta.url);
const out = (name, body) => writeFileSync(new URL(name, PUBLIC), body);
mkdirSync(PUBLIC, { recursive: true });

/* ---------------------------------------------------------------- routes */
// Indexable routes go in the sitemap; noindex routes (ad landing page, SMS
// opt-in page) are still prerendered. lastmod is each page's own `updated`.
const routeOf = new Map(SITE_ROUTES.map((route) => [route.path, route]));
const INDEXABLE = SITE_ROUTES.filter((route) => !route.noindex);
const NOINDEX_PAGES = [
  ...new Set([...NOINDEX_ROUTES.filter((path) => routeOf.has(path)), ...SITE_ROUTES.filter((r) => r.noindex).map((r) => r.path)]),
];
const PAGES = INDEXABLE.filter((route) => route.kind !== 'post');
const POSTS = PUBLISHED_POSTS.filter((post) => routeOf.has(`/blog/${post.slug}`));

const urls = INDEXABLE.map((route) => ({ path: route.path, lastmod: route.lastmod }));
const missingLastmod = urls.filter((u) => !u.lastmod).map((u) => u.path);
if (missingLastmod.length) {
  console.error(`[seo] no updated date for: ${missingLastmod.join(', ')}`);
  process.exit(1);
}

/* --------------------------------------------------------------- sitemap */
// No changefreq/priority (ignored by Google). No image entries on purpose:
// plan §13 keeps the image sitemap for owned job photos used with the
// client's consent. Stock photos and the generated blog title cards are not
// listed, even though the blog images are now self-hosted.
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
// Page copy may carry inline markup ([label](/path), **bold**): the llms files
// take its plain text (stripInline), as the JSON-LD does.
// Live service pages only (registry order), with each page's own description.
const serviceLines = LIVE_SERVICE_PAGES.map(
  ({ service, content }) => `- [${service.navLabel}](${SITE_URL}${service.path}): ${stripInline(content.seo.description)}`
).join('\n');

// Indexable pages only; a page that is not live (e.g. the cost hub before its
// data is signed off) is simply left out.
const keyPage = (label, path, description) => {
  const route = routeOf.get(path);
  return route && !route.noindex
    ? `- [${label}](${SITE_URL}${path}): ${stripInline(description || route.head.description)}`
    : null;
};

const keyPages = [
  keyPage('Home', '/'),
  keyPage('About us', '/about-us'),
  keyPage('All services', '/services'),
  keyPage('Renovation costs in Winnipeg', COST_HUB_PATH),
  keyPage('Service areas', '/service-areas'),
  keyPage('Our process', '/our-process'),
  // The /projects photos are design ideas, not Bridgeland jobs: say so, so no
  // answer engine presents them as the company's own work.
  keyPage('Projects', '/projects', 'Design-idea (inspiration) photos for each type of renovation; not photos of Bridgeland jobs.'),
  keyPage('FAQs', '/faqs'),
  keyPage('Contact', '/contact-us'),
  keyPage('Instant quote', '/instant-quote'),
  keyPage('Book online', '/book-online'),
  keyPage('Blog', '/blog'),
  keyPage('Editorial policy', '/editorial-policy'),
].filter(Boolean).join('\n');

// Live cost guides other than the hub (the hub is a key page).
const costLines = LIVE_COST_GUIDES.filter((guide) => guide.path !== COST_HUB_PATH && routeOf.has(guide.path))
  .map((guide) => `- [${(guide.seo && guide.seo.title ? guide.seo.title.split(' | ')[0] : guide.path)}](${SITE_URL}${guide.path}): ${stripInline(guide.seo && guide.seo.description)}`)
  .join('\n');

const articleLines = POSTS.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${stripInline(p.excerpt)}`).join('\n');

const PROFILE_LABELS = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  x: 'X (Twitter)',
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
// The blockquote is the entity description: BUSINESS.shortDescription, the
// one sentence every listing and summary reuses.
out('llms.txt', doc(
  `# ${SITE_NAME}`,
  `> ${BUSINESS.shortDescription || BUSINESS.description} Phone: ${SITE_PHONE}. ${SERVICE_AREA_STATEMENT}`,
  BUSINESS.disambiguatingDescription,
  // Experience and project count confirmed by the owner 2026-10-13 (O-2).
  `${SITE_NAME} is a service-area renovation and construction contractor based in Winnipeg, Manitoba,
with over ${EXPERIENCE_YEARS} years of combined experience and more than ${PROJECT_COUNT} completed projects. Quotes are free and
written, every project starts with a free on-site visit, and permits and inspections are coordinated
with the City of Winnipeg or the local municipality when a project requires them.`,
  `## Services\n${serviceLines}`,
  `## Key pages\n${keyPages}`,
  costLines && `## Renovation cost guides\n${costLines}`,
  articleLines && `## Articles\n${articleLines}`,
  `## Contact
- Phone: ${SITE_PHONE}
- Email: ${BUSINESS.email}
- Location: Winnipeg, Manitoba, Canada
- Service area: ${SERVICE_AREA_STATEMENT}
- Quote requests (instant price estimator): ${SITE_URL}/instant-quote
- Book a free on-site visit: ${SITE_URL}/book-online
- Contact form: ${SITE_URL}/contact-us`,
  profileLines && `## Profiles\n${profileLines}`,
));

/* --------------------------------------------------------- llms-full.txt */
// The site's own question-and-answer set: the FAQ page plus every service
// page's FAQs, word for word as they appear on the site. An answer's
// paragraphs (a blank line in `a`) are joined into one line.
const qa = (faqs) =>
  faqs.map((f) => `**Q: ${stripInline(f.q)}**\nA: ${stripInline(f.a).replace(/\s*\n\s*/g, ' ')}`).join('\n\n');

// PROJECTS = live service pages' content, each with its `path`.
const navLabelFor = new Map(LIVE_SERVICE_PAGES.map(({ service }) => [service.path, service.navLabel]));
// Live, indexable cost guides (hub first), for the full reference.
const liveCostGuides = LIVE_COST_GUIDES.filter((guide) => routeOf.has(guide.path) && !routeOf.get(guide.path).noindex);
const costGuideTitle = (guide) => (guide.seo && guide.seo.title ? guide.seo.title.split(' | ')[0] : guide.path);
const fullCostLines = [
  keyPage('Renovation costs in Winnipeg', COST_HUB_PATH),
  costLines,
].filter(Boolean).join('\n');
const faqBlocks = [
  SITE_FAQS.length ? `### General questions\n${SITE_URL}/faqs\n\n${qa(SITE_FAQS)}` : null,
  ...PROJECTS.filter((p) => p.faqs && p.faqs.length).map((project) => {
    const heading = navLabelFor.get(project.path) || project.breadcrumb || project.slug;
    return `### ${heading}\n${SITE_URL}${project.path}\n\n${qa(project.faqs)}`;
  }),
  ...liveCostGuides.filter((guide) => guide.faqs && guide.faqs.length).map(
    (guide) => `### ${costGuideTitle(guide)}\n${SITE_URL}${guide.path}\n\n${qa(guide.faqs)}`
  ),
].filter(Boolean);

// Inline markup in post text (src/components/RichBody.jsx renderInline) as
// plain text: [label](/path) -> "label (https://site/path)", external links
// keep their own URL, **bold** loses its asterisks.
const plainText = (text) =>
  String(text || '')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (all, label, href) => `${label} (${href.startsWith('/') ? `${SITE_URL}${href}` : href})`)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .trim();

// Each published post's hand-written "Quick answer" (blog-raw `answer`, shown
// above the article body), word for word. Posts without one are left out.
const answeredPosts = POSTS.filter((post) => String(post.answer || '').trim());
const quickAnswers = answeredPosts
  .map((post) => `### ${post.title}\n${SITE_URL}/blog/${post.slug}\n${plainText(post.answer)}`)
  .join('\n\n');

out('llms-full.txt', doc(
  `# ${SITE_NAME} — full reference`,
  `> ${BUSINESS.shortDescription || BUSINESS.description}`,
  BUSINESS.disambiguatingDescription,
  // Office hours, reply time, experience and project count: src/data/facts.js.
  `Phone: ${SITE_PHONE} · Email: ${BUSINESS.email} · Winnipeg, Manitoba, Canada · Free written quotes · Office hours: ${OFFICE_HOURS_TEXT} · Replies within ${REPLY_TIME} · Over ${EXPERIENCE_YEARS} years combined experience · More than ${PROJECT_COUNT} projects completed`,
  `## Services offered\n${serviceLines}`,
  `## Service area\n${SERVICE_AREA_STATEMENT}\n\nCommunities: ${SERVICE_AREA_NAMES.join(', ')}`,
  BUSINESS.knowsAbout && BUSINESS.knowsAbout.length &&
    `## Expertise\n${BUSINESS.knowsAbout.map((k) => `- ${k}`).join('\n')}`,
  profileLines && `## Profiles\n${profileLines}`,
  fullCostLines && `## Renovation cost guides\n${fullCostLines}`,
  faqBlocks.length && `## Frequently asked questions\n\n${faqBlocks.join('\n\n')}`,
  quickAnswers && `## Quick answers\n\n${quickAnswers}`,
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

console.log(`sitemap: ${urls.length} urls (${PAGES.length} pages, ${POSTS.length} posts)`);
console.log(`noindex (prerendered, not in sitemap): ${NOINDEX_PAGES.join(', ') || 'none'}`);
console.log(`prerender-routes.json: ${prerenderRoutes.length} routes`);
console.log('robots: one group for all crawlers (Disallow: /api/)');
console.log(`llms.txt + llms-full.txt written (${faqBlocks.length} FAQ blocks, ${answeredPosts.length} quick answers)`);
console.log('sitewide JSON-LD injected into index.html');
