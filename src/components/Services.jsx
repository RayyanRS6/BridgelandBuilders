import { Link } from 'react-router-dom';
import { ArrowRightIcon } from './icons.jsx';

const SERVICES = [
  {
    tag: 'Residential',
    img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    alt: 'Residential kitchen and bathroom renovation',
    title: 'Residential Services',
    to: '/services#residential',
    action: 'View residential services',
    text: 'Kitchens, bathrooms, basement development, whole-home renovations and home additions. We start with a free on-site visit and a written quote, and coordinate the permits and inspections, so you know the plan and the price before any work begins.',
  },
  {
    tag: 'Commercial',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    alt: 'Commercial space and office renovations',
    title: 'Commercial Services',
    to: '/services#commercial',
    action: 'View commercial services',
    text: 'Offices, retail stores, restaurants, cafés and bars, hotels, and medical, dental and physiotherapy clinics. We plan around your lease dates and opening hours, can work after hours or on weekends, and send you a progress update every week.',
  },
  {
    tag: 'Specialty',
    img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    alt: 'Other renovation and construction services',
    title: 'Other Services',
    to: '/services#additional',
    action: 'View additional services',
    text: 'Flooring, windows and doors, exterior painting, masonry and stucco, and demolition, on their own or as part of a larger renovation of your home or business.',
  },
];

export default function Services() {
  return (
    <section className="services-section" id="services">
      <div className="container">
        <div className="section-header center reveal">
          <span className="section-tag">Our Services</span>
          <h2 className="section-title">Renovation services in Winnipeg</h2>
          <p className="section-desc">For homes and businesses in Winnipeg and nearby communities, from a single bathroom to a full commercial fit-up.</p>
        </div>

        <div className="services-grid">
          {SERVICES.map((service, index) => (
            <div
              className="service-card reveal"
              key={service.title}
              style={index > 0 ? { transitionDelay: `${index * 0.12}s` } : undefined}
            >
              <div className="service-img-wrapper">
                <span className="service-tag-floating">{service.tag}</span>
                <img src={service.img} alt={service.alt} width="800" height="600" loading="lazy" decoding="async" />
              </div>
              <div className="service-body">
                <div>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-text">
                    {service.text}
                  </p>
                </div>
                <Link to={service.to} className="service-action">
                  <span>{service.action}</span>
                  <span className="arrow-circle"><ArrowRightIcon size={13} /></span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
