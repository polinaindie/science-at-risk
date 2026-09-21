import { useState } from 'react';

export interface SelectOption {
  label: string;
  href?: string;
}

export interface SelectProps {
  /** Label on the closed button — the site shows the active option here. */
  value: string;
  options: SelectOption[];
  defaultOpen?: boolean;
  className?: string;
  onSelect?: (label: string) => void;
}

const Chevron = () => (
  <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1L5 5L9 1" stroke="black" strokeWidth="1.5" />
  </svg>
);

/**
 * The site's `.riskCustom-select` — a bordered button that expands a list.
 * Open state is the `active` class on the root, matching the site's own JS.
 */
export function Select({ value, options, defaultOpen = false, className = '', onSelect }: SelectProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`riskCustom-select${open ? ' active' : ''} ${className}`.trim()}>
      <button
        type="button"
        className="riskCustom-select__btn btn btn--bordered"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {value}
        <Chevron />
      </button>
      <div className="riskCustom-select__wrap">
        <div className="riskCustom-select__wrap-squircle">
          <ul className="riskCustom-select__list">
            {options.map((option) => (
              <li key={option.label} className="riskCustom-select__item">
                <a
                  href={option.href ?? '#'}
                  className="riskCustom-select__link"
                  onClick={() => {
                    onSelect?.(option.label);
                    setOpen(false);
                  }}
                >
                  <span className="hover hover--black">{option.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
