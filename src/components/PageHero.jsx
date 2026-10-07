import { Link } from 'react-router-dom';
import { INSTANT_QUOTE_LABEL, INSTANT_QUOTE_PATH } from '../data/siteConfig.js';
import { ArrowRightIcon } from './icons.jsx';

export default function PageHero({ eyebrow, title, highlight, description, primaryLink, showQuote = true }) {
  return (
    <section className="page-hero">
      <div className="container">
        <div className="page-hero-card reveal">
          <span className="section-tag">{eyebrow}</span>
          <h1>{title} {highlight && <span>{highlight}</span>}</h1>
          <p>{description}</p>
          {(primaryLink || showQuote) && (
            <div className="hero-cta-group">
              {primaryLink && (
                <Link className="btn-pill-red" to={primaryLink.to}>
                  <span>{primaryLink.label}</span>
                  <ArrowRightIcon size={15} />
                </Link>
              )}
              {showQuote && (
                <Link className={primaryLink ? 'btn-pill-ghost' : 'btn-pill-red'} to={INSTANT_QUOTE_PATH}>
                  {INSTANT_QUOTE_LABEL}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
