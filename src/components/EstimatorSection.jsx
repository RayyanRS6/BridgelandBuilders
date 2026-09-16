import EstimatorEmbed from './EstimatorEmbed.jsx';

export default function EstimatorSection({ src, eyebrow = 'Free Price Guide', title, description }) {
  return (
    <section className="estimator-section" id="price-guide">
      <div className="container">
        <div className="section-header center">
          <span className="section-tag">{eyebrow}</span>
          <h2 className="section-title">{title}</h2>
          <p className="section-desc">{description}</p>
        </div>
        <div className="estimator-shell">
          <EstimatorEmbed src={src} title={`${title} - EstimatorX360`} />
        </div>
      </div>
    </section>
  );
}
