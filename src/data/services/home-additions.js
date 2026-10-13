// Home additions — content for /services/home-additions (rendered by src/pages/ProjectPage.jsx).
// Registry entry (path, labels, status, estimator, form type): src/data/services.js.
//
// The intro and gallery images are stock inspiration photos, not Bridgeland
// jobs. Keep their alts and captions to what is visible in the photo (no
// "Winnipeg", no "our", no finished-job outcomes) until real job photos with
// client consent replace them.

export default {
  // Project slug kept from before the rename to "home additions" (plan D6): it
  // keys PROJECT_ESTIMATORS and the estimator's service=home-extension param.
  slug: 'home-extension',
  breadcrumb: 'Home Addition',
  badge: 'Home Additions in Winnipeg, Manitoba',
  title: 'HOME ADDITIONS',
  titleHighlight: 'BUILT TO BELONG',
  subtitle:
    'Add the room your home is missing without giving up the neighbourhood you love. We plan, permit, and build extensions that connect naturally to the existing house, inside and out.',
  heroPoints: ['Free property walkthrough', 'Design and permits coordinated', 'One team from foundation to finish'],

  stats: [
    { num: '60', unit: '+', label: 'Years of combined experience' },
    { num: '100', unit: '+', label: 'Projects completed across Winnipeg' },
    { num: '8', unit: '-16', label: 'Weeks for many home extensions' },
    { num: '1', unit: 'day', label: 'Reply within one business day' },
  ],

  intro: {
    tag: 'Why extend your home?',
    title: 'More space without starting over somewhere else',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Open-plan living area with a white sectional sofa, a wood feature wall, and sliding glass doors',
    floatingTitle: 'Designed as One Home',
    floatingText: 'Rooflines, floors, trim, and finishes planned to connect naturally.',
    paragraphs: [
      'Sometimes the location is right but the house has stopped fitting. A larger kitchen, a family room, a main-floor bedroom, or a proper mudroom can give you the space you need without the cost and disruption of moving.',
      'A good extension should not feel attached as an afterthought. We study the existing roofline, foundation, floor heights, mechanical systems, and exterior materials before the design is finalized. That early work is what makes the new space feel like part of the original home.',
      'We coordinate the build from excavation and structure through insulation, utilities, drywall, flooring, and final paint. You have one team and one clear schedule instead of managing separate trades yourself.',
    ],
    checklist: ['Kitchen Extensions', 'Family Rooms', 'Main-Floor Bedrooms', 'Mudrooms & Entry Additions'],
  },

  includes: {
    tag: 'What Is Included',
    title: 'What a Home Extension Covers',
    desc: 'A complete addition planned around your property, your existing house, and how the new room will be used.',
    items: [
      { num: '01', title: 'Site & Feasibility Review', text: 'Checking the available space, access, existing structure, services, and practical limits before the design moves ahead.' },
      { num: '02', title: 'Design & Permits', text: 'Developing the layout, coordinating drawings and engineering, and organizing the permits required for the approved scope.' },
      { num: '03', title: 'Foundation & Structure', text: 'Excavation, foundation work, framing, roofing, windows, and exterior closure completed in the correct sequence.' },
      { num: '04', title: 'Electrical, Plumbing & HVAC', text: 'Extending the home systems safely so the new room has the lighting, outlets, plumbing, heating, and cooling it needs.' },
      { num: '05', title: 'Interior Connection', text: 'Opening the existing house and carefully matching floor heights, openings, trim, and transitions between old and new.' },
      { num: '06', title: 'Exterior & Final Finishes', text: 'Siding or masonry, insulation, drywall, flooring, paint, fixtures, inspections, and a complete cleanup before handover.' },
    ],
  },

  gallery: {
    tag: 'Design Ideas',
    title: 'Home Extension Ideas',
    desc: 'Inspiration photos, not Bridgeland projects. Photos from our own Winnipeg jobs will replace these as each project is documented.',
    items: [
      { img: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80', alt: 'Modern house with wood-slat cladding, dark metal siding, and a tall glass entry', title: 'Mixed Exterior Cladding', text: 'Wood slats, dark metal siding, and a tall glass entry' },
      { img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80', alt: 'Bright living room with a tan leather sofa, white armchairs, and large windows', title: 'Bright Living Room', text: 'Large windows, light wood floors, and a wall of framed photos' },
      { img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', alt: 'Modern two-storey house at dusk with dark wood cladding and large glass walls', title: 'Glass Walls to the Yard', text: 'Floor-to-ceiling glass around a lit dining area' },
    ],
  },

  process: {
    tag: 'How It Works',
    title: 'From Property Walkthrough to Finished Addition',
    desc: 'The planning happens early so the construction can move in a clear, practical order.',
    steps: [
      { num: '01', title: 'Walkthrough & Feasibility', text: 'We visit the property, discuss the space you need, and review where an extension can connect to the existing home.' },
      { num: '02', title: 'Design, Scope & Approvals', text: 'The layout, structural requirements, finishes, price, and schedule are documented before permits and ordering begin.' },
      { num: '03', title: 'Build & Connect', text: 'Foundation and exterior structure come first. Once the addition is weather-tight, we connect utilities and open it into the existing home.' },
      { num: '04', title: 'Inspection & Handover', text: 'Required inspections are completed, the final details are checked with you, and the new space is cleaned for handover.' },
    ],
  },

  testimonial: {
    quote:
      'We loved our street but had completely run out of room. Bridgeland helped us add a family room that looks like it was part of the original house. The transitions are clean, the room stays comfortable in winter, and we always knew what was happening next.',
    initial: 'J',
    name: 'Jordan R.',
    role: 'Homeowner, Home Extension',
  },

  faqs: [
    { q: 'Do I need a permit for a home extension?', a: 'Yes, an extension normally requires drawings, permits, and inspections. We include those requirements in the plan and coordinate the process for the approved project.' },
    { q: 'How long does a home extension take?', a: 'Many straightforward additions take roughly eight to sixteen weeks once permits and materials are ready. Size, foundation conditions, structural changes, and custom finishes can affect the schedule.' },
    { q: 'Can you make the extension match my existing house?', a: 'That is part of the design. We review rooflines, windows, siding or masonry, floor heights, trim, and interior finishes so the addition connects as naturally as possible.' },
    { q: 'Can we stay in the house while the extension is built?', a: 'Usually, for much of the project. We keep the existing home closed off while the exterior shell is built, then plan the final opening and interior connection to limit disruption.' },
    { q: 'Can the extension include a kitchen or bathroom?', a: 'Yes. We plan plumbing, electrical, ventilation, heating, and structural requirements from the start so those rooms are properly integrated into the home systems.' },
  ],

  // Title, meta description and Service schema for this page. `updated`
  // feeds the sitemap lastmod and WebPage dateModified: bump it only when the
  // page content really changes.
  seo: {
    title: 'Home Additions Winnipeg | Bridgeland Builders',
    description:
      'Home additions in Winnipeg designed to match the existing house, with permits, structure and finishing coordinated by one contractor.',
    serviceType: 'Home addition',
    primaryKeyword: 'home addition Winnipeg',
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
  related: ['/services/whole-home-renovations', '/services/basement-renovations', '/services/kitchen-renovations', '/services/general-contracting'],
  guides: ['how-to-choose-the-right-contractor-for-your-renovation-project', 'mastering-general-contracting-tips-for-your-next-project'],
  signoff: null,
};
