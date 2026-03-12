import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Rival RV - The Fair RV Rental Marketplace',
  description:
    'Rent RVs with only 5% fees instead of 25%. Rival RV is the fair marketplace for RV rentals with $1M insurance, verified listings, and 48-hour host payouts.',
  keywords: [
    'RV rental',
    'motorhome rental',
    'campervan rental',
    'RV marketplace',
    'low fee RV rental',
    'cheap RV rental',
    'RV hire',
  ],
  openGraph: {
    title: 'Rival RV - The Fair RV Rental Marketplace',
    description:
      'Rent RVs with only 5% fees instead of 25%. The fair marketplace for RV owners and travelers.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
