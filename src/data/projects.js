// Content for the five project / service pages linked from the home page
// "Our Portfolio" gallery. Each entry drives src/pages/ProjectPage.jsx.

export const PROJECTS = [
  {
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
      { num: '1', unit: '★', label: 'One crew from demo to final coat' },
      { num: '100', unit: '%', label: 'Satisfaction & clear communication' },
    ],

    intro: {
      tag: 'Why a whole home renovation?',
      title: 'Everything gets touched, so everything has to match',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      imageAlt: 'Whole home renovation in Winnipeg',
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
      tag: 'Recent Work',
      title: 'Whole Home Projects Around Winnipeg',
      desc: 'A look at how the whole house comes together when one crew handles it end to end.',
      items: [
        { img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80', alt: 'Open living space renovation', title: 'Main Floor Opened Up', text: 'Wall removed between kitchen and living room' },
        { img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80', alt: 'Kitchen in a whole home renovation', title: 'New Kitchen & Dining', text: 'Cabinets, counters, and lighting replaced' },
        { img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80', alt: 'Finished interior after whole home renovation', title: 'Finishes Throughout', text: 'Flooring, trim, and paint across every room' },
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
      role: 'Whole Home Renovation, Winnipeg ★★★★★',
    },

    faqs: [
      { q: 'How long does a whole home renovation take?', a: 'Most of ours run eight to sixteen weeks depending on the size of the house and how much of it we’re touching. You get a schedule with your quote, and if something shifts we tell you the same week — not at the end.' },
      { q: 'Can we stay in the house while you work?', a: 'Often yes, if we stage it in sections and keep a kitchen and bathroom live for you. Sometimes it’s faster and cheaper to move out for a few weeks. We’ll lay out both options at the walkthrough and let you decide.' },
      { q: 'Do you handle permits?', a: 'Yes. Where the work needs a permit from the City of Winnipeg, we pull it and we schedule the inspections. You don’t have to chase any of that.' },
      { q: 'Do I pick the materials or do you?', a: 'You do — we just narrow it down. We’ll bring options that fit your budget and hold up long term, and you choose from there. If you’d rather hand it to us entirely, that’s fine too.' },
      { q: 'What happens if you find something unexpected behind a wall?', a: 'It happens on older homes — old wiring, water damage, sometimes a wall that’s holding more than it should. We stop, show you what we found, and price the fix before we carry on. No surprise line items at the end.' },
    ],
  },

  {
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
      { num: '5', unit: '★', label: '5-Star Rated client experience' },
    ],

    intro: {
      tag: 'Why Bridgeland for your bath?',
      title: 'The part that matters is the part you can’t see',
      image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1000&q=80',
      imageAlt: 'Bathroom renovation in Winnipeg',
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
      tag: 'Recent Work',
      title: 'Bathrooms We’ve Finished in Winnipeg',
      desc: 'Modern fixtures, clean tiling, and finishes that hold up to daily use.',
      items: [
        { img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80', alt: 'Main bathroom renovation', title: 'Main Bath Rebuild', text: 'Taken to the studs and finished in three weeks' },
        { img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80', alt: 'Tiled shower renovation', title: 'Walk-In Tile Shower', text: 'Membrane, sloped base, full-height tile' },
        { img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', alt: 'Ensuite bathroom renovation', title: 'Ensuite Refresh', text: 'New vanity, lighting, and floor tile' },
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
      role: 'Bathroom Renovation, Winnipeg ★★★★★',
    },

    faqs: [
      { q: 'How long will my bathroom be out of service?', a: 'Two to three weeks for a typical full bath. If it’s your only bathroom, tell us at the measure — we plan those tighter and get the toilet back in service as early as we can.' },
      { q: 'Can you move the toilet or shower to a different spot?', a: 'Usually yes. It depends on where the drains run, especially on a concrete slab. We’ll tell you at the measure whether it’s a small change or a bigger one, and what it adds.' },
      { q: 'Do you supply the tile and fixtures or do I?', a: 'Either way works. Most people pick from options we bring, some prefer to shop themselves. If you supply it, just have it on site before we start so the schedule holds.' },
      { q: 'Do you install heated floors?', a: 'Yes, and a bathroom reno is the right time to do it since the floor is already open. It’s a small add while we’re in there and a big difference in a Winnipeg winter.' },
      { q: 'What if you find water damage under the old shower?', a: 'We find it fairly often. We photograph it, show you, and price the repair before we go further. Rotten subfloor gets replaced — we won’t tile over it.' },
    ],
  },

  {
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
      { num: '100', unit: '%', label: 'Satisfaction & clear communication' },
    ],

    intro: {
      tag: 'Why Bridgeland for your kitchen?',
      title: 'A kitchen is a workspace before it’s a showpiece',
      image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1000&q=80',
      imageAlt: 'Kitchen renovation in Winnipeg',
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
      tag: 'Recent Work',
      title: 'Kitchens We’ve Built in Winnipeg',
      desc: 'Layouts that work, finishes that hold up, and storage where you need it.',
      items: [
        { img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80', alt: 'Kitchen renovation with new cabinetry', title: 'Full Kitchen Rebuild', text: 'New cabinets, counters, and appliance layout' },
        { img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', alt: 'Open kitchen and dining renovation', title: 'Kitchen & Dining Opened Up', text: 'Wall removed for one connected space' },
        { img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80', alt: 'Kitchen island installation', title: 'Island & Storage', text: 'Prep space and seating added to the plan' },
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
      role: 'Kitchen Renovation, Winnipeg ★★★★★',
    },

    faqs: [
      { q: 'How long does a kitchen renovation take?', a: 'Four to six weeks for most full kitchens, once the cabinets are on site. The counter template has to happen after the cabinets are set, and that adds about a week in the middle.' },
      { q: 'Will I be without a kitchen the whole time?', a: 'You’ll be without the sink and stove for most of it. We set up a temporary counter with your kettle, microwave, and fridge so you’ve got something to work with.' },
      { q: 'Can you remove the wall between the kitchen and living room?', a: 'Usually. If it’s load-bearing we bring in a beam and do it properly with the right permits. We’ll tell you at the design visit which kind of wall you have.' },
      { q: 'Do you do custom cabinets or stock?', a: 'Both. Stock is quicker and cheaper and fine for a lot of layouts. Custom makes sense when the room is an odd shape or you want the storage designed around specific things.' },
      { q: 'Can I keep my existing appliances?', a: 'Yes — just tell us early so we build the openings to fit them. If you’re replacing them later, get the model numbers to us and we’ll size for the new ones now.' },
    ],
  },

  {
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
      { num: '5', unit: '★', label: '5-Star Rated client experience' },
    ],

    intro: {
      tag: 'Why Bridgeland for your basement?',
      title: 'Get the moisture and insulation right, and the rest is easy',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
      imageAlt: 'Basement renovation in Winnipeg',
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
      tag: 'Recent Work',
      title: 'Basements We’ve Finished in Winnipeg',
      desc: 'Family space, guest rooms, and suites that stay warm and dry year round.',
      items: [
        { img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80', alt: 'Finished basement family room', title: 'Family Rec Room', text: 'Insulated, finished, and warm in winter' },
        { img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', alt: 'Basement guest suite renovation', title: 'Guest Suite', text: 'Bedroom with a legal egress window' },
        { img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80', alt: 'Basement bathroom and bar area', title: 'Bath & Wet Bar', text: 'Plumbing added below grade' },
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
      role: 'Basement Renovation, Winnipeg ★★★★★',
    },

    faqs: [
      { q: 'My basement smells damp. Can it still be finished?', a: 'Usually, but not until we know where the moisture is coming from. Sometimes it’s grading or a downspout outside, sometimes it’s a crack in the foundation. We find the cause and fix it first — finishing over a damp basement just hides the problem for a year.' },
      { q: 'Do I need a permit to finish my basement?', a: 'For most finished basements in Winnipeg, yes, and definitely if you’re adding a bedroom, a bathroom, or a suite. We pull the permit and book the inspections as part of the job.' },
      { q: 'What is an egress window and do I need one?', a: 'It’s a window big enough to climb out of in a fire. Any basement bedroom legally needs one. We cut the opening, install it, and take care of the window well.' },
      { q: 'Can you add a bathroom down there?', a: 'Yes. If there’s no existing drain in the right place we either break and re-run the concrete or use an up-flush system. We’ll tell you which one your basement needs and what each costs.' },
      { q: 'Will the basement actually be warm?', a: 'That comes down to insulation and heat supply, and we plan both. Properly insulated walls plus enough heat runs into the new rooms is what makes the difference in January.' },
    ],
  },

  {
    slug: 'home-extension',
    breadcrumb: 'Home Extension',
    badge: 'Home Extensions in Winnipeg, Manitoba',
    title: 'HOME EXTENSIONS',
    titleHighlight: 'BUILT TO BELONG',
    subtitle:
      'Add the room your home is missing without giving up the neighbourhood you love. We plan, permit, and build extensions that connect naturally to the existing house, inside and out.',
    heroPoints: ['Free property walkthrough', 'Design and permits coordinated', 'One team from foundation to finish'],

    stats: [
      { num: '60', unit: '+', label: 'Years of combined experience' },
      { num: '100', unit: '+', label: 'Projects completed across Winnipeg' },
      { num: '8', unit: '-16', label: 'Weeks for many home extensions' },
      { num: '100', unit: '%', label: 'Clear communication throughout' },
    ],

    intro: {
      tag: 'Why extend your home?',
      title: 'More space without starting over somewhere else',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
      imageAlt: 'Bright home extension in Winnipeg',
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
      tag: 'Extension Ideas',
      title: 'Room to Live the Way You Want',
      desc: 'Thoughtful additions that improve the home without making the new space feel separate.',
      items: [
        { img: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80', alt: 'Open-plan home extension', title: 'Kitchen & Dining Extension', text: 'More space for cooking, gathering, and natural light' },
        { img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80', alt: 'Family room home extension', title: 'New Family Room', text: 'A comfortable everyday living area connected to the home' },
        { img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', alt: 'Finished interior connection in a home extension', title: 'Seamless Interior Finish', text: 'Floors, trim, and openings matched across old and new' },
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
      role: 'Home Extension, Winnipeg',
    },

    faqs: [
      { q: 'Do I need a permit for a home extension?', a: 'Yes, an extension normally requires drawings, permits, and inspections. We include those requirements in the plan and coordinate the process for the approved project.' },
      { q: 'How long does a home extension take?', a: 'Many straightforward additions take roughly eight to sixteen weeks once permits and materials are ready. Size, foundation conditions, structural changes, and custom finishes can affect the schedule.' },
      { q: 'Can you make the extension match my existing house?', a: 'That is part of the design. We review rooflines, windows, siding or masonry, floor heights, trim, and interior finishes so the addition connects as naturally as possible.' },
      { q: 'Can we stay in the house while the extension is built?', a: 'Usually, for much of the project. We keep the existing home closed off while the exterior shell is built, then plan the final opening and interior connection to limit disruption.' },
      { q: 'Can the extension include a kitchen or bathroom?', a: 'Yes. We plan plumbing, electrical, ventilation, heating, and structural requirements from the start so those rooms are properly integrated into the home systems.' },
    ],
  },

  {
    slug: 'commercial-renovation',
    breadcrumb: 'Commercial Renovation',
    badge: 'Commercial Renovations in Winnipeg, Manitoba',
    title: 'COMMERCIAL RENOVATIONS',
    titleHighlight: 'THAT WORK FOR YOU',
    subtitle:
      'Offices, retail, restaurants, and clinics built to open on schedule. We work around your hours where we can, and we keep you posted every week. Book a site visit and we’ll scope it with your timeline in mind.',
    heroPoints: ['Free site visit & scope', 'After-hours work available', 'Weekly progress updates'],

    stats: [
      { num: '60', unit: '+', label: 'Years of combined experience' },
      { num: '100', unit: '+', label: 'Projects completed across Winnipeg' },
      { num: '7', unit: '★', label: 'After-hours & weekend scheduling' },
      { num: '100', unit: '%', label: 'Satisfaction & clear communication' },
    ],

    intro: {
      tag: 'Why Bridgeland for your space?',
      title: 'Every day you’re closed costs you money, so we plan around that',
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=80',
      imageAlt: 'Commercial renovation in Winnipeg',
      floatingTitle: 'Open On Schedule',
      floatingText: 'We build to your opening date, not the other way around.',
      paragraphs: [
        'Commercial work runs on a different clock than a house. There’s a lease starting, an opening date booked, staff who need somewhere to work, and customers who’ll go elsewhere if the doors stay shut. The schedule isn’t a nice-to-have — it’s the whole job.',
        'So we build the plan backwards from your opening date and tell you honestly whether it’s realistic. Where it makes sense, we work evenings and weekends so you can keep trading while we go. Where a section has to close, we phase it so only part of the space is down at a time.',
        'Offices, retail, restaurants, clinics, hotels, and multi-unit properties — we’ve done all of them around Winnipeg. Property managers and building owners come back to us because we show up when we said we would and we keep them in the loop without being chased for updates.',
      ],
      checklist: ['Offices & Workspaces', 'Retail & Restaurants', 'Medical & Dental', 'Property Managers'],
    },

    includes: {
      tag: 'What’s Included',
      title: 'What a Commercial Renovation Covers',
      desc: 'Scoped around your lease, your opening date, and the hours you need to keep trading.',
      items: [
        { num: '01', title: 'Site Visit & Scope', text: 'Walking the space with you and your timeline, then writing a scope that matches your lease dates and opening plan.' },
        { num: '02', title: 'Demolition & Fit-Out', text: 'Stripping out the old layout and building the new one — partitions, ceilings, storefronts, and service areas.' },
        { num: '03', title: 'Electrical & Mechanical', text: 'Lighting, power, data runs, and HVAC adjustments to suit the new floor plan and occupancy.' },
        { num: '04', title: 'Washrooms & Accessibility', text: 'Commercial washrooms, accessible entries, and clearances built to code and ready for inspection.' },
        { num: '05', title: 'Finishes & Branding', text: 'Flooring, wall finishes, millwork, and the details that carry your brand through the space.' },
        { num: '06', title: 'Phased Scheduling', text: 'Evening, overnight, and weekend work so you can keep trading through as much of the project as possible.' },
      ],
    },

    gallery: {
      tag: 'Recent Work',
      title: 'Commercial Projects Around Winnipeg',
      desc: 'Office and retail spaces that work for you — and opened when they were supposed to.',
      items: [
        { img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', alt: 'Office renovation in Winnipeg', title: 'Office Fit-Out', text: 'Open workspace with meeting rooms added' },
        { img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', alt: 'Retail space renovation', title: 'Retail Refresh', text: 'Completed overnight to avoid closing' },
        { img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80', alt: 'Restaurant and hospitality renovation', title: 'Hospitality Space', text: 'Front of house rebuilt to the opening date' },
      ],
    },

    process: {
      tag: 'How It Works',
      title: 'Scoped, Scheduled, Open',
      desc: 'You get a schedule you can plan your business around and an update every week.',
      steps: [
        { num: '01', title: 'Site Visit', text: 'We walk the space with you, get your opening date, and find out which hours you can’t afford to lose. That shapes everything after.' },
        { num: '02', title: 'Scope & Schedule', text: 'A written scope, a fixed price, and a schedule built backwards from your date. If the date isn’t realistic, we say so up front rather than halfway through.' },
        { num: '03', title: 'Build in Phases', text: 'We work in phases and after hours where it helps, so you keep as much of the space trading as possible. You get a progress update every week without asking.' },
        { num: '04', title: 'Inspection & Handover', text: 'Inspections booked and passed, deficiencies cleared, and the space cleaned and ready for you to open on schedule.' },
      ],
    },

    testimonial: {
      quote:
        '“We had six weeks between the lease starting and our opening date, and everyone told us it was tight. Bridgeland scoped it, worked two weekends to keep us on track, and we opened on the day we’d advertised. We’ve used them for two more locations since.”',
      initial: 'A',
      name: 'Amrit S.',
      role: 'Retail Fit-Out, Winnipeg ★★★★★',
    },

    faqs: [
      { q: 'Can you work after hours so we stay open?', a: 'Yes, and on a lot of retail and restaurant jobs that’s the plan from the start. Evenings, overnights, and weekends all work. It costs a bit more in labour and usually saves far more in lost trading.' },
      { q: 'Do you handle permits and inspections?', a: 'Yes. Commercial permits, occupancy requirements, and inspection scheduling are all part of what we manage. We’ll flag anything in your space that will need attention early.' },
      { q: 'Can you work with our architect or designer?', a: 'Happily. We build to supplied drawings all the time, and we’ll raise anything in them that will cause a problem on site before it costs you money.' },
      { q: 'Do you work with property managers on multiple units?', a: 'Yes — turnovers, common areas, and multi-unit upgrades. If you manage several buildings we’ll set up one point of contact so you’re not re-explaining the situation every time.' },
      { q: 'How firm is the schedule?', a: 'The schedule comes with the quote and we build to it. If something outside our control moves — a permit, a supplier, an inspection date — you hear about it that week, along with what we’re doing about it.' },
    ],
  },
];

export const getProject = (slug) => PROJECTS.find((project) => project.slug === slug);
