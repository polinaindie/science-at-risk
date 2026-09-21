export interface LoaderProps {
  text?: string;
  active?: boolean;
  className?: string;
}

/** Search/list loader overlay from mirror (`.loader`). */
export function Loader({
  text = 'Searching…',
  active = true,
  className = '',
}: LoaderProps) {
  if (!active) return null;
  return (
    <div
      className={`flex min-h-[200px] w-full items-center justify-center bg-brand-white pt-[120px] ${className}`.trim()}
      role="status"
      aria-live="polite"
    >
      <p className="font-mono text-h3-desktop text-brand-black">{text}</p>
    </div>
  );
}

export default Loader;
