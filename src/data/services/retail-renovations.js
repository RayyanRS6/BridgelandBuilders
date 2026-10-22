// Retail renovations — content for /services/retail-renovations (rendered by src/pages/ProjectPage.jsx).
// Registry entry (path, labels, status, estimator, form type): src/data/services.js.
// Brief (plan §7): store layouts, storefronts, opening dates, after-hours work.
//
// The intro image is a stock inspiration photo, not a Bridgeland job: keep its
// alt to what is visible. No gallery or testimonial until real, consented job
// photos and quotes exist. Truth rules: no job counts, no named stores or past
// projects, no licence/insurance/WCB/warranty claims, no commercial timelines
// or prices. Every rule in `local` was checked against the official page in its
// sources list on 2026-10-13; the "Outside Winnipeg" authorities against the
// Province's ITS permits page on 2026-10-15.

import { EXPERIENCE_YEARS, OFFICE_DAYS_TEXT, PROJECT_COUNT, REPLY_TIME } from '../facts.js';
import { NEARBY_AREAS_TEXT_OR } from '../areas.js';

export default {
  slug: 'retail-renovations',
  breadcrumb: 'Retail Renovation',
  badge: 'Stores, Showrooms & Storefronts',
  title: 'RETAIL RENOVATIONS',
  titleHighlight: 'IN WINNIPEG',
  subtitle:
    'We renovate retail stores, showrooms and storefronts in Winnipeg and nearby communities, planned around your opening date and the hours you trade. Much of the work can happen after close and on weekends.',
  heroPoints: ['Free site visit & written quote', 'After-hours & weekend scheduling', 'Weekly progress updates'],

  stats: [
    { num: String(EXPERIENCE_YEARS), unit: '+', label: 'Years of combined experience' },
    { num: String(PROJECT_COUNT), unit: '+', label: 'Projects completed' },
    { num: '1', unit: '×', label: 'Progress update every week' },
    { num: '1', unit: 'day', label: `Reply within ${REPLY_TIME}` },
  ],

  intro: {
    tag: 'Why Bridgeland for your store?',
    title: 'What does a retail renovation involve?',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Open meeting area with a long wood table, pink chairs, and floor-to-ceiling windows',
    floatingTitle: 'Opening Day First',
    floatingText: 'The schedule starts from your opening date and works backwards.',
    paragraphs: [
      'A retail renovation reshapes [how customers move through a store](/blog/how-to-balance-functionality-and-aesthetics-in-a-commercial-space): the entrance and storefront, the sales floor, fitting rooms, the cash area, the stockroom and staff spaces, plus the lighting, power and finishes that tie them together. In a new lease it’s usually called a fit-out, and work regulated by the building code needs a City of Winnipeg building permit.',
      'In retail, the opening date is usually fixed before the build starts: a lease commencement, a season or a launch you’ve already advertised. We plan backwards from that date and tell you at the site visit whether it’s realistic, and what would need to change if it isn’t.',
      'If you’re renovating a store that’s already trading, we phase the sales floor and schedule the loud work outside your hours, within the City’s noise limits near homes. Weekly progress updates let you plan stock, staffing and promotions around what’s finished.',
      'Brand standards and head-office fit-out packages are welcome. [We build to supplied drawings and specifications](/services/general-contracting) from your designer, your landlord or your head office, and flag anything on site that conflicts with them before it turns into a change order.',
    ],
    checklist: ['Store Layouts', 'Storefronts & Entrances', 'Fitting Rooms & Cash Areas', 'Lighting & Displays'],
  },

  includes: {
    tag: 'What’s Included',
    title: 'What a Retail Renovation Covers',
    desc: 'Scoped around your opening date, your brand, and the hours you need to keep trading.',
    items: [
      { num: '01', title: 'Site Visit & Scope', text: 'Walking the unit with you and your lease or brand drawings, then [writing the scope and schedule into a free written quote](/our-process).' },
      { num: '02', title: 'Demolition & Layout', text: '[Clearing out the previous tenant’s fit-out](/services/demolition) and building the new floor plan: walls, bulkheads, stockroom and staff areas.' },
      { num: '03', title: 'Storefronts & Entrances', text: 'Entrance doors, storefront framing and finishes, with an accessible entrance planned in. Signs need their own City permit.' },
      { num: '04', title: 'Lighting & Power', text: 'Track and display lighting, power for cash desks and displays, and data where your point-of-sale and security systems need it.' },
      { num: '05', title: 'Fitting Rooms, Cash & Washrooms', text: 'Fitting rooms, cash counters and customer or staff washrooms built to the Manitoba Building Code, including accessible clearances.' },
      { num: '06', title: 'Finishes & Fixtures', text: '[Flooring](/services/flooring), wall finishes, slatwall and millwork installed to take daily foot traffic and frequent re-merchandising.' },
    ],
  },

  gallery: null,

  process: {
    tag: 'How It Works',
    title: 'From Empty Unit to Opening Day',
    desc: 'A schedule built backwards from your opening date, and an update every week.',
    steps: [
      { num: '01', title: 'Site Visit & Scope', text: 'We walk the store with you, look at your lease, brand drawings and trading hours, and note the dates that can’t move. The visit and the written quote are free.' },
      { num: '02', title: 'Quote & Schedule', text: 'A written quote and a schedule built around your hours and opening date, showing what happens after close and when, if ever, the store needs to shut.' },
      { num: '03', title: 'Permits & Build', text: 'We coordinate the building permit, then build in phases so as much of the store as possible keeps trading. You get an update every week.' },
      { num: '04', title: 'Inspections & Handover', text: 'Inspections passed, deficiencies cleared, and the store cleaned and ready for fixtures, stock and your opening day.' },
    ],
  },

  testimonial: null,

  faqsTitle: 'Retail Renovation FAQs',
  faqs: [
    { q: 'Can you renovate while the store stays open?', a: 'Often. We phase the sales floor, keep the work area closed off from customers, and schedule loud work outside your trading hours, within the City’s noise limits near homes. Some steps, like flooring at the entrance or a storefront change, may need a short closure; we’ll show those in the schedule so you can plan around them.' },
    { q: 'How long does a retail fit-out take?', a: 'It depends on the scope and the permit. A refresh of finishes in the same layout moves faster than a full fit-out with new walls, washrooms and services, which also waits on the City’s plan review. You get a schedule with your written quote, built backwards from your opening date, and an update every week.' },
    { q: 'Do I need a permit for a new store sign?', a: 'Yes. The City of Winnipeg says to get a permit before starting any construction or alteration to any part of a sign, and new internally lit signs need a separate electrical sign permit.\n\nIf a sign company is supplying your sign, confirm at the site visit who is applying for the permit so the storefront work and sign installation line up.' },
    { q: 'Can you work to our brand or head-office drawings?', a: 'Yes. We build to supplied drawings and specifications, whether they come from your designer, your landlord’s design criteria or a head-office fit-out package. We walk the unit against them before work starts and raise anything that won’t work on site before it becomes a change order or a delay.' },
    { q: 'Does a retail renovation need an occupancy permit?', a: 'Often. In Winnipeg, a new tenant establishing a use without a valid occupancy permit, or a tenant expanding into more space, generally needs one before opening.\n\nA new tenant moving into a space that already has a valid occupancy permit, with no alterations or change of use, generally does not. Ask your landlord what permit the unit has.', more: { label: 'Occupancy permits and change of use in Winnipeg', to: '/blog/occupancy-permit-change-of-use-winnipeg' } },
    { q: 'Do you renovate showrooms?', a: 'Yes. A commercial showroom renovation follows the same process as a store: a free site visit, a written quote and a schedule around your hours. Showrooms usually need more attention on lighting, power at display locations and flooring that can take heavy products, so bring your display plan to the site visit.' },
    { q: 'What happens after I get in touch?', a: `We reply within ${REPLY_TIME}, ${OFFICE_DAYS_TEXT}, and book a free on-site visit. We walk the unit with you, go through your dates and drawings, and then send a written quote with a schedule. Once work starts, you get a progress update every week until the store is handed over.` },
  ],

  // Title, meta description and Service schema for this page. `updated`
  // feeds the sitemap lastmod and WebPage dateModified: bump it only when the
  // page content really changes.
  seo: {
    title: 'Retail Renovations Winnipeg | Bridgeland Builders',
    description:
      'Retail store renovations and fit-outs in Winnipeg: layouts, storefronts, fitting rooms and finishes, built to your opening date with after-hours work.',
    serviceType: 'Retail renovation',
    audience: { '@type': 'BusinessAudience', audienceType: 'Retailers and commercial property owners' },
    primaryKeyword: 'retail renovation Winnipeg',
    updated: '2026-10-23',
  },

  typesTitle: 'Types of Retail Renovations',
  typesDesc: 'New stores, refreshes and everything in between.',
  types: [
    { title: 'New Store Fit-Out', text: 'A retail fit-out that turns an empty unit into your store, usually against a lease date, with the permits and occupancy permit before opening.' },
    { title: 'Store Refresh', text: 'New flooring, paint, lighting and fixtures in the layout you have, with much of the work possible after close so you keep trading.' },
    { title: 'Layout Changes', text: 'Moving the cash area, adding fitting rooms or opening up the sales floor to change how customers move through the store.' },
    { title: 'Storefront Renovation', text: 'Entrances, storefront framing, doors and exterior finishes that change how the store looks from the street. Downtown? Our [commercial renovation financing guide](/blog/how-to-finance-a-commercial-renovation-without-breaking-the-bank) explains the Storefront Success grant.' },
    { title: 'Showrooms', text: 'Showrooms for furniture, flooring, kitchens or equipment, with lighting and power planned around the products on display.' },
    { title: 'Mall & Strip-Mall Units', text: 'Units in enclosed malls and strip malls, where the landlord’s design criteria and work-hour rules shape the schedule.' },
  ],

  local: {
    title: 'What permits does a retail renovation need?',
    intro:
      'In Winnipeg, a store renovation needs a City building permit whenever the work is regulated by the Winnipeg Building By-law or the Manitoba Building Code, filed with the Commercial Alteration Design Summary. Substantial alterations and changes of use need an occupancy permit before customers come in, and new or altered signs need their own permit.',
    items: [
      { title: 'Building Permit', text: 'Store alterations go in with the City’s Commercial Alteration Design Summary. Changes to structure, exits or fire safety systems generally need an architect or engineer, so check that before plans are final.' },
      { title: 'Occupancy Permit', text: 'A new tenant establishing a use without a valid occupancy permit, or expanding into more space, generally needs one before opening. A new tenant in a space with a valid permit and no alterations generally does not.' },
      { title: 'Signs', text: 'The City says to get a permit before starting any construction or alteration to any part of a sign. New internally lit signs, or electrical changes to an existing sign, also need a separate electrical sign permit.' },
      { title: 'Accessibility', text: 'Manitoba adopted the 2020 National Building Code on January 1, 2024, with accessibility requirements aligned with CSA B651. Separately, Manitoba’s Accessible Customer Service Standard applies to every business with at least one employee.' },
      { title: 'Noise Near Homes', text: 'Loud work within 150 m of a home is allowed 7 a.m. to 9 p.m. on weekdays and 9 a.m. to 9 p.m. on weekends and holidays, so late-evening work near homes is limited to quieter tasks.' },
      { title: 'Outside Winnipeg', text: `In ${NEARBY_AREAS_TEXT_OR}, building, plumbing and occupancy permits come from the municipality, a planning district or the Province’s Inspection and Technical Services, depending on the location and whether the building falls under Part 3 or Part 9 of the Manitoba Building Code. We coordinate with whichever one applies.` },
    ],
    sources: [
      { label: 'City of Winnipeg: Commercial Alteration Design Summary (CADS) application, October 2025', url: 'https://www.winnipeg.ca/media/6330', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Occupancy permits', url: 'https://www.winnipeg.ca/building-development/building-renovating/commercial-projects/occupancy-permits', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Commercial sign inspections', url: 'https://www.winnipeg.ca/building-development/building-renovating/inspections/commercial/sign', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Construction in your neighbourhood', url: 'https://www.winnipeg.ca/building-development/property-records/construction-your-neighbourhood', accessed: '2026-10-13' },
      { label: 'Province of Manitoba: Manitoba Building Code updates, accessibility', url: 'https://www.gov.mb.ca/asset_library/en/labour/docs/its/accessibiity_requirement_updates.pdf', accessed: '2026-10-13' },
      { label: 'Manitoba Accessibility Office: Accessibility for business and non-profit', url: 'https://accessibilitymb.ca/business-and-non-profit/accessibility-for-business-and-non-profit.html', accessed: '2026-10-13' },
      { label: 'Province of Manitoba: Building permits and inspections (Inspection and Technical Services)', url: 'https://www.gov.mb.ca/labour/its/bldg_codes/permits_and_inspections.html', accessed: '2026-10-15' },
    ],
  },

  // Commercial cost page stays unpublished (no data, plan §8): the teaser
  // points to the cost hub's "priced after a visit" section. No numbers.
  costTeaser: {
    text: 'Retail renovations are priced in a free written quote after a site visit, once we know the scope and your opening date. Our Winnipeg cost guide explains what moves the price of a renovation.',
    to: '/renovation-cost-winnipeg#priced-after-a-visit',
    label: 'Renovation costs in Winnipeg',
  },
  // Live pages only are shown; drafts appear when they launch.
  related: ['/services/commercial-renovations', '/services/restaurant-renovations', '/services/office-renovations', '/services/general-contracting', '/services/demolition'],
  // The commercial interior design guide is linked from the intro, so its card
  // slot went to the cost-factors guide (owner of "retail renovation cost
  // Winnipeg", wave 5).
  guides: ['the-biggest-cost-factors-in-commercial-renovation-projects', 'understanding-roi-which-commercial-renovations-bring-the-most-value', 'how-to-prepare-your-business-for-a-major-renovation'],
  ownerSignoff: null,
};
