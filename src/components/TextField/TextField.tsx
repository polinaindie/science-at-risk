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
  const shell = `flex w-full max-w-[530px] flex-col gap-1 ${className}`.trim();
  const controlClass = `w-full border-0 border-b-2 bg-transparent font-ukraine text-text2-desktop font-light outline-none placeholder:opacity-40 ${
    disabled ? `${disabledLine} ${disabledText}` : `${line} ${text}`
  }`;

  return (
    <div className={shell}>
      <label
        htmlFor={fieldId}
        className={`font-mono text-breadcrumbs ${disabled ? disabledText : muted}`}
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          id={fieldId}
          disabled={disabled}
          rows={3}
          className={`min-h-[71px] resize-y pb-2 ${controlClass}`}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={fieldId}
          disabled={disabled}
          className={`h-10 ${controlClass}`}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
    </div>
  );
}

export default TextField;
