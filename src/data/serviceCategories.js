import { SERVICES, serviceBySlug } from './services.js';

/**
 * The service categories shown in the navbar mega menu and the /services
 * directory. Links come from the page registry (src/data/services.js): an
 * item naming a `service` links to that page only while its status is 'live';
 * otherwise it stays a plain label (navbar) / "Ask about this service" card
 * (directory), exactly as before the page exists. A live registry page that no
 * item names is added to the end of its category, so a newly launched page is
 * always reachable from both menus.
 *
 * Item fields: label, description (defaults to the registry summary), service
 * (registry slug, optional). `to` is filled in below.
 */
const CATEGORIES = [
  {
    id: 'residential',
    label: 'Residential renovations',
    description: 'Thoughtful renovations that make your home work better, feel better, and hold up to everyday life.',
    services: [
      { label: 'Basement renovations', service: 'basement-renovations' },
      { label: 'Bathroom renovations', service: 'bathroom-renovations' },
      { label: 'Home additions', service: 'home-additions' },
      { label: 'Kitchen renovations', service: 'kitchen-renovations' },
      { label: 'Whole home renovations', service: 'whole-home-renovations' },
    ],
  },
  {
    id: 'commercial',
    label: 'Commercial renovations',
    description: 'Commercial spaces planned around your opening date, operating hours, customers, and staff.',
    overviewTo: '/services/commercial-renovations',
    services: [
      { label: 'Retail spaces', service: 'retail-renovations' },
      { label: 'Office renovations', service: 'office-renovations' },
      { label: 'Restaurants & hospitality', service: 'restaurant-renovations' },
      { label: 'Medical & dental offices', service: 'medical-dental-office-renovations' },
      // Hotel work is covered on the restaurant & hospitality page.
      { label: 'Hotels', description: 'Guest rooms, common areas, and phased upgrades designed to limit disruption.', service: 'restaurant-renovations' },
      { label: 'Property managers & building owners', description: 'Reliable turnovers, common-area improvements, and multi-unit renovation support.' },
      { label: 'Real estate developers & realtors', description: 'Practical improvements that prepare properties for sale, lease, or new occupancy.' },
      { label: 'Architects & designers', description: 'Construction support that turns supplied drawings and specifications into finished spaces.' },
    ],
  },
  {
    id: 'additional',
    label: 'Additional services',
    description: 'Focused exterior, finishing, and construction services delivered with the same attention to detail.',
    services: [
      { label: 'Windows and doors installation', service: 'windows-and-doors' },
      { label: 'Exterior painting', service: 'exterior-painting' },
      { label: 'Stone, bricks, stucco & masonry', service: 'masonry-stucco' },
      { label: 'Flooring', service: 'flooring' },
      { label: 'Demolition', service: 'demolition' },
    ],
  },
];

const liveLink = (slug) => {
  const service = slug ? serviceBySlug(slug) : null;
  return service && service.status === 'live' ? service.path : undefined;
};

// The commercial hub is the category's overview link, not a list item.
const named = new Set([
  ...CATEGORIES.flatMap((category) => category.services.map((item) => item.service)),
  'commercial-renovations',
]);

export const SERVICE_CATEGORIES = CATEGORIES.map((category) => ({
  ...category,
  services: [
    ...category.services.map((item) => {
      const service = item.service ? serviceBySlug(item.service) : null;
      return {
        label: item.label,
        description: item.description || (service && service.summary) || '',
        to: liveLink(item.service),
      };
    }),
    ...SERVICES.filter(
      (service) => service.category === category.id && service.status === 'live' && !named.has(service.slug)
    )
      .sort((a, b) => a.order - b.order)
      .map((service) => ({ label: service.navLabel, description: service.summary, to: service.path })),
  ],
}));
