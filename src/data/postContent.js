/**
 * Blog post schema, shared by the post page (runtime, BlogPostPage.jsx) and
 * the build-time SEO layer (head.js), so the static HTML and the client
 * render always emit the same JSON-LD.
 *
 * The prerender passes a full post from blogPosts.js (metadata + body); the
 * page passes its lazily loaded post module (src/data/posts/<slug>.js), which
 * is the same post plus its related cards, so the output is identical.
 */
import { SITE_URL } from './siteConfig.js';
import { PEOPLE, personPath } from './people.js';
import { serviceByPath } from './services.js';
import { buildBreadcrumbs, buildFaqPage, buildWebPage, graph, isoWinnipeg, organizationRef } from './seo.js';

// ISO 8601 with the America/Winnipeg offset (-06:00 / -05:00); lives in seo.js
// so the /blog Blog node formats dates identically.
export { isoWinnipeg };

/**
 * Plain text of the inline markup RichBody renders ([label](url) → label,
 * **bold** → bold), for schema and meta text.
 */
export function plainText(text) {
  return String(text || '')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1');
}

const absolute = (url) => (url && !/^https?:\/\//.test(url) ? `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}` : url);

/** Person node for a people.js id (its profile lives on /about-us), or null. */
export function buildPersonNode(id) {
  const person = id && Object.prototype.hasOwnProperty.call(PEOPLE, id) ? PEOPLE[id] : null;
  if (!person) return null;
  const url = `${SITE_URL}${personPath(id)}`;
  return {
    '@type': 'Person',
    '@id': url,
    name: person.name,
    jobTitle: person.role || undefined,
    url,
    image: absolute(person.image) || undefined,
    sameAs: person.sameAs && person.sameAs.length ? person.sameAs : undefined,
    knowsAbout: person.knowsAbout && person.knowsAbout.length ? person.knowsAbout : undefined,
    worksFor: organizationRef,
  };
}

/** Service pages a post is about — live pages only, so every @id resolves. */
function aboutServices(paths) {
  return (paths || [])
    .filter((path) => {
      const service = serviceByPath(path);
      return service && service.status === 'live';
    })
    .map((path) => ({ '@id': `${SITE_URL}${path}#service` }));
}

// The post's own 1200x630 Open Graph JPEG (scripts/build-images.mjs: the hero
// photo's crop or the title card), not a remote original or the site default.
const OWN_OG_IMAGE = /^\/images\/.+-1200x630\.[a-f0-9]{8}\.jpe?g$/i;

/**
 * Everything the <head> needs for one blog post.
 * @param {object} post  a full post: blogPosts.js, or the post's own module
 *                       (src/data/posts/<slug>.js)
 * @param {object} [body] the post's body ({ faqs, sources, reviewedBy, ... });
 *                        defaults to `post`, which carries it
 */
export function buildPostHead(post, body = post) {
  const path = `/blog/${post.slug}`;
  const url = `${SITE_URL}${path}`;
  const updated = post.updated || post.date;
  const published = isoWinnipeg(post.date);
  const modified = isoWinnipeg(updated);
  // Absolute, so the BlogPosting image is a full URL (the self-hosted OG files
  // are site-relative); og:image is made absolute the same way.
  const image = absolute(post.ogImage || post.hero);
  const breadcrumbs = buildBreadcrumbs([['Blog', '/blog'], [post.title, path]], path);

  const author = buildPersonNode(post.author);
  const reviewerId = post.reviewedBy || (body && body.reviewedBy) || '';
  const reviewer = reviewerId === post.author ? author : buildPersonNode(reviewerId);
  const sources = (body && body.sources) || [];
  // FAQPage only from the post's explicit faqs (blog-raw `faqs`).
  const faqs = ((body && body.faqs) || []).map((item) => ({ q: plainText(item.q), a: plainText(item.a) }));
  const about = aboutServices(post.services);

  const webPage = buildWebPage({
    path,
    title: post.metaTitle,
    description: post.metaDescription,
    breadcrumb: { '@id': breadcrumbs['@id'] },
    dateModified: modified,
    about: false,
    mainEntity: { '@id': `${url}#article` },
    primaryImage: OWN_OG_IMAGE.test(post.ogImage || '') ? { url: image, width: 1200, height: 630 } : undefined,
  });
  if (reviewer) webPage.reviewedBy = { '@id': reviewer['@id'] };

  const nodes = [
    webPage,
    {
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: post.title,
      description: post.metaDescription,
      image,
      datePublished: published,
      dateModified: modified,
      mainEntityOfPage: { '@id': `${url}#webpage` },
      // A named person only when they are on the About page (people.js);
      // otherwise the business, as a reference so the GeneralContractor
      // entity is not re-typed as a plain Organization.
      author: author ? { '@id': author['@id'] } : organizationRef,
      publisher: organizationRef,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: about.length ? about : undefined,
      citation: sources.length
        ? sources.map((source) => ({ '@type': 'CreativeWork', name: source.label, url: source.url }))
        : undefined,
      articleSection: post.category,
      inLanguage: 'en-CA',
    },
    breadcrumbs,
    author,
    reviewer && reviewer !== author ? reviewer : null,
    buildFaqPage(path, faqs),
  ];

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    path,
    image,
    imageAlt: post.heroAlt || post.title,
    type: 'article',
    publishedTime: published,
    modifiedTime: modified,
    updated,
    jsonLd: graph(...nodes),
  };
}
