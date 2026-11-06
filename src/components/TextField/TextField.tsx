import {
  useId,
  useLayoutEffect,
  useRef,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';

type FieldTone = 'light' | 'dark';

interface FieldBase {
  label: string;
  /** Multiline only: grow with the text instead of scrolling inside the box,
   *  so the text never slides up under the label. */
  autoGrow?: boolean;
  /** With autoGrow: stop growing after this many lines and scroll inside the box. */
  maxRows?: number;
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
  autoGrow,
  maxRows,
  ...rest
}: TextFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const area = useRef<HTMLTextAreaElement>(null);
  const value = (rest as { value?: unknown }).value;
  useLayoutEffect(() => {
    const el = area.current;
    if (!autoGrow || !el) return;
    el.style.height = 'auto';
    let h = el.scrollHeight;
    if (maxRows) {
      const cs = getComputedStyle(el);
      const line = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.5;
      const max =
        line * maxRows +
        parseFloat(cs.paddingTop) +
        parseFloat(cs.paddingBottom) +
        parseFloat(cs.borderBottomWidth);
      el.style.overflowY = h > max ? 'auto' : 'hidden';
      h = Math.min(h, max);
    }
    el.style.height = `${h}px`;
  }, [autoGrow, maxRows, value]);
  const isDark = tone === 'dark';
  const line = isDark ? 'border-white' : 'border-brand-black';
  const text = isDark ? 'text-white' : 'text-brand-black';
  /* dark labels ≥ ~4.6:1 on black; avoid opacity-40 floating labels */
  const muted = isDark ? 'text-white/85' : 'text-brand-muted';
  const disabledLine = 'border-brand-disabled';
  // Disabled text is exempt from WCAG, but it still has to be readable (e.g. a read-only email).
  const disabledText = 'text-[#6b6b6b]';
  // The label lives over the field and rides up out of it, as it does on the
  // reference; the field reserves that height from the start so nothing below
  // it moves when the label travels.
  const shell = `satr-float w-full max-w-[530px] ${className}`.trim();
  const controlClass = `w-full border-0 border-b-2 bg-transparent font-ukraine text-text2-desktop font-light outline-none placeholder:opacity-0 focus:placeholder:opacity-100 ${isDark ? 'placeholder:text-white/70' : 'placeholder:text-[#6b6b6b]'} ${
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
          ref={area}
          id={fieldId}
          disabled={disabled}
          rows={autoGrow ? 1 : 3}
          className={`min-h-[71px] pb-2 ${autoGrow ? 'resize-none overflow-hidden' : 'resize-y'} ${controlClass}`}
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
