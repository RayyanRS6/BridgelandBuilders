// Basement suites — content for /services/basement-suites (rendered by src/pages/ProjectPage.jsx).
// Registry entry (path, labels, status, estimator, form type): src/data/services.js.
// Launch: set status 'live' in the registry (and "live" in scripts/keyword-map.json).
//
// The intro image is a stock inspiration photo, not a Bridgeland job: keep its
// alt to what is visible. No gallery or testimonial until real suite jobs and
// client quotes exist.
//
// Facts: free on-site visit and written quote, weekly progress updates, permit
// coordination and the 4–8 week basement timeline are owner-confirmed; there is
// no confirmed suite-specific timeline, so none is published. City of Winnipeg
// rules were re-read on 2026-10-13. The City's secondary-suites page still
// lists size and parking numbers, but the Winnipeg Zoning By-law was amended in
// June 2025 and the page does not say whether it reflects that, so this page
// publishes no size, parking or zoning-district numbers (plan guardrail): only
// the permit route, one-suite rule and the Building Code checklist the page
// states. Program status (verified 2026-10-13): CMHC-insured refinance for
// suites available since 2025-01-15; Canada Secondary Suite Loan Program will
// not be implemented (Budget 2025, Annex 3); MHRTC described without rates.
// Rental income (2026-10-23): the only rent figure is CMHC's October 2025
// average for a one-bedroom purpose-built apartment in the Winnipeg CMA
// (Rental Market Survey, Table 1.1.2), always labelled as such: CMHC does not
// survey basement suites. The calculator takes the visitor's own quoted build
// cost; there is no suite price on this page.

import { EXPERIENCE_YEARS, PROJECT_COUNT, REPLY_TIME, TIMELINES } from '../facts.js';

