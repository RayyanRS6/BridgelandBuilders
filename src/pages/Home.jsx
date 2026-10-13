import { Link } from 'react-router-dom';
import Hero from '../components/Hero.jsx';
import Ticker from '../components/Ticker.jsx';
import Stats from '../components/Stats.jsx';
import Services from '../components/Services.jsx';
import WhyUs from '../components/WhyUs.jsx';
import Process from '../components/Process.jsx';
import Testimonial from '../components/Testimonial.jsx';
import Gallery from '../components/Gallery.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import BlogCard from '../components/BlogCard.jsx';
import { BLOG_POSTS, getPostBySlug } from '../data/blogIndex.js';
import { SERVICE_AREA_NAMES } from '../data/siteConfig.js';
import { usePageSeo } from '../hooks/useSeo.js';

// The home page's short version of /our-process (the full seven steps live there).
const HOME_STEPS = [
  {
    num: '01',
    title: 'Instant Quote or a Call',
    text: 'Get a starting price range from our free instant quote, or call us and tell us what you have in mind. We reply within one business day.',
  },
  {
    num: '02',
    title: 'Free On-Site Visit',
    text: 'We come to your home or business, look at the space with you, take measurements and talk through what you want, your budget and your timing.',
  },
  {
    num: '03',
    title: 'Written Quote',
    text: 'You get a free written quote with the scope, price and schedule. Nothing starts until you approve it, and we coordinate any permits the work needs.',
  },
  {
    num: '04',
    title: 'Build to Handover',
    text: 'You get a progress update every week while the work is under way, and we finish with inspections and a final walkthrough.',
  },
];

// The guides strip: these posts first, in this order; if one is not published
// yet, the newest other posts fill the strip so it always shows three cards.
const GUIDE_SLUGS = [
  'winnipeg-renovation-permits',
  'how-to-choose-the-right-contractor-for-your-renovation-project',
  'basement-development-permits-winnipeg',
];
const GUIDE_COUNT = 3;

function homeGuides() {
  const picked = GUIDE_SLUGS.map((slug) => getPostBySlug(slug)).filter(Boolean);
  const fill = BLOG_POSTS.filter((post) => !picked.includes(post));
  return [...picked, ...fill].slice(0, GUIDE_COUNT);
}

const GUIDES = homeGuides();

export default function Home() {
  usePageSeo('/');

  return (
    <main>
      {/* 3. HERO SECTION */}
      <Hero />

      {/* 4. TICKER BANNER */}
      <Ticker />

      {/* 5. STATS OVERVIEW */}
      <Stats />

      {/* 6. OUR SERVICES */}
      <Services />

      {/* 7. WHY BRIDGELAND BUILDERS */}
      <WhyUs />

      {/* 8. OUR PROCESS */}
      <Process
        steps={HOME_STEPS}
        desc={
          <>
            From your first question to the final walkthrough, in four steps.{' '}
            <Link className="blog-inline-link" to="/our-process">See the full renovation process</Link>
          </>
        }
      />

      {/* 9. SERVICE AREA (same dark overview box as /service-areas) */}
      <section className="process-section" id="service-area">
        <div className="container">
          <div className="service-directory-overview">
            <span className="section-tag">Where we work</span>
            <h2>Serving Winnipeg and nearby communities</h2>
            <p>
              We work in Winnipeg and nearby communities within about an hour of the city, including the ones
              below. We come to you for the free on-site visit, and coordinate permits and inspections with the City
              of Winnipeg or your local municipality.
            </p>
            <div className="blog-filter-pills tpl-pill-row">
              {SERVICE_AREA_NAMES.map((name) => (
                <Link className="blog-filter-pill" to="/service-areas" key={name} data-cta="home-service-areas">
                  {name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. TESTIMONIAL SPOTLIGHT */}
      <Testimonial />

      {/* 11. INSPIRATION GALLERY */}
      <Gallery />

      {/* 12. WINNIPEG RENOVATION GUIDES */}
      {GUIDES.length > 0 && (
        <section className="blog-index-section" id="guides">
          <div className="container">
            <div className="section-header center reveal">
              <span className="section-tag">Guides</span>
              <h2 className="section-title">Winnipeg renovation guides</h2>
              <p className="section-desc">
                Plain answers on permits, choosing a contractor and planning your project.{' '}
                <Link className="blog-inline-link" to="/blog">Browse all renovation guides</Link>
              </p>
            </div>
            <div className="blog-grid">
              {GUIDES.map((post) => (
                <div className="reveal" key={post.slug}>
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 13. QUICK CTA BANNER */}
      <CtaBanner />
    </main>
  );
}
