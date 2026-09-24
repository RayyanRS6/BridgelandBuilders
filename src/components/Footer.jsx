import { Link } from 'react-router-dom';
import { PhoneIcon, PinIcon } from './icons.jsx';

const FOOTER_COLUMNS = [
  {
    title: 'COMPANY',
    links: [
      { label: 'ABOUT US', to: '/about-us' },
      { label: 'OUR SERVICES', to: '/services' },
      { label: 'OUR PROCESS', to: '/our-process' },
      { label: 'OUR PROJECTS', to: '/projects' },
      { label: 'FAQs', to: '/faqs' },
      { label: 'BLOGS & ARTICLES', to: '/blog' },
      { label: 'BOOK ONLINE', to: '/book-online' },
      { label: 'CONTACT US', to: '/contact-us' },
    ],
  },
  {
    title: 'RESIDENTIAL',
    links: [
      { label: 'BASEMENT RENOVATIONS', to: '/services/basement-renovations' },
      { label: 'BATHROOM RENOVATIONS', to: '/services/bathroom-renovations' },
      { label: 'HOME EXTENSIONS', to: '/services/home-extensions' },
      { label: 'KITCHEN RENOVATIONS', to: '/services/kitchen-renovations' },
      { label: 'WHOLE HOME RENOVATIONS', to: '/services/whole-home-renovations' },
    ],
  },
  {
    title: 'COMMERCIAL',
    links: [
      { label: 'COMMERCIAL RENOVATIONS', to: '/services/commercial-renovations' },
      { label: 'REQUEST A SITE VISIT', to: '/contact-us' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top-grid">
          {/* Brand Info */}
          <div className="footer-col-brand">
            <Link to="/" className="footer-logo" aria-label="Bridgeland Builders home">
              <img
                src="/logo-on-dark.png"
                alt="Bridgeland Builders — bridging dreams into reality"
                width="460"
                height="444"
                loading="lazy"
                decoding="async"
              />
            </Link>
            <p>
              Your Winnipeg Trusted Renovation and Construction Company. Over 60 years of combined experience turning ideas into reality.
            </p>
            <div className="footer-contact-item">
              <PhoneIcon size={16} strokeWidth="2" />
              <a href="tel:431-866-5644">431-866-5644</a>
            </div>
            <div className="footer-contact-item">
              <PinIcon size={16} />
              <span>Winnipeg, Manitoba</span>
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div className="footer-col" key={column.title}>
              <h4 className="footer-col-title">{column.title}</h4>
              <ul className="footer-links-list">
                {column.links.map((link) => (
                  <li key={link.label}><Link to={link.to}>{link.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p>
            © 2026 Bridgeland Builders. Winnipeg, Manitoba. All rights reserved. ·{' '}
            <Link to="/privacy-policy">Privacy Policy</Link>
          </p>
          <div className="footer-social-links">
            <span title="Facebook">f</span>
            <span title="Instagram">in</span>
            <span title="LinkedIn">li</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
