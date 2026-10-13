// Kitchen renovations — content for /services/kitchen-renovations (rendered by src/pages/ProjectPage.jsx).
// Registry entry (path, labels, status, estimator, form type): src/data/services.js.
//
// The intro and gallery images are stock inspiration photos, not Bridgeland
// jobs. Keep their alts and captions to what is visible in the photo (no
// "Winnipeg", no "our", no finished-job outcomes) until real job photos with
// client consent replace them.

export default {
  slug: 'kitchen-renovation',
  breadcrumb: 'Kitchen Renovation',
  badge: 'Kitchen Renovations in Winnipeg, Manitoba',
  title: 'KITCHEN RENOVATIONS',
  titleHighlight: 'BUILT FOR REAL LIFE',
  subtitle:
    'Built for comfort, cooking, and durability. We plan the layout around how you actually use the room, then build it with materials that survive daily cooking. Book a design visit and we’ll start with your layout.',
  heroPoints: ['Free layout consultation', 'Cabinet & counter options', 'Appliance fit checked first'],

  stats: [
    { num: '60', unit: '+', label: 'Years of combined experience' },
    { num: '100', unit: '+', label: 'Projects completed across Winnipeg' },
    { num: '4', unit: '–6', label: 'Weeks for a typical kitchen' },
    { num: '1', unit: 'day', label: 'Reply within one business day' },
  ],

  intro: {
    tag: 'Why Bridgeland for your kitchen?',
    title: 'A kitchen is a workspace before it’s a showpiece',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'White kitchen with an island, black bar stools, and crystal pendant lights',
    floatingTitle: 'Layout First',
    floatingText: 'We plan around how you cook, then pick the finishes.',
    paragraphs: [
      'Plenty of kitchens look great in a photo and are miserable to cook in. The fridge door blocks the walkway. There’s nowhere to put a hot pan down beside the stove. The garbage is across the room from the prep counter.',
      'That’s why we start with the layout, not the finishes. We ask who cooks, how many people are usually in the room, and where things go wrong in the kitchen you have now. Then we work out where the sink, stove, and fridge belong, and we build the cabinets around that.',
      'After that, it’s about materials that last. Solid boxes, proper hardware, counters that handle heat and knives, and a backsplash that wipes clean. A kitchen gets used hard every day for fifteen years — we build it to take that.',
    ],
    checklist: ['Custom Cabinetry', 'Counters & Backsplash', 'Islands & Storage', 'Lighting & Appliances'],
  },

  includes: {
    tag: 'What’s Included',
    title: 'What a Kitchen Renovation Covers',
    desc: 'The full build. Doing a lighter refresh instead? Say so and we’ll scope just the parts you want.',
    items: [
      { num: '01', title: 'Layout & Design', text: 'Working out the plan around your cooking, your traffic, and your appliances before a single cabinet gets ordered.' },
      { num: '02', title: 'Demo & Prep', text: 'Old cabinets and counters out, walls patched, and the room ready for the new plan. Everything hauled away.' },
      { num: '03', title: 'Electrical & Plumbing', text: 'Outlets where you’ll actually use them, lighting over the work areas, and the sink and dishwasher lines set for the new layout.' },
      { num: '04', title: 'Cabinetry', text: 'Cabinets set level and secure, with drawers and hardware that still run smoothly in ten years.' },
      { num: '05', title: 'Counters & Backsplash', text: 'Templated, cut, and installed tight to the wall, with the backsplash tiled and sealed over top.' },
      { num: '06', title: 'Appliances & Finish', text: 'Appliances fitted and hooked up, trim and paint finished, and the whole room cleaned before handover.' },
    ],
  },

  gallery: {
    tag: 'Design Ideas',
    title: 'Kitchen Renovation Ideas',
    desc: 'Inspiration photos, not Bridgeland projects. Photos from our own Winnipeg jobs will replace these as each project is documented.',
    items: [
      { img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80', alt: 'Person cooking at a gas cooktop in a white kitchen with a stone island and built-in wall oven', title: 'White Kitchen with Island Cooktop', text: 'Flat-panel cabinets, stone counters, and a built-in wall oven' },
      { img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', alt: 'Modern two-storey house at dusk with dark wood cladding and large glass walls', title: 'Glass Walls to the Yard', text: 'Floor-to-ceiling glass around a lit dining area' },
      { img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80', alt: 'Bright living room with a tan leather sofa, white armchairs, and large windows', title: 'Bright Living Room', text: 'Large windows, light wood floors, and a wall of framed photos' },
    ],
  },

  process: {
    tag: 'How It Works',
    title: 'From Layout to First Dinner',
    desc: 'We order the cabinets early so the build doesn’t stall waiting on them.',
    steps: [
      { num: '01', title: 'Design Visit', text: 'We measure the room and talk through how you use it. You tell us what drives you crazy about the current kitchen — that’s usually the most useful part.' },
      { num: '02', title: 'Plan & Quote', text: 'A layout and a written price. Once you approve it, cabinets and counters get ordered so they arrive when we need them, not three weeks after.' },
      { num: '03', title: 'Build', text: 'Demo, then rough-in, then cabinets, then counters, then backsplash. We set up a temporary spot for your kettle and microwave so you’re not completely stuck.' },
      { num: '04', title: 'Handover', text: 'Appliances connected, drawers adjusted, everything cleaned, and a walkthrough with you before we call it finished.' },
    ],
  },

  testimonial: {
    quote:
      '“They caught something our last quote missed — the fridge door would have blocked the pantry. Small thing, but we’d have lived with it for years. They redrew the layout, built it, and the kitchen actually works now. Cooking in it every day is a pleasure.”',
    initial: 'M',
    name: 'Marvin V.',
    role: 'Homeowner, Kitchen Renovation',
  },

  faqs: [
    { q: 'How long does a kitchen renovation take?', a: 'Four to six weeks for most full kitchens, once the cabinets are on site. The counter template has to happen after the cabinets are set, and that adds about a week in the middle.' },
    { q: 'Will I be without a kitchen the whole time?', a: 'You’ll be without the sink and stove for most of it. We set up a temporary counter with your kettle, microwave, and fridge so you’ve got something to work with.' },
    { q: 'Can you remove the wall between the kitchen and living room?', a: 'Usually. If it’s load-bearing we bring in a beam and do it properly with the right permits. We’ll tell you at the design visit which kind of wall you have.' },
    { q: 'Do you do custom cabinets or stock?', a: 'Both. Stock is quicker and cheaper and fine for a lot of layouts. Custom makes sense when the room is an odd shape or you want the storage designed around specific things.' },
    { q: 'Can I keep my existing appliances?', a: 'Yes — just tell us early so we build the openings to fit them. If you’re replacing them later, get the model numbers to us and we’ll size for the new ones now.' },
  ],

  // Title, meta description and Service schema for this page. `updated`
  // feeds the sitemap lastmod and WebPage dateModified: bump it only when the
  // page content really changes.
  seo: {
    title: 'Kitchen Renovations Winnipeg | Bridgeland Builders',
    description:
      'Kitchen renovations in Winnipeg: better layout, storage, lighting and durable finishes, installed to a clear written scope. Book a free walkthrough.',
    serviceType: 'Kitchen renovation',
    primaryKeyword: 'kitchen renovation Winnipeg',
    updated: '2026-10-13',
  },

  // Optional sections (plan §7), rendered by ProjectPage only when filled in:
  //   types      [{ title, text }]                        "types of <service>" cards
  //   local      { title, intro, items: [{ title, text }], sources: [{ label, url, accessed }] }
  //   costTeaser { text, to }                             1–2 lines + link to the cost page
  //   related    [path]                                   related service pages (registry paths)
  //   guides     [blogSlug]                               related guides (blog posts)
  //   faqsTitle  string                                   heading over the FAQs
  //   signoff    { name, role, date }                     owner sign-off line
  // gallery and testimonial are optional too.
  types: [],
  local: null,
  costTeaser: null,
  // Live pages only are shown; drafts appear when they launch.
  related: ['/services/bathroom-renovations', '/services/whole-home-renovations', '/services/basement-renovations'],
  guides: ['essential-design-strategies-for-small-kitchen-renovations', 'how-to-choose-between-a-full-renovation-and-partial-upgrades', 'how-to-choose-the-right-contractor-for-your-renovation-project'],
  signoff: null,
};
