import { GUARANTEES, isLive } from '../data/guarantees.js';
import { ShieldIcon } from './icons.jsx';

/**
 * The named guarantees switched on for `page` ('home', 'process',
 * 'residential', 'commercial' or 'additional'; see src/data/guarantees.js).
 * Each one shows only once it is enabled and the owner's written
 * confirmation of its terms is recorded (isLive). Pages render this only when
 * __HAS_GUARANTEES__ is true (vite.config.js), so while none is live neither
 * this component nor the text is downloaded.
 */
export default function Guarantees({ page }) {
  const items = GUARANTEES.filter((item) => isLive(item) && item.pages.includes(page));
  if (!items.length) return null;

  return (
    <section className="includes-section guarantee-section" id="guarantees">
      <div className="container">
        <div className="section-header center reveal">
          <span className="section-tag">{items.length > 1 ? 'Our Guarantees' : 'Our Guarantee'}</span>
          <h2 className="section-title">What we guarantee</h2>
        </div>
        <div className={`guarantee-grid guarantee-grid-${Math.min(items.length, 3)}`}>
          {items.map((item, index) => (
            <div
              className="include-card guarantee-card reveal"
              id={`guarantee-${item.id}`}
              key={item.id}
              style={index > 0 ? { transitionDelay: `${index * 0.1}s` } : undefined}
            >
              <span className="guarantee-icon" aria-hidden="true"><ShieldIcon size={20} /></span>
              <h3>{item.name}</h3>
              <p>{item.promise}</p>
              {item.terms && <p className="guarantee-terms">{item.terms}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
