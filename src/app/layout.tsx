import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Synapse Engineering & Supply — Industrial Automation, Solar ESS & China Sourcing',
  description:
    'Leading engineering solutions provider in Bangladesh for Siemens & Schneider industrial automation, Tier-1 HiTHIUM 11,000-cycle LiFePO₄ solar energy storage, and direct China factory procurement with on-ground inspection.',
  keywords: [
    'Siemens PLC Bangladesh',
    'HiTHIUM Solar Battery',
    'Schneider Contactor',
    'LiFePO4 Energy Storage System',
    'China Machine Sourcing Bangladesh',
    'Industrial Automation Dhaka',
    '6ES7532-5HD00-0AB0',
    'LC1K06105P7',
    'Deye Hybrid Inverter'
  ],
  authors: [{ name: 'Synapse Engineering & Supply' }],
  openGraph: {
    title: 'Synapse Engineering & Supply — Automation, Solar ESS & China Direct Supply',
    description:
      'Direct factory sourcing & engineering supply for Siemens PLCs, HiTHIUM 11,000-cycle LiFePO₄ batteries, and custom China procurement.',
    url: 'https://synapse-engneering.com',
    siteName: 'Synapse Engineering & Supply',
    images: [
      {
        url: 'https://synapse-engneering.com/wp-content/uploads/2026/04/Logo-Synapse-png-e1777269373737.png',
        width: 800,
        height: 600,
        alt: 'Synapse Engineering & Supply',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Synapse Engineering & Supply',
    description: 'Industrial Automation, Solar LiFePO₄ Storage & Direct China Procurement.',
  },
  other: {
    'facebook-domain-verification': 'synapse-verified-2026',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
        {/* Meta Pixel Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1256000382752238');
              fbq('track', 'PageView');
            `,
          }}
        />
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Synapse Engineering & Supply',
              url: 'https://synapse-engneering.com',
              logo: 'https://synapse-engneering.com/wp-content/uploads/2026/04/Logo-Synapse-png-e1777269373737.png',
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+880-1886-113236',
                contactType: 'Customer & Technical Support',
                areaServed: ['BD', 'CN'],
                availableLanguage: ['English', 'Bengali', 'Chinese'],
              },
            }),
          }}
        />
      </head>
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen flex flex-col justify-between selection:bg-sky-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
