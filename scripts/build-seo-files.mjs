/**
 * Generates every static SEO/AEO artefact from one source of truth:
 *   public/robots.txt   — crawler rules, including explicit AI-crawler access
 *   public/sitemap.xml  — all routes, with image entries for blog posts
 *   public/llms.txt     — concise site map for AI answer engines
 *   public/llms-full.txt— fuller context (services, FAQs, article index)
 *   public/_headers     — cache + security headers for Netlify
 *   public/_redirects   — SPA rules with a real 404 status
 *   index.html          — sitewide JSON-LD injected between markers
 *   prerender-routes.json
 */
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { BLOG_POSTS } from '../src/data/blogPosts.js';
import { SITE_URL, SITE_NAME, SITE_PHONE, BUSINESS, SERVICE_CATALOG } from '../src/data/siteConfig.js';
import { NOINDEX_ROUTES, PAGE_SEO, SERVICE_SEO, buildOrganizationGraph } from '../src/data/seo.js';

const PUBLIC = new URL('../public/', import.meta.url);
const out = (name, body) => writeFileSync(new URL(name, PUBLIC), body);
mkdirSync(PUBLIC, { recursive: true });

const today = new Date().toISOString().slice(0, 10);

/* ---------------------------------------------------------------- routes */
const STATIC_ROUTES = [
  ['/', '1.0', 'weekly'],
  ['/services', '0.9', 'monthly'],
  ...Object.keys(SERVICE_SEO).map((path) => [path, '0.8', 'monthly']),
  ['/projects', '0.7', 'monthly'],
  ['/about-us', '0.6', 'yearly'],
  ['/our-process', '0.6', 'yearly'],
  ['/faqs', '0.7', 'yearly'],
  ['/outside-winnipeg', '0.5', 'yearly'],
  ['/contact-us', '0.8', 'yearly'],
  ['/book-online', '0.8', 'monthly'],
  ['/blog', '0.9', 'weekly'],
];

const urls = [
  ...STATIC_ROUTES.map(([path, priority, freq]) => ({ path, priority, freq, lastmod: today })),
  ...BLOG_POSTS.map((post) => ({
    path: `/blog/${post.slug}`,
    priority: '0.7',
    freq: 'monthly',
    lastmod: post.date,
    image: post.hero,
    imageAlt: post.heroAlt,
    title: post.title,
  })),
];

/* --------------------------------------------------------------- sitemap */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

out('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map((u) => `  <url>
    <loc>${SITE_URL}${u.path}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>${
      u.image
        ? `
    <image:image>
      <image:loc>${esc(u.image)}</image:loc>
      <image:title>${esc(u.title)}</image:title>
      <image:caption>${esc(u.imageAlt || u.title)}</image:caption>
    </image:image>`
        : ''
    }
  </url>`)
  .join('\n')}
</urlset>
`);

/* ---------------------------------------------------------------- robots */
// Search crawlers and AI answer engines are both allowed on purpose: being
// quotable in ChatGPT/Claude/Perplexity answers is the point of the AEO work.
const AI_AGENTS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot',
  'anthropic-ai', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot',
  'Applebot-Extended', 'Amazonbot', 'meta-externalagent', 'FacebookBot', 'Bytespider',
  'CCBot', 'cohere-ai', 'DuckAssistBot', 'MistralAI-User', 'YouBot', 'Diffbot',
];

out('robots.txt', `# ${SITE_NAME} — ${SITE_URL}
# Search engines: full access.
User-agent: *
Allow: /
Disallow: /404.html

# AI assistants and answer engines: explicitly welcome to read and cite this site.
${AI_AGENTS.map((agent) => `User-agent: ${agent}\nAllow: /`).join('\n\n')}

Sitemap: ${SITE_URL}/sitemap.xml
`);

/* ------------------------------------------------------------- llms.txt */
const serviceLines = SERVICE_CATALOG.map(
  (s) => `- [${s.name}](${SITE_URL}${s.path}): ${(SERVICE_SEO[s.path] || {}).description || ''}`
).join('\n');

