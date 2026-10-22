import Picture from './Picture.jsx';
import { renderInline } from '../lib/inline.jsx';

// Inline links and bold (src/lib/inline.jsx), re-exported for existing imports.
export { renderInline };

/**
 * Renders article content from data blocks (blog posts, cost guides, other
 * long-form pages). Place it directly inside `.blog-article-body`, which
 * styles everything it outputs.
 *
 * Blocks ({ t, ... }):
 *   p, h2, h3, h4        { x }             text
 *   li                   { x }             consecutive items → one <ul class="blog-list">
 *   oli                  { x }             consecutive items → one <ol class="blog-olist">
 *   quote (or legacy q)  { x }             <blockquote>
 *   img                  { src, alt, srcSet?, avifSrcSet?, width?, height? }
 *   table                { caption, head: [], rows: [[]], note? }  scrolls inside its wrapper
 *   callout              { title?, x }     highlighted aside
 *   takeaways            { title, items: [] }  the "Key Takeaways" box
 *   calculator           { id }            an interactive calculator, rendered by
 *                                          the page's `widgets` (below)
 * A block with `hidden: true` is skipped. Unknown types with text render as <p>.
 *
 * `widgets` ({ type: Component }, optional) renders block types a page brings
 * itself, e.g. BlogPostPage's { calculator: Calculator }, with the block's
 * fields as props. Their code then loads only with the pages that pass them,
 * never with every page that uses RichBody (cost guides have tight JS budgets).
 *
 * Inline markup in text: [label](/internal-path) → router <Link>,
 * [label](https://…) → external link (new tab), **bold** → <strong>
 * (links may sit inside bold, and bold inside link labels).
 *
 * Runs of flowing blocks are wrapped in a <div>, with the takeaways box
 * between them — the same structure the post page has always had, so the
 * `.blog-article-body > div > *:first-child` spacing rule applies unchanged.
 */

/** Widths rendered by .blog-article-container (max 880px, full width below). */
const ARTICLE_IMAGE_SIZES = '(max-width: 920px) 100vw, 880px';

function Figure({ block }) {
  return (
    <figure className="blog-figure">
      <Picture
        avifSrcSet={block.avifSrcSet}
        srcSet={block.srcSet}
        sizes={ARTICLE_IMAGE_SIZES}
        src={block.src}
        alt={block.alt || ''}
        width={block.width || 880}
        height={block.height || 495}
        loading="lazy"
        decoding="async"
      />
    </figure>
  );
}

