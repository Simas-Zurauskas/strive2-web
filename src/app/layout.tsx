import { Geist, Playfair_Display } from 'next/font/google';
import Registry from './_registry';
import type { Metadata } from 'next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-heading-serif',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Strive',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${playfair.variable}`} suppressHydrationWarning>
        <Registry>{children}</Registry>
      </body>
    </html>
  );
}
