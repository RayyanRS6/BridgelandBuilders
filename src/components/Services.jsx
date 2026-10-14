import { Link } from 'react-router-dom';
import { renderInline } from '../lib/inline.jsx';
import { stockImage } from '../lib/unsplash.js';
import Picture from './Picture.jsx';
import { ArrowRightIcon } from './icons.jsx';

// Drawn width of a card photo: a third of the container on desktop (about
// 400px), the full container from 768px down.
const CARD_IMAGE = { sizes: '(max-width: 768px) calc(100vw - 48px), 400px', maxWidth: 1200 };

// Stock photos: the alts describe what is in the picture, not our work.
// Card text: each service it names links to its page ([label](/path), drawn
// by renderInline). Link only pages whose status is 'live' in
// src/data/services.js, on the words the card already uses.
const SERVICES = [
  {
    tag: 'Residential',
    img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    alt: 'Person cooking at a gas cooktop in a white kitchen with a stone island',
    title: 'Residential Services',
    to: '/services#residential',
    action: 'View residential services',
    text: '[Kitchens](/services/kitchen-renovations), [bathrooms](/services/bathroom-renovations), [basement development](/services/basement-renovations), [whole-home renovations](/services/whole-home-renovations) and [home additions](/services/home-additions). We start with a free on-site visit and a written quote, and coordinate the permits and inspections, so you know the plan and the price before any work begins.',
  },
  {
    tag: 'Commercial',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    alt: 'Open office with glass-walled rooms, a kitchenette and teal bench seating',
    title: 'Commercial Services',
    to: '/services#commercial',
    action: 'View commercial services',
    text: '[Offices](/services/office-renovations), [retail stores](/services/retail-renovations), [restaurants, cafés and bars](/services/restaurant-renovations), [hotels](/services/restaurant-renovations#hotels), and [medical, dental and physiotherapy clinics](/services/medical-dental-office-renovations). We plan around your lease dates and opening hours, can work after hours or on weekends, and send you a progress update every week.',
  },
  {
    tag: 'Specialty',
    img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    alt: 'Room with light grey walls, a black loveseat, a white dresser and a floor lamp',
    title: 'Other Services',
    to: '/services#additional',
    action: 'View additional services',
    text: '[Flooring](/services/flooring), [windows and doors](/services/windows-and-doors), [exterior painting](/services/exterior-painting), [masonry and stucco](/services/masonry-stucco), and [demolition](/services/demolition), on their own or as part of a larger renovation of your home or business.',
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
                <Picture {...stockImage(service.img, CARD_IMAGE)} alt={service.alt} width="800" height="600" loading="lazy" decoding="async" />
              </div>
              <div className="service-body">
                <div>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-text">
                    {renderInline(service.text, service.tag)}
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
