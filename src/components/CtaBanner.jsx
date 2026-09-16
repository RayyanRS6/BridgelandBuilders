import { useQuoteModal } from '../context/QuoteModalContext.jsx';
import { ArrowRightIcon } from './icons.jsx';

export default function CtaBanner() {
  const { openModal } = useQuoteModal();

  return (
    <section className="cta-banner-section" id="quote">
      <div className="container">
        <div className="cta-banner-card reveal">
          <div className="cta-banner-left">
            <h2>Get a free Quote Now!</h2>
            <p>Contact Bridgeland Builders today. We’ll discuss your ideas, provide clear details, and get it done right.</p>
          </div>
          <div className="cta-banner-right">
            <button
              className="btn-pill-red open-quote-btn"
              style={{ padding: '16px 36px', fontSize: '1rem' }}
              onClick={openModal}
            >
              <span>GET INSTANT QUOTE</span>
              <ArrowRightIcon size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
