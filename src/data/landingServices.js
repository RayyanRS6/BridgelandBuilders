// Services featured on the /free-quote ad landing page, in display order.
// To feature another service, add one entry here — the page lays the cards out
// three to a row and wraps automatically.
//
// `formType` is the matching "Type of renovation" option in src/data/quoteForm.js;
// clicking the card's button scrolls up to the form with that type already ticked.
//
// Copy is taken from each service's own page (src/data/projects.js), so every
// claim here already appears on the site.
export const LANDING_SERVICES = [
  {
    id: 'kitchen',
    formType: 'Kitchen',
    title: 'Kitchen Renovations',
    tag: 'Typically 4–6 weeks',
    img: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    alt: 'Kitchen renovation in Winnipeg',
    text: 'We plan the layout around how you actually use the room, then build it with materials that survive daily cooking.',
    points: ['Free layout consultation', 'Cabinet & counter options', 'Appliance fit checked first'],
    cta: 'Get my free kitchen quote',
  },
  {
    id: 'bathroom',
    formType: 'Bathroom',
    title: 'Bathroom Renovations',
    tag: 'Typically 2–3 weeks',
    img: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80',
    alt: 'Bathroom renovation in Winnipeg',
    text: 'Modern fixtures, clean tiling, and waterproofing done properly underneath where you’ll never see it.',
    points: ['Free on-site measure', 'Fixed written price', 'Waterproofed before tile goes on'],
    cta: 'Get my free bathroom quote',
  },
  {
    id: 'basement',
    formType: 'Basement',
    title: 'Basement Renovations',
    tag: 'Typically 4–8 weeks',
    img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    alt: 'Basement renovation in Winnipeg',
    text: 'A family room, guest space or income suite — built dry, insulated properly, and warm enough to use in a Winnipeg January.',
    points: ['Free basement assessment', 'Moisture checked first', 'Egress & permits handled'],
    cta: 'Get my free basement quote',
  },
];
