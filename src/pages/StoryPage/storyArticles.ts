import { stories, type StoryEntry } from '../StoriesPage/storiesContent';

export interface StoryArticle extends StoryEntry {
  /** The body, as the site sets it: headings and paragraphs in order. */
  body: { kind: 'heading' | 'paragraph'; text: string }[];
}

const bodyFor = (entry: StoryEntry): StoryArticle['body'] => [
  { kind: 'paragraph', text: entry.text ?? '' },
  { kind: 'heading', text: 'What happened' },
  {
    kind: 'paragraph',
    text: 'This is sample body copy standing in for the article the editors will publish here. The template prints headings and paragraphs in the order the newsroom sends them, with the share row and the related stories underneath.',
  },
  { kind: 'heading', text: 'What it means' },
  {
    kind: 'paragraph',
    text: 'A second section, so the page shows how a long read breaks up: the aside keeps the date and the sharing links in view while the column of text scrolls past it.',
  },
];

export const storyArticles: StoryArticle[] = stories.map((entry) => ({
  ...entry,
  body: bodyFor(entry),
}));

export const findStory = (slug?: string) =>
  storyArticles.find((story) => story.slug === slug) ?? storyArticles[0];
