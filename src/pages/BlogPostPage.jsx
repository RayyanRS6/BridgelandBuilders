import { lazy, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import CtaBanner from '../components/CtaBanner.jsx';
import FaqAccordion from '../components/FaqAccordion.jsx';
import Picture from '../components/Picture.jsx';
import RichBody, { renderInline } from '../components/RichBody.jsx';
import BlogCard, { formatPostDate, hasPost, loadPost } from '../components/BlogCard.jsx';
import { ArrowRightIcon, CalendarIcon, ClockIcon } from '../components/icons.jsx';
import { personById, personPath } from '../data/people.js';
import { serviceByPath } from '../data/services.js';
import { INSTANT_QUOTE_LABEL, INSTANT_QUOTE_PATH, SITE_PHONE, SITE_PHONE_TEL } from '../data/siteConfig.js';
import { buildPostHead } from '../data/postContent.js';
import useSeo from '../hooks/useSeo.js';
import { keepServerHtml, lazyWithRetry, onInitialPage, retryLoad } from '../lib/lazyRetry.js';

// Only an unknown slug renders it, so it is not part of a post's first load.
const NotFoundPage = lazyWithRetry(() => import('./NotFoundPage.jsx'));

/** The article column is at most 880px wide and full width below that. */
const ARTICLE_IMAGE_SIZES = '(max-width: 920px) 100vw, 880px';

// Topic clusters that span every kind of project (permits in general, paying
// for a renovation, planning, hiring a contractor, energy rebates): a post in
// one of them that names several services is not about any single service.
const GENERAL_CLUSTERS = ['winnipeg-permits', 'renovation-money', 'renovation-planning', 'hiring-a-contractor', 'energy-rebates'];

/**
 * The post's secondary CTA: its service page when the post is about one
 * service, else the services hub. A post is general when it names four or
 * more services, or several in a general cluster; a single-service post
 * (e.g. basement permits) keeps its service. A service whose page is not live
 * yet also falls back to the hub.
 */
function serviceCta(post) {
  const services = post.services || [];
  const general = services.length >= 4 || (services.length > 1 && GENERAL_CLUSTERS.includes(post.cluster));
  const service = !general && services[0] ? serviceByPath(services[0]) : null;
  return service && service.status === 'live'
    ? { to: service.path, label: `See our ${service.label || service.navLabel}` }
    : { to: '/services', label: 'See all our services' };
}

/**
 * One React.lazy page per post, created once and kept for the session so
 * React sees a stable component (and a post that already loaded renders
 * without suspending). The post's generated module (src/data/posts/<slug>.js)
 * holds everything the page shows, related posts included, so the page never
 * loads a blog index. On the server, renderToPipeableStream waits for it
 * (entry-server.jsx onAllReady), so the prerendered HTML holds the whole
 * article; in the browser that HTML stays until the same module (modulepreloaded
 * by scripts/prerender.mjs) has loaded.
 */
const PAGES = new Map();
function lazyPostPage(slug) {
  if (!PAGES.has(slug)) {
    PAGES.set(
      slug,
      lazy(() =>
        retryLoad(() => loadPost(slug))
          .then((post) => ({
            default: function LoadedPost() {
              return <PostPage post={post} />;
            },
          }))
          .catch((error) => {
            // On the prerendered first page the server HTML stays in place
            // (lib/lazyRetry.js); otherwise RouteErrorBoundary takes over and
            // the next visit to this post tries again.
            if (!onInitialPage()) PAGES.delete(slug);
            return keepServerHtml(error);
          })
      )
    );
  }
  return PAGES.get(slug);
}

function PersonLink({ id }) {
  const person = personById(id);
  if (!person) return null;
  return <Link to={personPath(id)}>{person.name}</Link>;
}

export default function BlogPostPage() {
  const { slug } = useParams();

  // Unknown or unpublished slug: the host serves 404.html (with a 404 status)
  // for it, so render the same 404 page and hydration matches. Retired posts
  // never reach here: vercel.json redirects them before the page loads.
  if (!hasPost(slug)) return <NotFoundPage />;

  const Page = lazyPostPage(slug);
  return <Page />;
}

/**
 * The whole post page. It also owns the <head> sync (the same buildPostHead
 * the prerender uses): on first load the prerendered head already matches,
 * so nothing changes.
 */
function PostPage({ post }) {
  const head = useMemo(() => buildPostHead(post), [post]);
  useSeo(head);

  const faqs = useMemo(
    () => (post.faqs || []).map((item) => ({ q: item.q, a: renderInline(item.a, 'faq') })),
    [post]
  );
  const sources = post.sources || [];
  const related = post.related || [];
  const updated = post.updated && post.updated !== post.date ? post.updated : null;
  // Only a real hero photo is shown here. A post without one has a title card
  // (scripts/build-images.mjs) for its og:image and blog card, but on the post
  // itself it would repeat the H1, so the article starts with the text.
  const heroSrc = post.hero ? post.heroSrc || post.hero : null;

  const serviceLink = serviceCta(post);

  return (
    <main>
      <section className="page-hero blog-post-hero">
        <div className="container">
          <div className="page-hero-card hero-rise">
            <nav className="blog-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden="true">/</span>
              <Link to="/blog">Blog</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{post.title}</span>
            </nav>
            <span className="section-tag">{post.category}</span>
            <h1>{post.title}</h1>
            <p>{post.excerpt}</p>
            <div className="blog-post-meta">
              <span className="blog-meta-item blog-byline">
                {personById(post.author) ? (
                  <>By <PersonLink id={post.author} /></>
                ) : (
                  // Until named authors are added (people.js), the team byline
                  // links to how our pages are written and checked.
                  <>By the <Link to="/editorial-policy">Bridgeland Builders team</Link></>
                )}
              </span>
              {personById(post.reviewedBy) && (
                <span className="blog-meta-item blog-byline">
                  Reviewed by <PersonLink id={post.reviewedBy} />
                </span>
              )}
              <span className="blog-meta-item">
                <CalendarIcon size={15} /> <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              </span>
              {updated && (
                <span className="blog-meta-item">
                  Updated <time dateTime={updated}>{formatPostDate(updated)}</time>
                </span>
              )}
              <span className="blog-meta-item"><ClockIcon size={15} /> {post.readMinutes} min read</span>
            </div>
          </div>
        </div>
      </section>

      <article className="blog-article-section">
        <div className="container blog-article-container">
          {heroSrc && (
            <figure className="blog-hero-figure hero-rise">
              <Picture
                avifSrcSet={post.heroAvifSrcSet}
                srcSet={post.heroSrcSet}
                sizes={ARTICLE_IMAGE_SIZES}
                src={heroSrc}
                alt={post.heroAlt}
                width="880"
                height="495"
                fetchpriority="high"
              />
            </figure>
          )}

          <div className="blog-article-body">
            {post.answer && (
              <aside className="blog-takeaways blog-answer">
                <h2>Quick answer</h2>
                <p>{renderInline(post.answer, 'answer')}</p>
              </aside>
            )}

            <RichBody blocks={post.blocks} />

            {faqs.length > 0 && (
              <div className="blog-faq-block">
                <h2>{post.faqsTitle || 'Frequently Asked Questions'}</h2>
                <FaqAccordion items={faqs} headingLevel={3} />
              </div>
            )}

            {sources.length > 0 && (
              <div className="blog-sources-block">
                <h2>Sources</h2>
                <ol className="blog-sources">
                  {sources.map((source) => (
                    <li key={source.url}>
                      <a href={source.url} rel="noopener" target="_blank">{source.label}</a>
                      {source.accessed && (
                        <span className="blog-source-date">
                          {' '}(verified <time dateTime={source.accessed}>{formatPostDate(source.accessed)}</time>)
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {post.memberOnly && (
              <aside className="blog-member-note">
                <p>
                  The full version of this article is published for subscribers on our original blog.
                  Get in touch and we will happily walk you through the details.
                </p>
              </aside>
            )}

            <div className="blog-post-cta">
              <div>
                <h3>Planning a project like this in Winnipeg?</h3>
                <p>Tell us what you have in mind and we will put together a clear, written quote.</p>
              </div>
              <div className="blog-post-cta-actions">
                <Link className="btn-pill-red" to={INSTANT_QUOTE_PATH} data-cta="blog-post-quote">
                  <span>{INSTANT_QUOTE_LABEL.toUpperCase()}</span>
                  <ArrowRightIcon size={14} />
                </Link>
                <Link className="btn-pill-ghost" to={serviceLink.to} data-cta="blog-post-service">
                  {serviceLink.label}
                </Link>
                <p className="blog-post-cta-call">
                  or call <a href={SITE_PHONE_TEL} data-cta="blog-post-call">{SITE_PHONE}</a>
                </p>
              </div>
            </div>

            <Link className="blog-back-link" to="/blog">← Back to all articles</Link>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="blog-related-section">
          <div className="container">
            <span className="section-tag">Keep reading</span>
            <h2 className="blog-related-heading">Related articles</h2>
            <div className="blog-grid">
              {related.map((item) => (
                <div className="reveal" key={item.slug}>
                  <BlogCard post={item} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBanner />
    </main>
  );
}
