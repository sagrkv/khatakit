import { describe, expect, it } from 'vitest';
import { pages } from '../../src/seo/pages';
import { buildRobots, buildSitemap } from '../../src/seo/sitemap';

describe('sitemap and robots', () => {
  it('lists exactly the public registry pages', () => {
    const xml = buildSitemap(pages);
    const locations = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    expect(locations).toEqual([
      'https://khatakit.in/',
      'https://khatakit.in/gst-late-fee-interest-calculator',
      'https://khatakit.in/gst-calculator',
      'https://khatakit.in/advance-tax-calculator',
      'https://khatakit.in/emi-calculator',
      'https://khatakit.in/presumptive-income-calculator',
      'https://khatakit.in/tds-interest-calculator',
      'https://khatakit.in/about',
    ]);
  });

  it('leaves out pages that opt out of the sitemap', () => {
    const [first, ...rest] = pages;
    const xml = buildSitemap([{ ...first, sitemap: false }, ...rest]);
    expect(xml).not.toContain(`<loc>${first.canonical}</loc>`);
  });

  it('allows crawling and points to the sitemap', () => {
    expect(buildRobots()).toBe('User-agent: *\nAllow: /\n\nSitemap: https://khatakit.in/sitemap.xml\n');
  });
});
