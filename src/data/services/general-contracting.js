// General contracting — content for /services/general-contracting (rendered by src/pages/ProjectPage.jsx).
// Registry entry (path, labels, status, estimator, form type): src/data/services.js.
// Brief (plan §7): what a general contractor does, building to supplied
// drawings (the old site's "Architects & designers" service), how general
// contractors charge in general terms only.
//
// The intro image is a stock inspiration photo, not a Bridgeland job: keep its
// alt to what is visible. No gallery or testimonial until real, consented job
// photos and quotes exist. Truth rules: no design-build claim, no in-house
// drawings or engineering, no pricing method or numbers stated as ours, no
// licence/insurance/WCB/warranty claims, no job counts or named past projects.
// Every rule in `local` and the FAQs was checked against the official page in
// its sources list on 2026-10-13.

export default {
  slug: 'general-contracting',
  // Also names the page in "Let’s talk about your …" and the price guide.
  breadcrumb: 'General Contracting Project',
  badge: 'Residential & Commercial Projects',
  title: 'GENERAL CONTRACTOR',
  titleHighlight: 'IN WINNIPEG',
  subtitle:
    'A general contractor runs your project from start to finish: scheduling the trades, coordinating permits and inspections, and building to your drawings. We do that for renovations and fit-ups in Winnipeg and nearby communities, starting with a free on-site visit and a written quote.',
  heroPoints: ['Free site visit & written quote', 'After-hours & weekend scheduling', 'Weekly progress updates'],

  stats: [
    { num: '60', unit: '+', label: 'Years of combined experience' },
    { num: '100', unit: '+', label: 'Projects completed' },
    { num: '1', unit: '×', label: 'Progress update every week' },
    { num: '1', unit: 'day', label: 'Reply within one business day' },
  ],

  intro: {
    tag: 'What a general contractor does',
    title: 'What does a general contractor do?',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Open office meeting area with a long wood table, pink chairs, and floor-to-ceiling windows',
    floatingTitle: 'Built to Your Drawings',
    floatingText: 'We build to supplied plans and raise site conflicts early.',
    paragraphs: [
      'A general contractor takes responsibility for building a project: pricing it, scheduling and supervising the trades, ordering materials, coordinating permits and inspections, keeping the site safe and tidy, and handing over a finished space. You deal with one contractor instead of separately managing a framer, electrician, plumber, drywaller, painter and flooring installer.',
      'We work as the general contractor on residential renovations, such as kitchens, bathrooms, basements, whole homes and additions, and on commercial projects for offices, stores, restaurants, hotels and clinics. The difference between a smooth job and a stressful one is usually sequencing: the right trade, in the right order, with inspections booked before walls close.',
      'Architects, interior designers and engineers can hand us their drawings and specifications, and we build to them. We walk the site against the drawings before work starts, ask questions early, and raise conflicts, such as a duct that clashes with a beam, before they turn into change orders.',
      'When the City requires sealed drawings, they come from a registered architect or professional engineer. If you don’t have one yet, ask us at the site visit what your scope is likely to need before you spend money on plans.',
    ],
    checklist: ['Trades & Scheduling', 'Permits & Inspections', 'Building to Drawings', 'Residential & Commercial'],
  },

  includes: {
    tag: 'What’s Included',
    title: 'What General Contracting Covers',
    desc: 'Everything between the drawings and the keys, run by one contractor.',
    items: [
      { num: '01', title: 'Site Visit & Scope', text: 'Walking the site with you and any drawings you have, then turning the scope into a free written quote.' },
      { num: '02', title: 'Trades & Scheduling', text: 'Scheduling and supervising the trades in the right order, so no one waits on someone else and nothing is closed up uninspected.' },
      { num: '03', title: 'Permits & Inspections', text: 'Coordinating building permits and inspections with the City of Winnipeg or your local municipality, from application to final inspection.' },
      { num: '04', title: 'Materials & Suppliers', text: 'Ordering materials and long-lead items early, and tracking deliveries so the site keeps moving.' },
      { num: '05', title: 'Site Management', text: 'Keeping the site safe, clean and secure, protecting the rest of the building, and handling waste and debris.' },
      { num: '06', title: 'Weekly Updates & Handover', text: 'A progress update every week, deficiencies cleared at the end, and a walkthrough with you before handover.' },
    ],
  },

  gallery: null,

  process: {
    tag: 'How It Works',
    title: 'How We Run a Project',
    desc: 'One written quote, one schedule, and an update every week.',
    steps: [
      { num: '01', title: 'Site Visit & Scope', text: 'We walk the site with you and any drawings you have, and ask about your dates and how the space will be used. The visit and the written quote are free.' },
      { num: '02', title: 'Quote & Schedule', text: 'A written quote covering the trades, materials and schedule, built around your dates and, for commercial work, your operating hours.' },
      { num: '03', title: 'Permits & Build', text: 'We coordinate the permits, then schedule and supervise each trade in order. You get a progress update every week, including anything that has changed.' },
      { num: '04', title: 'Inspections & Handover', text: 'Inspections booked and passed, deficiencies cleared, the site cleaned, and a walkthrough with you before handover.' },
    ],
  },

  testimonial: null,

  faqsTitle: 'General Contracting FAQs',
  faqs: [
    { q: 'How do general contractors charge?', a: 'Usually in one of three ways: a fixed price for a defined scope, cost-plus (the cost of labour and materials plus a fee or percentage), or a construction-management fee. Whatever the method, make sure the scope, any allowances and how changes are priced are written down. Our written quote sets out the scope and price for your project.' },
    { q: 'Do I need a general contractor, or can I hire the trades myself?', a: 'You can hire trades yourself, but then you take on the scheduling, permits, inspections and the gaps between trades, such as who patches the drywall the electrician opened up. A general contractor takes that coordination on and prices the whole job in one written quote. It usually makes sense once more than two or three trades are involved.' },
    { q: 'Can you build from our architect’s or designer’s drawings?', a: 'Yes. We build to supplied drawings and specifications for residential and commercial projects. Before work starts we walk the site against the drawings, ask questions, and raise anything that won’t work as drawn, so it’s resolved with your architect or designer before it becomes a change order or holds up an inspection.' },
    { q: 'Do you handle permits and inspections?', a: 'Yes. We coordinate building permits and inspections with the City of Winnipeg or your local municipality and book inspections before work is closed up. On commercial projects in Winnipeg, electrical, mechanical, plumbing and demolition permits are applied for by City-licensed contractors, so those trades are lined up as part of the plan.' },
    { q: 'What is the holdback on a construction contract in Manitoba?', a: 'Under Manitoba’s Builders’ Liens Act, the person paying for the work must hold back 7.5% of each payment and keep it for at least 60 days after substantial performance is certified, the work is completed or it is abandoned. Ask your lawyer how it applies to your contract, and raise it with us when we go through your quote.' },
    { q: 'Do you take on residential and commercial projects?', a: 'Both. On the residential side we manage kitchens, bathrooms, basements, whole-home renovations and additions; on the commercial side, offices, stores, restaurants, hotels and clinics. Commercial work can be scheduled after hours and on weekends, and every project, of either kind, starts with a free on-site visit and a written quote.' },
    { q: 'How do you keep clients updated?', a: 'With a progress update every week: what was done, what’s next, and anything that has changed, such as a delivery date or an inspection result. If something moves that affects your schedule, you hear about it that week, not at the end. You can also reach us at 431-866-5644 or info@bridgelandbuilders.com.' },
  ],

  // Title, meta description and Service schema for this page. `updated`
  // feeds the sitemap lastmod and WebPage dateModified: bump it only when the
  // page content really changes.
  seo: {
    title: 'General Contractor Winnipeg | Bridgeland Builders',
    description:
      'General contractor in Winnipeg for home and commercial renovations: trades, schedule, permits and inspections, built to your drawings. Free site visit.',
    serviceType: 'General contracting',
    // Residential and commercial work, so a general Audience rather than the
    // BusinessAudience the commercial verticals carry.
    audience: { '@type': 'Audience', audienceType: 'Homeowners, businesses, property managers, architects and designers' },
    primaryKeyword: 'general contractor Winnipeg',
    updated: '2026-10-14',
  },

  typesTitle: 'Projects We Manage as General Contractor',
  typesDesc: 'For homeowners, businesses, property owners and design professionals.',
  types: [
    { title: 'Residential Renovations', text: 'Kitchens, bathrooms, basements, whole-home renovations and home additions, with the trades, permits and inspections run for you.' },
    { title: 'Commercial Fit-Ups', text: 'Offices, stores, restaurants, hotels and clinics, including tenant improvements in leased units and work after hours.' },
    { title: 'Building to Supplied Drawings', text: 'Projects designed by an architect, engineer or interior designer, built to their drawings and specifications.' },
    { title: 'Property Owners & Managers', text: 'Unit turnovers, common areas and multi-unit upgrades for landlords, property managers and building owners.' },
    { title: 'Developers & Realtors', text: 'Work that gets a property ready to sell, lease or occupy, scoped and quoted in writing after a free site visit.' },
    { title: 'Interior Renovations', text: 'Interior work across several rooms or a whole floor, where framing, electrical, plumbing, drywall and finishes all have to line up.' },
  ],

  local: {
    title: 'What does a general contractor handle with the City?',
    intro:
      'Permits and inspections. In Winnipeg, a building permit is needed whenever work is regulated by the Winnipeg Building By-law or the Manitoba Building Code, and on commercial projects the electrical, mechanical, plumbing and demolition permits are applied for by City-licensed contractors. A general contractor lines those up and books inspections in the right order.',
    items: [
      { title: 'Building Permits', text: 'Work regulated by the building code needs a City permit. Commercial alterations are filed with the Commercial Alteration Design Summary, and the City says incomplete applications result in delays.' },
      { title: 'Trade Permits', text: 'On commercial projects, the City requires electrical, mechanical, plumbing and demolition permits to be applied for by a City-licensed contractor, so the right licensed trades are part of the plan from the start.' },
      { title: 'Professional Drawings', text: 'The City’s CADS form says commercial drawings must be sealed by an architect or engineer for any structural change, and for significant changes to fire safety systems, exits or public corridors in Part 3 buildings. We build to their sealed drawings.' },
      { title: 'Inspections', text: 'Once a permit is issued, the City carries out mandatory audit inspections to check the work follows codes, by-laws and the accepted plans, so inspections are booked before walls and ceilings close.' },
      { title: 'Holdback', text: 'Manitoba’s Builders’ Liens Act requires the person paying for the work to hold back 7.5% of each payment for at least 60 days after substantial performance, completion or abandonment.' },
      { title: 'Outside Winnipeg', text: 'In Headingley, East St. Paul, West St. Paul, Oak Bluff, Selkirk or Steinbach, permits and inspections go through the local municipality or planning district instead.' },
    ],
    sources: [
      { label: 'City of Winnipeg: Commercial projects', url: 'https://www.winnipeg.ca/building-development/building-renovating/commercial-projects', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Commercial Alteration Design Summary (CADS) application, October 2025', url: 'https://www.winnipeg.ca/media/6330', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Permits Online', url: 'https://www.winnipeg.ca/building-development/building-renovating/apply-permit/permits-online', accessed: '2026-10-13' },
      { label: 'Manitoba Laws: The Builders’ Liens Act, s. 24', url: 'https://web2.gov.mb.ca/laws/statutes/ccsm/b091.php', accessed: '2026-10-13' },
    ],
  },

  // No general-contracting cost page (plan §8).
  costTeaser: null,
  // Live pages only are shown; drafts appear when they launch.
  related: ['/services/commercial-renovations', '/services/whole-home-renovations', '/services/home-additions', '/services/office-renovations', '/services/restaurant-renovations'],
  guides: ['what-does-a-general-contractor-do', 'how-to-choose-the-right-contractor-for-your-renovation-project', 'winnipeg-renovation-permits'],
  ownerSignoff: null,
};
