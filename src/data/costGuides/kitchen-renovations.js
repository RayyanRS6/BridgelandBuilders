// Kitchen renovation cost guide — content for /services/kitchen-renovations/cost
// (rendered by src/pages/CostGuidePage.jsx; shape documented in ./index.js).
//
// PRICES: only the ranges Bridgeland's own public instant estimator uses for
// kitchens (estimator.bridgelandbuilders.com/api/services, read 2026-10-13).
// The estimator publishes min/max per size tier and per option but not how it
// combines them, so this page never adds ranges together or quotes a total.
// Timeline and "what's included" come from the kitchen service page
// (src/data/services/kitchen-renovations.js). Permit facts link to the City of
// Winnipeg pages in `sources`. Refresh every January (title year = period).

import { OFFICE_HOURS_SHORT, REPLY_TIME, SITE_PHONE, TIMELINES } from '../facts.js';

const ACCESSED = '2026-10-13';

export default {
  id: 'kitchen-renovations',
  path: '/services/kitchen-renovations/cost',
  serviceSlug: 'kitchen-renovations',
  status: 'live',

  seo: {
    title: 'Kitchen Renovation Cost in Winnipeg (2026) | Bridgeland',
    description:
      'Kitchen renovation costs in Winnipeg: starting ranges from $40,000 to $190,000 by size in our estimator, plus what cabinets, counters and appliances add.',
    primaryKeyword: 'kitchen renovation cost Winnipeg',
    published: '2026-10-13',
    updated: '2026-10-15',
  },

  eyebrow: 'Kitchen Renovation Cost',
  h1: { title: 'KITCHEN RENOVATION COST', highlight: 'IN WINNIPEG' },
  intro:
    'Starting ranges from our own instant estimator, what moves a kitchen price up or down, and how to get a written quote for yours.',

  answerHeading: 'How much does a kitchen renovation cost in Winnipeg?',
  answer:
    'Our instant estimator starts a small kitchen renovation in Winnipeg (up to 100 sq ft) at $40,000. Medium kitchens of 100–200 sq ft start at $80,000–$139,999, and large kitchens over 200 sq ft at $140,000–$190,000. Cabinets, countertops, appliances and layout changes move the number from there, and your written quote after a free on-site visit is final.',

  dataBasis: {
    source: 'Bridgeland Builders instant estimator starting ranges (public price guide)',
    period: 'October 2026',
    note: 'Starting ranges before your on-site visit; your written quote is final.',
  },

  tables: [
    {
      caption: 'Kitchen renovation starting ranges by size',
      head: ['Kitchen size', 'Floor area', 'Starting range'],
      rows: [
        ['Small', 'Up to 100 sq ft', '$40,000–$79,999'],
        ['Medium', '100–200 sq ft', '$80,000–$139,999'],
        ['Large', 'Over 200 sq ft', '$140,000–$190,000'],
      ],
      note: 'The starting ranges our [instant estimator](/instant-quote) uses, before the options below. Your written quote after the free on-site visit is the final price.',
    },
    {
      caption: 'Kitchen options in our estimator and the range for each',
      head: ['Option', 'Choice', 'Estimator range'],
      rows: [
        ['Cabinets', 'Stock or standard', '$500–$750'],
        ['Cabinets', 'Semi-custom', '$750–$1,500'],
        ['Cabinets', 'Fully custom', '$1,500–$2,500'],
        ['Cabinets', 'Premium or high-end', '$2,500–$4,000'],
        ['Countertops', 'Laminate', '$500–$1,000'],
        ['Countertops', 'Granite', '$1,500–$2,500'],
        ['Countertops', 'Quartz', '$2,000–$3,000'],
        ['Countertops', 'Keep existing', '$0'],
        ['Appliances', 'Basic package', '$1,000–$1,500'],
        ['Appliances', 'Premium package', '$2,500–$3,500'],
        ['Appliances', 'Keep existing', '$0'],
        ['Island', 'Add a kitchen island', '$1,000–$2,000'],
        ['Lighting', 'Standard fixtures', '$250–$500'],
        ['Lighting', 'Custom or designer fixtures', '$750–$1,250'],
        ['Finishing touches', 'Backsplash', '$250–$750'],
      ],
      note: 'Use these to compare choices, not as stand-alone prices for the item. Your written quote prices the actual products and quantities after we measure.',
    },
  ],

  driversTitle: 'What changes the cost of a kitchen renovation',
  driversDesc: 'Two kitchens the same size can land far apart. These are the things we look at during the on-site visit.',
  drivers: [
    {
      title: 'Kitchen size',
      text: 'Size sets the starting range: up to 100 sq ft starts at $40,000 in our estimator, and over 200 sq ft runs $140,000–$190,000. A bigger room usually means more cabinet runs, more counter and more floor.',
    },
    {
      title: 'Layout changes',
      text: 'Keeping the sink, stove and fridge where they are keeps plumbing, gas and electrical work simple. Moving them adds trade work, and opening up a load-bearing wall needs a beam and the right permits.',
    },
    {
      title: 'Cabinets and countertops',
      text: 'Stock, semi-custom, fully custom or premium cabinets, and laminate, granite or quartz counters, are where similar kitchens split apart on price. The estimator shows the range it uses for each choice.',
    },
    {
      title: 'Appliances',
      text: 'Keeping your appliances adds nothing in the estimator; a basic or premium package each has its own range. If you are keeping them, tell us early so the openings are built to fit.',
    },
    {
      title: 'What is behind the walls',
      text: 'Older kitchens can hide outdated wiring, old drain lines or water damage under the sink that only shows at demolition. Ask at the on-site visit how anything found behind the walls would be handled and priced.',
    },
    {
      title: 'Permits and inspections',
      text: 'The City of Winnipeg lists kitchens among renovations that may need a building permit, and electrical or plumbing changes need their own permits. We coordinate permits and inspections as part of the job.',
    },
  ],

  sections: [
    {
      h2: 'Can you remodel a kitchen for $30,000?',
      blocks: [
        {
          t: 'p',
          x: 'Not as a full renovation in our estimator: the smallest kitchen range, for rooms up to 100 sq ft, starts at $40,000. A lighter refresh is a different job. If you want to keep the layout and replace only some parts, such as the countertops, backsplash or lighting, we can scope just those and price them in writing.',
        },
        {
          t: 'p',
          x: 'Share your budget at the on-site visit, so the written quote is built around the parts of the kitchen that matter most to you. To compare kitchen costs with other rooms, see our [Winnipeg renovation cost guide](/renovation-cost-winnipeg).',
        },
      ],
    },
    {
      h2: 'Where can you save on a kitchen renovation?',
      blocks: [
        {
          t: 'p',
          x: 'Keep the layout, choose stock or semi-custom cabinets, and keep appliances that still work. In our estimator, keeping your countertops or appliances adds nothing, laminate counters run $500–$1,000 against $2,000–$3,000 for quartz, and stock cabinets sit at $500–$750 against $2,500–$4,000 for premium.',
        },
        {
          t: 'li',
          x: '**Leave the sink, range and fridge where they are.** Moving them means moving drains, gas and circuits, which brings in more trades.',
        },
        {
          t: 'li',
          x: '**Spend where the wear is.** Cabinet boxes, drawer hardware and the main work counter take the hardest daily use; decorative extras are easier to add later.',
        },
        {
          t: 'li',
          x: '**Decide before you sign.** Changing finishes after cabinets and counters are ordered changes the cost.',
        },
        {
          t: 'p',
          x: 'Working with a smaller room? See our guide to [design strategies for small kitchens](/blog/essential-design-strategies-for-small-kitchen-renovations).',
        },
      ],
    },
    {
      h2: 'Is quartz more expensive than granite?',
      blocks: [
        {
          t: 'p',
          x: 'In our estimator, slightly: quartz countertops run $2,000–$3,000 and granite $1,500–$2,500, with laminate at $500–$1,000. The real difference on your job depends on the length of counter, the slab you choose, and the cut-outs for the sink and cooktop, which we measure at the on-site visit.',
        },
        {
          t: 'p',
          x: 'Counters are templated after the cabinets are set, so the countertop is one of the last big pieces to go in. Choosing it early keeps the schedule moving.',
        },
      ],
    },
    {
      h2: 'Does moving the sink or removing a wall change the price?',
      blocks: [
        {
          t: 'p',
          x: 'Yes. Moving the sink, dishwasher or range means new drain, water, gas or electrical runs, and removing a wall can mean a structural beam. The estimator doesn’t price these, because they depend on what is under your floor and inside your walls, so they are priced in your written quote after the on-site visit.',
        },
        {
          t: 'p',
          x: 'We will tell you at the visit whether a wall is load-bearing. Our guide to [removing a load-bearing wall in Winnipeg](/blog/removing-a-load-bearing-wall-winnipeg) explains the permits, drawings and beams involved.',
        },
        {
          t: 'p',
          x: 'Structural work needs the right permits, which we coordinate with the City of Winnipeg or your local municipality. Our [Winnipeg renovation permit guide](/blog/winnipeg-renovation-permits) covers which projects need one, and our [kitchen renovation](/services/kitchen-renovations) page shows how a project runs from layout to handover.',
        },
      ],
    },
  ],

  faqs: [
    {
      q: 'How long does a kitchen renovation take?',
      a: `${TIMELINES.kitchen.wordsCapitalized} for most full kitchens once the cabinets are on site. Cabinets and counters are ordered after you approve the written quote, and the countertop template happens after the cabinets are set, which adds about a week in the middle. We set up a temporary spot for your kettle and microwave while the work is on.`,
    },
    {
      q: 'Do I need a permit for a kitchen renovation in Winnipeg?',
      a: 'Often. The City of Winnipeg lists kitchens among home renovations that may need a building permit, and new or altered electrical and plumbing work needs its own permits. Cosmetic work, such as painting or new flooring, doesn’t need a building permit. We coordinate permits and inspections with the City or your local municipality as part of the job.',
    },
    {
      q: 'Is the estimator price the same as a quote?',
      a: 'No. The estimator gives a starting range from your kitchen’s size and the options you pick, before anyone has seen the room. The written quote follows a free on-site visit, where we measure, look at the walls, plumbing and wiring, and agree the scope. That written quote, with taxes shown, is the final price.',
    },
    {
      q: 'What is included in a kitchen renovation quote?',
      a: 'The scope we agree at the visit. A full kitchen typically covers layout planning, demolition and haul-away, electrical and plumbing for the new layout, cabinets, counters and backsplash, appliance hookup, trim and paint. Your written quote lists exactly what is in and what is out, so you can compare it line by line before work begins.',
    },
    {
      q: 'How do I get an exact price for my kitchen?',
      a: `Book a free on-site visit, or call ${SITE_PHONE}, ${OFFICE_HOURS_SHORT}. We measure the room, talk through how you cook and what isn’t working in the kitchen you have now, then send a free written quote. We reply to every request within ${REPLY_TIME}.`,
    },
  ],

  sources: [
    {
      label: 'City of Winnipeg — Home renovations (building permit requirements)',
      url: 'https://www.winnipeg.ca/building-development/building-renovating/home-improvement-projects/home-renovations',
      accessed: ACCESSED,
    },
    {
      label: 'City of Winnipeg — Electrical installations (electrical permits)',
      url: 'https://www.winnipeg.ca/building-development/building-renovating/home-improvement-projects/electrical-installations',
      accessed: ACCESSED,
    },
    {
      label: 'City of Winnipeg — Plumbing installations (plumbing permits)',
      url: 'https://www.winnipeg.ca/building-development/building-renovating/home-improvement-projects/plumbing-installations',
      accessed: ACCESSED,
    },
  ],

  estimatorKey: 'kitchen',
  estimatorTitle: 'See a starting price for your kitchen',
  estimatorDesc:
    'Choose your kitchen size, cabinets, countertops, appliances and extras to see the starting range our estimator uses. It’s free and there’s no obligation.',

  related: ['/services/kitchen-renovations', '/book-online', '/renovation-cost-winnipeg'],
};
