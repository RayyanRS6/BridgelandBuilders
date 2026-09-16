import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '../components/icons.jsx';
import useSeo from '../hooks/useSeo.js';

export default function NotFoundPage() {
  useSeo({ title: 'Page Not Found | Bridgeland Builders', robots: 'noindex, follow' });

  return (
    <main className="not-found-page">
      <div className="container">
        <div className="not-found-card">
          <div className="not-found-copy">
            <span className="not-found-eyebrow">PAGE NOT FOUND</span>
            <h1>THIS PAGE ISN&apos;T IN THE <span>BLUEPRINT.</span></h1>
            <p>
              The page may have moved, the address may be incomplete, or this part of the site
              is still under construction. Let&apos;s get you back somewhere useful.
            </p>
            <div className="not-found-actions">
              <Link to="/" className="btn-pill-red">
                Back to Home <ArrowRightIcon size={15} />
              </Link>
              <Link to="/services" className="btn-pill-ghost">Explore Our Services</Link>
            </div>
          </div>

          <div className="not-found-visual" aria-label="Error 404">
            <span className="not-found-plan-label">BRIDGELAND BUILDERS / PLAN 404</span>
            <strong>404</strong>
            <div className="not-found-plan-line" aria-hidden="true" />
            <p>Nothing was built at this address.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
