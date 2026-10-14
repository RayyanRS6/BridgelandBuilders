import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SERVICE_CATEGORIES } from '../data/serviceCategories.js';
import { ESTIMATOR_URLS } from '../data/estimators.js';
import { ArrowRightIcon } from './icons.jsx';
import EstimatorSection from './EstimatorSection.jsx';

const DEFAULT_CATEGORY_ID = SERVICE_CATEGORIES[0].id;

// Services with no page of their own yet send people to the booking page.
const ASK_ABOUT_SERVICE_PATH = '/book-online';

const ESTIMATOR_BY_CATEGORY = {
  residential: {
    src: ESTIMATOR_URLS.residential,
    title: 'Plan Your Residential Renovation Budget',
    description: 'Select your residential project and answer a few questions to receive a useful starting price range.',
  },
  commercial: {
    src: ESTIMATOR_URLS.commercial,
    title: 'Plan Your Commercial Renovation Budget',
    description: 'Tell us about your commercial space and scope to receive a practical starting price range.',
  },
  additional: {
    src: ESTIMATOR_URLS.overall,
    title: 'Plan Your Additional Service Budget',
    description: 'Choose the work you need and answer a few questions to receive a useful starting price range.',
  },
};

const OVERALL_ESTIMATOR = {
  src: ESTIMATOR_URLS.overall,
  title: 'Get Your Renovation Price Guide',
  description: 'Not sure which category fits? Start with the overall estimator and tell us what you are planning.',
};

const isCategoryId = (id) => SERVICE_CATEGORIES.some((category) => category.id === id);

/**
 * Every category's panel is in the prerendered HTML (the inactive ones carry
 * `hidden`), so all services are crawlable from /services. The switcher items
 * are plain anchors (#residential, #commercial, #additional) that work before
 * the bundle loads. Which panel is open — and which estimator is shown — is
 * only read from the URL after hydration, so the server and the first client
 * render always match.
 */
export default function ServiceDirectory() {
  const location = useLocation();
  const navigate = useNavigate();
  // The category the visitor asked for (URL hash, ?category= or a tab click).
  // null until then: the residential panel shows and the overall estimator runs.
  const [chosenCategoryId, setChosenCategoryId] = useState(null);
  const activeCategoryId = chosenCategoryId ?? DEFAULT_CATEGORY_ID;

  // Runs after hydration and on every URL change (tab clicks, Back/Forward,
  // links from other pages). Old links (?category=commercial#service-directory)
  // keep working; a URL that names no category goes back to the default view.
  useEffect(() => {
    const fromHash = location.hash.replace(/^#/, '');
    const fromQuery = new URLSearchParams(location.search).get('category');
    if (isCategoryId(fromHash)) setChosenCategoryId(fromHash);
    else if (isCategoryId(fromQuery)) setChosenCategoryId(fromQuery);
    else if (!location.hash && !fromQuery) setChosenCategoryId(null);
  }, [location.hash, location.search]);

  const selectCategory = (event, categoryId) => {
    // Let modified clicks (new tab/window) behave like normal links.
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    setChosenCategoryId(categoryId);
    const hash = `#${categoryId}`;
    // Re-clicking the open tab replaces the entry instead of stacking
    // duplicate history entries (what <Link> did for the current URL).
    navigate({ hash }, { replace: location.hash === hash });
  };

  const estimatorContent = (chosenCategoryId && ESTIMATOR_BY_CATEGORY[chosenCategoryId]) || OVERALL_ESTIMATOR;

  return (
    <>
      <section className="service-directory-section" id="service-directory">
        <div className="container">
          <div className="section-header center reveal">
            <span className="section-tag">Choose a category</span>
            <h2 className="section-title">What can we help you build?</h2>
            <p className="section-desc">Select a category to see every related Bridgeland Builders service.</p>
          </div>

          {/* data-scroll-anchor: a #residential/#commercial/#additional jump
              (tab click or link from another page) scrolls the whole tab bar
              into view, so on phones the stacked tabs above the chosen one do
              not end up under the sticky navbar (ScrollToHash.jsx). */}
          <nav className="service-category-switcher" aria-label="Service categories" data-scroll-anchor="">
            {SERVICE_CATEGORIES.map((category) => {
              const isActive = category.id === activeCategoryId;
              return (
                <a
                  key={category.id}
                  id={category.id}
                  href={`#${category.id}`}
                  className={isActive ? 'active' : undefined}
                  aria-current={isActive ? 'true' : undefined}
                  aria-controls={`panel-${category.id}`}
                  onClick={(event) => selectCategory(event, category.id)}
                >
                  <span>{category.label}</span>
                  <small>{category.services.length} services</small>
                </a>
              );
            })}
          </nav>

          {SERVICE_CATEGORIES.map((category) => (
            <div
              className="service-directory-panel"
              id={`panel-${category.id}`}
              key={category.id}
              hidden={category.id !== activeCategoryId}
            >
              <div className="service-directory-heading">
                <div>
                  <span className="section-tag">{category.services.length} services</span>
                  <h2>{category.label}</h2>
                  <p>{category.description}</p>
                </div>
                {category.overviewTo && (
                  <Link className="btn-pill-ghost" to={category.overviewTo}>
                    Commercial overview <ArrowRightIcon size={14} />
                  </Link>
                )}
              </div>

              <div className="service-directory-grid">
                {category.services.map((service, index) => (
                  <article className="service-directory-card" key={service.label}>
                    <span className="service-directory-number">{String(index + 1).padStart(2, '0')}</span>
                    <h3>{service.label}</h3>
                    {/* The longer card text (serviceCategories.js); the navbar keeps the short one. */}
                    <p>{service.cardDescription || service.description}</p>
                    {service.to ? (
                      // The hidden name makes the link "Explore service: Flooring"
                      // for screen readers and search, with no visual change.
                      <Link className="service-directory-action" to={service.to}>
                        Explore service<span className="visually-hidden">: {service.label}</span> <ArrowRightIcon size={13} />
                      </Link>
                    ) : (
                      <Link className="service-directory-action" to={ASK_ABOUT_SERVICE_PATH}>
                        Ask about this service<span className="visually-hidden">: {service.label}</span> <ArrowRightIcon size={13} />
                      </Link>
                    )}
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <EstimatorSection
        key={estimatorContent.src}
        src={estimatorContent.src}
        title={estimatorContent.title}
        description={estimatorContent.description}
      />
    </>
  );
}
