import { StrictMode } from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom';
import { createRoutes } from './routes';
import { HeadWrittenByServer } from './seo/headContext';
import { findPage } from './seo/pages';
import { HeadTags } from './seo/Seo';
import { SITE_URL } from './seo/site';

export { notFoundPage, pages } from './seo/pages';
export { buildRobots, buildSitemap } from './seo/sitemap';

const HEAD_PLACEHOLDER = '<!--app-head-->';
const HTML_PLACEHOLDER = '<!--app-html-->';

/**
 * Renders one registry path. The head tags come straight from the registry;
 * the body is the app markup. Only registry data reaches the HTML, never user input.
 */
export async function renderPage(path: string) {
  const handler = createStaticHandler(createRoutes());
  const context = await handler.query(new Request(SITE_URL + path));
  if (context instanceof Response) {
    throw new Error(`Unexpected response while rendering ${path}: ${context.status}`);
  }
  if (context.errors) {
    throw new Error(`Route error while rendering ${path}: ${JSON.stringify(context.errors)}`);
  }
  const html = renderToString(
    <StrictMode>
      <HeadWrittenByServer value>
        <StaticRouterProvider
          router={createStaticRouter(handler.dataRoutes, context)}
          context={context}
          hydrate={false}
        />
      </HeadWrittenByServer>
    </StrictMode>
  );
  const head = renderToStaticMarkup(<HeadTags page={findPage(path)} />);
  return { head, html };
}

export async function renderDocument(template: string, path: string) {
  if (!template.includes(HEAD_PLACEHOLDER) || !template.includes(HTML_PLACEHOLDER)) {
    throw new Error('HTML template is missing the app-head or app-html placeholder');
  }
  const { head, html } = await renderPage(path);
  return template.replace(HEAD_PLACEHOLDER, () => head).replace(HTML_PLACEHOLDER, () => html);
}
