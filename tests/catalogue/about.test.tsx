import { afterEach, expect, it } from 'vitest';
import About from '../../src/pages/About';
import { tools } from '../../src/data/tools';
import { ISSUES_URL, REPO_URL } from '../../src/seo/site';
import { mount, type Mounted } from '../helpers/page';

let page: Mounted | undefined;

afterEach(() => {
  page?.unmount();
  page = undefined;
});

it('lists every calculator in the catalogue with a link and its summary', () => {
  page = mount(<About />);
  for (const tool of tools) {
    const link = page.node.querySelector(`a[href="${tool.path}"]`);
    expect(link, tool.slug).not.toBeNull();
    expect(link!.textContent).toContain(tool.name);
    expect(link!.textContent).toContain(tool.summary);
  }
});

it('says who maintains Khatakit, how rules are checked, and how to report an error', () => {
  page = mount(<About />);
  const text = page.node.textContent ?? '';
  expect(text).toContain('Khatakit is built and maintained by Sagar at filtercoffee.dev');
  expect(text).toContain('not tax advice');
  expect(text).toContain('open source');
  expect(page.node.querySelector(`a[href="${REPO_URL}/blob/main/docs/RULES-REVIEW.md"]`)).not.toBeNull();
  expect(page.node.querySelector(`a[href="${ISSUES_URL}"]`)?.textContent).toContain('Report an error');
});
