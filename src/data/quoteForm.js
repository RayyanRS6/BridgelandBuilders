// The /free-quote form, defined once and shared by the page (labels, options)
// and the booking API (GoHighLevel field ids), so the two cannot drift apart.
//
// The questions mirror the GoHighLevel survey the site used before
// (AWCtvdzsDQtAdqsQyQYL). Each `fieldId` is that survey's custom field id, and
// each option is spelled exactly as GoHighLevel stores it, so leads from this
// form land in the same contact fields as leads from the old survey.
// If an option is renamed in GoHighLevel, rename it here too.
//
// Plain data (plus small pure helpers) only: no libraries. Validation, which
// needs the phone-number library, lives in src/data/leadValidation.js so pages
// can import this file without downloading it.
//
// `tagPrefix`: every answer to that question is also added to the contact as a
// GoHighLevel tag, e.g. "renovation: kitchen". The prefix keeps each group
// together and unambiguous in the tag list; set it to '' to tag with the bare
// answer instead.

/** The phone field's default country (validation: src/data/leadValidation.js). */
export const DEFAULT_PHONE_COUNTRY = 'CA';

export const QUOTE_QUESTIONS = [
  {
    key: 'winnipeg',
    fieldId: '8yUbHmr0rJ50bP4jS61e',
    // The GoHighLevel field is "Are you from Winnipeg?"; the service area is
    // Winnipeg and nearby communities (within about an hour), so the question
    // is asked that way. Only the wording changed: the Yes/No values, the key
    // and the fieldId stay exactly as GoHighLevel stores them.
    label: 'Is the project in Winnipeg or a nearby community (within about an hour)?',
    options: ['Yes', 'No'],
    multiple: false,
  },
  {
    key: 'types',
    fieldId: 'wTWAtpBrbrKdMaQEhh2z',
    label: 'Type of renovation',
    hint: 'Pick all that apply',
    options: ['House', 'Kitchen', 'Bathroom', 'Basement', 'Whole Home Renovation', 'Commercial', 'Other'],
    multiple: true,
    tagPrefix: 'renovation',
  },
  // The old survey's "Renovation Timeline" (YljBtlZiMffwZI7ymHp6) and "Budget
  // Range" (tliHqkWdeMJVML7OLAFR) questions were dropped from this form on
  // request. To bring one back, re-add it here with its fieldId, options and a
  // tagPrefix — the form, validation, GoHighLevel fields and tags all follow.
];

// Service area. Every lead fills in the whole form and is saved to
// GoHighLevel either way, so no details are lost. Only a "Yes" then goes on to
// the calendar; anyone else is shown OUTSIDE_AREA_MESSAGE after submitting and
// carries OUTSIDE_AREA_TAG, so GoHighLevel workflows can leave them out of the
// normal follow-up.
export const SERVICE_AREA = { key: 'winnipeg', inArea: 'Yes' };
export const OUTSIDE_AREA_MESSAGE = 'Sorry — we’re not currently offering services outside Winnipeg and nearby communities.';
export const OUTSIDE_AREA_TAG = 'outside-service-area';

export const isInServiceArea = (lead) => lead[SERVICE_AREA.key] === SERVICE_AREA.inArea;

// The GoHighLevel calendar the second step books into — the same calendar
// used on /book-online. Each booking is a free on-site visit (confirmed by the
// owner 2026-10-13). The calendar is still named "Free 15-Minute Discovery
// Call" inside GoHighLevel; rename it there so confirmation messages match.
// durationMinutes is the GoHighLevel slot length, not shown to visitors.
export const BOOKING_CALENDAR = {
  id: 'RmkDQbRjI83ES3E4K5OA',
  name: 'Free On-Site Visit',
  durationMinutes: 15,
  // Slots are fetched and shown in the business's own time zone, so a visitor
  // always sees the same times the crew does.
  timeZone: 'America/Winnipeg',
  timeZoneLabel: 'Winnipeg time',
};

// Tag added to every contact this form creates, so these leads can be filtered
// (and attributed to the ads) inside GoHighLevel.
export const LEAD_TAG = 'free-quote-page';
export const FORM_FILLED_TAG = 'website-form-filled';
export const LEAD_SOURCE = 'Free Quote Page';

// Added only when the visitor ticks the form's optional "Email me occasional
// renovation tips and offers" box: express consent to marketing emails under
// Canada's Anti-Spam Legislation (CASL). Without it, marketing emails rely on
// implied consent (6 months after an inquiry). The first time it is ticked,
// a dated note on the contact records when it was given (and a booked
// visit's notes repeat it; api/_lib/ghl.js). Never removed here: leaving
// the box unticked on a later request is not a withdrawal of consent.
export const MARKETING_CONSENT_TAG = 'marketing-consent-express';

