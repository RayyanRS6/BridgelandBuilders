/*
 * The inline markup content strings may carry, as plain JavaScript (no JSX),
 * so build scripts in plain Node can use it too:
 *   [label](/internal-path)  a link (inline.jsx renders a router <Link>)
 *   [label](https://…)       an external link
 *   **bold**                 bold
 * Links may sit inside bold, and bold inside link labels. inline.jsx matches
 * the same two patterns in one regex (see the note there); change both together.
 */

const INLINE_LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const INLINE_BOLD = /\*\*([^*]+)\*\*/g;

/**
 * Plain text of inline markup: [label](path) → label, **bold** → bold. For
 * every place the text leaves the page: JSON-LD, meta tags, llms files.
 */
export function stripInline(text) {
  return String(text || '')
    .replace(INLINE_LINK, '$1')
    .replace(INLINE_BOLD, '$1');
}
