import type { Decorator } from '@storybook/react-vite';
import { MemoryRouter, Routes, Route } from 'react-router';

/**
 * Pages read their slug from the router, so a story has to stand one up. The
 * path is given per story through `parameters.route`, defaulting to the page's
 * own listing.
 */
export const withRouter: Decorator = (Story, context) => {
  const route = (context.parameters.route as string | undefined) ?? '/';
  return (
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="*" element={<Story />} />
      </Routes>
    </MemoryRouter>
  );
};
