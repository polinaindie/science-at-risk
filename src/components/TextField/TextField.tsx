import { useId, useState } from 'react';

export interface TextFieldProps {
  label: string;
  name?: string;
  type?: 'text' | 'email';
  /** Renders a textarea with the site's character counter. */
  multiline?: boolean;
  maxLength?: number;
  required?: boolean;
  defaultValue?: string;
  className?: string;
}

/**
 * The site's floating-label field (`.column` + `._risk-label`). The label sits
 * after the control in the DOM — the float is driven by `:focus`/`:valid`
 * sibling selectors, so the order matters.
 */
export function TextField({
  label,
  name,
  type = 'text',
  multiline = false,
  maxLength = 7000,
  required = false,
  defaultValue = '',
  className = '',
}: TextFieldProps) {
  const id = useId();
  const [value, setValue] = useState(defaultValue);
  const tooLong = value.length > maxLength;

  if (!multiline) {
    return (
      <div className={`column main-text main-text--ukraine ${className}`.trim()}>
        <input
          className="_risk-label"
          type={type}
          id={id}
          name={name}
          aria-label={label}
          required={required}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <label htmlFor={id}>{label}</label>
      </div>
    );
  }

  return (
    <div className={`_counter_module column main-text main-text--ukraine ${className}`.trim()}>
      <textarea
        className="_risk-label _counter_input"
        id={id}
        name={name}
        aria-label={label}
        required={required}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <label htmlFor={id}>{label}</label>
      <label htmlFor={id} className="column__wrap-err">
        {tooLong && (
          <div>
            <p className="column__err-text">Please shorten your inquiry.</p>
          </div>
        )}
        <span className="_counter_output column__counter">
          ({value.length} / {maxLength})
        </span>
      </label>
    </div>
  );
}
