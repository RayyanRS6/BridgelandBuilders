// Flooring — content for /services/flooring (rendered by src/pages/ProjectPage.jsx).
// Registry entry (path, labels, status, estimator, form type): src/data/services.js.
//
// No intro, gallery or testimonial: there are no real job photos or reviews
// for this service yet, and stock photos are never shown as our work.
// Every rule and guideline in `local` and `faqs` was checked against the page
// listed in local.sources on 2026-10-13. Owner sign-off (signoff) is still to be added.

const ACCESSED = '2026-10-13';

export default {
  slug: 'flooring',
  // Used in running text ("Let’s talk about your …", "before booking a …").
  breadcrumb: 'Flooring Project',
  badge: 'Homes, Basements & Commercial Spaces',
  title: 'FLOORING INSTALLATION',
  titleHighlight: 'IN WINNIPEG',
  subtitle:
    'We take up old flooring, prepare the subfloor and install new floors in Winnipeg homes, basements and commercial spaces. Most flooring problems start underneath, so we check level, moisture and the subfloor first. Every job starts with a free on-site visit and a free written quote.',
  heroPoints: ['Free on-site visit', 'Subfloor checked first', 'Removal, prep and trim included'],

  stats: [
    { num: '60', unit: '+', label: 'Years of combined experience' },
    { num: '100', unit: '+', label: 'Projects completed' },
    { num: '$0', unit: '', label: 'On-site visit & written quote' },
    { num: '1', unit: 'day', label: 'Reply within one business day' },
  ],

  intro: null,

  includes: {
    tag: 'What’s Included',
    title: 'What does a flooring installation include?',
    desc: 'Everything from the old floor to the last piece of trim. A full installation covers removing the existing flooring, checking the subfloor for level, moisture and movement, repairing or levelling it, laying the new floor over the right underlayment, and fitting the transitions and baseboards so every room finishes cleanly.',
    items: [
      { num: '01', title: 'Removal', text: 'Old carpet, tile, vinyl or wood taken up and hauled away, with older tile and adhesive tested first if needed.' },
      { num: '02', title: 'Subfloor Check', text: 'Squeaks, soft spots, dips and humps marked, and concrete checked for moisture, before new material is ordered.' },
      { num: '03', title: 'Prep & Levelling', text: 'Loose sheathing fastened, damaged sections replaced and low spots levelled, so the new floor sits flat.' },
      { num: '04', title: 'Underlayment', text: 'The right underlayment or membrane for the floor and the room, including moisture control on basement concrete.' },
      { num: '05', title: 'Installation', text: 'Flooring laid to the manufacturer’s instructions, including the expansion gaps floating floors need.' },
      { num: '06', title: 'Trim & Transitions', text: 'Baseboards, thresholds and transition strips fitted so the new floor meets doors and other rooms neatly.' },
    ],
  },

  typesTag: 'Flooring Types',
  typesTitle: 'Which flooring works where?',
  typesDesc:
    'Choose for the room’s conditions first and the look second. Kitchens, bathrooms and entries need water resistance, basements need products rated for concrete below grade, and busy commercial floors need a wear rating that matches the traffic. We recommend options for each room at the on-site visit, and you choose.',
  types: [
    { title: 'Luxury Vinyl Plank & Tile', text: 'Water-resistant and comfortable underfoot, which makes it a practical choice for kitchens, basements and busy family areas.' },
    { title: 'Laminate', text: 'A hard-wearing, budget-friendly wood look for living areas and bedrooms. Keep it away from standing water.' },
    { title: 'Engineered & Solid Hardwood', text: 'Real wood for main floors. Engineered boards cope with seasonal humidity swings better than solid wood, and some products are rated for concrete.' },
    { title: 'Tile', text: 'Porcelain and ceramic tile for bathrooms, entries and kitchens, set on a flat, stiff base so the tile and grout don’t crack.' },
    { title: 'Basement Floors', text: 'Products rated for below-grade concrete, installed over a moisture-control layer where the slab calls for one.' },
    { title: 'Commercial Flooring', text: 'Commercial flooring renovation for offices, clinics, shops and restaurants, phased or scheduled after hours so you can stay open.' },
  ],

  local: {
    tag: 'In Winnipeg',
    title: 'What should you check before new flooring goes down?',
    intro:
      'Three things: the subfloor, moisture and what is in the old floor. In Winnipeg, flooring on its own doesn’t need a building permit, but basement slabs need a moisture check first and older tile or adhesive may need an asbestos test before it is torn out. Here is what the official guidance says.',
    items: [
      { title: 'No Permit for Flooring Alone', text: 'The City of Winnipeg treats flooring as a cosmetic change with no building permit. A basement development or larger renovation around it may need one.' },
      { title: 'Test the Basement Slab', text: 'Natural Resources Canada suggests taping plastic about 1 m square to the slab. Condensation under it means moisture is rising from the ground; on top, humid indoor air.' },
      { title: 'Fix Water Before Finishing', text: 'NRCan says persistent leaks and spring flooding must be corrected first. A moisture barrier or sealer on the slab helps with comfort, moisture control and radon reduction.' },
      { title: 'Give New Concrete Time', text: 'In a new house, or one with a new basement, NRCan advises allowing about a year for the concrete to dry before renovating.' },
      { title: 'Older Tile and Adhesive', text: 'Health Canada lists older floor tiles among materials that may contain asbestos. Manitoba’s workplace safety rules treat suspect material as asbestos until testing shows otherwise.' },
      { title: 'Commercial Spaces', text: 'Flooring in a commercial alteration falls under that project’s permit and inspections, and can be scheduled after hours so you stay open.' },
    ],
    sources: [
      { label: 'City of Winnipeg: home renovations', url: 'https://www.winnipeg.ca/building-development/building-renovating/home-improvement-projects/home-renovations', accessed: ACCESSED },
      { label: 'Natural Resources Canada: Keeping the Heat In, basement insulation', url: 'https://natural-resources.canada.ca/energy-efficiency/home-energy-efficiency/keeping-heat-section-6-basement-insulation-floors-walls-crawl-spaces', accessed: ACCESSED },
      { label: 'Health Canada: health risks of asbestos', url: 'https://www.canada.ca/en/health-canada/services/air-quality/indoor-air-contaminants/health-risks-asbestos.html', accessed: ACCESSED },
      { label: 'Manitoba Workplace Safety and Health: asbestos FAQs', url: 'https://www.gov.mb.ca/labour/safety/faq/asbestos.html', accessed: ACCESSED },
      { label: 'City of Winnipeg: commercial building inspections', url: 'https://www.winnipeg.ca/building-development/inspections/commercial/building', accessed: ACCESSED },
    ],
  },

  gallery: null,

  process: {
    tag: 'How It Works',
    title: 'From Measuring to Finished Floor',
    desc: 'The subfloor is checked before flooring is ordered, so surprises turn up early. On longer jobs you get a progress update every week.',
    steps: [
      { num: '01', title: 'On-Site Visit', text: 'We measure the rooms, check the subfloor and, on concrete, the moisture, and talk through flooring options for each space. The visit is free.' },
      { num: '02', title: 'Written Quote', text: 'A free written quote covering removal, subfloor prep, underlayment, flooring, trim and transitions, so you can see exactly what is included.' },
      { num: '03', title: 'Prep & Install', text: 'Old floor out, subfloor repaired and levelled, then underlayment and flooring installed. Acclimatizing time is built into the schedule.' },
      { num: '04', title: 'Finish & Walkthrough', text: 'Trim and transitions fitted, the rooms cleaned, and a walkthrough with you to check every room before we call it done.' },
    ],
  },

  testimonial: null,

  faqsTitle: 'Flooring Questions',
  faqs: [
    { q: 'Can new flooring go over my existing floor?', a: 'Sometimes. A floating floor can often go over sound, flat flooring, but layering raises the floor height at doors and transitions and can hide problems underneath. Tile, glue-down and soft or uneven floors usually need to come up. We check at the on-site visit and tell you which approach your rooms need.' },
    { q: 'What flooring suits a Winnipeg basement?', a: 'Pick a product rated for below-grade concrete, such as luxury vinyl plank or tile, and plan moisture control under it. Solid hardwood is a poor fit for a basement slab. Test the slab for moisture before you choose, and fix any water problem first, because no flooring survives a wet basement.' },
    { q: 'How long does flooring installation take?', a: 'It depends on the area, how much old flooring has to come up, how much subfloor repair and levelling the rooms need, and whether the product has to acclimatize first. Removal and prep can take as long as laying the new floor. Ask us at the on-site visit about the schedule for your rooms.' },
    { q: 'Should I worry about asbestos in old floor tiles?', a: 'If the tiles or adhesive went down before 1990, test before removing them. Health Canada lists older floor tiles among materials that may contain asbestos, and the risk comes from disturbing them. Manitoba’s workplace rules treat suspect material as asbestos until testing shows otherwise, and asbestos has to be removed before other work disturbs it.' },
    { q: 'How much does flooring installation cost?', a: 'Price depends on the area, the flooring you choose, how much old flooring has to come up, and how much subfloor repair or levelling the rooms need. The on-site visit and written quote are free, and the quote separates removal, preparation and installation so you can compare it with others.' },
  ],

  // Title, meta description and Service schema for this page. `updated`
  // feeds the sitemap lastmod and WebPage dateModified: bump it only when the
  // page content really changes.
  seo: {
    title: 'Flooring Installation Winnipeg | Bridgeland Builders',
    description:
      'Flooring installation in Winnipeg for homes, basements and commercial spaces: removal, subfloor prep and clean trim. Free on-site visit and written quote.',
    serviceType: 'Flooring installation',
    primaryKeyword: 'flooring installation Winnipeg',
    updated: '2026-10-13',
  },

  // Optional sections (plan §7): see kitchen-renovations.js for the shapes.
  // No cost page for this service (no Bridgeland price data), so no teaser.
  costTeaser: null,
  // Live pages only are shown; drafts appear when they launch.
  related: ['/services/basement-renovations', '/services/kitchen-renovations', '/services/whole-home-renovations', '/services/commercial-renovations'],
  // Unpublished slugs are skipped by ServiceRoute until the post goes live.
  guides: ['radon-testing-before-finishing-a-basement', 'basement-flood-protection-winnipeg', 'planning-a-winter-basement-development-winnipeg'],
  signoff: null,
};
