// ─────────────────────────────────────────────────────
// File:    src/app/layout.tsx
// Agent:   @Frontend_Engineer
// Sprint:  1
// Purpose: Root layout — wraps all pages with font, metadata, and providers.
// ─────────────────────────────────────────────────────
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Jun 3D Studio — Custom 3D Printed Home Decor',
    template: '%s | Jun 3D Studio',
  },
  description:
    'Handcrafted 3D-printed home decor. PLA Matte vases, sculptures, and decorative objects made to order.',
  keywords: ['3D printed', 'home decor', 'vase', 'PLA', 'custom', 'handmade'],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_API_URL || 'https://jun3d-studio.store'
  ),
  openGraph: {
    type: 'website',
    siteName: 'Jun 3D Studio',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Inter font via Google Fonts — subset to Latin for size */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-full">
        {/* Navbar — Sprint 2 */}
        <main className="flex-1">{children}</main>
        {/* Footer — Sprint 2 */}
      </body>
    </html>
  );
}
