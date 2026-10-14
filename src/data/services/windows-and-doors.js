// Windows & doors — content for /services/windows-and-doors (rendered by src/pages/ProjectPage.jsx).
// Registry entry (path, labels, status, estimator, form type): src/data/services.js.
//
// No intro, gallery or testimonial: there are no real job photos or reviews
// for this service yet, and stock photos are never shown as our work.
// Every rule, program and number in `local` and `faqs` was checked against
// the official page listed in local.sources on 2026-10-13. Re-check the
// Efficiency Manitoba rebate before each content update (rebates change).
// Owner sign-off (ownerSignoff) is still to be added.

import { EXPERIENCE_YEARS, PROJECT_COUNT, REPLY_TIME } from '../facts.js';

const ACCESSED = '2026-10-13';

export default {
  slug: 'windows-and-doors',
  // Used in running text ("Let’s talk about your …", "before booking a …").
  breadcrumb: 'Window & Door Project',
  badge: 'Homes & Businesses · Free Written Quote',
  title: 'WINDOW & DOOR INSTALLATION',
  titleHighlight: 'IN WINNIPEG',
  subtitle:
    'We replace windows and exterior doors in Winnipeg homes and commercial spaces, and cut new or larger openings with any permit arranged first. Every job starts with a free on-site visit, careful measuring and a free written quote.',
  heroPoints: ['Free on-site visit', 'Every opening measured', 'Permits coordinated when needed'],

  stats: [
    { num: String(EXPERIENCE_YEARS), unit: '+', label: 'Years of combined experience' },
    { num: String(PROJECT_COUNT), unit: '+', label: 'Projects completed' },
    { num: '$0', unit: '', label: 'On-site visit & written quote' },
    { num: '1', unit: 'day', label: `Reply within ${REPLY_TIME}` },
  ],

  intro: null,

  includes: {
    tag: 'What’s Included',
    title: 'What does a window or door replacement include?',
    desc: 'More than the new unit. We measure each opening, remove the old window or door, check the rough opening for rot or damage, then set, insulate and seal the new unit and finish the trim inside and out. The old units and debris leave with us.',
    items: [
      { num: '01', title: 'Measuring & Ordering', text: 'Every opening measured, with sizes, swing direction, glass and hardware confirmed before anything is ordered.' },
      { num: '02', title: 'Careful Removal', text: 'Old units taken out without damaging more siding, stucco or drywall than needed, with nearby floors covered.' },
      { num: '03', title: 'Opening Repairs', text: 'Sills and framing checked for rot or water damage and repaired before the new unit goes in.' },
      { num: '04', title: 'Set, Insulate & Seal', text: 'Each unit set level and square, insulated around the frame and sealed to the wall against freeze and thaw.' },
      { num: '05', title: 'Trim Inside & Out', text: 'Interior casing, extension jambs, exterior trim and caulking finished to suit the house.' },
      { num: '06', title: 'Hardware & Clean-up', text: 'Locks and handles adjusted so doors latch and windows lock, then old units and debris hauled away.' },
    ],
  },

  typesTag: 'Project Types',
  typesTitle: 'What kinds of window and door work do we do?',
  typesDesc:
    'Most jobs are replacements in the existing opening, which keep the cost and the paperwork down. We also install entry and patio doors, enlarge openings with any permit arranged first, and fit windows and doors as part of basement, addition and commercial renovations.',
  types: [
    { title: 'Replacement Windows', text: 'New windows fitted to the existing openings: the most common job, and the simplest when the frames are sound.' },
    { title: 'Entry Doors', text: 'Front, side and back doors replaced with the frame, threshold and weatherstripping, so they seal and lock properly.' },
    { title: 'Patio Doors', text: 'Sliding and hinged patio doors set level on a sound sill, so they open easily and seal.' },
    { title: 'New or Larger Openings', text: 'A new or wider opening with a header sized for the wall above, and any permit in place first.' },
    { title: 'Basement Windows', text: 'Replacing or enlarging basement windows. A window serving a basement bedroom must also meet egress size rules.' },
    { title: 'Commercial Doors', text: 'Interior doors, frames and hardware in offices, clinics, shops and restaurants, after hours or on weekends if needed.' },
  ],

  local: {
    tag: 'In Winnipeg',
    title: 'Do you need a permit to replace windows in Winnipeg?',
    intro:
      'Usually not, if the new window or door fits the same opening. The City of Winnipeg lists same-size replacement among projects that don’t need a building permit, although the work still has to meet the building code. New or larger openings can need a permit, and heritage properties have their own rules.',
    items: [
      { title: 'Same-Size Replacement', text: 'The City says doors and windows replaced at the same size need no building permit. Building code and zoning requirements still apply.' },
      { title: 'New or Larger Openings', text: 'The City lists new or larger exterior openings among renovations that may need a building permit. We confirm it and coordinate inspections before the wall is opened.' },
      { title: 'Heritage Districts', text: 'Armstrong’s Point and Crescentwood-Enderton Park are Winnipeg’s two heritage conservation districts. Their plans decide when a heritage permit is needed.' },
      { title: 'Heritage Windows', text: 'For properties on the City’s List of Historical Resources, a heritage permit for window work asks for a window condition assessment, photos of each window, drawings of the original windows and shop drawings of the new ones.' },
      { title: 'Efficiency Manitoba Rebate', text: 'Efficiency Manitoba lists a $100 rebate per qualifying ENERGY STAR certified triple-pane window or door replacing one in a primary residence. New openings don’t qualify, and terms change.' },
      { title: 'Outside the City', text: 'In Headingley, East St. Paul, West St. Paul, Oak Bluff, Selkirk and Steinbach, the local municipality or planning district issues permits.' },
    ],
    sources: [
      { label: 'City of Winnipeg: home improvement projects', url: 'https://www.winnipeg.ca/building-development/home-improvement-projects', accessed: ACCESSED },
      { label: 'City of Winnipeg: home renovations', url: 'https://www.winnipeg.ca/building-development/building-renovating/home-improvement-projects/home-renovations', accessed: ACCESSED },
      { label: 'City of Winnipeg: heritage conservation districts', url: 'https://www.winnipeg.ca/people-culture/winnipegs-history/heritage-conservation/heritage-conservation-districts', accessed: ACCESSED },
      { label: 'City of Winnipeg: heritage permits', url: 'https://www.winnipeg.ca/people-culture/winnipegs-history/heritage-conservation/heritage-permits', accessed: ACCESSED },
      { label: 'Efficiency Manitoba: windows and doors rebate', url: 'https://efficiencymb.ca/my-home/windows-and-doors-rebate/', accessed: ACCESSED },
    ],
  },

  gallery: null,

  process: {
    tag: 'How It Works',
    title: 'From Measuring to Final Trim',
    desc: 'Same steps for one door or a whole house. On longer jobs you get a weekly progress update.',
    steps: [
      { num: '01', title: 'On-Site Visit', text: 'We look at each window and door, measure the openings, check the frames and talk through your options. The visit is free.' },
      { num: '02', title: 'Written Quote & Order', text: 'A free written quote listing every unit and the finishing work. Once you approve it, products are ordered and the install is booked around delivery.' },
      { num: '03', title: 'Installation', text: 'Old units out, openings checked and repaired, new units set, insulated and sealed, and the trim finished inside and out.' },
      { num: '04', title: 'Walkthrough', text: 'Every window and door checked for smooth operation and a good seal, then a clean-up and a walkthrough with you.' },
    ],
  },

  testimonial: null,

  faqsTitle: 'Window and Door Questions',
  faqs: [
    { q: 'Can you make a window opening bigger?', a: 'Yes. A new or larger opening in an exterior wall can need a building permit in Winnipeg, and it needs a header sized for the wall above. A basement bedroom window must also meet egress size rules. We plan all of that, and sort out the permit, before the wall is cut.' },
    { q: 'Can windows be replaced in winter?', a: 'Yes, with planning. Each opening is closed up as soon as the new unit is set, so heat loss stays limited. Sealants and some foams list minimum application temperatures, so on very cold days some exterior sealing may wait for a milder day.' },
    { q: 'Is triple-pane glass worth it in Winnipeg?', a: 'It’s worth pricing. Triple-pane units generally insulate better than double-pane, and Efficiency Manitoba’s rebate currently applies only to ENERGY STAR certified triple-pane products. Double-pane can still suit a tight budget or a space the rebate excludes, such as a garage. We can quote both so you can compare.' },
    { q: 'What do I need for the Efficiency Manitoba rebate?', a: 'Each window or door needs an NRCan reference number, so ask for those numbers on your quote and invoice. Only replacements in your primary residence qualify, not new openings, and the application is due within 90 days of installation and payment in full. Check efficiencyMB.ca for current terms.' },
    { q: 'Do you replace windows in older or character homes?', a: 'Yes. Older houses often have out-of-square openings and trim worth keeping, so we measure carefully and plan the trim before ordering. If the house is in a heritage conservation district or on the City’s heritage list, a heritage permit may be needed first, and we check that before anything is ordered.' },
    { q: 'How much does window or door replacement cost?', a: 'It depends on the number of units, their sizes, frame material and glass, and how much repair each opening needs. We don’t guess from a photo: the on-site visit and written quote are both free, and the quote lists every unit so you can compare it line by line.' },
  ],

  // Title, meta description and Service schema for this page. `updated`
  // feeds the sitemap lastmod and WebPage dateModified: bump it only when the
  // page content really changes.
  seo: {
    title: 'Window & Door Installation Winnipeg | Bridgeland Builders',
    description:
      'Window and door installation in Winnipeg: same-size replacements, new openings with permits, and clean trim. Free on-site visit and written quote.',
    serviceType: 'Window and door installation',
    // Add to scripts/keyword-map.json (not there yet).
    primaryKeyword: 'window and door installation Winnipeg',
    updated: '2026-10-14',
  },

  // Optional sections (plan §7), rendered by ProjectPage only when filled in:
  //   types      [{ title, text }]                        "types of <service>" cards
  //   local      { title, intro, items: [{ title, text }], sources: [{ label, url, accessed }] }
  //   costTeaser { text, to }                             1–2 lines + link to the cost page
  //   related    [path]                                   related service pages (registry paths)
  //   guides     [blogSlug]                               related guides (blog posts)
  //   faqsTitle  string                                   heading over the FAQs
  //   ownerSignoff { name, role, date }                   owner sign-off line
  // No cost page for this service (no Bridgeland price data), so no teaser.
  costTeaser: null,
  // Live pages only are shown; drafts appear when they launch.
  related: ['/services/exterior-painting', '/services/masonry-stucco', '/services/basement-renovations', '/services/whole-home-renovations'],
  // Unpublished slugs are skipped by ServiceRoute until the post goes live.
  guides: ['window-and-door-replacement-winnipeg', 'renovating-a-character-home-in-winnipeg', 'insulation-rebates-during-a-renovation-manitoba'],
  ownerSignoff: null,
};
