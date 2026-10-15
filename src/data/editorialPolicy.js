/**
 * Content for /editorial-policy (plan §11.3): how the site's guides and service
 * pages are written, sourced, checked and corrected. Every statement here is a
 * practice this site's publishing process can show (sources carry checked
 * dates, and an owner sign-off appears on a page only once it is recorded in
 * that page's `ownerSignoff`) — keep it that way. No claims
 * about licences, insurance, WCB coverage or warranties belong on this page,
 * and nothing about how reviews are requested until the owner confirms the
 * practice (owner input: review-request wording, plan §16).
 *
 * `sections[].blocks` are RichBody blocks (src/components/RichBody.jsx):
 * { t: 'p' | 'li' | 'h3', x } with inline [label](/path) and **bold**.
 * The page's title and description live in PAGE_SEO['/editorial-policy']
 * (seo.js), read by both the page and the prerender. Bump that entry's
 * `updated` and `lastUpdated` here together, and only when the policy itself
 * changes.
 */

const ACCESSED = '2026-10-13';

export const EDITORIAL_POLICY = {
  lastUpdated: '2026-10-15',
  hero: {
    eyebrow: 'Editorial Policy',
    title: 'HOW WE WRITE',
    highlight: 'AND CHECK OUR PAGES',
    description:
      'Who writes our guides, where our facts and prices come from, how often we check them, and how to tell us about a mistake.',
  },
  summaryTitle: 'The short version',
  summary: [
    'Our pages are written for Bridgeland Builders from the company’s own information and from official sources.',
    'Facts about permits, programs and rules come from official sources, linked with the date we checked them.',
    'Any price ranges we publish are based on our own figures, never on other contractors’ prices.',
    'If AI tools help draft a page, every fact, figure and link is checked against its original source before the page is published.',
    'Found a mistake? Email us and we will look into it.',
  ],
  sections: [
    {
      h2: 'Who writes and reviews our pages',
      blocks: [
        {
          t: 'p',
          x: 'The guides, service pages and articles on this site are written for Bridgeland Builders and credited to the [Bridgeland Builders team](/about-us). They are written from Bridgeland Builders’ own information, such as how we run a project, our timelines and our estimator’s price ranges, and from official sources for rules and programs.',
        },
        {
          t: 'p',
          x: 'When Bridgeland Builders or a reader points out something that is wrong or out of date, we correct the page. When Bridgeland Builders signs off a page, the page shows who reviewed it and the date.',
        },
        {
          t: 'p',
          x: 'We don’t name individual authors on our pages yet. When a named team member writes or reviews a page, we will show their name and role on it.',
        },
      ],
    },
    {
      h2: 'Where our facts come from',
      blocks: [
        {
          t: 'p',
          x: 'For permits, building rules, taxes, rebates and other programs, we rely on the organisations that run them, and we link to the page we used with the date we checked it. The sources we use most are:',
        },
        { t: 'li', x: '[City of Winnipeg](https://www.winnipeg.ca/): building and development permits, zoning and inspections in Winnipeg.' },
        {
          t: 'li',
          x: '[Government of Manitoba](https://www.gov.mb.ca/): the Manitoba Building Code, permits outside Winnipeg, and provincial programs and tax credits.',
        },
        { t: 'li', x: '[Canada Revenue Agency](https://www.canada.ca/en/revenue-agency.html): federal tax credits and GST.' },
        { t: 'li', x: '[Canada Mortgage and Housing Corporation (CMHC)](https://www.cmhc-schl.gc.ca/): housing and secondary-suite programs.' },
        { t: 'li', x: '[Efficiency Manitoba](https://efficiencymb.ca/): energy-efficiency rebates.' },
        { t: 'li', x: '[WCB Manitoba](https://www.wcb.mb.ca/): workplace safety coverage and clearances.' },
        {
          t: 'li',
          x: 'The cities, rural municipalities and planning district around Winnipeg that issue building permits, listed on our [service areas](/service-areas) page.',
        },
        {
          t: 'p',
          x: 'When a program closes or changes, we say so on the page instead of quietly removing it, so nobody plans around money that is no longer available.',
        },
        {
          t: 'p',
          x: 'We are renovation contractors, not accountants or financial advisers. Pages about taxes, rebates and financing explain programs in general terms. Check the official program page, or ask your accountant, before relying on them.',
        },
      ],
    },
    {
      h2: 'How we build price ranges',
      blocks: [
        {
          t: 'p',
          x: 'When we publish price ranges, they are based on Bridgeland Builders’ own figures. We never copy other contractors’ prices. For a starting range on your own project, use the price estimator on our [instant quote](/instant-quote) page.',
        },
        {
          t: 'p',
          x: 'These ranges are a starting point for planning, not a quote. Your price depends on the size of the space, the finishes you choose and what we find once walls and floors are open. A written quote follows a free on-site visit.',
        },
        {
          t: 'p',
          x: 'When a page uses a figure from somewhere else, such as a government agency, we name the source and link to it.',
        },
      ],
    },
    {
      h2: 'How we use AI tools',
      blocks: [
        {
          t: 'p',
          x: 'We sometimes use AI writing tools to help draft, organise or edit our pages. Every fact, figure and link is checked against the original source before a page is published, and the page links that source with the date it was checked. A named reviewer is shown on a page once one is recorded.',
        },
      ],
    },
    {
      h2: 'How we keep pages up to date',
      blocks: [
        { t: 'li', x: 'Cost pages say which period their prices cover and are refreshed at least once a year.' },
        { t: 'li', x: 'Pages that mention government programs, rebates, tax credits or permit rules are re-checked against the official source at least once a year, and the source link shows the date we last checked it.' },
        { t: 'li', x: 'Our guides show the date they were last updated. We change that date only when the content actually changes.' },
      ],
    },
    {
      h2: 'Photos and videos',
      blocks: [
        { t: 'li', x: 'Inspiration photos are labelled as inspiration, not as our work.' },
        {
          t: 'li',
          x: 'Photos and videos of our own jobs are labelled with the community or neighbourhood and the date, and are published only with the client’s permission.',
        },
        { t: 'li', x: 'We never present AI-generated or stock images as photos of our jobs.' },
      ],
    },
  ],
  corrections: {
    h2: 'Corrections',
    // Rendered by the page around the email link.
    before: 'If you spot something wrong or out of date on our site, email us at',
    after: 'with the page address and what needs fixing.',
    followUp: 'We read every correction request. When we fix a factual error, we update the page and the date it was last updated.',
  },
  // Kept for the record of when the source links above were last opened.
  sourcesAccessed: ACCESSED,
};

export default EDITORIAL_POLICY;
