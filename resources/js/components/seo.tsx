import { Head } from '@inertiajs/react'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product' | 'event' | 'profile'
  noIndex?: boolean
  children?: React.ReactNode
  // Structured data
  structuredData?: object
}

const defaultMeta = {
  siteName: 'Kwika Events',
  title: 'Kwika Events - Find Perfect Event Service Providers in Malawi',
  description: 'Discover and book top-rated event service providers in Malawi. From photographers and caterers to venues and decorators - find everything you need for your perfect event.',
  keywords: 'events Malawi, wedding services, event planning, photographers Malawi, caterers Lilongwe, venues Blantyre, decorators, DJ services, event rentals, wedding planner Malawi',
  image: '/images/og-image.jpg',
  type: 'website' as const,
}

export function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  noIndex = false,
  children,
  structuredData,
}: SEOProps) {
  const pageTitle = title
    ? `${title} | ${defaultMeta.siteName}`
    : defaultMeta.title

  const pageDescription = description || defaultMeta.description
  const pageKeywords = keywords || defaultMeta.keywords
  const pageImage = image || defaultMeta.image
  const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />

      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      {pageUrl && <meta property="og:url" content={pageUrl} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {children}
    </Head>
  )
}

// Helper functions for structured data
export const createBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
})

export const createServiceSchema = (service: {
  name: string
  description: string
  provider: string
  price?: number
  currency?: string
  image?: string
  rating?: number
  reviewCount?: number
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: service.name,
  description: service.description,
  provider: {
    '@type': 'LocalBusiness',
    name: service.provider,
  },
  ...(service.price && {
    offers: {
      '@type': 'Offer',
      price: service.price,
      priceCurrency: service.currency || 'MWK',
    },
  }),
  ...(service.image && { image: service.image }),
  ...(service.rating && {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: service.rating,
      reviewCount: service.reviewCount || 0,
    },
  }),
})

export const createLocalBusinessSchema = (business: {
  name: string
  description: string
  address: string
  city: string
  phone?: string
  email?: string
  image?: string
  rating?: number
  reviewCount?: number
  priceRange?: string
}) => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: business.name,
  description: business.description,
  address: {
    '@type': 'PostalAddress',
    streetAddress: business.address,
    addressLocality: business.city,
    addressCountry: 'MW',
  },
  ...(business.phone && { telephone: business.phone }),
  ...(business.email && { email: business.email }),
  ...(business.image && { image: business.image }),
  ...(business.rating && {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: business.rating,
      reviewCount: business.reviewCount || 0,
    },
  }),
  ...(business.priceRange && { priceRange: business.priceRange }),
})

export const createEventSchema = (event: {
  name: string
  description: string
  startDate: string
  endDate?: string
  location: string
  city: string
  image?: string
  price?: number
  currency?: string
  organizer?: string
  url?: string
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: event.name,
  description: event.description,
  startDate: event.startDate,
  ...(event.endDate && { endDate: event.endDate }),
  location: {
    '@type': 'Place',
    name: event.location,
    address: {
      '@type': 'PostalAddress',
      addressLocality: event.city,
      addressCountry: 'MW',
    },
  },
  ...(event.image && { image: event.image }),
  ...(event.price && {
    offers: {
      '@type': 'Offer',
      price: event.price,
      priceCurrency: event.currency || 'MWK',
      availability: 'https://schema.org/InStock',
    },
  }),
  ...(event.organizer && {
    organizer: {
      '@type': 'Organization',
      name: event.organizer,
    },
  }),
  ...(event.url && { url: event.url }),
})

export const createProductSchema = (product: {
  name: string
  description: string
  image?: string
  price: number
  currency?: string
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
  brand?: string
  rating?: number
  reviewCount?: number
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  ...(product.image && { image: product.image }),
  ...(product.brand && {
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
  }),
  offers: {
    '@type': 'Offer',
    price: product.price,
    priceCurrency: product.currency || 'MWK',
    availability: `https://schema.org/${product.availability || 'InStock'}`,
  },
  ...(product.rating && {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount || 0,
    },
  }),
})

export const createFAQSchema = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
})
