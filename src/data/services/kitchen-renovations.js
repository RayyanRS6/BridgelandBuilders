// Kitchen renovations — content for /services/kitchen-renovations (rendered by src/pages/ProjectPage.jsx).
// Registry entry (path, labels, status, estimator, form type): src/data/services.js.
//
// The intro image is a stock inspiration photo, not a Bridgeland job. Keep
// its alt to what is visible in the photo (no "Winnipeg", no "our", no
// finished-job outcomes) until real job photos with client consent replace it.
//
// Facts: the 4–6 week timeline, free on-site visit and written quote, and
// permit coordination are owner-confirmed. Every City of Winnipeg / Health
// Canada statement in `local` and the FAQs was checked on 2026-10-13 against
// the sources listed in local.sources. The only price on the page is the
// instant estimator's starting range (costTeaser, estimator data 2026-10-13).

import { EXPERIENCE_YEARS, PROJECT_COUNT, REPLY_TIME, TIMELINES } from '../facts.js';
import { NEARBY_AREAS_TEXT_OR } from '../areas.js';

export default {
  slug: 'kitchen-renovation',
  breadcrumb: 'Kitchen Renovation',
  badge: 'Kitchen Renovation Contractor in Winnipeg',
  title: 'KITCHEN RENOVATIONS',
  titleHighlight: 'IN WINNIPEG',
  subtitle:
    `We plan and build kitchen renovations in Winnipeg and nearby communities: layout, cabinets, countertops, backsplash, lighting and appliance fit. Most full kitchens take ${TIMELINES.kitchen.words} once the cabinets arrive.`,
  heroPoints: ['Free on-site visit', 'Written quote before work starts', `Most kitchens done in ${TIMELINES.kitchen.short}`],

  stats: [
    { num: String(EXPERIENCE_YEARS), unit: '+', label: 'Years of combined experience' },
    { num: String(PROJECT_COUNT), unit: '+', label: 'Projects completed across Winnipeg' },
    { num: String(TIMELINES.kitchen.min), unit: `–${TIMELINES.kitchen.max}`, label: 'Weeks for a typical kitchen' },
    { num: '1', unit: 'day', label: `Reply within ${REPLY_TIME}` },
  ],

  intro: {
    tag: 'Why Bridgeland for your kitchen?',
    title: 'A kitchen is a workspace before it’s a showpiece',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'White kitchen with an island, black bar stools, and crystal pendant lights',
    floatingTitle: 'Layout First',
    floatingText: 'We plan around how you cook, then pick the finishes.',
    paragraphs: [
      'Plenty of kitchens look great in a photo and are miserable to cook in. The fridge door blocks the walkway. There’s nowhere to put a hot pan down beside the stove. The garbage is across the room from the prep counter.',
      'That’s why we start with the layout, not the finishes. We ask who cooks, how many people are usually in the room, and where things go wrong in the kitchen you have now. Then we work out where the sink, stove, and fridge belong, and we build the cabinets around that.',
      'After that, it’s about materials that last. Solid boxes, proper hardware, counters that handle heat and knives, and a backsplash that wipes clean. A kitchen gets used hard every day, so that’s what we plan the materials around.',
    ],
    checklist: ['Custom Cabinetry', 'Counters & Backsplash', 'Islands & Storage', 'Lighting & Appliances'],
  },

  includes: {
    tag: 'What’s Included',
    title: 'What does a kitchen renovation include?',
    desc: 'A full kitchen renovation covers planning the layout, removing the old kitchen, updating plumbing and electrical, installing cabinets, countertops and backsplash, then fitting appliances and finishing trim and paint. Planning a lighter refresh, such as new countertops or a backsplash only? Tell us at the on-site visit and we’ll scope just those parts.',
    items: [
      { num: '01', title: 'Layout Planning', text: 'Working out the plan around your cooking, your traffic, and your appliances before a single cabinet gets ordered.' },
      { num: '02', title: 'Demo & Prep', text: 'Old cabinets and counters out, walls patched, and the room ready for the new plan. Everything hauled away.' },
      { num: '03', title: 'Electrical & Plumbing', text: 'Outlets where you’ll actually use them, lighting over the work areas, and the sink and dishwasher lines set for the new layout.' },
      { num: '04', title: 'Cabinetry', text: 'Cabinets set level and secure, with drawers and hardware adjusted to run smoothly.' },
      { num: '05', title: 'Counters & Backsplash', text: 'Templated, cut, and installed tight to the wall, with the backsplash tiled and sealed over top.' },
      { num: '06', title: 'Appliances & Finish', text: 'Appliances fitted and hooked up, trim and paint finished, and the whole room cleaned before handover.' },
    ],
  },

  typesTag: 'Project Types',
  typesTitle: 'Which kind of kitchen remodel do you need?',
  // Two short paragraphs (readability: none over 60 words).
  typesDesc: [
    'Most kitchen projects fall into one of six types, from a complete renovation with a new layout to a targeted update of cabinets, countertops or backsplash.',
    'The right one depends on whether your layout works today. If it does, keep it and put the budget into finishes, since [moving the sink or removing a wall adds to the cost](/services/kitchen-renovations/cost). If it doesn’t, start with the plan.',
  ],
  types: [
    { title: 'Full kitchen renovation', text: 'A new layout, cabinets, countertops, backsplash, lighting and flooring, with plumbing and electrical moved to suit. This is the scope behind the four-to-six-week timeline.' },
    { title: 'Cabinet & countertop replacement', text: 'Keep the layout and replace the boxes, doors and tops. Countertops are templated after the cabinets are set so the fit is exact. Stock, semi-custom and fully custom cabinets are all options.' },
    { title: 'Small kitchen renovation', text: '[In a galley or compact kitchen](/blog/essential-design-strategies-for-small-kitchen-renovations) every centimetre counts: taller uppers, deep drawers, corner storage, and lighting that makes the room feel larger than it is.' },
    { title: 'Open-concept kitchen', text: 'Opening the wall to the living or dining room. A load-bearing wall needs a properly sized beam, a building permit and, in some cases, an engineer’s sealed drawing.' },
    { title: 'Kitchen island installation', text: 'Adding or enlarging an island for prep, seating and storage. We plan walkway clearances first, then the power and any sink or dishwasher plumbing the island needs.' },
    { title: 'Backsplash, lighting & flooring', text: 'A lighter update for a kitchen whose layout already works: new backsplash tile, under-cabinet and ceiling lighting, or [new flooring](/services/flooring) laid to suit the cabinets.' },
  ],

  local: {
    tag: 'In Winnipeg',
    title: 'Do you need a permit for a kitchen renovation in Winnipeg?',
    intro:
      'Often, yes. The City of Winnipeg lists kitchens among the [home renovations that may need a building permit](/blog/winnipeg-renovation-permits), and new wiring or plumbing may need separate trade permits. Cosmetic work such as painting, flooring and millwork does not need a building permit. We coordinate the permits and inspections with the City or your local municipality.',
    items: [
      { title: 'When a building permit applies', text: 'Kitchens, open-concept layouts, and new or larger exterior door and window openings are the City’s examples of renovations that may need a building permit. Painting, flooring and millwork, its examples of cosmetic changes, do not.' },
      { title: 'Removing a load-bearing wall', text: 'When a structural element goes beyond what Part 9 of the Manitoba Building Code covers, the City requires a sealed drawing from a professional engineer registered in Manitoba, with a Professional Designer’s Certificate for Housing. Our guide covers [permits, drawings and beams for removing a load-bearing wall](/blog/removing-a-load-bearing-wall-winnipeg).' },
      { title: 'Electrical and plumbing permits', text: 'Moving the sink, adding circuits for new appliances, or wiring an island is trade work. The City notes that renovations may need electrical and plumbing permits, depending on the scope, on top of a building permit.' },
      { title: 'Inspections before walls close', text: 'The City requires a rough-in inspection before framing, HVAC, electrical or plumbing work under a permit is covered, and a final inspection to close the permit. We schedule them as the work reaches each stage.' },
      { title: 'Older kitchens and asbestos', text: 'Health Canada says that before 1990, asbestos was mainly used for insulating buildings and homes, and lists older plaster, drywall and floor tiles among materials that may contain it. If your kitchen still has original materials, have them tested by a professional before [demolition](/services/demolition).' },
      { title: 'Outside Winnipeg and in condos', text: `In ${NEARBY_AREAS_TEXT_OR}, permits come from your local municipality or planning district. In a condo, ask your condominium corporation which approvals and work hours apply before dates are set.` },
    ],
    sources: [
      { label: 'City of Winnipeg: Home renovations', url: 'https://www.winnipeg.ca/building-development/building-renovating/home-improvement-projects/home-renovations', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Information Bulletin 2026-013-B/S, Engineering requirements for housing', url: 'https://www.winnipeg.ca/media/6133', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Housing inspections', url: 'https://www.winnipeg.ca/building-development/building-renovating/inspections/housing-inspections', accessed: '2026-10-13' },
      { label: 'Health Canada: Health risks of asbestos', url: 'https://www.canada.ca/en/health-canada/services/air-quality/indoor-air-contaminants/health-risks-asbestos.html', accessed: '2026-10-13' },
    ],
  },

  // No gallery: only one of its three stock photos showed a kitchen; the
  // other two were a house exterior and a living room. A gallery returns with
  // at least three kitchen photos, labelled as inspiration until they are our
  // own jobs.
  gallery: null,

  process: {
    tag: 'How It Works',
    title: 'From Layout to First Dinner',
    desc: 'We order the cabinets early so the build doesn’t stall waiting on them.',
    steps: [
      { num: '01', title: 'On-Site Visit', text: 'We measure the room and talk through how you use it. You tell us what drives you crazy about the current kitchen — that’s usually the most useful part.' },
      { num: '02', title: 'Plan & Quote', text: 'A layout and a written price. Once you approve it, cabinets and counters get ordered so they arrive when we need them, not three weeks after.' },
      { num: '03', title: 'Build', text: 'Demo, then rough-in, then cabinets, then counters, then backsplash. We set up a temporary spot for your kettle and microwave, and you get a progress update every week.' },
      { num: '04', title: 'Handover', text: 'Appliances connected, drawers adjusted, everything cleaned, and a walkthrough with you before we call it finished.' },
    ],
  },

  costTeaser: {
    text: 'The starting ranges our instant estimator uses begin at $40,000–$79,999 for a small kitchen of up to 100 sq ft. Your final price comes from the written quote we prepare after a free on-site visit.',
    to: '/services/kitchen-renovations/cost',
    label: 'Kitchen renovation costs in Winnipeg',
  },

  // Real client testimonial (confirmed by the owner 2026-10-13).
  testimonial: {
    quote:
      '“They caught something our last quote missed — the fridge door would have blocked the pantry. Small thing, but we’d have lived with it for years. They redrew the layout, built it, and the kitchen actually works now. Cooking in it every day is a pleasure.”',
    initial: 'M',
    name: 'Marvin V.',
    role: 'Homeowner, Kitchen Renovation',
  },

  // No cost questions here: those live on /services/kitchen-renovations/cost.
  faqs: [
    { q: 'How long does a kitchen renovation take?', a: `Most full kitchens take ${TIMELINES.kitchen.words} once the cabinets are on site. Countertops are templated after the cabinets are set, which adds about a week in the middle. Cabinets are ordered as soon as you approve the written quote, so the build isn’t left waiting on them.` },
    { q: 'Will we have a working kitchen during the renovation?', a: 'You’ll be without the sink and stove for most of the build. We set up a temporary counter with your kettle, microwave and fridge so you have somewhere to make coffee and simple meals. If anyone in the house has particular needs, tell us at the on-site visit and we’ll plan around them.' },
    { q: 'Can you remove the wall between the kitchen and living room?', a: 'Usually. A non-structural wall is straightforward. A load-bearing wall needs a beam sized for the load and a building permit, and the City requires an engineer’s sealed drawing when the structure goes beyond what Part 9 of the Manitoba Building Code covers. We’ll tell you at the on-site visit which kind of wall you have.' },
    { q: 'Should I choose stock, semi-custom or custom cabinets?', a: 'Stock cabinets are quicker and cost less, and they suit most standard layouts. Semi-custom adds more sizes, finishes and interior options. Fully custom makes sense when the room is an odd shape or you want storage built around specific things. We can price more than one option in the written quote so you can compare.' },
    { q: 'Can I keep my existing appliances?', a: 'Yes. Tell us early so the cabinet openings are built to fit them. If you plan to replace appliances later, send us the model numbers of the ones you have in mind and we’ll size the openings for those now, so nobody is cutting into new cabinets in two years.' },
    { q: 'Who arranges the permits and inspections?', a: 'We do. When your kitchen needs a building permit or trade permits, we coordinate them with the City of Winnipeg or your local municipality and schedule each inspection as the work reaches that stage.\n\nThe City says the homeowner and the permit applicant share responsibility for inspections, so we keep you informed at every step.', more: { label: 'How we handle permits and inspections', to: '/our-process' } },
    { q: 'What happens at the free on-site visit?', a: 'We measure the kitchen, look at the plumbing, wiring and walls, and talk through how you cook and what frustrates you about the current layout. After the visit you receive a written quote that lists what’s included, so you can read it line by line, and compare it with another company’s quote, before deciding anything.' },
  ],

  // Title, meta description and Service schema for this page. `updated`
  // feeds the sitemap lastmod and WebPage dateModified: bump it only when the
  // page content really changes.
  seo: {
    title: 'Kitchen Renovations Winnipeg | Bridgeland Builders',
    description:
      `Kitchen renovations in Winnipeg: layout, cabinets, countertops and lighting, most done in ${TIMELINES.kitchen.short}. Start with a free on-site visit and written quote.`,
    serviceType: 'Kitchen renovation',
    primaryKeyword: 'kitchen renovation Winnipeg',
    updated: '2026-10-15',
  },

  // Live pages only are shown; drafts appear when they launch.
  related: ['/services/bathroom-renovations', '/services/whole-home-renovations', '/services/basement-renovations', '/services/flooring'],
  guides: ['essential-design-strategies-for-small-kitchen-renovations', 'winnipeg-renovation-permits', 'how-to-choose-the-right-contractor-for-your-renovation-project'],
  ownerSignoff: null,
};
