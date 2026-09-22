import type { StoryCardProps } from '../../components/StoryCard/StoryCard';
import type { StorySlide } from '../../components/StoriesSlider/StoriesSlider';
import type { StoryTag } from '../../components/StoriesSlider/storyTags';

export interface StoryEntry extends StoryCardProps {
  slug: string;
  tags: StoryTag[];
  /** `Stories` or `Blogs` — the site's own two streams. */
  stream: 'Stories' | 'Blogs';
}

export const stories: StoryEntry[] = [
  {
    slug: 'uncovered-graves-how-lviv-restores-its-memory-about-the-school-of-mathematics',
    title: 'Uncovered Graves. How Lviv restores its memory about the school of mathematics',
    text: "A Map of Burial Sites Revives the Memory of Lviv's Forgotten Mathematicians",
    date: '12.08.26',
    image: '/img/story-lp-235.jpg',
    href: '/stories/uncovered-graves-how-lviv-restores-its-memory-about-the-school-of-mathematics',
    tags: ['Memory', 'Communities'],
    stream: 'Stories',
  },
  {
    slug: 'a-hit-too-close-to-home-what-happened-to-the-institute-of-biochemistry-after-a-drone-strike',
    title: 'A Hit Too Close To Home. What happened to the Institute of Biochemistry after a drone strike',
    text: 'How is the Institute of Biochemistry recovering from the attack?',
    date: '12.08.26',
    image: '/img/story-lp-233.jpg',
    href: '/stories/a-hit-too-close-to-home-what-happened-to-the-institute-of-biochemistry-after-a-drone-strike',
    tags: ['Infrastructure', 'Medicine'],
    stream: 'Stories',
  },
  {
    slug: 'lost-worlds-how-the-russian-strike-ruined-the-chornobyl-museum-in-kyiv',
    title: '"Lost Worlds." How the Russian strike ruined the Chornobyl Museum in Kyiv',
    text: 'We visited the Chornobyl Museum after a Russian strike to see how artifacts and memory are being preserved',
    date: '21.07.26',
    image: '/img/story-lp-226.jpg',
    href: '/stories/lost-worlds-how-the-russian-strike-ruined-the-chornobyl-museum-in-kyiv',
    tags: ['Heritage', 'Memory'],
    stream: 'Stories',
  },
  {
    slug: 'we-will-sow-wheat-and-grow-bread-pitfalls-of-humanitarian-demining-in-ukraine',
    title: '"We will sow wheat and grow bread": pitfalls of humanitarian demining in Ukraine',
    text: 'How humanitarian demining works in Ukraine',
    date: '15.07.26',
    image: '/img/story-lp-224.jpg',
    href: '/stories/we-will-sow-wheat-and-grow-bread-pitfalls-of-humanitarian-demining-in-ukraine',
    tags: ['Environment', 'Technology'],
    stream: 'Blogs',
  },
  {
    slug: 'explosion-residues-on-our-tables-how-the-war-impacts-the-environment',
    title: "Explosion Residues on Our Tables. How the war impacts the environment and why it's difficult to study",
    text: 'How Ukraine is documenting the environmental impact of Russian aggression',
    date: '10.07.26',
    image: '/img/story-lp-222.jpg',
    href: '/stories/explosion-residues-on-our-tables-how-the-war-impacts-the-environment',
    tags: ['Environment', 'Voices'],
    stream: 'Stories',
  },
];

/** One archive entry as the home page's slider wants it. */
export function toSlide(entry: StoryEntry): StorySlide {
  return {
    suptitle: 'Stories',
    title: entry.title,
    text: entry.text,
    image: entry.image ?? '',
    href: entry.href,
    tags: entry.tags,
  };
}

/**
 * A handful of stories for the home page, drawn from the same archive the
 * `/stories` page lists — and a different draw each visit, so the front page
 * does not settle on the same three.
 */
export function pickFeaturedStories(count = 3): StorySlide[] {
  const pool = stories.filter((story) => story.image);
  // Fisher-Yates over a copy; the archive itself keeps its order.
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count).map(toSlide);
}
