// Basement renovation cost guide — content for /services/basement-renovations/cost
// (rendered by src/pages/CostGuidePage.jsx; shape documented in ./index.js).
//
// PRICES: only the ranges Bridgeland's own public instant estimator uses for
// basements (estimator.bridgelandbuilders.com/api/services, read 2026-10-13).
// The estimator publishes min/max per size tier and per option but not how it
// combines them, so this page never adds ranges together or quotes a total.
// Timeline and "what's included" come from the basement service page
// (src/data/services/basement-renovations.js). Code figures (bedroom window,
// ceiling height, backwater valve, bathroom fan) are from the City of
// Winnipeg's basement construction guide (updated October 2025) linked in
// `sources`; radon from Health Canada. No secondary-suite rule numbers here
// (they live in the suite guide once re-verified after the 2025 zoning
// changes). Refresh every January (title year = period).

import { OFFICE_HOURS_SHORT, REPLY_TIME, SITE_PHONE, TIMELINES } from '../facts.js';

const ACCESSED = '2026-10-13';

export default {
  id: 'basement-renovations',
  path: '/services/basement-renovations/cost',
  serviceSlug: 'basement-renovations',
  status: 'live',

  seo: {
    title: 'Basement Renovation Cost in Winnipeg (2026) | Bridgeland',
    description:
      'Basement development costs in Winnipeg: starting ranges from $25,000 to $150,000 by size in our estimator, plus what a bathroom and egress window add.',
    primaryKeyword: 'basement renovation cost Winnipeg',
    published: '2026-10-13',
    updated: '2026-10-15',
  },

  eyebrow: 'Basement Development Cost',
  h1: { title: 'BASEMENT RENOVATION COST', highlight: 'IN WINNIPEG' },
  intro:
    'Starting ranges from our own instant estimator for finishing or redoing a basement, what moves the price, and the City rules that affect it.',

  answerHeading: 'How much does it cost to finish a basement in Winnipeg?',
  answer:
    'Our instant estimator starts a basement development in Winnipeg at $25,000–$80,000 for up to 500 sq ft. Medium basements of 501–1,000 sq ft start at $45,000–$100,000, and large ones of 1,001–1,500 sq ft at $75,000–$150,000. A bathroom, an egress window and your flooring move the number, and the written quote after a free on-site visit is final.',

  dataBasis: {
    source: 'Bridgeland Builders instant estimator starting ranges (public price guide)',
    period: 'October 2026',
    note: 'Starting ranges before your on-site visit; your written quote is final.',
  },

  tables: [
    {
      caption: 'Basement development starting ranges by size',
      head: ['Basement size', 'Floor area', 'Starting range'],
      rows: [
        ['Small (Essential)', 'Up to 500 sq ft', '$25,000–$80,000'],
        ['Medium (Signature)', '501–1,000 sq ft', '$45,000–$100,000'],
        ['Large (Luxury)', '1,001–1,500 sq ft', '$75,000–$150,000'],
      ],
      note: 'The starting ranges our [instant estimator](/instant-quote) uses, before the options below. Your written quote after the free on-site visit is the final price.',
    },
    {
      caption: 'Basement options in our estimator and the range for each',
      head: ['Option', 'Choice', 'Estimator range'],
      rows: [
        ['Plumbing', 'New plumbing needed', '$1,500–$2,750'],
        ['Bathroom', 'Adding a bathroom', '$5,000–$7,500'],
        ['Flooring', 'Carpet', '$1,000–$2,000'],
        ['Flooring', 'Laminate', '$1,500–$2,500'],
        ['Flooring', 'Ceramic or porcelain tile', '$2,500–$3,500'],
        ['Flooring', 'Hardwood', '$3,000–$4,000'],
        ['Extras', 'Built-in shelving or storage', '$500–$1,000'],
        ['Extras', 'Soundproofing', '$1,000–$2,000'],
        ['Extras', 'Egress window installation', '$2,500–$4,000'],
        ['Use of the space', 'Family room, home theatre, gym, office, guest suite, in-law or rental suite, or a mix', 'No change'],
      ],
      note: 'Use these to compare choices, not as stand-alone prices for the item. How you use the space doesn’t change the estimator range, but a bedroom or a secondary suite brings code and permit requirements that are priced in your written quote.',
    },
  ],

  driversTitle: 'What changes the cost of a basement development',
  driversDesc: 'The order matters down here: what is behind the foundation wall comes before the finishes. These are the things we check at the on-site visit.',
  drivers: [
    {
      title: 'Basement size',
      text: 'Size sets the starting range: up to 500 sq ft is $25,000–$80,000 in our estimator, and 1,001–1,500 sq ft is $75,000–$150,000. Each tier also carries a finish label in the estimator: Essential, Signature or Luxury.',
    },
    {
      title: 'Moisture and the foundation',
      text: 'We check for moisture before anything is framed. If water is getting in through grading, a downspout or a foundation crack, the cause has to be fixed first, and that work is added to the scope before finishing starts.',
    },
    {
      title: 'A bathroom and new plumbing',
      text: 'Adding a bathroom runs $5,000–$7,500 in the estimator and new plumbing $1,500–$2,750. The City requires a backwater valve to protect new plumbing branches installed below grade, and plumbing work needs its own permit.',
    },
    {
      title: 'Bedrooms and egress windows',
      text: 'Egress window installation runs $2,500–$4,000 in the estimator. Under the City’s guide, a basement bedroom needs a window with at least 0.35 m² (3.77 sq ft) of clear opening, unless it has a door straight outside.',
    },
    {
      title: 'Ceiling height, ducts and beams',
      text: 'The City’s guide sets minimum ceiling heights for finished rooms, generally 2.1 m (6 ft 11 in) from the finished floor to the ceiling. Low ducts, beams and the mechanical room shape the layout, and boxing them in adds work.',
    },
    {
      title: 'Insulation, flooring and extras',
      text: 'Foundation walls must be insulated to the City’s minimum values for a heated space. Flooring runs from carpet at $1,000–$2,000 to hardwood at $3,000–$4,000 in the estimator, and soundproofing is $1,000–$2,000.',
    },
  ],

  sections: [
    {
      h2: 'Can you finish a basement for $20,000?',
      blocks: [
        {
          t: 'p',
          x: 'Not as a full development in our estimator: the smallest range, for basements up to 500 sq ft, starts at $25,000 and runs to $80,000. Share your budget at the on-site visit. We look at moisture, ceiling height and where the mechanical sits, and tell you what is realistic for your space before you get attached to a plan.',
        },
        {
          t: 'p',
          x: 'Painting and new flooring alone don’t need a building permit in Winnipeg, but adding rooms, bedrooms or living space does. Our [basement development permit guide](/blog/basement-development-permits-winnipeg) explains how that works, and our [Winnipeg renovation cost guide](/renovation-cost-winnipeg) compares basement prices with kitchens and bathrooms.',
        },
      ],
    },
    {
      h2: 'How much does it cost to add a bathroom in the basement?',
      blocks: [
        {
          t: 'p',
          x: 'In our estimator, adding a basement bathroom runs $5,000–$7,500, with new plumbing at $1,500–$2,750. What changes the real number is the drain: if there isn’t one where the bathroom needs to go, the concrete is broken and the drain re-run, or an up-flush system is used. We tell you which your basement needs.',
        },
        {
          t: 'p',
          x: 'The City of Winnipeg’s basement construction guide also requires a backwater valve on new plumbing branches below grade, an exhaust fan of at least 25 L/s (50 cfm) vented outdoors or through an HRV in any room with a toilet, and an inspection of plumbing before it is covered. Those items are part of the written quote.',
        },
      ],
    },
    {
      h2: 'Do you need an egress window in a basement bedroom?',
      blocks: [
        {
          t: 'p',
          x: 'Yes, unless the bedroom has a door straight to the outside. The City of Winnipeg’s guide requires a bedroom window that opens from inside without tools, with at least 0.35 m² (3.77 sq ft) of clear opening and no dimension under 380 mm (15 in). Our estimator prices egress window installation at $2,500–$4,000.',
        },
        {
          t: 'p',
          x: 'Where the window opens into a window well, the guide calls for at least 760 mm (30 in) of clearance in front of it. If the existing windows are too small, they have to be replaced, or the room can’t be permitted as a bedroom.',
        },
      ],
    },
    {
      h2: 'What should you check before finishing a basement?',
      blocks: [
        {
          t: 'p',
          x: 'Moisture, ceiling height and radon. A damp basement has to be fixed before framing, finished rooms need enough ceiling height under the City’s rules, and Health Canada says a radon test should run for at least three months. Checking all three first avoids paying to open up finished walls later.',
        },
        {
          t: 'li',
          x: '**Moisture:** find and fix the source before anything is framed. See our guide to [basement flood protection in Winnipeg](/blog/basement-flood-protection-winnipeg).',
        },
        {
          t: 'li',
          x: '**Radon:** a long-term test takes at least three months, so start well before work begins. See our guide to [radon testing before finishing a basement](/blog/radon-testing-before-finishing-a-basement).',
        },
        {
          t: 'li',
          x: '**A suite:** a secondary suite has its own permit requirements. Read our guide to [secondary suite rules in Winnipeg](/blog/secondary-suite-rules-winnipeg) before you plan one.',
        },
        {
          t: 'p',
          x: 'Our [basement development](/services/basement-renovations) page shows how a project runs, from the first assessment to handover.',
        },
      ],
    },
  ],

  faqs: [
    {
      q: 'How long does a basement development take?',
      a: `${TIMELINES.basement.wordsCapitalized} for a typical basement. The order matters: any water problems first, then framing, insulation, electrical and plumbing, inspections before the walls are covered, then drywall and finishes. A bathroom, or a bedroom that needs an egress window, adds steps, and we plan them into the schedule from the start.`,
    },
    {
      q: 'Do I need a permit to finish a basement in Winnipeg?',
      a: 'Yes, if you are adding rooms, bedrooms or living space. The City of Winnipeg requires a building permit for basement development, plus separate electrical and plumbing permits, and wiring and plumbing are inspected before they are covered. Painting and flooring alone don’t need a building permit. We coordinate permits and inspections as part of the job.',
    },
    {
      q: 'Will my written quote match the estimator range?',
      a: 'Not necessarily. The estimator gives a starting range from the size of your basement and the options you pick. The written quote comes after a free on-site visit, where we check moisture, ceiling height, the windows and where the mechanical sits, and agree the scope. That written quote, with taxes shown, is the final price.',
    },
    {
      q: 'What is included in a basement development quote?',
      a: 'The scope we agree at the visit. A full basement typically covers moisture checks and prep, framing and insulation, electrical and heat runs, any egress window, bathroom or wet bar, then flooring, doors, trim and paint. Your written quote lists exactly what is in, including the permits and inspections the job needs.',
    },
    {
      q: 'How do I get an exact price for my basement?',
      a: `Book a free on-site visit, or call ${SITE_PHONE}, ${OFFICE_HOURS_SHORT}. We look at the space, ask how you want to use it, check what the windows and ceiling height allow, then send a free written quote. We reply to every request within ${REPLY_TIME}.`,
    },
  ],

  sources: [
    {
      label: 'City of Winnipeg — Basement/lower level development (permit requirements)',
      url: 'https://www.winnipeg.ca/building-development/building-renovating/home-improvement-projects/basementlower-level-development',
      accessed: ACCESSED,
    },
    {
      label: 'City of Winnipeg — Basement/lower level development: construction information (guide, updated October 2025)',
      url: 'https://www.winnipeg.ca/media/6349',
      accessed: ACCESSED,
    },
    {
      label: 'City of Winnipeg — Plumbing installations (plumbing permits)',
      url: 'https://www.winnipeg.ca/building-development/building-renovating/home-improvement-projects/plumbing-installations',
      accessed: ACCESSED,
    },
    {
      label: 'Health Canada — Testing your home for radon',
      url: 'https://www.canada.ca/en/health-canada/services/health-risks-safety/radiation/radon/testing-your-home.html',
      accessed: ACCESSED,
    },
  ],

  estimatorKey: 'basement',
  estimatorTitle: 'See a starting price for your basement',
  estimatorDesc:
    'Choose your basement size, how you’ll use it, flooring and extras to see the starting range our estimator uses. It’s free and there’s no obligation.',

  related: ['/services/basement-renovations', '/book-online', '/renovation-cost-winnipeg'],
};
