// Restaurant & hospitality renovations — content for /services/restaurant-renovations (rendered by src/pages/ProjectPage.jsx).
// Registry entry (path, labels, status, estimator, form type): src/data/services.js.
// Brief (plan §7): front and back of house, service hours, food-premises
// authority (verified), hotels section (owner confirmed hotel work 2026-10-13).
// Hotels live in the types section ("Restaurants, Cafés, Bars & Hotels") and
// the hotel FAQ; the navbar, /services and commercial-page "Hotels" items link
// to the first hotel card (#hotels).
//
// The intro image is a stock inspiration photo, not a Bridgeland job: keep its
// alt to what is visible. No gallery or testimonial until real, consented job
// photos and quotes exist. Truth rules: no job counts, no named restaurants,
// hotels or past projects, no licence/insurance/WCB/warranty claims, no
// commercial timelines or prices. Every rule in `local` and the FAQs was
// checked against the official page in its sources list on 2026-10-13; the
// outside-Winnipeg permit authorities against the Province's ITS permits page
// on 2026-10-15. The timeline FAQ names schedule drivers only: no week ranges
// unless the owner supplies them and they go into timelines.js.

import { EXPERIENCE_YEARS, PROJECT_COUNT, REPLY_TIME } from '../facts.js';
import { NEARBY_AREAS_TEXT } from '../areas.js';

