// @vitest-environment node
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';
import { renderDocument } from '../../src/entry-server';
import { notFoundPage, pages } from '../../src/seo/pages';
import { OG_IMAGE_URL } from '../../src/seo/site';
import { expectHeadToMatch } from './head';

const template =
  '<!doctype html><html lang="en"><head><meta charset="UTF-8" /><!--app-head--></head>' +
  '<body><div id="root"><!--app-html--></div></body></html>';

const headings: Record<string, string> = {
  '/': 'Accounting &tax tools',
  '/gst-late-fee-interest-calculator': 'GST Late Fee & Interest Calculator',
  '/gst-calculator': 'GST Calculator',
  '/advance-tax-calculator': 'Advance Tax Calculator',
  '/emi-calculator': 'EMI Calculator',
  '/presumptive-income-calculator': 'Presumptive Tax Calculator',
  '/tds-interest-calculator': 'TDS Interest Calculator',
  '/about': 'About Khatakit',
  '/404': 'Page not found',
};

async function load(path: string) {
  const html = await renderDocument(template, path);
  return { html, document: new JSDOM(html).window.document };
}

describe('prerendered HTML', () => {
  it('covers every registry page with a heading', () => {
    expect(Object.keys(headings).sort()).toEqual([...pages.map((page) => page.path), '/404'].sort());
  });

  for (const page of pages) {
    it(`renders ${page.path} with content and metadata before JavaScript runs`, async () => {
      const { html, document } = await load(page.path);
      expect(html).not.toContain('<!--app-');
      expect(document.querySelector('#root h1')?.textContent).toBe(headings[page.path]);
      expect(page.image.url).toBe(OG_IMAGE_URL);
      expectHeadToMatch(document, page);

      const crumbs = Array.from(
        document.querySelectorAll(
          'nav[aria-label="Breadcrumb"] a, nav[aria-label="Breadcrumb"] [aria-current]'
        ),
        (node) => node.textContent
      );
      expect(crumbs).toEqual(page.trail.map((crumb) => crumb.name));
    });
  }

  it('renders the not-found page as noindex without a canonical', async () => {
    const { document } = await load(notFoundPage.path);
    expect(document.querySelector('#root h1')?.textContent).toBe('Page not found');
    expectHeadToMatch(document, notFoundPage);
  });

  it('rejects a template without placeholders', async () => {
    await expect(renderDocument('<html></html>', '/')).rejects.toThrow('placeholder');
  });
});
