const ESTIMATOR_BASE_URL = 'https://estimator.bridgelandbuilders.com/embed';

// Asks the Price Calculator for its Bridgeland theme, so the embed uses this site's
// colours, buttons and cards. The same link opened on its own (without `theme`)
// keeps the calculator's original look.
const ESTIMATOR_THEME = 'bridgeland';

function estimatorUrl(params = {}) {
  const query = new URLSearchParams({ ...params, theme: ESTIMATOR_THEME });
  return `${ESTIMATOR_BASE_URL}?${query}`;
}

export const ESTIMATOR_URLS = {
  overall: estimatorUrl(),
  residential: estimatorUrl({ category: 'residential' }),
  commercial: estimatorUrl({ category: 'commercial' }),
  basement: estimatorUrl({ service: 'basement-renovations' }),
  bathroom: estimatorUrl({ service: 'bathroom-renovations' }),
  homeExtension: estimatorUrl({ service: 'home-extension' }),
  kitchen: estimatorUrl({ service: 'kitchen-renovations' }),
  wholeHome: estimatorUrl({ service: 'whole-home' }),
};

// The estimator each service page embeds, keyed by the registry's projectSlug
// (src/data/services.js). The first six keys are the original project slugs.
export const PROJECT_ESTIMATORS = {
  'basement-renovation': ESTIMATOR_URLS.basement,
  'bathroom-renovation': ESTIMATOR_URLS.bathroom,
  'home-extension': ESTIMATOR_URLS.homeExtension,
  'kitchen-renovation': ESTIMATOR_URLS.kitchen,
  'whole-home-renovation': ESTIMATOR_URLS.wholeHome,
  'commercial-renovation': ESTIMATOR_URLS.commercial,
  // Commercial verticals use the commercial estimator.
  'office-renovations': ESTIMATOR_URLS.commercial,
  'retail-renovations': ESTIMATOR_URLS.commercial,
  'restaurant-renovations': ESTIMATOR_URLS.commercial,
  'medical-dental-office-renovations': ESTIMATOR_URLS.commercial,
  // Basement suites use the basement estimator.
  'basement-suites': ESTIMATOR_URLS.basement,
  // General contracting and the additional services use the overall estimator.
  'general-contracting': ESTIMATOR_URLS.overall,
  'windows-and-doors': ESTIMATOR_URLS.overall,
  'exterior-painting': ESTIMATOR_URLS.overall,
  'masonry-stucco': ESTIMATOR_URLS.overall,
  flooring: ESTIMATOR_URLS.overall,
  demolition: ESTIMATOR_URLS.overall,
};
