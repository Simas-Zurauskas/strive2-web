import { Inter, Newsreader } from 'next/font/google';
import Script from 'next/script';
import { NEXT_PUBLIC_GA_MEASUREMENT_ID, NEXT_PUBLIC_GOOGLE_ADS_ID, NEXT_PUBLIC_SITE_URL } from '@/conf/env';
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
  title: {
    default: 'Strive — A real AI course on anything you want to learn',
    template: '%s · Strive',
  },
  description:
    'Personal AI-generated courses with live-streaming lessons, module quizzes, and a daily spaced-review queue that fights the three-week forgetting curve. Built around your goal — master a topic, monetize a skill, pass an exam, build a project, or achieve fluency. Powered by Claude.',
  applicationName: 'Strive',
  keywords: [
    'AI learning platform',
    'personalized AI courses',
    'AI tutor',
    'spaced repetition',
    'recall practice',
    'live-streaming lessons',
    'module quizzes',
    'self-directed learning',
    'adaptive learning',
    'course generator',
    'Anthropic Claude',
  ],
  authors: [{ name: 'Sima Zurauskas' }],
  creator: 'Sima Zurauskas',
  publisher: 'MB Kurybinis kodas',
  category: 'Education Technology',

  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',

  openGraph: {
    type: 'website',
    url: NEXT_PUBLIC_SITE_URL,
    siteName: 'Strive',
    title: 'Strive — A real AI course on anything you want to learn',
    description:
      'Modules, lessons, quizzes, and daily recall — generated live, powered by Claude. Personal AI courses that actually stick.',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Strive — personal AI-built courses with live-streaming lessons and daily recall',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Strive — A real AI course on anything you want to learn',
    description: 'Modules, lessons, quizzes, and daily recall — generated live, powered by Claude.',
    images: ['/og-image.png'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
};

// Runs before next-themes' own inline script: promotes a per-session theme
// override into the localStorage key next-themes reads, or clears it so the
// provider falls back to system. Keeps sessionStorage as the source of truth
// for in-session persistence while letting fresh sessions follow the OS.
const themeBootstrap = `(function(){try{var s=sessionStorage.getItem('theme');if(s==='light'||s==='dark'){localStorage.setItem('theme',s);}else{localStorage.removeItem('theme');}}catch(e){}})();`;

// Defines window.gtag and dataLayer synchronously so GAPageviewListener can
// fire from useEffect without racing the async gtag.js load. Auto pageviews
// are disabled (send_page_view: false) — the listener emits all page_view
// events including the initial one to avoid double-counting.
const gtagBootstrap = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${NEXT_PUBLIC_GOOGLE_ADS_ID}', { send_page_view: false });
gtag('config', '${NEXT_PUBLIC_GA_MEASUREMENT_ID}', { send_page_view: false });
`.trim();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <meta name="apple-mobile-web-app-title" content="Strive" />
        <script dangerouslySetInnerHTML={{ __html: gtagBootstrap }} />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${NEXT_PUBLIC_GOOGLE_ADS_ID}`}
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.variable} ${newsreader.variable}`} suppressHydrationWarning>
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <Registry>{children}</Registry>
      </body>
    </html>
  );
}
