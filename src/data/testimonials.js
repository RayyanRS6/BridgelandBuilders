// Client testimonials: the one list every page reads (the home page, /about-us
// and /our-process show them all; a service page shows the ones its content
// module names in `testimonial`). Rendered by src/components/Testimonial.jsx.
//
// Rules for adding one:
//  - Real clients only, in their own words, with their consent to publish
//    their first name and initial (and area, if given). Never written or
//    improved by us: trim for length only, and mark any cut with "…".
//  - Record where it came from (`source`, and `url` when it is public, e.g. the
//    review on Google) and when (`date`). Google review texts are not copied
//    here without the reviewer's consent; the page links to the profile instead.
//  - `area` (neighbourhood or community) and `project` only when known.
//  - No star ratings unless the source itself has one (plan §19).
//
// The six below are real client reviews, confirmed by the owner on 2026-10-13.
// Where and when each was given was not recorded, so source, url and date are
// empty until the owner supplies them.

/**
 * @typedef {object} Testimonial
 * @property {string} id       stable key; a service module's `testimonial` names it
 * @property {string} quote    the client's words, without quotation marks
 * @property {string} name     first name and last initial, e.g. 'Sandra K.'
 * @property {string} client   'Homeowner' | 'Business owner' | …
 * @property {string} project  project type, e.g. 'Kitchen Renovation'
 * @property {string|null} area    neighbourhood or community, when known
 * @property {string|null} source  e.g. 'Google review', when known
 * @property {string|null} url     link to the public source, when there is one
 * @property {string|null} date    'YYYY-MM-DD' the client gave it, when known
 * @property {string} confirmed    'YYYY-MM-DD' the owner confirmed it is real
 */

/** @type {Testimonial[]} */
export const TESTIMONIALS = [
  {
    id: 'sandra-k',
    quote:
      'We had our whole main floor redone and honestly expected it to be a nightmare. It wasn’t. The crew showed up when they said they would, the site was swept every single night, and when we changed our minds about the flooring halfway through they just sorted it out. The house finally feels like ours.',
    name: 'Sandra K.',
    client: 'Homeowner',
    project: 'Whole Home Renovation',
    area: null,
    source: null,
    url: null,
    date: null,
    confirmed: '2026-10-13',
  },
  {
    id: 'marvin-v',
    quote:
      'They caught something our last quote missed — the fridge door would have blocked the pantry. Small thing, but we’d have lived with it for years. They redrew the layout, built it, and the kitchen actually works now. Cooking in it every day is a pleasure.',
    name: 'Marvin V.',
    client: 'Homeowner',
    project: 'Kitchen Renovation',
    area: null,
    source: null,
    url: null,
    date: null,
    confirmed: '2026-10-13',
  },
  {
    id: 'denise-r',
    quote:
      'Our main bathroom hadn’t been touched since the seventies. Bridgeland stripped it out and had us back in it in under three weeks. They showed me the waterproofing before they tiled over it, which no other contractor bothered to do. Clean work and a fair price.',
    name: 'Denise R.',
    client: 'Homeowner',
    project: 'Bathroom Renovation',
    area: null,
    source: null,
    url: null,
    date: null,
    confirmed: '2026-10-13',
  },
  {
    id: 'trevor-l',
    quote:
      'Two contractors quoted us to frame the basement and neither mentioned the damp patch by the back corner. Bridgeland spotted it in the first ten minutes and dealt with it before they built anything. The basement has been dry through two winters now and the kids basically live down there.',
    name: 'Trevor L.',
    client: 'Homeowner',
    project: 'Basement Renovation',
    area: null,
    source: null,
    url: null,
    date: null,
    confirmed: '2026-10-13',
  },
  {
    id: 'jordan-r',
    quote:
      'We loved our street but had completely run out of room. Bridgeland helped us add a family room that looks like it was part of the original house. The transitions are clean, the room stays comfortable in winter, and we always knew what was happening next.',
    name: 'Jordan R.',
    client: 'Homeowner',
    project: 'Home Extension',
    area: null,
    source: null,
    url: null,
    date: null,
    confirmed: '2026-10-13',
  },
  {
    id: 'amrit-s',
    quote:
      'We had six weeks between the lease starting and our opening date, and everyone told us it was tight. Bridgeland scoped it, worked two weekends to keep us on track, and we opened on the day we’d advertised. We’ve used them for two more locations since.',
    name: 'Amrit S.',
    client: 'Business owner',
    project: 'Retail Fit-Out',
    area: null,
    source: null,
    url: null,
    date: null,
    confirmed: '2026-10-13',
  },
];

/** The testimonials with these ids (one id or a list), in that order. */
export const testimonialsByIds = (ids) =>
  [].concat(ids || []).map((id) => TESTIMONIALS.find((item) => item.id === id)).filter(Boolean);

/** "Homeowner, Kitchen Renovation", plus " · <area>" when the area is known. */
export const testimonialRole = (item) =>
  [[item.client, item.project].filter(Boolean).join(', '), item.area].filter(Boolean).join(' · ');
