const STATS = [
  { num: '60', unit: '+', label: 'Years of combined experience' },
  { num: '100', unit: '+', label: 'Projects completed across Winnipeg' },
  // Google Business Profile rating, confirmed by the owner 2026-10-13 (5.0 from
  // 4 reviews). Update if the rating changes.
  { num: '5.0', unit: '', label: 'Rating on Google' },
  { num: '1', unit: 'day', label: 'Reply within one business day' },
];

export default function Stats() {
  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {STATS.map((stat, index) => (
            <div
              className="stat-card reveal"
              key={stat.label}
              style={index > 0 ? { transitionDelay: `${index * 0.1}s` } : undefined}
            >
              <div className="stat-num">{stat.num}{stat.unit && <span className="stat-unit">{stat.unit}</span>}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
