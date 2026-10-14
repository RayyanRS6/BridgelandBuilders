import { Link, useLocation } from 'react-router-dom';
import { EXPERIENCE_YEARS, PROJECT_COUNT } from '../data/facts.js';
import { INSTANT_QUOTE_LABEL, INSTANT_QUOTE_PATH } from '../data/siteConfig.js';
import { stockImage } from '../lib/unsplash.js';
import Picture from './Picture.jsx';
import { ArrowRightIcon, CheckIcon } from './icons.jsx';

// Owner-confirmed facts only (no superlatives, SEO plan §11.1).
const CHECKLIST = [
  `Over ${EXPERIENCE_YEARS} Years Combined Experience`,
  `${PROJECT_COUNT}+ Completed Projects`,
  'Free Written Quotes',
  'Weekly Progress Updates',
];

// The photo fills a 460px-tall box (250px on phones) with object-fit: cover,
// so a 3:2 photo is drawn about 690px wide on desktop and never under ~375px.
const WHY_IMAGE = stockImage(
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80',
  { sizes: '(max-width: 480px) 380px, (max-width: 1024px) calc(100vw - 72px), 690px', maxWidth: 1200 }
);

const ABOUT_PATH = '/about-us';

export default function WhyUs() {
  // This section also sits on /about-us, which should not link to itself.
  const onAboutPage = useLocation().pathname.replace(/\/+$/, '') === ABOUT_PATH;

  return (
    <section className="why-section" id="why-us">
      <div className="container">
        <div className="why-grid">
          <div className="why-visual-stack reveal" style={{ position: 'relative' }}>
            <div className="why-main-img">
              <Picture
                {...WHY_IMAGE}
                alt="Living room with a grey sofa, wooden tables and tall windows"
                width="900"
                height="600"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="why-floating-card">
              <div className="why-floating-title">No Surprises</div>
              <p>A free written quote before we start, and a progress update every week.</p>
            </div>
          </div>

          <div className="why-content reveal">
            <span className="section-tag">Why Bridgeland Builders?</span>
            <h2 className="section-title">A clear plan, a written price and weekly updates</h2>
            <div className="why-paragraphs">
              <p>
                {`Bridgeland Builders is a Winnipeg renovation company whose team has over ${EXPERIENCE_YEARS} years of combined experience in renovation and construction. Together we have completed more than ${PROJECT_COUNT} projects, from single-room updates in family homes to commercial fit-ups for local businesses.`}
                {!onAboutPage && (
                  <>
                    {' '}Read <Link className="blog-inline-link" to={ABOUT_PATH}>more about who we are</Link>.
                  </>
                )}
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
