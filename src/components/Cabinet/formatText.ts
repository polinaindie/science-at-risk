/**
 * People write plain text; the system does the formatting. No React, no editor:
 * the Go side needs to apply exactly these rules.
 *
 *   one line = one paragraph
 *   a line that starts with "-", "•", "*" or "1." = a list item
 *   a web address (https://…) = a link
 */

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const inlineToHtml = (s: string) =>
  esc(s).replace(/https?:\/\/[^\s<]+[^\s<.,;:!?)»”]/gi, (url) => {
    const raw = url.replace(/&amp;/g, '&');
    return `<a href="${esc(raw)}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });

/** Stored text → HTML made only of p, ul, li, strong, a. Everything else is escaped. */
export function richToHtml(text: string): string {
  const out: string[] = [];
  let list = false;
  for (const line of text.split('\n')) {
    const l = line.trim();
    if (!l) continue;
    const item = /^(?:[-•*]|\d+[.)])\s+(.*)$/.exec(l);
    if (item) {
      if (!list) out.push('<ul>');
      list = true;
      out.push(`<li>${inlineToHtml(item[1])}</li>`);
    } else {
      if (list) out.push('</ul>');
      list = false;
      out.push(`<p>${inlineToHtml(l)}</p>`);
    }
  }
  if (list) out.push('</ul>');
  return out.join('');
}

/** No words in it, whatever the markers around them. */
export const isRichEmpty = (text: string) => !text.replace(/[-•*\s]/g, '').length;

