/**
 * Legacy URL redirects: the one list of every old URL that should land on a
 * page of this site instead of a 404. Build tooling only — never import this
 * from a component.
 *
 *   npm run redirects        writes these rules into vercel.json "redirects"
 *                            (scripts/sync-redirects.mjs: resolves chains,
 *                            validates, explicit rules before wildcard rules)
 *   npm run check:redirects  checks them against a live or preview deployment
 *
 * Fields:
 *   from       old path. A rule ending in "/:path*" is a wildcard (also matches
 *              the bare prefix) and is written after every explicit rule.
 *   to         destination path on this site. For a rule with `planned`, the
 *              interim (fallback) destination; null = no fallback.
 *   planned    the page this URL should end up on (SEO plan C8). The sync
 *              script checks it on every build:
 *                planned page live (a live service in src/data/services.js,
 *                or any other live route) -> PERMANENT 308 to `planned`;
 *                not live yet -> TEMPORARY 307 to `to`;
 *                not live and `to` is null -> no rule (the URL keeps serving
 *                whatever it serves today). A rule with no fallback is also
 *                skipped while its own source is still a live page.
 *              So launching a page (status: 'live') flips its redirects to
 *              308 with no edit here.
 *   temporary  (rules without `planned`) true = 307 instead of 308.
 *   evidence   W = in the Wayback Machine URL index, S = seen in Google results,
 *              A = assumed (confirm in Search Console before relying on it).
 *   note       why the rule exists.
 *   since      (planned rules) date the interim rule was added; the sync script
 *              warns when a 307 is older than 45 days.
 *
 * Sources: SEO plan §1 and §9 (legacy-URL inventory from the Wayback URL index
 * and google.ca results, 2026-10-13).
 *
 * EXTERNAL_REDIRECTS (below) holds the short links to Google; HOST_REDIRECTS
 * the whole-host rules.
 */
import { GBP } from './siteConfig.js';

const W = 'W';
const S = 'S';
const A = 'A';
const INTERIM_SINCE = '2026-10-13';

/** Applies the shared options: `planned` (+ since) or an explicit `temporary`. */
function withOptions(rule, opts) {
  if (opts.planned) {
    rule.planned = opts.planned;
    rule.since = opts.since || INTERIM_SINCE;
  } else if (opts.temporary) {
    rule.temporary = true;
  }
  return rule;
}

/** Rules that share one destination: [[from, evidence, note?], ...]. */
function family(to, opts, rows) {
  return rows.map(([from, evidence, note]) => withOptions({ from, to, evidence, note: note || opts.note }, opts));
}

/**
 * A blog post that is merged into another page. The posts were imported from
 * Wix, which served them at /post/<slug>, so both URL forms are redirected.
 */
function mergedPost(slug, to, note, opts = {}) {
  return ['blog', 'post'].map((prefix) =>
    withOptions(
      {
        from: `/${prefix}/${slug}`,
        to,
        // /blog/ URLs are on the current site (and in its sitemap); the /post/
        // forms are assumed from Wix's URL scheme. Both: confirm clicks in GSC.
        evidence: A,
        note: prefix === 'blog'
          ? `${note} (live on the current site until the merge)`
          : `${note} (Wix-era /post/ URL)`,
      },
      opts
    )
  );
}

const BLOG = (slug) => `/blog/${slug}`;

// Posts kept after the 27 -> 11 consolidation (plan §9). Their Wix-era
// /post/<slug> URLs point at the same post under /blog/.
const KEPT_POSTS = [
  'how-to-balance-functionality-and-aesthetics-in-a-commercial-space', // #4
  'how-to-choose-between-a-full-renovation-and-partial-upgrades', // #5
  'understanding-roi-which-commercial-renovations-bring-the-most-value', // #10
  'how-to-finance-a-commercial-renovation-without-breaking-the-bank', // #11
  'how-to-choose-the-right-contractor-for-your-renovation-project', // #12
  'the-biggest-cost-factors-in-commercial-renovation-projects', // #13
  'how-to-prepare-your-business-for-a-major-renovation', // #14
  'which-bathroom-remodel-upgrades-offer-the-best-return-on-investment-for-canadian-homeowners', // #19
  'mastering-general-contracting-tips-for-your-next-project', // #25 (retired: its /post/ URL follows the #25 rule below in one hop)
  'essential-design-strategies-for-small-kitchen-renovations', // #27
];

