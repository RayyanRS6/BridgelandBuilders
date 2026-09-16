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
        <a href="tel:431-866-5644">
          <PhoneIcon size={14} />
          431-866-5644
        </a>
      </div>
    </div>
  );
}
