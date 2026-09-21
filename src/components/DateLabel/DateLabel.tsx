export interface DateLabelProps {
  children: string;
  className?: string;
}

/** Dim date meta (`.data`). */
export function DateLabel({ children, className = '' }: DateLabelProps) {
  return (
    <p className={`my-4 font-mono text-breadcrumbs text-brand-muted md:my-8 ${className}`.trim()}>
      {children}
    </p>
  );
}

export default DateLabel;