const COMMERCIAL = '/services/commercial-renovations';

export const REDIRECTS = [
  /* ------------------------------------------------ residential services */
  ...family('/services/kitchen-renovations', { note: 'Wix kitchen renovation page family' }, [
    ['/kitchen-renovations', W],
    ['/kitchen-renovations-winnipeg-manitoba', W],
    ['/kitchen-renovations-free-estimate', W],
    ['/kitchen-renovations-free-estimate-winnipeg-manitoba', W],
    ['/kitchen-gallery', W, 'Wix kitchen gallery'],
    ['/service-page/kitchen-renovation', W, 'Wix booking service page'],
    ['/booking-calendar/kitchen-renovation', W, 'Wix booking calendar'],
    ['/projects/kitchen-renovation', A, 'Current site: was a client-side redirect only (AppShell)'],
  ]),

  ...family('/services/bathroom-renovations', { note: 'Wix bathroom renovation page family' }, [
    ['/bathroom-renovation', W],
    ['/bathroom-renovation-winnipeg-manitoba', S, 'Wix bathroom page (also in Wayback)'],
    ['/bathroom-renovation-free-estimate', W],
    ['/bathroom-renovation-free-estimate-winnipeg-manitoba', W],
    ['/bathroom-gallery', W, 'Wix bathroom gallery'],
    ['/service-page/bathroom-renovation', W, 'Wix booking service page'],
    ['/booking-calendar/bathroom-renovation', W, 'Wix booking calendar'],
    ['/projects/bathroom-renovation', A, 'Current site: was a client-side redirect only (AppShell)'],
  ]),

  ...family('/services/basement-renovations', { note: 'Wix basement renovation page family' }, [
    ['/basement', W],
    ['/basement-renovations', W],
    ['/basement-renovations-winnipeg-manitoba', W],
    ['/basement-renovations-free-estimate', W],
    ['/basement-renovations-free-estimate-winnipeg-manitoba', W],
    ['/copy-of-home-reno', W, 'Wix basement gallery'],
    ['/service-page/basement-renovations', W, 'Wix booking service page'],
    ['/booking-calendar/basement-renovations', W, 'Wix booking calendar'],
    ['/projects/basement-renovation', A, 'Current site: was a client-side redirect only (AppShell)'],
  ]),

  ...family('/services/whole-home-renovations', { note: 'Wix whole-home renovation page family' }, [
    ['/whole-home-renovations', W],
    ['/whole-home-renovations-winnipeg-manitoba', W],
    ['/whole-home-renovations-free-estimate', W],
    ['/whole-home-renovations-free-estimate-winnipeg-manitoba', W],
    ['/home-reno', W, 'Wix whole-home page'],
    ['/home-renovation-gallery', W, 'Wix whole-home gallery'],
    ['/projects/whole-home-renovation', A, 'Current site: was a client-side redirect only (AppShell)'],
  ]),

  // Home extensions -> home additions (plan D6): the page moved from
  // /services/home-extensions, which is now a permanent redirect too.
  ...family('/services/home-additions', { note: 'Wix home extension page family' }, [
    ['/services/home-extensions', A, 'Current site: the additions page before the D6 rename (was in the sitemap)'],
    ['/home-extension-free-estimate', W],
    ['/home-extension-free-estimate-winnipeg-manitoba', W],
    ['/projects/home-extension', A, 'Current site: was a client-side redirect only (AppShell)'],
  ]),

  /* ------------------------------------------------------ commercial hub */
  ...family(COMMERCIAL, { note: 'Wix commercial page family' }, [
    ['/commercial', W],
    ['/commercial-renovation', W],
    ['/commercial-renovation-winnipeg-manitoba', S, 'Ranked #4 for "restaurant renovation winnipeg" (now 404)'],
    ['/projects/commercial-renovation', A, 'Current site: was a client-side redirect only (AppShell)'],
    ['/property-managers-and-building-owners-spaces', W, 'Wix property managers page'],
    ['/property-managers-and-building-owners-spaces-winnipeg-manitoba', S, 'Wix property managers page'],
    ['/property-managers-and-building-owners-free-estimate', W, 'Wix property managers page'],
    ['/property-managers-and-building-owners-free-estimate-winnipeg-manitoba', W, 'Wix property managers page'],
    ['/property-managers-and-real-estate-developers', W, 'Wix developers page'],
    ['/property-managers-and-real-estate-developers-winnipeg-manitoba', S, 'Wix developers page'],
    ['/realestate-developers-and-realors-free-estimate', W, 'Wix developers/realtors page'],
    ['/realestate-developers-and-realors-free-estimate-winnipeg-manitoba', W, 'Wix developers/realtors page'],
    ['/developerbuildings', W, 'Wix developers page'],
    ['/copy-of-restaurants', W, 'Wix property management gallery'],
    ['/copy-of-restaurants-1', W, 'Wix developer gallery'],
    ['/property-management-building-gallery', W, 'Wix property management gallery'],
    ['/service-page/building-owners', W, 'Wix booking service page'],
    ['/service-page/developers', W, 'Wix booking service page'],
    ['/service-page/property-management', W, 'Wix booking service page'],
    ['/booking-calendar/building-owners', W, 'Wix booking calendar'],
    ['/booking-calendar/developers', W, 'Wix booking calendar'],
    ['/booking-calendar/property-management', W, 'Wix booking calendar'],
  ]),

  /* ------- commercial verticals: 307 to the commercial hub until the planned
     page is live, then 308 to it (no edit needed here) */
  ...family(COMMERCIAL, {
    planned: '/services/office-renovations',
    note: 'Wix office renovation page family (interim: commercial hub)',
  }, [
    ['/office-renovation', W],
    ['/office-renovation-winnipeg-manitoba', S, 'Ranked #5 for "office renovation winnipeg" (now 404)'],
    ['/office-renovations-free-estimate', W],
    ['/office-renovations-free-estimate-winnipeg-manitoba', W],
  ]),

  ...family(COMMERCIAL, {
    planned: '/services/medical-dental-office-renovations',
    note: 'Wix medical & dental office page family (interim: commercial hub)',
  }, [
    ['/medical-and-dental-office', W],
    ['/medical-and-dental-office-winnipeg-manitoba', S, 'Ranked #1 for "dental office renovation winnipeg" (now 404)'],
    ['/medical-and-dental-offices-free-estimate', W],
    ['/medical-and-dental-offices-free-estimate-winnipeg-manitoba', W],
    ['/copy-of-doctor-offices-1', W, 'Wix dental gallery'],
    ['/copy-of-retail', W, 'Wix doctor offices gallery'],
    ['/service-page/doctor-amp-dental-offices', W, 'Wix booking service page'],
    ['/booking-calendar/doctor-amp-dental-offices', W, 'Wix booking calendar'],
  ]),

  ...family(COMMERCIAL, {
    planned: '/services/restaurant-renovations',
    note: 'Wix restaurant & hospitality page family (interim: commercial hub)',
  }, [
    ['/restaurants', W],
    ['/copy-of-doctor-offices', W, 'Wix restaurants gallery'],
    ['/property-retaurants-and-hospitality', S],
    ['/property-retaurants-and-hospitality-winnipeg-manitoba', S],
    ['/restaurant-and-hospitality-free-estimate', W],
    ['/restaurant-and-hospitality-free-estimate-winnipeg-manitoba', W],
    ['/service-page/restaurants', W, 'Wix booking service page'],
    ['/booking-calendar/restaurants', W, 'Wix booking calendar'],
    // Hotels: hotel work confirmed by the owner (2026-10-13); covered on the
    // restaurant & hospitality page.
    ['/hotels', S, 'Wix hotels page (hotels section of the restaurant & hospitality page)'],
    ['/hotels-winnipeg-manitoba', S, 'Wix hotels page (hotels section of the restaurant & hospitality page)'],
    ['/hotels-free-estimate', W, 'Wix hotels page (hotels section of the restaurant & hospitality page)'],
    ['/hotels-free-estimate-winnipeg-manitoba', W, 'Wix hotels page (hotels section of the restaurant & hospitality page)'],
  ]),

  ...family(COMMERCIAL, {
    planned: '/services/retail-renovations',
    note: 'Wix retail page family (interim: commercial hub)',
  }, [
    ['/retail', W],
    ['/retail-spaces-renovations', W],
    ['/retail-spaces-renovations-winnipeg-manitoba', S],
    ['/retail-spaces-free-estimate', W],
    ['/retail-spaces-free-estimate-winnipeg-manitoba', W],
    ['/service-page/retail', W, 'Wix booking service page'],
    ['/booking-calendar/retail', W, 'Wix booking calendar'],
  ]),

  ...family(COMMERCIAL, {
    planned: '/services/general-contracting',
    note: 'Wix architects & designers page family (interim: commercial hub)',
  }, [
    ['/architects-and-designers', W],
    ['/architects-and-designers-winnipeg-manitoba', S, 'Wix architects & designers page (brand sitelink)'],
    ['/architect-and-designers-free-estimate', W],
    ['/architect-and-designers-free-estimate-winnipeg-manitoba', W],
  ]),

  /* ------- additional services: 307 to the /services hub until the planned
     page is live, then 308 to it */
  ...family('/services', {
    planned: '/services/windows-and-doors',
    note: 'Wix windows & doors page family (interim: services hub)',
  }, [
    ['/windows-doors-intallation', S],
    ['/windows-doors-intallation-winnipeg-manitoba', S],
    ['/windows-and-doors-installatio-free-estimate', W],
    ['/windows-and-doors-installatio-free-estimate-winnipeg-manitoba', W],
    ['/service-page/windows-doors', W, 'Wix booking service page'],
    ['/booking-calendar/windows-doors', W, 'Wix booking calendar'],
  ]),

  ...family('/services', {
    planned: '/services/exterior-painting',
    note: 'Wix exterior painting page family (interim: services hub)',
  }, [
    ['/exterior-painting', W],
    ['/exterior-painting-free-estimate', W],
    ['/exterior-painting-free-estimate-winnipeg-manitoba', W],
    ['/property-exterior-painting', W],
    ['/property-exterior-winnipeg-manitoba', W],
    ['/service-page/painting', W, 'Wix booking service page'],
    ['/booking-calendar/painting', W, 'Wix booking calendar'],
  ]),

  ...family('/services', {
    planned: '/services/masonry-stucco',
    note: 'Wix masonry & stucco page family (interim: services hub)',
  }, [
    ['/masonry-services', W],
    ['/masonry-services-winnipeg-manitoba', S],
    ['/stone-bricks-stucco-and-masonry-free-estimate', W],
    ['/stone-bricks-stucco-and-masonry-free-estimate-winnipeg-manitoba', W],
    ['/service-page/stone-brick-stucco-masonry', W, 'Wix booking service page'],
    ['/booking-calendar/stone-brick-stucco-masonry', W, 'Wix booking calendar'],
  ]),

  ...family('/services', {
    planned: '/services/flooring',
    note: 'Wix flooring page family (interim: services hub)',
  }, [
    ['/flooring', W],
    ['/flooring-winnipeg-manitoba', S],
    ['/flooring-free-estimate', W],
    ['/flooring-free-estimate-winnipeg-manitoba', S],
    ['/service-page/flooring', W, 'Wix booking service page'],
    ['/booking-calendar/flooring', W, 'Wix booking calendar'],
  ]),

  ...family('/services', {
    planned: '/services/demolition',
    note: 'Wix demolition page family (interim: services hub)',
  }, [
    ['/demolition', A, 'Assumed from the Wix family pattern (plan §1: /demolition*)'],
    ['/demolition-winnipeg-manitoba', A, 'Assumed from the Wix family pattern (plan §1: /demolition*)'],
    ['/demolition-services', W],
    ['/demolition-services-winnipeg-manitoba', S],
    ['/demolition-free-estimate', W],
    ['/demolition-free-estimate-winnipeg-manitoba', W],
    // Explicit, so they reach the demolition page instead of the
    // /service-page and /booking-calendar wildcards.
    ['/service-page/demolition', A, 'Wix booking service page (assumed)'],
    ['/booking-calendar/demolition', A, 'Wix booking calendar (assumed)'],
  ]),

  /* -------------------------------------------------------- services hub */
  ...family('/services', { note: 'Wix residential / additional services overview' }, [
    ['/residential', W],
    ['/residential-renovation', S],
    ['/residential-renovation-winnipeg-manitoba', S],
    ['/additional-services', W],
    ['/additional-services-winnipeg-manitoba', S],
    ['/other-services', W],
    ['/service-page/exterior-renovation', W, 'Wix booking service page'],
    ['/booking-calendar/exterior-renovation', W, 'Wix booking calendar'],
    ['/post/comprehensive-renovation-services-for-homes-and-businesses', W, '2024 Wix post'],
    ['/post/professional-construction-company-specializing-in-home-and-office-renovations', W, '2024 Wix post'],
    ['/post/top-notch-residential-and-commercial-renovation-solutions-by-experts', W, '2024 Wix post'],
  ]),

  /* ------------------------------------------------------- company pages */
  ...family('/', { note: 'Wix home page copy' }, [
    ['/winnipeg-renovations', S],
    ['/winnipeg-renovations-winnipeg-manitoba', S],
  ]),
  ...family('/about-us', { note: 'Wix about page' }, [
    ['/about-6', W],
  ]),
  ...family('/faqs', { note: 'Wix FAQ page' }, [
    ['/faq-winnipeg-manitoba', S],
  ]),
  ...family('/contact-us', { note: 'Wix contact page' }, [
    ['/contact-us-winnipeg-manitoba', S],
  ]),
  ...family('/contact-us', { planned: '/service-areas', note: 'Wix location page (service-area hub once live)' }, [
    ['/location', W],
    ['/location-winnipeg-manitoba', S],
  ]),
  ...family('/service-areas', { note: 'Current site: the service-area page before /service-areas (plan §5)' }, [
    ['/outside-winnipeg', A],
  ]),
  ...family('/instant-quote', { note: 'Wix quote request page' }, [
    ['/get-an-instant-quote', W],
    ['/get-an-instant-quote-winnipeg-manitoba', S],
    ['/request-quote', W],
    ['/request-quote-winnipeg-manitoba', W],
  ]),
  // Owner to confirm: if ads, QR codes or print use /consultation, point it at
  // /free-quote (the ad landing page) instead.
  ...family('/book-online', { note: 'Wix "Free Consultation" page' }, [
    ['/consultation', W],
  ]),
  ...family('/blog', { note: 'Wix blog index' }, [
    ['/blog-1', W],
    ['/blogs-and-articles-winnipeg-manitoba', W],
  ]),
  // Feed readers subscribed to the Wix feed follow it to the new one.
  ...family('/feed.xml', { note: 'Wix blog RSS feed -> the RSS feed (scripts/build-seo-files.mjs)' }, [
    ['/blog-feed.xml', W],
  ]),
  ...family('/projects', { note: 'Wix portfolio page' }, [
    ['/portfolio', W],
  ]),
  ...family('/privacy-policy', { note: 'Wix estimator privacy page' }, [
    ['/privacy-policy-for-free-estimate-tool', W],
    ['/privacy-policy-for-free-estimate-tool-winnipeg-manitoba', W],
  ]),
  ...family('/sitemap.xml', { note: 'Wix sitemap file' }, [
    ['/pages-sitemap.xml', W],
    ['/blog-posts-sitemap.xml', W],
    ['/blog-categories-sitemap.xml', W],
    ['/booking-services-sitemap.xml', W],
    ['/portfolio-collections-sitemap.xml', W],
    ['/portfolio-projects-sitemap.xml', W],
  ]),

  /* ----------------------------------------- blog consolidation 27 -> 11 */
  ...mergedPost('how-to-choose-the-right-color-palette-for-your-business',
    BLOG('how-to-balance-functionality-and-aesthetics-in-a-commercial-space'), 'Blog #1 merged into #4'),
  ...mergedPost('the-role-of-branding-in-commercial-interior-design',
    BLOG('how-to-balance-functionality-and-aesthetics-in-a-commercial-space'), 'Blog #2 merged into #4'),
  ...mergedPost('how-to-create-a-modern-and-timeless-look-in-your-business-space',
    BLOG('how-to-balance-functionality-and-aesthetics-in-a-commercial-space'), 'Blog #3 merged into #4'),
  ...mergedPost('how-to-cut-costs-without-compromising-quality-in-a-commercial-remodel',
    BLOG('the-biggest-cost-factors-in-commercial-renovation-projects'), 'Blog #6 merged into #13'),
  ...mergedPost('cost-saving-strategies-for-large-scale-commercial-renovations',
    BLOG('the-biggest-cost-factors-in-commercial-renovation-projects'), 'Blog #9 merged into #13'),
  ...mergedPost('the-pros-and-cons-of-financing-a-commercial-renovation-through-loans',
    BLOG('how-to-finance-a-commercial-renovation-without-breaking-the-bank'), 'Blog #8 merged into #11'),
  ...mergedPost('why-pre-construction-planning-is-essential-for-commercial-projects',
    BLOG('how-to-prepare-your-business-for-a-major-renovation'), 'Blog #15 merged into #14'),
  ...mergedPost('top-tips-for-selecting-the-best-bathroom-renovation-contractors-for-your-vision',
    BLOG('how-to-choose-the-right-contractor-for-your-renovation-project'), 'Blog #16 merged into #12'),
  ...mergedPost('top-tips-for-choosing-the-right-remodeling-bathroom-contractor',
    BLOG('how-to-choose-the-right-contractor-for-your-renovation-project'), 'Blog #20 merged into #12'),
  ...mergedPost('top-tips-for-finding-the-best-bath-renovation-services-near-you',
    '/services/bathroom-renovations', 'Blog #17 merged into the bathroom service page'),
  ...mergedPost('top-tips-for-finding-the-best-bathroom-remodel-services-near-you',
    '/services/bathroom-renovations', 'Blog #18 merged into the bathroom service page'),
  ...mergedPost('efficient-cooking-top-functional-kitchen-ideas-for-small-spaces',
    BLOG('essential-design-strategies-for-small-kitchen-renovations'), 'Blog #21 merged into #27'),
  ...mergedPost('the-complete-guide-to-designing-a-functional-small-kitchen',
    BLOG('essential-design-strategies-for-small-kitchen-renovations'), 'Blog #22 merged into #27'),
  ...mergedPost('kitchen-design-ideas-for-small-kitchens',
    BLOG('essential-design-strategies-for-small-kitchen-renovations'), 'Blog #23 merged into #27'),
  ...mergedPost('maximize-space-smart-small-kitchen-layout-ideas-for-efficiency',
    BLOG('essential-design-strategies-for-small-kitchen-renovations'), 'Blog #24 merged into #27'),
  ...mergedPost('trending-kitchen-design-ideas-for-small-kitchens-you-ll-love',
    BLOG('essential-design-strategies-for-small-kitchen-renovations'), 'Blog #26 merged into #27'),
  // #7 contains outdated tax-program claims: unpublished (draft) until it is
  // rewritten as the Manitoba tax credits & rebates guide. 307 to #11 until
  // that guide is published, then 308 to it.
  ...mergedPost('tax-incentives-for-commercial-renovations-what-you-should-know',
    BLOG('how-to-finance-a-commercial-renovation-without-breaking-the-bank'),
    'Blog #7 unpublished pending rewrite (interim: #11)',
    { planned: '/blog/manitoba-renovation-tax-credits-rebates' }),
  // #25 is still published. It is replaced by the general-contractor explainer
  // (plan §9): this rule only takes effect once the new post is live AND the
  // old one is no longer a live page (status 'redirect' in blog-raw). Its
  // Wix-era /post/ URL (KEPT_POSTS below) then follows it in one hop.
  {
    from: BLOG('mastering-general-contracting-tips-for-your-next-project'),
    to: null,
    planned: BLOG('what-does-a-general-contractor-do'),
    evidence: A,
    note: 'Blog #25 replaced by the general contractor explainer (live on the current site until then)',
    since: INTERIM_SINCE,
  },

  // Kept posts: Wix-era /post/<slug> -> /blog/<slug>.
  ...KEPT_POSTS.map((slug) => ({
    from: `/post/${slug}`,
    to: BLOG(slug),
    evidence: A,
    note: 'Kept post: Wix-era /post/ URL',
  })),

  /* ------------------------------------- wildcards (written after the rest) */
  { from: '/service-page/:path*', to: '/services', evidence: W, note: 'Any other Wix booking service page' },
  { from: '/booking-calendar/:path*', to: '/book-online', evidence: W, note: 'Any other Wix booking calendar' },
  { from: '/blog/categories/:path*', to: '/blog', evidence: S, note: 'Wix blog category pages' },
  { from: '/portfolio-collections/:path*', to: '/projects', evidence: W, note: 'Wix portfolio collections (my-portfolio, project-title-1..6)' },
  { from: '/post/:path*', to: '/blog', evidence: W, note: 'Any other Wix blog post URL (must stay the very last rule)' },
];

