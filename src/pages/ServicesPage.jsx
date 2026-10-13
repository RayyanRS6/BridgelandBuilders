import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import ServiceDirectory from '../components/ServiceDirectory.jsx';
import Gallery from '../components/Gallery.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import { COST_HUB_PATH } from '../data/seo.js';
import { usePageSeo } from '../hooks/useSeo.js';

// "Not sure where to start?" — the three usual first steps.
const START_LINKS = [
  { to: COST_HUB_PATH, label: 'Renovation cost ranges' },
  { to: '/our-process', label: 'How our renovation process works' },
  { to: '/book-online', label: 'Book a free on-site visit' },
];

export default function ServicesPage() {
  usePageSeo('/services');

  return (
    <main>
      <PageHero
        eyebrow="Renovation & Construction"
        title="WINNIPEG RENOVATION"
        highlight="SERVICES"
        description="Home and commercial renovations in Winnipeg and nearby communities, from kitchens, bathrooms and basements to flooring, windows, masonry and demolition."
        primaryLink={{ to: '/projects', label: 'VIEW OUR PROJECTS' }}
      />
      <ServiceDirectory />

      {/* NOT SURE WHERE TO START? (same dark overview box as /service-areas) */}
      <section className="process-section" id="where-to-start">
        <div className="container">
          <div className="service-directory-overview">
            <span className="section-tag">Getting started</span>
            <h2>Not sure where to start?</h2>
            <p>
              Most people begin in one of three places: checking the starting price ranges for similar projects, reading how a
              renovation with us runs, or booking a free on-site visit so we can see the space and talk it through
              with you.
            </p>
            <div className="blog-filter-pills tpl-pill-row">
              {START_LINKS.map((link) => (
                <Link className="blog-filter-pill" to={link.to} key={link.to}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Gallery />
      <CtaBanner />
    </main>
  );
}