out('llms.txt', `# ${SITE_NAME}

> ${BUSINESS.description} Phone: ${SITE_PHONE}. Service area: Winnipeg and surrounding Manitoba.

${SITE_NAME} is a service-area renovation and construction contractor based in Winnipeg, Manitoba,
with over 60 years of combined experience and 100+ completed projects. Quotes are free and written,
and permits and inspections are coordinated with the City of Winnipeg when a project requires them.

## Services
${serviceLines}

## Key pages
- [Home](${SITE_URL}/): ${PAGE_SEO['/'].description}
- [All services](${SITE_URL}/services): ${PAGE_SEO['/services'].description}
- [Our process](${SITE_URL}/our-process): ${PAGE_SEO['/our-process'].description}
- [Projects](${SITE_URL}/projects): ${PAGE_SEO['/projects'].description}
- [FAQs](${SITE_URL}/faqs): ${PAGE_SEO['/faqs'].description}
- [Contact](${SITE_URL}/contact-us): ${PAGE_SEO['/contact-us'].description}
- [Book online](${SITE_URL}/book-online): ${PAGE_SEO['/book-online'].description}
- [Blog](${SITE_URL}/blog): ${PAGE_SEO['/blog'].description}

## Articles
${BLOG_POSTS.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.excerpt}`).join('\n')}

## Contact
- Phone: ${SITE_PHONE}
- Location: Winnipeg, Manitoba, Canada
- Quote requests: ${SITE_URL}/contact-us
- Book an appointment: ${SITE_URL}/book-online
`);

/* --------------------------------------------------------- llms-full.txt */
// Same map plus the full question-and-answer set, so an assistant can answer
// directly from this one file.
const faqBlocks = BLOG_POSTS.filter((p) => !p.memberOnly)
  .map((post) => {
    const qa = [];
    let pending = null;
    for (const block of post.blocks) {
      const text = (block.x || '').trim();
      if (!text) continue;
      if (block.t === 'p' && text.length <= 160 && /\?$/.test(text)) pending = text;
      else if (pending) { qa.push(`**Q: ${pending}**\nA: ${text}`); pending = null; }
    }
    return qa.length ? `### ${post.title}\n${SITE_URL}/blog/${post.slug}\n\n${qa.join('\n\n')}` : null;
  })
  .filter(Boolean);

out('llms-full.txt', `# ${SITE_NAME} — full reference

> ${BUSINESS.description}

Phone: ${SITE_PHONE} · Winnipeg, Manitoba, Canada · Free written quotes

## Services offered
${serviceLines}

## Areas served
${BUSINESS.areaServed.join(', ')}

## Expertise
${BUSINESS.knowsAbout.map((k) => `- ${k}`).join('\n')}

## Questions and answers from our articles
${faqBlocks.join('\n\n')}
`);

/* -------------------------------------------------------------- headers */
out('_headers', `/assets/*
  Cache-Control: public, max-age=31536000, immutable

/favicon.svg
  Cache-Control: public, max-age=604800

/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: geolocation=(), microphone=(), camera=()

/sitemap.xml
  Cache-Control: public, max-age=3600
  Content-Type: application/xml; charset=utf-8

/robots.txt
  Cache-Control: public, max-age=3600

/llms.txt
  Content-Type: text/plain; charset=utf-8
  Cache-Control: public, max-age=3600

/llms-full.txt
  Content-Type: text/plain; charset=utf-8
  Cache-Control: public, max-age=3600
`);

/* ------------------------------------------------------------ redirects */
// Every real route is prerendered to its own HTML file, so anything reaching
// the catch-all genuinely does not exist and should return a true 404 rather
// than a soft 404 (a 200 that renders a "not found" page).
out('_redirects', `/index.html   /   301!
/*            /404.html   404
`);

/* --------------------------------------------- sitewide JSON-LD in index */
const indexUrl = new URL('../index.html', import.meta.url);
let html = readFileSync(indexUrl, 'utf8');
const jsonLd = JSON.stringify({ '@context': 'https://schema.org', '@graph': buildOrganizationGraph() });
html = html.replace(
  /<!-- seo:jsonld:start -->[\s\S]*?<!-- seo:jsonld:end -->/,
  `<!-- seo:jsonld:start -->\n  <script type="application/ld+json">${jsonLd}</script>\n  <!-- seo:jsonld:end -->`
);
writeFileSync(indexUrl, html);

/* ------------------------------------------------------ prerender routes */
// Everything in the sitemap, plus the noindex pages (ad landing pages). Those
// stay out of the sitemap but still need real HTML: on Vercel a route with no
// prerendered file is served as a 404.
writeFileSync(
  new URL('../prerender-routes.json', import.meta.url),
  JSON.stringify([...urls.map((u) => u.path), ...NOINDEX_ROUTES], null, 2)
);

console.log(`sitemap: ${urls.length} urls (${BLOG_POSTS.length} with images)`);
console.log(`noindex (prerendered, not in sitemap): ${NOINDEX_ROUTES.join(', ') || 'none'}`);
console.log(`robots: ${AI_AGENTS.length} AI agents allowed`);
console.log(`llms.txt + llms-full.txt written (${faqBlocks.length} article Q&A blocks)`);
console.log('sitewide JSON-LD injected into index.html');
