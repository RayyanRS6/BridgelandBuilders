// Dental & medical office renovations — content for /services/medical-dental-office-renovations (rendered by src/pages/ProjectPage.jsx).
// Registry entry (path, labels, status, estimator, form type): src/data/services.js.
// Brief (plan §7): phasing around patients, City commercial permit/occupancy,
// Manitoba Building Code accessibility (Canadian wording, never "ADA").
//
// The intro image is a stock inspiration photo, not a Bridgeland job: keep its
// alt to what is visible. No gallery or testimonial until real, consented job
// photos and quotes exist. Truth rules: no job counts, no named clinics or past
// projects, no licence/insurance/WCB/warranty claims, no commercial timelines
// or prices, and no clinical or infection-control rules stated as ours:
// cleanable finishes are general guidance only. Every rule in `local` was
// checked against the official page in its sources list on 2026-10-13.

import { EXPERIENCE_YEARS, PROJECT_COUNT, REPLY_TIME } from '../facts.js';
import { NEARBY_AREAS_TEXT_OR } from '../areas.js';

export default {
  slug: 'medical-dental-office-renovations',
  breadcrumb: 'Medical & Dental Office Renovation',
  badge: 'Medical, Dental & Physio Clinics',
  title: 'DENTAL & MEDICAL OFFICE RENOVATIONS',
  titleHighlight: 'IN WINNIPEG',
  subtitle:
    'We renovate dental offices, medical clinics and physiotherapy clinics in Winnipeg and nearby communities, phased around patient hours and finished with surfaces that are easy to clean. Every project starts with a free on-site visit and a written quote.',
  heroPoints: ['Free site visit & written quote', 'After-hours & weekend scheduling', 'Weekly progress updates'],

  stats: [
    { num: String(EXPERIENCE_YEARS), unit: '+', label: 'Years of combined experience' },
    { num: String(PROJECT_COUNT), unit: '+', label: 'Projects completed' },
    { num: '1', unit: '×', label: 'Progress update every week' },
    { num: '1', unit: 'day', label: `Reply within ${REPLY_TIME}` },
  ],

  intro: {
    tag: 'Why Bridgeland for your clinic?',
    title: 'What does a clinic renovation involve?',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Open office with glass-walled rooms, a dark kitchenette, and teal bench seating',
    floatingTitle: 'Patients Keep Coming',
    floatingText: 'Work is phased so the clinic can keep seeing patients where possible.',
    paragraphs: [
      'A clinic renovation rebuilds the rooms patients and staff use every day: reception and waiting areas, exam rooms or dental operatories, sterilization and lab space, washrooms and staff areas. It also covers the plumbing, power, data and ventilation behind them, the City building permit, and the inspections needed before patients come back.',
      'Clinics run on appointments, so the schedule matters as much as the finishes. We [plan the work in phases](/blog/how-to-prepare-your-business-for-a-major-renovation) so some rooms keep seeing patients, and we schedule the loudest tasks for evenings and weekends where the City’s noise rules allow. You get a progress update every week.',
      'Equipment shapes the build. Dental chairs, X-ray units, compressors, suction, sterilizers and exam tables each have their own service and space needs, so we ask for your equipment supplier’s installation requirements early and build the rough-ins to match.',
      'Clinical and infection-control rules come from your professional standards, your health authority and your own policies, not from your contractor. Our job is to build what those rules call for: cleanable, durable finishes and a layout that your team and designer have signed off.',
    ],
    checklist: ['Dental Operatories', 'Exam & Treatment Rooms', 'Reception & Waiting', 'Sterilization & Staff Areas'],
  },

  includes: {
    tag: 'What’s Included',
    title: 'What a Clinic Renovation Covers',
    desc: 'Scoped around your equipment, your appointment book, and the rooms that have to stay open.',
    items: [
      { num: '01', title: 'Site Visit & Scope', text: 'Walking the clinic with you, your equipment list and your appointment schedule, then [writing the scope and phasing into a free written quote](/our-process).' },
      { num: '02', title: 'Operatories & Exam Rooms', text: 'Walls, doors, cabinetry and the plumbing, power and data rough-ins each chair or exam table needs, built to your supplier’s specifications.' },
      { num: '03', title: 'Sterilization & Lab Areas', text: 'Counters, sinks and storage laid out so instruments move one way, from dirty to clean, as your team and designer specify.' },
      { num: '04', title: 'Reception & Waiting', text: 'Front desks, waiting rooms and patient washrooms, with accessible entrances and clearances that meet the Manitoba Building Code.' },
      { num: '05', title: 'Cleanable Finishes', text: 'Smooth, durable surfaces such as [sheet flooring](/services/flooring), solid-surface counters and washable wall finishes that stand up to frequent cleaning.' },
      { num: '06', title: 'Phasing & After-Hours Work', text: 'Work split into stages and scheduled for evenings and weekends where it helps, so part of the clinic can keep booking patients.' },
    ],
  },

  gallery: null,

  process: {
    tag: 'How It Works',
    title: 'Planned Around Your Patients',
    desc: 'A phasing plan in your quote, and an update every week.',
    steps: [
      { num: '01', title: 'Site Visit & Scope', text: 'We walk the clinic with you, go through your equipment list and appointment schedule, and agree which rooms must stay open. The visit and quote are free.' },
      { num: '02', title: 'Quote & Phasing Plan', text: 'A written quote and schedule that shows which rooms close when, which work happens after hours, and when equipment suppliers need access.' },
      { num: '03', title: 'Permits & Build', text: 'We coordinate the permit, then build in stages with the work area closed off from rooms still in use. You get an update every week.' },
      { num: '04', title: 'Inspections & Handover', text: 'City inspections passed, deficiencies cleared, and rooms cleaned and ready for your equipment installers and your team.' },
    ],
  },

  testimonial: null,

  faqsTitle: 'Clinic Renovation FAQs',
  faqs: [
    { q: 'Can our clinic stay open during the renovation?', a: 'Often, yes. We phase the work so some operatories or exam rooms keep seeing patients while others are rebuilt, keep the work area closed off, and move the loudest tasks to evenings and weekends where the City’s noise rules allow. Some steps, like tying in new plumbing, may need a short closure, and we’ll name those in the schedule.' },
    { q: 'Do you build dental operatories and sterilization rooms?', a: 'Yes. Dental office construction covers the walls, cabinetry and finishes as well as the plumbing, power and data rough-ins each chair needs. We build to your equipment supplier’s installation drawings and your designer’s layout, so ask your supplier for those early: they decide where every rough-in goes.' },
    { q: 'Do clinic renovations need special finishes?', a: 'Usually. Clinical areas are cleaned often and with strong products, so smooth, non-porous, durable surfaces with few seams are the usual choice: sheet flooring with coved edges, solid-surface or quartz counters, and scrubbable wall finishes. Your clinical policies and your designer set the exact specification, and we build to it.' },
    { q: 'What do we need to know about X-ray rooms?', a: 'Plan them first. Under Manitoba’s X-Ray Safety Regulation, X-ray equipment must be registered, and installing a machine in a permanent location needs the minister’s prior approval, with scaled drawings showing the shielding on the room’s boundaries. Once you have the shielding design, we build the walls, doors and ceiling to match it.' },
    { q: 'Will the renovated clinic be accessible?', a: 'It’s built to the Manitoba Building Code, which adopted the 2020 National Building Code on January 1, 2024, with updated accessibility requirements aligned with CSA B651. That shapes entrances, washrooms, door widths and reception counters. Older clinics may have features worth upgrading during the work, and we’ll point those out at the site visit.' },
    { q: 'Do you work with our designer and equipment supplier?', a: 'Yes. We build to supplied drawings and specifications, and we coordinate site access with your equipment supplier so cabinets, rough-ins and equipment arrive in the right order. If a drawing doesn’t work on site, we raise it before the wall is closed, not after.' },
    { q: 'Do you handle permits and inspections?', a: 'Yes. We coordinate the building permit and inspections with the City of Winnipeg or your local municipality, and flag early anything your space will need, such as an accessibility upgrade, an exit change or professional drawings. Approvals that belong to you, like X-ray equipment registration, stay with you, and we build the schedule around them.' },
  ],

  // Title, meta description and Service schema for this page. `updated`
  // feeds the sitemap lastmod and WebPage dateModified: bump it only when the
  // page content really changes.
  seo: {
    title: 'Dental & Medical Office Renovations Winnipeg | Bridgeland',
    description:
      'Dental and medical office renovations in Winnipeg: operatories, exam rooms and reception, phased around patient hours. Free site visit and written quote.',
    serviceType: 'Medical and dental office renovation',
    audience: { '@type': 'BusinessAudience', audienceType: 'Dental, medical and physiotherapy clinics' },
    primaryKeyword: 'dental office renovation Winnipeg',
    updated: '2026-10-15',
  },

  typesTitle: 'Clinics We Renovate',
  typesDesc: 'Whole-clinic fit-ups or a few rooms at a time.',
  types: [
    { title: 'Dental Offices', text: 'Operatories, sterilization rooms, X-ray rooms, labs and reception for general and specialty dental practices.' },
    { title: 'Medical Clinics', text: 'Exam rooms, procedure rooms, nursing stations and waiting areas for family practices and walk-in clinics.' },
    { title: 'Physiotherapy Clinics', text: 'Open treatment floors, private treatment rooms, exercise areas and change rooms, with flooring suited to equipment.' },
    { title: 'Other Health Practices', text: 'Chiropractic, massage, counselling and other practices that need private rooms and a calm waiting area.' },
    { title: 'Moving Into a New Unit', text: '[A medical office fit-out in a leased unit](/blog/office-fit-up-lease-planning-winnipeg), including the building permit and the occupancy permit needed before you open.' },
    { title: 'Upgrades in an Operating Clinic', text: 'Adding operatories or exam rooms, refreshing finishes or reworking reception while the rest of the clinic stays open.' },
  ],

  local: {
    title: 'What permits does a clinic renovation need?',
    intro:
      'In Winnipeg, [a clinic renovation needs a City building permit](/blog/clinic-renovation-permits-winnipeg) whenever the work is regulated by the building by-law or the Manitoba Building Code, and substantial alterations need an occupancy permit before patients return. X-ray rooms add a step: in Manitoba, a permanent X-ray location needs the minister’s prior approval, based on drawings that show the shielding.',
    items: [
      { title: 'Building Permit', text: 'Clinic alterations are filed with the City’s Commercial Alteration Design Summary. Changes to structure, exits or fire safety systems generally need an architect or engineer, so check that before plans are final.' },
      { title: 'X-Ray Shielding', text: 'Manitoba’s X-Ray Safety Regulation requires X-ray equipment to be registered, and prior approval, with scaled drawings showing the shielding, before a machine is installed in a permanent location or an approved X-ray area is substantially altered.' },
      { title: 'Accessibility', text: 'Manitoba adopted the 2020 National Building Code on January 1, 2024, with accessibility requirements aligned with CSA B651. Entrances, washrooms, door widths and turning space are planned into the layout from the start.' },
      { title: 'Occupancy Permit', text: 'Substantial alterations, expansions and changes of use need an occupancy permit before the space is used. Moving into a new unit? Ask the landlord what occupancy permit it already has.' },
      { title: 'Cleanable Finishes', text: 'Your clinical policies and professional standards set the infection-control rules. As general guidance, smooth, non-porous surfaces and sealed joints make cleaning easier; your designer confirms the specification.' },
      { title: 'Outside Winnipeg', text: `In ${NEARBY_AREAS_TEXT_OR}, the building permit comes from the local municipality or planning district instead, and we coordinate with them the same way.` },
    ],
    sources: [
      { label: 'City of Winnipeg: Commercial projects', url: 'https://www.winnipeg.ca/building-development/building-renovating/commercial-projects', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Commercial Alteration Design Summary (CADS) application, October 2025', url: 'https://www.winnipeg.ca/media/6330', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Occupancy permits', url: 'https://www.winnipeg.ca/building-development/building-renovating/commercial-projects/occupancy-permits', accessed: '2026-10-13' },
      { label: 'Manitoba Laws: X-Ray Safety Regulation, M.R. 341/88 R', url: 'https://web2.gov.mb.ca/laws/regs/current/341-88r.php?lang=en', accessed: '2026-10-13' },
      { label: 'Province of Manitoba: 2020 construction codes adoption', url: 'https://www.gov.mb.ca/labour/its/bldg_codes/2020_construction_codes_adoption.html', accessed: '2026-10-13' },
      { label: 'Province of Manitoba: Manitoba Building Code updates, accessibility', url: 'https://www.gov.mb.ca/asset_library/en/labour/docs/its/accessibiity_requirement_updates.pdf', accessed: '2026-10-13' },
    ],
  },

  // Commercial cost page stays unpublished (no data, plan §8): the teaser
  // points to the cost hub's "priced after a visit" section. No numbers.
  costTeaser: {
    text: 'Clinic renovations are priced in a free written quote after a site visit, once we have seen the rooms, your equipment list and your appointment schedule. Our Winnipeg cost guide explains what moves the price of a renovation.',
    to: '/renovation-cost-winnipeg#priced-after-a-visit',
    label: 'Renovation costs in Winnipeg',
  },
  // Live pages only are shown; drafts appear when they launch.
  related: ['/services/commercial-renovations', '/services/office-renovations', '/services/general-contracting', '/services/retail-renovations'],
  guides: ['clinic-renovation-permits-winnipeg', 'how-to-prepare-your-business-for-a-major-renovation', 'the-biggest-cost-factors-in-commercial-renovation-projects'],
  ownerSignoff: null,
};
