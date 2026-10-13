/**
 * Build-time head model: the single function the prerenderer uses to produce
 * <head> for any route. It calls exactly the same schema builders the runtime
 * hook does (pageGraph, buildBlogNode, buildPostHead), so the static HTML and
 * the client render cannot drift.
 * Only the build imports this — it pulls in all site data, which should never
 * reach the browser bundle.
 */
import { BLOG_POSTS, getPostBySlug } from './blogPosts.js';
import { SITE_FAQS } from './faqs.js';
import { buildPostHead } from './postContent.js';
import { getProject } from './projects.js';
import { DEFAULT_IMAGE, SERVICE_SEO, buildBlogNode, pageGraph, seoFor, updatedFor } from './seo.js';

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
  const nodes = [];

  if (path === '/faqs') faqs = SITE_FAQS;

  if (path === '/blog') {
    nodes.push(buildBlogNode({ posts: BLOG_POSTS, description: meta.description }));
    // Same image BlogPage.jsx sets at runtime: the latest post's 1200x630 JPEG.
    image = image || (BLOG_POSTS[0] && (BLOG_POSTS[0].ogImage || BLOG_POSTS[0].hero));
  }

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
    robots: meta.robots,
    updated: updatedFor(path),
    jsonLd: pageGraph({
      path,
      title: meta.title,
      description: meta.description,
      serviceType: SERVICE_SEO[path] ? SERVICE_SEO[path].serviceType : undefined,
      faqs,
      nodes,
    }),
  };
}

/** The 404 page is rendered but never indexed. */
export const NOT_FOUND_HEAD = {
  title: 'Page Not Found | Bridgeland Builders',
  description: 'That page does not exist. Browse our Winnipeg renovation services or get in touch for a free quote.',
  robots: 'noindex, follow',
};
