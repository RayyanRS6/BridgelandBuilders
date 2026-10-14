import { useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from './icons.jsx';

const HEADING_TAGS = { 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' };

// The heading only adds document structure. Its margin is reset inline so it
// looks the same everywhere — inside .blog-article-body an h3 would otherwise
// pick up the article's heading margins. (The button sets its own font.)
const HEADING_RESET = { margin: 0 };

// Layout effects run before paint in the browser; on the server (prerender)
// neither kind runs, and useEffect avoids React's server warning.
const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

// True while React hydrates the prerendered HTML (the server snapshot), false
// in a fresh client render (a client-side navigation).
const subscribeNever = () => () => {};
const useHydrating = () => useSyncExternalStore(subscribeNever, () => false, () => true);

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
 * Every answer is always in the HTML, so search engines and the FAQPage
 * structured data see the full text; the accordion only toggles which one is
 * shown.
 *
 * Closed answers carry hidden="until-found" rather than plain `hidden`, so the
 * browser's find-in-page and Google's #:~:text= links can reach text in a
 * closed answer: the browser fires `beforematch` on it, which opens it here.
 * React 18 would turn a hidden="until-found" prop into plain hidden="", so the
 * attribute is set by the effect below, not rendered; scripts/prerender.mjs
 * adds it to the closed answers in the static HTML (identified by their
 * question's aria-expanded="false"). Browsers without until-found support
 * treat it as plain `hidden`. pages.css takes the padding off a closed answer,
 * which Chrome keeps as an empty box.
 *
 * @param {Array}  items          [{ q, a, more? }] — `more` = { label, to } adds a link under the answer
 * @param {number} [headingLevel] 2–6: wraps each question in that heading (default: no heading)
 * @param {number} [defaultOpen]  index open on first render (default 0; -1 = all closed)
 */
export default function FaqAccordion({ items, headingLevel, defaultOpen = 0 }) {
  const [openIndex, setOpenIndex] = useState(defaultOpen);
  const baseId = useId();
  const Heading = HEADING_TAGS[headingLevel];
  const answers = useRef([]);
  const hydrating = useHydrating();
  const firstRun = useRef(true);

  useBrowserLayoutEffect(() => {
    const elements = answers.current.slice(0, items.length);
    if (firstRun.current) {
      firstRun.current = false;
      // A text-fragment link or find-in-page can reveal a closed answer in the
      // static HTML before hydration (the browser removes its `hidden`): keep
      // that answer open instead of hiding it again.
      if (hydrating) {
        const revealed = elements.findIndex((el, index) => el && index !== openIndex && !el.hasAttribute('hidden'));
        if (revealed !== -1) {
          setOpenIndex(revealed);
          return;
        }
      }
    }
    elements.forEach((el, index) => {
      if (!el) return;
      if (index === openIndex) el.removeAttribute('hidden');
      else if (el.getAttribute('hidden') !== 'until-found') el.setAttribute('hidden', 'until-found');
    });
    // `items`, not just its length: answers are keyed by their question, so a
    // new list of the same length (one post to another) renders new elements
    // that need hiding too.
  }, [openIndex, items]);

  // The browser fires `beforematch` on a closed answer just before it reveals
  // it for a find-in-page or #:~:text= match.
  useBrowserLayoutEffect(() => {
    const listeners = answers.current.slice(0, items.length).map((el, index) => {
      if (!el) return null;
      const open = () => setOpenIndex(index);
      el.addEventListener('beforematch', open);
      return () => el.removeEventListener('beforematch', open);
    });
    return () => listeners.forEach((remove) => remove && remove());
  }, [items]);

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
            {/* The "+" is drawn by CSS (.faq-toggle::before), so it is never
                part of the question's heading text. */}
            <span className="faq-toggle" aria-hidden="true" />
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
            <p
              className="faq-answer"
              id={answerId}
              ref={(el) => {
                answers.current[index] = el;
              }}
            >
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