export default {
  slug: 'basement-suites',
  breadcrumb: 'Basement Suite',
  badge: 'Basement Suites in Winnipeg, Manitoba',
  title: 'BASEMENT SUITE RENOVATIONS',
  titleHighlight: 'IN WINNIPEG',
  subtitle:
    'We develop self-contained basement suites in Winnipeg and nearby communities, for a tenant or a family member. Zoning and permits are confirmed first, then the entrance, egress windows, kitchen, bathroom, fire protection and sound control are planned.',
  heroPoints: ['Free on-site visit', 'Zoning & permits checked first', 'Weekly progress updates'],

  stats: [
    { num: String(EXPERIENCE_YEARS), unit: '+', label: 'Years of combined experience' },
    { num: String(PROJECT_COUNT), unit: '+', label: 'Projects completed across Winnipeg' },
    { num: String(TIMELINES.basement.min), unit: `–${TIMELINES.basement.max}`, label: 'Weeks for a typical basement development' },
    { num: '1', unit: 'day', label: `Reply within ${REPLY_TIME}` },
  ],

  intro: {
    tag: 'Why plan a suite properly?',
    title: 'A suite is a second home, not a basement with a stove',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Room with light grey walls, a black loveseat, a white dresser, and a floor lamp',
    floatingTitle: 'Permits Before Framing',
    floatingText: 'Zoning, exits and separation settled before the first stud goes up.',
    paragraphs: [
      'A basement suite has to work as its own home. The City of Winnipeg treats an attached secondary suite as an independent dwelling unit with a separate entrance, and the Manitoba Building Code adds requirements for exits, egress windows, ceiling height, fire protection, smoke and carbon monoxide alarms, and sound control.',
      'Most of those decisions are fixed before framing, so that’s where we start. At [the on-site visit](/our-process) we look at ceiling height, window openings, where an entrance could go, and where the furnace, water heater and panel sit. Then we confirm the zoning and permit route for your lot before you commit to a layout.',
      'Once the plan is approved, the build follows the same order as [any basement we develop](/services/basement-renovations): moisture checked first, walls insulated for winter, then mechanical, drywall and finishes, with inspections at each stage and a progress update every week.',
    ],
    checklist: ['Separate Entrances', 'Egress Windows', 'Suite Kitchens & Baths', 'Fire Protection & Sound Control'],
  },

  includes: {
    tag: 'What’s Included',
    title: 'What does a basement suite renovation include?',
    desc: 'A basement suite renovation covers everything a separate home needs below grade: a zoning and permit check, a layout with its own entrance, egress windows, a kitchen and bathroom, heating and ventilation, fire protection and sound control between units, alarms, finishes and inspections. The permits come first, the framing second.',
    items: [
      { num: '01', title: 'Zoning & Permit Check', text: 'Confirming a suite is allowed on your lot, then coordinating the development permit, the building permit, and the separate electrical and plumbing permits.' },
      { num: '02', title: 'Layout & Entrance', text: 'A plan for a self-contained unit with its own entrance, living area, bedroom, kitchen and bathroom, laid out around the mechanical room and existing drains.' },
      { num: '03', title: 'Exits & Egress Windows', text: 'The exits the suite needs and egress windows for sleeping rooms, cut into the foundation with window wells that leave room to climb out.' },
      { num: '04', title: 'Kitchen & Bathroom', text: 'Drain, supply and venting for a full suite kitchen and bathroom, tied into the house plumbing under the plumbing permit.' },
      { num: '05', title: 'Fire, Sound & Air', text: 'The smoke-tight barrier, fire protection, sound control, heating and ventilation the Manitoba Building Code calls for between the suite and the main house.' },
      { num: '06', title: 'Alarms, Finishes & Inspections', text: 'Smoke and carbon monoxide alarms, flooring, trim and paint, then the final inspections that close the permits before anyone moves in.' },
    ],
  },

  typesTag: 'Project Types',
  typesTitle: 'Who is the suite for, and where does it start?',
  typesDesc:
    'Most basement suites start from one of two places, an unfinished basement or a finished one, and are built for one of two people: a tenant or a family member. Each combination changes the work. A finished basement often needs walls and ceilings opened to meet suite requirements, while an unfinished one lets the suite be planned from scratch.',
  types: [
    { title: 'Suite in an unfinished basement', text: 'The cleanest start: layout, exits, separation and plumbing are all planned from bare concrete, with nothing to remove first.' },
    { title: 'Converting a finished basement', text: 'An existing rec room or bedroom turned into a suite. Walls and ceilings often need opening to add fire protection, sound control and new plumbing. If the basement was finished before you bought the house, [check its permit history](/blog/check-permit-history-winnipeg-house) first.' },
    { title: 'Basement rental suite', text: 'A suite built for a tenant, with its own entrance and its own kitchen and bathroom. Landlord and tenant matters fall under the Province’s Residential Tenancies Branch.' },
    { title: 'In-law or family suite', text: 'A suite for a parent, adult child or relative who wants independence under the same roof. [A federal tax credit](/blog/manitoba-renovation-tax-credits-rebates) may apply; see the questions below.' },
    { title: 'One-bedroom basement apartment', text: 'A typical layout: an open kitchen and living area, one bedroom with [an egress window](/blog/basement-development-permits-winnipeg), a bathroom and laundry, sized to the floor area zoning allows.' },
    { title: 'Planning a suite for later', text: 'Not ready to build it yet? A basement can be developed with a future suite’s entrance, plumbing and separation in mind, so converting later means less rework.' },
  ],

  local: {
    tag: 'In Winnipeg',
    title: 'What does Winnipeg require for a secondary suite?',
    intro:
      'Two permits, at minimum. The City of Winnipeg says homeowners need [a development permit and a building permit](/blog/secondary-suite-rules-winnipeg) before building a secondary suite, plus separate electrical and plumbing permits. Zoning rules set limits such as the suite’s floor area, and the Zoning By-law was amended in June 2025, so we confirm the current rules for your lot first.',
    items: [
      { title: 'Development permit, then building permit', text: 'The building permit application can go in once the development permit application is complete (concurrent review) or after it is approved (sequential review). Electrical and plumbing permits are separate again.' },
      { title: 'One suite per property', text: 'The City’s secondary suites page says only one attached or detached secondary suite is permitted on a single-family property, and an attached suite is an independent dwelling unit with a separate entrance. We confirm how that applies to your lot before the layout is set.' },
      { title: 'Zoning limits for your lot', text: 'The Zoning By-law limits things like floor area, and it was amended in June 2025. If a suite doesn’t meet the by-law, the City says conditional use approval or a variance may be needed. We confirm the current rules with the City before the layout is set.' },
      { title: 'Building code checklist', text: 'The City lists the Manitoba Building Code items a suite must address: exits, a smoke-tight barrier, window egress, ceiling height, fire protection, smoke and carbon monoxide alarms, sound control, heating and ventilation, water supply, electrical and utility access.' },
      { title: 'Inspections before covering', text: 'Rough-in inspections of framing, heating, electrical and plumbing happen before walls and ceilings close. The final inspection confirms all work under every permit is complete and the suite is ready for occupancy.' },
      { title: 'Short-term rentals and tenancies', text: 'In Winnipeg, a rental of fewer than 30 nights is a short-term rental and needs a business licence. Landlord and tenant matters, such as leases and damage deposits, are handled by the Province’s Residential Tenancies Branch.' },
    ],
    sources: [
      { label: 'City of Winnipeg: Secondary suites', url: 'https://www.winnipeg.ca/building-development/building-renovating/home-improvement-projects/secondary-suites', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Zoning changes to accommodate infill housing', url: 'https://www.winnipeg.ca/building-development/housing/housing-accelerator-fund/infill-housing', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Housing inspections', url: 'https://www.winnipeg.ca/building-development/building-renovating/inspections/housing-inspections', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Short-term rental accommodations (licence)', url: 'https://www.winnipeg.ca/services-programs/permits-licences-0/business-licences/short-term-rental-accommodations', accessed: '2026-10-13' },
      { label: 'Department of Finance Canada: Making it easier for homeowners to build secondary suites (Dec. 2024)', url: 'https://www.canada.ca/en/department-finance/news/2024/12/2024-fall-economic-statement-making-it-easier-for-homeowners-to-build-secondary-suites.html', accessed: '2026-10-13' },
      { label: 'Budget 2025, Annex 3: Comprehensive expenditure review', url: 'https://budget.canada.ca/2025/report-rapport/anx3-en.html', accessed: '2026-10-13' },
      { label: 'Canada Revenue Agency: Multigenerational home renovation tax credit', url: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-45355-mhrtc.html', accessed: '2026-10-13' },
      { label: 'Health Canada: Radon, what you need to know', url: 'https://www.canada.ca/en/health-canada/services/environmental-workplace-health/reports-publications/radon-what-you-need-to-know.html', accessed: '2026-10-13' },
    ],
  },

  // Rental income (ProjectPage, after the lead section): the CMHC rent
  // benchmark, the rental income guide and the payback calculator. The source
  // is CMHC's spreadsheet itself, so its label says it downloads a file.
  rental: {
    tag: 'Rental Income',
    title: 'Will a basement suite pay for itself?',
    desc: [
      'Start with the rent. CMHC’s October 2025 survey put the average rent for a one-bedroom purpose-built apartment in Winnipeg at $1,232 a month. CMHC doesn’t survey basement suites, so compare local listings for suites like yours as well.',
      'Then add the total from your written quote. The calculator below shows gross yield, net monthly income and simple payback. Our guide to [basement suite rental income in Winnipeg](/blog/basement-suite-rental-income-winnipeg) covers the code requirements, rents and financing behind those numbers.',
    ],
    calculator: 'suite-payback',
    sources: [
      { label: 'CMHC: Rental Market Survey data tables, Winnipeg, October 2025 (Excel file)', url: 'https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/housing-markets-data-and-research/housing-data-tables/rental-market/rental-market-report-data-tables/2025/rmr-winnipeg-2025-en.xlsx', accessed: '2026-10-23' },
    ],
  },

  // No gallery or testimonial until real suite jobs are documented.
  gallery: null,

  process: {
    tag: 'How It Works',
    title: 'From First Visit to Move-In Day',
    desc: 'On a suite, the permits come before the framing, so the order of these steps matters.',
    steps: [
      { num: '01', title: 'On-Site Visit', text: 'We measure the basement, check ceiling height, windows, entrance options and the mechanical room, and talk through who the suite is for.' },
      { num: '02', title: 'Zoning & Permits', text: 'We confirm the zoning rules for your lot, settle the layout with you, and coordinate the development, building and trade permits.' },
      { num: '03', title: 'Build', text: 'Moisture checks, framing, insulation, plumbing, electrical, fire protection and sound control, then drywall and finishes, with a progress update every week.' },
      { num: '04', title: 'Inspections & Handover', text: 'Rough-in and final inspections under every permit, a walkthrough with you, and a full clean before the suite is handed over.' },
    ],
  },

  testimonial: null,

  faqs: [
    { q: 'Can any basement become a legal suite?', a: 'Not always. The lot must allow a secondary suite under the Zoning By-law, only one suite is allowed per single-family property, and the space must meet Manitoba Building Code items such as ceiling height, exits and egress windows. Where zoning isn’t met, conditional use approval or a variance may be needed. We start checking these at the on-site visit.' },
    { q: 'What makes a suite different from a finished basement with a kitchen?', a: 'A suite is a separate home. The City treats an attached secondary suite as an independent dwelling unit with its own entrance, and it needs a development permit as well as a building permit. The building code then adds fire protection, a smoke-tight barrier, sound control, alarms and exits that an ordinary finished basement doesn’t need.' },
    { q: 'How long does a basement suite take to build?', a: `Our typical basement development takes ${TIMELINES.basement.words} of construction. A suite adds a kitchen, fire and sound separation, and more inspections, and both the development and building permits have to be in place before building starts. We give you a schedule for your suite with the written quote, and update it every week once work begins.` },
    { q: 'Is there government help to build a secondary suite?', a: 'Since January 15, 2025, federal mortgage insurance rules have let eligible homeowners refinance to build a secondary suite, with financing of up to 90 per cent of the home’s value including the value the suite adds. The Canada Secondary Suite Loan Program announced in 2024 will not be implemented, according to Budget 2025. Ask your lender what you qualify for.' },
    { q: 'Is there a tax credit for a family suite?', a: 'Possibly. Canada’s Multigenerational Home Renovation Tax Credit covers certain expenses to create a self-contained secondary unit that lets a senior, or an adult eligible for the disability tax credit, live with a qualifying relative. Eligibility and amounts depend on your situation, so confirm with the Canada Revenue Agency or your accountant before counting on it.' },
    { q: 'Should the basement be checked for moisture and radon first?', a: 'Yes. A suite is someone’s home, so the basement must be dry before framing, and active leaks or foundation cracks go to a waterproofing or foundation specialist first. Health Canada recommends a long-term radon test of at least three months, ideally in fall or winter, and a certified mitigation professional if levels exceed 200 Bq/m³.' },
    { q: 'What happens at the free on-site visit?', a: 'We measure ceiling heights, look at the window openings and where a separate entrance could go, and check where the furnace, water heater, panel and drains sit. We talk through who the suite is for. You then receive a written quote, and we confirm the zoning and permit route for your lot before the layout is set.' },
  ],

  // Title, meta description and Service schema for this page. `updated`
  // feeds the sitemap lastmod and WebPage dateModified: bump it only when the
  // page content really changes.
  seo: {
    title: 'Basement Suite Renovations Winnipeg | Bridgeland Builders',
    description:
      'Basement suite renovations in Winnipeg: zoning and permits confirmed first, then entrance, egress, kitchen, bath and separation. Free on-site visit.',
    serviceType: 'Basement suite renovation',
    primaryKeyword: 'basement suite renovation Winnipeg',
    updated: '2026-10-23',
  },

  // No costTeaser: the estimator prices suites with the basement ranges and has
  // no suite-specific data; the basement cost guide is linked from that page.
  costTeaser: null,
  // Live pages only are shown; drafts appear when they launch.
  related: ['/services/basement-renovations', '/services/home-additions', '/services/bathroom-renovations'],
  guides: ['basement-suite-rental-income-winnipeg', 'secondary-suite-rules-winnipeg', 'basement-development-permits-winnipeg'],
  ownerSignoff: null,
};
