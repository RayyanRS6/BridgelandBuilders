import { Link } from 'react-router-dom';

const GALLERY_ITEMS = [
  {
    span: 'col-8',
    to: '/services/whole-home-renovations',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    alt: 'Whole home renovation in Winnipeg',
    title: 'Whole Home Renovation',
    text: 'Custom open living room and kitchen design',
    delay: null,
  },
  {
    span: 'col-4',
    to: '/services/bathroom-renovations',
    img: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=600&q=80',
    alt: 'Bathroom renovation Winnipeg',
    title: 'Bathroom Renovation',
    text: 'Modern fixtures & clean tiling',
    delay: '0.1s',
  },
  {
    span: 'col-4',
    to: '/services/kitchen-renovations',
    img: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80',
    alt: 'Kitchen renovation Winnipeg',
    title: 'Kitchen Renovation',
    text: 'Built for comfort, cooking, and durability',
    delay: null,
  },
  {
    span: 'col-4',
    to: '/services/basement-renovations',
    img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    alt: 'Basement renovation Winnipeg',
    title: 'Basement Renovation',
    text: 'Finished family area and guest space',
    delay: '0.1s',
  },
  {
    span: 'col-4',
    to: '/services/home-extensions',
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
    alt: 'Home extension in Winnipeg',
    title: 'Home Extension',
    text: 'More room, built to feel like it was always there',
    delay: '0.2s',
  },
  {
    span: 'col-12',
    to: '/services/commercial-renovations',
    img: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=80',
    alt: 'Commercial renovation Winnipeg',
    title: 'Commercial Renovation',
    text: 'Office and retail spaces that work for you',
    delay: '0.2s',
  },
];

export default function Gallery() {
  return (
    <section className="gallery-section" id="inspiration">
      <div className="container">
        <div className="section-header center reveal">
          <span className="section-tag">Our Portfolio</span>
          <h2 className="section-title">Get Inspired: Transform Your Space with Bridgeland Builders</h2>
          <p className="section-desc">Take a look at how we build and renovate spaces across Winnipeg, Manitoba.</p>
        </div>

        <div className="gallery-grid">
          {GALLERY_ITEMS.map((item) => (
            <Link
              className={`gallery-item ${item.span} reveal`}
              key={item.title}
              to={item.to}
              aria-label={`${item.title} — view details and book an appointment`}
              style={item.delay ? { transitionDelay: item.delay } : undefined}
            >
              <img src={item.img} alt={item.alt} width="800" height="600" loading="lazy" decoding="async" />
              <div className="gallery-overlay">
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
