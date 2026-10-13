import { SITE_PHONE, SITE_PHONE_TEL } from '../data/siteConfig.js';
import { PhoneIcon } from './icons.jsx';

export default function TopBar() {
  return (
    <div className="top-bar">
      <div className="top-bar-greeting">
        <span className="pulse-dot"></span>
        <span>Hi! This is Emma from <strong>Bridgeland Builders</strong>.</span>
      </div>
      <div className="top-bar-contact">
        <span>Winnipeg, Manitoba</span>
        <a href={SITE_PHONE_TEL} data-cta="top-bar-call">
          <PhoneIcon size={14} />
          {SITE_PHONE}
        </a>
      </div>
    </div>
  );
}
