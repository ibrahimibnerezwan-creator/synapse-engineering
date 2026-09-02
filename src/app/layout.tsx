import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'Synapse Engineering & Supply — Industrial Automation, Solar ESS & China Sourcing',
  description:
    'Tier-1 engineering supply in Bangladesh: Siemens S7 PLCs, Schneider contactors, HiTHIUM 11,000-cycle LiFePO₄ battery systems, and on-ground China factory procurement with full QC.',
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Instrument+Serif:ital@0;1&family=Noto+Sans+Bengali:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#16120f" />
      </head>
      <body className="grain min-h-screen flex flex-col antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}

        <Script
          id="fb-pixel"
          strategy="afterInteractive"
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
      </body>
    </html>
  );
}
