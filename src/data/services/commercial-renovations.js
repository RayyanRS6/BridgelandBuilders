// Commercial renovations — content for /services/commercial-renovations (rendered by src/pages/ProjectPage.jsx).
// Registry entry (path, labels, status, estimator, form type): src/data/services.js.
//
// The intro and gallery images are stock inspiration photos, not Bridgeland
// jobs. Keep their alts and captions to what is visible in the photo (no
// "Winnipeg", no "our", no finished-job outcomes) until real job photos with
// client consent replace them.
//
// Truth rules (plan Guardrails): no per-vertical job counts, no named past
// projects or clients, no licence/insurance/WCB/warranty claims, no commercial
// timelines or prices. The testimonial below is a real client's (confirmed by
// the owner 2026-10-13); add new ones only from real clients, with consent.
//
// Every rule in `local` was checked against the official page in its sources
// list on 2026-10-13. Re-check them before changing the wording.

import { EXPERIENCE_YEARS, OFFICE_HOURS_TEXT, PROJECT_COUNT, REPLY_TIME, SITE_EMAIL, SITE_PHONE } from '../facts.js';

export default {
  slug: 'commercial-renovation',
  breadcrumb: 'Commercial Renovation',
  badge: 'Offices, Retail, Restaurants, Hotels & Clinics',
  title: 'COMMERCIAL RENOVATIONS',
  titleHighlight: 'IN WINNIPEG',
  subtitle:
    'We renovate offices, stores, restaurants, cafés, bars, hotels and clinics in Winnipeg and nearby communities, with after-hours and weekend scheduling so you can keep trading.',
  heroPoints: ['Free site visit & written quote', 'After-hours & weekend scheduling', 'Weekly progress updates'],

  stats: [
    { num: String(EXPERIENCE_YEARS), unit: '+', label: 'Years of combined experience' },
    { num: String(PROJECT_COUNT), unit: '+', label: 'Projects completed' },
    { num: '1', unit: '×', label: 'Progress update every week' },
    { num: '1', unit: 'day', label: `Reply within ${REPLY_TIME}` },
  ],

  intro: {
    tag: 'Why Bridgeland for your space?',
    title: 'What does a commercial renovation involve?',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Open office meeting area with a long wood table, pink chairs, and floor-to-ceiling windows',
    floatingTitle: 'Planned Around Your Date',
    floatingText: 'The schedule starts from your opening date and works backwards.',
    paragraphs: [
      'A commercial renovation rebuilds a working space, such as an office, store, restaurant, hotel or clinic, around a lease, an opening date and the hours you need to stay open. It usually covers demolition, new walls and ceilings, electrical and mechanical changes, washrooms, finishes, a City building permit and the inspections that follow.',
      'A commercial remodel runs on a different clock than a house. There’s a lease starting, an opening date booked, staff who need somewhere to work, and customers who’ll go elsewhere if the doors stay shut. So we build the plan backwards from your date and tell you honestly at the site visit whether it’s realistic.',
      'Where it helps, we schedule work in the evenings and on weekends so you can keep trading, and we phase the job so only part of the space is closed at a time. You get a progress update every week, so you’re never chasing us for news.',
      'We work across Winnipeg and nearby communities, including Headingley, East St. Paul, West St. Paul, Oak Bluff, Selkirk and Steinbach, and we coordinate permits and inspections with the City of Winnipeg or the local municipality.',
    ],
    checklist: ['Offices & Workspaces', 'Retail & Showrooms', 'Restaurants, Cafés & Hotels', 'Medical & Dental Clinics'],
  },

  includes: {
    tag: 'What’s Included',
    title: 'What a Commercial Renovation Covers',
    desc: 'Scoped around your lease, your opening date, and the hours you need to keep trading.',
    items: [
      { num: '01', title: 'Site Visit & Scope', text: 'Walking the space with you, your lease dates and your opening plan, then putting the scope in a free written quote.' },
      { num: '02', title: 'Demolition & Fit-Out', text: 'Stripping out the old layout and building the new one: partitions, ceilings, storefronts, and service areas.' },
      { num: '03', title: 'Electrical & Mechanical', text: 'Lighting, power, data runs and HVAC changes to suit the new floor plan, with the trade permits that work needs.' },
      { num: '04', title: 'Washrooms & Accessibility', text: 'Commercial washroom renovation, accessible entrances and clearances, built to the Manitoba Building Code and ready for inspection.' },
      { num: '05', title: 'Finishes & Branding', text: 'Flooring, wall finishes, millwork, and the details that carry your brand through the space.' },
      { num: '06', title: 'Phased & After-Hours Work', text: 'Evening and weekend scheduling so you can keep trading through as much of the project as possible.' },
    ],
  },

  gallery: {
    tag: 'Design Ideas',
    title: 'Commercial Renovation Ideas',
    desc: 'Inspiration photos, not Bridgeland projects. Photos from our own Winnipeg jobs will replace these as each project is documented.',
    items: [
      { img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', alt: 'Open office with glass-walled rooms, a dark kitchenette, and teal bench seating', title: 'Open Office Layout', text: 'Glass-walled rooms, a kitchenette, and open shelving' },
      { img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', alt: 'Room with light grey walls, a black loveseat, a white dresser, and a floor lamp', title: 'Clean, Neutral Room', text: 'Pale grey walls, light floors, and simple furniture' },
      { img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80', alt: 'Living room with a grey sofa, wood coffee table, wood floors, and floor-to-ceiling windows', title: 'Lounge Seating Area', text: 'Sofa, leather ottomans, and floor-to-ceiling windows' },
    ],
  },

  process: {
    tag: 'How It Works',
    title: 'Scoped, Scheduled, Open',
    desc: 'A written quote and a schedule you can plan your business around, then an update every week.',
    steps: [
      { num: '01', title: 'Site Visit & Scope', text: 'We walk the space with you, note your lease and opening dates, and find out which hours you can’t afford to lose. The visit and the written quote are free.' },
      { num: '02', title: 'Written Quote & Schedule', text: 'A written scope and price, with a schedule built around your hours. If your date isn’t realistic, we say so up front rather than halfway through.' },
      { num: '03', title: 'Permits & Build', text: 'We coordinate the permits, then build in phases and after hours where it helps, so as much of your space as possible keeps trading. You get an update every week.' },
      { num: '04', title: 'Inspections & Handover', text: 'Inspections booked and passed, deficiencies cleared, and the space cleaned and ready for you to move in or reopen.' },
    ],
  },

  // Real client testimonial (confirmed by the owner 2026-10-13).
  testimonial: {
    quote:
      '“We had six weeks between the lease starting and our opening date, and everyone told us it was tight. Bridgeland scoped it, worked two weekends to keep us on track, and we opened on the day we’d advertised. We’ve used them for two more locations since.”',
    initial: 'A',
    name: 'Amrit S.',
    role: 'Business owner, Retail Fit-Out',
  },

  faqsTitle: 'Commercial Renovation FAQs',
  faqs: [
    { q: 'Can you work after hours so we stay open?', a: 'Yes. Evening and weekend scheduling is available for commercial work, and for stores and restaurants it’s often the plan from the start. In Winnipeg, loud work within 150 m of a home is limited to 7 a.m. to 9 p.m. on weekdays and 9 a.m. to 9 p.m. on weekends, so noisy tasks are scheduled inside those hours.' },
    { q: 'Do you handle permits and inspections?', a: 'Yes. We coordinate building permits and inspections with the City of Winnipeg or your local municipality, and we flag anything in your space that will need attention early, such as a change of use, a fire separation or an accessibility upgrade. If the City requires an architect’s or engineer’s drawings, we build to theirs.' },
    { q: 'What is a tenant improvement?', a: 'A tenant improvement, also called a fit-up, fit-out or leasehold improvement, is the work that turns a leased commercial unit into a space one business can use: walls, ceilings, lighting, washrooms, finishes and services. Your lease usually says who pays for what, so bring it to the site visit and we’ll scope the work against it.' },
    { q: 'Can you work with our architect or designer?', a: 'Yes. We build to supplied drawings and specifications, and we walk the space against them before work starts. If something on the drawings won’t work on site, such as a duct that clashes with a beam, we raise it with you and your designer before it turns into a costly change.' },
    { q: 'Can you take on work for property managers?', a: 'Yes. We quote vacant-unit turnovers, common areas, washrooms and multi-unit upgrades for property managers and building owners. Each job starts with a free site visit and a written quote, and the weekly progress update gives you something to pass on to owners and tenants.' },
    { q: 'How firm is the schedule?', a: 'The schedule comes with your written quote, and we build to it. If something outside our control moves, like a permit review, a supplier delay or an inspection date, you hear about it in that week’s update along with what we’re doing about it, rather than at the end of the job.' },
    { q: 'Which areas do you serve for commercial work?', a: 'We work in Winnipeg and nearby communities within about an hour of the city, including Headingley, East St. Paul, West St. Paul, Oak Bluff, Selkirk and Steinbach. Outside Winnipeg, permits and inspections go through the local municipality or planning district, and we coordinate with them the same way.' },
    { q: 'How quickly will you get back to us?', a: `Within ${REPLY_TIME}. Our office hours are ${OFFICE_HOURS_TEXT}, and you can reach us at ${SITE_PHONE} or ${SITE_EMAIL}. From there we book a free on-site visit, walk the space with you, and follow up with a written quote.` },
  ],

  // Title, meta description and Service schema for this page. `updated`
  // feeds the sitemap lastmod and WebPage dateModified: bump it only when the
  // page content really changes.
  seo: {
    title: 'Commercial Renovations Winnipeg | Bridgeland Builders',
    description:
      'Commercial renovations in Winnipeg for offices, stores, restaurants, hotels and clinics, with a free site visit, written quote and after-hours scheduling.',
    serviceType: 'Commercial renovation',
    // Service schema audience (plan §3.5): written for business owners and
    // the people who run commercial property.
    audience: { '@type': 'BusinessAudience', audienceType: 'Businesses and commercial property owners' },
    primaryKeyword: 'commercial renovation Winnipeg',
    updated: '2026-10-14',
  },

  // Optional sections (plan §7), rendered by ProjectPage only when filled in:
  //   types      [{ title, text, to? }]                   "types of <service>" cards
  //   local      { title, intro, items: [{ title, text }], sources: [{ label, url, accessed }] }
  //   costTeaser { text, to }                             1–2 lines + link to the cost page
  //   related    [path]                                   related service pages (registry paths)
  //   guides     [blogSlug]                               related guides (blog posts)
  //   faqsTitle  string                                   heading over the FAQs
  //   ownerSignoff { name, role, date }                   owner sign-off line
  // gallery and testimonial are optional too.
  //
  // `to` on a types card is the vertical's page (with an optional #anchor:
  // Hotels goes to the hotel cards on the restaurant page). ProjectPage links
  // the card title while that page is live.
  typesTag: 'Spaces & Who It’s For',
  typesTitle: 'Commercial Spaces We Renovate',
  typesDesc: 'Each kind of space has its own page. We also quote work for property managers, developers and design professionals.',
  types: [
    { title: 'Office Renovations', to: '/services/office-renovations', text: 'Tenant fit-ups, meeting rooms, private offices and open work areas, planned around your lease dates and your team’s hours.' },
    { title: 'Retail Renovations', to: '/services/retail-renovations', text: 'Store layouts, fitting rooms, cash areas, showrooms and storefronts, built to your opening date with after-hours work where it helps.' },
    { title: 'Restaurants, Cafés & Bars', to: '/services/restaurant-renovations', text: 'Dining rooms, bars and back-of-house areas, scheduled around service and planned with the public health plan review in mind.' },
    { title: 'Hotels', to: '/services/restaurant-renovations#hotels', text: 'Guest rooms, corridors, lobbies and common areas, phased so the rest of the property keeps welcoming guests.' },
    { title: 'Medical & Dental Offices', to: '/services/medical-dental-office-renovations', text: 'Exam rooms, dental operatories, physio clinics, reception and sterilization areas, with cleanable finishes and phasing around patients.' },
    { title: 'General Contracting', to: '/services/general-contracting', text: 'A commercial general contractor to run the trades, schedule, permits and inspections, building to supplied drawings.' },
    { title: 'Property Managers & Building Owners', text: 'Commercial property renovation for vacant units, tenant turnovers, washrooms and common areas, with weekly updates you can pass on to owners or your management company.' },
    { title: 'Real Estate Developers & Realtors', text: 'Practical improvements that get a property ready to sell, lease or occupy, scoped and quoted in writing after a free site visit.' },
    { title: 'Architects & Designers', to: '/services/general-contracting', text: 'Construction that turns your drawings and specifications into a finished space, with site conflicts raised before they become change orders.' },
  ],

  local: {
    title: 'Does a commercial renovation need a permit?',
    intro:
      'Usually, yes. The City of Winnipeg requires a building permit whenever work is regulated by the Winnipeg Building By-law or the Manitoba Building Code, and a change of use needs one even when the work is only cosmetic. Substantial alterations and changes of use also need an occupancy permit before the space is used.',
    items: [
      { title: 'Building Permit & CADS', text: 'Commercial alteration and change-of-use applications go in with the City’s Commercial Alteration Design Summary (CADS). The City says incomplete applications result in delays, so the details are checked before it’s filed.' },
      { title: 'Architects & Engineers', text: 'The City’s CADS form says drawings must be sealed by an architect or engineer for any change to a building’s structural systems, and for significant changes to fire alarms, sprinklers, exits or public corridors in larger (Part 3) buildings. We build to their sealed drawings.' },
      { title: 'Change of Use', text: 'Turning a store into a restaurant is a change of use: it needs a building permit even with little construction, and a change of major occupancy may need an architect or engineer. Confirm the new use is allowed under zoning before you pay for plans.' },
      { title: 'Occupancy Permit', text: 'Substantial alterations and changes of use need an occupancy permit before the space is used. A new tenant moving into a space with a valid occupancy permit and no alterations generally doesn’t need a new one.' },
      { title: 'Accessibility', text: 'Manitoba adopted the 2020 National Building Code on January 1, 2024, with updated accessibility requirements aligned with CSA B651. Accessible entrances, washrooms and clearances are planned at the layout stage, not added after.' },
      { title: 'Noise Rules for After-Hours Work', text: 'In Winnipeg, loud work within 150 m of a home is allowed 7 a.m. to 9 p.m. on weekdays and 9 a.m. to 9 p.m. on weekends and holidays, so the loudest tasks are scheduled inside those hours.' },
    ],
    sources: [
      { label: 'City of Winnipeg: Commercial projects', url: 'https://www.winnipeg.ca/building-development/building-renovating/commercial-projects', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Commercial Alteration Design Summary (CADS) application, October 2025', url: 'https://www.winnipeg.ca/media/6330', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Permits Online', url: 'https://www.winnipeg.ca/building-development/permits-applications/permits-online', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Occupancy permits', url: 'https://www.winnipeg.ca/building-development/building-renovating/commercial-projects/occupancy-permits', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Construction in your neighbourhood', url: 'https://www.winnipeg.ca/building-development/property-records/construction-your-neighbourhood', accessed: '2026-10-13' },
      { label: 'Province of Manitoba: 2020 construction codes adoption', url: 'https://www.gov.mb.ca/labour/its/bldg_codes/2020_construction_codes_adoption.html', accessed: '2026-10-13' },
      { label: 'Province of Manitoba: Manitoba Building Code updates, accessibility', url: 'https://www.gov.mb.ca/asset_library/en/labour/docs/its/accessibiity_requirement_updates.pdf', accessed: '2026-10-13' },
    ],
  },

  // Commercial cost page stays unpublished (no data, plan §8): the teaser
  // points to the cost hub's "priced after a visit" section. No numbers.
  costTeaser: {
    text: 'Commercial renovations are priced in a free written quote after a site visit, not from an online estimate, because the scope, permits and working hours differ from one space to the next. Our Winnipeg cost guide explains what moves the price.',
    to: '/renovation-cost-winnipeg#priced-after-a-visit',
    label: 'Renovation costs in Winnipeg',
  },
  // Live pages only are shown; drafts appear when they launch.
  related: ['/services/office-renovations', '/services/retail-renovations', '/services/restaurant-renovations', '/services/medical-dental-office-renovations', '/services/general-contracting', '/services/demolition'],
  guides: ['the-biggest-cost-factors-in-commercial-renovation-projects', 'how-to-prepare-your-business-for-a-major-renovation', 'how-to-finance-a-commercial-renovation-without-breaking-the-bank'],
  ownerSignoff: null,
};
