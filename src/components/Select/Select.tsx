import { useState } from 'react';
import { Button } from '../Button/Button';
import { SquircleShape } from '../../styles/SquircleShape';

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
    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

/**
 * The site's `.riskCustom-select` — a bordered button that expands a panel.
 * Open state is the `active` class on the root, matching the site's own JS.
 *
 * Both parts are squircles: the trigger is the button pill, and the panel is
 * a 1px ring at radius 25 (the site's `--squircle-radius` there). When the
 * select opens, the site drops the trigger's outline to 0 — the ring fills in
 * solid black, which is what turns its label white.
 */
export function Select({ value, options, defaultOpen = false, className = '', onSelect }: SelectProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`riskCustom-select${open ? ' active' : ''} ${className}`.trim()}>
      <Button
        className="riskCustom-select__btn"
        variant={open ? 'black' : 'bordered'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {value}
        <Chevron />
      </Button>
      <div className="riskCustom-select__wrap">
        <div className="riskCustom-select__wrap-squircle sartr-squircle">
          <SquircleShape radius={25} smoothing={0.9} strokeWidth={2} fill="#000000" />
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
