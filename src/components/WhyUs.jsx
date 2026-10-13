import { Link } from 'react-router-dom';
import { INSTANT_QUOTE_LABEL, INSTANT_QUOTE_PATH } from '../data/siteConfig.js';
import { ArrowRightIcon, CheckIcon } from './icons.jsx';

// Owner-confirmed facts only (no superlatives, SEO plan §11.1).
const CHECKLIST = [
  'Over 60 Years Combined Experience',
  '100+ Completed Projects',
  'Free Written Quotes',
  'Weekly Progress Updates',
];

export default function WhyUs() {
  return (
    <section className="why-section" id="why-us">
      <div className="container">
        <div className="why-grid">
          <div className="why-visual-stack reveal" style={{ position: 'relative' }}>
            <div className="why-main-img">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80"
                alt="Living room with a grey sofa, wooden tables and tall windows"
                width="900"
                height="600"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="why-floating-card">
              <h4>No Surprises</h4>
              <p>A free written quote before we start, and a progress update every week.</p>
            </div>
          </div>

          <div className="why-content reveal">
            <span className="section-tag">Why Bridgeland Builders?</span>
            <h2 className="section-title">A clear plan, a written price and weekly updates</h2>
            <div className="why-paragraphs">
              <p>
                Bridgeland Builders is a Winnipeg renovation and construction team with over 60 years of combined experience. Together we have completed more than 100 projects, from single-room updates in family homes to commercial fit-ups for local businesses.
              </p>
              <p>
                Every project starts with a free on-site visit and a free written quote, and nothing starts until you approve it. When the work needs permits and inspections, we coordinate them with the City of Winnipeg or your local municipality.
              </p>
              <p>
                Once work begins, you get a progress update every week. Home or business, big or small, you know where your project stands at every stage.
              </p>
            </div>

            <ul className="why-checklist">
              {CHECKLIST.map((item) => (
                <li key={item}>
                  <CheckIcon size={18} />
                  {item}
                </li>
              ))}
            </ul>

            <Link to={INSTANT_QUOTE_PATH} className="btn-pill-red" data-cta="why-us-instant-quote">
              <span>{INSTANT_QUOTE_LABEL.toUpperCase()}</span>
              <ArrowRightIcon size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
