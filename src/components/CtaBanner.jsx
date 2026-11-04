import { Link, useLocation } from 'react-router-dom';
import { COST_HUB_PATH, INSTANT_QUOTE_LABEL, INSTANT_QUOTE_PATH } from '../data/siteConfig.js';
import { ArrowRightIcon } from './icons.jsx';

// `visit` ({ to, label, title, text }, BlogPostPage's ctaPrimary "visit") offers
// a free on-site visit instead of the instant quote, on a post the estimator
// has no prices for. Its words live on that page, so other pages don't ship them.
export default function CtaBanner({ visit = null }) {
  // The cost-hub link (styled by .cta-banner-link in pages.css) is left off
  // the hub itself and off the home page, whose banner stays as signed off.
  // A visit banner leaves it off too: the hub prices what the estimator prices.
  const { pathname } = useLocation();
  const path = pathname.replace(/\/+$/, '') || '/';
  const showCostLink = !visit && path !== COST_HUB_PATH && path !== '/';

  return (
    <section className="cta-banner-section" id="quote">
      <div className="container">
        <div className="cta-banner-card reveal">
          <div className="cta-banner-left">
            <h2>{visit ? visit.title : 'Get a free instant quote'}</h2>
            <p>
              {visit ? visit.text : 'Answer a few quick questions for a starting price range, then book a free on-site visit for your written quote.'}
            </p>
            {showCostLink && (
              <p className="cta-banner-link">
                <Link to={COST_HUB_PATH} data-cta="cta-banner-costs">
                  See renovation cost ranges
                </Link>
              </p>
            )}
          </div>
          <div className="cta-banner-right">
            <Link to={visit ? visit.to : INSTANT_QUOTE_PATH} className="btn-pill-red btn-pill-lg" data-cta={visit ? 'cta-banner-visit' : 'cta-banner-instant-quote'}>
              <span>{(visit ? visit.label : INSTANT_QUOTE_LABEL).toUpperCase()}</span>
              <ArrowRightIcon size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
