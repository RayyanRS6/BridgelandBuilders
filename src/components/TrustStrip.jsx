import { BBB_PROFILE_URL, GBP, REVIEW_STATS } from '../data/siteConfig.js';
import { CalendarIcon, CheckIcon, ShieldIcon, StarIcon } from './icons.jsx';

// A row of proof badges (owner request 2026-10-22, from the competitor
// review). Only what a visitor can check, or an offer the site already makes:
//   google  the Google rating and review count (REVIEW_STATS, read from the
//           live profile), linked to the profile. Visible text only, never
//           aggregateRating/review schema (plan §3.5).
//   bbb     the Better Business Bureau profile link. No BBB rating or
//           accreditation is claimed: only the profile itself is verified.
//   visit   the free on-site visit; quote: the free written quote.
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
    // Read aloud as "Rated 5.0 out of 5 on Google, from 4 reviews".
    google: REVIEW_STATS.count > 0 && GBP.mapsUrl && (
      <a className="trust-badge" href={GBP.mapsUrl} {...NEW_TAB} data-cta={`${cta}-google-rating`}>
        <Icon><StarIcon size={15} /></Icon>
        <span>
          <span className="visually-hidden">Rated </span>{RATING}<span className="visually-hidden"> out of 5</span> on Google
          <span aria-hidden="true"> · </span><span className="visually-hidden">, from </span>{REVIEWS}
        </span>
      </a>
    ),
    bbb: BBB_PROFILE_URL && (
      <a className="trust-badge" href={BBB_PROFILE_URL} {...NEW_TAB} data-cta={`${cta}-bbb`}>
        <Icon><ShieldIcon size={15} /></Icon>
        <span>BBB<span className="visually-hidden"> (Better Business Bureau)</span> business profile</span>
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
