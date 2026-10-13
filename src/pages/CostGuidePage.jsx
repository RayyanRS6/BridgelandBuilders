import { Fragment, lazy, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import RichBody, { renderInline } from '../components/RichBody.jsx';
import EstimatorSection from '../components/EstimatorSection.jsx';
import FaqAccordion from '../components/FaqAccordion.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import { formatPostDate } from '../components/BlogCard.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import {
  COST_GUIDE_LOADERS,
  costGuideSeoOptions,
  isLiveCostGuide,
  normaliseCostPath,
} from '../data/costGuides/index.js';
import { ESTIMATOR_URLS } from '../data/estimators.js';
import { trailFor } from '../data/seo.js';
import { serviceBySlug } from '../data/services.js';
import { usePageSeo } from '../hooks/useSeo.js';
import { keepServerHtml, onInitialPage, retryLoad } from '../lib/lazyRetry.js';

const pad = (index) => String(index + 1).padStart(2, '0');

/**
 * One lazy view per guide route, created once and reused (a new lazy() on
 * every render would suspend forever). The guide's module loads in its own
 * chunk; the server render (renderToPipeableStream, onAllReady) waits for it,
 * so the prerendered HTML has the full guide, and hydration waits for the
 * same chunk exactly like a lazy route.
 */
const VIEWS = new Map();

function viewFor(path) {
  if (!VIEWS.has(path)) {
    const load = COST_GUIDE_LOADERS[path];
    VIEWS.set(
      path,
      load
        ? lazy(() =>
            retryLoad(load)
              .then((guide) => ({
                default: function CostGuideRoute() {
                  return guide && isLiveCostGuide(guide) && guide.path === path ? (
                    <CostGuideView guide={guide} />
                  ) : (
                    <NotFoundPage />
                  );
                },
              }))
              .catch((error) => {
                // Prerendered first page: keep the server HTML; otherwise
                // RouteErrorBoundary (lib/lazyRetry.js), retrying next visit.
                if (!onInitialPage()) VIEWS.delete(path);
                return keepServerHtml(error);
              })
          )
        : null
    );
  }
  return VIEWS.get(path);
}

/**
 * Cost guides (plan §8): /renovation-cost-winnipeg and /services/<svc>/cost.
 * The guide is chosen by the URL (data: src/data/costGuides/); an unknown or
 * draft guide is a 404.
 *
 * Layout: breadcrumb → PageHero → quick answer → price tables → what moves the
 * price → budget/question sections → the matching estimator → FAQs → sources
 * → CTA → how the numbers were built (methodology + sign-off).
 */
export default function CostGuidePage() {
  const { pathname } = useLocation();
  const View = viewFor(normaliseCostPath(pathname));
  return View ? <View /> : <NotFoundPage />;
}

/**
 * The service pages' breadcrumb, from seo.js trailFor() — the same trail the
 * BreadcrumbList uses (visible trail = schema trail).
 */
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
 * Same sources list as the blog posts. It opens its own article section, so it
 * skips the posts' divider (.blog-sources-block) and starts flush.
 */
function Sources({ sources }) {
  if (!sources || !sources.length) return null;
  return (
    <div>
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
  );
}

function CostGuideView({ guide }) {
  const service = guide.serviceSlug ? serviceBySlug(guide.serviceSlug) : null;
  const seo = guide.seo || {};
  const seoOptions = useMemo(() => costGuideSeoOptions(guide), [guide]);
  const { faqs } = seoOptions;
  const trail = useMemo(() => trailFor(guide.path, seo.title), [guide.path, seo.title]);

  // Same options head.js passes for the prerender, so both emit one JSON-LD document.
  usePageSeo(guide.path, seoOptions);

  const tableBlocks = useMemo(() => (guide.tables || []).map((table) => ({ t: 'table', ...table })), [guide]);
  const estimatorKey = guide.estimatorKey || (service && service.estimatorKey) || 'overall';
  const estimatorSrc = ESTIMATOR_URLS[estimatorKey] || ESTIMATOR_URLS.overall;
  const drivers = guide.drivers || [];
  const sections = guide.sections || [];
  const basis = guide.dataBasis || null;
  const signoff = guide.ownerSignoff || guide.signoff || null;

  return (
    <main>
      <TrailBreadcrumb trail={trail} />

      <PageHero
        eyebrow={guide.eyebrow}
        title={guide.h1 && guide.h1.title}
        highlight={guide.h1 && guide.h1.highlight}
        description={guide.intro || seo.description}
      />

      {/* QUICK ANSWER + PRICE TABLES */}
      <article className="blog-article-section">
        <div className="container blog-article-container">
          <div className="blog-article-body">
            {seo.updated && (
              <p className="policy-updated">
                Updated <time dateTime={seo.updated}>{formatPostDate(seo.updated)}</time>
                {basis && basis.period ? ` · Prices from ${basis.period}` : ''}
              </p>
            )}

            {guide.answer && (
              <aside className="blog-takeaways blog-answer">
                <h2>Quick answer</h2>
                <p>{renderInline(guide.answer, 'answer')}</p>
              </aside>
            )}

            {tableBlocks.length > 0 && <RichBody blocks={tableBlocks} />}
          </div>
        </div>
      </article>

      {/* WHAT MOVES THE PRICE */}
      {drivers.length > 0 && (
        <section className="process-section includes-section" id="cost-drivers">
          <div className="container">
            <div className="section-header center reveal">
              <span className="section-tag">{guide.driversTag || 'What moves the price'}</span>
              <h2 className="section-title">{guide.driversTitle || 'What changes the cost'}</h2>
              {guide.driversDesc && <p className="section-desc">{guide.driversDesc}</p>}
            </div>
            <div className="includes-grid">
              {drivers.map((driver, index) => (
                <div
                  className="include-card reveal"
                  key={driver.title}
                  style={index > 0 ? { transitionDelay: `${(index % 3) * 0.1}s` } : undefined}
                >
                  <div className="include-num">{pad(index)}</div>
                  <h3>{driver.title}</h3>
                  <p>{driver.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BUDGET + QUESTION SECTIONS */}
      {sections.length > 0 && (
        <article className="blog-article-section">
          <div className="container blog-article-container">
            <div className="blog-article-body">
              {sections.map((section) => (
                <Fragment key={section.h2}>
                  <h2>{section.h2}</h2>
                  <RichBody blocks={section.blocks || []} />
                </Fragment>
              ))}
            </div>
          </div>
        </article>
      )}

      {/* THE MATCHING ESTIMATOR */}
      <EstimatorSection
        src={estimatorSrc}
        title={guide.estimatorTitle || 'See a starting price for your project'}
        description={
          guide.estimatorDesc ||
          'Answer a few quick questions to get a starting price range for your own project. It’s free and there’s no obligation.'
        }
      />

      {faqs && (
        <section className="faq-section" id="faqs">
          <div className="container">
            <div className="section-header center">
              <span className="section-tag">Questions</span>
              <h2 className="section-title">Cost questions, answered</h2>
            </div>
            <FaqAccordion items={faqs} headingLevel={3} />
          </div>
        </section>
      )}

      {guide.sources && guide.sources.length > 0 && (
        <article className="blog-article-section">
          <div className="container blog-article-container">
            <div className="blog-article-body">
              <Sources sources={guide.sources} />
            </div>
          </div>
        </article>
      )}

      <CtaBanner />

      {/* HOW THESE NUMBERS WERE BUILT */}
      {(basis || signoff) && (
        <article className="blog-article-section" id="methodology">
          <div className="container blog-article-container">
            <div className="blog-article-body">
              <aside className="blog-member-note tpl-note">
                <h2>How we built these numbers</h2>
                {basis && basis.source && (
                  <p>
                    <strong>Source:</strong> {basis.source}
                  </p>
                )}
                {basis && basis.period && (
                  <p>
                    <strong>Period:</strong> {basis.period}
                  </p>
                )}
                {basis && basis.note && <p>{renderInline(basis.note, 'basis')}</p>}
                <p>
                  Read how we write and check our guides in our{' '}
                  <Link className="blog-inline-link" to="/editorial-policy">editorial policy</Link>.
                </p>
                {signoff && (
                  <p className="tpl-meta">
                    Reviewed by {signoff.name}
                    {signoff.role ? `, ${signoff.role}` : ''}
                    {signoff.date ? ` · ${formatPostDate(signoff.date)}` : ''}
                  </p>
                )}
              </aside>
            </div>
          </div>
        </article>
      )}
    </main>
  );
}
