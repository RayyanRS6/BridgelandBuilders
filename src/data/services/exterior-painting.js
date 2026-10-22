// Exterior painting — content for /services/exterior-painting (rendered by src/pages/ProjectPage.jsx).
// Registry entry (path, labels, status, estimator, form type): src/data/services.js.
//
// No intro, gallery or testimonial: there are no real job photos or reviews
// for this service yet, and stock photos are never shown as our work.
// Every rule and guideline in `local` and `faqs` was checked against the page
// listed in local.sources on 2026-10-13. Weather guidance stays general (each
// paint's own label sets its limits). Owner sign-off (ownerSignoff) is still to be added.

import { EXPERIENCE_YEARS, PROJECT_COUNT, REPLY_TIME } from '../facts.js';

const ACCESSED = '2026-10-13';

export default {
  slug: 'exterior-painting',
  // Used in running text ("Let’s talk about your …", "before booking a …").
  breadcrumb: 'Painting Project',
  badge: 'Homes & Commercial Buildings',
  title: 'EXTERIOR PAINTING',
  titleHighlight: 'IN WINNIPEG',
  subtitle:
    'We repaint siding, trim, stucco and doors on Winnipeg homes and commercial buildings, with the preparation done properly so the finish lasts. Work is booked for the warmer months, and every job starts with a free on-site visit and a free written quote.',
  heroPoints: ['Free on-site visit', 'Preparation spelled out in writing', 'Scheduled around the weather'],

  stats: [
    { num: String(EXPERIENCE_YEARS), unit: '+', label: 'Years of combined experience' },
    { num: String(PROJECT_COUNT), unit: '+', label: 'Projects completed' },
    { num: '$0', unit: '', label: 'On-site visit & written quote' },
    { num: '1', unit: 'day', label: `Reply within ${REPLY_TIME}` },
  ],

  intro: null,

  includes: {
    tag: 'What’s Included',
    title: 'What does an exterior paint job include?',
    desc: 'Mostly preparation. We wash the surfaces, scrape loose paint, repair damaged wood and failed caulking, prime bare spots, then apply the finish coats the way the paint maker specifies. Windows, plants and walkways are covered while we work, and the site is cleaned up when we finish.',
    items: [
      { num: '01', title: 'Washing', text: 'Dirt, chalky residue and mildew washed off and the walls left to dry, so the new paint bonds to the surface.' },
      { num: '02', title: 'Scraping & Sanding', text: 'Loose and peeling paint removed and the edges feathered. On older houses, this step is planned around possible lead paint.' },
      { num: '03', title: 'Repairs', text: 'Soft trim boards, failed caulking and small stucco cracks repaired, so the paint isn’t covering a problem.' },
      { num: '04', title: 'Priming', text: 'Bare wood, repairs and stains primed to suit the surface, so the finish coats cover evenly and hold.' },
      { num: '05', title: 'Finish Coats', text: 'Paint applied at the coverage and recoat times on the label, on days inside the product’s temperature range.' },
      { num: '06', title: 'Protection & Clean-up', text: 'Windows, fixtures, plants and walkways covered, and drop cloths, paint chips and debris cleared away at the end.' },
    ],
  },

  typesTag: 'Surfaces',
  typesTitle: 'What can be painted on the outside of a building?',
  typesDesc:
    'Most exterior surfaces can be painted if they are sound and prepared well: wood and fibre cement siding, trim, soffits and fascia, doors and garage doors, and stucco or masonry that has been painted before. Some surfaces need specialty products or are better left unpainted, so we check each one before quoting.',
  types: [
    { title: 'Siding', text: 'Wood, fibre cement and other paintable siding washed, prepared and recoated in the colour you choose.' },
    { title: 'Trim, Soffits & Fascia', text: 'Trim, soffits and fascia repaired where needed and repainted, alone or with the rest of the building.' },
    { title: 'Stucco & Masonry', text: '[Previously painted stucco and masonry](/services/masonry-stucco) recoated with a masonry paint. Never-painted brick and stone is usually better left as it is.' },
    { title: 'Doors & Garage Doors', text: '[Entry doors](/services/windows-and-doors), garage doors and their frames prepared and painted for a clean, durable finish.' },
    { title: 'Commercial Exteriors', text: 'Storefronts, trim and exterior walls on commercial buildings, with evenings or weekends available to keep work clear of customers.' },
  ],

  local: {
    tag: 'In Winnipeg',
    title: 'What should you check before an exterior paint job?',
    intro:
      'Three things: the weather, the age of the old paint, and where the building is. [Paint needs dry days inside the temperature range on its label](/blog/exterior-painting-winnipeg-when-to-paint), a house built before 1960 probably has lead paint underneath, and Winnipeg’s heritage districts have their own review. Painting on its own needs no building permit.',
    items: [
      { title: 'Read the Label', text: 'Every exterior paint lists its own application temperature range. Cool weather slows drying, so a cold night after a warm afternoon matters too.' },
      { title: 'Dew and Rain', text: 'A wall that looks dry can carry morning dew. Paint makers advise painting only when the surface is several degrees above the dew point, and stopping when rain arrives.' },
      { title: 'Sun and Heat', text: 'A dark wall in full sun can run much hotter than the air, so paint each side while it is out of direct sun.' },
      { title: 'Lead Paint on Older Houses', text: 'Health Canada says a house built before 1960 probably has lead-based paint, and advises against sanders, heat guns and blowlamps on it.' },
      { title: 'Heritage Districts', text: 'In [Armstrong’s Point and Crescentwood-Enderton Park](/blog/renovating-a-character-home-in-winnipeg), exterior work is reviewed against the district plan, which decides when a heritage permit is needed.' },
      { title: 'No Building Permit', text: 'The City of Winnipeg treats painting as [a cosmetic change that doesn’t need a building permit](/blog/winnipeg-renovation-permits).' },
    ],
    sources: [
      { label: 'Benjamin Moore Canada: painting temperatures', url: 'https://www.benjaminmoore.com/en-ca/interior-exterior-paints-stains/how-to-advice/exteriors/temperature', accessed: ACCESSED },
      { label: 'Health Canada: lead-based paint', url: 'https://www.canada.ca/en/health-canada/services/home-safety/lead-based-paint.html', accessed: ACCESSED },
      { label: 'City of Winnipeg: heritage permits', url: 'https://www.winnipeg.ca/people-culture/winnipegs-history/heritage-conservation/heritage-permits', accessed: ACCESSED },
      { label: 'City of Winnipeg: home renovations', url: 'https://www.winnipeg.ca/building-development/building-renovating/home-improvement-projects/home-renovations', accessed: ACCESSED },
    ],
  },

  gallery: null,

  process: {
    tag: 'How It Works',
    title: 'From Colour Choice to Final Coat',
    desc: 'Exterior painting runs on the weather, so the schedule has some give built in. On longer jobs you get a progress update every week.',
    steps: [
      { num: '01', title: 'On-Site Visit', text: 'We walk every side of the building, note peeling and damage, and talk through colours and timing. The visit is free.' },
      { num: '02', title: 'Written Quote', text: 'A free written quote spelling out the preparation, repairs, products and number of coats, so you can compare quotes on the work, not just the price.' },
      { num: '03', title: 'Prep & Paint', text: 'Washing, scraping, repairs and priming first, then finish coats on dry days inside the product’s temperature range.' },
      { num: '04', title: 'Final Walkaround', text: 'We walk the building with you, touch up anything missed, take down the covers and clean up.' },
    ],
  },

  testimonial: null,

  faqsTitle: 'Exterior Painting Questions',
  faqs: [
    { q: 'Why is my exterior paint peeling?', a: 'Peeling usually comes from moisture getting behind the paint, poor adhesion to a dirty or chalky surface, or too many old layers. We look for the cause at the on-site visit, such as a leaking gutter or missing caulking, because painting over it brings the peeling back.' },
    { q: 'Can you paint stucco?', a: 'Yes, when it is sound. Cracks are repaired first, and a masonry paint is used so moisture can still escape. Stucco that has never been painted is a bigger decision, because once painted it needs repainting from then on. If paint isn’t the right fix, we will tell you.' },
    { q: 'Can exterior painting be done in the fall?', a: 'Often, as long as the days and nights stay inside the paint’s temperature range and the walls are dry. Shorter days and colder nights slow drying, so each side is planned around the forecast. If the season runs out, booking the work for spring beats painting into frost.' },
    { q: 'Is the old paint on my house lead-based?', a: 'If the house was built before 1960, Health Canada says it probably has lead-based paint, and houses from 1960 to 1990 may have it on the exterior. A lab test of paint chips, or a contractor with x-ray detection equipment, can confirm it. Until then, avoid dry sanding and heat guns.' },
    { q: 'Do you paint commercial buildings?', a: 'Yes. We paint storefronts, trim and exterior walls on commercial properties, and work can be scheduled after hours or on weekends to stay clear of customers and staff. Longer jobs come with a weekly progress update, so you know which side of the building is next.' },
    { q: 'How much does exterior painting cost?', a: 'It depends on the size of the building, the surfaces, how much scraping and repair the walls need, access to high areas, and the paint. The on-site visit and written quote are free, and the quote lists the preparation, repairs and coats so you can see what you are paying for.' },
  ],

  // Title, meta description and Service schema for this page. `updated`
  // feeds the sitemap lastmod and WebPage dateModified: bump it only when the
  // page content really changes.
  seo: {
    title: 'Exterior Painting Winnipeg | Bridgeland Builders',
    description:
      'Exterior painting in Winnipeg for homes and commercial buildings: careful prep, repairs and weather-planned coats. Free on-site visit and written quote.',
    serviceType: 'Exterior painting',
    // Add to scripts/keyword-map.json (not there yet).
    primaryKeyword: 'exterior painting Winnipeg',
    updated: '2026-10-23',
  },

  // Optional sections (plan §7): see kitchen-renovations.js for the shapes.
  // No cost page for this service (no Bridgeland price data), so no teaser.
  costTeaser: null,
  // Live pages only are shown; drafts appear when they launch.
  related: ['/services/windows-and-doors', '/services/masonry-stucco', '/services/whole-home-renovations', '/services/commercial-renovations'],
  // Unpublished slugs are skipped by ServiceRoute until the post goes live.
  guides: ['exterior-painting-winnipeg-when-to-paint', 'renovating-a-character-home-in-winnipeg'],
  ownerSignoff: null,
};
