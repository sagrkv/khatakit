import type { RouteObject } from 'react-router-dom';
import RootLayout from './components/layout/RootLayout';
import { notFoundPage, pages } from './seo/pages';

/** Builds a fresh route tree from the registry. Server and client share it. */
export function createRoutes(): RouteObject[] {
  return [
    {
      Component: RootLayout,
      children: [
        ...pages.map(({ path, load }) => ({ path, lazy: load })),
        { path: '*', lazy: notFoundPage.load },
      ],
    },
  ];
}
