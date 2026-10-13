// Bathroom renovations — content for /services/bathroom-renovations (rendered by src/pages/ProjectPage.jsx).
// Registry entry (path, labels, status, estimator, form type): src/data/services.js.
//
// The intro and gallery images are stock inspiration photos, not Bridgeland
// jobs. Keep their alts and captions to what is visible in the photo (no
// "Winnipeg", no "our", no finished-job outcomes) until real job photos with
// client consent replace them.
//
// Facts: the 2–3 week timeline, free on-site visit and written quote, and
// permit coordination are owner-confirmed. Every City of Winnipeg / Health
// Canada statement in `local` and the FAQs was checked on 2026-10-13 against
// the sources listed in local.sources. The only price on the page is the
// instant estimator's starting range (costTeaser, estimator data 2026-10-13).

export default {
  slug: 'bathroom-renovation',
  breadcrumb: 'Bathroom Renovation',
  badge: 'Bathroom Renovation Contractor in Winnipeg',
  title: 'BATHROOM RENOVATIONS',
  titleHighlight: 'IN WINNIPEG',
  subtitle:
    'We renovate bathrooms, ensuites and powder rooms in Winnipeg and nearby communities, with the waterproofing done properly under the tile. Most bathrooms take two to three weeks from demolition to final clean.',
  heroPoints: ['Free on-site visit', 'Free written quote', 'Most baths done in 2–3 weeks'],

  stats: [
    { num: '2', unit: '–3', label: 'Weeks for a typical bathroom' },
    { num: '60', unit: '+', label: 'Years of combined experience' },
    { num: '100', unit: '+', label: 'Projects completed across Winnipeg' },
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
      'A bathroom is a small room that punishes shortcuts. Water gets into anything you skip. A failed bathroom often looks fine on the surface — the problem started behind the tile two years earlier.',
      'So we do the boring parts properly. Backer board instead of drywall in the wet areas, a proper waterproofing membrane, a shower base sloped the way it should be, and the plumbing checked before anything gets closed up. Then we tile.',
      'Bathrooms are also the job people live around, so we keep it tight. We protect the hallway, we clean up daily, and we don’t leave the room torn open for a month. Most Winnipeg bathrooms we do are finished in two to three weeks from demo to the last bead of silicone.',
    ],
    checklist: ['Tile & Stone Showers', 'Vanities & Counters', 'Proper Waterproofing', 'Fixtures & Lighting'],
  },

  includes: {
    tag: 'What’s Included',
    title: 'What does a bathroom renovation include?',
    desc: 'A full bathroom renovation takes the room back to the studs where needed and rebuilds it: plumbing and electrical, backer board and a waterproofing membrane, tile, vanity and fixtures, then paint and a full clean. Planning a smaller update, such as a new vanity or tub only? Tell us at the on-site visit and we’ll scope just that.',
    items: [
      { num: '01', title: 'Demo & Haul Away', text: 'The old bath comes out, down to the studs and subfloor where needed, and everything is hauled away.' },
      { num: '02', title: 'Plumbing & Electrical', text: 'New supply and drain runs, plus the wiring for lighting, fans, and heated floors if you want them.' },
      { num: '03', title: 'Waterproofing', text: 'Backer board, membrane, and a properly sloped shower base. This is the step nobody sees and the one that decides how long the bath lasts.' },
      { num: '04', title: 'Tile Work', text: 'Floor, walls, and shower tiled with the layout planned first so cuts land where they should — not in the middle of the wall.' },
      { num: '05', title: 'Vanity & Fixtures', text: 'Vanity, counter, sink, toilet, taps, and shower hardware set and sealed.' },
      { num: '06', title: 'Paint & Finishing', text: 'Trim, paint, mirrors, and accessories, then a full clean before you see it.' },
    ],
  },

  typesTag: 'Project Types',
  typesTitle: 'What type of bathroom remodel are you planning?',
  typesDesc:
    'Bathroom projects range from a powder room refresh to a main bath or ensuite rebuilt from the studs. The type sets the trades involved and the length of the job, so it’s worth naming early. If you’re not sure, describe how the room is used and what bothers you about it now. That usually points to the right scope.',
  types: [
    { title: 'Main bathroom renovation', text: 'The family bathroom rebuilt from the studs: a new layout if needed, a waterproofed tub or shower, tile, vanity, lighting and ventilation.' },
    { title: 'Ensuite renovation', text: 'An ensuite off the main bedroom with a larger shower, a double vanity or heated floors, laid out around the space you have and the drains already in place.' },
    { title: 'Powder room & guest bathroom', text: 'A two-piece powder room or a guest bath with a shower. Compact rooms need careful fixture placement, good lighting and a fan that actually clears the air.' },
    { title: 'Walk-in shower installation', text: 'A tiled walk-in shower with a sloped base, a waterproofing membrane and glass. A low or curbless entry is possible where the floor structure allows it.' },
    { title: 'Tub replacement or tub-to-shower', text: 'We can replace a bathtub with a new one, or convert a tub alcove into a walk-in shower where the drain and the space allow. If it’s your home’s only tub, think about whether you’ll miss it.' },
    { title: 'Easier-access updates', text: 'We can add wall blocking for grab bars, a low-threshold shower, a comfort-height toilet and lever taps as part of a renovation, so the room stays easy to use as needs change.' },
  ],

  local: {
    tag: 'In Winnipeg',
    title: 'Does a bathroom renovation need a permit in Winnipeg?',
    intro:
      'It depends on the scope. The City of Winnipeg lists bathrooms among the home renovations that may need a building permit, and new plumbing or wiring may need separate trade permits. Cosmetic work such as painting, flooring and millwork does not. We coordinate the permits and inspections your bathroom needs with the City or your local municipality.',
    items: [
      { title: 'When a building permit applies', text: 'The City names bathrooms among the renovations that may need a building permit; whether yours does depends on the work. Painting, flooring and millwork, the City’s examples of cosmetic changes, do not need one.' },
      { title: 'Like-for-like insulation', text: 'The City’s 2026 housing bulletin says replacing batt insulation and vapour barrier in a small area of a finished level during a kitchen or bath renovation, with the stud walls staying, is like-for-like and needs no building permit.' },
      { title: 'Plumbing and electrical permits', text: 'New supply and drain lines, a relocated toilet, heated floors and a new fan circuit are trade work, and the City notes that many projects need electrical and plumbing permits separate from the building permit.' },
      { title: 'Inspections before tile', text: 'The City requires a rough-in inspection before plumbing, electrical or framing work under a permit is covered. Once it passes, the backer board and waterproofing membrane go on, then the tile.' },
      { title: 'Asbestos in older bathrooms', text: 'Health Canada notes that before 1990, asbestos was mainly used for insulating buildings and homes, and lists older plaster, drywall and floor tiles among materials that may contain it. If your bathroom has original finishes, have them tested by a professional before demolition.' },
      { title: 'Condos and nearby communities', text: 'In a condo, ask your condominium corporation about approvals, water shut-offs and work hours before dates are set. Outside Winnipeg, permits come from your local municipality or planning district.' },
    ],
    sources: [
      { label: 'City of Winnipeg: Home renovations', url: 'https://www.winnipeg.ca/building-development/building-renovating/home-improvement-projects/home-renovations', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Information Bulletin 2026-007-B, Building permit requirements for housing', url: 'https://www.winnipeg.ca/media/6116', accessed: '2026-10-13' },
      { label: 'City of Winnipeg: Housing inspections', url: 'https://www.winnipeg.ca/building-development/building-renovating/inspections/housing-inspections', accessed: '2026-10-13' },
      { label: 'Health Canada: Health risks of asbestos', url: 'https://www.canada.ca/en/health-canada/services/air-quality/indoor-air-contaminants/health-risks-asbestos.html', accessed: '2026-10-13' },
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
      { num: '01', title: 'On-Site Visit', text: 'We come out, measure the room, look at the plumbing you’ve already got, and talk about what you want to change.' },
      { num: '02', title: 'Written Quote', text: 'You get one written price covering labour, materials, and haul-away. If you want to swap a tile or a vanity, we re-price it before anyone orders anything.' },
      { num: '03', title: 'Build', text: 'Demo, rough-in, waterproofing, tile, then fixtures. Hallways get protected, the room gets sealed off, we sweep up every day, and you get a progress update every week.' },
      { num: '04', title: 'Final Check', text: 'We run the water, check every seal, and walk it with you. Anything you’re not happy with gets fixed before we call it finished.' },
    ],
  },

  costTeaser: {
    text: 'The starting ranges our instant estimator uses begin at $16,000–$20,000 for a small bathroom of up to 50 sq ft. Your final price comes from the written quote we prepare after a free on-site visit.',
    to: '/services/bathroom-renovations/cost',
    label: 'Bathroom renovation costs in Winnipeg',
  },

  // Real client testimonial (confirmed by the owner 2026-10-13).
  testimonial: {
    quote:
      '“Our main bathroom hadn’t been touched since the seventies. Bridgeland stripped it out and had us back in it in under three weeks. They showed me the waterproofing before they tiled over it, which no other contractor bothered to do. Clean work and a fair price.”',
    initial: 'D',
    name: 'Denise R.',
    role: 'Homeowner, Bathroom Renovation',
  },

  // No cost questions here: those live on /services/bathroom-renovations/cost.
  faqs: [
    { q: 'How long does a bathroom renovation take?', a: 'Two to three weeks for a typical full bathroom, from demolition to the final clean. If it’s your only bathroom, tell us at the on-site visit: we plan those jobs so the toilet is back in service as early as possible, and we let you know in advance which days the water will be off.' },
    { q: 'Can you move the toilet or shower to a different spot?', a: 'Usually, yes. It depends on where the drains and floor joists run, and on a concrete slab it means breaking and re-pouring part of the floor. At the on-site visit we’ll tell you whether the move is a small change or a bigger one, and the written quote shows what it involves.' },
    { q: 'Do you supply the tile and fixtures, or do I?', a: 'Either works. Most people choose from options we bring; some prefer to shop for their own. If you supply materials, have them on site before the start date so the schedule holds, and check the sizes with us first so the vanity, toilet and shower fit the plan.' },
    { q: 'Can you install heated floors?', a: 'Yes. A bathroom renovation is the right time to add them, since the floor is already open. The heating mat goes under the tile on its own circuit with a thermostat, and the wiring may need its own electrical permit. On a cold Winnipeg morning, a warm floor makes a real difference.' },
    { q: 'What if you find water damage under the old shower?', a: 'It happens, especially under older tubs and showers. We photograph it, show you, and price the repair in writing before going further. Rotten subfloor is replaced, never tiled over, because new tile on a damaged floor won’t last. Catching it during demolition is far better than finding it after.' },
    { q: 'Who arranges the permits and inspections?', a: 'We coordinate them. When your bathroom needs a building permit or plumbing and electrical permits, we arrange them with the City of Winnipeg or your local municipality and schedule inspections before the walls are closed. The City says the homeowner and the permit applicant share responsibility for inspections, so you’ll know what was booked and passed.' },
    { q: 'What happens at the free on-site visit?', a: 'We measure the room, look at the plumbing, venting and floor, and talk about what you want to change. You then receive a free written quote listing labour, materials and what’s included. If you later swap a tile or a vanity, we re-price it before anything is ordered.' },
  ],

  // Title, meta description and Service schema for this page. `updated`
  // feeds the sitemap lastmod and WebPage dateModified: bump it only when the
  // page content really changes.
  seo: {
    title: 'Bathroom Renovations Winnipeg | Bridgeland Builders',
    description:
      'Bathroom renovations in Winnipeg with proper waterproofing under the tile. Most take 2–3 weeks. Start with a free on-site visit and a written quote.',
    serviceType: 'Bathroom renovation',
    primaryKeyword: 'bathroom renovation Winnipeg',
    updated: '2026-10-13',
  },

  // Live pages only are shown; drafts appear when they launch.
  related: ['/services/kitchen-renovations', '/services/basement-renovations', '/services/whole-home-renovations'],
  guides: ['which-bathroom-remodel-upgrades-offer-the-best-return-on-investment-for-canadian-homeowners', 'ensuite-renovation-winnipeg', 'winnipeg-renovation-permits'],
  signoff: null,
};
