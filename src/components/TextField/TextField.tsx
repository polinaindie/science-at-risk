import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';

type FieldTone = 'light' | 'dark';

interface FieldBase {
  label: string;
  tone?: FieldTone;
  className?: string;
}

export type TextFieldProps = FieldBase &
  (
    | ({ multiline?: false } & InputHTMLAttributes<HTMLInputElement>)
    | ({ multiline: true } & TextareaHTMLAttributes<HTMLTextAreaElement>)
  );

/**
 * Underline text field — Figma Input (292:1725).
 */
export function TextField({
  label,
  tone = 'light',
  className = '',
  id,
  disabled,
  multiline,
  ...rest
}: TextFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const isDark = tone === 'dark';
  const line = isDark ? 'border-white' : 'border-brand-black';
  const text = isDark ? 'text-white' : 'text-brand-black';
  /* dark labels ≥ ~4.6:1 on black; avoid opacity-40 floating labels */
  const muted = isDark ? 'text-white/85' : 'text-brand-muted';
  const disabledLine = 'border-brand-disabled';
  const disabledText = 'text-brand-disabled';
  // The label lives over the field and rides up out of it, as it does on the
  // reference; the field reserves that height from the start so nothing below
  // it moves when the label travels.
  const shell = `satr-float w-full max-w-[530px] ${className}`.trim();
  const controlClass = `w-full border-0 border-b-2 bg-transparent font-ukraine text-text2-desktop font-light outline-none placeholder:opacity-40 ${
    disabled ? `${disabledLine} ${disabledText}` : `${line} ${text}`
  }`;

  // A space rather than nothing: `:placeholder-shown` is what tells an empty
  // field from a filled one, and a space shows nothing of itself. A caller that
  // wants a real placeholder still gets one — it simply sits under a label that
  // has already moved out of the way.
  const placeholder = rest.placeholder ?? ' ';

  return (
    <div className={shell}>
      {multiline ? (
        <textarea
          id={fieldId}
          disabled={disabled}
          rows={3}
          className={`min-h-[71px] resize-y pb-2 ${controlClass}`}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          placeholder={placeholder}
        />
      ) : (
        <input
          id={fieldId}
          disabled={disabled}
          className={`pb-2 ${controlClass}`}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
          placeholder={placeholder}
        />
      )}
      <label
        htmlFor={fieldId}
        className={`satr-float__label font-ukraine ${disabled ? disabledText : muted}`}
      >
        {label}
      </label>
    </div>
  );
}

export default TextField;
