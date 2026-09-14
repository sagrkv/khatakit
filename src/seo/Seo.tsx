import { useContext } from 'react';
import { HeadWrittenByServer } from './headContext';
import { SITE_NAME } from './site';
import type { JsonLd, Page } from './types';

// Keeps "</script>" inside data from closing the tag.
const serialize = (data: JsonLd) => JSON.stringify(data).replace(/</g, '\\u003c');

/**
 * Title, description, canonical and social tags. React 19 hoists these into
 * <head>, adopts matching prerendered tags on hydration and updates or removes
 * them when the page changes.
 */
export function HeadTags({ page }: { page: Page }) {
  const { title, description, canonical, image } = page;
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {page.noindex ? <meta name="robots" content="noindex" /> : null}
      {canonical ? <link rel="canonical" href={canonical} /> : null}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {canonical ? <meta property="og:url" content={canonical} /> : null}
      <meta property="og:image" content={image.url} />
      <meta property="og:image:width" content={String(image.width)} />
      <meta property="og:image:height" content={String(image.height)} />
      <meta property="og:image:alt" content={image.alt} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image.url} />
      <meta name="twitter:image:alt" content={image.alt} />
    </>
  );
}

/** JSON-LD blocks. Scripts are not hoisted, so they render in the page body. */
function JsonLdScripts({ page }: { page: Page }) {
  return page.jsonLd.map((data) => (
    <script
      key={String(data['@type'])}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialize(data) }}
    />
  ));
}

export default function Seo({ page }: { page: Page }) {
  const headWrittenByServer = useContext(HeadWrittenByServer);
  return (
    <>
      {headWrittenByServer ? null : <HeadTags page={page} />}
      <JsonLdScripts page={page} />
    </>
  );
}
