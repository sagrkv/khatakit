import { LOGO_URL, PUBLISHER, REPO_URL, SITE_NAME, SITE_URL } from './site';
import type { Crumb, Faq, JsonLd } from './types';

const CONTEXT = 'https://schema.org';

interface Named {
  name: string;
  url: string;
}

const publisher = { '@type': 'Organization', name: PUBLISHER.name, url: PUBLISHER.url };

/** Khatakit itself, part of filtercoffee.dev. */
export function organizationSchema(): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'Organization',
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: LOGO_URL,
    sameAs: [REPO_URL],
    parentOrganization: publisher,
  };
}

export function webSiteSchema(): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'WebSite',
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    inLanguage: 'en-IN',
    publisher,
  };
}

export function webApplicationSchema({
  name,
  url,
  description,
  dateModified,
}: Named & { description: string; dateModified: string }): JsonLd {
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
    dateModified,
    publisher,
    creator: publisher,
  };
}

export function faqSchema(faq: Faq[]): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'FAQPage',
    mainEntity: faq.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
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
