import { useId, useRef, useState, type FocusEvent, type KeyboardEvent } from 'react';
import type { SelectOption } from './Select';

export interface FieldSelectProps {
  label: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * A dropdown that looks like the site's text field: the label rides above, the
 * answer sits on an underline, and a chevron closes the line on the right. It
 * is for a form, next to inputs; the squircle `Select` stays for filters.
 */
export function FieldSelect({
  label,
  options,
  value = '',
  onChange,
  placeholder = '',
  invalid,
  disabled,
  className = '',
}: FieldSelectProps) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  const close = () => setOpen(false);
  const onBlur = (e: FocusEvent) => {
    if (!root.current?.contains(e.relatedTarget as Node | null)) close();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      close();
      (root.current?.querySelector('button[aria-haspopup]') as HTMLElement | null)?.focus();
    }
  };

  return (
    <div ref={root} className={`relative w-full ${className}`.trim()} onBlur={onBlur} onKeyDown={onKey}>
      <span id={`${id}-label`} className="block font-ukraine text-breadcrumbs text-brand-muted">
        {label}
      </span>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-labelledby={`${id}-label`}
        aria-invalid={invalid || undefined}
        onClick={() => setOpen((v) => !v)}
        className={`mt-1 flex w-full items-center justify-between gap-3 border-0 border-b-2 border-brand-black bg-transparent pb-2 text-left font-ukraine text-text2-desktop font-light text-brand-black ${
          open ? 'shadow-[0_2px_0_0_#000]' : ''
        } disabled:border-brand-disabled disabled:text-[#6b6b6b]`}
      >
        <span className={selected ? '' : 'text-[#6b6b6b]'}>{selected?.label ?? (placeholder || ' ')}</span>
        <img
          src={`${import.meta.env.BASE_URL}assets/ui/chevron.svg`}
          alt=""
          width={8}
          height={4}
          className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open ? (
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-labelledby={`${id}-label`}
          className="absolute top-full left-0 z-20 m-0 mt-2 max-h-[320px] w-full list-none overflow-y-auto border-2 border-brand-black bg-brand-white p-3"
        >
          {options.map((o) => (
            <li key={o.value} role="option" aria-selected={o.value === value}>
              <button
                type="button"
                onClick={() => {
                  onChange?.(o.value);
                  close();
                }}
                className={`w-full border-0 bg-transparent px-2 py-2 text-left font-ukraine text-text2-desktop font-light text-brand-black hover:bg-brand-accent-blue ${
                  o.value === value ? 'font-bold' : ''
                }`}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default FieldSelect;
