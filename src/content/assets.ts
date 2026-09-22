/**
 * A path to something in `public/`.
 *
 * The site is served from a subdirectory on GitHub Pages, so a leading-slash
 * path like `/img/story.jpg` would look for the file at the domain root and
 * find nothing. Vite knows the prefix the build was made with; this puts it in
 * front. Locally `BASE_URL` is `/`, so the paths are unchanged.
 */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
