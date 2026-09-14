import { SITE_URL } from './site';
import type { Page } from './types';

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function buildSitemap(pages: Page[]): string {
  const urls = pages
    .filter((page) => page.sitemap && page.canonical)
    .map((page) => {
      const lastmod = page.lastModified ? `\n    <lastmod>${escapeXml(page.lastModified)}</lastmod>` : '';
      return `  <url>\n    <loc>${escapeXml(page.canonical!)}</loc>${lastmod}\n  </url>`;
    });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}

export function buildRobots(): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}
