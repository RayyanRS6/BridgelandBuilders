import { BUSINESS_HOURS, SITE_PHONE, SITE_PHONE_TEL } from '../data/siteConfig.js';
import { CalendarIcon, CheckIcon, ClockIcon, PhoneIcon, ShieldIcon } from './icons.jsx';

/** '16:30' -> '4:30 p.m.' */
function clock(time) {
  const [hours, minutes] = String(time).split(':').map(Number);
  const suffix = hours < 12 ? 'a.m.' : 'p.m.';
  // Non-breaking space, so "a.m." never wraps away from its time.
  return `${hours % 12 || 12}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

/** "Monday to Friday, 8:30 a.m. to 4:30 p.m." from BUSINESS_HOURS (the schema's hours). */
const HOURS_TEXT = BUSINESS_HOURS.map(({ days, opens, closes }) => {
  const span = days.length > 1 ? `${days[0]} to ${days[days.length - 1]}` : days[0];
  return `${span}, ${clock(opens)} to ${clock(closes)}`;
}).join('; ');

/**
 * The left column beside the booking form. `showHours` adds the office hours
 * under the phone number (the /contact-us page, which is the canonical
 * contact page and so carries the same hours as the business schema).
 */
export default function BookingAside({ serviceName, showHours = false }) {
  return (
    <div className="lead-aside">
      <span className="section-tag">Book an appointment</span>
      <h2>Let’s talk about your {serviceName.toLowerCase()}</h2>
      <p>
        Send us the details and we’ll come to the property, look at the space with you, and give you a straight answer on what it takes.
      </p>
      <ul className="lead-aside-list">
        <li className="lead-aside-item">
          <span className="lead-aside-icon"><CalendarIcon size={16} /></span>
          <div>
            <h4>Free, no-obligation visit</h4>
            <p>We come out, measure up, and talk it through. You decide after that.</p>
          </div>
        </li>
        <li className="lead-aside-item">
          <span className="lead-aside-icon"><ClockIcon size={16} /></span>
          <div>
            <h4>Reply within one business day</h4>
            <p>Our team gets back to you by phone, text, or email — your pick.</p>
          </div>
        </li>
        <li className="lead-aside-item">
          <span className="lead-aside-icon"><CheckIcon size={16} /></span>
          <div>
            <h4>Clear written quote</h4>
            <p>One price, itemised, with nothing hiding in the small print.</p>
          </div>
        </li>
        <li className="lead-aside-item">
          <span className="lead-aside-icon"><ShieldIcon size={16} /></span>
          <div>
            <h4>Your details stay private</h4>
            <p>We use them to get back to you about your project, and we never sell them.</p>
          </div>
        </li>
        <li className="lead-aside-item">
          <span className="lead-aside-icon"><PhoneIcon size={16} strokeWidth="2" /></span>
          <div>
            <h4>Rather just call?</h4>
            <p><a href={SITE_PHONE_TEL} style={{ color: '#fff', fontWeight: 700 }}>{SITE_PHONE}</a> — Winnipeg, Manitoba</p>
            {showHours && HOURS_TEXT && <p>Office hours: {HOURS_TEXT}</p>}
          </div>
        </li>
      </ul>
    </div>
  );
}
