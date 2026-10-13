import PageHero from '../components/PageHero.jsx';
import FaqAccordion from '../components/FaqAccordion.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import { formatPostDate } from '../components/BlogCard.jsx';
import { FAQ_GROUPS, FAQ_SOURCES, SITE_FAQS } from '../data/faqs.js';
import { usePageSeo } from '../hooks/useSeo.js';

/**
 * Grouped FAQs: one H2 per topic, each question an H3 (FaqAccordion
 * headingLevel 3). Every answer is in the HTML (closed ones are `hidden`), and
 * the FAQPage schema comes from the same flat list (SITE_FAQS) that head.js
 * passes for the prerender. No `.reveal` around the lists, so the answers are
 * never held at opacity 0.
 */
export default function FaqsPage() {
  usePageSeo('/faqs', { faqs: SITE_FAQS });

  return (
    <main>
      <PageHero
        eyebrow="Renovation FAQs"
        title="WINNIPEG RENOVATION"
        highlight="QUESTIONS, ANSWERED"
        description="Straight answers about costs, quotes, permits, timelines and where we work. If your question is not here, ask us directly."
        primaryLink={{ to: '/contact-us', label: 'ASK US DIRECTLY' }}
      />
      <section className="faq-section">
        <div className="container faq-page-container">
          {FAQ_GROUPS.map((group, index) => (
            <div key={group.id} id={group.id} className="faq-group">
              <div className="section-header center">
                <h2 className="section-title">{group.title}</h2>
              </div>
              <FaqAccordion items={group.items} headingLevel={3} defaultOpen={index === 0 ? 0 : -1} />
            </div>
          ))}
        </div>
      </section>

      {FAQ_SOURCES.length > 0 && (
        <article className="blog-article-section">
          <div className="container blog-article-container">
            <div className="blog-article-body">
              <div>
                <h2>Sources</h2>
                <ol className="blog-sources">
                  {FAQ_SOURCES.map((source) => (
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
            </div>
          </div>
        </article>
      )}

      <CtaBanner />
    </main>
  );
}
