import { EXPERIENCE_YEARS, PROJECT_COUNT, REPLY_TIME, SERVICE_AREA_NAMES } from '../data/facts.js';

const STATS = [
  { num: String(EXPERIENCE_YEARS), unit: '+', label: 'Years of combined experience' },
  { num: String(PROJECT_COUNT), unit: '+', label: 'Projects completed across Winnipeg' },
  // Winnipeg plus the confirmed nearby communities (SERVICE_AREAS in
  // siteConfig.js). This slot held "5.0 Rating on Google", which plan §19 keeps
  // off the site until the Google Business Profile has 10+ reviews. Once it
  // does, put the rating back here with its review count and a link to the
  // profile (REVIEW_STATS / GBP.mapsUrl in siteConfig.js), e.g. "5.0 on Google ·
  // N reviews".
  { num: String(SERVICE_AREA_NAMES.length), unit: '', label: 'Communities we serve' },
  { num: '1', unit: 'day', label: `Reply within ${REPLY_TIME}` },
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
