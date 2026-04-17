import { Inter, Newsreader } from 'next/font/google';
import Registry from './_registry';
import type { Metadata } from 'next';
import 'katex/dist/katex.min.css';

const inter = Inter({
  variable: '--font-body-sans',
  subsets: ['latin'],
});

const newsreader = Newsreader({
  variable: '--font-heading-serif',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'Strive',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${newsreader.variable}`} suppressHydrationWarning>
        <Registry>{children}</Registry>
      </body>
    </html>
  );
}
