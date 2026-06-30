import type { Metadata } from 'next';
import { Fraunces, Hanken_Grotesk } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BUSINESS, SEO_KEYWORDS, SERVICE_TOWNS } from '@/data/business';

// Display: a soft, optical serif — handcrafted and established.
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
});

// Body: a clean, friendly grotesque — trustworthy without feeling corporate.
const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS.url),
  title: {
    default: `${BUSINESS.name} | Landscaping & Tree Care in ${BUSINESS.address.county}, ${BUSINESS.address.region}`,
    template: `%s | ${BUSINESS.shortName}`,
  },
  description: BUSINESS.description,
  keywords: SEO_KEYWORDS,
  applicationName: BUSINESS.name,
  authors: [{ name: BUSINESS.name }],
  creator: 'Summit Studio',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BUSINESS.url,
    siteName: BUSINESS.name,
    title: `${BUSINESS.name} — ${BUSINESS.tagline}`,
    description: BUSINESS.description,
    images: [{ url: '/images/og.jpg', width: 1200, height: 630, alt: BUSINESS.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: BUSINESS.name,
    description: BUSINESS.description,
    images: ['/images/og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

/** Structured data so search engines understand the local business. */
function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LandscapingBusiness',
    '@id': `${BUSINESS.url}/#business`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    description: BUSINESS.description,
    url: BUSINESS.url,
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    image: `${BUSINESS.url}/images/og.jpg`,
    priceRange: '$$',
    foundingDate: String(BUSINESS.foundedYear),
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.city,
      addressRegion: BUSINESS.address.region,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: BUSINESS.geo.lat, longitude: BUSINESS.geo.lng },
    areaServed: SERVICE_TOWNS.map((t) => ({
      '@type': 'City',
      name: `${t.name}, ${BUSINESS.address.region}`,
    })),
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '08:00', closes: '14:00' },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(BUSINESS.reviews.average),
      reviewCount: String(BUSINESS.reviews.count),
    },
    sameAs: [BUSINESS.social.facebook, BUSINESS.social.instagram],
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${hanken.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
        />
      </body>
    </html>
  );
}
