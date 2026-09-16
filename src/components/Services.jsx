import { Link } from 'react-router-dom';
import { ArrowRightIcon } from './icons.jsx';

const SERVICES = [
  {
    tag: 'Residential',
    img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    alt: 'Residential kitchen and bathroom renovation',
    title: 'Residential Services',
    to: '/services?category=residential#service-directory',
    action: 'View residential services',
    text: 'Need a new kitchen? Bathroom? Or maybe it’s time to finally redo the whole house? We’ve done it all. What matters most to us is making your place feel like home. We’re a Winnipeg Manitoba crew that people trust because we do the job right.',
  },
  {
    tag: 'Commercial',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    alt: 'Commercial space and office renovations',
    title: 'Commercial Services',
    to: '/services?category=commercial#service-directory',
    action: 'View commercial services',
    text: 'Your workspace should work for you. We build offices, shops, and restaurants that look good, function well, and leave the right impression. Among construction companies in Winnipeg, Local businesses come to Bridgeland Builders because they know we’ll deliver without the runaround.',
  },
  {
    tag: 'Specialty',
    img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    alt: 'Other renovation and construction services',
    title: 'Other Services',
    to: '/services?category=additional#service-directory',
    action: 'View additional services',
    text: 'Doesn’t matter if it’s fixing something small or redoing the whole place — we put the same care into it either way.',
  },
];

export default function Services() {
  return (
    <section className="services-section" id="services">
      <div className="container">
        <div className="section-header center reveal">
          <span className="section-tag">Our Expertise</span>
          <h2 className="section-title">Our Services</h2>
          <p className="section-desc">We don’t overcomplicate things. We just focus on what matters to you and get it done right.</p>
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
