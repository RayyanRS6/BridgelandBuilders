import { Link } from 'react-router-dom';
import { liveServicesIn } from '../data/services.js';
import { BUSINESS, EXPERIENCE_YEARS, SITE_EMAIL, SITE_PHONE, SITE_PHONE_TEL } from '../data/facts.js';
import { SOCIAL_PROFILES } from '../data/siteConfig.js';
import { MailIcon, PhoneIcon, PinIcon } from './icons.jsx';

// The round social badges at the bottom of the footer. Each one links to the
// real profile (rel="me" ties the profiles to this site); a network without a
// URL in siteConfig.js keeps its plain, unlinked badge. Each badge carries a
// small line icon of the network (24px grid, drawn like icons.jsx) in place
// of the old letters, which read "in" for Instagram and "li" for LinkedIn.
const SOCIAL_LINKS = [
  {
    key: 'facebook',
    network: 'Facebook',
    icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
  {
    key: 'instagram',
    network: 'Instagram',
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.5h.01" />
      </>
    ),
  },
  {
    key: 'linkedin',
    network: 'LinkedIn',
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
  {
    key: 'youtube',
    network: 'YouTube',
    icon: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="4" />
        <path d="M10 9l5 3-5 3z" />
      </>
    ),
  },
  {
    key: 'tiktok',
    network: 'TikTok',
    icon: <path d="M13 3a5 5 0 0 0 5 5M13 3v13a4 4 0 1 1-4-4" />,
  },
  {
    key: 'x',
    network: 'X',
    icon: <path d="M4 4l11.7 16H20L8.3 4zM4 20l6.8-6.8m2.4-2.4L20 4" />,
  },
];

function SocialIcon({ children }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

// Service links come from the page registry (src/data/services.js): only live
// pages are listed, so a page appears here the day its status flips to 'live'.
const serviceLinks = (category) =>
  liveServicesIn(category).map((service) => ({ label: service.navLabel.toUpperCase(), to: service.path }));

const FOOTER_COLUMNS = [
  {
    title: 'COMPANY',
    links: [
      { label: 'ABOUT US', to: '/about-us' },
      { label: 'OUR SERVICES', to: '/services' },
      { label: 'OUR PROCESS', to: '/our-process' },
      { label: 'OUR PROJECTS', to: '/projects' },
      { label: 'RENOVATION COSTS', to: '/renovation-cost-winnipeg' },
      { label: 'FAQs', to: '/faqs' },
      { label: 'BLOGS & ARTICLES', to: '/blog' },
      { label: 'SERVICE AREAS', to: '/service-areas' },
      { label: 'BOOK ONLINE', to: '/book-online' },
      { label: 'CONTACT US', to: '/contact-us' },
    ],
  },
  {
    title: 'RESIDENTIAL',
    links: serviceLinks('residential'),
  },
  {
    // Commercial hub first, then the live vertical pages and general
    // contracting (plan §10).
    title: 'COMMERCIAL',
    links: [
      ...serviceLinks('commercial'),
      // /book-online is the page that books the free on-site visit (plan D8).
      { label: 'REQUEST A SITE VISIT', to: '/book-online' },
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
              {/* WebP at the display size (1x/2x) from scripts/build-images.mjs,
                  the PNG as the fallback. */}
              <picture>
                <source type="image/webp" srcSet="/logo-on-dark-220.webp 1x, /logo-on-dark-440.webp 2x" />
                <img
                  src="/logo-on-dark.png"
                  alt="Bridgeland Builders — bridging dreams into reality"
                  width="460"
                  height="444"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </Link>
            {/* The same short description as the schema and llms files. */}
            <p>
              {`${BUSINESS.shortDescription} Over ${EXPERIENCE_YEARS} years of combined experience turning ideas into reality.`}
            </p>
            <div className="footer-contact-item">
              <PhoneIcon size={16} strokeWidth="2" />
              <a href={SITE_PHONE_TEL}>{SITE_PHONE}</a>
            </div>
            <div className="footer-contact-item">
              <MailIcon size={16} />
              <a className="footer-contact-email" href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>
            </div>
            <div className="footer-contact-item">
              <PinIcon size={16} />
              <span>Winnipeg, Manitoba</span>
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div className="footer-col" key={column.title}>
              {/* A label, not a heading: as an h4 it skipped levels after
                  each page's h2s. The look comes from the class. */}
              <p className="footer-col-title">{column.title}</p>
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
            <Link to="/privacy-policy">Privacy Policy</Link> ·{' '}
            <Link to="/terms-of-service">Terms of Service</Link> ·{' '}
            <Link to="/editorial-policy">Editorial Policy</Link>
          </p>
          <div className="footer-social-links">
            {SOCIAL_LINKS.map(({ key, network, icon }) => {
              const href = SOCIAL_PROFILES?.[key];
              return href ? (
                <a
                  key={key}
                  href={href}
                  rel="me noopener"
                  target="_blank"
                  aria-label={`Bridgeland Builders on ${network}`}
                  title={network}
                >
                  <span aria-hidden="true"><SocialIcon>{icon}</SocialIcon></span>
                </a>
              ) : (
                <span key={key} title={network}><SocialIcon>{icon}</SocialIcon></span>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
