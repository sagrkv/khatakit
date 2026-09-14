import { afterEach, expect, it } from 'vitest';
import About from '../../src/pages/About';
import { tools } from '../../src/data/tools';
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
