import { SITE_URL } from './site';
import type { Crumb, JsonLd } from './types';

const CONTEXT = 'https://schema.org';

interface Named {
  name: string;
  url: string;
}

export function webApplicationSchema({ name, url, description }: Named & { description: string }): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'WebApplication',
    name,
    description,
    url,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  };
}

export function collectionSchema({ name, url, description, items }: Named & {
  description: string;
  items: Named[];
}): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'CollectionPage',
    name,
    description,
    url,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: item.url,
      })),
    },
  };
}

export function breadcrumbSchema(trail: Crumb[]): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: SITE_URL + crumb.path,
    })),
  };
}
