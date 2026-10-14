// Masonry & stucco — content for /services/masonry-stucco (rendered by src/pages/ProjectPage.jsx).
// Registry entry (path, labels, status, estimator, form type): src/data/services.js.
//
// No intro, gallery or testimonial: there are no real job photos or reviews
// for this service yet, and stock photos are never shown as our work.
// Scope stays to repairs, refinishing and veneer accents (no structural or
// foundation repair claims: those go to an engineer). Every rule and
// guideline in `local` and `faqs` was checked against the page listed in
// local.sources on 2026-10-13. Owner sign-off (ownerSignoff) is still to be added.

import { EXPERIENCE_YEARS, PROJECT_COUNT, REPLY_TIME } from '../facts.js';

const ACCESSED = '2026-10-13';

export default {
  slug: 'masonry-stucco',
  // Used in running text ("Let’s talk about your …", "before booking a …").
  breadcrumb: 'Masonry & Stucco Project',
  badge: 'Brick, Stone & Stucco Repairs',
  title: 'MASONRY & STUCCO',
  titleHighlight: 'IN WINNIPEG',
  subtitle:
    'We repair and refresh brick, stone and stucco on Winnipeg homes and commercial buildings, and we look for the cause of the damage before we patch it. Every job starts with a free on-site visit and a free written quote.',
  heroPoints: ['Free on-site visit', 'Cause found before the repair', 'Materials matched to the building'],

  stats: [
    { num: String(EXPERIENCE_YEARS), unit: '+', label: 'Years of combined experience' },
    { num: String(PROJECT_COUNT), unit: '+', label: 'Projects completed' },
    { num: '$0', unit: '', label: 'On-site visit & written quote' },
    { num: '1', unit: 'day', label: `Reply within ${REPLY_TIME}` },
  ],

  intro: null,

  includes: {
    tag: 'What’s Included',
    title: 'What does masonry and stucco repair include?',
    desc: 'A repair that lasts starts with the cause. We check where water is getting in and whether cracks point to movement, remove damaged material back to a sound base, rebuild with compatible materials and blend the finish. Work is scheduled for weather the mortar and stucco can cure in.',
    items: [
      { num: '01', title: 'Assessment', text: 'Cracks, stains and loose material checked with the gutters, flashing and grading nearby, to tell a surface repair from a bigger problem.' },
      { num: '02', title: 'Stucco Repair', text: 'Damaged stucco cut back to sound material, the backing repaired, and new coats applied and textured to blend in.' },
      { num: '03', title: 'Repointing', text: 'Worn mortar joints raked out and refilled with a mortar suited to the brick or stone, so the joint takes the wear.' },
      { num: '04', title: 'Brick & Stone Repairs', text: 'Loose, cracked or spalled brick and stone reset or replaced, matched as closely as available material allows.' },
      { num: '05', title: 'New Finishes', text: 'New stucco, or stone and brick veneer accents, detailed so water runs off the wall instead of into it.' },
      { num: '06', title: 'Clean-up', text: 'Mortar and stucco debris removed, surrounding surfaces cleaned, and the site left tidy.' },
    ],
  },

  typesTag: 'Project Types',
  typesTitle: 'What masonry and stucco work do we take on?',
  typesDesc:
    'Most calls are repairs: cracked stucco, crumbling mortar joints, and loose or damaged brick and stone. We also refinish tired stucco and add stone or brick veneer accents. A foundation that is moving is a structural question, so it goes to a structural engineer first.',
  types: [
    { title: 'Stucco Crack & Patch Repair', text: 'Hairline cracks to broken sections around windows and corners, repaired and blended into the existing texture.' },
    { title: 'Stucco Refinishing', text: 'A new finish coat over sound stucco, or new stucco where the old has failed, for an even, clean exterior.' },
    { title: 'Brick Repointing', text: 'Mortar joints raked and refilled, with extra care on older brick, where too hard a mortar can damage the brick.' },
    { title: 'Stone & Brick Veneer', text: 'Repairs to existing veneer, and new veneer accents on entries, columns and feature walls.' },
    { title: 'Commercial Exteriors', text: 'Repairs on storefronts and commercial buildings, scheduled after hours or on weekends when the business stays open.' },
  ],

  local: {
    tag: 'In Winnipeg',
    title: 'Do you need a permit for stucco or masonry repair in Winnipeg?',
    intro:
      'Usually not for like-for-like repairs. The City of Winnipeg lists replacing stucco or siding with the same material among projects that don’t need a building permit, although the work still has to meet the building code. Structural foundation repairs do need a permit, and heritage properties may need a heritage permit.',
    items: [
      { title: 'Same-Material Replacement', text: 'Replacing stucco with stucco doesn’t need a building permit. Replacing stucco with vinyl siding does need one: the City treats it as a change to the building envelope.' },
      { title: 'Foundation Repairs', text: 'Structural foundation repairs need a building permit in Winnipeg. A widening, leaking or offset crack needs a structural engineer’s assessment first.' },
      { title: 'Softer Mortar for Older Brick', text: 'National Research Council guidance says repointing mortar should be weaker than the brick or stone and no stronger than the existing mortar, or the masonry can spall.' },
      { title: 'Asbestos in Older Materials', text: 'Health Canada lists older siding, cement and plaster among materials that may contain asbestos, so in pre-1990 buildings suspect material is tested first.' },
      { title: 'Heritage Properties', text: 'In Armstrong’s Point and Crescentwood-Enderton Park, and for buildings on the City’s heritage list, changes to character-defining elements can need a heritage permit.' },
      { title: 'Cold-Weather Curing', text: 'Mortar and stucco need protection from freezing while they cure, so exterior work is planned for warmer weather, or enclosed and heated when it can’t wait.' },
    ],
    sources: [
      { label: 'City of Winnipeg: home improvement projects', url: 'https://www.winnipeg.ca/building-development/home-improvement-projects', accessed: ACCESSED },
      { label: 'City of Winnipeg: Information Bulletin 2026-007-B, Building permit requirements for housing', url: 'https://www.winnipeg.ca/media/6116', accessed: ACCESSED },
      { label: 'City of Winnipeg: heritage permits', url: 'https://www.winnipeg.ca/people-culture/winnipegs-history/heritage-conservation/heritage-permits', accessed: ACCESSED },
      { label: 'National Research Council Canada: repointing mortars for older masonry buildings (Construction Technology Update No. 67)', url: 'https://nrc-publications.canada.ca/eng/view/object/?id=cf8bdb19-c68d-4a05-83b2-a7545a2a7422', accessed: ACCESSED },
      { label: 'Health Canada: health risks of asbestos', url: 'https://www.canada.ca/en/health-canada/services/air-quality/indoor-air-contaminants/health-risks-asbestos.html', accessed: ACCESSED },
      { label: 'Manitoba Workplace Safety and Health: asbestos FAQs', url: 'https://www.gov.mb.ca/labour/safety/faq/asbestos.html', accessed: ACCESSED },
    ],
  },

  gallery: null,

  process: {
    tag: 'How It Works',
    title: 'From Assessment to Finished Wall',
    desc: 'Repairs are booked for weather the materials can cure in. On longer jobs you get a progress update every week.',
    steps: [
      { num: '01', title: 'On-Site Visit', text: 'We look at the damage and its cause, and tell you plainly whether it needs repair, refinishing or an engineer first. The visit is free.' },
      { num: '02', title: 'Written Quote', text: 'A free written quote describing what gets removed and rebuilt, the materials, and how the finish will be matched.' },
      { num: '03', title: 'Repair', text: 'Damaged material removed, and new mortar or stucco applied and protected while it cures.' },
      { num: '04', title: 'Finish & Walkaround', text: 'Texture and colour blended, debris cleaned up, and a walk around the work with you.' },
    ],
  },

  testimonial: null,

  faqsTitle: 'Masonry and Stucco Questions',
  faqs: [
    { q: 'Why is my stucco cracking?', a: 'Fine hairline cracks are common as stucco ages and the building moves with the seasons. Wider or growing cracks, or stucco that bulges or sounds hollow, usually point to water behind it or movement underneath. We find out which before patching, because a patch over an active problem won’t last.' },
    { q: 'Can you match my existing stucco texture?', a: 'A close match is usually possible; a perfect one is rare. Texture depends on the mix and how it was applied, and old stucco has weathered, so a fresh patch can look different at first. On a large repair, a new finish coat over the whole wall gives the most even result.' },
    { q: 'What is repointing, and when is it needed?', a: 'Repointing means raking out worn mortar between bricks or stones and packing in new mortar. It is due when joints are crumbling, recessed or cracked, or when water is getting into the wall. On older brick, the new mortar should be weaker than the brick, or the brick takes the damage.' },
    { q: 'Is a crack in my foundation a masonry repair?', a: 'Not always. A foundation crack that is widening, leaking or offset is a structural question, and the City of Winnipeg requires a building permit for structural foundation repairs. Get a structural engineer’s assessment first; once that repair is settled, we can handle finishing work around it, such as stucco above grade.' },
    { q: 'Can masonry or stucco work be done in winter?', a: 'Mostly it waits for warmer weather. Mortar and stucco need protection from freezing while they cure, so winter work means enclosing and heating the area, which adds cost. Otherwise, book the on-site visit in winter and the work for early in the season.' },
    { q: 'How much does stucco or masonry repair cost?', a: 'It depends on the size of the damage, what caused it, access to the wall, and how much finishing the repair needs to blend in. The on-site visit and written quote are free, and the quote spells out what gets removed and rebuilt.' },
  ],

  // Title, meta description and Service schema for this page. `updated`
  // feeds the sitemap lastmod and WebPage dateModified: bump it only when the
  // page content really changes.
  seo: {
    title: 'Masonry & Stucco Repair Winnipeg | Bridgeland Builders',
    description:
      'Masonry and stucco repair in Winnipeg: cracked stucco, repointing, brick and stone repairs and new finishes. Free on-site visit and written quote.',
    serviceType: 'Masonry and stucco repair',
    // Add to scripts/keyword-map.json (not there yet).
    primaryKeyword: 'masonry and stucco Winnipeg',
    updated: '2026-10-14',
  },

  // Optional sections (plan §7): see kitchen-renovations.js for the shapes.
  // No cost page for this service (no Bridgeland price data), so no teaser.
  costTeaser: null,
  // Live pages only are shown; drafts appear when they launch.
  related: ['/services/exterior-painting', '/services/windows-and-doors', '/services/whole-home-renovations', '/services/commercial-renovations'],
  // Unpublished slugs are skipped by ServiceRoute until the post goes live.
  guides: ['renovating-a-character-home-in-winnipeg', 'clay-soil-basement-cracks-winnipeg'],
  ownerSignoff: null,
};
