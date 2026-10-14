// Home additions — content for /services/home-additions (rendered by src/pages/ProjectPage.jsx).
// Registry entry (path, labels, status, estimator, form type): src/data/services.js.
//
// The intro and gallery images are stock inspiration photos, not Bridgeland
// jobs. Keep their alts and captions to what is visible in the photo (no
// "Winnipeg", no "our", no finished-job outcomes) until real job photos with
// client consent replace them.
//
// Facts: the 8–16 week timeline, free on-site visit and written quote, weekly
// progress updates and permit coordination are owner-confirmed. Not confirmed,
// so not claimed: in-house design, drawings or engineering, "one team",
// second-storey additions. Every City of Winnipeg statement in `local` and the
// FAQs was checked on 2026-10-13 against the sources in local.sources. The
// estimator has no additions price data: the cost teaser links the cost hub's
// "priced after a visit" section and carries no numbers.

import { EXPERIENCE_YEARS, PROJECT_COUNT, REPLY_TIME, TIMELINES } from '../facts.js';
import { NEARBY_AREAS_TEXT_OR } from '../areas.js';

export default {
  // Project slug kept from before the rename to "home additions" (plan D6): it
  // keys PROJECT_ESTIMATORS and the estimator's service=home-extension param.
  slug: 'home-extension',
  breadcrumb: 'Home Addition',
  badge: 'House Addition Contractor in Winnipeg',
  title: 'HOME ADDITIONS',
  titleHighlight: 'IN WINNIPEG',
  subtitle:
    `We build home additions in Winnipeg and nearby communities that connect to the existing house inside and out: foundation, structure, roof, utilities and finishes. Many take ${TIMELINES.addition.words} once permits and materials are ready.`,
  heroPoints: ['Free on-site visit', 'Permits & inspections coordinated', 'Weekly progress updates'],

  stats: [
    { num: String(EXPERIENCE_YEARS), unit: '+', label: 'Years of combined experience' },
    { num: String(PROJECT_COUNT), unit: '+', label: 'Projects completed across Winnipeg' },
    { num: String(TIMELINES.addition.min), unit: `–${TIMELINES.addition.max}`, label: 'Weeks for many home additions' },
    { num: '1', unit: 'day', label: `Reply within ${REPLY_TIME}` },
  ],

  intro: {
    tag: 'Why add on?',
    title: 'More space without starting over somewhere else',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Open-plan living area with a white sectional sofa, a wood feature wall, and sliding glass doors',
    floatingTitle: 'Built as One Home',
    floatingText: 'Rooflines, floors, trim, and finishes planned to connect naturally.',
    paragraphs: [
      'Sometimes the location is right but the house has stopped fitting. A larger kitchen, a family room, a main-floor bedroom, or a proper mudroom can give you the space you need without the cost and disruption of moving.',
      'A good addition should not feel attached as an afterthought. We look at the existing roofline, foundation, floor heights, mechanical systems, and exterior materials before the plans are finalized. That early work is what makes the new space feel like part of the original home.',
      'We coordinate the build from excavation and structure through insulation, utilities, drywall, flooring, and final paint. The trades and the schedule are managed for you instead of by you, and you get a progress update every week.',
    ],
    checklist: ['Kitchen Extensions', 'Family Rooms', 'Main-Floor Bedrooms', 'Mudrooms & Entry Additions'],
  },

  includes: {
    tag: 'What’s Included',
    title: 'What does a home addition include?',
    desc: 'A home addition covers a site review, permits, foundation and structure, roof and exterior, extended heating, plumbing and electrical, then the interior connection and finishes that make old and new feel like one house. The order matters: the shell is closed in before the existing wall is opened, which keeps disruption inside the house to a minimum.',
    items: [
      { num: '01', title: 'Site Review', text: 'Checking the available space, access, existing structure, services, and practical limits before the plans move ahead.' },
      { num: '02', title: 'Drawings & Permits', text: 'Confirming the drawings the City needs, including any engineering, then coordinating the development and building permits for the approved scope.' },
      { num: '03', title: 'Foundation & Structure', text: 'Excavation, foundation work, framing, roofing, windows, and exterior closure completed in the correct sequence.' },
      { num: '04', title: 'Electrical, Plumbing & HVAC', text: 'Extending the home systems safely so the new room has the lighting, outlets, plumbing, heating, and cooling it needs.' },
      { num: '05', title: 'Interior Connection', text: 'Opening the existing house and carefully matching floor heights, openings, trim, and transitions between old and new.' },
      { num: '06', title: 'Exterior & Final Finishes', text: 'Siding or masonry, insulation, drywall, flooring, paint, fixtures, inspections, and a complete cleanup before handover.' },
    ],
  },

  typesTag: 'Project Types',
  typesTitle: 'What kind of room addition do you need?',
  typesDesc:
    'Most home additions create one of a handful of rooms: a family room, a larger kitchen, a main-floor bedroom, a mudroom or a home office. Which one you need, and where it joins the existing house, shapes the size, the foundation and the permits, so that is where the conversation starts at the on-site visit.',
  types: [
    { title: 'Family room addition', text: 'Extra living space at the back or side of the house, with windows, insulation and heating planned so the room stays comfortable through winter.' },
    { title: 'Kitchen extension', text: 'Pushing the kitchen out to fit an island, a pantry or an eating area, with plumbing, venting and electrical planned alongside the structure.' },
    { title: 'Main-floor bedroom & ensuite', text: 'A bedroom with its own bathroom on the main floor, useful when stairs are getting harder or a family member is moving in.' },
    { title: 'Mudroom & entry addition', text: 'A proper place for boots, coats and gear at the back or side door, with durable flooring and storage built in.' },
    { title: 'Home office or flex room', text: 'A quiet room away from the main living space, wired and lit for work, and easy to turn into something else later.' },
  ],

  local: {
    tag: 'In Winnipeg',
    title: 'What permits does a home addition need in Winnipeg?',
    intro:
      'Two at minimum. The City of Winnipeg requires a development permit and a building permit for every house addition, plus electrical and plumbing permits where that work is involved. The development permit is issued under the Winnipeg Zoning By-law and should be confirmed before the building permit application. We coordinate both with the City or your local municipality.',
    items: [
      { title: 'Development permit', text: 'Every house addition needs one under the Winnipeg Zoning By-law. The City advises confirming it, and any other supporting approvals, before applying for the building permit, since zoning can affect the size and position of the addition.' },
      { title: 'Building permit', text: 'Every house addition also needs a building permit under the Winnipeg Building By-law. The City’s application form lists the documents it needs, and incomplete applications result in delays.' },
      { title: 'Engineered foundations', text: 'Where a structural element goes beyond Part 9 of the Manitoba Building Code, such as concrete grade beams supported on piles, the City requires a sealed drawing from a professional engineer registered in Manitoba and a Professional Designer’s Certificate for Housing.' },
      { title: 'Electrical and plumbing', text: 'If the addition includes electrical or plumbing work, the City requires separate trade permits for it, on top of the development and building permits.' },
      { title: 'Inspections', text: 'Rough-in inspections happen before framing, HVAC, electrical or plumbing work is covered. The final inspection confirms all work under every permit is complete and the addition is ready for occupancy.' },
      { title: 'Outside Winnipeg', text: `In ${NEARBY_AREAS_TEXT_OR}, the local municipality or planning district issues the permits and applies its own zoning rules. We confirm them for your property before plans are finalized.` },
    ],
    sources: [
      { label: 'City of Winnipeg: Additions & attached garages', url: 'https://www.winnipeg.ca/building-development/building-renovating/home-improvement-projects/additions-attached-garages', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Information Bulletin 2026-013-B/S, Engineering requirements for housing', url: 'https://www.winnipeg.ca/media/6133', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Housing inspections', url: 'https://www.winnipeg.ca/building-development/building-renovating/inspections/housing-inspections', accessed: '2026-10-13' },
    ],
  },

  gallery: {
    tag: 'Design Ideas',
    title: 'Home Extension Ideas',
    desc: 'Inspiration photos, not Bridgeland projects. Photos from our own Winnipeg jobs will replace these as each project is documented.',
    items: [
      { img: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80', alt: 'Modern house with wood-slat cladding, dark metal siding, and a tall glass entry', title: 'Mixed Exterior Cladding', text: 'Wood slats, dark metal siding, and a tall glass entry' },
      { img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80', alt: 'Bright living room with a tan leather sofa, white armchairs, and large windows', title: 'Bright Living Room', text: 'Large windows, light wood floors, and a wall of framed photos' },
      { img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', alt: 'Modern two-storey house at dusk with dark wood cladding and large glass walls', title: 'Glass Walls to the Yard', text: 'Floor-to-ceiling glass around a lit dining area' },
    ],
  },

  process: {
    tag: 'How It Works',
    title: 'From First Visit to Finished Addition',
    desc: 'The planning happens early so the construction can move in a clear, practical order.',
    steps: [
      { num: '01', title: 'On-Site Visit', text: 'We visit the property, discuss the space you need, and review where an addition can connect to the existing home.' },
      { num: '02', title: 'Scope & Approvals', text: 'The layout, structural requirements, finishes, price, and schedule are documented in writing before permits and ordering begin.' },
      { num: '03', title: 'Build & Connect', text: 'Foundation and exterior structure come first. Once the addition is weather-tight, we connect utilities and open it into the existing home, with a progress update every week.' },
      { num: '04', title: 'Inspection & Handover', text: 'Required inspections are completed, the final details are checked with you, and the new space is cleaned for handover.' },
    ],
  },

  // Real client testimonial (confirmed by the owner 2026-10-13).
  testimonial: {
    quote:
      'We loved our street but had completely run out of room. Bridgeland helped us add a family room that looks like it was part of the original house. The transitions are clean, the room stays comfortable in winter, and we always knew what was happening next.',
    initial: 'J',
    name: 'Jordan R.',
    role: 'Homeowner, Home Extension',
  },

  faqs: [
    { q: 'How long does a home addition take?', a: `Many straightforward additions take ${TIMELINES.addition.words} once permits and materials are ready. Size, soil and foundation conditions, structural changes, and custom finishes all affect the schedule. You get a timeline with your written quote, and a progress update every week once construction starts, so changes never come as a surprise.` },
    { q: 'Who prepares the drawings for an addition?', a: 'Every addition needs drawings for the development and building permit applications, and the City requires an engineer’s sealed drawing for structural work beyond Part 9 of the Manitoba Building Code. At the on-site visit we talk through who will prepare them for your project, and we build to the approved drawings.' },
    { q: 'Can you make the addition match my existing house?', a: 'That is the goal from the start. We look at rooflines, windows, siding or masonry, floor heights, trim and interior finishes so the addition connects as naturally as possible. Where an exact match isn’t available, we’ll show you the closest options and where a deliberate contrast might look better.' },
    { q: 'Can we stay in the house while the addition is built?', a: 'Usually, for most of the project. The existing house stays closed off while the foundation and shell go up. The wall between old and new is opened only once the addition is weather-tight, and we plan that step and the interior connection to keep the disruption as short as possible.' },
    { q: 'Can the addition include a kitchen or bathroom?', a: 'Yes. Plumbing, electrical, ventilation, heating and structure are planned from the start so those rooms are properly tied into the home’s systems. Kitchens and bathrooms in an addition also need the trade permits that go with them, which we coordinate along with the development and building permits.' },
    { q: 'Should I build an addition or develop my basement?', a: 'If your basement is unfinished and has enough ceiling height, developing it usually adds living space with less structural work. An addition makes more sense when you need the room on the main floor, want more daylight, or the basement is already in use. We can look at both options at the on-site visit.' },
    { q: 'What happens at the free on-site visit?', a: 'We look at the yard, the existing foundation, roofline and exterior, and where the addition would join the house. We talk about the space you need and the zoning questions to check. You then receive a written quote with the scope, so you can see what is included before any permit applications go in.' },
  ],

  // Title, meta description and Service schema for this page. `updated`
  // feeds the sitemap lastmod and WebPage dateModified: bump it only when the
  // page content really changes.
  seo: {
    title: 'Home Additions Winnipeg | Bridgeland Builders',
    description:
      'Home additions in Winnipeg that match the existing house, with permits, foundation, structure and finishes coordinated. Free on-site visit and quote.',
    serviceType: 'Home addition',
    primaryKeyword: 'home addition Winnipeg',
    updated: '2026-10-14',
  },

  // No additions cost page (the estimator has no additions data), so the
  // teaser points to the cost hub's "priced after a visit" section. No numbers.
  costTeaser: {
    text: 'Home additions are priced in a free written quote after an on-site visit, once we have seen the site and agreed the scope with you. Our Winnipeg cost guide explains what moves the price of a renovation and how larger projects are quoted.',
    to: '/renovation-cost-winnipeg#priced-after-a-visit',
    label: 'Renovation costs in Winnipeg',
  },
  // Live pages only are shown; drafts appear when they launch.
  related: ['/services/whole-home-renovations', '/services/basement-renovations', '/services/kitchen-renovations', '/services/general-contracting', '/services/windows-and-doors', '/services/masonry-stucco'],
  guides: ['home-additions-and-zoning-winnipeg', 'what-does-a-general-contractor-do', 'how-to-choose-the-right-contractor-for-your-renovation-project'],
  ownerSignoff: null,
};
