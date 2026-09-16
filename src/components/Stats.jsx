const STATS = [
  { num: '60', unit: '+', label: 'Years of combined experience' },
  { num: '100', unit: '+', label: 'Projects completed across Winnipeg' },
  { num: '5', unit: '★', label: '5-Star Rated client experience' },
  { num: '100', unit: '%', label: 'Satisfaction & clear communication' },
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
              <div className="stat-num">{stat.num}<span className="stat-unit">{stat.unit}</span></div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
