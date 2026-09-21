export interface FullImageProps {
  src: string;
  alt: string;
  caption?: string;
}

/** The `.full-image` hero picture at the top of a story. */
export function FullImage({ src, alt, caption }: FullImageProps) {
  return (
    <picture className="full-image">
      <img src={src} alt={alt} title={alt} />
      <div className="full-image__bg" />
      {caption && <figcaption className="image__figcaption">{caption}</figcaption>}
    </picture>
  );
}