export default {
  slug: 'restaurant-renovations',
  breadcrumb: 'Restaurant & Hospitality Renovation',
  badge: 'Restaurants, Cafés, Bars & Hotels',
  title: 'RESTAURANT & HOSPITALITY RENOVATIONS',
  titleHighlight: 'IN WINNIPEG',
  subtitle:
    'We renovate restaurants, cafés, bars and hotels in Winnipeg and nearby communities, front of house and back, with work scheduled around your service hours. Every project starts with a free on-site visit and a written quote, and evening and weekend work is available.',
  heroPoints: ['Free site visit & written quote', 'After-hours & weekend scheduling', 'Weekly progress updates'],

  stats: [
    { num: String(EXPERIENCE_YEARS), unit: '+', label: 'Years of combined experience' },
    { num: String(PROJECT_COUNT), unit: '+', label: 'Projects completed' },
    { num: '1', unit: '×', label: 'Progress update every week' },
    { num: '1', unit: 'day', label: `Reply within ${REPLY_TIME}` },
  ],

  intro: {
    tag: 'Why Bridgeland for your restaurant?',
    title: 'What does a restaurant renovation involve?',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Open-plan room with a dark kitchenette, teal bench seating, and glass-walled rooms',
    floatingTitle: 'Built Around Service',
    floatingText: 'Work planned for closed days, after close and weekends.',
    paragraphs: [
      'A restaurant renovation covers the front of house guests see, such as the dining room, bar and washrooms, and the back of house that makes service work: kitchen walls, floors and ceilings, sinks, and the plumbing and ventilation rough-ins. In Manitoba, the plans also go to a public health inspector for review before construction starts.',
      'Every closed night is lost revenue, so the schedule is built around service. We can work after close, on the days you’re closed and on weekends. In Winnipeg, loud work within 150 m of a home has to stop at 9 p.m., so [demolition](/services/demolition) and cutting are planned for daytime closures and quieter tasks run later.',
      'The kitchen is where most of a restaurant renovation contractor’s coordination happens. Hoods, fire suppression, the grease interceptor and your equipment each involve a different supplier, trade or approval, so we set the order early: rough-ins before finishes, finishes before equipment, and inspections before your opening date.',
      'Hotels work the same way on a larger scale. We phase guest-room floors, corridors, lobbies and meeting rooms so the rest of the property keeps welcoming guests, with a weekly update you can share with your general manager or ownership group.',
    ],
    checklist: ['Dining Rooms & Bars', 'Commercial Kitchens', 'Cafés & Coffee Shops', 'Hotel Rooms & Lobbies'],
  },

  includes: {
    tag: 'What’s Included',
    title: 'What a Restaurant Renovation Covers',
    desc: 'Front of house and back, scoped around your menu, your equipment and your service hours.',
    items: [
      { num: '01', title: 'Site Visit & Scope', text: 'Walking the space outside service, going through your menu, equipment and hours, and [putting the scope in a free written quote](/our-process).' },
      { num: '02', title: 'Dining Rooms & Bars', text: 'Layouts, banquettes, bar fronts, millwork, lighting and finishes that hold up to busy services and nightly cleaning.' },
      { num: '03', title: 'Back-of-House Build-Out', text: 'Kitchen walls, ceilings and floors in smooth, cleanable materials, with floors coved at the wall where the health inspector requires it.' },
      { num: '04', title: 'Plumbing & Ventilation Rough-Ins', text: 'Hand, prep and dish sinks, floor drains, the grease interceptor connection and hood rough-ins, coordinated with your equipment and hood suppliers.' },
      { num: '05', title: 'Washrooms & Accessibility', text: 'Guest and staff washrooms rebuilt to the Manitoba Building Code, with accessible entrances and clearances planned into the layout.' },
      { num: '06', title: 'After-Close & Closed-Day Work', text: 'Work scheduled after close, on closed days and on weekends where it helps, so [you lose as few services as possible](/blog/how-to-prepare-your-business-for-a-major-renovation).' },
    ],
  },

  gallery: null,

  process: {
    tag: 'How It Works',
    title: 'Planned Around Service',
    desc: 'Approvals, closures and your opening date in one schedule, with an update every week.',
    steps: [
      { num: '01', title: 'Site Visit & Scope', text: 'We walk the space with you outside service, go through your menu, equipment list and hours, and note the nights you can’t lose. The visit and quote are free.' },
      { num: '02', title: 'Quote & Schedule', text: 'A written quote and a schedule that maps the health plan review, the building permit, closures and after-close work against your opening date.' },
      { num: '03', title: 'Permits & Build', text: 'We coordinate the permits and build in phases, front and back of house in the order that keeps you serving longest. You get an update every week.' },
      { num: '04', title: 'Inspections & Handover', text: 'Building inspections passed, deficiencies cleared, and the space cleaned and ready for your health inspection and opening night.' },
    ],
  },

  testimonial: null,

  faqsTitle: 'Restaurant & Hotel Renovation FAQs',
  faqs: [
    { q: 'Can you renovate while we stay open?', a: 'Often, yes. We work after close, on your closed days and on weekends, and phase the job so part of the room keeps serving.\n\nIn Winnipeg, loud work within 150 m of a home must stop at 9 p.m., so noisy tasks go into daytime closures. Kitchen work that touches plumbing or ventilation may need a short full closure, and we’ll say when.' },
    { q: 'How long does a restaurant renovation take?', a: 'It depends on the scope and the approvals. A dining-room refresh moves faster than kitchen work, which starts with the public health plan review before construction and then waits on the City’s building permit, the hood and fire suppression sign-off, equipment deliveries and inspections.\n\nThe occupancy permit, where one is needed, comes before reopening, and licensed premises should check the change with the LGCA. You get a schedule with your written quote, built backwards from your opening date, and an update every week.', more: { label: 'Restaurant permits and City review times', to: '/blog/restaurant-renovation-permits-winnipeg' } },
    { q: 'Do restaurant plans need health approval in Manitoba?', a: 'Yes. Manitoba’s guideline requires the owner to submit a registration form and a scaled plan showing equipment, plumbing fixtures and finishes to the local public health inspector for approval before construction, renovation or conversion begins. The health permit is issued only after an inspection once construction is complete, so the schedule allows for both steps.' },
    { q: 'Do you renovate commercial kitchens?', a: 'Yes. Commercial kitchen renovation covers walls, ceilings and floors in cleanable materials, hand, prep and dish sinks, floor drains, and the rough-ins for hoods and equipment. The hood and fire suppression design comes from your designer, engineer and hood supplier; we build to it and sequence the trades so inspections happen in the right order.' },
    { q: 'Does my restaurant need a grease interceptor?', a: 'Plan on one. Manitoba’s food premises guideline says properly sized grease traps or interceptors serving the utensil washing sinks must meet the Manitoba Plumbing Code and be easy to reach for cleaning; check the City’s sewer requirements too. Settle the size and location at the plan stage, since an interceptor is hard to move later.' },
    { q: 'Do you renovate hotels?', a: 'Yes. We renovate guest rooms and bathrooms, corridors, lobbies, breakfast rooms and meeting rooms. Work is phased by room, floor or wing so the rest of the hotel keeps operating, noisy tasks are kept to daytime hours, and you get a weekly update to share with management or ownership.' },
    { q: 'We serve alcohol. Does a renovation affect our liquor licence?', a: 'It can. The Liquor, Gaming and Cannabis Authority of Manitoba says it is the licensee’s responsibility to notify the LGCA if major renovations are made to licensed premises. Check with them before work starts, especially if the bar, seating or floor plan is changing, and build their timeline into your opening date.' },
    { q: 'Can you build to our designer’s drawings?', a: 'Yes. We build to supplied drawings and specifications for dining rooms, bars and kitchens, and walk the space against them before work starts. If a detail won’t work on site, such as a drain that can’t reach the planned sink location, we raise it with you and your designer before it becomes a costly change.' },
    { q: 'Do you work outside Winnipeg?', a: `Yes, within about an hour of the city, including ${NEARBY_AREAS_TEXT}.\n\nBuilding, plumbing and occupancy permits then come from the municipality, a planning district or the Province’s Inspection and Technical Services, depending on the location and whether the building falls under Part 3 or Part 9 of the Manitoba Building Code. The health plan review still goes to your area public health inspector before construction starts.` },
  ],

  // Title, meta description and Service schema for this page. `updated`
  // feeds the sitemap lastmod and WebPage dateModified: bump it only when the
  // page content really changes.
  seo: {
    title: 'Restaurant & Hospitality Renovations Winnipeg | Bridgeland',
    description:
      'Restaurant renovation contractor in Winnipeg: dining rooms, kitchens, cafés, bars and hotels, scheduled around service and planned for health review.',
    serviceType: 'Restaurant and hospitality renovation',
    audience: { '@type': 'BusinessAudience', audienceType: 'Restaurants, cafés, bars and hotels' },
    primaryKeyword: 'restaurant renovation Winnipeg',
    updated: '2026-10-23',
  },

  typesTag: 'Hospitality Spaces',
  typesTitle: 'Restaurants, Cafés, Bars & Hotels',
  typesDesc: 'Hotels get the same planning around guests that restaurants get around service.',
  types: [
    { title: 'Full-Service Restaurants', text: 'Dining rooms, kitchens, bars and washrooms, from a refresh of finishes to a full remodel, or a fit-out for a new location, [planned around your lease date](/services/commercial-renovations#steps).' },
    { title: 'Cafés & Coffee Shops', text: 'Counters, seating, display cases and compact prep areas planned for quick morning service in a small footprint. Downtown cafés can read about the Storefront Success grant in our [commercial renovation financing guide](/blog/how-to-finance-a-commercial-renovation-without-breaking-the-bank).' },
    { title: 'Bars & Lounges', text: 'Bar fronts, back bars, seating and lighting. Licensed premises must tell the LGCA about major renovations, so build that into the plan.' },
    { title: 'Quick-Service & Takeout', text: 'Ordering counters, pickup areas and efficient kitchens for restaurants that do most of their business as takeout and delivery.' },
    // id: the anchor the "Hotels" links point to (/services/restaurant-renovations#hotels).
    { id: 'hotels', title: 'Hotel Guest Rooms & Corridors', text: 'Room-by-room or floor-by-floor upgrades of finishes, bathrooms, lighting and corridors while the rest of the hotel stays open.' },
    { title: 'Hotel Lobbies & Common Areas', text: 'Lobbies, front desks, breakfast rooms, meeting rooms and fitness areas, phased around check-in times and events.' },
  ],

  local: {
    title: 'What approvals does a restaurant renovation need?',
    intro:
      'Two sets. The City of Winnipeg handles the building permit and occupancy, and in Manitoba [your public health inspector must review a scaled floor plan](/blog/restaurant-renovation-permits-winnipeg) before construction or renovation starts. The health permit is issued only after an inspection once construction is complete, so both reviews belong in the schedule from day one.',
    items: [
      { title: 'Health Plan Review', text: 'Manitoba’s guideline says the owner must submit a registration form and a to-scale plan showing equipment, plumbing fixtures and finishes to the public health inspector for approval before construction, renovation or conversion begins.' },
      { title: 'Changes & Opening Inspection', text: 'If plans change before or during construction, the owner contacts the inspector first with a revised plan. The guideline asks for at least five working days’ notice for the opening inspection.' },
      { title: 'Finishes the Inspector Checks', text: 'Food prep and dishwashing areas need smooth, non-absorbent, easily cleanable walls and ceilings, and smooth, impervious floors coved at the wall. Equipment should be commercial grade, preferably NSF certified.' },
      { title: 'Hoods & Ventilation', text: 'New or renovated food premises need an approved kitchen ventilation system with a Type I or Type II hood suited to the menu. The guideline says to consult the permit authority and the health inspector on the hood and fire suppression system, and the health permit waits for written confirmation that it meets fire and building codes.' },
      { title: 'Grease Interceptors', text: 'Manitoba’s guideline says properly sized grease traps or interceptors serving the utensil washing sinks must meet the Manitoba Plumbing Code and be placed where they are easy to clean and maintain.' },
      { title: 'Change of Use', text: 'Turning a store or office into a restaurant is a change of use: it needs a building permit even with little construction, and a change of major occupancy may need an architect or engineer. Confirm the new use is allowed under zoning before paying for plans.' },
    ],
    sources: [
      { label: 'Province of Manitoba: Food handling establishment inspections and health permits', url: 'https://www.gov.mb.ca/health/publichealth/environmentalhealth/protection/food.html', accessed: '2026-10-13' },
      { label: 'Province of Manitoba: Guideline for the design, construction and reconstruction of a food handling establishment', url: 'https://www.gov.mb.ca/health/publichealth/environmentalhealth/protection/docs/construction.pdf', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Commercial Alteration Design Summary (CADS) application, October 2025', url: 'https://www.winnipeg.ca/media/6330', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Construction in your neighbourhood', url: 'https://www.winnipeg.ca/building-development/property-records/construction-your-neighbourhood', accessed: '2026-10-13' },
      { label: 'Liquor, Gaming and Cannabis Authority of Manitoba: How to apply for a liquor service licence', url: 'https://lgcamb.ca/liquor/liquor-service-licences-2/how-to-apply/', accessed: '2026-10-13' },
      { label: 'Province of Manitoba: Building permits and inspections (Inspection and Technical Services)', url: 'https://www.gov.mb.ca/labour/its/bldg_codes/permits_and_inspections.html', accessed: '2026-10-15' },
    ],
  },

  // Commercial cost page stays unpublished (no data, plan §8): the teaser
  // points to the cost hub's "priced after a visit" section. No numbers.
  costTeaser: {
    text: 'Restaurant and hotel renovations are priced in a free written quote after a site visit, once we have seen the space, your equipment list and your service hours. Our Winnipeg cost guide explains what moves the price of a renovation.',
    to: '/renovation-cost-winnipeg#priced-after-a-visit',
    label: 'Renovation costs in Winnipeg',
  },
  // Live pages only are shown; drafts appear when they launch.
  related: ['/services/commercial-renovations', '/services/retail-renovations', '/services/general-contracting', '/services/office-renovations'],
  guides: ['restaurant-renovation-permits-winnipeg', 'the-biggest-cost-factors-in-commercial-renovation-projects', 'how-to-balance-functionality-and-aesthetics-in-a-commercial-space'],
  ownerSignoff: null,
};
