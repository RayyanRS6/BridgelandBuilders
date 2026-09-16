import { useState } from 'react';

export default function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const isOpen = index === openIndex;
        return (
          <div className={`faq-item${isOpen ? ' is-open' : ''}`} key={item.q}>
            <button
              type="button"
              className="faq-question"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              aria-expanded={isOpen}
            >
              <span>{item.q}</span>
              <span className="faq-toggle">+</span>
            </button>
            {isOpen && <p className="faq-answer">{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
