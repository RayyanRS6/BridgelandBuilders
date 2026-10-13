// Renovation cost hub — content for /renovation-cost-winnipeg (rendered by
// src/pages/CostGuidePage.jsx; shape documented in ./index.js).
//
// PRICES: only the starting ranges Bridgeland's own public instant estimator
// uses (estimator.bridgelandbuilders.com/api/services, read 2026-10-13). The
// estimator publishes min/max per size tier and per option but not how it
// combines them, so this page never adds ranges together or quotes a total.
// The estimator has no data for whole-home, additions or commercial work:
// those are "priced after the on-site visit", never given a number here.
// Timelines are the figures already published on the service pages.
// External facts (permits, financing, closed federal programs) are linked to
// the official page in `sources`, checked on the date shown.
// Refresh every January with the new estimator ranges (title year = period).

const ACCESSED = '2026-10-13';

export default {
  id: 'renovation-cost-winnipeg',
  path: '/renovation-cost-winnipeg',
  serviceSlug: null,
  status: 'live',

  seo: {
    title: 'Home Renovation Costs in Winnipeg (2026) | Bridgeland',
    description:
      'Winnipeg renovation costs from our instant estimator: bathrooms from $16,000, basements from $25,000, kitchens from $40,000, and what moves the price.',
    primaryKeyword: 'home renovation cost Winnipeg',
    published: '2026-10-13',
    updated: '2026-10-13',
  },

  eyebrow: 'Renovation Costs',
  h1: { title: 'HOME RENOVATION COSTS', highlight: 'IN WINNIPEG' },
  intro:
    'Starting ranges from our own instant estimator for kitchens, bathrooms and basements, what moves them, and how to get a written quote for your project.',

  answer:
    'Our [instant estimator](/instant-quote) starts a bathroom renovation in Winnipeg at $16,000, a basement development at $25,000 and a kitchen renovation at $40,000. The size of the space sets the range, and your fixtures, finishes and extras move it from there. Whole-home renovations, additions and commercial projects are priced after a free on-site visit.',

  dataBasis: {
    source: 'Bridgeland Builders instant estimator starting ranges (public price guide)',
    period: 'October 2026',
    note: 'Starting ranges before your on-site visit; your written quote is final.',
  },

  tables: [
    {
      caption: 'Starting ranges in our instant estimator, by service',
      head: ['Service', 'Starting range by size', 'Typical timeline'],
      rows: [
        ['[Bathroom renovation](/services/bathroom-renovations/cost)', '$16,000–$36,000 (up to 50 sq ft through 150+ sq ft)', '2–3 weeks'],
        ['[Basement development](/services/basement-renovations/cost)', '$25,000–$150,000 (up to 500 sq ft through 1,500 sq ft)', '4–8 weeks'],
        ['[Kitchen renovation](/services/kitchen-renovations/cost)', '$40,000–$190,000 (up to 100 sq ft through over 200 sq ft)', '4–6 weeks once cabinets are on site'],
      ],
      note: 'Each service links to its full cost guide. Ranges cover the size of the space. Options such as a new shower, cabinets, countertops, flooring or an egress window each have their own range in the estimator. Your written quote after the free on-site visit is the final price.',
    },
  ],

  driversTitle: 'What changes the cost of a renovation',
  driversDesc: 'The same few things move the price on almost every job. These are what we look at during the on-site visit.',
  drivers: [
    {
      title: 'The size of the space',
      text: 'Size sets the starting range in our estimator. A bathroom up to 50 sq ft starts at $16,000; a basement up to 500 sq ft starts at $25,000. More area means more material and more labour hours.',
    },
    {
      title: 'Layout changes',
      text: 'Keeping plumbing, gas lines and walls where they are keeps a job simpler. Moving a sink or toilet, or taking out a wall, brings in more trades, and a load-bearing wall needs a beam and the right permits.',
    },
    {
      title: 'Finish level',
      text: 'Stock or custom cabinets, laminate or quartz, a standard vanity or a custom one: finishes are where two similar rooms end up at different prices. The estimator shows the range it uses for each choice.',
    },
    {
      title: 'What is behind the walls',
      text: 'Older homes can hide old wiring, tired plumbing or water damage that only shows up at demolition. Ask at the on-site visit how anything found behind the walls would be handled and priced.',
    },
    {
      title: 'Permits and code items',
      text: 'Finishing a basement or adding a bedroom needs a building permit, kitchens and bathrooms often do, and electrical and plumbing work have permits of their own. Code items, such as a bedroom egress window or a backwater valve on new below-grade plumbing, are part of the price.',
    },
    {
      title: 'Changes once work starts',
      text: 'Swapping a tile, a fixture or the layout after materials are ordered changes the cost. Settling your choices before you sign keeps surprises down; ask for any change to be priced in writing before it is made.',
    },
  ],

  sections: [
    {
      h2: 'What does $100,000 get you in a Winnipeg renovation?',
      blocks: [
        {
          t: 'p',
          x: 'In our instant estimator, $100,000 falls inside the medium kitchen range (100–200 sq ft, $80,000–$139,999) and at the top of the medium basement range (501–1,000 sq ft, $45,000–$100,000). It is well above the bathroom size ranges, which top out at $36,000 before a new tub, shower or other options.',
        },
        {
          t: 'p',
          x: 'Where a budget like this lands depends on how much of the house is being opened up. A medium kitchen with semi-custom cabinets and quartz counters is a different job from a basement with a new bathroom and an egress window, even at a similar price. Our guide to [choosing between a full renovation and partial upgrades](/blog/how-to-choose-between-a-full-renovation-and-partial-upgrades) can help you decide how far to take it.',
        },
      ],
    },
    {
      h2: 'Is there a renovation cost per square foot in Winnipeg?',
      blocks: [
        {
          t: 'p',
          x: 'We don’t price renovations by the square foot, because cost isn’t spread evenly across a room. A small bathroom packs plumbing, tile and fixtures into very little floor, while a basement spreads framing and drywall over a large open area. That’s why our estimator starts from size ranges, then factors in your choices.',
        },
        {
          t: 'p',
          x: 'Compare the two smallest tiers: a bathroom up to 50 sq ft starts at $16,000–$20,000, and a basement up to 500 sq ft starts at $25,000–$80,000. Ten times the floor area doesn’t mean ten times the price.',
        },
      ],
    },
    {
      h2: 'What is usually the most expensive part of a renovation?',
      blocks: [
        {
          t: 'p',
          x: 'The size and scope of the job, more than any single finish. In our estimator, a new tub-and-shower combo ($12,000–$18,000) or a new shower ($10,000–$15,000) is the largest bathroom option, and in kitchens the size range moves the price far more than any cabinet or countertop choice. Moving plumbing or walls adds more.',
        },
        {
          t: 'p',
          x: 'Work hidden in walls and floors is the other big variable, especially in older homes: wiring, drains and structure that need updating once they are exposed. The estimator can’t see those, so they are priced after the on-site visit. If you own an older house, our guide to [renovating a character home in Winnipeg](/blog/renovating-a-character-home-in-winnipeg) covers what to expect.',
        },
      ],
    },
    {
      h2: 'How much contingency should you keep for a renovation?',
      blocks: [
        {
          t: 'p',
          x: 'Many homeowners keep a contingency on top of the quoted price, and it makes the most sense in older homes or on jobs that open up walls and floors. We don’t publish a set percentage, because the right cushion depends on the house. Ask us at the on-site visit what we would plan for in yours.',
        },
        {
          t: 'p',
          x: 'If something unexpected turns up once work starts, ask for the fix to be priced in writing before that work goes ahead, so you decide with the number in front of you. Changes you choose part-way through also change the cost, as the federal [Office of Consumer Affairs renovation guide](https://ised-isde.canada.ca/site/office-consumer-affairs/en/buying-and-leasing-big-ticket-items/home-renovations) points out, so settling finishes before you sign helps keep the budget steady.',
        },
        {
          t: 'p',
          x: 'For a step-by-step way to set your budget, see our [home renovation planning guide](/blog/home-renovation-planning-guide-canada).',
        },
      ],
    },
    {
      h2: 'What about whole-home, additions and commercial work?',
      blocks: [
        {
          t: 'p',
          x: 'Whole-home renovations, home additions and commercial projects aren’t in our instant estimator, because their scope varies too much to price from a few questions. They are priced after a free on-site visit, with a written quote that sets out what is included before any work begins.',
        },
        {
          t: 'li',
          x: '**[Whole-home renovations](/services/whole-home-renovations):** most run 8–16 weeks, depending on the size of the house and how much of it is being renovated.',
        },
        {
          t: 'li',
          x: '**[Home additions](/services/home-additions):** many straightforward additions take roughly 8–16 weeks once permits and materials are ready.',
        },
        {
          t: 'li',
          x: '**[Commercial renovations](/services/commercial-renovations):** offices, retail stores, restaurants, cafés and bars, hotels, and medical, dental and physio clinics, with after-hours or weekend scheduling and weekly progress updates.',
        },
        {
          t: 'p',
          x: 'To get a number for any of these, [book a free on-site visit](/book-online). For business budgets, our guide to [the biggest cost factors in commercial renovation](/blog/the-biggest-cost-factors-in-commercial-renovation-projects) explains what moves the price.',
        },
      ],
    },
    {
      h2: 'How do homeowners pay for a renovation?',
      blocks: [
        {
          t: 'p',
          x: 'Many homeowners talk to their own bank or credit union, and one option many consider is a home equity line of credit. Whatever you choose, get your written quote first, so you know the amount you actually need to borrow.',
        },
        {
          t: 'p',
          x: 'The [Financial Consumer Agency of Canada](https://www.canada.ca/en/financial-consumer-agency/services/mortgages/home-equity-line-credit.html) explains that a home equity line of credit is secured by your home, that you may borrow up to 65% of your home’s value, and that if you don’t pay it back you could lose your home. It is worth reading before you sign anything.',
        },
        {
          t: 'p',
          x: 'Two federal programs are closed: the [Canada Greener Homes Grant](https://natural-resources.canada.ca/energy-efficiency/home-energy-efficiency/canada-greener-homes-initiative/canada-greener-homes-grant) and the [Canada Greener Homes Loan](https://natural-resources.canada.ca/energy-efficiency/home-energy-efficiency/canada-greener-homes-initiative/canada-greener-homes-loan) no longer accept new applications. For what is open now, see our guides to [Manitoba renovation tax credits and rebates](/blog/manitoba-renovation-tax-credits-rebates) and [home renovation financing in Canada](/blog/home-renovation-financing-canada).',
        },
      ],
    },
  ],

  faqs: [
    {
      q: 'How long does a renovation take in Winnipeg?',
      a: 'It depends on the room. On our jobs, a typical bathroom takes two to three weeks, a kitchen four to six weeks once the cabinets are on site, and a basement four to eight weeks. Whole-home renovations usually run eight to sixteen weeks, and many straightforward additions take about the same once permits and materials are ready.',
    },
    {
      q: 'Do I need a permit to renovate in Winnipeg?',
      a: 'Often, yes. Finishing a basement or creating a new bedroom requires a building permit, and the City of Winnipeg says kitchens and bathrooms may need one. Electrical and plumbing work need their own permits. Cosmetic work, such as painting or new flooring, doesn’t. Permit fees are set in the City’s yearly fee schedule. We coordinate permits and inspections with the City or your local municipality.',
    },
    {
      q: 'How is the instant estimate different from a written quote?',
      a: 'The instant estimator gives a starting range from the size and options you choose. It can’t see your house, so wiring, plumbing, structure and site conditions aren’t in it. The written quote comes after a free on-site visit, is based on measurements and the scope we agree, and is the final price.',
    },
    {
      q: 'What does a written renovation quote include?',
      a: 'Ours sets out the scope of work and what is included, the permits and inspections the job needs, and the price, with taxes shown, so you know where you stand before work begins. When comparing quotes from different contractors, check them line by line: a lower total sometimes means something has been left out.',
    },
    {
      q: 'How do I get an exact price for my renovation?',
      a: 'Book a free on-site visit, or call 431-866-5644, Monday to Friday from 8:30 to 4:30. We look at the space, talk through what you want, and follow up with a free written quote. If you want a ballpark first, the instant estimator gives you a starting range. We reply to every request within one business day.',
    },
  ],

  sources: [
    {
      label: 'City of Winnipeg — Information Bulletin 2026-007-B, Building permit requirements for housing',
      url: 'https://www.winnipeg.ca/media/6116',
      accessed: ACCESSED,
    },
    {
      label: 'City of Winnipeg — Home renovations (building permit requirements)',
      url: 'https://www.winnipeg.ca/building-development/building-renovating/home-improvement-projects/home-renovations',
      accessed: ACCESSED,
    },
    {
      label: 'City of Winnipeg — Planning, Development & Building Fees and Charges',
      url: 'https://www.winnipeg.ca/building-development/fees-charges',
      accessed: ACCESSED,
    },
    {
      label: 'Office of Consumer Affairs (Government of Canada) — Home renovations',
      url: 'https://ised-isde.canada.ca/site/office-consumer-affairs/en/buying-and-leasing-big-ticket-items/home-renovations',
      accessed: ACCESSED,
    },
    {
      label: 'Financial Consumer Agency of Canada — Home equity lines of credit',
      url: 'https://www.canada.ca/en/financial-consumer-agency/services/mortgages/home-equity-line-credit.html',
      accessed: ACCESSED,
    },
    {
      label: 'Natural Resources Canada — Canada Greener Homes Grant (program closed)',
      url: 'https://natural-resources.canada.ca/energy-efficiency/home-energy-efficiency/canada-greener-homes-initiative/canada-greener-homes-grant',
      accessed: ACCESSED,
    },
    {
      label: 'Natural Resources Canada — Canada Greener Homes Loan (program closed)',
      url: 'https://natural-resources.canada.ca/energy-efficiency/home-energy-efficiency/canada-greener-homes-initiative/canada-greener-homes-loan',
      accessed: ACCESSED,
    },
  ],

  estimatorKey: 'overall',
  estimatorTitle: 'See a starting price for your kitchen, bathroom or basement',
  estimatorDesc:
    'Pick a service, then answer a few quick questions to see the starting range our estimator uses for your project. It’s free and there’s no obligation.',

  related: [
    '/services/kitchen-renovations/cost',
    '/services/bathroom-renovations/cost',
    '/services/basement-renovations/cost',
    '/instant-quote',
    '/book-online',
    '/services/whole-home-renovations',
    '/services/home-additions',
    '/services/commercial-renovations',
  ],
};
