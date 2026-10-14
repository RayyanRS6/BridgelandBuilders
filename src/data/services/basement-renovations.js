// Basement renovations — content for /services/basement-renovations (rendered by src/pages/ProjectPage.jsx).
// Registry entry (path, labels, status, estimator, form type): src/data/services.js.
//
// The intro and gallery images are stock inspiration photos, not Bridgeland
// jobs. Keep their alts and captions to what is visible in the photo (no
// "Winnipeg", no "our", no finished-job outcomes) until real job photos with
// client consent replace them.
//
// Facts: the 4–8 week timeline, free on-site visit and written quote, and
// permit coordination are owner-confirmed. Waterproofing is NOT a Bridgeland
// service: the page covers moisture checks before finishing and when to call a
// specialist (keyword map note). Every City of Winnipeg / Health Canada /
// Efficiency Manitoba statement in `local` and the FAQs was checked on
// 2026-10-13 against the sources in local.sources. The keyword map gives this
// page no permit H2 of its own (the basement permit guide owns that), so the
// local section is framed as "what to check" with permits as one item. The
// only price on the page is the instant estimator's starting range.

import { EXPERIENCE_YEARS, PROJECT_COUNT, REPLY_TIME, TIMELINES } from '../facts.js';

export default {
  slug: 'basement-renovation',
  breadcrumb: 'Basement Renovation',
  badge: 'Basement Finishing Contractor in Winnipeg',
  title: 'BASEMENT DEVELOPMENT & RENOVATIONS',
  titleHighlight: 'IN WINNIPEG',
  subtitle:
    `We develop unfinished basements and renovate finished ones in Winnipeg and nearby communities: moisture checked first, walls insulated for winter, permits coordinated. A typical basement takes ${TIMELINES.basement.words}.`,
  heroPoints: ['Free on-site visit', 'Moisture checked before framing', 'Permits & inspections coordinated'],

  stats: [
    { num: String(EXPERIENCE_YEARS), unit: '+', label: 'Years of combined experience' },
    { num: String(PROJECT_COUNT), unit: '+', label: 'Projects completed across Winnipeg' },
    { num: String(TIMELINES.basement.min), unit: `–${TIMELINES.basement.max}`, label: 'Weeks for a typical basement' },
    { num: '1', unit: 'day', label: `Reply within ${REPLY_TIME}` },
  ],

  intro: {
    tag: 'Why Bridgeland for your basement?',
    title: 'Get the moisture and insulation right, and the rest is easy',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Room with light grey walls, a black loveseat, a white dresser, and a floor lamp',
    floatingTitle: 'Dry First, Finish Second',
    floatingText: 'We check moisture and insulation before any framing goes up.',
    paragraphs: [
      'Basements are the easiest room to finish badly. Frame straight onto a cold foundation wall, skip the vapour control, and two winters later you’ve got a musty smell and mould behind brand new drywall.',
      'So we start underground, not with paint chips. We check for signs of moisture, look at how water moves around your foundation, and make sure any drainage or leak problem is fixed — by a specialist where it needs one — before we frame anything.',
      'Then we insulate properly for a Winnipeg winter so the room is actually warm in February.',
      'Once that’s handled, the fun part is easy. Family room, home office, guest room, gym, a bathroom down there, a wet bar — whatever you’re after. And if you’re thinking about a rental suite, we’ll walk you through the egress window and ceiling height rules before you commit to anything.',
    ],
    checklist: ['Family & Rec Rooms', 'Basement Bathrooms', 'Egress Windows', 'Proper Insulation'],
  },

  includes: {
    tag: 'What’s Included',
    title: 'What does basement development include?',
    desc: 'Developing a basement takes it from bare concrete to finished living space: moisture checks, framing off the foundation, insulation and vapour control, electrical and heating for the new rooms, egress windows for bedrooms, then drywall, flooring and trim. Renovating a basement that is already finished follows the same order on a smaller scope.',
    items: [
      { num: '01', title: 'Moisture Checks', text: 'Looking for signs of water before anything is built: staining, damp corners, grading and downspouts. Active leaks or foundation cracks go to a waterproofing or foundation specialist first.' },
      { num: '02', title: 'Framing & Insulation', text: 'Walls framed off the foundation and insulated for Winnipeg winters, with vapour control done the right way around.' },
      { num: '03', title: 'Electrical & Mechanical', text: 'Lighting, outlets, and heat runs planned for the new rooms, plus boxing in the ducts and beams so it doesn’t feel like a basement.' },
      { num: '04', title: 'Egress Windows', text: 'Cutting in an egress window and window well wherever a bedroom needs one, so the room has a second way out.' },
      { num: '05', title: 'Bathrooms & Bars', text: 'Adding a bath or a wet bar downstairs, including the drain work that goes with it.' },
      { num: '06', title: 'Floors, Paint & Trim', text: 'Flooring rated for below grade, doors, trim, and paint — finished to the same standard as the rest of your house.' },
    ],
  },

  typesTag: 'Project Types',
  typesTitle: 'What can a finished basement be used for?',
  typesDesc:
    'Most basement projects are one of three things: finishing an unfinished basement, a remodel of one that is already finished, or adding a bedroom, bathroom or self-contained suite. How you plan to use the space decides the layout, the permits and whether you need an egress window, so that is the first thing we ask about.',
  types: [
    { title: 'Unfinished basement finishing', text: 'From bare concrete to finished rooms: framing, insulation, electrical, heating, drywall and flooring, with a building permit and inspections along the way.' },
    { title: 'Renovating a finished basement', text: 'Replacing dated finishes, opening up the layout or adding rooms. New flooring, trim and paint alone need no building permit; a new bedroom does.' },
    { title: 'Basement bedroom & bathroom', text: 'A bedroom with an egress window, and a bathroom tied into the existing drains or served by an up-flush system where breaking the slab isn’t practical.' },
    { title: 'Home office, gym or theatre', text: 'Rooms for work, workouts or movies, with soundproofing between floors, dedicated circuits, and lighting planned for how each room is used.' },
    { title: 'Basement suite', text: 'A self-contained suite for a tenant or family member. It needs development and building permits and extra building code items, covered on our basement suites page.' },
    { title: 'Storage, built-ins & wet bars', text: 'Built-in shelving, a wet bar with its own sink line, and storage planned around the furnace, water heater and electrical panel so they stay easy to reach.' },
  ],

  local: {
    tag: 'In Winnipeg',
    title: 'What should you check before developing a basement in Winnipeg?',
    intro:
      'Four things: the permit, the moisture, the exits and the air. Finishing an undeveloped basement or adding a bedroom needs a City of Winnipeg building permit, a bedroom needs a second way out, any water problem should be fixed before framing, and Health Canada recommends testing for radon. Here is what each one involves.',
    items: [
      { title: 'Building permit', text: 'The Winnipeg Building By-law, amended in February 2026, requires a building permit to finish a previously undeveloped level or create a new bedroom. Cosmetic updates to an already finished basement, such as flooring, trim and paint, do not. Electrical and plumbing work often need permits of their own.' },
      { title: 'Inspections before drywall', text: 'Rough-in inspections of framing, heating, electrical and plumbing happen before anything is covered. In a new house bought with an unfinished basement, the City also requires a pre-board inspection of the insulated frost walls before they are covered.' },
      // Two short paragraphs (plan §19: 60 words or fewer each).
      {
        title: 'A second exit for bedrooms',
        text: [
          'The City’s basement guide says a new bedroom needs a window that opens from inside without tools, with at least 0.35 m² (3.77 sq ft) of clear opening and no dimension under 380 mm (15 in.), and 760 mm (30 in.) of clearance in front of it in a window well.',
          'A door leading directly outside removes the need for the window.',
        ],
      },
      { title: 'Moisture control before framing', text: 'The City requires a backwater valve in homes built since 1979 and a sump pit with a pump in homes built since 1990, and asks owners to keep downspouts and grading directing water away. Waterproofing and foundation repair are specialist work, so active leaks go to a specialist first.' },
      { title: 'Radon testing', text: 'Health Canada says all homes have some radon and levels are generally highest in basements. It recommends a long-term test of at least three months, ideally in fall or winter, on the lowest lived-in level. Above the 200 Bq/m³ guideline, hire a certified mitigation professional.' },
      { title: 'Insulation rebates', text: 'Efficiency Manitoba’s Home Insulation Rebate includes foundation walls, but approval must come before buying materials or starting any work, including removing drywall, and materials must come from a registered contractor or retailer. Raise it at the on-site visit so the timing works.' },
    ],
    sources: [
      { label: 'City of Winnipeg: Basement/lower level development', url: 'https://www.winnipeg.ca/building-development/building-renovating/home-improvement-projects/basementlower-level-development', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Information Bulletin 2026-007-B, Building permit requirements for housing', url: 'https://www.winnipeg.ca/media/6116', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Housing inspections', url: 'https://www.winnipeg.ca/building-development/building-renovating/inspections/housing-inspections', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Basement/lower level development, construction information (updated October 2025)', url: 'https://www.winnipeg.ca/media/6349', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: 5 tips for keeping your basement dry during the spring melt', url: 'https://www.winnipeg.ca/people-culture/our-city-our-stories/5-tips-keeping-your-basement-dry-during-spring-melt', accessed: '2026-10-13' },
      { label: 'Health Canada: Radon, what you need to know', url: 'https://www.canada.ca/en/health-canada/services/environmental-workplace-health/reports-publications/radon-what-you-need-to-know.html', accessed: '2026-10-13' },
      { label: 'Health Canada: How to use a long-term radon detector', url: 'https://www.canada.ca/en/health-canada/services/publications/health-risks-safety/radon-long-term-test-instructions.html', accessed: '2026-10-13' },
      { label: 'Efficiency Manitoba: Home Insulation Rebate', url: 'https://efficiencymb.ca/my-home/home-insulation-rebate/', accessed: '2026-10-13' },
    ],
  },

  gallery: {
    tag: 'Design Ideas',
    title: 'Basement Renovation Ideas',
    desc: 'Inspiration photos, not Bridgeland projects. Photos from our own Winnipeg jobs will replace these as each project is documented.',
    items: [
      { img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80', alt: 'Living room with a grey sofa, wood coffee table, wood floors, and floor-to-ceiling windows', title: 'Comfortable Lounge Area', text: 'Grey sofa, wood coffee table, and leather ottomans' },
      { img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', alt: 'Modern two-storey house at dusk with dark wood cladding and large glass walls', title: 'Modern Home at Dusk', text: 'Dark wood cladding and glass walls lit from inside' },
      { img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80', alt: 'Person cooking at a gas cooktop in a white kitchen with a stone island and built-in wall oven', title: 'White Kitchen with Island Cooktop', text: 'Flat-panel cabinets, stone counters, and a built-in wall oven' },
    ],
  },

  process: {
    tag: 'How It Works',
    title: 'From Bare Concrete to Finished Room',
    desc: 'The order matters down here. We don’t skip ahead to the finishes.',
    steps: [
      { num: '01', title: 'On-Site Visit', text: 'We come look at the space — moisture, ceiling height, where the mechanical sits, and what the windows will allow. That tells us what’s realistic before you get attached to a plan.' },
      { num: '02', title: 'Plan & Quote', text: 'A layout for the new rooms and a written price. If you need permits or an egress window, that’s in the plan and we coordinate the paperwork.' },
      { num: '03', title: 'Build', text: 'Any water issues first, then framing, insulation, mechanical, drywall, and finishes. We seal off the stairwell to keep dust out of the house, and you get a progress update every week.' },
      { num: '04', title: 'Handover', text: 'Inspections passed where required, a walkthrough with you, and a full clean before we hand it over.' },
    ],
  },

  costTeaser: {
    text: 'The starting ranges our instant estimator uses begin at $25,000–$80,000 for a basement of up to 500 sq ft. Your final price comes from the written quote we prepare after a free on-site visit.',
    to: '/services/basement-renovations/cost',
    label: 'Basement development costs in Winnipeg',
  },

  // Real client testimonial (confirmed by the owner 2026-10-13).
  testimonial: {
    quote:
      '“Two contractors quoted us to frame the basement and neither mentioned the damp patch by the back corner. Bridgeland spotted it in the first ten minutes and dealt with it before they built anything. The basement has been dry through two winters now and the kids basically live down there.”',
    initial: 'T',
    name: 'Trevor L.',
    role: 'Homeowner, Basement Renovation',
  },

  // No cost questions here: those live on /services/basement-renovations/cost.
  faqs: [
    { q: 'How long does basement development take?', a: `A typical basement takes ${TIMELINES.basement.words} of work, depending on its size, the number of rooms, and whether a bathroom is added. Permit review and inspections are part of the schedule, so we build them into the timeline we give you with the written quote instead of leaving them as a surprise.` },
    { q: 'Do I need a permit to finish my basement in Winnipeg?', a: 'Yes, if you are finishing a previously undeveloped basement or creating a new bedroom: the Winnipeg Building By-law requires a building permit for both. Updating finishes in a basement that is already developed does not need one. Electrical and plumbing work often need separate permits. We coordinate them as part of the job.' },
    { q: 'My basement smells damp. Can it still be finished?', a: 'Usually, but not until the cause is known. Sometimes it’s grading or a downspout outside; sometimes it’s a foundation crack or a failing sump pump. Outside drainage gets fixed first, and active leaks or cracks go to a waterproofing or foundation repair company before we frame. Finishing over a damp wall only hides the problem.' },
    { q: 'What is an egress window, and do I need one?', a: 'It’s a window large enough to climb out of in an emergency. The City’s basement guide says a new basement bedroom needs one that opens from inside without tools, with at least 0.35 m² of clear opening and no dimension under 380 mm, unless the bedroom has a door straight outside. We cut the opening, install the window, and set the window well.' },
    { q: 'Can you add a bathroom in the basement?', a: 'Yes. If there’s no drain where you want the bathroom, we either break the concrete and run new drain lines or use an up-flush system. At the on-site visit we’ll tell you which suits your basement and what each involves, and the plumbing permit is part of the plan from the start.' },
    { q: 'Should I test for radon before finishing my basement?', a: 'It’s worth doing. Health Canada recommends a long-term radon test of at least three months, ideally in fall or winter, on the lowest lived-in level. Test your current living space now, then again once the basement is in use. If a result is above 200 Bq/m³, a certified mitigation professional can recommend a fix.' },
    { q: 'We just bought a new house. Can we develop the basement right away?', a: 'Usually, yes. A new house sold with an unfinished basement still needs a building permit to develop it, and the City requires a pre-board inspection of the insulated frost walls before they are covered. It also makes sense to run a long-term radon test through a fall or winter first, so results are in before walls go up.' },
    { q: 'Will the basement actually be warm?', a: 'That comes down to insulation, air sealing and heat supply, and we plan all three. Walls are framed off the foundation and insulated with the vapour control on the warm side, and the new rooms get enough heat to stay comfortable in January. We also check how your furnace will handle the extra space.' },
  ],

  // Title, meta description and Service schema for this page. `updated`
  // feeds the sitemap lastmod and WebPage dateModified: bump it only when the
  // page content really changes.
  seo: {
    title: 'Basement Development & Renovations Winnipeg | Bridgeland',
    description:
      'Basement development and renovations in Winnipeg: moisture checked first, walls insulated for winter, permits coordinated. Free on-site visit and quote.',
    serviceType: 'Basement renovation',
    primaryKeyword: 'basement development Winnipeg',
    updated: '2026-10-14',
  },

  // Live pages only are shown; drafts appear when they launch.
  related: ['/services/basement-suites', '/services/bathroom-renovations', '/services/flooring', '/services/home-additions'],
  guides: ['basement-development-permits-winnipeg', 'radon-testing-before-finishing-a-basement', 'basement-flood-protection-winnipeg'],
  ownerSignoff: null,
};
