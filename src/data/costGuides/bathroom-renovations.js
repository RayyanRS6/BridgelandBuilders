// Bathroom renovation cost guide — content for /services/bathroom-renovations/cost
// (rendered by src/pages/CostGuidePage.jsx; shape documented in ./index.js).
//
// PRICES: only the ranges Bridgeland's own public instant estimator uses for
// bathrooms (estimator.bridgelandbuilders.com/api/services, read 2026-10-13).
// The estimator publishes min/max per size tier and per option but not how it
// combines them, so this page never adds ranges together or quotes a total.
// Timeline, "smaller refreshes are welcome" and "what's included" come from the
// bathroom service page (src/data/services/bathroom-renovations.js). Permit
// facts link to the City of Winnipeg pages in `sources`. Refresh every January
// (title year = period).

import { OFFICE_HOURS_SHORT, REPLY_TIME, SITE_PHONE, TIMELINES } from '../facts.js';

const ACCESSED = '2026-10-13';

export default {
  id: 'bathroom-renovations',
  path: '/services/bathroom-renovations/cost',
  serviceSlug: 'bathroom-renovations',
  status: 'live',

  seo: {
    title: 'Bathroom Renovation Cost in Winnipeg (2026) | Bridgeland',
    description:
      'Bathroom renovation costs in Winnipeg: starting ranges from $16,000 to $36,000 by size in our estimator, plus what a new shower, tub, tile and vanity add.',
    primaryKeyword: 'bathroom renovation cost Winnipeg',
    published: '2026-10-13',
    updated: '2026-10-14',
  },

  eyebrow: 'Bathroom Renovation Cost',
  h1: { title: 'BATHROOM RENOVATION COST', highlight: 'IN WINNIPEG' },
  intro:
    'Starting ranges from our own instant estimator, what a new shower or tub adds, and how to get a written quote for your bathroom.',

  answer:
    'Our instant estimator starts a small bathroom renovation in Winnipeg (up to 50 sq ft) at $16,000–$20,000. Medium bathrooms of 51–100 sq ft start at $20,000–$24,000 and large ones of 101–150+ sq ft at $24,000–$36,000. A new shower or tub and your finishes move the number, and the written quote after a free on-site visit is final.',

  dataBasis: {
    source: 'Bridgeland Builders instant estimator starting ranges (public price guide)',
    period: 'October 2026',
    note: 'Starting ranges before your on-site visit; your written quote is final.',
  },

  tables: [
    {
      caption: 'Bathroom renovation starting ranges by size',
      head: ['Bathroom size', 'Floor area', 'Starting range'],
      rows: [
        ['Small', 'Up to 50 sq ft', '$16,000–$20,000'],
        ['Medium', '51–100 sq ft', '$20,000–$24,000'],
        ['Large', '101–150+ sq ft', '$24,000–$36,000'],
      ],
      note: 'The starting ranges our [instant estimator](/instant-quote) uses, before the options below. Your written quote after the free on-site visit is the final price.',
    },
    {
      caption: 'Bathroom options in our estimator and the range for each',
      head: ['Option', 'Choice', 'Estimator range'],
      rows: [
        ['Tub or shower', 'New tub-with-shower combo', '$12,000–$18,000'],
        ['Tub or shower', 'New shower', '$10,000–$15,000'],
        ['Tub or shower', 'New bathtub', '$2,500–$4,500'],
        ['Tub or shower', 'Neither', '$0–$500'],
        ['Lighting', 'Updated lighting', '$300–$800'],
        ['Flooring', 'Ceramic or porcelain tile', '$1,500–$3,000'],
        ['Flooring', 'Luxury vinyl plank', '$1,000–$2,500'],
        ['Flooring', 'Natural stone', '$1,500–$3,500'],
        ['Flooring', 'Other flooring', '$300–$2,000'],
        ['Upgrades', 'Heated flooring', '$1,500–$2,500'],
        ['Upgrades', 'Custom vanity', '$1,000–$5,000'],
        ['Upgrades', 'Double vanity', '$2,000–$4,000'],
        ['Upgrades', 'Smart mirror', '$300–$600'],
      ],
      note: 'Use these to compare choices, not as stand-alone prices for the item. Your written quote prices the actual products and quantities after we measure.',
    },
  ],

  driversTitle: 'What changes the cost of a bathroom renovation',
  driversDesc: 'A bathroom is a small room with a lot packed into it. These are the things we look at during the on-site visit.',
  drivers: [
    {
      title: 'Bathroom size',
      text: 'Size sets the starting range: up to 50 sq ft starts at $16,000–$20,000 in our estimator, and 101–150+ sq ft runs $24,000–$36,000. Larger rooms take more tile, more wall finishing and often a bigger vanity.',
    },
    {
      title: 'Tub and shower',
      text: 'The biggest single option. A new tub-with-shower combo runs $12,000–$18,000 in the estimator and a new shower $10,000–$15,000, while a new bathtub alone is $2,500–$4,500. Keeping what you have is $0–$500.',
    },
    {
      title: 'Moving the plumbing',
      text: 'Keeping the toilet, tub and sink drains where they are is simpler. Moving them means opening the floor and altering the plumbing system, which needs a City plumbing permit, and it is priced after the on-site visit.',
    },
    {
      title: 'Floors and heated floors',
      text: 'Ceramic or porcelain tile, luxury vinyl plank and natural stone each carry their own range, and heated flooring is $1,500–$2,500 in the estimator. The floor is already open during a renovation, which makes it the time to add heat.',
    },
    {
      title: 'Vanity, mirror and lighting',
      text: 'A custom vanity runs $1,000–$5,000 in the estimator and a double vanity $2,000–$4,000. Smaller upgrades, such as a smart mirror at $300–$600 or updated lighting at $300–$800, add up too.',
    },
    {
      title: 'What is under the old tile',
      text: 'Older bathrooms can hide water damage in the subfloor or walls, or outdated drains, that only show at demolition. If we find something, we photograph it, show you, and price the repair before we go further.',
    },
  ],

  sections: [
    {
      h2: 'Can you renovate a bathroom for $15,000?',
      blocks: [
        {
          t: 'p',
          x: 'Not as a full renovation in our estimator: the smallest bathroom range, for rooms up to 50 sq ft, starts at $16,000–$20,000, before a new tub or shower. Smaller refreshes are welcome, though, and not every bathroom needs a full remodel. Share your budget at the on-site visit so the written quote focuses on what matters most, such as the shower, the floor or the vanity.',
        },
        {
          t: 'p',
          x: 'Keeping the existing tub or shower is the biggest single saving in the estimator: $0–$500, against $10,000–$15,000 for a new shower or $12,000–$18,000 for a new tub-with-shower combo. To see how bathroom prices compare with other rooms, see our [Winnipeg renovation cost guide](/renovation-cost-winnipeg).',
        },
      ],
    },
    {
      h2: 'Is a new shower cheaper than a tub-and-shower combo?',
      blocks: [
        {
          t: 'p',
          x: 'In our estimator, slightly: a new shower runs $10,000–$15,000 and a new tub-with-shower combo $12,000–$18,000. A new bathtub on its own is $2,500–$4,500. The real difference on your job depends on the size of the shower, the tile and glass you choose, and whether the drain has to move.',
        },
        {
          t: 'p',
          x: 'If you’re weighing a tub against a shower, ask at the visit how each option affects the drain location and the floor. On a concrete slab, moving a drain usually means breaking and re-pouring concrete, so it is worth knowing before you choose.',
        },
      ],
    },
    {
      h2: 'Where can you save on a bathroom renovation?',
      blocks: [
        {
          t: 'p',
          x: 'Keep fixtures where they are and choose durable mid-range finishes. In our estimator, keeping the tub or shower runs $0–$500, luxury vinyl plank floors $1,000–$2,500 against $1,500–$3,500 for natural stone, and skipping the custom-vanity upgrade avoids a $1,000–$5,000 range. Hidden work, like waterproofing, is the wrong place to cut.',
        },
        {
          t: 'li',
          x: '**Leave the drains in place.** Moving a toilet or shower drain means opening the floor and a plumbing permit.',
        },
        {
          t: 'li',
          x: '**Don’t trim what goes behind the tile.** Backer board, a waterproofing membrane and a properly sloped shower base decide how long the bathroom lasts, and they are costly to redo once tiled over.',
        },
        {
          t: 'li',
          x: '**Settle choices early.** If you want to swap a tile or a vanity, we re-price it before anything is ordered.',
        },
        {
          t: 'p',
          x: 'Deciding where to spend? Our guide to [bathroom upgrades that add the most value](/blog/which-bathroom-remodel-upgrades-offer-the-best-return-on-investment-for-canadian-homeowners) covers which features are worth it.',
        },
      ],
    },
    {
      h2: 'Does an ensuite cost more than a main bathroom?',
      blocks: [
        {
          t: 'p',
          x: 'Not because it is an ensuite. Our estimator prices bathrooms by size and options, so an ensuite and a main bathroom with the same floor area and the same choices start in the same range. The difference comes from what goes in: a double vanity ($2,000–$4,000), a larger shower or heated floors each have their own range.',
        },
        {
          t: 'p',
          x: 'Planning one? Our [ensuite renovation guide](/blog/ensuite-renovation-winnipeg) covers layouts and timelines, and our [bathroom renovation](/services/bathroom-renovations) page shows how a project runs from measure to final check.',
        },
      ],
    },
  ],

  faqs: [
    {
      q: 'How long does a bathroom renovation take?',
      a: `${TIMELINES.bathroom.wordsCapitalized} for a typical full bathroom, from demolition to the final bead of silicone. If it is your only bathroom, tell us at the on-site visit: we plan those tighter and get the toilet back in service as early as we can. While the work is on, we protect the hallway, keep the room sealed off and clean up every day.`,
    },
    {
      q: 'Do I need a permit to renovate a bathroom in Winnipeg?',
      a: 'Often. The City of Winnipeg lists bathrooms among renovations that may need a building permit, and altering the plumbing system needs a plumbing permit. Replacing a faucet or fixture in the same spot, without changing the plumbing, doesn’t. We coordinate permits and inspections with the City or your local municipality as part of the job.',
    },
    {
      q: 'How is the estimator range different from my written quote?',
      a: 'The estimator gives a starting range from the bathroom’s size and the options you pick. The written quote follows a free on-site visit, where we measure, look at the plumbing you already have and check the floor, and agree the scope with you. That written quote, with taxes shown, is the final price.',
    },
    {
      q: 'What is included in a bathroom renovation quote?',
      a: 'One written price covering labour, materials and haul-away for the scope we agree. A full bathroom typically covers demolition, plumbing and electrical, backer board and waterproofing, tile, vanity and fixtures, then paint and finishing. If you want to swap a tile or a vanity later, we re-price it before anything is ordered.',
    },
    {
      q: 'How do I get an exact price for my bathroom?',
      a: `Book a free on-site visit, or call ${SITE_PHONE}, ${OFFICE_HOURS_SHORT}. We measure the room, look at the plumbing you already have, talk through what you want to change, then send a free written quote. We reply to every request within ${REPLY_TIME}.`,
    },
  ],

  sources: [
    {
      label: 'City of Winnipeg — Home renovations (building permit requirements)',
      url: 'https://www.winnipeg.ca/building-development/building-renovating/home-improvement-projects/home-renovations',
      accessed: ACCESSED,
    },
    {
      label: 'City of Winnipeg — Plumbing installations (when a plumbing permit is needed)',
      url: 'https://www.winnipeg.ca/building-development/building-renovating/home-improvement-projects/plumbing-installations',
      accessed: ACCESSED,
    },
  ],

  estimatorKey: 'bathroom',
  estimatorTitle: 'See a starting price for your bathroom',
  estimatorDesc:
    'Choose your bathroom size, tub or shower, flooring and upgrades to see the starting range our estimator uses. It’s free and there’s no obligation.',

  related: ['/services/bathroom-renovations', '/book-online', '/renovation-cost-winnipeg'],
};
