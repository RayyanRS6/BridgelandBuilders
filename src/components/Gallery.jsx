import { Link } from 'react-router-dom';
import { stockImage } from '../lib/unsplash.js';
import Picture from './Picture.jsx';

// Drawn widths per tile size, for srcset/sizes. Tiles are 300px tall with
// object-fit: cover, so a one-third tile still shows about 450px of a 3:2
// photo; at 768px and below every tile spans the full container.
const TILE_IMAGES = {
  'col-4': { sizes: '(max-width: 768px) calc(100vw - 48px), 460px', maxWidth: 1200 },
  'col-8': { sizes: '(max-width: 768px) calc(100vw - 48px), (max-width: 1300px) 66vw, 830px', maxWidth: 1200 },
  'col-12': { sizes: '(max-width: 1300px) calc(100vw - 48px), 1252px', maxWidth: 1600 },
};

const GALLERY_ITEMS = [
  {
    span: 'col-8',
    to: '/services/whole-home-renovations',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    alt: 'Modern two-storey house at dusk with lit windows',
    title: 'Whole Home Renovation',
    text: 'Custom open living room and kitchen design',
    delay: null,
  },
  {
    span: 'col-4',
    to: '/services/bathroom-renovations',
    img: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=600&q=80',
    alt: 'White bathroom with a checkered floor, pedestal sink and plants',
    title: 'Bathroom Renovation',
    text: 'Modern fixtures & clean tiling',
    delay: '0.1s',
  },
  {
    span: 'col-4',
    to: '/services/kitchen-renovations',
    img: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80',
    alt: 'White kitchen with an island, bar stools and pendant lights',
    title: 'Kitchen Renovation',
    text: 'Built for comfort, cooking, and durability',
    delay: null,
  },
  {
    span: 'col-4',
    to: '/services/basement-renovations',
    img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    alt: 'White room with a small sofa, dresser, floor lamp and plant',
    title: 'Basement Renovation',
    text: 'Finished family area and guest space',
    delay: '0.1s',
  },
  {
    span: 'col-4',
    to: '/services/home-additions',
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
    alt: 'Open-plan living room with a wood feature wall and glass doors',
    title: 'Home Addition',
    text: 'More room, built to feel like it was always there',
    delay: '0.2s',
  },
  {
    span: 'col-12',
    to: '/services/commercial-renovations',
    img: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=80',
    alt: 'Open office with a long meeting table and glass walls',
    title: 'Commercial Renovation',
    text: 'Office and retail spaces that work for you',
    delay: '0.2s',
  },
];

export default function Gallery() {
  return (
    <section className="gallery-section" id="inspiration">
      <div className="container">
        {/* Stock photos, labelled as design ideas (never as our jobs): the
            alts and captions describe what is in the picture. */}
        <div className="section-header center reveal">
          <span className="section-tag">Design Ideas</span>
          <h2 className="section-title">Get Inspired: Transform Your Space with Bridgeland Builders</h2>
          <p className="section-desc">Design ideas for the spaces we build. Pick one to see what the work involves and how we run it.</p>
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
              <Picture {...stockImage(item.img, TILE_IMAGES[item.span])} alt={item.alt} width="800" height="600" loading="lazy" decoding="async" />
              <div className="gallery-overlay">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
