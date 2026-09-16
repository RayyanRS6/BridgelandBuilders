export default function Testimonial() {
  return (
    <section className="testimonial-section">
      <div className="container">
        <div className="testimonial-card reveal">
          <div className="testimonial-left">
            <div className="stars-badge">★★★★★</div>
            <h3 className="testimonial-headline">5-Star Rated!</h3>
            <p className="testimonial-sub">What our clients say about working with Bridgeland Builders in Winnipeg.</p>
          </div>
          <div className="testimonial-right">
            <p className="testimonial-quote">
              “Working with Bridgeland Builders was an incredible experience. Their team demonstrated unmatched expertise and professionalism throughout the entire renovation process. From the initial consultation to the final walkthrough, they kept us informed and ensured every detail reflected our vision. The quality of craftsmanship and materials exceeded our expectations, and their commitment to customer satisfaction truly sets them apart. We couldn’t be happier with our newly transformed space—thank you, Bridgeland Builders!”
            </p>
            <div className="testimonial-author">
              <div className="author-initial">M</div>
              <div className="author-info">
                <h5>Marvin V.</h5>
                <p>Verified Homeowner ★★★★★</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
