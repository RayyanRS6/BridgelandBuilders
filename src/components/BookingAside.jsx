import { CalendarIcon, CheckIcon, ClockIcon, PhoneIcon, ShieldIcon } from './icons.jsx';

export default function BookingAside({ serviceName }) {
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
            <p>Emma gets back to you by phone, text, or email — your pick.</p>
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
            <p>We use them to get back to you about this project. That’s it.</p>
          </div>
        </li>
        <li className="lead-aside-item">
          <span className="lead-aside-icon"><PhoneIcon size={16} strokeWidth="2" /></span>
          <div>
            <h4>Rather just call?</h4>
            <p><a href="tel:431-866-5644" style={{ color: '#fff', fontWeight: 700 }}>431-866-5644</a> — Winnipeg, Manitoba</p>
          </div>
        </li>
      </ul>
    </div>
  );
}
