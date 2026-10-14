import { Link } from 'react-router-dom';

/*
 * Inline markup in content strings as React nodes:
 *   [label](/internal-path)  → router <Link>
 *   [label](https://…)       → external link (new tab)
 *   **bold**                 → <strong>
 * Links may sit inside bold, and bold inside link labels. Kept apart from
 * RichBody.jsx, which re-exports it, so a light page chunk (the service
 * pages) can render inline links without the article renderer and Picture.
 *
 * Its plain-text counterpart, stripInline, is in inlineText.js (no JSX, so
 * build scripts can use it). It is not imported here: that would make the
 * tiny module a chunk of its own, one more file in every page's preload map.
 */

/** A link or a bold run: the two patterns inlineText.js stripInline removes. */
const INLINE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;

/** Inline links get their own class so buttons and other links on the page keep their styles. */
const LINK_CLASS = 'blog-inline-link';

export function renderLink(label, href, key) {
  if (href.startsWith('/')) {
    return <Link key={key} className={LINK_CLASS} to={href}>{label}</Link>;
  }
  if (/^https?:\/\//.test(href)) {
    return <a key={key} className={LINK_CLASS} href={href} rel="noopener" target="_blank">{label}</a>;
  }
  // mailto: / tel: and anything else: a plain link in the same tab.
  return <a key={key} className={LINK_CLASS} href={href}>{label}</a>;
}

/**
 * Text with inline links and bold as React nodes. Plain text (the common
 * case) is returned unchanged as a string.
 */
export function renderInline(text, keyPrefix = 'i') {
  const value = text == null ? '' : String(text);
  if (!value.includes('**') && !value.includes('](')) return value;

  const nodes = [];
  let last = 0;
  let index = 0;
  for (const match of value.matchAll(INLINE)) {
    if (match.index > last) nodes.push(value.slice(last, match.index));
    const key = `${keyPrefix}-${index++}`;
    if (match[1] !== undefined) {
      nodes.push(renderLink(renderInline(match[1], `${key}-l`), match[2], key));
    } else {
      // Bold text can wrap a link: **[label](/path):**
      nodes.push(<strong key={key}>{renderInline(match[3], `${key}-b`)}</strong>);
    }
    last = match.index + match[0].length;
  }
  if (last < value.length) nodes.push(value.slice(last));
  return nodes;
}
