/**
 * How the strength meter reads a password. The static pages' script
 * (public/js/satr-auth.js) carries the same rules; keep the two in step.
 *
 * 0 empty · 1 below the requirements · 2 meets them · 3 and long (14+) or
 * varied (symbol, or upper and lower case) · 4 both.
 */
export interface PasswordRules {
  length: boolean;
  letter: boolean;
  digit: boolean;
}

export const MIN_PASSWORD_LENGTH = 10;

export function passwordRules(value: string): PasswordRules {
  return {
    length: value.length >= MIN_PASSWORD_LENGTH,
    letter: /\p{L}/u.test(value),
    digit: /\d/.test(value),
  };
}

export function passwordLevel(value: string): 0 | 1 | 2 | 3 | 4 {
  if (!value) return 0;
  const r = passwordRules(value);
  if (!(r.length && r.letter && r.digit)) return 1;
  const long = value.length >= 14 ? 1 : 0;
  const varied = /[^\p{L}\d\s]/u.test(value) || (/\p{Lu}/u.test(value) && /\p{Ll}/u.test(value)) ? 1 : 0;
  return (2 + long + varied) as 2 | 3 | 4;
}
