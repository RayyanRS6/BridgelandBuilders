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
 * Item fields: label, description (defaults to the registry summary),
 * cardDescription (the longer /services card text; defaults to the registry
 * cardDescription, then to description), service (registry slug, optional),
 * hash (optional anchor on that page, e.g. 'hotels'). `to` is filled in below.
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
      // Hotel work is covered on the restaurant & hospitality page; the link
      // goes to its hotel cards (id "hotels" in restaurant-renovations.js).
      {
        label: 'Hotels',
        description: 'Guest rooms, common areas, and phased upgrades designed to limit disruption.',
        cardDescription:
          'Guest rooms and bathrooms, corridors, lobbies, breakfast and meeting rooms, phased by room, floor or wing so the rest of the hotel keeps welcoming guests, with a weekly update to share with management.',
        service: 'restaurant-renovations',
        hash: 'hotels',
      },
      {
        label: 'Property managers & building owners',
        description: 'Reliable turnovers, common-area improvements, and multi-unit renovation support.',
        cardDescription:
          'Vacant-unit turnovers, common areas, washrooms and multi-unit upgrades for property managers and building owners. Each job starts with a free site visit and a written quote, and weekly updates give you something to pass on.',
      },
      {
        label: 'Real estate developers & realtors',
        description: 'Practical improvements that prepare properties for sale, lease, or new occupancy.',
        cardDescription:
          'Practical improvements that get a property ready to sell, lease or occupy. Each job is scoped and quoted in writing after a free site visit, and you get a progress update every week once work starts.',
      },
      {
        label: 'Architects & designers',
        description: 'Construction support that turns supplied drawings and specifications into finished spaces.',
        cardDescription:
          'Construction that turns your drawings and specifications into a finished space. We walk the site against the drawings before work starts and raise conflicts, such as a duct that clashes with a beam, before they become change orders.',
      },
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

const liveLink = (slug, hash) => {
  const service = slug ? serviceBySlug(slug) : null;
  if (!service || service.status !== 'live') return undefined;
  return hash ? `${service.path}#${hash}` : service.path;
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
      const description = item.description || (service && service.summary) || '';
      return {
        label: item.label,
        description,
        cardDescription: item.cardDescription || (service && service.cardDescription) || description,
        to: liveLink(item.service, item.hash),
      };
    }),
    ...SERVICES.filter(
      (service) => service.category === category.id && service.status === 'live' && !named.has(service.slug)
    )
      .sort((a, b) => a.order - b.order)
      .map((service) => ({
        label: service.navLabel,
        description: service.summary,
        cardDescription: service.cardDescription || service.summary,
        to: service.path,
      })),
  ],
}));
