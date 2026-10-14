/**
 * A blog card's hero image as the <Picture> attributes { src, srcSet,
 * avifSrcSet }.
 *
 * Self-hosted heroes (scripts/build-images.mjs) are files named
 * <base>-<width>.<hash>.<webp|avif>, so a card (scripts/build-blog-data.mjs
 * cardOf) carries them as one compact record instead of three long srcset
 * strings:
 *   image: { base, widths: [480, 880, 1320], webp: [hash…], avif?: [hash…], main }
 * where `main` is the index of the width used as the fallback src. A card
 * without that record carries hero / heroSrc / heroSrcSet / heroAvifSrcSet
 * as strings, as before.
 *
 * Plain JS on purpose: build-blog-data.mjs runs it on every card it writes and
 * fails the build unless the strings come back exactly as they went in.
 */
export function cardImage(card) {
  const image = card.image;
  if (!image) return { src: card.heroSrc || card.hero, srcSet: card.heroSrcSet, avifSrcSet: card.heroAvifSrcSet };
  const file = (index, hashes, ext) => `${image.base}-${image.widths[index]}.${hashes[index]}.${ext}`;
  const set = (hashes, ext) => (hashes ? image.widths.map((width, index) => `${file(index, hashes, ext)} ${width}w`).join(', ') : undefined);
  return { src: file(image.main, image.webp, 'webp'), srcSet: set(image.webp, 'webp'), avifSrcSet: set(image.avif, 'avif') };
}
