import PageHero from '../components/PageHero.jsx';
import Process from '../components/Process.jsx';
import RichBody from '../components/RichBody.jsx';
import Testimonial from '../components/Testimonial.jsx';
import Guarantees from '../components/Guarantees.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import { REPLY_TIME, SITE_PHONE, TIMELINES } from '../data/facts.js';
import { usePageSeo } from '../hooks/useSeo.js';

// The seven real steps of a Bridgeland renovation (owner-confirmed facts only:
// free on-site visit, free written quote, nothing starts before approval,
// permits coordinated, weekly updates). How changes are priced is not
// owner-confirmed, so the page gives it as guidance only.
const STEPS = [
  {
    num: '01',
    title: 'Instant Quote or a Call',
    text: `Start with our free instant quote for a starting price range, or call ${SITE_PHONE} and tell us what you have in mind. We reply within ${REPLY_TIME}.`,
  },
  {
    num: '02',
    title: 'Free On-Site Visit',
    text: 'We come to your home or business, look at the space with you, take measurements and talk through what you want to change, your budget range and your timing.',
  },
  {
    num: '03',
    title: 'Written Quote & Schedule',
    text: 'You get a free written quote with the scope, the price and a schedule, with taxes shown. Nothing starts until you have read it and approved it.',
  },
  {
    num: '04',
    title: 'Selections & Permits',
    text: 'You choose finishes and fixtures with the schedule in mind, and we coordinate any permits the work needs with the City of Winnipeg or your local municipality.',
  },
  {
    num: '05',
    title: 'Build, With Weekly Updates',
    text: 'Work starts on the agreed date and you get a progress update every week, so you always know what was done and what comes next.',
  },
  {
    num: '06',
    title: 'Inspections & Final Walkthrough',
    text: 'Required inspections are booked as the work reaches each stage. At the end we walk through the space with you and list anything that still needs finishing.',
  },
  {
    num: '07',
    title: 'Handover',
    text: 'We complete that list, clean up and hand the finished space back to you, ready to use.',
  },
];

// Typical timelines: TIMELINES in src/data/facts.js, the one source the service
// pages, FAQs and cost guides read them from.
const TIMELINE_BLOCKS = [
  { t: 'h2', x: 'How long does a renovation take?' },
  {
    t: 'p',
    x: `Most bathrooms take ${TIMELINES.bathroom.words} and most kitchens ${TIMELINES.kitchen.words} once the cabinets are on site. Basements usually take ${TIMELINES.basement.words}, and whole-home renovations and home additions ${TIMELINES.wholeHome.words}. Your written quote includes a schedule for your own project, so you know the dates before you approve anything.`,
  },
  {
    t: 'table',
    caption: 'Typical time on site, by project',
    head: ['Project', 'Typical time', 'What can change it'],
    rows: [
      ['[Bathroom renovation](/services/bathroom-renovations)', TIMELINES.bathroom.short, 'Layout changes, tile work, whether it is your only bathroom'],
      ['[Kitchen renovation](/services/kitchen-renovations)', TIMELINES.kitchen.short, 'Cabinet delivery; counters are templated after the cabinets are set'],
      ['[Basement development](/services/basement-renovations)', TIMELINES.basement.short, 'Size, new bedrooms or a bathroom, permits and inspections'],
      ['[Whole-home renovation](/services/whole-home-renovations)', TIMELINES.wholeHome.short, 'Size of the house and how much of it is renovated'],
      ['[Home addition](/services/home-additions)', TIMELINES.addition.short, 'Permits, foundation conditions and structural changes'],
    ],
    note: 'Typical ranges once permits and materials are ready. The schedule in your written quote is the one that applies to your project.',
  },
  { t: 'h2', x: 'What happens if the plan changes?' },
  {
    t: 'p',
    x: 'Plans change: you may decide to add something, or a problem may turn up once a wall or floor is opened. Any change to the scope should be agreed, with its cost in writing, before that work is done, so ask how changes are handled when you review your written quote. Your weekly progress update shows where the schedule stands.',
  },
  { t: 'h2', x: 'Who looks after permits and inspections?' },
  {
    t: 'p',
    x: 'We do. When your project needs permits or inspections, we include them in the plan and coordinate them with the City of Winnipeg or your local municipality, and we book inspections as each stage of the work is ready. Read our [guide to renovation permits in Winnipeg](/blog/winnipeg-renovation-permits), or find more answers on our [renovation FAQs page](/faqs).',
  },
];

export default function ProcessPage() {
  usePageSeo('/our-process');

  return (
    <main>
      <PageHero
        eyebrow="How We Work"
        title="A CLEAR PLAN"
        highlight="FROM DAY ONE"
        description="Seven steps: a free on-site visit, a free written quote you approve first, permits coordinated for you, weekly updates, then inspections and a walkthrough before handover."
        primaryLink={{ to: '/contact-us', label: 'START A CONVERSATION' }}
      />
      <Process
        steps={STEPS}
        title="Our renovation process, step by step"
        desc="Seven steps from your first question to the day we hand the space back."
      />

      {/* Left out until the owner switches a guarantee on
          (src/data/guarantees.js; __HAS_GUARANTEES__ in vite.config.js). */}
      {__HAS_GUARANTEES__ && <Guarantees page="process" />}

      {/* No .reveal on long text: it would sit at opacity 0 until the observer runs. */}
      <article className="blog-article-section" id="timelines">
        <div className="container blog-article-container">
          <div className="blog-article-body">
            <RichBody blocks={TIMELINE_BLOCKS} />
          </div>
        </div>
      </article>

      <Testimonial cta="process-google-reviews" />
      <CtaBanner />
    </main>
  );
}
