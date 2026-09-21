import { useId, useState, type ButtonHTMLAttributes } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

/**
 * Squircle dropdown — Figma Dropdown (292:1555+).
 */
export function Select({
  label,
  options,
  value: controlled,
  defaultValue,
  onChange,
  disabled,
  className = '',
  placeholder = 'Наукова галузь',
}: SelectProps) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? '');
  const value = controlled ?? uncontrolled;
  const selected = options.find((o) => o.value === value);

  const setValue = (next: string) => {
    if (controlled === undefined) setUncontrolled(next);
    onChange?.(next);
    setOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`.trim()}>
      {label ? (
        <span className="mb-2 block font-mono text-breadcrumbs text-brand-muted">{label}</span>
      ) : null}
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        className="satr-squircle satr-squircle--bordered min-w-[192px] justify-between gap-3 pr-4 pl-4 disabled:opacity-40"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-mono text-text1-desktop">{selected?.label ?? placeholder}</span>
        <img
          src="/assets/ui/chevron.svg"
          alt=""
          width={8}
          height={4}
          className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute top-[calc(100%+8px)] left-0 z-10 m-0 min-w-[260px] list-none border-2 border-brand-black bg-brand-white p-5"
        >
          {options.map((opt) => (
            <li key={opt.value} role="option" aria-selected={opt.value === value}>
              <button
                type="button"
                className="w-full border-0 bg-transparent py-2 text-left font-ukraine text-text2-desktop font-light text-brand-black hover:opacity-70"
                onClick={() => setValue(opt.value)}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export type SelectTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default Select;
