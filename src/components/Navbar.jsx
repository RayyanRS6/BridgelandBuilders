import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SERVICE_CATEGORIES } from '../data/serviceCategories.js';
import { INSTANT_QUOTE_PATH } from '../data/siteConfig.js';
import { ArrowRightIcon, ChevronDownIcon, ChevronRightIcon, MenuIcon } from './icons.jsx';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/about-us', label: 'About Us' },
  { to: '/our-process', label: 'Process' },
  { to: '/projects', label: 'Inspiration' },
  { to: '/faqs', label: 'FAQs' },
  { to: '/blog', label: 'Blog' },
];

export default function Navbar() {
  // 5. Mobile Menu Toggle — the open panel itself is styled by `.nav-links.is-open`
  // inside the <=1100px breakpoint, so it can size itself against the real
  // navbar height and the phone's visible viewport.
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [activeServiceCategory, setActiveServiceCategory] = useState('residential');
  const navLinksRef = useRef(null);
  const megaMenuRef = useRef(null);
  const servicesToggleRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Escape closes the innermost open menu (the mega menu first, then the
  // mobile panel), the usual disclosure-menu behaviour. Focus that was inside
  // the closing menu goes back to the button that opens it.
  useEffect(() => {
    if (!isMenuOpen && !isServicesMenuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return;
      const focused = document.activeElement;
      if (isServicesMenuOpen) {
        if (megaMenuRef.current?.contains(focused)) servicesToggleRef.current?.focus();
        setIsServicesMenuOpen(false);
      } else {
        if (navLinksRef.current?.contains(focused)) menuButtonRef.current?.focus();
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isMenuOpen, isServicesMenuOpen]);

  const selectedCategory = SERVICE_CATEGORIES.find(
    (category) => category.id === activeServiceCategory
  ) ?? SERVICE_CATEGORIES[0];

  const closeNavigation = () => {
    setIsMenuOpen(false);
    setIsServicesMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((current) => !current);
  };

  const handleServicesBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsServicesMenuOpen(false);
    }
  };

  // Phones and tablets fire mouseenter on tap as well, which opened the mega
  // menu a moment before the tap reached the toggle and closed it again. On a
  // touch device the button click is the only thing that should open it.
  const openServicesOnHover = () => {
    if (window.matchMedia?.('(hover: hover)').matches) {
      setIsServicesMenuOpen(true);
    }
  };

  const closeServicesOnHover = () => {
    if (window.matchMedia?.('(hover: hover)').matches) {
      setIsServicesMenuOpen(false);
    }
  };

  return (
    <div className="header-wrapper">
      <nav className="navbar" id="navbar">
        <Link to="/" className="brand-logo" onClick={closeNavigation}>
          {/* WebP at the display size (1x/2x) from scripts/build-images.mjs,
              the PNG as the fallback. */}
          <picture>
            <source type="image/webp" srcSet="/logo-mark-48.webp 1x, /logo-mark-96.webp 2x" />
            <img
              className="logo-mark"
              src="/logo-mark.png"
              alt=""
              width="96"
              height="96"
              decoding="async"
            />
          </picture>
          <span>Bridgeland Builders</span>
        </Link>

        <ul className={`nav-links${isMenuOpen ? ' is-open' : ''}`} ref={navLinksRef}>
          {NAV_LINKS.map((link) => {
            if (link.to !== '/services') {
              return (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) => `nav-primary-link${isActive ? ' active' : ''}`}
                    onClick={closeNavigation}
                  >
                    {link.label}
                  </NavLink>
                </li>
              );
            }

            return (
              <li
                className={`nav-services-item${isServicesMenuOpen ? ' is-open' : ''}`}
                key={link.to}
                onMouseEnter={openServicesOnHover}
                onMouseLeave={closeServicesOnHover}
                onBlur={handleServicesBlur}
              >
                <div className="services-trigger-row">
                  <NavLink
                    to="/services"
                    className={({ isActive }) => `nav-primary-link services-trigger-link${isActive ? ' active' : ''}`}
                    onFocus={openServicesOnHover}
                    onClick={closeNavigation}
                  >
                    Services
                  </NavLink>
                  <button
                    type="button"
                    className="services-menu-toggle"
                    ref={servicesToggleRef}
                    aria-label={`${isServicesMenuOpen ? 'Hide' : 'Show'} service categories`}
                    aria-expanded={isServicesMenuOpen}
                    aria-controls="services-mega-menu"
                    onClick={() => setIsServicesMenuOpen((current) => !current)}
                  >
                    <ChevronDownIcon size={15} />
                  </button>
                </div>

                {/* Always in the HTML (hidden while closed) so the service links are
                    crawlable; every category's panel is rendered and only the
                    selected one is shown. */}
                <div className="services-mega-menu" id="services-mega-menu" hidden={!isServicesMenuOpen} ref={megaMenuRef}>
                  <div className="services-mega-menu-inner">
                    <div className="service-category-list">
                      <p className="services-menu-kicker">Browse by category</p>
                      {SERVICE_CATEGORIES.map((category) => (
                        <button
                          type="button"
                          aria-pressed={category.id === selectedCategory.id}
                          aria-controls={`service-category-panel-${category.id}`}
                          className={category.id === selectedCategory.id ? 'active' : undefined}
                          key={category.id}
                          onMouseEnter={() => setActiveServiceCategory(category.id)}
                          onFocus={() => setActiveServiceCategory(category.id)}
                          onClick={() => setActiveServiceCategory(category.id)}
                        >
                          <span>{category.label}</span>
                          <ChevronRightIcon size={15} />
                        </button>
                      ))}
                    </div>

                    {SERVICE_CATEGORIES.map((category) => (
                      <div
                        className="service-category-panel"
                        id={`service-category-panel-${category.id}`}
                        role="region"
                        aria-label={category.label}
                        key={category.id}
                        hidden={category.id !== selectedCategory.id}
                      >
                        {/* Not a heading: the menu is in every page's HTML
                            ahead of the page's own h1. The panel's region
                            label carries the category name. */}
                        <div className="service-category-heading">
                          <span>Related services</span>
                          <p className="service-category-title">{category.label}</p>
                        </div>
                        <ul>
                          {category.services.map((service) => (
                            <li key={service.label}>
                              {service.to ? (
                                <Link to={service.to} onClick={closeNavigation}>
                                  <span>{service.label}</span>
                                  <ArrowRightIcon size={13} />
                                </Link>
                              ) : (
                                <span className="service-link-pending" title="Page link will be added later">
                                  {service.label}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                        {/* A category with its own hub page (commercial) links
                            there, as on the /services directory. */}
                        <Link className="view-all-services-link" to={category.overviewTo || '/services'} onClick={closeNavigation}>
                          {category.overviewTo ? 'Commercial overview' : 'View all services'} <ArrowRightIcon size={13} />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="nav-actions">
          {/* Main Call To Action Button in Red #C20917 — goes to the instant
              quote estimator page. Narrow phones swap in the shorter label so
              the pill still fits beside the logo and menu. */}
          <Link to={INSTANT_QUOTE_PATH} className="btn-pill-red nav-quote-btn" onClick={closeNavigation} data-cta="nav-instant-quote">
            <span className="nav-quote-label-full">GET INSTANT QUOTE</span>
            <span className="nav-quote-label-short">GET QUOTE</span>
            <ArrowRightIcon size={14} />
          </Link>
          <button
            className="mobile-menu-btn"
            id="mobileMenuToggle"
            ref={menuButtonRef}
            aria-label="Toggle Navigation"
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
          >
            <MenuIcon size={24} />
          </button>
        </div>
      </nav>
    </div>
  );
}
