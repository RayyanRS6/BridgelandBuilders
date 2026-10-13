// Basement renovations — content for /services/basement-renovations (rendered by src/pages/ProjectPage.jsx).
// Registry entry (path, labels, status, estimator, form type): src/data/services.js.
//
// The intro and gallery images are stock inspiration photos, not Bridgeland
// jobs. Keep their alts and captions to what is visible in the photo (no
// "Winnipeg", no "our", no finished-job outcomes) until real job photos with
// client consent replace them.

export default {
  slug: 'basement-renovation',
  breadcrumb: 'Basement Renovation',
  badge: 'Basement Renovations in Winnipeg, Manitoba',
  title: 'BASEMENT RENOVATIONS',
  titleHighlight: 'WARM & FINISHED',
  subtitle:
    'A finished family area, a guest space, or an income suite — built dry, insulated properly, and warm enough to actually use in a Winnipeg January. Book a basement assessment and we’ll check the space first.',
  heroPoints: ['Free basement assessment', 'Moisture checked first', 'Egress & permits handled'],

  stats: [
    { num: '60', unit: '+', label: 'Years of combined experience' },
    { num: '100', unit: '+', label: 'Projects completed across Winnipeg' },
    { num: '4', unit: '–8', label: 'Weeks for a typical basement' },
    { num: '1', unit: 'day', label: 'Reply within one business day' },
  ],

  intro: {
    tag: 'Why Bridgeland for your basement?',
    title: 'Get the moisture and insulation right, and the rest is easy',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Room with light grey walls, a black loveseat, a white dresser, and a floor lamp',
    floatingTitle: 'Dry First, Finish Second',
    floatingText: 'We check moisture and insulation before any framing goes up.',
    paragraphs: [
      'Basements are the easiest room to finish badly. Frame straight onto a cold foundation wall, skip the vapour control, and two winters later you’ve got a musty smell and mould behind brand new drywall.',
      'So we start underground, not with paint chips. We check for moisture, look at how water moves around your foundation, and sort out drainage or sealing problems before we frame anything. Then we insulate properly for a Winnipeg winter so the room is actually warm in February.',
      'Once that’s handled, the fun part is easy. Family room, home office, guest suite, gym, a bathroom down there, a wet bar — whatever you’re after. And if you’re thinking about a rental suite, we’ll walk you through the egress window and ceiling height rules before you commit to anything.',
    ],
    checklist: ['Family & Rec Rooms', 'Basement Bathrooms', 'Legal Egress Windows', 'Proper Insulation'],
  },

  includes: {
    tag: 'What’s Included',
    title: 'What a Basement Renovation Covers',
    desc: 'A full finish, from bare concrete to a room you’d happily put guests in.',
    items: [
      { num: '01', title: 'Moisture & Prep', text: 'Checking for water problems, sealing where needed, and making sure the space is dry before anything gets built on it.' },
      { num: '02', title: 'Framing & Insulation', text: 'Walls framed off the foundation and insulated for Winnipeg winters, with vapour control done the right way around.' },
      { num: '03', title: 'Electrical & Mechanical', text: 'Lighting, outlets, and heat runs planned for the new rooms, plus boxing in the ducts and beams so it doesn’t feel like a basement.' },
      { num: '04', title: 'Egress Windows', text: 'Cutting in a legal egress window where you need one — required for a bedroom or a rental suite.' },
      { num: '05', title: 'Bathrooms & Bars', text: 'Adding a bath or a wet bar downstairs, including the drain work that goes with it.' },
      { num: '06', title: 'Floors, Paint & Trim', text: 'Flooring rated for below grade, doors, trim, and paint — finished to the same standard as the rest of your house.' },
    ],
  },

  gallery: {
    tag: 'Design Ideas',
    title: 'Basement Renovation Ideas',
    desc: 'Inspiration photos, not Bridgeland projects. Photos from our own Winnipeg jobs will replace these as each project is documented.',
    items: [
      { img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80', alt: 'Living room with a grey sofa, wood coffee table, wood floors, and floor-to-ceiling windows', title: 'Comfortable Lounge Area', text: 'Grey sofa, wood coffee table, and leather ottomans' },
      { img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', alt: 'Modern two-storey house at dusk with dark wood cladding and large glass walls', title: 'Modern Home at Dusk', text: 'Dark wood cladding and glass walls lit from inside' },
      { img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80', alt: 'Person cooking at a gas cooktop in a white kitchen with a stone island and built-in wall oven', title: 'White Kitchen with Island Cooktop', text: 'Flat-panel cabinets, stone counters, and a built-in wall oven' },
    ],
  },

  process: {
    tag: 'How It Works',
    title: 'From Bare Concrete to Finished Room',
    desc: 'The order matters down here. We don’t skip ahead to the finishes.',
    steps: [
      { num: '01', title: 'Assessment', text: 'We come look at the space — moisture, ceiling height, where the mechanical sits, and what the windows will allow. That tells us what’s realistic before you get attached to a plan.' },
      { num: '02', title: 'Plan & Quote', text: 'A layout for the new rooms and a written price. If you need permits or an egress window, that’s in the plan and we handle the paperwork.' },
      { num: '03', title: 'Build', text: 'Any water issues first, then framing, insulation, mechanical, drywall, and finishes. Basement work is dusty, so we seal the stairwell and run air scrubbing to keep it out of the house.' },
      { num: '04', title: 'Handover', text: 'Inspections signed off where required, a walkthrough with you, and a full clean before we hand it over.' },
    ],
  },

  testimonial: {
    quote:
      '“Two contractors quoted us to frame the basement and neither mentioned the damp patch by the back corner. Bridgeland spotted it in the first ten minutes and dealt with it before they built anything. The basement has been dry through two winters now and the kids basically live down there.”',
    initial: 'T',
    name: 'Trevor L.',
    role: 'Homeowner, Basement Renovation',
  },

  faqs: [
    { q: 'My basement smells damp. Can it still be finished?', a: 'Usually, but not until we know where the moisture is coming from. Sometimes it’s grading or a downspout outside, sometimes it’s a crack in the foundation. We find the cause and fix it first — finishing over a damp basement just hides the problem for a year.' },
    { q: 'Do I need a permit to finish my basement?', a: 'For most finished basements in Winnipeg, yes, and definitely if you’re adding a bedroom, a bathroom, or a suite. We pull the permit and book the inspections as part of the job.' },
    { q: 'What is an egress window and do I need one?', a: 'It’s a window big enough to climb out of in a fire. Any basement bedroom legally needs one. We cut the opening, install it, and take care of the window well.' },
    { q: 'Can you add a bathroom down there?', a: 'Yes. If there’s no existing drain in the right place we either break and re-run the concrete or use an up-flush system. We’ll tell you which one your basement needs and what each costs.' },
    { q: 'Will the basement actually be warm?', a: 'That comes down to insulation and heat supply, and we plan both. Properly insulated walls plus enough heat runs into the new rooms is what makes the difference in January.' },
  ],

  // Title, meta description and Service schema for this page. `updated`
  // feeds the sitemap lastmod and WebPage dateModified: bump it only when the
  // page content really changes.
  seo: {
    title: 'Basement Development & Renovations Winnipeg | Bridgeland',
    description:
      'Basement renovations in Winnipeg — turn an unfinished or dated basement into warm, dry, usable living space. Framing, insulation, egress and finishing handled.',
    serviceType: 'Basement renovation',
    primaryKeyword: 'basement development Winnipeg',
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
  related: ['/services/basement-suites', '/services/bathroom-renovations', '/services/whole-home-renovations', '/services/home-additions'],
  guides: ['how-to-choose-between-a-full-renovation-and-partial-upgrades', 'how-to-choose-the-right-contractor-for-your-renovation-project'],
  signoff: null,
};
