import { Inter, Newsreader } from 'next/font/google';
import { NEXT_PUBLIC_SITE_URL } from '@/conf/env';
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
  metadataBase: new URL(NEXT_PUBLIC_SITE_URL),
  title: 'Strive',
};

// Runs before next-themes' own inline script: promotes a per-session theme
// override into the localStorage key next-themes reads, or clears it so the
// provider falls back to system. Keeps sessionStorage as the source of truth
// for in-session persistence while letting fresh sessions follow the OS.
const themeBootstrap = `(function(){try{var s=sessionStorage.getItem('theme');if(s==='light'||s==='dark'){localStorage.setItem('theme',s);}else{localStorage.removeItem('theme');}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className={`${inter.variable} ${newsreader.variable}`} suppressHydrationWarning>
        <Registry>{children}</Registry>
      </body>
    </html>
  );
}
