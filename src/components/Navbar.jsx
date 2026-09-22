import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useQuoteModal } from '../context/QuoteModalContext.jsx';
import { SERVICE_CATEGORIES } from '../data/serviceCategories.js';
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
  const { openModal } = useQuoteModal();
  // 5. Mobile Menu Toggle — the open panel itself is styled by `.nav-links.is-open`
  // inside the <=1100px breakpoint, so it can size itself against the real
  // navbar height and the phone's visible viewport.
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [activeServiceCategory, setActiveServiceCategory] = useState('residential');

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
          <img
            className="logo-mark"
            src="/logo-mark.png"
            alt=""
            width="96"
            height="96"
            decoding="async"
          />
          <span>Bridgeland Builders</span>
        </Link>

        <ul className={`nav-links${isMenuOpen ? ' is-open' : ''}`}>
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
                    aria-label={`${isServicesMenuOpen ? 'Hide' : 'Show'} service categories`}
                    aria-expanded={isServicesMenuOpen}
                    aria-controls="services-mega-menu"
                    onClick={() => setIsServicesMenuOpen((current) => !current)}
                  >
                    <ChevronDownIcon size={15} />
                  </button>
                </div>

                {isServicesMenuOpen && (
                  <div className="services-mega-menu" id="services-mega-menu">
                    <div className="services-mega-menu-inner">
                      <div className="service-category-list">
                        <p className="services-menu-kicker">Browse by category</p>
                        {SERVICE_CATEGORIES.map((category) => (
                          <button
                            type="button"
                            aria-pressed={category.id === selectedCategory.id}
                            aria-controls="service-category-panel"
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

                      <div
                        className="service-category-panel"
                        id="service-category-panel"
                        role="region"
                        aria-label={selectedCategory.label}
                      >
                        <div className="service-category-heading">
                          <span>Related services</span>
                          <h3>{selectedCategory.label}</h3>
                        </div>
                        <ul>
                          {selectedCategory.services.map((service) => (
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
                        <Link className="view-all-services-link" to="/services" onClick={closeNavigation}>
                          View all services <ArrowRightIcon size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="nav-actions">
          {/* Main Call To Action Button in Red #C20917. Narrow phones swap in the
              shorter label so the pill still fits beside the logo and menu. */}
          <button className="btn-pill-red nav-quote-btn open-quote-btn" onClick={openModal}>
            <span className="nav-quote-label-full">GET INSTANT QUOTE</span>
            <span className="nav-quote-label-short">GET QUOTE</span>
            <ArrowRightIcon size={14} />
          </button>
          <button
            className="mobile-menu-btn"
            id="mobileMenuToggle"
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
