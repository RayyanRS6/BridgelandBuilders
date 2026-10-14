import { Fragment, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import RichBody from '../components/RichBody.jsx';
import FaqAccordion from '../components/FaqAccordion.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import { formatPostDate } from '../components/BlogCard.jsx';
import { CaseStudyCard } from './CaseStudyPage.jsx';
import { caseStudiesForArea } from '../data/caseStudies.js';
import { publishedServiceArea, serviceAreaSeoOptions } from '../data/serviceAreasContent.js';
import { trailFor } from '../data/trails.js';
import { liveServices } from '../data/services.js';
import { usePageSeo } from '../hooks/useSeo.js';
import { lazyWithRetry } from '../lib/lazyRetry.js';

// Never rendered for a published area, so it is not modulepreloaded with it.
const NotFoundPage = lazyWithRetry(() => import('./NotFoundPage.jsx'));

function TrailBreadcrumb({ trail }) {
  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        {trail.map(([label, to], index) => (
          <Fragment key={to}>
            <span className="breadcrumb-sep">/</span>
            {index === trail.length - 1 ? (
              <span className="breadcrumb-current" aria-current="page">{label}</span>
            ) : (
              <Link to={to}>{label}</Link>
            )}
          </Fragment>
        ))}
      </nav>
    </div>
  );
}

/**
 * A community page at /service-areas/<slug> (plan §14.5, gate D9). Renders
 * only when the community is confirmed in siteConfig.js AND its entry in
 * serviceAreasContent.js is `published: true` — which needs at least three
 * documented jobs there (case studies), 600+ words of the page's own local
 * content, sourced local facts and the owner's sign-off. Everything else is a
 * 404. Winnipeg neighbourhoods never get pages of their own; they appear
 * through case studies.
 */
export default function AreaPage() {
  const { slug } = useParams();
  const area = publishedServiceArea(slug);
  return area ? <AreaView area={area} /> : <NotFoundPage />;
}

function AreaView({ area }) {
  const path = area.path;
  const seo = area.seo || {};
  const faqs = area.faqs && area.faqs.length ? area.faqs : undefined;
  const studies = caseStudiesForArea(area.slug);
  const services = liveServices();
  const signoff = area.ownerSignoff || null;

  const trail = useMemo(() => trailFor(path, seo.title), [path, seo.title]);

  // Same options head.js passes; the Service node (when seo.serviceType is
  // set) names this one community as areaServed (plan §14.5).
  usePageSeo(path, serviceAreaSeoOptions(area));

  const sources = [
    area.permitUrl && { label: area.permitLabel || area.permitAuthority, url: area.permitUrl, accessed: area.accessed },
    area.sourceUrl && { label: area.sourceLabel || area.sourceUrl, url: area.sourceUrl, accessed: area.accessed },
    ...(area.sources || []),
  ]
    .filter(Boolean)
    .filter((source, index, all) => all.findIndex((other) => other.url === source.url) === index);

  return (
    <main>
      <TrailBreadcrumb trail={trail} />

      <PageHero
        eyebrow="Service Area"
        title={area.h1 ? area.h1.title : 'RENOVATIONS IN'}
        highlight={area.h1 ? area.h1.highlight : area.name.toUpperCase()}
        description={area.intro || seo.description}
      />

      <article className="blog-article-section">
        <div className="container blog-article-container">
          <div className="blog-article-body">
            {seo.updated && (
              <p className="policy-updated">
                Updated <time dateTime={seo.updated}>{formatPostDate(seo.updated)}</time>
              </p>
            )}

            {area.permitAuthority && (
              <aside className="blog-takeaways blog-answer">
                <h2>Building permits in {area.name}</h2>
                <p>
                  Building permits for renovation work in {area.name} are issued by the {area.permitAuthority}.
                  {area.notes ? ` ${area.notes}` : ''}
                </p>
              </aside>
            )}

            <RichBody blocks={area.blocks || []} />
          </div>
        </div>
      </article>

      {studies.length > 0 && (
        <section className="blog-related-section" id="projects">
          <div className="container">
            <span className="section-tag">Our work here</span>
            <h2 className="blog-related-heading">Projects in {area.name}</h2>
            <div className="blog-grid">
              {studies.map((study) => (
                <div className="reveal" key={study.slug}>
                  <CaseStudyCard study={study} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {services.length > 0 && (
        <section className="process-section" id="services">
          <div className="container">
            <div className="service-directory-overview">
              <span className="section-tag">Services</span>
              <h2>What we build in {area.name}</h2>
              <p>Every service below is available in {area.name}.</p>
              <div className="blog-filter-pills tpl-pill-row">
                {services.map((service) => (
                  <Link className="blog-filter-pill" to={service.path} key={service.path}>
                    {service.navLabel || service.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {faqs && (
        <section className="faq-section" id="faqs">
          <div className="container">
            <div className="section-header center">
              <span className="section-tag">Questions</span>
              <h2 className="section-title">Renovating in {area.name}</h2>
            </div>
            <FaqAccordion items={faqs} headingLevel={3} />
          </div>
        </section>
      )}

      <article className="blog-article-section">
        <div className="container blog-article-container">
          <div className="blog-article-body">
            <p>
              See every community we serve on our{' '}
              <Link className="blog-inline-link" to="/service-areas">service areas</Link> page.
            </p>
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
            {signoff && (
              <p className="tpl-meta">
                Reviewed by {signoff.name}
                {signoff.role ? `, ${signoff.role}` : ''}
                {signoff.date ? ` · ${formatPostDate(signoff.date)}` : ''}
              </p>
            )}
          </div>
        </div>
      </article>

      <CtaBanner />
    </main>
  );
}
