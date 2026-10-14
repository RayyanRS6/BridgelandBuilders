// Demolition — content for /services/demolition (rendered by src/pages/ProjectPage.jsx).
// Registry entry (path, labels, status, estimator, form type): src/data/services.js.
//
// Scope: interior and selective demolition (strip-outs) in homes and
// commercial spaces only. No whole-building, structural or exterior demolition
// claims: in Winnipeg those need a demolition permit and a City-licensed
// demolition contractor. No asbestos abatement claims either.
// No intro, gallery or testimonial: there are no real job photos or reviews
// for this service yet, and stock photos are never shown as our work.
// Every rule in `local` and `faqs` was checked against the page listed in
// local.sources on 2026-10-13. Owner sign-off (ownerSignoff) is still to be added.

const ACCESSED = '2026-10-13';

export default {
  slug: 'demolition',
  // Used in running text ("Let’s talk about your …", "before booking a …").
  breadcrumb: 'Demolition Project',
  badge: 'Strip-Outs for Homes & Businesses',
  title: 'INTERIOR DEMOLITION',
  titleHighlight: 'IN WINNIPEG',
  subtitle:
    'We strip out kitchens, bathrooms, basements and commercial interiors so the next stage of your renovation starts clean, with dust control, haul-away, and older materials checked before anything comes down. Every job starts with a free on-site visit and a free written quote.',
  heroPoints: ['Free on-site visit', 'Older materials checked first', 'Debris hauled away'],

  stats: [
    { num: '60', unit: '+', label: 'Years of combined experience' },
    { num: '100', unit: '+', label: 'Projects completed' },
    { num: '$0', unit: '', label: 'On-site visit & written quote' },
    { num: '1', unit: 'day', label: 'Reply within one business day' },
  ],

  intro: null,

  includes: {
    tag: 'What’s Included',
    title: 'What does interior demolition include?',
    desc: 'Controlled removal, not smashing. We protect the parts of the building that stay, have water, power and gas in the work area made safe by the right trades, take out finishes and fixtures in a planned order, haul the debris away, and leave the space broom-clean for the next stage.',
    items: [
      { num: '01', title: 'Protection', text: 'Floors, stairs and doorways covered, and the work area sealed off to contain dust.' },
      { num: '02', title: 'Services Made Safe', text: 'Water, power and gas in the work area shut off and capped by the right trades first.' },
      { num: '03', title: 'Hazard Check', text: 'In older buildings, suspect materials such as old tile, plaster or insulation tested before they are disturbed.' },
      { num: '04', title: 'Selective Removal', text: 'Cabinets, fixtures, flooring, drywall and non-structural walls taken out in a planned order.' },
      { num: '05', title: 'Haul-Away', text: 'Debris loaded out and hauled away as the work goes, not left piled up on site.' },
      { num: '06', title: 'Clean & Ready', text: 'The space left broom-clean, with framing, floors and services exposed for the next trades.' },
    ],
  },

  typesTag: 'Project Types',
  typesTitle: 'What kind of demolition do we do?',
  typesDesc:
    'Interior and selective demolition: strip-outs ahead of a renovation in homes and commercial spaces. That covers kitchens, bathrooms, basements, non-structural walls and full commercial interiors. We don’t take on whole-building demolition, which in Winnipeg needs a demolition permit and an applicant who holds a City demolition contractor licence.',
  types: [
    { title: 'Kitchen & Bathroom Strip-Outs', text: 'Cabinets, counters, fixtures, tile and drywall removed down to the studs, or just the parts being replaced.' },
    { title: 'Basement Strip-Outs', text: 'Old panelling, framing, ceilings and flooring removed, so the walls and floor can be checked before rebuilding.' },
    { title: 'Non-Structural Walls', text: 'Partition walls taken out to open up a layout. Load-bearing walls need a beam and a permit, so they belong to the renovation plan.' },
    { title: 'Commercial Strip-Outs', text: 'A previous tenant’s walls, ceilings, flooring and fixtures removed for the new layout, with evenings and weekends available.' },
    { title: 'Flooring & Tile Removal', text: 'Old tile, hardwood, vinyl and adhesive taken up, with older materials tested first.' },
    { title: 'Selective Removal', text: 'Only what has to go comes out; the finishes and fixtures you keep are protected.' },
  ],

  local: {
    tag: 'In Winnipeg',
    title: 'Do you need a permit for interior demolition in Winnipeg?',
    intro:
      'Not a demolition permit, if you are only removing interior components. The City of Winnipeg says applications that only remove interior building components, such as walls and partitions, are not demolitions. The renovation itself may still need a building permit, and older materials must be assessed before anything is disturbed.',
    items: [
      { title: 'Interior Removal Isn’t Demolition', text: 'According to the City, removing interior components such as walls and partitions needs no demolition permit or licensed demolition contractor.' },
      { title: 'The Renovation May Need a Permit', text: 'Kitchens, bathrooms and open-concept changes can need a building permit, and commercial alterations need one before work starts. We coordinate permits and inspections.' },
      { title: 'Asbestos Comes First', text: 'Under Manitoba’s workplace safety rules, where asbestos is suspected, a competent person inspects the area, and asbestos that will be disturbed is removed before demolition starts.' },
      { title: 'Buildings From Before 1990', text: 'The Province says asbestos was used in buildings built or renovated before 1990. Health Canada lists tiles, plaster, drywall and insulation among materials that may contain it.' },
      { title: 'Lead Paint', text: 'Health Canada says homes built before 1960 probably contain lead-based paint, and advises against sanders, heat guns and blowlamps on it.' },
      { title: 'Notice for Asbestos Work', text: 'Work that may release asbestos fibres has to be reported to Manitoba Workplace Safety and Health before it starts.' },
    ],
    sources: [
      { label: 'City of Winnipeg: demolition contractor information', url: 'https://www.winnipeg.ca/building-development/building-renovating/trade-information-contractor-licensing/contractor-licensing/demolition-contractor-information', accessed: ACCESSED },
      { label: 'City of Winnipeg: home renovations', url: 'https://www.winnipeg.ca/building-development/building-renovating/home-improvement-projects/home-renovations', accessed: ACCESSED },
      { label: 'City of Winnipeg: commercial building inspections', url: 'https://www.winnipeg.ca/building-development/inspections/commercial/building', accessed: ACCESSED },
      { label: 'Manitoba Workplace Safety and Health: asbestos FAQs', url: 'https://www.gov.mb.ca/labour/safety/faq/asbestos.html', accessed: ACCESSED },
      { label: 'Health Canada: health risks of asbestos', url: 'https://www.canada.ca/en/health-canada/services/air-quality/indoor-air-contaminants/health-risks-asbestos.html', accessed: ACCESSED },
      { label: 'Health Canada: lead-based paint', url: 'https://www.canada.ca/en/health-canada/services/home-safety/lead-based-paint.html', accessed: ACCESSED },
    ],
  },

  gallery: null,

  process: {
    tag: 'How It Works',
    title: 'From Walkthrough to Clean Shell',
    desc: 'Demolition sets up everything that follows, so it is planned with the rebuild in mind. On longer jobs you get a progress update every week.',
    steps: [
      { num: '01', title: 'On-Site Visit', text: 'We walk the space with you, mark what stays and what goes, and ask about the building’s age and earlier renovations. The visit is free.' },
      { num: '02', title: 'Quote & Testing', text: 'A free written quote for removal and haul-away. If older materials need testing, that happens before demolition is scheduled.' },
      { num: '03', title: 'Strip-Out', text: 'Protection up and services made safe, then removal in a planned order, with debris hauled out as the work goes.' },
      { num: '04', title: 'Clean Handover', text: 'The space left broom-clean for inspection or the next trades, with a walkthrough to confirm everything on the list is out.' },
    ],
  },

  testimonial: null,

  faqsTitle: 'Demolition Questions',
  faqs: [
    { q: 'Do you demolish whole buildings?', a: 'No. We do interior and selective demolition ahead of a renovation. In Winnipeg, demolishing a building or part of one needs a demolition permit, and the City requires the applicant to hold a demolition contractor licence. For a whole building, hire a licensed demolition contractor.' },
    { q: 'Can you remove a wall to open up my kitchen?', a: 'Yes, as part of a renovation. A non-structural partition can come out with the rest of the demolition. A load-bearing wall needs a beam and a building permit, so it is planned with the renovation rather than treated as stand-alone demolition. We tell you at the on-site visit which kind of wall you have.' },
    { q: 'What happens if asbestos is found?', a: 'Work in that area stops until it is dealt with. Manitoba’s rules require asbestos that will be disturbed to be removed before demolition or alteration starts, and that removal is specialist work. Testing older materials before the strip-out is scheduled avoids a stop in the middle of the job.' },
    { q: 'How do you keep dust out of the rest of the building?', a: 'The work area is sealed off with plastic barriers, floors and paths to the door are covered, and debris goes out by the shortest route. In occupied homes and businesses that stay open, the messiest work is planned for the times that disturb you least.' },
    { q: 'Can you strip out a commercial space while we stay open?', a: 'Often, yes. Strip-outs can be scheduled after hours or on weekends, with the work area sealed off from the rest of the space and debris taken out on an agreed route. On longer jobs you get a progress update every week, so you know what is coming next.' },
    { q: 'How much does interior demolition cost?', a: 'It depends on how much is coming out, how it was built, access for hauling debris, and whether older materials need testing. The on-site visit and written quote are free. When demolition is the first stage of a larger renovation with us, it is part of that project’s quote.' },
  ],

  // Title, meta description and Service schema for this page. `updated`
  // feeds the sitemap lastmod and WebPage dateModified: bump it only when the
  // page content really changes.
  seo: {
    title: 'Interior Demolition Winnipeg | Bridgeland Builders',
    description:
      'Interior demolition in Winnipeg: kitchen, bathroom, basement and commercial strip-outs with dust control and haul-away. Free on-site visit and quote.',
    serviceType: 'Interior demolition',
    // Add to scripts/keyword-map.json (not there yet).
    primaryKeyword: 'interior demolition Winnipeg',
    updated: '2026-10-14',
  },

  // Optional sections (plan §7): see kitchen-renovations.js for the shapes.
  // No cost page for this service (no Bridgeland price data), so no teaser.
  costTeaser: null,
  // Live pages only are shown; drafts appear when they launch.
  related: ['/services/kitchen-renovations', '/services/bathroom-renovations', '/services/basement-renovations', '/services/commercial-renovations'],
  // Unpublished slugs are skipped by ServiceRoute until the post goes live.
  guides: ['winnipeg-renovation-permits', 'how-to-prepare-your-business-for-a-major-renovation', 'renovating-a-character-home-in-winnipeg'],
  ownerSignoff: null,
};