/**
 * Short links to pages off this site (Google Business Profile, from GBP in
 * src/data/siteConfig.js). sync-redirects writes them verbatim, always as
 * temporary 307s so they can be repointed, after the explicit legacy rules and
 * before the wildcard and whole-host rules. The site itself never links to
 * them. Each `to` must be an absolute https URL on an allowed Google host
 * (sync-redirects EXTERNAL_HOSTS). A rule whose GBP URL is unset is left out.
 *   from   short path on this site
 *   to     absolute destination URL
 *   note   why the rule exists
 */
export const EXTERNAL_REDIRECTS = [
  { from: '/review', to: GBP.reviewUrl, note: 'Google "write a review" form for the Business Profile' },
  { from: '/reviews', to: GBP.mapsUrl, note: 'Business Profile on Google Maps, where the reviews are read' },
].filter((rule) => typeof rule.to === 'string' && rule.to);

/**
 * Whole-host redirects (plan §3.10): every path on these hosts answers a
 * permanent 308 to the same path on the apex. Vercel's public production
 * alias serves the full site with its own robots.txt, so it is folded into
 * the apex instead of competing with it. sync-redirects writes these after
 * every rule above, so a legacy URL requested on the alias still reaches its
 * final page in one hop (the rules above use absolute apex destinations).
 *
 * `domainRedirect: true` (www): today Vercel redirects www to the apex at the
 * domain level, before vercel.json is read, so this rule is inert and a
 * legacy Wix-era www URL takes two or three hops (www -> apex legacy URL ->
 * page). Once the www domain is switched in Vercel (Project -> Settings ->
 * Domains) from "Redirect to bridgelandbuilders.com" to serving this project,
 * this rule takes over: a legacy www URL is matched by its legacy rule above
 * and lands on its final apex page in one hop, every other www URL gets one
 * 308 to the same path on the apex, and no www page can ever answer 200.
 * check-redirects accepts both states for a host flagged this way.
 */
export const HOST_REDIRECTS = [
  { host: 'bridgeland-builders-website.vercel.app', note: 'Vercel production alias (public, unprotected)' },
  { host: 'www.bridgelandbuilders.com', domainRedirect: true, note: 'www (legacy Wix host): one hop once Vercel serves www from this project' },
];

/**
 * Legacy URLs deliberately left as 404 (nothing useful to send them to).
 * Listed so the redirect check can confirm they really return 404 and that no
 * wildcard rule swallows them.
 */
export const LEAVE_404 = [
  '/webinar-registration',
  '/webinar-registration-winnipeg-manitoba',
  '/event-list',
  '/profile/:path*',
  '/10',
  '/ads.txt',
  '/feed',
  // '/feed.xml' was here until 2026-10-23: it is now the blog's RSS feed.
  '/feeds/:path*',
  '/quality_auto/:path*',
  // Production answers 403 here (the Vercel firewall denies WordPress probes
  // before routing); check-redirects accepts that in production mode.
  '/wp-content/:path*',
];
