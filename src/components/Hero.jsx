import { useQuoteModal } from '../context/QuoteModalContext.jsx';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, StarIcon } from './icons.jsx';

export default function Hero() {
  const { openModal } = useQuoteModal();

  return (
    <section className="hero-section" id="home">
      <div className="container">
        <div className="hero-card reveal">
          <div className="hero-content">
            <div className="badge-soft">
              <StarIcon size={13} />
              Your Winnipeg Trusted Renovation and Construction Company
            </div>
            <h1 className="hero-title">
              BRIDGING DREAMS <span>INTO REALITY</span>
            </h1>
            <p className="hero-subtitle">
              Bridgeland Builders can boast of excellence in the completion of every single project we undertake. Our expert team of professionals helps turn your ideas on paper to an actual structure. Our skillful work makes sure we leave every client satisfied and happy.
            </p>
            <div className="hero-cta-group">
              {/* Main CTA in Red */}
              <button className="btn-pill-red open-quote-btn" onClick={openModal}>
                <span>GET INSTANT QUOTE</span>
                <ArrowRightIcon size={15} />
              </button>
              <Link to="/services" className="btn-pill-ghost">
                <span>Our Services</span>
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-arch-frame">
              <img
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80"
                alt="Clean and cozy Winnipeg renovation project"
                width="1000"
                height="667"
                fetchpriority="high"
                decoding="async"
              />
            </div>
            <div className="hero-floating-badge">
              <div className="avatar-group">★</div>
              <div className="badge-text">
                <h4>100% Satisfied Clients</h4>
                <p>Over 60 Years Combined Experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
