import { useId, useState } from 'react';

// Every answer is always in the HTML (closed ones carry `hidden`), so search
// engines and the FAQPage structured data see the full text; the accordion
// only toggles which one is shown.
export default function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);
  const baseId = useId();

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const isOpen = index === openIndex;
        const answerId = `${baseId}-answer-${index}`;
        return (
          <div className={`faq-item${isOpen ? ' is-open' : ''}`} key={item.q}>
            <button
              type="button"
              className="faq-question"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              aria-expanded={isOpen}
              aria-controls={answerId}
            >
              <span>{item.q}</span>
              <span className="faq-toggle">+</span>
            </button>
            <p className="faq-answer" id={answerId} hidden={!isOpen}>{item.a}</p>
          </div>
        );
      })}
    </div>
  );
}
