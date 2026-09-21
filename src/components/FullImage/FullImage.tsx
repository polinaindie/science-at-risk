export interface FullImageProps {
  src?: string;
  alt?: string;
  className?: string;
}

/** Full-bleed story image (`.full-image`). */
export function FullImage({
  src = '/assets/mirror/story.jpg',
  alt = '',
  className = '',
}: FullImageProps) {
  return (
    <figure className={`m-0 w-screen max-w-none relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] ${className}`.trim()}>
      <div className="relative w-full" style={{ paddingTop: '46%' }}>
        <img src={src} alt={alt} className="absolute inset-0 size-full object-cover" />
      </div>
    </figure>
  );
}

export default FullImage;
