import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFab } from '@/components/layout/WhatsAppFab';
import { RevealObserver } from '@/components/ui/RevealObserver';
import { authorisedBrands, contact, site } from '@/data/site';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Waterproofing & Epoxy Flooring Contractors, Chennai`,
    template: `%s | ${site.name}`,
  },
  description: site.shortDescription,
  applicationName: site.name,
  keywords: [
    'waterproofing contractors Chennai',
    'epoxy flooring Chennai',
    'PU flooring',
    'ESD flooring',
    'structural repair',
    'Brickbats Coba',
    'industrial flooring Chengalpattu',
  ],
  authors: [{ name: site.name }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: 'en_IN',
    url: site.url,
    title: `${site.name} | Waterproofing & Epoxy Flooring Contractors, Chennai`,
    description: site.shortDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} | Waterproofing & Epoxy Flooring Contractors, Chennai`,
    description: site.shortDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#f7f7f5',
  colorScheme: 'light',
};

/** Structured data — only facts present in the supplied company material. */
const organisationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  name: site.name,
  url: site.url,
  description: site.shortDescription,
  foundingDate: String(site.foundedYear),
  taxID: site.gstin,
  email: contact.email,
  telephone: contact.phones.map((phone) => phone.tel),
  address: {
    '@type': 'PostalAddress',
    streetAddress: contact.address.lines.slice(0, 2).join(', '),
    addressLocality: contact.address.locality,
    addressRegion: contact.address.region,
    postalCode: contact.address.postalCode,
    addressCountry: contact.address.country,
  },
  areaServed: contact.serviceArea,
  brand: authorisedBrands.map((brand) => ({ '@type': 'Brand', name: brand })),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN" className={inter.variable}>
      <head>
        {/*
          Marks the document as scripted before first paint. Scroll-reveal's
          hidden starting state hangs off this class, so if the bundle fails
          to load the content simply stays visible instead of disappearing.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>
        <a href="#main" className="skipLink">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppFab />
        <RevealObserver />
        <script
          type="application/ld+json"
          // Static, author-controlled data assembled above — no user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationJsonLd) }}
        />
      </body>
    </html>
  );
}
