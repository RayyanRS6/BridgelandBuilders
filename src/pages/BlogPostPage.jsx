import { lazy, Suspense, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import NotFoundPage from './NotFoundPage.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import FaqAccordion from '../components/FaqAccordion.jsx';
import Picture from '../components/Picture.jsx';
import RichBody, { renderInline } from '../components/RichBody.jsx';
import BlogCard, { formatPostDate, loadPostBody } from '../components/BlogCard.jsx';
import { ArrowRightIcon, CalendarIcon, ClockIcon } from '../components/icons.jsx';
import { getPostBySlug, getRelatedPosts } from '../data/blogIndex.js';
import { personById, personPath } from '../data/people.js';
import { serviceByPath } from '../data/services.js';
import { INSTANT_QUOTE_LABEL, INSTANT_QUOTE_PATH, SITE_PHONE, SITE_PHONE_TEL } from '../data/siteConfig.js';
import { buildPostHead } from '../data/postContent.js';
import useSeo from '../hooks/useSeo.js';
import { keepServerHtml, onInitialPage, retryLoad } from '../lib/lazyRetry.js';

/** The article column is at most 880px wide and full width below that. */
const ARTICLE_IMAGE_SIZES = '(max-width: 920px) 100vw, 880px';

/**
 * One React.lazy component per post body, created once and kept for the
 * session so React sees a stable component (and a body that already loaded
 * renders without suspending). On the server, renderToPipeableStream waits for
 * every boundary (entry-server.jsx onAllReady), so the prerendered HTML holds
 * the full body; on the client the boundary hydrates once the chunk arrives.
 */
const BODY_COMPONENTS = new Map();
function postBodyComponent(slug) {
  if (!BODY_COMPONENTS.has(slug)) {
    BODY_COMPONENTS.set(
      slug,
      lazy(() =>
        retryLoad(() => loadPostBody(slug)).then(
          (body) => ({
            default: function LoadedPostBody(props) {
              return <PostBody {...props} body={body} />;
            },
          }),
          (error) => {
            // Still missing after the retries. On the prerendered first page
            // the server HTML (the full article) stays in place: an error view
            // here would not match it and React would replace the article.
            if (onInitialPage()) return keepServerHtml(error);
            // After in-browser navigation there is no article on screen yet:
            // offer a reload instead of failing the whole page, and retry on
            // the next visit.
            BODY_COMPONENTS.delete(slug);
            return { default: PostBodyUnavailable };
          }
        )
      )
    );
  }
  return BODY_COMPONENTS.get(slug);
}

function PostBodyUnavailable({ post }) {
  return (
    <div>
      <p>
        This article did not finish loading. <a href={`/blog/${post.slug}`}>Reload the page</a> to read it.
      </p>
    </div>
  );
}

/**
 * The article body: quick answer, content blocks, FAQ and sources. It also
 * owns the page's <head> sync, because the post's FAQ and sources (part of
 * its JSON-LD) arrive with the body — on first load the prerendered head
 * already matches, so nothing changes.
 */
function PostBody({ post, body }) {
  const content = body || { blocks: [], faqs: [], sources: [] };
  const head = useMemo(() => buildPostHead(post, content), [post, content]);
  useSeo(head);

  const faqs = useMemo(
    () => (content.faqs || []).map((item) => ({ q: item.q, a: renderInline(item.a, 'faq') })),
    [content]
  );
  const sources = content.sources || [];

  return (
    <>
      {content.answer && (
        <aside className="blog-takeaways blog-answer">
          <h2>Quick answer</h2>
          <p>{renderInline(content.answer, 'answer')}</p>
        </aside>
      )}

      <RichBody blocks={content.blocks} />

      {faqs.length > 0 && (
        <div className="blog-faq-block">
          <h2>{content.faqsTitle || 'Frequently Asked Questions'}</h2>
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
    </>
  );
}

function PersonLink({ id }) {
  const person = personById(id);
  if (!person) return null;
  return <Link to={personPath(id)}>{person.name}</Link>;
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  // Unknown or unpublished slug: the host serves 404.html (with a 404 status)
  // for it, so render the same 404 page and hydration matches. Retired posts
  // never reach here: vercel.json redirects them before the page loads.
  if (!post) return <NotFoundPage />;

  const Body = postBodyComponent(post.slug);
  const related = getRelatedPosts(post);
  const updated = post.updated && post.updated !== post.date ? post.updated : null;
  // Only a real hero photo is shown here. A post without one has a title card
  // (scripts/build-images.mjs) for its og:image and blog card, but on the post
  // itself it would repeat the H1, so the article starts with the text.
  const heroSrc = post.hero ? post.heroSrc || post.hero : null;

  // Secondary CTA: the post's main service page once it is live, else the
  // services hub (e.g. general contracting while its page is a draft).
  const service = post.services && post.services[0] ? serviceByPath(post.services[0]) : null;
  const serviceLink =
    service && service.status === 'live'
      ? { to: service.path, label: `See our ${service.label || service.navLabel}` }
      : { to: '/services', label: 'See all our services' };

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
            <Suspense fallback={<div className="blog-body-loading" aria-busy="true" />}>
              <Body post={post} />
            </Suspense>

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
