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

export const PROJECT_ESTIMATORS = {
  'basement-renovation': ESTIMATOR_URLS.basement,
  'bathroom-renovation': ESTIMATOR_URLS.bathroom,
  'home-extension': ESTIMATOR_URLS.homeExtension,
  'kitchen-renovation': ESTIMATOR_URLS.kitchen,
  'whole-home-renovation': ESTIMATOR_URLS.wholeHome,
  'commercial-renovation': ESTIMATOR_URLS.commercial,
};
