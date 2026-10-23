import { BBB_PROFILE_URL, GBP, REVIEW_STATS } from '../data/siteConfig.js';
import { ArrowRightIcon, CalendarIcon, CheckIcon, StarIcon } from './icons.jsx';

// A row of proof badges (owner request 2026-10-22, from the competitor
// review). Only what a visitor can check, or an offer the site already makes:
//   google  the Google rating and review count (REVIEW_STATS, read from the
//           live profile), linked to the profile. Visible text only, never
//           aggregateRating/review schema (plan §3.5).
//   bbb     "BBB Accredited Business", linked to the Better Business Bureau
//           profile (accredited since BBB_ACCREDITED_SINCE in siteConfig.js,
//           checked on the profile 2026-10-23). Words only: no BBB letter
//           grade, and no shield or seal look. If the accreditation ends, the
//           SEO audit fails the build until this goes back to "Check us on the
//           BBB" (the date is not imported here: it would land in the entry
//           chunk, which is at its JavaScript budget).
//   visit   the free on-site visit; quote: the free written quote.
// Each link's accessible name starts with its visible text (WCAG 2.5.3); the
// extra words for screen readers come after it. Text extractors (search and
// AI crawlers) read the DOM text, so it carries no stray separators: the
// Google badge reads "5.0 on Google · 4 reviews" in the DOM, and its
// aria-label gives screen readers the same words with the scale.
// No insurance, WCB, licence, warranty, guarantee, lien-waiver or membership
// badge (RenoMark, MHBA, Houzz and the like), and no placeholder for one,
// until the owner supplies the document behind it (plan O-6, O-7).

const RATING = REVIEW_STATS.rating.toFixed(1);
const REVIEWS = `${REVIEW_STATS.count} ${REVIEW_STATS.count === 1 ? 'review' : 'reviews'}`;
const NEW_TAB = { target: '_blank', rel: 'noopener noreferrer' };

const Icon = ({ children }) => (
  <span className="trust-badge-icon" aria-hidden="true">
    {children}
  </span>
);

/**
 * `items`: which badges, in order. `cta`: prefix for the links' data-cta,
 * e.g. 'instant-quote' -> 'instant-quote-bbb'.
 */
export default function TrustStrip({ items = ['google', 'bbb', 'visit', 'quote'], cta = 'trust' }) {
  const badges = {
    // DOM text "5.0 on Google · 4 reviews"; read aloud as "5.0 on Google,
    // 4 reviews, rated 5.0 out of 5".
    google: REVIEW_STATS.count > 0 && GBP.mapsUrl && (
      <a
        className="trust-badge"
        href={GBP.mapsUrl}
        {...NEW_TAB}
        aria-label={`${RATING} on Google, ${REVIEWS}, rated ${RATING} out of 5`}
        data-cta={`${cta}-google-rating`}
      >
        <Icon><StarIcon size={15} /></Icon>
        <span className="trust-badge-text">{`${RATING} on Google · ${REVIEWS}`}</span>
      </a>
    ),
    // A plain link with the arrow the site's other text links use. DOM text
    // and accessible name: "BBB Accredited Business (Better Business Bureau)".
    bbb: BBB_PROFILE_URL && (
      <a className="trust-badge" href={BBB_PROFILE_URL} {...NEW_TAB} data-cta={`${cta}-bbb`}>
        <span className="trust-badge-text">
          BBB Accredited Business<span className="visually-hidden"> (Better Business Bureau)</span>
        </span>
        <Icon><ArrowRightIcon size={13} /></Icon>
      </a>
    ),
    visit: (
      <span className="trust-badge">
        <Icon><CalendarIcon size={15} /></Icon>
        <span>Free on-site visit</span>
      </span>
    ),
    quote: (
      <span className="trust-badge">
        <Icon><CheckIcon size={15} /></Icon>
        <span>Free written quotes</span>
      </span>
    ),
  };
  const shown = items.filter((key) => badges[key]);
  if (!shown.length) return null;

  return (
    <ul className="trust-strip">
      {shown.map((key) => (
        <li key={key}>{badges[key]}</li>
      ))}
    </ul>
  );
}
