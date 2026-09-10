import React, { useEffect } from 'react';
import { Article, BreadcrumbItem, Product } from '../../types';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath: string;
  ogImage?: string;
  ogType?: 'website' | 'product' | 'article';
  product?: Product;
  article?: Article;
  breadcrumbs?: BreadcrumbItem[];
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalPath,
  ogImage = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
  ogType = 'website',
  product,
  article,
  breadcrumbs,
}) => {
  useEffect(() => {
    // 1. Update Document Title
    const siteName = 'VERVE Modern Goods';
    document.title = title.includes(siteName) ? title : `${title} | ${siteName}`;

    // 2. Helper to set or update meta tag
    const setMetaTag = (selector: string, attr: string, value: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        const [key, val] = selector.replace(/[\[\]']/g, '').split('=');
        element.setAttribute(key, val);
        document.head.appendChild(element);
      }
      element.setAttribute(attr, value);
    };

    // 3. Update Standard Meta
    setMetaTag("meta[name='description']", 'content', description);

    // 4. Update Canonical
    const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${canonicalPath}` : canonicalPath;
    let canonicalLink = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullUrl);

    // 5. Update OpenGraph & Twitter tags
    setMetaTag("meta[property='og:title']", 'content', title);
    setMetaTag("meta[property='og:description']", 'content', description);
    setMetaTag("meta[property='og:url']", 'content', fullUrl);
    setMetaTag("meta[property='og:image']", 'content', ogImage);
    setMetaTag("meta[property='og:type']", 'content', ogType);
    setMetaTag("meta[name='twitter:card']", 'content', 'summary_large_image');
    setMetaTag("meta[name='twitter:title']", 'content', title);
    setMetaTag("meta[name='twitter:description']", 'content', description);
    setMetaTag("meta[name='twitter:image']", 'content', ogImage);

    // 6. Generate and Inject JSON-LD Schema
    const existingSchema = document.getElementById('seo-json-ld');
    if (existingSchema) {
      existingSchema.remove();
    }

    const schemas: Record<string, unknown>[] = [];

    // Organization Schema (Baseline)
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'VERVE Modern Goods',
      url: typeof window !== 'undefined' ? window.location.origin : 'https://vervegoods.com',
      logo: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=300&auto=format&fit=crop',
      sameAs: ['https://instagram.com', 'https://twitter.com', 'https://pinterest.com'],
    });

    // WebSite Searchbox Schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url: typeof window !== 'undefined' ? window.location.origin : 'https://vervegoods.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${typeof window !== 'undefined' ? window.location.origin : ''}/shop?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    });

    // Breadcrumb Schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: crumb.label,
          item: crumb.path ? `${typeof window !== 'undefined' ? window.location.origin : ''}${crumb.path}` : undefined,
        })),
      });
    }

    // Product Schema
    if (product) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.images,
        description: product.description,
        sku: product.sku,
        mpn: product.id,
        brand: {
          '@type': 'Brand',
          name: 'VERVE',
        },
        offers: {
          '@type': 'Offer',
          url: fullUrl,
          priceCurrency: product.currency,
          price: product.price,
          priceValidUntil: '2027-12-31',
          itemCondition: 'https://schema.org/NewCondition',
          availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          seller: {
            '@type': 'Organization',
            name: 'VERVE Modern Goods',
          },
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
        },
      });
    }

    // Article Schema
    if (article) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        image: [article.coverImage],
        datePublished: '2026-01-15T08:00:00+08:00',
        dateModified: '2026-02-26T09:20:00+08:00',
        author: {
          '@type': 'Person',
          name: article.author.name,
          jobTitle: article.author.role,
        },
        publisher: {
          '@type': 'Organization',
          name: 'VERVE Modern Goods',
          logo: {
            '@type': 'ImageObject',
            url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=300&auto=format&fit=crop',
          },
        },
        description: article.excerpt,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': fullUrl,
        },
      });
    }

    const script = document.createElement('script');
    script.id = 'seo-json-ld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schemas);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('seo-json-ld');
      if (el) el.remove();
    };
  }, [title, description, canonicalPath, ogImage, ogType, product, article, breadcrumbs]);

  return null;
};
