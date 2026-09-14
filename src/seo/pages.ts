import { matchPath } from 'react-router-dom';
import { tools } from '../data/tools';
import { breadcrumbSchema, collectionSchema, webApplicationSchema } from './schema';
import { DEFAULT_SOCIAL_IMAGE, SITE_URL } from './site';
import type { Crumb, JsonLd, Page, PageLoader } from './types';

/**
 * Route and SEO registry. Every public page is listed here once; the router,
 * document head, breadcrumbs, prerender and sitemap all read from it.
 * Calculators come from the tool catalogue in src/data/tools.ts.
 */

const HOME_CRUMB: Crumb = { name: 'All tools', path: '/' };

interface PageDefinition {
  path: string;
  name: string;
  title: string;
  description: string;
  load: PageLoader;
  schema?: JsonLd[];
}

function definePage({ path, name, title, description, load, schema = [] }: PageDefinition): Page {
  const trail = path === '/' ? [] : [HOME_CRUMB, { name, path }];
  return {
    path,
    name,
    title,
    description,
    canonical: SITE_URL + path,
    trail,
    image: DEFAULT_SOCIAL_IMAGE,
    jsonLd: trail.length > 0 ? [...schema, breadcrumbSchema(trail)] : schema,
    sitemap: true,
    noindex: false,
    load,
  };
}

const HOME_DESCRIPTION =
  'Free GST, income tax and loan calculators with calculation breakdowns. All calculations run in your browser; no account required.';

const home = definePage({
  path: '/',
  name: HOME_CRUMB.name,
  title: 'Khatakit - Free Accounting & Financial Tools for India',
  description: HOME_DESCRIPTION,
  load: () => import('../pages/Home').then((module) => ({ Component: module.default })),
  schema: [
    collectionSchema({
      name: 'Khatakit tool catalogue',
      description: HOME_DESCRIPTION,
      url: `${SITE_URL}/`,
      items: tools.map((tool) => ({ name: tool.name, url: SITE_URL + tool.path })),
    }),
  ],
});

const calculators = tools.map((tool) =>
  definePage({
    path: tool.path,
    name: tool.name,
    title: tool.seoTitle,
    description: tool.seoDescription,
    load: tool.load,
    schema: [
      webApplicationSchema({
        name: tool.name,
        description: tool.seoDescription,
        url: SITE_URL + tool.path,
      }),
    ],
  })
);

const about = definePage({
  path: '/about',
  name: 'About Khatakit',
  title: 'About Khatakit - Free Accounting Tools',
  description:
    'About Khatakit, a collection of free accounting and tax calculators. Project information, privacy and contributions.',
  load: () => import('../pages/About').then((module) => ({ Component: module.default })),
});

export const pages: Page[] = [home, ...calculators, about];

/** Rendered for unknown URLs and prerendered to 404.html. */
export const notFoundPage: Page = {
  path: '/404',
  name: 'Page not found',
  title: 'Page Not Found - Khatakit',
  description: 'Find the accounting tool you need in the Khatakit catalogue.',
  canonical: null,
  trail: [HOME_CRUMB, { name: 'Page not found', path: '/404' }],
  image: DEFAULT_SOCIAL_IMAGE,
  jsonLd: [],
  sitemap: false,
  noindex: true,
  load: () => import('../pages/NotFound').then((module) => ({ Component: module.default })),
};

/** Finds the registry page for a pathname using the router's matching rules. */
export function findPage(pathname: string): Page {
  return pages.find((page) => matchPath({ path: page.path, end: true }, pathname)) ?? notFoundPage;
}
