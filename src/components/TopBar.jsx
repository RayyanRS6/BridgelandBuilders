import { SITE_PHONE, SITE_PHONE_TEL } from '../data/siteConfig.js';
import { PhoneIcon } from './icons.jsx';

export default function TopBar() {
  return (
    <div className="top-bar">
      <div className="top-bar-greeting">
        <span className="pulse-dot"></span>
        {/* Emma is the website chat assistant, not a person (owner, 2026-10-13). */}
        <span>Hi! I’m Emma, <strong>Bridgeland’s</strong> virtual assistant.</span>
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
