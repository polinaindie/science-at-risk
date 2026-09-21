export interface GalleryProps {
  src?: string;
  alt?: string;
  current?: number;
  total?: number;
  onPrev?: () => void;
  onNext?: () => void;
  prevLabel?: string;
  nextLabel?: string;
  className?: string;
}

/**
 * Image gallery with prev/next — Figma Gallery (292:1691).
 */
export function Gallery({
  src = '/assets/ui/gallery.png',
  alt = '',
  current = 1,
  total = 3,
  onPrev,
  onNext,
  prevLabel = 'Назад',
  nextLabel = 'Вперед',
  className = '',
}: GalleryProps) {
  return (
    <figure className={`m-0 w-full max-w-[1038px] ${className}`.trim()}>
      <img src={src} alt={alt} className="block h-auto w-full object-cover" />
      <figcaption className="mt-4 grid grid-cols-3 items-center font-mono text-[18px] leading-6 tracking-[-0.03em] text-brand-black">
        <button
          type="button"
          className="justify-self-start border-0 bg-transparent p-0"
          onClick={onPrev}
        >
          &lt; {prevLabel}
        </button>
        <span className="justify-self-center tabular-nums">
          {current}/{total}
        </span>
        <button
          type="button"
          className="justify-self-end border-0 bg-transparent p-0"
          onClick={onNext}
        >
          {nextLabel} &gt;
        </button>
      </figcaption>
    </figure>
  );
}

export default Gallery;
