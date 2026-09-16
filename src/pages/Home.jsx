import useScrollReveal from '../hooks/useScrollReveal.js';
import Hero from '../components/Hero.jsx';
import Ticker from '../components/Ticker.jsx';
import Stats from '../components/Stats.jsx';
import Services from '../components/Services.jsx';
import WhyUs from '../components/WhyUs.jsx';
import Process from '../components/Process.jsx';
import Testimonial from '../components/Testimonial.jsx';
import Gallery from '../components/Gallery.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import { usePageSeo } from '../hooks/useSeo.js';

export default function Home() {
  usePageSeo('/');
  useScrollReveal();

  return (
    <>
      {/* 3. HERO SECTION */}
      <Hero />

      {/* 4. TICKER BANNER */}
      <Ticker />

      {/* 5. STATS OVERVIEW */}
      <Stats />

      {/* 6. OUR SERVICES */}
      <Services />

      {/* 7. WHY BRIDGELAND BUILDERS */}
      <WhyUs />

      {/* 8. OUR PROCESS */}
      <Process />

      {/* 9. 5-STAR TESTIMONIAL SPOTLIGHT */}
      <Testimonial />

      {/* 10. INSPIRATION GALLERY */}
      <Gallery />

      {/* 11. QUICK CTA BANNER */}
      <CtaBanner />
    </>
  );
}
