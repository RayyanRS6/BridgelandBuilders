import { Link } from 'react-router-dom';
import { ArrowRightIcon, CheckIcon, PinIcon } from '../components/icons.jsx';
import { usePageSeo } from '../hooks/useSeo.js';

export default function OutsideWinnipegPage() {
  usePageSeo('/outside-winnipeg');

  return (
    <main className="outside-winnipeg-page">
      <section className="service-area-section">
        <div className="container">
          <div className="service-area-card">
            <div className="service-area-copy">
              <span className="service-area-eyebrow">
                <PinIcon size={15} /> Our current service area
              </span>

              <p className="service-area-kicker">WE&apos;RE SORRY</p>
              <h1>
                WE&apos;RE NOT IN<br />
                <span>YOUR AREA YET.</span>
              </h1>

              <p className="service-area-lead">
                Right now, Bridgeland Builders serves Winnipeg exclusively. Keeping our work
                close to home helps us protect the quality, communication, and hands-on care
                every project deserves.
              </p>

              <div className="service-area-note">
                <span className="service-area-note-icon"><CheckIcon size={15} /></span>
                <p>
                  <strong>We do plan to grow.</strong> As our team expands, we hope to bring the
                  Bridgeland experience to more Manitoba communities. Thank you for thinking of us,
                  and please check back as we grow.
                </p>
              </div>

              <div className="service-area-actions">
                <Link to="/" className="btn-pill-red">
                  Back to Home <ArrowRightIcon size={15} />
                </Link>
                <Link to="/projects" className="btn-pill-ghost">
                  View Our Work
                </Link>
              </div>
            </div>

            <div className="service-area-visual" aria-label="Currently serving Winnipeg, Manitoba">
              <div className="service-area-orbit service-area-orbit-one" aria-hidden="true" />
              <div className="service-area-orbit service-area-orbit-two" aria-hidden="true" />
              <div className="service-area-pin" aria-hidden="true">
                <PinIcon size={38} />
              </div>
              <div className="service-area-location">
                <span>Currently serving</span>
                <strong>Winnipeg</strong>
                <small>Manitoba</small>
              </div>
              <div className="service-area-coming-soon">
                <span className="pulse-dot" />
                More communities in the future
              </div>
            </div>
          </div>

          <p className="service-area-thanks">
            From our Winnipeg team, thank you for your understanding.
          </p>
        </div>
      </section>
    </main>
  );
}
