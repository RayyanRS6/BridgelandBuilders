// Whole home renovations — content for /services/whole-home-renovations (rendered by src/pages/ProjectPage.jsx).
// Registry entry (path, labels, status, estimator, form type): src/data/services.js.
//
// The intro and gallery images are stock inspiration photos, not Bridgeland
// jobs. Keep their alts and captions to what is visible in the photo (no
// "Winnipeg", no "our", no finished-job outcomes) until real job photos with
// client consent replace them.
//
// Facts: the 8–16 week timeline, free on-site visit and written quote, weekly
// progress updates and permit coordination are owner-confirmed. "One crew" /
// "one team" wording is not confirmed and stays off the page. Every City of
// Winnipeg / Health Canada statement in `local` and the FAQs was checked on
// 2026-10-13 against the sources in local.sources. The estimator has no
// whole-home price data, so there is no cost page: the cost teaser links the
// hub's "priced after a visit" section and carries no numbers.

export default {
  slug: 'whole-home-renovation',
  breadcrumb: 'Whole Home Renovation',
  badge: 'Full Home Renovation Contractor in Winnipeg',
  title: 'WHOLE HOME RENOVATIONS',
  titleHighlight: 'IN WINNIPEG',
  subtitle:
    'We plan and build whole home renovations in Winnipeg and nearby communities: layout, kitchen, bathrooms, flooring, paint, wiring and plumbing, under one schedule and one written scope. Most take eight to sixteen weeks.',
  heroPoints: ['Free on-site visit', 'Room-by-room written scope', 'Weekly progress updates'],

  stats: [
    { num: '60', unit: '+', label: 'Years of combined experience' },
    { num: '100', unit: '+', label: 'Projects completed across Winnipeg' },
    { num: '8', unit: '–16', label: 'Weeks for most whole home renovations' },
    { num: '1', unit: 'day', label: 'Reply within one business day' },
  ],

  intro: {
    tag: 'Why a whole home renovation?',
    title: 'Everything gets touched, so everything has to match',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Modern two-storey house at dusk with dark wood cladding and large glass walls',
    floatingTitle: 'One Plan, Start to Finish',
    floatingText: 'One schedule and one scope, instead of juggling five contractors yourself.',
    paragraphs: [
      'A whole home renovation is the one job where the details really have to agree with each other. The floor in the hallway has to meet the kitchen right. The trim in the living room has to match the bedrooms. When five different contractors handle five different rooms, that’s where things go sideways.',
      'We take on the whole house so that doesn’t happen: one schedule, one set of materials, and trades coordinated so each one knows what the next needs. You get a progress update every week, so you always know what’s happening and what’s coming up.',
      'Whole home projects can run in stages so you can stay in the house where possible. If you’d rather we go all at once and get out faster, we can plan it that way too — it’s your call, and we’ll be straight with you about what each option costs you in time.',
    ],
    checklist: ['Open-Concept Layouts', 'Kitchens & Baths', 'Flooring Throughout', 'Paint & Trim'],
  },

  includes: {
    tag: 'What’s Included',
    title: 'What does a whole home renovation include?',
    desc: 'A whole home renovation usually covers the layout, the kitchen, every bathroom, flooring throughout, paint, trim and doors, plus the electrical and plumbing the new plan needs. Your list may be shorter or longer. We write the scope room by room after the on-site visit, so you can see exactly what is in it before work begins.',
    items: [
      { num: '01', title: 'Layout & Walls', text: 'Opening up living areas, moving or removing non-structural walls, and framing new rooms where you need them.' },
      { num: '02', title: 'Kitchen', text: 'Full kitchen build — cabinets, counters, backsplash, appliance fit, plus the plumbing and electrical behind it all.' },
      { num: '03', title: 'Bathrooms', text: 'Every bath in the house brought up to the same standard, with proper waterproofing under the tile.' },
      { num: '04', title: 'Flooring', text: 'One continuous flooring plan across the main level so rooms flow instead of stopping at every doorway.' },
      { num: '05', title: 'Paint, Trim & Doors', text: 'New baseboards, casings, interior doors, and a full repaint so the finish is consistent room to room.' },
      { num: '06', title: 'Electrical & Plumbing', text: 'Updated wiring, lighting, and plumbing runs where the old ones aren’t up to what the new layout needs.' },
    ],
  },

  typesTag: 'Project Types',
  typesTitle: 'Which kind of whole house renovation fits your home?',
  typesDesc:
    'Whole home work tends to follow one of a few patterns: a complete home renovation of every room, a main-floor renovation, an interior renovation of selected rooms, or bringing an older house up to date while the walls are open. The right one depends on what the house needs and how long you can live with work underway.',
  types: [
    { title: 'Complete home renovation', text: 'Every room planned together and built in stages or all at once, so floors, trim and finishes match from the front door to the back bedroom.' },
    { title: 'Main-floor & open-concept', text: 'Opening the kitchen, dining and living rooms into one space. A load-bearing wall needs a beam and a building permit, and both are planned before demolition.' },
    { title: 'Interior renovation', text: 'Selected rooms brought to one standard: living room, bedrooms, laundry room or mudroom, with new flooring, lighting, doors and paint.' },
    { title: 'Older home updates', text: 'With the walls open on an older house, it’s the right moment to replace outdated wiring and plumbing, add insulation, and have suspect materials tested for asbestos.' },
    { title: 'Renovating before you move in', text: 'Just bought a house? Work goes faster through empty rooms, so renovating before move-in can shorten the job. We plan the scope around your possession date.' },
    { title: 'Staged renovation while you live there', text: 'Work done in sections, with a kitchen and a bathroom kept usable as long as possible, so you can stay in the house through most of the project.' },
  ],

  local: {
    tag: 'In Winnipeg',
    title: 'Which permits does a whole home renovation need in Winnipeg?',
    intro:
      'Usually several. Creating a new bedroom requires a building permit, and the City of Winnipeg says kitchens, bathrooms, open-concept layouts and new or larger exterior openings may need one. Electrical and plumbing work may need trade permits, and some structural changes need an engineer’s sealed drawing. We coordinate the full set with the City or your local municipality.',
    items: [
      { title: 'Building permit triggers', text: 'Since February 2026, the Winnipeg Building By-law requires a building permit to create a new bedroom or finish an undeveloped level. The City’s examples of renovations that may need one include kitchens, bathrooms, open-concept living spaces, and new or larger exterior door and window openings. Cosmetic changes do not.' },
      { title: 'Insulation and siding changes', text: 'Under amendments adopted in February 2026, the Winnipeg Building By-law requires a building permit to alter the building envelope: for example, adding rigid foam insulation to a wall assembly, or replacing stucco with vinyl siding.' },
      { title: 'Structural work and engineering', text: 'Where a structural element goes beyond Part 9 of the Manitoba Building Code, the City requires a sealed drawing from a professional engineer registered in Manitoba and a sealed Professional Designer’s Certificate for Housing.' },
      { title: 'Electrical and plumbing permits', text: 'Rewiring, new circuits, moved fixtures and new drain lines are trade work. The City notes that many projects need electrical and plumbing permits separate from the building permit.' },
      { title: 'Inspections at each stage', text: 'Rough-in inspections happen before framing, HVAC, electrical or plumbing work under a permit is covered, and a final inspection closes each permit. The City expects a complete set of plans on site throughout construction.' },
      { title: 'Asbestos in older homes', text: 'Health Canada says that before 1990, asbestos was mainly used for insulating buildings and homes, and lists plaster, drywall, floor tiles and pipe insulation among older materials that may contain it. It advises having a professional test for asbestos before renovating, and leaving vermiculite insulation undisturbed.' },
    ],
    sources: [
      { label: 'City of Winnipeg: Home renovations', url: 'https://www.winnipeg.ca/building-development/building-renovating/home-improvement-projects/home-renovations', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Information Bulletin 2026-007-B, Building permit requirements for housing', url: 'https://www.winnipeg.ca/media/6116', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Information Bulletin 2026-013-B/S, Engineering requirements for housing', url: 'https://www.winnipeg.ca/media/6133', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Housing inspections', url: 'https://www.winnipeg.ca/building-development/building-renovating/inspections/housing-inspections', accessed: '2026-10-13' },
      { label: 'Health Canada: Health risks of asbestos', url: 'https://www.canada.ca/en/health-canada/services/air-quality/indoor-air-contaminants/health-risks-asbestos.html', accessed: '2026-10-13' },
    ],
  },

  gallery: {
    tag: 'Design Ideas',
    title: 'Whole Home Renovation Ideas',
    desc: 'Inspiration photos, not Bridgeland projects. Photos from our own Winnipeg jobs will replace these as each project is documented.',
    items: [
      { img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80', alt: 'Bright living room with a tan leather sofa, white armchairs, and large windows', title: 'Bright Living Room', text: 'Large windows, light wood floors, and a wall of framed photos' },
      { img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80', alt: 'Person cooking at a gas cooktop in a white kitchen with a stone island and built-in wall oven', title: 'White Kitchen with Island Cooktop', text: 'Flat-panel cabinets, stone counters, and a built-in wall oven' },
      { img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80', alt: 'Living room with a grey sofa, wood coffee table, wood floors, and floor-to-ceiling windows', title: 'Warm Wood & Neutrals', text: 'Wood floors, a grey sofa, and floor-to-ceiling corner windows' },
    ],
  },

  process: {
    tag: 'How It Works',
    title: 'From First Visit to Final Clean',
    desc: 'Four steps, and you’ll know where the project stands at every one of them.',
    steps: [
      { num: '01', title: 'On-Site Visit', text: 'We come to the house, look at every room with you, and listen to what’s working and what isn’t. Bring your wish list — no idea is too big to talk about.' },
      { num: '02', title: 'Plan & Quote', text: 'You get a written scope, room by room, with what’s included and what it costs. Nothing starts until you’ve read it and you’re happy with it.' },
      { num: '03', title: 'Build', text: 'Demo, framing, mechanical, then finishes — in that order, on a schedule you can see. We keep the site clean, send a progress update every week, and tell you before anything noisy or disruptive happens.' },
      { num: '04', title: 'Walkthrough & Handover', text: 'We walk the whole house with you and fix anything on your list before we call it done. Then we clean up and get out of your way.' },
    ],
  },

  // Real client testimonial (confirmed by the owner 2026-10-13).
  testimonial: {
    quote:
      '“We had our whole main floor redone and honestly expected it to be a nightmare. It wasn’t. The crew showed up when they said they would, the site was swept every single night, and when we changed our minds about the flooring halfway through they just sorted it out. The house finally feels like ours.”',
    initial: 'S',
    name: 'Sandra K.',
    role: 'Homeowner, Whole Home Renovation',
  },

  faqs: [
    { q: 'How long does a whole home renovation take?', a: 'Most run eight to sixteen weeks, depending on the size of the house and how much of it is being renovated. You get a schedule with your written quote, and if something shifts we tell you the same week in your progress update, not at the end of the job.' },
    { q: 'Can we stay in the house while you work?', a: 'Often, yes, if we stage the work in sections and keep a kitchen and a bathroom usable for you. Sometimes it’s faster and simpler to move out for a few weeks. We lay out both options at the on-site visit, with what each means for the schedule, and let you decide.' },
    { q: 'Who handles the permits and inspections?', a: 'We coordinate them. Where the work needs building, electrical or plumbing permits from the City of Winnipeg or your local municipality, we arrange the applications and schedule the inspections at each stage. If structural changes need an engineer’s sealed drawing, we build that step into the schedule before demolition starts.' },
    { q: 'Do I pick the materials, or do you?', a: 'You do; we help narrow it down. We bring options that fit your budget and hold up over time, and you choose from there. If you’d rather hand most of the decisions to us, that works too. Either way, every selection is written into the scope before anything is ordered.' },
    { q: 'What happens if you find something unexpected behind a wall?', a: 'It happens in older homes: outdated wiring, water damage, sometimes a wall carrying more load than it should. Ask at the on-site visit how anything found behind the walls would be handled and priced, and keep a contingency for it. Suspect materials such as old vermiculite insulation are left undisturbed until a professional has tested them.' },
    { q: 'Should we renovate all at once or in stages?', a: 'All at once is usually faster and keeps the disruption to one period, but you may need to move out for part of it. In stages, you live in the house while sections are finished one by one, which takes longer overall. We set out both options and their timelines at the on-site visit.' },
    { q: 'How will we know what’s happening each week?', a: 'You get a progress update every week: what was finished, what’s next, any decisions we need from you, and anything that has changed. If something affects the schedule, you hear about it that week. Questions between updates are welcome by phone at 431-866-5644 or email during business hours.' },
  ],

  // Title, meta description and Service schema for this page. `updated`
  // feeds the sitemap lastmod and WebPage dateModified: bump it only when the
  // page content really changes.
  seo: {
    title: 'Whole Home Renovations Winnipeg | Bridgeland Builders',
    description:
      'Whole home renovations in Winnipeg under one plan and one written scope: layout, kitchen, baths, flooring and paint. Most take 8–16 weeks. Free visit.',
    serviceType: 'Whole home renovation',
    primaryKeyword: 'whole home renovation Winnipeg',
    updated: '2026-10-14',
  },

  // No whole-home cost page (the estimator has no whole-home data), so the
  // teaser points to the cost hub's "priced after a visit" section. No numbers.
  costTeaser: {
    text: 'Whole home renovations are priced in a free written quote after an on-site visit, not from a few online questions, because no two houses need the same scope. Our Winnipeg cost guide shows the starting ranges for kitchens, bathrooms and basements, and what moves the price.',
    to: '/renovation-cost-winnipeg#priced-after-a-visit',
    label: 'Renovation costs in Winnipeg',
  },
  // Live pages only are shown; drafts appear when they launch.
  related: ['/services/kitchen-renovations', '/services/bathroom-renovations', '/services/home-additions', '/services/general-contracting', '/services/flooring', '/services/demolition'],
  guides: ['renovating-a-character-home-in-winnipeg', 'how-to-choose-between-a-full-renovation-and-partial-upgrades', 'home-renovation-planning-guide-canada'],
  ownerSignoff: null,
};
