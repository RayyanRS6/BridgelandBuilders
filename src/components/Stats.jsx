const STATS = [
  { num: '60', unit: '+', label: 'Years of combined experience' },
  { num: '100', unit: '+', label: 'Projects completed across Winnipeg' },
  // The booking calendar's free 15-minute call (quoteForm.js BOOKING_CALENDAR).
  // No Google rating here until the owner confirms the profile and it can be
  // shown as "Rated 5.0 on Google · N reviews" with a link (SEO plan §11.1).
  { num: '15', unit: 'min', label: 'Free call to plan your project' },
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
