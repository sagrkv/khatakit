import { describe, expect, it } from 'vitest';
import { findPage, notFoundPage, pages } from '../../src/seo/pages';
import { SITE_URL } from '../../src/seo/site';
import { tools } from '../../src/data/tools';

type Schema = Record<string, unknown>;
const schemaOfType = (jsonLd: Schema[], type: string) => jsonLd.find((item) => item['@type'] === type);

describe('route registry', () => {
  it('gives every public page a title, description and absolute canonical', () => {
    for (const page of pages) {
      expect(page.title.length).toBeGreaterThan(10);
      expect(page.description.length).toBeGreaterThan(50);
      expect(page.canonical).toBe(SITE_URL + page.path);
      expect(page.noindex).toBe(false);
      expect(typeof page.load).toBe('function');
    }
  });

  it('keeps paths, titles and descriptions unique', () => {
    const unique = (values: string[]) => new Set(values).size === values.length;
    expect(unique(pages.map((page) => page.path))).toBe(true);
    expect(unique(pages.map((page) => page.title))).toBe(true);
    expect(unique(pages.map((page) => page.description))).toBe(true);
  });

  it('uses plain dashes in all metadata', () => {
    const emDash = String.fromCharCode(0x2014);
    expect(JSON.stringify([...pages, notFoundPage])).not.toContain(emDash);
  });

  it('registers every catalogue tool as a calculator page with WebApplication schema', () => {
    for (const tool of tools) {
      const page = pages.find((item) => item.path === tool.path);
      expect(page, tool.path).toBeDefined();
      const app = schemaOfType(page!.jsonLd, 'WebApplication');
      expect(app).toMatchObject({ name: tool.name, url: page!.canonical });
    }
  });

  it('lists every calculator on the home page collection', () => {
    const home = findPage('/');
    const collection = schemaOfType(home.jsonLd, 'CollectionPage') as {
      mainEntity: { '@type': string; itemListElement: { url: string }[] };
    };
    expect(collection.mainEntity['@type']).toBe('ItemList');
    expect(collection.mainEntity.itemListElement.map((item) => item.url)).toEqual(
      tools.map((tool) => SITE_URL + tool.path)
    );
    expect(home.trail).toEqual([]);
    expect(schemaOfType(home.jsonLd, 'BreadcrumbList')).toBeUndefined();
  });

  it('emits BreadcrumbList from the same trail on every non-home page', () => {
    for (const page of pages.filter((item) => item.path !== '/')) {
      expect(page.trail.at(-1)).toEqual({ name: page.name, path: page.path });
      const list = schemaOfType(page.jsonLd, 'BreadcrumbList') as {
        itemListElement: { position: number; name: string; item: string }[];
      };
      expect(list.itemListElement).toEqual(
        page.trail.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: SITE_URL + crumb.path,
        }))
      );
    }
  });

  it('marks the not-found page noindex and keeps it out of the sitemap', () => {
    expect(notFoundPage.noindex).toBe(true);
    expect(notFoundPage.canonical).toBeNull();
    expect(notFoundPage.sitemap).toBe(false);
    expect(pages).not.toContain(notFoundPage);
  });

  it('resolves pathnames the way the router matches them', () => {
    expect(findPage('/emi-calculator').path).toBe('/emi-calculator');
    expect(findPage('/emi-calculator/').path).toBe('/emi-calculator');
    expect(findPage('/EMI-Calculator').path).toBe('/emi-calculator');
    expect(findPage('/missing')).toBe(notFoundPage);
  });
});
