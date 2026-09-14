import { StrictMode } from 'react';
import { createRoot, hydrateRoot, type Root } from 'react-dom/client';
import { createBrowserRouter, matchRoutes, RouterProvider, type RouteObject } from 'react-router-dom';
import { createRoutes } from './routes';

/**
 * Loads the lazy page modules for the current URL before hydrating, so the
 * first client render matches the prerendered markup instead of a fallback.
 */
async function loadMatchedRoutes(routes: RouteObject[]) {
  const matches = matchRoutes(routes, window.location) ?? [];
  await Promise.all(
    matches.map(async ({ route }) => {
      if (typeof route.lazy !== 'function') return;
      const module = await route.lazy();
      Object.assign(route, module, { lazy: undefined });
    })
  );
}

export async function startClient(container: HTMLElement): Promise<Root> {
  const routes = createRoutes();
  await loadMatchedRoutes(routes);
  const app = (
    <StrictMode>
      <RouterProvider router={createBrowserRouter(routes)} />
    </StrictMode>
  );
  if (container.firstElementChild) return hydrateRoot(container, app);
  const root = createRoot(container);
  root.render(app);
  return root;
}
