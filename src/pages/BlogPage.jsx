import { useMemo, useState } from 'react';
import PageHero from '../components/PageHero.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import BlogCard from '../components/BlogCard.jsx';
import { BLOG_CATEGORIES, BLOG_POSTS } from '../data/blogPosts.js';
import { SITE_URL } from '../data/siteConfig.js';
import { buildBreadcrumbs, buildWebPage, graph, organizationNamed, seoFor } from '../data/seo.js';
import useSeo from '../hooks/useSeo.js';
import useScrollReveal from '../hooks/useScrollReveal.js';

const ALL = 'All Posts';

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState(ALL);
  useScrollReveal();

  const meta = seoFor('/blog');
  useSeo({
    title: meta.title,
    description: meta.description,
    path: '/blog',
    image: BLOG_POSTS[0] && BLOG_POSTS[0].hero,
    jsonLd: useMemo(
      () =>
        graph(
          buildWebPage({ path: '/blog', title: meta.title, description: meta.description, type: 'CollectionPage' }),
          buildBreadcrumbs([['Blog', '/blog']]),
          {
            '@type': 'Blog',
            '@id': `${SITE_URL}/blog#blog`,
            name: 'Bridgeland Builders Blog',
            url: `${SITE_URL}/blog`,
            description: meta.description,
            publisher: organizationNamed,
            inLanguage: 'en-CA',
            blogPost: BLOG_POSTS.map((post) => ({
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.excerpt,
              datePublished: post.date,
              image: post.hero,
              url: `${SITE_URL}/blog/${post.slug}`,
            })),
          }
        ),
      [meta.title, meta.description]
    ),
  });

  const posts = useMemo(
    () =>
      activeCategory === ALL
        ? BLOG_POSTS
        : BLOG_POSTS.filter((post) => post.categories.includes(activeCategory)),
    [activeCategory]
  );

  const [featured, ...rest] = posts;

  return (
    <main>
      <PageHero
        eyebrow="Blogs & Articles"
        title="RENOVATION ADVICE"
        highlight="FROM OUR CREW"
        description="Straight-talking guides on planning, budgeting, and getting renovation work done properly — written by the team behind Winnipeg renovations."
        primaryLink={{ to: '/services', label: 'VIEW OUR SERVICES' }}
      />

      <section className="blog-index-section">
        <div className="container">
          <div className="blog-filter-bar reveal">
            <span className="blog-filter-label">Browse by category</span>
            <div className="blog-filter-pills">
              {[ALL, ...BLOG_CATEGORIES].map((category) => (
                <button
                  type="button"
                  key={category}
                  className={`blog-filter-pill${category === activeCategory ? ' active' : ''}`}
                  aria-pressed={category === activeCategory}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {featured && (
            <div className="reveal">
              <BlogCard post={featured} featured />
            </div>
          )}

          <div className="blog-grid">
            {rest.map((post) => (
              <div className="reveal" key={post.slug}>
                <BlogCard post={post} />
              </div>
            ))}
          </div>

          {posts.length === 0 && (
            <p className="blog-empty">No articles in this category yet. Check back soon.</p>
          )}
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}
