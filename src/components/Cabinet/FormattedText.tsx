import { richToHtml } from './formatText';

/** Saved text as the profile prints it: paragraphs, lists and links made from plain writing. */
export function FormattedText({ text, className = '' }: { text: string; className?: string }) {
  return <div className={`rich-text ${className}`} dangerouslySetInnerHTML={{ __html: richToHtml(text) }} />;
}
