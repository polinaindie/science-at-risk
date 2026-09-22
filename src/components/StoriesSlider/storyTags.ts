/**
 * The themes a story can be filed under — the editorial set the project works
 * with, in the order it is shown.
 *
 * English, because the rest of this build is; the Ukrainian version of the
 * site will want its own labels for the same nine themes (Інфраструктура,
 * Спадщина, Медицина, Довкілля, Технології, Дипломатія, Пам'ять, Голоси,
 * Спільноти), so these read as the keys of that pair.
 */
export const STORY_TAGS = [
  'Infrastructure',
  'Heritage',
  'Medicine',
  'Environment',
  'Technology',
  'Diplomacy',
  'Memory',
  'Voices',
  'Communities',
] as const;

export type StoryTag = (typeof STORY_TAGS)[number];
