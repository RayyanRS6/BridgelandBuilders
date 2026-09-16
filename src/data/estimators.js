const ESTIMATOR_BASE_URL = 'https://estimator.bridgelandbuilders.com/embed';

export const ESTIMATOR_URLS = {
  overall: ESTIMATOR_BASE_URL,
  residential: `${ESTIMATOR_BASE_URL}?category=residential`,
  commercial: `${ESTIMATOR_BASE_URL}?category=commercial`,
  basement: `${ESTIMATOR_BASE_URL}?service=basement-renovations`,
  bathroom: `${ESTIMATOR_BASE_URL}?service=bathroom-renovations`,
  homeExtension: `${ESTIMATOR_BASE_URL}?service=home-extension`,
  kitchen: `${ESTIMATOR_BASE_URL}?service=kitchen-renovations`,
  wholeHome: `${ESTIMATOR_BASE_URL}?service=whole-home`,
};

export const PROJECT_ESTIMATORS = {
  'basement-renovation': ESTIMATOR_URLS.basement,
  'bathroom-renovation': ESTIMATOR_URLS.bathroom,
  'home-extension': ESTIMATOR_URLS.homeExtension,
  'kitchen-renovation': ESTIMATOR_URLS.kitchen,
  'whole-home-renovation': ESTIMATOR_URLS.wholeHome,
  'commercial-renovation': ESTIMATOR_URLS.commercial,
};
