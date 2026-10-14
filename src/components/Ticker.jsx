import { EXPERIENCE_YEARS, PROJECT_COUNT } from '../data/facts.js';

const TICKER_ITEMS = [
  'BRIDGING DREAMS INTO REALITY',
  'WINNIPEG MANITOBA',
  `OVER ${EXPERIENCE_YEARS} YEARS OF COMBINED EXPERIENCE`,
  `MORE THAN ${PROJECT_COUNT} PROJECTS`,
  'QUALITY WORK, NO SHORTCUTS',
];

export default function Ticker() {
  return (
    <section className="ticker-section">
      <div className="ticker-track">
        {/* Duplicated for infinite smooth loop */}
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
          <div className="ticker-item" key={`${item}-${index}`}>
            <span>{item}</span> <span className="ticker-star">✦</span>
          </div>
        ))}
      </div>
    </section>
  );
}
