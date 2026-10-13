// Restaurant & hospitality renovations — DRAFT content for /services/restaurant-renovations (rendered by src/pages/ProjectPage.jsx).
// status: 'draft' in src/data/services.js, so this page is not routed (404),
// not prerendered, not in the sitemap and not linked from the menus yet.
//
// Before setting status: 'live' (plan §7 new-page brief): real copy for every
// section below in the same shape as kitchen-renovations.js, at least three
// owner-specific facts, at least one official source (local.sources), at least
// five owner-answered FAQs and the owner sign-off. Truthful content only: no
// stock photos presented as our work, no insurance/WCB/licence/warranty claims.
// Brief: front and back of house, service hours, food-premises authority (verified), hotels section (owner confirmed hotel work 2026-10-13).

export default {
  slug: 'restaurant-renovations',
  breadcrumb: 'Restaurant Renovation',
  badge: 'Restaurant & Hospitality Renovations in Winnipeg, Manitoba',
  title: 'RESTAURANT RENOVATIONS',
  titleHighlight: '',
  subtitle: '',
  heroPoints: [],

  // Same shapes as the live pages (see kitchen-renovations.js).
  stats: [],
  intro: null,
  includes: null,
  gallery: null,
  process: null,
  testimonial: null,
  faqs: [],

  seo: {
    title: 'Restaurant Renovations Winnipeg | Bridgeland Builders',
    description:
      'Restaurant and hospitality renovations in Winnipeg: dining rooms, bars, kitchens and hotel spaces built around your service hours and opening date.',
    serviceType: 'Restaurant renovation',
    audience: { '@type': 'BusinessAudience', audienceType: 'Businesses and commercial property owners' },
    primaryKeyword: 'restaurant renovation Winnipeg',
    // Set to the launch date when the page goes live.
    updated: null,
  },

  types: [],
  local: null,
  costTeaser: null,
  related: [],
  guides: [],
  signoff: null,
};
