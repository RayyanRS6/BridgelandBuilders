import { Link, useLocation } from 'react-router-dom';
import { INSTANT_QUOTE_LABEL, INSTANT_QUOTE_PATH } from '../data/siteConfig.js';
import { COST_HUB_PATH } from '../data/seo.js';
import { ArrowRightIcon } from './icons.jsx';

export default function CtaBanner() {
  // The cost-hub link (styled by .cta-banner-link in pages.css) is left off
  // the hub itself and off the home page, whose banner stays as signed off.
  const { pathname } = useLocation();
  const path = pathname.replace(/\/+$/, '') || '/';
  const showCostLink = path !== COST_HUB_PATH && path !== '/';

  return (
    <section className="cta-banner-section" id="quote">
      <div className="container">
        <div className="cta-banner-card reveal">
          <div className="cta-banner-left">
            <h2>Get a free instant quote</h2>
            <p>
              Answer a few quick questions for a starting price range, then book a free on-site visit for your written quote.
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
            <Link to={INSTANT_QUOTE_PATH} className="btn-pill-red btn-pill-lg" data-cta="cta-banner-instant-quote">
              <span>{INSTANT_QUOTE_LABEL.toUpperCase()}</span>
              <ArrowRightIcon size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
