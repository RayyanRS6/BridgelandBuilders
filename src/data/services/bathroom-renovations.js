// Bathroom renovations — content for /services/bathroom-renovations (rendered by src/pages/ProjectPage.jsx).
// Registry entry (path, labels, status, estimator, form type): src/data/services.js.
//
// The intro and gallery images are stock inspiration photos, not Bridgeland
// jobs. Keep their alts and captions to what is visible in the photo (no
// "Winnipeg", no "our", no finished-job outcomes) until real job photos with
// client consent replace them.

export default {
  slug: 'bathroom-renovation',
  breadcrumb: 'Bathroom Renovation',
  badge: 'Bathroom Renovations in Winnipeg, Manitoba',
  title: 'BATHROOM RENOVATIONS',
  titleHighlight: 'BUILT TO LAST',
  subtitle:
    'Modern fixtures, clean tiling, and waterproofing done properly underneath where you’ll never see it. Most of our bathrooms are finished in two to three weeks. Pick a day below and we’ll come measure yours.',
  heroPoints: ['Free on-site measure', 'Fixed written price', 'Most baths done in 2–3 weeks'],

  stats: [
    { num: '2', unit: '–3', label: 'Weeks for a typical bathroom' },
    { num: '60', unit: '+', label: 'Years of combined experience' },
    { num: '100', unit: '%', label: 'Waterproofed before tile goes on' },
    { num: '1', unit: 'day', label: 'Reply within one business day' },
  ],

  intro: {
    tag: 'Why Bridgeland for your bath?',
    title: 'The part that matters is the part you can’t see',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'White bathroom with a pedestal sink and black-and-white checkered floor tile',
    floatingTitle: 'Waterproofed Properly',
    floatingText: 'Membrane and sloped base before a single tile goes down.',
    paragraphs: [
      'A bathroom is a small room that punishes shortcuts. Water gets into anything you skip. Most of the failed bathrooms we get called to fix look fine on the surface — the problem started behind the tile two years earlier.',
      'So we do the boring parts properly. Backer board instead of drywall in the wet areas, a proper waterproofing membrane, a shower base sloped the way it should be, and the plumbing checked before anything gets closed up. Then we tile.',
      'Bathrooms are also the job people live around, so we keep it tight. We protect the hallway, we clean up daily, and we don’t leave the room torn open for a month. Most Winnipeg bathrooms we do are finished in two to three weeks from demo to the last bead of silicone.',
    ],
    checklist: ['Tile & Stone Showers', 'Vanities & Counters', 'Proper Waterproofing', 'Fixtures & Lighting'],
  },

  includes: {
    tag: 'What’s Included',
    title: 'What a Bathroom Renovation Covers',
    desc: 'A full bath, taken back to the studs and rebuilt. Smaller refreshes are welcome too — just say so at the measure.',
    items: [
      { num: '01', title: 'Demo & Haul Away', text: 'The old bath comes out, down to the studs and subfloor where needed, and everything leaves in our truck — not your driveway.' },
      { num: '02', title: 'Plumbing & Electrical', text: 'New supply and drain runs, plus the wiring for lighting, fans, and heated floors if you want them.' },
      { num: '03', title: 'Waterproofing', text: 'Backer board, membrane, and a properly sloped shower base. This is the step nobody sees and the one that decides how long the bath lasts.' },
      { num: '04', title: 'Tile Work', text: 'Floor, walls, and shower tiled with the layout planned first so cuts land where they should — not in the middle of the wall.' },
      { num: '05', title: 'Vanity & Fixtures', text: 'Vanity, counter, sink, toilet, taps, and shower hardware set and sealed.' },
      { num: '06', title: 'Paint & Finishing', text: 'Trim, paint, mirrors, and accessories, then a full clean before you see it.' },
    ],
  },

  gallery: {
    tag: 'Design Ideas',
    title: 'Bathroom Renovation Ideas',
    desc: 'Inspiration photos, not Bridgeland projects. Photos from our own Winnipeg jobs will replace these as each project is documented.',
    items: [
      { img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80', alt: 'Bright living room with a tan leather sofa, white armchairs, and large windows', title: 'Light, Bright Palette', text: 'White walls, pale wood floors, and plenty of daylight' },
      { img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80', alt: 'Living room with a grey sofa, wood coffee table, wood floors, and floor-to-ceiling windows', title: 'Warm Wood & Greenery', text: 'Wood tones, potted plants, and floor-to-ceiling windows' },
      { img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', alt: 'Modern two-storey house at dusk with dark wood cladding and large glass walls', title: 'Modern Home at Dusk', text: 'Dark wood cladding and glass walls lit from inside' },
    ],
  },

  process: {
    tag: 'How It Works',
    title: 'Four Steps to a Finished Bathroom',
    desc: 'Short project, tight schedule, and you know the price before we start.',
    steps: [
      { num: '01', title: 'Measure', text: 'We come out, measure the room, look at the plumbing you’ve already got, and talk about what you want to change. Takes about half an hour.' },
      { num: '02', title: 'Fixed Quote', text: 'You get one written price covering labour, materials, and haul-away. If you want to swap a tile or a vanity, we re-price it before anyone orders anything.' },
      { num: '03', title: 'Build', text: 'Demo, rough-in, waterproofing, tile, then fixtures. Hallways get protected, the room gets sealed off, and we sweep up every day.' },
      { num: '04', title: 'Final Check', text: 'We run the water, check every seal, and walk it with you. Anything you’re not happy with gets fixed before we invoice.' },
    ],
  },

  testimonial: {
    quote:
      '“Our main bathroom hadn’t been touched since the seventies. Bridgeland stripped it out and had us back in it in under three weeks. They showed me the waterproofing before they tiled over it, which no other contractor bothered to do. Clean work and a fair price.”',
    initial: 'D',
    name: 'Denise R.',
    role: 'Homeowner, Bathroom Renovation',
  },

  faqs: [
    { q: 'How long will my bathroom be out of service?', a: 'Two to three weeks for a typical full bath. If it’s your only bathroom, tell us at the measure — we plan those tighter and get the toilet back in service as early as we can.' },
    { q: 'Can you move the toilet or shower to a different spot?', a: 'Usually yes. It depends on where the drains run, especially on a concrete slab. We’ll tell you at the measure whether it’s a small change or a bigger one, and what it adds.' },
    { q: 'Do you supply the tile and fixtures or do I?', a: 'Either way works. Most people pick from options we bring, some prefer to shop themselves. If you supply it, just have it on site before we start so the schedule holds.' },
    { q: 'Do you install heated floors?', a: 'Yes, and a bathroom reno is the right time to do it since the floor is already open. It’s a small add while we’re in there and a big difference in a Winnipeg winter.' },
    { q: 'What if you find water damage under the old shower?', a: 'We find it fairly often. We photograph it, show you, and price the repair before we go further. Rotten subfloor gets replaced — we won’t tile over it.' },
  ],

  // Title, meta description and Service schema for this page. `updated`
  // feeds the sitemap lastmod and WebPage dateModified: bump it only when the
  // page content really changes.
  seo: {
    title: 'Bathroom Renovations Winnipeg | Bridgeland Builders',
    description:
      'Bathroom renovations in Winnipeg with reliable waterproofing, durable tile and practical storage. Clear written quotes and a free in-home walkthrough.',
    serviceType: 'Bathroom renovation',
    primaryKeyword: 'bathroom renovation Winnipeg',
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
  related: ['/services/kitchen-renovations', '/services/basement-renovations', '/services/whole-home-renovations'],
  guides: ['which-bathroom-remodel-upgrades-offer-the-best-return-on-investment-for-canadian-homeowners', 'how-to-choose-between-a-full-renovation-and-partial-upgrades', 'how-to-choose-the-right-contractor-for-your-renovation-project'],
  signoff: null,
};
