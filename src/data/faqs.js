// Site-wide FAQs for /faqs, grouped by topic, and the three /contact-us
// questions (CONTACT_FAQS, at the end). Lives in data so the page, the
// build-time SEO layer (head.js: FAQPage JSON-LD) and the llms files
// (build-seo-files.mjs) read exactly the same answers.
//
// Rules (SEO plan §7, §12): answers are 40–70 words and open with the direct
// answer; only facts the owner has confirmed, or rules checked on an official
// page (listed in FAQ_SOURCES with the date checked). No insurance, WCB,
// licence, warranty or payment-schedule questions until the owner supplies
// proof. Service-specific questions stay on the service pages.
//
// `more` ({ label, to }) adds a link under an answer on the page only; the
// FAQPage schema and the llms files use `q` and `a`.
//
// Readability (plan §19): no paragraph over 60 words, the `more` link label
// included. A blank line ("\n\n") in `a` splits it into paragraphs on the page
// (FaqAccordion.jsx); the schema and llms files join them with a space.
import {
  NEARBY_AREAS_TEXT,
  OFFICE_HOURS_TEXT,
  REPLY_TIME,
  SERVICE_AREA_STATEMENT,
  SITE_EMAIL,
  SITE_PHONE,
  TIMELINES,
} from './facts.js';

/** "Monday to Friday, 8:30 a.m. to 4:30 p.m.", defined in facts.js; re-exported for existing imports. */
export { OFFICE_HOURS_TEXT };

/** Official pages the permit answers rely on, with the date they were checked. */
export const FAQ_SOURCES = [
  {
    label: 'City of Winnipeg: Home renovations (building permits)',
    url: 'https://www.winnipeg.ca/building-development/building-renovating/home-improvement-projects/home-renovations',
    accessed: '2026-10-13',
  },
  {
    label: 'City of Winnipeg: Basement/lower level development',
    url: 'https://www.winnipeg.ca/building-development/building-renovating/home-improvement-projects/basementlower-level-development',
    accessed: '2026-10-13',
  },
  {
    label: 'City of Winnipeg: Information Bulletin 2026-007-B, Building permit requirements for housing',
    url: 'https://www.winnipeg.ca/media/6116',
    accessed: '2026-10-13',
  },
];

