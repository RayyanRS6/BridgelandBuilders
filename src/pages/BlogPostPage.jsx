import { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import CtaBanner from '../components/CtaBanner.jsx';
import FaqAccordion from '../components/FaqAccordion.jsx';
import BlogCard, { formatPostDate } from '../components/BlogCard.jsx';
import { ArrowRightIcon, CalendarIcon, ClockIcon } from '../components/icons.jsx';
import { useQuoteModal } from '../context/QuoteModalContext.jsx';
import { getPostBySlug, getRelatedPosts } from '../data/blogPosts.js';
import { buildFaqItems, buildPostHead, buildSections } from '../data/postContent.js';
import useSeo from '../hooks/useSeo.js';
import useScrollReveal from '../hooks/useScrollReveal.js';

/** Renders body blocks, merging runs of list items into a single list. */
function renderBody(items, keyPrefix) {
  const nodes = [];
  let list = [];

  const flushList = () => {
    if (!list.length) return;
    nodes.push(
      <ul className="blog-list" key={`${keyPrefix}-ul-${nodes.length}`}>
        {list.map((item, index) => (
          <li key={`${item.slice(0, 40)}-${index}`}>{item}</li>
        ))}
      </ul>
    );
    list = [];
  };

  items.forEach((block, index) => {
    const key = `${keyPrefix}-${index}`;
    if (block.t === 'li') {
      list.push(block.x);
      return;
    }
    flushList();

    if (block.t === 'img') {
      nodes.push(
        <figure className="blog-figure" key={key}>
          <img src={block.src} alt={block.alt || ''} width="880" height="495" loading="lazy" decoding="async" />
        </figure>
      );
    } else if (block.t === 'h2') {
      nodes.push(<h2 key={key}>{block.x}</h2>);
    } else if (block.t === 'h3') {
      nodes.push(<h3 key={key}>{block.x}</h3>);
    } else if (block.t === 'h4') {
      nodes.push(<h4 key={key}>{block.x}</h4>);
    } else if (block.t === 'q') {
      nodes.push(<blockquote key={key}>{block.x}</blockquote>);
    } else {
      nodes.push(<p key={key}>{block.x}</p>);
    }
  });

  flushList();
  return nodes;
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);
  const { openModal } = useQuoteModal();
  useScrollReveal();

  const sections = useMemo(() => (post ? buildSections(post.blocks) : []), [post]);
  const faqSection = sections.find((section) => section.type === 'faq');
  const faqData = useMemo(
    () => (faqSection ? buildFaqItems(faqSection.items) : { lead: [], faqs: [] }),
    [faqSection]
  );

  const head = useMemo(() => (post ? buildPostHead(post) : null), [post]);

  useSeo(
    head || { title: 'Article not found | Bridgeland Builders', robots: 'noindex, follow' }
  );

  if (!post) return <Navigate to="/blog" replace />;

  const related = getRelatedPosts(post);

  return (
    <main>
      <section className="page-hero blog-post-hero">
        <div className="container">
          <div className="page-hero-card reveal">
            <nav className="blog-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden="true">/</span>
              <Link to="/blog">Blog</Link>
            </nav>
            <span className="section-tag">{post.category}</span>
            <h1>{post.title}</h1>
            <p>{post.excerpt}</p>
            <div className="blog-post-meta">
              <span className="blog-meta-item"><CalendarIcon size={15} /> {formatPostDate(post.date)}</span>
              <span className="blog-meta-item"><ClockIcon size={15} /> {post.readMinutes} min read</span>
            </div>
          </div>
        </div>
      </section>

      <article className="blog-article-section">
        <div className="container blog-article-container">
          <figure className="blog-hero-figure reveal">
            <img src={post.hero} alt={post.heroAlt} width="880" height="495" fetchpriority="high" decoding="async" />
          </figure>

          <div className="blog-article-body reveal">
            {sections.map((section, sectionIndex) => {
              if (section.type === 'takeaways') {
                const points = section.items.filter((block) => block.x).map((block) => block.x);
                return (
                  <aside className="blog-takeaways" key={`takeaways-${sectionIndex}`}>
                    <h2>{section.heading}</h2>
                    <ul>
                      {points.map((point, index) => (
                        <li key={`${point.slice(0, 40)}-${index}`}>{point}</li>
                      ))}
                    </ul>
                  </aside>
                );
              }

              if (section.type === 'faq') {
                return (
                  <div className="blog-faq-block" key={`faq-${sectionIndex}`}>
                    <h2>{section.heading}</h2>
                    {faqData.lead.map((text, index) => (
                      <p key={`faq-lead-${index}`}>{text}</p>
                    ))}
                    {faqData.faqs.length > 0 && <FaqAccordion items={faqData.faqs} />}
                  </div>
                );
              }

              return (
                <div key={`body-${sectionIndex}`}>{renderBody(section.items, `s${sectionIndex}`)}</div>
              );
            })}

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
              <button className="btn-pill-red" type="button" onClick={openModal}>
                <span>GET INSTANT QUOTE</span>
                <ArrowRightIcon size={14} />
              </button>
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
