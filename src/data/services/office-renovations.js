// Office renovations — content for /services/office-renovations (rendered by src/pages/ProjectPage.jsx).
// Registry entry (path, labels, status, estimator, form type): src/data/services.js.
// Brief (plan §7): tenant fit-ups, lease dates, after-hours work.
//
// The intro image is a stock inspiration photo, not a Bridgeland job: keep its
// alt to what is visible. No gallery or testimonial until real, consented job
// photos and quotes exist. Truth rules: no job counts, no named clients or past
// projects, no licence/insurance/WCB/warranty claims, no commercial timelines
// or prices. Every rule in `local` was checked against the official page in its
// sources list on 2026-10-13.

import { EXPERIENCE_YEARS, PROJECT_COUNT, REPLY_TIME } from '../facts.js';

export default {
  slug: 'office-renovations',
  breadcrumb: 'Office Renovation',
  badge: 'Office Fit-Ups & Tenant Improvements',
  title: 'OFFICE RENOVATIONS',
  titleHighlight: 'IN WINNIPEG',
  subtitle:
    'We renovate offices, from a single meeting room to a full tenant fit-up, around your lease dates and your team’s working hours. Noisy work can be scheduled for evenings and weekends.',
  heroPoints: ['Free site visit & written quote', 'After-hours & weekend scheduling', 'Weekly progress updates'],

  stats: [
    { num: String(EXPERIENCE_YEARS), unit: '+', label: 'Years of combined experience' },
    { num: String(PROJECT_COUNT), unit: '+', label: 'Projects completed' },
    { num: '1', unit: '×', label: 'Progress update every week' },
    { num: '1', unit: 'day', label: `Reply within ${REPLY_TIME}` },
  ],

  intro: {
    tag: 'Why Bridgeland for your office?',
    title: 'What does an office renovation involve?',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Open office with glass-walled rooms, a dark kitchenette, and teal bench seating',
    floatingTitle: 'Lease Dates First',
    floatingText: 'The schedule starts from your move-in date and works backwards.',
    paragraphs: [
      'An office renovation reworks a workspace around how your team works now: private offices, meeting rooms, open work areas, a staff kitchen, washrooms, lighting, power and data. In a leased unit it’s usually called a fit-up or tenant improvement, and work regulated by the building code needs a City of Winnipeg building permit.',
      'The lease drives the schedule. Your move-in date, any free-rent period and, in many leases, the landlord’s approval of your plans all set how much time there is to build. Bring the lease to the site visit and we’ll plan from those dates.',
      'If your team stays in the space during the work, we split it into phases and schedule the loud work, such as demolition and cutting, for evenings and weekends where the City’s noise rules allow. You get a progress update every week, so you can tell everyone in the company what’s happening next.',
      'Already have drawings from an architect or interior designer? We build to supplied drawings. If you don’t, start with the site visit: we’ll talk through the layout and tell you whether the City is likely to ask for professional drawings for your scope.',
    ],
    checklist: ['Tenant Fit-Ups', 'Meeting Rooms & Offices', 'Partitions & Ceilings', 'Lighting, Power & Data'],
  },

  includes: {
    tag: 'What’s Included',
    title: 'What an Office Renovation Covers',
    desc: 'The full fit-up. Only need part of it, like new finishes or two more meeting rooms? Say so and we’ll scope just that.',
    items: [
      { num: '01', title: 'Site Visit & Scope', text: 'Walking the space with you and your lease, counting desks and rooms, and writing a scope you can check against your plans.' },
      { num: '02', title: 'Demolition & Partitions', text: 'Taking out old walls and building new office partitions, doors and demising walls, with fire separations kept intact.' },
      { num: '03', title: 'Ceilings & Lighting', text: 'T-bar or drywall ceilings, with lighting and controls laid out for the new desks and meeting tables rather than the old floor plan.' },
      { num: '04', title: 'Power, Data & HVAC', text: 'Outlets and data runs where people actually sit, plus HVAC changes so new rooms aren’t too hot or too cold.' },
      { num: '05', title: 'Kitchens & Washrooms', text: 'Staff kitchens and washrooms rebuilt with durable finishes and accessible layouts that meet the Manitoba Building Code.' },
      { num: '06', title: 'Finishes & Millwork', text: 'Flooring, paint, reception desks and built-in storage that carry your brand and stand up to daily office use.' },
    ],
  },

  gallery: null,

  process: {
    tag: 'How It Works',
    title: 'From Lease to Move-In',
    desc: 'A schedule built from your move-in date, and an update every week.',
    steps: [
      { num: '01', title: 'Site Visit & Scope', text: 'We walk the space with you, look at the lease dates and any drawings, and ask how your team works. The visit and the written quote are free.' },
      { num: '02', title: 'Quote & Schedule', text: 'A written quote with a schedule built around your move-in date and your working hours, including which tasks happen after hours.' },
      { num: '03', title: 'Permits & Build', text: 'We coordinate the permit, then build in phases so staff can keep working where possible, with loud work in the evenings and on weekends.' },
      { num: '04', title: 'Inspections & Handover', text: 'City inspections passed, deficiencies cleared, rooms cleaned and ready for furniture, and a walkthrough with you before move-in.' },
    ],
  },

  testimonial: null,

  faqsTitle: 'Office Renovation FAQs',
  faqs: [
    { q: 'How long does an office renovation take?', a: 'It depends on the scope and on the permit. A refresh of finishes in the same layout moves quickly, while a full fit-up with new walls, ceilings and services takes longer and waits on the City’s plan review. You get a schedule with your written quote, built backwards from your move-in date, and an update every week.' },
    { q: 'Can my staff keep working during the renovation?', a: 'Often, yes. We split the space into phases so part of the office stays usable, keep the work area closed off, and schedule the loudest work for evenings and weekends where the City’s noise rules allow. Some steps, like new flooring under desks, may need a weekend or a short move, and we’ll name those at the site visit.' },
    { q: 'Do I need an architect for an office fit-up?', a: 'Not always. The City of Winnipeg’s guide says structural changes need a professional engineer, and significant changes to fire alarms, sprinklers, exits or public corridors need an architect and/or engineer. A simple layout change inside one unit may not. Bring your plans to the site visit and we’ll tell you what the City is likely to ask for.' },
    { q: 'Who pays for an office fit-up, the landlord or the tenant?', a: 'Your lease decides. Some landlords offer a tenant improvement allowance or build part of the space before you move in; others hand over a bare unit. Read the improvement clause or work letter before you collect quotes, and bring it to the site visit so the scope matches what you’re responsible for.' },
    { q: 'Can you add meeting rooms or private offices?', a: 'Yes. New partitions, doors and ceilings for meeting rooms and private offices are a common part of an office renovation. Each new room also needs light, power, data, air flow and enough sound control for how it’s used, so we plan those with the walls rather than after them.' },
    { q: 'Do you handle the permit and inspections?', a: 'Yes. We coordinate the building permit and inspections with the City of Winnipeg or your local municipality, and flag anything that will need attention early, such as a demising wall, an exit change or an accessibility upgrade. If the City needs professional drawings, we build to the architect’s or engineer’s set.' },
    { q: 'What happens after I contact you?', a: `We reply within ${REPLY_TIME} and book a free on-site visit. We walk the space with you, go through the lease dates and what your team needs, and then send a written quote with a schedule. Once the work starts, you get a progress update every week until handover.` },
  ],

  // Title, meta description and Service schema for this page. `updated`
  // feeds the sitemap lastmod and WebPage dateModified: bump it only when the
  // page content really changes.
  seo: {
    title: 'Office Renovations Winnipeg | Bridgeland Builders',
    description:
      'Office renovations and fit-ups in Winnipeg, planned around your lease dates and team. Free site visit, written quote, after-hours work, weekly updates.',
    serviceType: 'Office renovation',
    audience: { '@type': 'BusinessAudience', audienceType: 'Businesses and commercial property owners' },
    primaryKeyword: 'office renovation Winnipeg',
    updated: '2026-10-14',
  },

  typesTitle: 'Types of Office Renovations',
  typesDesc: 'From a light refresh to a full remodel of your current office or a fit-up of a new unit.',
  types: [
    { title: 'Tenant Fit-Up', text: 'Turning a bare or previous-tenant unit into your office, usually against a fixed move-in date in your lease.' },
    { title: 'Office Refresh', text: 'New flooring, paint, lighting and finishes in the layout you already have, with much of the work possible after hours.' },
    { title: 'Layout Reconfiguration', text: 'Moving walls to trade private offices for open space, or the reverse, and adding meeting rooms or quiet rooms.' },
    { title: 'Office Expansion', text: 'Taking over the next suite and joining the two, including the demising wall, doors and services between them.' },
    { title: 'Professional Offices', text: 'Law, accounting and consulting offices with reception, private offices, file storage and meeting rooms where conversations stay private.' },
    { title: 'Kitchens, Washrooms & Common Areas', text: 'Staff rooms, washrooms and shared corridors upgraded on their own or as part of a larger renovation.' },
  ],

  local: {
    title: 'Does an office renovation need a building permit?',
    intro:
      'Usually. The City of Winnipeg requires a building permit whenever work is regulated by the Winnipeg Building By-law or the Manitoba Building Code. Office alterations are filed with the City’s Commercial Alteration Design Summary (CADS), and work on structure, exits or fire safety systems generally needs an architect or engineer.',
    items: [
      { title: 'Permit Application', text: 'Commercial alterations are filed through the City’s Permits Online system with a Commercial Alteration Design Summary. The City says incomplete applications result in delays, so the details are checked before filing.' },
      { title: 'Demising Walls & Exits', text: 'Walls between tenants, exits and public corridors affect fire safety. The City’s CADS form says significant alterations to exits, lobbies used as exits or public corridors in Part 3 buildings need drawings sealed by an architect or engineer.' },
      { title: 'Occupancy Permit', text: 'A new tenant establishing a use without a valid occupancy permit, or a tenant expanding into more space, generally needs an occupancy permit before moving in. Ask your landlord what permit the unit already has.' },
      { title: 'Accessibility', text: 'Manitoba adopted the 2020 National Building Code on January 1, 2024, with accessibility requirements aligned with CSA B651. Entrances, washrooms and door clearances are planned into the layout from the start.' },
      { title: 'After-Hours Noise', text: 'Loud work within 150 m of a home is allowed 7 a.m. to 9 p.m. on weekdays and 9 a.m. to 9 p.m. on weekends and holidays. Your building may set its own work-hour rules too, so check the lease.' },
      { title: 'Outside Winnipeg', text: 'In Headingley, East St. Paul, West St. Paul, Oak Bluff, Selkirk or Steinbach, the permit comes from the local municipality or planning district instead, and we coordinate with them the same way.' },
    ],
    sources: [
      { label: 'City of Winnipeg: Permits Online', url: 'https://www.winnipeg.ca/building-development/permits-applications/permits-online', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Commercial Alteration Design Summary (CADS) application, October 2025', url: 'https://www.winnipeg.ca/media/6330', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Permits Online', url: 'https://www.winnipeg.ca/building-development/permits-applications/permits-online', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Occupancy permits', url: 'https://www.winnipeg.ca/building-development/building-renovating/commercial-projects/occupancy-permits', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Construction in your neighbourhood', url: 'https://www.winnipeg.ca/building-development/property-records/construction-your-neighbourhood', accessed: '2026-10-13' },
      { label: 'Province of Manitoba: Manitoba Building Code updates, accessibility', url: 'https://www.gov.mb.ca/asset_library/en/labour/docs/its/accessibiity_requirement_updates.pdf', accessed: '2026-10-13' },
    ],
  },

  // Commercial cost page stays unpublished (no data, plan §8): the teaser
  // points to the cost hub's "priced after a visit" section. No numbers.
  costTeaser: {
    text: 'Office renovations are priced in a free written quote after a site visit, once we have walked the space with you and seen your lease dates. Our Winnipeg cost guide explains what moves the price of a renovation.',
    to: '/renovation-cost-winnipeg#priced-after-a-visit',
    label: 'Renovation costs in Winnipeg',
  },
  // Live pages only are shown; drafts appear when they launch.
  related: ['/services/commercial-renovations', '/services/general-contracting', '/services/retail-renovations', '/services/medical-dental-office-renovations', '/services/demolition'],
  guides: ['office-fit-up-lease-planning-winnipeg', 'how-to-balance-functionality-and-aesthetics-in-a-commercial-space', 'how-to-prepare-your-business-for-a-major-renovation'],
  ownerSignoff: null,
};