/** The FAQ groups, in page order. `id` is the group's anchor on /faqs. */
export const FAQ_GROUPS = [
  {
    id: 'costs-and-quotes',
    title: 'Costs and quotes',
    items: [
      {
        q: 'How much does a renovation cost in Winnipeg?',
        a: 'It depends on the size of the space, the scope, the finishes you choose and what we find behind the walls. For a starting range, try our free instant quote or read our cost guides for kitchens, bathrooms and basements. Your actual price comes in the free written quote after we have seen the space.',
        more: { label: 'See renovation cost ranges', to: '/renovation-cost-winnipeg' },
      },
      {
        q: 'Are the on-site visit and the quote really free?',
        a: 'Yes. The on-site visit and the written quote are both free, and there is no obligation to go ahead. We look at the space with you, talk through what you want, and then send a written quote with the scope, price and schedule, so you can decide in your own time.',
      },
      {
        q: 'What is the difference between the instant quote and a written quote?',
        a: 'The instant quote is an online price calculator: you answer a few questions and see a starting price range in minutes. The written quote comes after our free on-site visit, once we have measured the space and agreed the scope. It sets out the work, the price and the schedule, with taxes shown.',
        more: { label: 'Get a free instant quote', to: '/instant-quote' },
      },
      {
        q: 'What does the instant quote cover?',
        a: 'Kitchen, bathroom and basement renovations. You pick the size of the space and your options, and it shows the starting range our estimator uses. It can’t see your home, so wiring, plumbing, structure and site conditions aren’t in it. Whole-home, addition and commercial projects aren’t covered: they are priced after a free on-site visit.',
      },
      {
        q: 'What makes a renovation cost more?',
        a: 'The biggest factors are size, moving plumbing, walls or windows, the finishes you choose, and the condition of what is already there, such as old wiring, moisture or uneven floors. Permits, drawings and access also play a part. We point out the cost drivers at the on-site visit, so there are fewer surprises later.',
      },
      {
        q: 'What happens if the scope changes during the project?',
        a: 'Changes happen, whether you decide to add something or a problem turns up behind a wall. Any change to the scope should be agreed, with its cost in writing, before that work is done, so ask how changes are handled when you review your written quote. In older homes, keep a contingency for surprises.',
      },
      {
        // General explainer only: no financing is offered or implied (plan guardrail).
        q: 'How do people pay for a renovation?',
        a: 'Many homeowners talk to their own bank or credit union, and a home equity line of credit, which is secured by the home, is one option many consider. Businesses often look at bank loans or a landlord’s improvement allowance.\n\nWhichever route you take, get your written quote first, so you know how much you actually need to borrow.',
        more: { label: 'Read our guide to renovation financing in Canada', to: '/blog/home-renovation-financing-canada' },
      },
    ],
  },
  {
    id: 'permits-and-rules',
    title: 'Permits and rules',
    items: [
      {
        q: 'Do I need a permit for my renovation in Winnipeg?',
        a: 'Often, yes. Finishing a basement into living space or creating a new bedroom requires a building permit, and the City of Winnipeg says kitchens, bathrooms, open-concept changes and new or larger exterior openings may need one. Cosmetic work such as painting, flooring and millwork does not.\n\nElectrical or plumbing work can need its own permit. We confirm what your project needs at the on-site visit.',
        more: { label: 'Read our guide to renovation permits in Winnipeg', to: '/blog/winnipeg-renovation-permits' },
      },
      {
        q: 'Do you handle permits and inspections?',
        a: 'Yes. When a project needs permits or inspections, we include them in the plan and coordinate them with the City of Winnipeg or your local municipality. The City notes that homeowners need the correct permits before certain renovations start, so we tell you what is needed and keep you informed as each inspection is booked and completed.',
      },
      {
        q: 'Who issues building permits outside Winnipeg?',
        a: 'Outside the city, building permits come from the local municipality or planning district, and their requirements can differ from Winnipeg’s.\n\nOur service-area page lists who issues building permits in each community we serve, and we coordinate with that office for you as part of the project, just as we do with the City of Winnipeg.',
        more: { label: 'See who issues permits in each community', to: '/service-areas' },
      },
    ],
  },
  {
    id: 'timelines',
    title: 'Timelines and living through a renovation',
    items: [
      {
        q: 'How long does a renovation take?',
        a: `Most bathrooms take ${TIMELINES.bathroom.words}, most kitchens ${TIMELINES.kitchen.words} once the cabinets are on site, and basements ${TIMELINES.basement.words}. Whole-home renovations and home additions usually run ${TIMELINES.wholeHome.words}.\n\nPermits, product lead times and what we find when walls are opened can move these dates, and your written quote includes a schedule.`,
        more: { label: 'See our process and typical timelines', to: '/our-process' },
      },
      {
        q: 'Can I stay in my home during the renovation?',
        a: 'Often, yes. It depends on the size and location of the work. If it is your only bathroom or kitchen, we plan the order of work to keep the disruption as short as we can. At the on-site visit we explain what will be usable, how dust will be controlled and when to expect interruptions.',
      },
      {
        q: 'How will I know how my project is going?',
        a: 'You get a progress update every week: what was done, what comes next, and any decisions we need from you. If something changes, such as a delivery date or a problem found behind a wall, we tell you and agree the next step with you before going ahead.',
      },
    ],
  },
  {
    id: 'service-area-and-jobs',
    title: 'Service area and the work we do',
    items: [
      {
        q: 'What areas do you serve?',
        a: `${SERVICE_AREA_STATEMENT} If you are a little further out, call us at ${SITE_PHONE} and we will tell you honestly whether we can take on your project.`,
        more: { label: 'See our service area', to: '/service-areas' },
      },
      {
        q: 'What types of projects do you take on?',
        a: 'For homes, we renovate kitchens, bathrooms, basements and whole houses, and build home additions. For businesses, we renovate offices, retail stores, restaurants, cafés and bars, hotels, and medical, dental and physiotherapy clinics. We also install flooring, windows and doors, and handle exterior painting, masonry and stucco, and demolition.',
        more: { label: 'Browse all renovation services', to: '/services' },
      },
      {
        q: 'Can you work after hours on a commercial renovation?',
        a: 'Yes. For commercial projects we can schedule work after hours or on weekends, so your business can keep serving customers or patients while the renovation goes ahead. We plan the work around your lease dates and opening hours from the start, and send weekly updates so you always know what is happening next.',
        more: { label: 'See our commercial renovation services', to: '/services/commercial-renovations' },
      },
      {
        q: 'Do you take on smaller jobs as well as full renovations?',
        a: 'Yes. Alongside full renovations, we quote smaller scopes such as new countertops or a backsplash, a new vanity or tub, flooring, windows and doors, or exterior painting. Tell us what you have in mind and we will scope just that part at the free on-site visit, with a written quote before anything starts.',
      },
      {
        q: 'Do you work with property managers, architects and designers?',
        a: 'Yes. We quote vacant-unit turnovers, common areas, washrooms and multi-unit upgrades for property managers and building owners, and we build to supplied drawings and specifications from architects, engineers and interior designers.\n\nWe walk the site against the drawings before work starts and raise anything that won’t work on site early, before it becomes a change order.',
        more: { label: 'See our general contracting service', to: '/services/general-contracting' },
      },
    ],
  },
  {
    id: 'process',
    title: 'How the process works',
    items: [
      {
        q: 'How do I get started?',
        a: `Use our free instant quote for a starting price range, call ${SITE_PHONE}, or book a free on-site visit online. We reply within ${REPLY_TIME}, arrange a time to see the space, and follow up with a written quote. Our office hours are ${OFFICE_HOURS_TEXT}${OFFICE_HOURS_TEXT.endsWith('.') ? '' : '.'}`,
        more: { label: 'Book a free on-site visit', to: '/book-online' },
      },
      {
        q: 'What are your office hours?',
        a: `Our office is open ${OFFICE_HOURS_TEXT} and closed on weekends. Call ${SITE_PHONE} during those hours, or email ${SITE_EMAIL} or send your project details online at any time, and we will reply within ${REPLY_TIME}. Commercial renovation work itself can be scheduled after hours or on weekends.`,
      },
      {
        q: 'What happens at the free on-site visit?',
        a: 'We look at the space with you, take measurements, and talk through what you want to change, your budget range and your timing. We also check the things that affect the price, such as where the plumbing runs and the condition of what is there now. Then we prepare your written quote.',
      },
      {
        q: 'Does any work start before I approve the quote?',
        a: 'No. Nothing starts until you have read and approved the written quote, which sets out the scope, price and schedule, with taxes shown. Once you approve it, we confirm the start date, help you with selections and coordinate any permits the project needs before work begins.',
      },
      {
        q: 'What should I have ready before the visit?',
        a: 'A few photos or screenshots of what you like, a list of must-haves and nice-to-haves, and a rough budget range all help. Mention any known problems, such as leaks, past water in the basement or drafty windows, and any dates you are working toward, like a move-in or a lease start.',
      },
    ],
  },
];

