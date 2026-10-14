import { REPLY_TIME, officeHoursText } from '../data/facts.js';
import { BBB_PROFILE_URL, SITE_PHONE, SITE_PHONE_TEL } from '../data/siteConfig.js';
import { CalendarIcon, CheckIcon, ClockIcon, PhoneIcon, ShieldIcon } from './icons.jsx';

/**
 * "Monday to Friday, 8:30 a.m. to 4:30 p.m." from BUSINESS_HOURS (the schema's
 * hours), with a non-breaking space so "a.m." never wraps away from its time.
 */
const HOURS_TEXT = officeHoursText('\u00a0');

/**
 * The left column beside the booking form. `showHours` adds the office hours
 * under the phone number (the /contact-us page, which is the canonical
 * contact page and so carries the same hours as the business schema).
 * `title` replaces the default "Let’s talk about your …" heading on pages
 * whose H1 already says that (/contact-us) or where it would be generic
 * (/book-online). The list items are h3s under that h2.
 */
export default function BookingAside({ serviceName, title, showHours = false }) {
  return (
    <div className="lead-aside">
      <span className="section-tag">Book an on-site visit</span>
      <h2>{title || `Let’s talk about your ${serviceName.toLowerCase()}`}</h2>
      <p>
        Send us the details and we’ll come to the property, look at the space with you, and give you a straight answer on what it takes.
      </p>
      <ul className="lead-aside-list">
        <li className="lead-aside-item">
          <span className="lead-aside-icon"><CalendarIcon size={16} /></span>
          <div>
            <h3>Free, no-obligation visit</h3>
            <p>We come out, measure up, and talk it through. You decide after that.</p>
          </div>
        </li>
        <li className="lead-aside-item">
          <span className="lead-aside-icon"><ClockIcon size={16} /></span>
          <div>
            <h3>Reply within {REPLY_TIME}</h3>
            <p>Our team gets back to you by phone, text, or email — your pick.</p>
          </div>
        </li>
        <li className="lead-aside-item">
          <span className="lead-aside-icon"><CheckIcon size={16} /></span>
          <div>
            <h3>Clear written quote</h3>
            <p>One price, itemised, with nothing hiding in the small print.</p>
          </div>
        </li>
        <li className="lead-aside-item">
          <span className="lead-aside-icon"><ShieldIcon size={16} /></span>
          <div>
            <h3>Your details stay private</h3>
            <p>We use them to get back to you about your project, and we never sell them.</p>
          </div>
        </li>
        <li className="lead-aside-item">
          <span className="lead-aside-icon"><PhoneIcon size={16} strokeWidth="2" /></span>
          <div>
            <h3>Rather just call?</h3>
            <p><a href={SITE_PHONE_TEL} style={{ color: '#fff', fontWeight: 700 }}>{SITE_PHONE}</a> — Winnipeg, Manitoba</p>
            {showHours && HOURS_TEXT && <p>Office hours: {HOURS_TEXT}</p>}
          </div>
        </li>
      </ul>
      {/* Trust line near the form (plan §19): the BBB profile link only. No
          rating, and no Google rating until the profile has 10+ reviews. */}
      {BBB_PROFILE_URL && (
        <p className="lead-aside-trust">
          <a href={BBB_PROFILE_URL} rel="noopener" target="_blank" data-cta="booking-aside-bbb">
            Check us on the Better Business Bureau
          </a>
        </p>
      )}
    </div>
  );
}
