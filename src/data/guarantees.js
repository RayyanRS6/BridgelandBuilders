// Named guarantees suggested by the competitor review (owner, 2026-10-22). A
// guarantee is a binding public promise, so every one is OFF until the owner
// has picked it and confirmed in writing each point listed for it in
// GUARANTEE_CONDITIONS below, and the exact `promise` and `terms` wording.
// Then set enabled: true and rebuild: src/components/Guarantees.jsx shows the
// enabled ones. Never enable one to fill a gap, and no guarantee or warranty
// schema.
//
// While none is enabled, vite.config.js sets __HAS_GUARANTEES__ to false and
// the pages leave the section out entirely, so no page downloads this text.
// Plain data, no imports (vite.config.js reads it).
//
// `pages`: where it shows. 'home', 'process' (/our-process), and service pages
// by registry category (src/data/services.js): 'residential', 'commercial',
// 'additional'.
//
// The wording follows what the site already says: a free written quote with
// the scope, price and schedule, nothing starts until it is approved, and a
// progress update every week. How changes are priced is not owner-confirmed
// yet (ProcessPage.jsx gives it as guidance only), hence the price lock's
// first two conditions.
export const GUARANTEES = [
  {
    id: 'price-lock',
    name: 'Price Lock Guarantee',
    promise: 'Your written quote is your price. The only changes are the ones you approve and sign as a change order.',
    terms: 'Covers the scope in your signed quote, with taxes shown.',
    pages: ['home', 'process', 'residential'],
    enabled: false,
  },
  {
    id: 'friday-photo-report',
    name: 'Friday Photo Report',
    promise: 'Every Friday while the work is under way, you get your progress update with photos: what was done, what comes next and any decisions we need from you.',
    terms: 'Sent by email or text, from the first week on site to handover.',
    pages: ['home', 'process', 'residential', 'commercial'],
    enabled: false,
  },
  {
    id: 'open-on-your-date',
    name: 'Open on Your Date',
    promise: 'We set your handover date from your lease and opening dates, write it into your signed contract, and plan the work so your space is ready to open on that date.',
    terms: 'Dates moved by permit reviews, inspections, landlord work or changes you request are agreed with you in writing.',
    pages: ['commercial'],
    enabled: false,
  },
];

// What the owner must confirm in writing before each guarantee is enabled,
// keyed by id. A separate export so it never ships to the browser (no page
// imports it).
export const GUARANTEE_CONDITIONS = {
  'price-lock': [
    'Every job gets a written quote, and its price is final for the scope it lists (not an estimate).',
    'The price changes only through a change order the client signs before that work is done, including work for anything found behind walls or under floors.',
    'How allowances (finishes not yet chosen), permit fees and taxes are handled inside the locked price.',
    'How long a quote holds its price before it is signed.',
  ],
  'friday-photo-report': [
    'A report with photos goes out every Friday on every active job, who sends it, and by email or text.',
    'What happens on a holiday Friday or in a week with no work on site.',
    'What the client is offered if a report is missed.',
    'Clients agree to photos of their home or business being taken for the report.',
  ],
  'open-on-your-date': [
    'Which commercial jobs qualify (scope, minimum lead time before the lease date).',
    'The date goes into the signed contract, and what the client gets if it is missed (for example a set credit per day).',
    'Exclusions: City permit reviews and inspections, landlord work, client changes, late client-supplied items and weather.',
  ],
};

/** Whether any guarantee is switched on (read by vite.config.js). */
export const hasEnabledGuarantees = () => GUARANTEES.some((item) => item.enabled);
