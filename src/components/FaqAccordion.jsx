import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from './icons.jsx';

const HEADING_TAGS = { 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' };

// The heading only adds document structure. Its margin is reset inline so it
// looks the same everywhere — inside .blog-article-body an h3 would otherwise
// pick up the article's heading margins. (The button sets its own font.)
const HEADING_RESET = { margin: 0 };

/** Optional "read more" link under an answer: { label, to }. */
function MoreLink({ more }) {
  const content = (
    <>
      {more.label} <ArrowRightIcon size={13} />
    </>
  );
  if (/^https?:\/\//.test(more.to)) {
    return (
      <a className="blog-card-link" href={more.to} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return (
    <Link className="blog-card-link" to={more.to}>
      {content}
    </Link>
  );
}

/**
 * Every answer is always in the HTML (closed ones carry `hidden`), so search
 * engines and the FAQPage structured data see the full text; the accordion
 * only toggles which one is shown.
 *
 * @param {Array}  items          [{ q, a, more? }] — `more` = { label, to } adds a link under the answer
 * @param {number} [headingLevel] 2–6: wraps each question in that heading (default: no heading)
 * @param {number} [defaultOpen]  index open on first render (default 0; -1 = all closed)
 */
export default function FaqAccordion({ items, headingLevel, defaultOpen = 0 }) {
  const [openIndex, setOpenIndex] = useState(defaultOpen);
  const baseId = useId();
  const Heading = HEADING_TAGS[headingLevel];

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const isOpen = index === openIndex;
        const answerId = `${baseId}-answer-${index}`;
        const question = (
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
        );
        return (
          <div className={`faq-item${isOpen ? ' is-open' : ''}`} key={item.q}>
            {Heading ? (
              <Heading className="faq-heading" style={HEADING_RESET}>
                {question}
              </Heading>
            ) : (
              question
            )}
            <p className="faq-answer" id={answerId} hidden={!isOpen}>
              {item.a}
              {item.more && item.more.to && (
                <>
                  <br />
                  <MoreLink more={item.more} />
                </>
              )}
            </p>
          </div>
        );
      })}
    </div>
  );
}
