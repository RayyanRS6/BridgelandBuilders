import { Link, useSearchParams } from 'react-router-dom';
import { SERVICE_CATEGORIES } from '../data/serviceCategories.js';
import { ESTIMATOR_URLS } from '../data/estimators.js';
import { CONSULTATION_PATH } from '../data/siteConfig.js';
import { ArrowRightIcon } from './icons.jsx';
import EstimatorSection from './EstimatorSection.jsx';

export default function ServiceDirectory() {
  const [searchParams] = useSearchParams();
  const activeCategory = SERVICE_CATEGORIES.find(
    (category) => category.id === searchParams.get('category')
  ) ?? null;

  const estimatorContent = activeCategory?.id === 'residential'
    ? {
        src: ESTIMATOR_URLS.residential,
        title: 'Plan Your Residential Renovation Budget',
        description: 'Select your residential project and answer a few questions to receive a useful starting price range.',
      }
    : activeCategory?.id === 'commercial'
      ? {
          src: ESTIMATOR_URLS.commercial,
          title: 'Plan Your Commercial Renovation Budget',
          description: 'Tell us about your commercial space and scope to receive a practical starting price range.',
        }
      : activeCategory?.id === 'additional'
        ? {
            src: ESTIMATOR_URLS.overall,
            title: 'Plan Your Additional Service Budget',
            description: 'Choose the work you need and answer a few questions to receive a useful starting price range.',
          }
        : {
            src: ESTIMATOR_URLS.overall,
            title: 'Get Your Renovation Price Guide',
            description: 'Not sure which category fits? Start with the overall estimator and tell us what you are planning.',
          };

  return (
    <>
      <section className="service-directory-section" id="service-directory">
        <div className="container">
          <div className="section-header center reveal">
            <span className="section-tag">Choose a category</span>
            <h2 className="section-title">What can we help you build?</h2>
            <p className="section-desc">Select a category to see every related Bridgeland Builders service.</p>
          </div>

          <nav className="service-category-switcher" aria-label="Service categories">
            {SERVICE_CATEGORIES.map((category) => (
              <Link
                key={category.id}
                to={`/services?category=${category.id}#service-directory`}
                className={category.id === activeCategory?.id ? 'active' : undefined}
                aria-current={category.id === activeCategory?.id ? 'page' : undefined}
              >
                <span>{category.label}</span>
                <small>{category.services.length} services</small>
              </Link>
            ))}
          </nav>

          {activeCategory ? (
            <div className="service-directory-panel" key={activeCategory.id}>
              <div className="service-directory-heading">
                <div>
                  <span className="section-tag">{activeCategory.services.length} services</span>
                  <h2>{activeCategory.label}</h2>
                  <p>{activeCategory.description}</p>
                </div>
                {activeCategory.overviewTo && (
                  <Link className="btn-pill-ghost" to={activeCategory.overviewTo}>
                    Commercial overview <ArrowRightIcon size={14} />
                  </Link>
                )}
              </div>

              <div className="service-directory-grid">
                {activeCategory.services.map((service, index) => (
                  <article className="service-directory-card" key={service.label}>
                    <span className="service-directory-number">{String(index + 1).padStart(2, '0')}</span>
                    <h3>{service.label}</h3>
                    <p>{service.description}</p>
                    {service.to ? (
                      <Link className="service-directory-action" to={service.to}>
                        Explore service <ArrowRightIcon size={13} />
                      </Link>
                    ) : (
                      <Link className="service-directory-action" to={CONSULTATION_PATH}>
                        Ask about this service <ArrowRightIcon size={13} />
                      </Link>
                    )}
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <div className="service-directory-overview">
              <span className="section-tag">All project types</span>
              <h2>Choose a category above, or start with the overall price guide.</h2>
              <p>Residential, commercial, and additional projects each have their own service list. If you are unsure where your project fits, the estimator below is the best place to begin.</p>
            </div>
          )}
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