function Table({ block, id }) {
  const head = block.head || [];
  const rows = block.rows || [];
  return (
    <>
      {/* Wide tables scroll inside this wrapper; the page never scrolls sideways. */}
      <div
        className="blog-table-wrap"
        role="region"
        aria-label={block.caption || 'Table'}
        tabIndex={0}
      >
        <table className="blog-table">
          {block.caption && <caption>{renderInline(block.caption, `${id}-cap`)}</caption>}
          {head.length > 0 && (
            <thead>
              <tr>
                {head.map((cell, index) => (
                  <th scope="col" key={`${id}-h${index}`}>{renderInline(cell, `${id}-h${index}`)}</th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`${id}-r${rowIndex}`}>
                {row.map((cell, cellIndex) =>
                  cellIndex === 0 && head.length > 0 ? (
                    <th scope="row" key={`${id}-r${rowIndex}c${cellIndex}`}>
                      {renderInline(cell, `${id}-r${rowIndex}c${cellIndex}`)}
                    </th>
                  ) : (
                    <td key={`${id}-r${rowIndex}c${cellIndex}`}>
                      {renderInline(cell, `${id}-r${rowIndex}c${cellIndex}`)}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {block.note && <p className="blog-table-note">{renderInline(block.note, `${id}-note`)}</p>}
    </>
  );
}

/** One block that is not a list item. */
function renderBlock(block, key, widgets) {
  const Widget = widgets ? widgets[block.t] : null;
  if (Widget) return <Widget key={key} {...block} />;

  switch (block.t) {
    case 'h2':
      return <h2 key={key}>{renderInline(block.x, key)}</h2>;
    case 'h3':
      return <h3 key={key}>{renderInline(block.x, key)}</h3>;
    case 'h4':
      return <h4 key={key}>{renderInline(block.x, key)}</h4>;
    case 'quote':
    case 'q':
      return <blockquote key={key}>{renderInline(block.x, key)}</blockquote>;
    case 'img':
      return <Figure key={key} block={block} />;
    case 'table':
      return <Table key={key} id={key} block={block} />;
    case 'callout':
      return (
        <aside className="blog-callout" key={key}>
          {block.title && <p className="blog-callout-title">{renderInline(block.title, `${key}-t`)}</p>}
          {block.x && <p>{renderInline(block.x, key)}</p>}
        </aside>
      );
    default:
      return block.x ? <p key={key}>{renderInline(block.x, key)}</p> : null;
  }
}

/** Flowing blocks, with consecutive list items merged into one list. */
function renderFlow(blocks, keyPrefix, widgets) {
  const nodes = [];
  let list = null; // { type: 'li' | 'oli', items: [] }

  const flushList = () => {
    if (!list) return;
    const key = `${keyPrefix}-list-${nodes.length}`;
    const items = list.items.map((item, index) => (
      <li key={`${key}-${index}`}>{renderInline(item.x, `${key}-${index}`)}</li>
    ));
    nodes.push(
      list.type === 'oli' ? (
        <ol className="blog-olist" key={key}>{items}</ol>
      ) : (
        <ul className="blog-list" key={key}>{items}</ul>
      )
    );
    list = null;
  };

  blocks.forEach((block, index) => {
    if (block.t === 'li' || block.t === 'oli') {
      if (list && list.type !== block.t) flushList();
      if (!list) list = { type: block.t, items: [] };
      list.items.push(block);
      return;
    }
    flushList();
    const node = renderBlock(block, `${keyPrefix}-${index}`, widgets);
    if (node) nodes.push(node);
  });

  flushList();
  return nodes;
}

function Takeaways({ block, id }) {
  return (
    <aside className="blog-takeaways">
      {block.title && <h2>{renderInline(block.title, `${id}-t`)}</h2>}
      <ul>
        {(block.items || []).map((item, index) => (
          <li key={`${id}-${index}`}>{renderInline(item, `${id}-${index}`)}</li>
        ))}
      </ul>
    </aside>
  );
}

export default function RichBody({ blocks, widgets }) {
  const visible = (blocks || []).filter((block) => block && !block.hidden);
  const groups = [];
  let flow = [];
  // Paragraphs that follow a takeaways box sit in their own group, and the
  // next heading starts a new one, as the original post layout did. The
  // heading is then its group's first child, so .blog-article-body > div >
  // *:first-child keeps its top margin at 0, exactly as before.
  let afterTakeaways = false;
  visible.forEach((block) => {
    if (block.t === 'takeaways') {
      if (flow.length) groups.push({ type: 'flow', blocks: flow });
      flow = [];
      groups.push({ type: 'takeaways', block });
      afterTakeaways = true;
      return;
    }
    const isHeading = /^h[2-4]$/.test(block.t);
    if (afterTakeaways && isHeading && flow.length) {
      groups.push({ type: 'flow', blocks: flow });
      flow = [];
    }
    if (isHeading) afterTakeaways = false;
    flow.push(block);
  });
  if (flow.length) groups.push({ type: 'flow', blocks: flow });

  return (
    <>
      {groups.map((group, index) =>
        group.type === 'takeaways' ? (
          <Takeaways key={`g${index}`} id={`g${index}`} block={group.block} />
        ) : (
          <div key={`g${index}`}>{renderFlow(group.blocks, `g${index}`, widgets)}</div>
        )
      )}
    </>
  );
}
