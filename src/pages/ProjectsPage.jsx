import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import Gallery from '../components/Gallery.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import { liveServices } from '../data/services.js';
import { usePageSeo } from '../hooks/useSeo.js';

export default function ProjectsPage() {
  usePageSeo('/projects');
  const services = liveServices();

  return (
    <main>
      <PageHero
        eyebrow="Inspiration"
        title="RENOVATION PROJECTS"
        highlight="& DESIGN IDEAS"
        description="Browse design ideas for each type of project, then open any service for its details, process, and booking page. These are inspiration photos for now; case studies of our own projects are coming."
        primaryLink={{ to: '/services', label: 'EXPLORE SERVICES' }}
      />

      <Gallery />

      {/* An honest note about the photos (SEO plan §11.2), then every live
          service page (same dark overview box as /service-areas). It sits
          after the gallery so the 17 service pills don't push the photos
          down on phones; the hero and gallery intro already say they are
          inspiration photos. */}
      <section className="process-section" id="about-these-photos">
        <div className="container">
          <div className="service-directory-overview">
            <span className="section-tag">About these photos</span>
            <h2>Are these Bridgeland Builders projects?</h2>
            <p>
              Not yet. The photos on this page are inspiration images for each type of renovation we do, not photos
              of our own jobs. Case studies of our own projects, with real photos, the scope and the timeline, will
              be added here. Until then, each service page explains what the work involves and how we run it.
            </p>
            {services.length > 0 && (
              <div className="blog-filter-pills tpl-pill-row">
                {services.map((service) => (
                  <Link className="blog-filter-pill" to={service.path} key={service.path}>
                    {service.navLabel || service.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <CtaBanner />
    </main>
  );
}
