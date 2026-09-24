import { Link } from 'react-router-dom';
import { CONSULTATION_LABEL, CONSULTATION_PATH } from '../data/siteConfig.js';
import { ArrowRightIcon } from './icons.jsx';

export default function PageHero({ eyebrow, title, highlight, description, primaryLink }) {
  return (
    <section className="page-hero">
      <div className="container">
        <div className="page-hero-card reveal">
          <span className="section-tag">{eyebrow}</span>
          <h1>{title} {highlight && <span>{highlight}</span>}</h1>
          <p>{description}</p>
          <div className="hero-cta-group">
            {primaryLink && (
              <Link className="btn-pill-red" to={primaryLink.to}>
                <span>{primaryLink.label}</span>
                <ArrowRightIcon size={15} />
              </Link>
            )}
            <Link className={primaryLink ? 'btn-pill-ghost' : 'btn-pill-red'} to={CONSULTATION_PATH}>
              {CONSULTATION_LABEL}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
