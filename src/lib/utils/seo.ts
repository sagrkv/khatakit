import { createElement } from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  path: string;
  jsonLd?: Record<string, unknown>;
}

const BASE_URL = 'https://khatakit.in';

export function SEO({ title, description, path, jsonLd }: SEOProps) {
  const canonical = BASE_URL + path;

  return createElement(
    Helmet,
    null,
    createElement('title', null, title),
    createElement('meta', { name: 'description', content: description }),
    createElement('link', { rel: 'canonical', href: canonical }),
    createElement('meta', { property: 'og:title', content: title }),
    createElement('meta', { property: 'og:description', content: description }),
    createElement('meta', { property: 'og:url', content: canonical }),
    createElement('meta', { property: 'og:type', content: 'website' }),
    createElement('meta', { property: 'og:site_name', content: 'Khatakit' }),
    createElement('meta', { name: 'twitter:card', content: 'summary_large_image' }),
    createElement('meta', { name: 'twitter:title', content: title }),
    createElement('meta', { name: 'twitter:description', content: description }),
    jsonLd
      ? createElement('script', {
          type: 'application/ld+json',
          dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLd) },
        })
      : null
  );
}
