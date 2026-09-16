/**
 * Build-time head model: the single function the prerenderer uses to produce
 * <head> for any route. It calls exactly the same schema builders the runtime
 * hook does, so the static HTML and the client render cannot drift.
 * Only the build imports this — it pulls in all site data, which should never
 * reach the browser bundle.
 */
import { getPostBySlug } from './blogPosts.js';
import { SITE_FAQS } from './faqs.js';
import { buildPostHead } from './postContent.js';
import { getProject } from './projects.js';
import { BLOG_POSTS } from './blogPosts.js';
import { SITE_URL } from './siteConfig.js';
import {
  DEFAULT_IMAGE,
  ROUTE_PAGE_TYPES,
  ROUTE_TRAILS,
  SERVICE_SEO,
  buildBreadcrumbs,
  buildFaqPage,
  buildService,
  buildWebPage,
  graph,
  seoFor,
} from './seo.js';

const SERVICE_PROJECTS = {
  '/services/whole-home-renovations': 'whole-home-renovation',
  '/services/bathroom-renovations': 'bathroom-renovation',
  '/services/kitchen-renovations': 'kitchen-renovation',
  '/services/basement-renovations': 'basement-renovation',
  '/services/home-extensions': 'home-extension',
  '/services/commercial-renovations': 'commercial-renovation',
};

export function headFor(path) {
  if (path.startsWith('/blog/')) {
    const post = getPostBySlug(path.slice('/blog/'.length));
    return post ? buildPostHead(post) : null;
  }

  const meta = seoFor(path);
  if (!meta.title) return null;

  let faqs = null;
  let image = meta.image;

  if (path === '/faqs') faqs = SITE_FAQS;

  const blogNode =
    path === '/blog'
      ? {
          '@type': 'Blog',
          '@id': `${SITE_URL}/blog#blog`,
          name: 'Bridgeland Builders Blog',
          url: `${SITE_URL}/blog`,
          description: meta.description,
          inLanguage: 'en-CA',
          blogPost: BLOG_POSTS.map((post) => ({
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.metaDescription,
            datePublished: post.date,
            image: post.hero,
            url: `${SITE_URL}/blog/${post.slug}`,
          })),
        }
      : null;

  if (path === '/blog') image = image || (BLOG_POSTS[0] && BLOG_POSTS[0].hero);

  const projectSlug = SERVICE_PROJECTS[path];
  if (projectSlug) {
    const project = getProject(projectSlug);
    faqs = project.faqs;
    image = image || (project.intro && project.intro.image);
  }

  return {
    title: meta.title,
    description: meta.description,
    path,
    image: image || DEFAULT_IMAGE,
    jsonLd: graph(
      buildWebPage({
        path,
        title: meta.title,
        description: meta.description,
        type: ROUTE_PAGE_TYPES[path],
      }),
      buildBreadcrumbs(ROUTE_TRAILS[path] || []),
      SERVICE_SEO[path]
        ? buildService({ path, serviceType: SERVICE_SEO[path].serviceType, description: meta.description })
        : null,
      buildFaqPage(path, faqs),
      blogNode
    ),
  };
}

/** The 404 page is rendered but never indexed. */
export const NOT_FOUND_HEAD = {
  title: 'Page Not Found | Bridgeland Builders',
  description: 'That page does not exist. Browse our Winnipeg renovation services or get in touch for a free quote.',
  robots: 'noindex, follow',
};
