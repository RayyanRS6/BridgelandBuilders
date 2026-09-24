import { Link } from 'react-router-dom';
import { CONSULTATION_LABEL, CONSULTATION_PATH } from '../data/siteConfig.js';
import { ArrowRightIcon } from './icons.jsx';

export default function CtaBanner() {
  return (
    <section className="cta-banner-section" id="quote">
      <div className="container">
        <div className="cta-banner-card reveal">
          <div className="cta-banner-left">
            <h2>Get a free Quote Now!</h2>
            <p>Contact Bridgeland Builders today. We’ll discuss your ideas, provide clear details, and get it done right.</p>
          </div>
          <div className="cta-banner-right">
            <Link to={CONSULTATION_PATH} className="btn-pill-red btn-pill-lg">
              <span>{CONSULTATION_LABEL.toUpperCase()}</span>
              <ArrowRightIcon size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
