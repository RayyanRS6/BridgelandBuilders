import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuoteModal } from '../context/QuoteModalContext.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';
import { BookingSurvey } from '../components/LeadConnector.jsx';
import BookingAside from '../components/BookingAside.jsx';
import FaqAccordion from '../components/FaqAccordion.jsx';
import EstimatorEmbed from '../components/EstimatorEmbed.jsx';
import Ticker from '../components/Ticker.jsx';
import { ArrowRightIcon, CheckIcon } from '../components/icons.jsx';
import { PROJECT_ESTIMATORS } from '../data/estimators.js';

export default function ProjectPage({ project }) {
  const { openModal } = useQuoteModal();
  const bookingRef = useRef(null);
  const estimatorSrc = PROJECT_ESTIMATORS[project.slug];

  useScrollReveal();

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <>
      {/* BREADCRUMB */}
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-sep">/</span>
          <Link to="/projects">Our Portfolio</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{project.breadcrumb}</span>
        </nav>
      </div>

      {/* HERO + BOOKING CALENDAR */}
      <section className="hero-section" id="book">
        <div className="container">
          <div className="hero-card hero-booking reveal" ref={bookingRef}>
            <div className="hero-content">
              <div className="badge-soft">
                <CheckIcon size={13} />
                {project.badge}
              </div>
              <h1 className="hero-title">
                {project.title} <span>{project.titleHighlight}</span>
              </h1>
              <p className="hero-subtitle">
                {project.subtitle}
              </p>
              <ul className="hero-points">
                {project.heroPoints.map((point) => (
                  <li key={point}>
                    <CheckIcon size={17} />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="hero-cta-group">
                <button className="btn-pill-red" onClick={() => scrollTo(bookingRef)}>
                  <span>BOOK AN APPOINTMENT</span>
                  <ArrowRightIcon size={15} />
                </button>
                <a href="tel:431-866-5644" className="btn-pill-ghost">
                  <span>Call 431-866-5644</span>
                </a>
              </div>
            </div>

            <BookingSurvey
              heading="Book Your Free Visit"
              subheading="Pick a day and time that works for you — you’ll get a confirmation straight away."
            />
          </div>
        </div>
      </section>

      {/* TICKER BANNER */}
      <Ticker />

      {/* STATS OVERVIEW */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {project.stats.map((stat, index) => (
              <div
                className="stat-card reveal"
                key={stat.label}
                style={index > 0 ? { transitionDelay: `${index * 0.1}s` } : undefined}
              >
                <div className="stat-num">{stat.num}<span className="stat-unit">{stat.unit}</span></div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE PITCH (dark section, same as home "Why Bridgeland") */}
      <section className="why-section" id="about">
        <div className="container">
          <div className="why-grid">
            <div className="why-visual-stack reveal" style={{ position: 'relative' }}>
              <div className="why-main-img">
                <img src={project.intro.image} alt={project.intro.imageAlt} width="1000" height="750" loading="lazy" decoding="async" />
              </div>
              <div className="why-floating-card">
                <h4>{project.intro.floatingTitle}</h4>
                <p>{project.intro.floatingText}</p>
              </div>
            </div>

            <div className="why-content reveal">
              <span className="section-tag">{project.intro.tag}</span>
              <h2 className="section-title">{project.intro.title}</h2>
              <div className="why-paragraphs">
                {project.intro.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>

              <ul className="why-checklist">
                {project.intro.checklist.map((item) => (
                  <li key={item}>
                    <CheckIcon size={18} />
                    {item}
                  </li>
                ))}
              </ul>

              <button className="btn-pill-red" onClick={() => scrollTo(bookingRef)}>
                <span>CHECK AVAILABLE DATES</span>
                <ArrowRightIcon size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="process-section includes-section" id="included">
        <div className="container">
          <div className="section-header center reveal">
            <span className="section-tag">{project.includes.tag}</span>
            <h2 className="section-title">{project.includes.title}</h2>
            <p className="section-desc">{project.includes.desc}</p>
          </div>

          <div className="includes-grid">
            {project.includes.items.map((item, index) => (
              <div
                className="include-card reveal"
                key={item.num}
                style={index > 0 ? { transitionDelay: `${(index % 3) * 0.1}s` } : undefined}
              >
                <div className="include-num">{item.num}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECT GALLERY */}
      <section className="gallery-section" id="work">
        <div className="container">
          <div className="section-header center reveal">
            <span className="section-tag">{project.gallery.tag}</span>
            <h2 className="section-title">{project.gallery.title}</h2>
            <p className="section-desc">{project.gallery.desc}</p>
          </div>

          <div className="gallery-grid">
            {project.gallery.items.map((item, index) => (
              <div
                className="gallery-item col-4 reveal"
                key={item.title}
                style={index > 0 ? { transitionDelay: `${index * 0.1}s` } : undefined}
              >
                <img src={item.img} alt={item.alt} width="800" height="600" loading="lazy" decoding="async" />
                <div className="gallery-overlay">
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="process-section" id="steps">
        <div className="container">
          <div className="section-header center reveal">
            <span className="section-tag">{project.process.tag}</span>
            <h2 className="section-title">{project.process.title}</h2>
            <p className="section-desc">{project.process.desc}</p>
          </div>

          <div className="process-grid">
            {project.process.steps.map((step, index) => (
              <div
                className="process-card reveal"
                key={step.num}
                style={index > 0 ? { transitionDelay: `${index * 0.1}s` } : undefined}
              >
                <div className="process-step-num">{step.num}</div>
                <h3 className="process-card-title">{step.title}</h3>
                <p className="process-card-text">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="testimonial-section">
        <div className="container">
          <div className="testimonial-card reveal">
            <div className="testimonial-left">
              <div className="stars-badge">★★★★★</div>
              <h3 className="testimonial-headline">5-Star Rated!</h3>
              <p className="testimonial-sub">What our clients say about working with Bridgeland Builders in Winnipeg.</p>
            </div>
            <div className="testimonial-right">
              <p className="testimonial-quote">{project.testimonial.quote}</p>
              <div className="testimonial-author">
                <div className="author-initial">{project.testimonial.initial}</div>
                <div className="author-info">
                  <h5>{project.testimonial.name}</h5>
                  <p>{project.testimonial.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LEAD CAPTURE / BOOKING FORM */}
      <section className="lead-section" id="book-form">
        <div className="container">
          <div className="lead-grid">
            <div className="reveal">
              <BookingAside serviceName={project.breadcrumb} />
            </div>
            <div className="reveal">
              <div className="lead-card">
                <div className="lead-card-head">
                  <h3>Get Your Free {project.breadcrumb} Price Guide</h3>
                  <p>Answer a few quick questions to receive a useful starting price range for your project. This planning guide is free and does not obligate you to proceed.</p>
                </div>
                {estimatorSrc && (
                  <EstimatorEmbed
                    src={estimatorSrc}
                    title={`${project.breadcrumb} price guide`}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="faq-section" id="faqs">
        <div className="container">
          <div className="section-header center reveal">
            <span className="section-tag">Questions</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-desc">The things people ask us most before booking a {project.breadcrumb.toLowerCase()}.</p>
          </div>
          <div className="reveal">
            <FaqAccordion items={project.faqs} />
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-banner-section" id="quote">
        <div className="container">
          <div className="cta-banner-card reveal">
            <div className="cta-banner-left">
              <h2>Still thinking it over?</h2>
              <p>Grab a free quote instead — tell us roughly what you need and we’ll come back with numbers. No appointment required.</p>
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
    </>
  );
}
