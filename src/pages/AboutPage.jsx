import PageHero from '../components/PageHero.jsx';
import Stats from '../components/Stats.jsx';
import WhyUs from '../components/WhyUs.jsx';
import Process from '../components/Process.jsx';
import RichBody from '../components/RichBody.jsx';
import Testimonial from '../components/Testimonial.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import { PEOPLE } from '../data/people.js';
import { BBB_PROFILE_URL, SERVICE_AREA_STATEMENT } from '../data/siteConfig.js';
import { usePageSeo } from '../hooks/useSeo.js';

// The team, from src/data/people.js (empty until the owner supplies real
// people). Each card's id is the person's key, so post bylines and the Person
// schema @id (/about-us#<id>) land on it.
const TEAM = Object.entries(PEOPLE);

// "Who is Bridgeland Builders?" — answer first, owner-confirmed facts only. No
// team names, credentials, licences, insurance or warranty until the owner
// supplies them (src/data/people.js, SEO plan §11.3).
const ABOUT_BLOCKS = [
  { t: 'h2', x: 'Who is Bridgeland Builders?' },
  {
    t: 'p',
    x: 'Bridgeland Builders is a renovation and construction contractor based in Winnipeg, Manitoba. We renovate homes and commercial spaces in Winnipeg and nearby communities within about an hour. Our team brings over 60 years of combined experience and more than 100 completed projects, and every project starts with a free on-site visit and a free written quote.',
  },
  { t: 'h2', x: 'What do we work on?' },
  {
    t: 'p',
    x: 'For homeowners, we renovate [kitchens](/services/kitchen-renovations), [bathrooms](/services/bathroom-renovations), [basements](/services/basement-renovations) and [whole homes](/services/whole-home-renovations), and build [home additions](/services/home-additions). For businesses, we handle [commercial renovations](/services/commercial-renovations) of offices, retail stores, restaurants, cafés and bars, hotels, and medical, dental and physiotherapy clinics, with work scheduled after hours or on weekends when your business needs to stay open.',
  },
  { t: 'h2', x: 'How do we run a project?' },
  {
    t: 'p',
    x: 'You get a written quote before anything starts, and nothing begins until you approve it. When the work needs permits and inspections, we coordinate them with the City of Winnipeg or your local municipality. During the build you get a progress update every week. You can read [how a Bridgeland renovation runs, step by step](/our-process).',
  },
  { t: 'h2', x: 'Where do we work?' },
  {
    t: 'p',
    x: `${SERVICE_AREA_STATEMENT} We come to you for the on-site visit. See [the communities we serve and who issues permits in each](/service-areas).`,
  },
  { t: 'h2', x: 'How do we write our guides?' },
  {
    t: 'p',
    x: 'Our renovation guides and cost pages are written from Bridgeland Builders’ own information, such as our process, timelines and estimator price ranges. Facts about permits, programs and rules come from official sources, linked with the date we checked them. Read [how we write, source and correct our guides](/editorial-policy).',
  },
  // Plan §19: a link only, no rating. Licence, insurance, WCB and warranty
  // lines wait for documents from the owner.
  { t: 'h2', x: 'Credentials you can check', hidden: !BBB_PROFILE_URL },
  {
    t: 'p',
    x: `Bridgeland Builders has a business profile with the Better Business Bureau. [Check us on the Better Business Bureau](${BBB_PROFILE_URL}) to see it for yourself.`,
    hidden: !BBB_PROFILE_URL,
  },
];

// The values that used to sit on the process cards, now on About (SEO plan §7).
const VALUES = [
  {
    num: '01',
    title: 'Prices in Writing',
    text: 'You get a free written quote before anything starts, and nothing begins until you approve it.',
  },
  {
    num: '02',
    title: 'Weekly Updates',
    text: 'A progress update every week: what was done, what comes next, and any decisions we need from you. No waiting until the end to find out.',
  },
  {
    num: '03',
    title: 'Permits Done Properly',
    text: 'When your project needs permits and inspections, we build them into the plan and coordinate them with the City of Winnipeg or your local municipality.',
  },
  {
    num: '04',
    title: 'Built Around You',
    text: 'It starts with a free visit to your space and your wish list. For businesses, we plan around your lease dates and opening hours, after hours if needed.',
  },
];

export default function AboutPage() {
  usePageSeo('/about-us');

  return (
    <main>
      <PageHero
        eyebrow="About Bridgeland Builders"
        title="LOCAL EXPERIENCE."
        highlight="HONEST WORK."
        description={
          TEAM.length > 0
            ? 'Meet the Winnipeg renovation team that brings more than 60 years of combined experience to every home and business project.'
            : 'A Winnipeg renovation contractor bringing more than 60 years of combined experience to every home and business project.'
        }
        primaryLink={{ to: '/our-process', label: 'SEE HOW WE WORK' }}
      />

      {/* No .reveal on long text: it would sit at opacity 0 until the observer runs. */}
      <article className="blog-article-section" id="who-we-are">
        <div className="container blog-article-container">
          <div className="blog-article-body">
            <RichBody blocks={ABOUT_BLOCKS} />
          </div>
        </div>
      </article>

      {/* THE TEAM: only once src/data/people.js lists real people. */}
      {TEAM.length > 0 && (
        <section className="process-section includes-section" id="team">
          <div className="container">
            <div className="section-header center">
              <span className="section-tag">Our Team</span>
              <h2 className="section-title">The people behind Bridgeland Builders</h2>
            </div>
            <div className="includes-grid">
              {TEAM.map(([id, person]) => (
                <div className="include-card" id={id} key={id}>
                  {person.image && (
                    <img
                      className="team-card-photo"
                      src={person.image}
                      alt={person.name}
                      width="400"
                      height="400"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  {person.role && <div className="include-num">{person.role}</div>}
                  <h3>{person.name}</h3>
                  {person.bio && <p>{person.bio}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Stats />
      <WhyUs />
      <Process steps={VALUES} tag="What We Value" title="What you can expect from us" desc={null} />
      <Testimonial />
      <CtaBanner />
    </main>
  );
}