/** Every FAQ in page order, flat ([{ q, a, more? }]): the FAQPage schema and llms files. */
export const SITE_FAQS = FAQ_GROUPS.flatMap((group) => group.items);

/**
 * The three questions on /contact-us (plan §7): the free visit, how fast we
 * reply, and where we go. Worded for that page, so no question and answer
 * repeats one on /faqs. ContactPage.jsx renders them and passes them to
 * usePageSeo; head.js must pass the same list for the prerendered FAQPage.
 */
export const CONTACT_FAQS = [
  {
    q: 'Is there a charge for the on-site visit?',
    a: 'No. The on-site visit is free, and so is the written quote that follows it. We come to your home or business at a time that suits you, look at the space with you and take measurements. There is no obligation to go ahead, and nothing starts until you approve the quote.',
  },
  {
    q: 'How soon will I hear back after I get in touch?',
    a: `Within ${REPLY_TIME}. We reply by phone, text or email, whichever you prefer, ask a few questions about the project and set up a time to see the space. Our office is open ${OFFICE_HOURS_TEXT}, and you can send your details through the form on this page at any time.`,
  },
  {
    q: 'Do you come out to my area?',
    a: `Yes, anywhere in Winnipeg and in nearby communities within about an hour of the city: ${NEARBY_AREAS_TEXT}. We come to your home or business for the free on-site visit. Further out? Call ${SITE_PHONE} and we will tell you honestly whether we can help.`,
    more: { label: 'See our service area', to: '/service-areas' },
  },
];
