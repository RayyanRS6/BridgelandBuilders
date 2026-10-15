/**
 * Responsive sources for the Unsplash stock photos (SEO plan §4 images).
 *
 * images.unsplash.com resizes on the fly from the `w` parameter, so every
 * candidate is the same photo with the same crop parameters; only `w`
 * changes, and `auto=format` stays so each browser still gets AVIF or WebP.
 *
 *   <img {...unsplashImage(url, { sizes: '(max-width: 768px) calc(100vw - 48px), 400px' })} alt="…" />
 *
 * `sizes` is the width the photo is drawn at, which is not always the width of
 * its box: the photos fill fixed-height boxes with object-fit: cover, so a
 * narrow box can still show a 3:2 photo wider than itself.
 *
 * Photos listed in scripts/build-images.mjs STOCK are served from this site
 * instead (stockImage() below): same photo and aspect, AVIF + WebP, hashed
 * names with a year-long cache, and no connection to images.unsplash.com.
 */
import { STOCK_BY_PHOTO, STOCK_IMAGES } from '../data/stockImages.generated.js';

export const UNSPLASH_WIDTHS = [480, 800, 1200, 1600];

const UNSPLASH = /^https:\/\/images\.unsplash\.com\//;
const WIDTH_PARAM = /([?&])w=\d+/;

/** The same Unsplash URL at another width (any other URL comes back unchanged). */
export function unsplashAt(url, width) {
  if (!UNSPLASH.test(url || '')) return url;
  const sized = WIDTH_PARAM.test(url)
    ? url.replace(WIDTH_PARAM, `$1w=${width}`)
    : `${url}${url.includes('?') ? '&' : '?'}w=${width}`;
  return /[?&]auto=/.test(sized) ? sized : `${sized}&auto=format`;
}

/** srcset of an Unsplash URL at the standard widths up to `maxWidth`. */
export function unsplashSrcSet(url, maxWidth = 1600) {
  if (!UNSPLASH.test(url || '')) return undefined;
  return UNSPLASH_WIDTHS.filter((width) => width <= maxWidth)
    .map((width) => `${unsplashAt(url, width)} ${width}w`)
    .join(', ');
}

/**
 * src/srcSet/sizes props for the <img> of an Unsplash photo. `src` stays the
 * URL given (the fallback for browsers without srcset); a URL that is not an
 * Unsplash photo gets `src` only.
 */
export function unsplashImage(url, { sizes, maxWidth = 1600 } = {}) {
  const srcSet = unsplashSrcSet(url, maxWidth);
  return srcSet ? { src: url, srcSet, sizes } : { src: url };
}

const PHOTO_ID = /\/(photo-[0-9a-f]+-[0-9a-f]+)/;

/**
 * Props for <Picture> (src/components/Picture.jsx): the self-hosted copy of a
 * stock photo when scripts/build-images.mjs has one for its Unsplash photo id,
 * otherwise the Unsplash props above (Picture then renders a plain <img>).
 *
 *   <Picture {...stockImage(url, { sizes })} alt="…" width="800" height="600" loading="lazy" />
 */
export function stockImage(url, options = {}) {
  const key = STOCK_BY_PHOTO[(PHOTO_ID.exec(url || '') || [])[1]];
  const stock = key && STOCK_IMAGES[key];
  if (!stock) return unsplashImage(url, options);
  return { src: stock.src, srcSet: stock.srcSet, avifSrcSet: stock.avifSrcSet, sizes: options.sizes };
}
