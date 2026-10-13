// Whole home renovations — content for /services/whole-home-renovations (rendered by src/pages/ProjectPage.jsx).
// Registry entry (path, labels, status, estimator, form type): src/data/services.js.
//
// The intro and gallery images are stock inspiration photos, not Bridgeland
// jobs. Keep their alts and captions to what is visible in the photo (no
// "Winnipeg", no "our", no finished-job outcomes) until real job photos with
// client consent replace them.

export default {
  slug: 'whole-home-renovation',
  breadcrumb: 'Whole Home Renovation',
  badge: 'Whole Home Renovations in Winnipeg, Manitoba',
  title: 'WHOLE HOME RENOVATIONS',
  titleHighlight: 'DONE RIGHT',
  subtitle:
    'One crew, one plan, one finish line. We take the whole house on — layout, kitchen, baths, floors, paint — so everything lines up when we hand you the keys back. Book a walkthrough and we’ll talk it through in your own space.',
  heroPoints: ['Free in-home walkthrough', 'Clear written scope', 'One point of contact'],

  stats: [
    { num: '60', unit: '+', label: 'Years of combined experience' },
    { num: '100', unit: '+', label: 'Projects completed across Winnipeg' },
    { num: '8', unit: '–16', label: 'Weeks for most whole home renovations' },
    { num: '1', unit: 'day', label: 'Reply within one business day' },
  ],

  intro: {
    tag: 'Why a whole home renovation?',
    title: 'Everything gets touched, so everything has to match',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Modern two-storey house at dusk with dark wood cladding and large glass walls',
    floatingTitle: 'One Crew, Start to Finish',
    floatingText: 'No juggling five contractors. We handle the whole thing.',
    paragraphs: [
      'A whole home renovation is the one job where the details really have to agree with each other. The floor in the hallway has to meet the kitchen right. The trim in the living room has to match the bedrooms. When five different contractors handle five different rooms, that’s where things go sideways.',
      'We take the whole house so that doesn’t happen. One schedule, one set of materials, one crew that already knows what the next trade needs. You get one person to call, and you always know what’s happening this week.',
      'Most of our whole home projects in Winnipeg run in stages so you can stay in the house where possible. If you’d rather we go all at once and get out faster, we can plan it that way too — it’s your call, and we’ll be straight with you about what each option costs you in time.',
    ],
    checklist: ['Open-Concept Layouts', 'Kitchens & Baths', 'Flooring Throughout', 'Paint & Trim'],
  },

  includes: {
    tag: 'What’s Included',
    title: 'What a Whole Home Renovation Covers',
    desc: 'The usual scope on a full-house job. If your list looks different, tell us at the walkthrough and we’ll adjust it.',
    items: [
      { num: '01', title: 'Layout & Walls', text: 'Opening up living areas, moving or removing non-structural walls, and framing new rooms where you need them.' },
      { num: '02', title: 'Kitchen', text: 'Full kitchen build — cabinets, counters, backsplash, appliance fit, plus the plumbing and electrical behind it all.' },
      { num: '03', title: 'Bathrooms', text: 'Every bath in the house brought up to the same standard, with proper waterproofing under the tile.' },
      { num: '04', title: 'Flooring', text: 'One continuous flooring plan across the main level so rooms flow instead of stopping at every doorway.' },
      { num: '05', title: 'Paint, Trim & Doors', text: 'New baseboards, casings, interior doors, and a full repaint so the finish is consistent room to room.' },
      { num: '06', title: 'Electrical & Plumbing', text: 'Updated wiring, lighting, and plumbing runs where the old ones aren’t up to what the new layout needs.' },
    ],
  },

  gallery: {
    tag: 'Design Ideas',
    title: 'Whole Home Renovation Ideas',
    desc: 'Inspiration photos, not Bridgeland projects. Photos from our own Winnipeg jobs will replace these as each project is documented.',
    items: [
      { img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80', alt: 'Bright living room with a tan leather sofa, white armchairs, and large windows', title: 'Bright Living Room', text: 'Large windows, light wood floors, and a wall of framed photos' },
      { img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80', alt: 'Person cooking at a gas cooktop in a white kitchen with a stone island and built-in wall oven', title: 'White Kitchen with Island Cooktop', text: 'Flat-panel cabinets, stone counters, and a built-in wall oven' },
      { img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80', alt: 'Living room with a grey sofa, wood coffee table, wood floors, and floor-to-ceiling windows', title: 'Warm Wood & Neutrals', text: 'Wood floors, a grey sofa, and floor-to-ceiling corner windows' },
    ],
  },

  process: {
    tag: 'How It Works',
    title: 'From First Walkthrough to Final Clean',
    desc: 'Four steps, and you’ll know where the project stands at every one of them.',
    steps: [
      { num: '01', title: 'Walkthrough', text: 'We come to the house, look at every room with you, and listen to what’s working and what isn’t. Bring your wish list — no idea is too big to talk about.' },
      { num: '02', title: 'Plan & Quote', text: 'You get a written scope, room by room, with what’s included and what it costs. Nothing starts until you’ve read it and you’re happy with it.' },
      { num: '03', title: 'Build', text: 'Demo, framing, mechanical, then finishes — in that order, on a schedule you can see. We keep the site clean and we tell you before anything noisy or disruptive happens.' },
      { num: '04', title: 'Walkthrough & Handover', text: 'We walk the whole house with you and fix anything on your list before we call it done. Then we clean up and get out of your way.' },
    ],
  },

  testimonial: {
    quote:
      '“We had our whole main floor redone and honestly expected it to be a nightmare. It wasn’t. The crew showed up when they said they would, the site was swept every single night, and when we changed our minds about the flooring halfway through they just sorted it out. The house finally feels like ours.”',
    initial: 'S',
    name: 'Sandra K.',
    role: 'Homeowner, Whole Home Renovation',
  },

  faqs: [
    { q: 'How long does a whole home renovation take?', a: 'Most of ours run eight to sixteen weeks depending on the size of the house and how much of it we’re touching. You get a schedule with your quote, and if something shifts we tell you the same week — not at the end.' },
    { q: 'Can we stay in the house while you work?', a: 'Often yes, if we stage it in sections and keep a kitchen and bathroom live for you. Sometimes it’s faster and cheaper to move out for a few weeks. We’ll lay out both options at the walkthrough and let you decide.' },
    { q: 'Do you handle permits?', a: 'Yes. Where the work needs a permit from the City of Winnipeg, we pull it and we schedule the inspections. You don’t have to chase any of that.' },
    { q: 'Do I pick the materials or do you?', a: 'You do — we just narrow it down. We’ll bring options that fit your budget and hold up long term, and you choose from there. If you’d rather hand it to us entirely, that’s fine too.' },
    { q: 'What happens if you find something unexpected behind a wall?', a: 'It happens on older homes — old wiring, water damage, sometimes a wall that’s holding more than it should. We stop, show you what we found, and price the fix before we carry on. No surprise line items at the end.' },
  ],

  // Title, meta description and Service schema for this page. `updated`
  // feeds the sitemap lastmod and WebPage dateModified: bump it only when the
  // page content really changes.
  seo: {
    title: 'Whole Home Renovations Winnipeg | Bridgeland Builders',
    description:
      'Whole home renovations in Winnipeg under one plan — layout, kitchen, baths, flooring and paint coordinated to a single finish date. Free walkthrough.',
    serviceType: 'Whole home renovation',
    primaryKeyword: 'whole home renovation Winnipeg',
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
  related: ['/services/kitchen-renovations', '/services/bathroom-renovations', '/services/home-additions', '/services/general-contracting'],
  guides: ['how-to-choose-between-a-full-renovation-and-partial-upgrades', 'how-to-choose-the-right-contractor-for-your-renovation-project', 'mastering-general-contracting-tips-for-your-next-project'],
  signoff: null,
};