// Per-page tags and a channel label (SEO plan §18). OFF until the GoHighLevel
// admin has audited every workflow that triggers on LEAD_TAG / LEAD_SOURCE and
// test leads confirm follow-ups still run (plan O-19). While false, tags and
// source are exactly as above for every page. When true:
//   - /free-quote keeps LEAD_TAG and LEAD_SOURCE;
//   - other pages get "form-page:<page>" instead of LEAD_TAG and the source
//     WEBSITE_FORM_SOURCE;
//   - every lead also gets "channel:<channel>" and the channel in its source,
//     e.g. "Website Form (facebook) · paid-social".
export const TAG_BY_FORM_PAGE = false;
export const WEBSITE_FORM_SOURCE = 'Website Form';
const LEAD_TAG_PAGE = '/free-quote';

// GoHighLevel custom-field ids for lead attribution, supplied by the GHL admin
// (plan O-19). Empty means nothing is written; fill in only the ones that
// exist, e.g. channel: 'AbC123…'. Values come from the cleaned attribution
// (api/_lib/http.js cleanAttribution):
//   channel, formPage, landingPage, referrer, firstSource, firstMedium,
//   firstCampaign, firstTerm, firstReferrer, firstLanding, lastSource,
//   lastMedium, lastCampaign, lastTerm, lastContent, gclid, gbraid, wbraid,
//   fbclid, msclkid, gaClientId, fbp, fbc
// A wrong or deleted id never costs a lead: GoHighLevel's refusal is logged
// and the contact saved again without these fields (api/_lib/ghl.js).
export const ATTRIBUTION_FIELDS = {};

/** "/services/kitchen-renovations" -> "services-kitchen-renovations" ("/" -> "home"). */
const pageSlug = (path) => String(path || '').replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'home';

/** The page tag for a lead: LEAD_TAG unless TAG_BY_FORM_PAGE is on. */
export function pageTagFor(formPage) {
  if (!TAG_BY_FORM_PAGE || !formPage || formPage === LEAD_TAG_PAGE) return LEAD_TAG;
  return `form-page:${pageSlug(formPage)}`;
}

/** The GoHighLevel contact source. Unchanged from LEAD_SOURCE unless TAG_BY_FORM_PAGE is on. */
export function sourceFor({ utmSource, formPage, channel } = {}) {
  const base = TAG_BY_FORM_PAGE && formPage && formPage !== LEAD_TAG_PAGE ? WEBSITE_FORM_SOURCE : LEAD_SOURCE;
  const withUtm = utmSource ? `${base} (${utmSource})` : base;
  return TAG_BY_FORM_PAGE && channel ? `${withUtm} · ${channel}` : withUtm;
}

/**
 * Every tag a lead should carry: the website-form-filled tag, the page tag,
 * one per answer for each question that has a tagPrefix, OUTSIDE_AREA_TAG
 * when out of the service area, and MARKETING_CONSENT_TAG when the consent
 * box was ticked. GoHighLevel stores tags in lower case, so they are built
 * that way here. `context` ({ formPage, channel }) only matters when
 * TAG_BY_FORM_PAGE is on.
 */
export function tagsForLead(lead, context = {}) {
  const tags = [FORM_FILLED_TAG, pageTagFor(context.formPage)];
  if (TAG_BY_FORM_PAGE && context.channel) tags.push(`channel:${context.channel}`);
  if (!isInServiceArea(lead)) tags.push(OUTSIDE_AREA_TAG);
  if (lead.marketingConsent === true) tags.push(MARKETING_CONSENT_TAG);
  for (const question of QUOTE_QUESTIONS) {
    if (question.tagPrefix === undefined) continue;
    for (const answer of [].concat(lead[question.key] ?? [])) {
      tags.push((question.tagPrefix ? `${question.tagPrefix}: ${answer}` : answer).toLowerCase());
    }
  }
  return [...new Set(tags)];
}

/**
 * GoHighLevel customFields entries for the attribution fields that have an id
 * in ATTRIBUTION_FIELDS. Returns [] while the map is empty. `attribution` is
 * the server-cleaned object from cleanAttribution().
 */
export function attributionCustomFields(attribution, ids = ATTRIBUTION_FIELDS) {
  if (!attribution || !ids || !Object.keys(ids).length) return [];
  const first = attribution.first || {};
  const last = attribution.last || {};
  const values = {
    channel: attribution.channel,
    formPage: attribution.formPage,
    landingPage: attribution.landing || last.landing,
    referrer: last.referrer,
    firstSource: first.source,
    firstMedium: first.medium,
    firstCampaign: first.campaign,
    firstTerm: first.term,
    firstReferrer: first.referrer,
    firstLanding: first.landing,
    lastSource: last.source,
    lastMedium: last.medium,
    lastCampaign: last.campaign,
    lastTerm: last.term,
    lastContent: last.content,
    gclid: last.gclid || first.gclid,
    gbraid: last.gbraid || first.gbraid,
    wbraid: last.wbraid || first.wbraid,
    fbclid: last.fbclid || first.fbclid,
    msclkid: last.msclkid || first.msclkid,
    gaClientId: attribution.gaClientId,
    fbp: attribution.fbp,
    fbc: attribution.fbc,
  };
  return Object.entries(ids)
    .filter(([key, id]) => typeof id === 'string' && id && values[key])
    .map(([key, id]) => ({ id, field_value: String(values[key]) }));
}
