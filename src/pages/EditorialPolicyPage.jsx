import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import PolicyContact from '../components/PolicyContact.jsx';
import RichBody from '../components/RichBody.jsx';
import { formatPostDate } from '../components/BlogCard.jsx';
import { EDITORIAL_POLICY } from '../data/editorialPolicy.js';
import { SITE_EMAIL } from '../data/siteConfig.js';
import { usePageSeo } from '../hooks/useSeo.js';

const PATH = '/editorial-policy';

/**
 * How the site's guides and price ranges are written, sourced, checked and
 * corrected (plan §11.3). Same long-form layout as the Privacy Policy. The
 * contact block is the short one: the mailing address belongs only on the
 * legal pages (NAP rule, siteConfig.js).
 */
export default function EditorialPolicyPage() {
  const { hero, lastUpdated, summaryTitle, summary, sections, corrections } = EDITORIAL_POLICY;

  // Title/description from PAGE_SEO['/editorial-policy'], as in the prerender.
  usePageSeo(PATH);

  return (
    <main>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        highlight={hero.highlight}
        description={hero.description}
        showQuote={false}
      />

      <article className="blog-article-section">
        <div className="container blog-article-container">
          <div className="blog-article-body policy-body">
            <p className="policy-updated">
              Last updated: <time dateTime={lastUpdated}>{formatPostDate(lastUpdated)}</time>
            </p>

            <aside className="blog-takeaways">
              <h2>{summaryTitle}</h2>
              <ul>
                {summary.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </aside>

            {sections.map((section) => (
              <div key={section.h2}>
                <h2>{section.h2}</h2>
                <RichBody blocks={section.blocks} />
              </div>
            ))}

            <h2>{corrections.h2}</h2>
            <p>
              {corrections.before} <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a> {corrections.after}
            </p>
            <p>{corrections.followUp}</p>
            <PolicyContact short />
            <p>
              To talk about a project instead, <Link to="/book-online">book a free on-site visit</Link>. You can
              also read our <Link to="/privacy-policy">Privacy Policy</Link> and{' '}
              <Link to="/terms-of-service">Terms of Service</Link>.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
