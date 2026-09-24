import { Link } from 'react-router-dom';
import { CONSULTATION_LABEL, CONSULTATION_PATH } from '../data/siteConfig.js';
import { ArrowRightIcon, CheckIcon } from './icons.jsx';

const CHECKLIST = [
  'Over 60 Years Experience',
  '100+ Finished Projects',
  'No Cutting Corners',
  'Clear Communication',
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
                alt="Bridgeland Builders construction quality"
                width="900"
                height="600"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="why-floating-card">
              <h4>Honest Work</h4>
              <p>Good materials, clear communication, and no surprises.</p>
            </div>
          </div>

          <div className="why-content reveal">
            <span className="section-tag">Why Bridgeland Builders?</span>
            <h2 className="section-title">Because we put the same care into your project as we would our own</h2>
            <div className="why-paragraphs">
              <p>
                Bridgeland Builders is the best renovation and construction company in Winnipeg Manitoba. We’re a local Winnipeg team that’s been building and renovating for a long time — over 60 years of combined experience between us. In that time, we’ve worked on more than 100 projects, from small home updates to big commercial jobs at one of the most reliable construction companies in Winnipeg Manitoba.
              </p>
              <p>
                What you’ll notice when working with us is pretty simple: we use good materials, we don’t cut corners, and we keep you in the loop the whole way through. No surprises, no runaround — just honest work and clear communication.
              </p>
              <p>
                For us, it’s never just about getting the job done and walking away. It’s about knowing you feel good every time you walk into your space. Home or business, big or small — we don’t pack up until it feels right for you.
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

            <Link to={CONSULTATION_PATH} className="btn-pill-red">
              <span>{CONSULTATION_LABEL.toUpperCase()}</span>
              <ArrowRightIcon size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
