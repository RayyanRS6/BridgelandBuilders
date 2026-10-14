// Sandra K.'s words, exactly as on /services/whole-home-renovations (real
// client testimonial, confirmed by the owner 2026-10-13). One quote per name:
// the kitchen page carries Marvin V.'s. No star glyphs: a rating needs a
// source (plan §19).
export default function Testimonial() {
  return (
    <section className="testimonial-section">
      <div className="container">
        <div className="testimonial-card reveal">
          <div className="testimonial-left">
            <h2 className="testimonial-headline">What Our Clients Say</h2>
            <p className="testimonial-sub">In their own words: what it’s like working with Bridgeland Builders.</p>
          </div>
          <div className="testimonial-right">
            <p className="testimonial-quote">
              “We had our whole main floor redone and honestly expected it to be a nightmare. It wasn’t. The crew showed up when they said they would, the site was swept every single night, and when we changed our minds about the flooring halfway through they just sorted it out. The house finally feels like ours.”
            </p>
            <div className="testimonial-author">
              <div className="author-initial">S</div>
              <div className="author-info">
                <h5>Sandra K.</h5>
                <p>Homeowner, Whole Home Renovation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
