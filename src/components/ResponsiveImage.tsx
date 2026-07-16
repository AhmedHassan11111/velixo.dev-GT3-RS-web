// src/components/ResponsiveImage.tsx
// Renders an optimized <picture> with AVIF -> WebP -> JPEG fallback and responsive srcset.
// Critical (above-the-fold) images use eager + high priority; others lazy-load.

import { getContentImage } from "../lib/images";

interface Props {
  name: string; // manifest key, e.g. "section", "dark", "thirdcard"
  alt: string;
  className?: string;
  eager?: boolean;
  widthsAttr?: string;
}

export function ResponsiveImage({ name, alt, className, eager, widthsAttr }: Props) {
  const img = getContentImage(name);
  if (!img) {
    // Fallback to original path if not in manifest (defensive).
    return <img src={`/${name}.jpg`} alt={alt} className={className} loading={eager ? "eager" : "lazy"} decoding="async" />;
  }

  const srcSet = (fmt: "avif" | "webp") =>
    img.variants.map((v) => `${v[fmt]} ${v.width}w`).join(", ");

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet("avif")} sizes={img.sizes} />
      <source type="image/webp" srcSet={srcSet("webp")} sizes={img.sizes} />
      <img
        src={img.variants[img.variants.length - 1]?.jpg}
        srcSet={img.variants.map((v) => `${v.jpg} ${v.width}w`).join(", ")}
        sizes={img.sizes}
        alt={alt}
        className={className}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : "auto"}
        width={widthsAttr ? undefined : img.variants[img.variants.length - 1]?.width}
      />
    </picture>
  );
}
