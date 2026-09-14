import type { ComponentType } from 'react';

export interface Crumb {
  name: string;
  path: string;
}

export type JsonLd = Record<string, unknown>;

/** Loads a page module for a react-router lazy route. */
export type PageLoader = () => Promise<{ Component: ComponentType }>;

interface SocialImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

export interface Page {
  path: string;
  /** Short name shown as the last breadcrumb. */
  name: string;
  title: string;
  description: string;
  canonical: string | null;
  /** Breadcrumb trail, ending with this page. Empty on the home page. */
  trail: Crumb[];
  image: SocialImage;
  jsonLd: JsonLd[];
  sitemap: boolean;
  noindex: boolean;
  load: PageLoader;
}
