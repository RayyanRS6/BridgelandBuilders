import { Link } from 'react-router-dom';
import { useQuoteModal } from '../context/QuoteModalContext.jsx';
import { ArrowRightIcon } from './icons.jsx';

export default function PageHero({ eyebrow, title, highlight, description, primaryLink }) {
  const { openModal } = useQuoteModal();

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
            <button className={primaryLink ? 'btn-pill-ghost' : 'btn-pill-red'} onClick={openModal}>
              Get Instant Quote
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
