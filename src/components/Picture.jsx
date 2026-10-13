/**
 * An <img> with an optional AVIF <source>, for the self-hosted blog images
 * (src/data/media.generated.js, mapped by scripts/build-blog-data.mjs).
 *
 * Without `avifSrcSet` it renders exactly the plain <img> it is given. With
 * it, the <img> is wrapped in <picture class="media-picture">, which is
 * `display: contents` (pages.css), so every existing rule that styles the
 * image (`.blog-card-media img`, `.blog-hero-figure img`, …) applies unchanged.
 * Browsers without AVIF use the <img>'s WebP srcset.
 */
export default function Picture({ avifSrcSet, sizes, srcSet, ...img }) {
  const image = <img srcSet={srcSet} sizes={srcSet ? sizes : undefined} {...img} />;
  if (!avifSrcSet) return image;
  return (
    <picture className="media-picture">
      <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />
      {image}
    </picture>
  );
}
