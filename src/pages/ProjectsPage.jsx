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
        description="Browse design ideas for each type of project, then open any service for its details, process, and booking page."
        primaryLink={{ to: '/services', label: 'EXPLORE SERVICES' }}
      />

      <Gallery />

      {/* What the photos are (SEO plan §11.2), then every live service page
          (same dark overview box as /service-areas). It sits after the
          gallery so the 17 service pills don't push the photos down on
          phones. The photos stay labelled as design ideas, never as our jobs;
          the apologetic "not yet" wording was removed at the owner's request
          (competitor review, 2026-10-22). The paragraph still says plainly
          what they are, in the editorial policy's terms (photos of our own
          jobs carry the community and date, src/data/editorialPolicy.js). */}
      <section className="process-section" id="about-these-photos">
        <div className="container">
          <div className="service-directory-overview">
            <span className="section-tag">About these photos</span>
            <h2>Design ideas for every kind of renovation</h2>
            <p>
              The photos on this page are photo-library images, chosen as design ideas for each type of renovation
              we do. Photos of our own jobs are always labelled with the community or neighbourhood and the date.
              Open a service to see what the work involves, how we run it and how to book a free on-site visit.
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
