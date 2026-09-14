import { expect } from 'vitest';
import type { Page } from '../../src/seo/types';

const values = (doc: Document, selector: string, attribute: string) =>
  Array.from(doc.querySelectorAll(selector), (node) => node.getAttribute(attribute));

/**
 * Asserts the document carries exactly one set of metadata for the page,
 * in <head>, matching the registry, and one JSON-LD block per schema type.
 */
export function expectHeadToMatch(doc: Document, page: Page) {
  const canonical = page.canonical ? [page.canonical] : [];

  expect(Array.from(doc.querySelectorAll('title'), (node) => node.textContent)).toEqual([page.title]);
  expect(values(doc, 'meta[name="description"]', 'content')).toEqual([page.description]);
  expect(values(doc, 'link[rel="canonical"]', 'href')).toEqual(canonical);
  expect(values(doc, 'meta[name="robots"]', 'content')).toEqual(page.noindex ? ['noindex'] : []);

  expect(values(doc, 'meta[property="og:title"]', 'content')).toEqual([page.title]);
  expect(values(doc, 'meta[property="og:description"]', 'content')).toEqual([page.description]);
  expect(values(doc, 'meta[property="og:url"]', 'content')).toEqual(canonical);
  expect(values(doc, 'meta[property="og:image"]', 'content')).toEqual([page.image.url]);
  expect(values(doc, 'meta[name="twitter:card"]', 'content')).toEqual(['summary_large_image']);
  expect(values(doc, 'meta[name="twitter:title"]', 'content')).toEqual([page.title]);
  expect(values(doc, 'meta[name="twitter:description"]', 'content')).toEqual([page.description]);
  expect(values(doc, 'meta[name="twitter:image"]', 'content')).toEqual([page.image.url]);

  expect(doc.head.querySelector('title')).not.toBeNull();
  expect(doc.body.querySelectorAll('title, meta, link')).toHaveLength(0);

  const jsonLd = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'), (script) =>
    JSON.parse(script.textContent ?? '')
  );
  expect(jsonLd).toEqual(page.jsonLd);
  expect(new Set(jsonLd.map((data) => data['@type'])).size).toBe(jsonLd.length);
}
