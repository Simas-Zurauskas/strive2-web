import { Analytics } from '@vercel/analytics/next';
import { Inter, Newsreader } from 'next/font/google';
import Script from 'next/script';
import { NEXT_PUBLIC_GA_MEASUREMENT_ID, NEXT_PUBLIC_GOOGLE_ADS_ID } from '@/conf/env';
import { SITE_URL } from '@/conf/env.server';
import { DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from '@/lib/seo/sharedMetadata';
import Registry from './_registry';
import type { Metadata, Viewport } from 'next';
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Strive — A real AI course on anything you want to learn',
    template: '%s · Strive',
  },
  description:
    'Personal AI-generated courses with live-streaming lessons, module quizzes, and a daily spaced-review queue that fights the three-week forgetting curve. Built around your goal — master a topic, monetize a skill, pass an exam, build a project, or achieve fluency.',
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
  ],
  authors: [{ name: 'Simas Zurauskas' }],
  creator: 'Simas Zurauskas',
  publisher: 'MB Kurybinis kodas',
  category: 'Education Technology',

  alternates: {
    canonical: '/',
  },

  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Strive',
    title: 'Strive — A real AI course on anything you want to learn',
    description:
      'Modules, lessons, quizzes, and daily recall — generated live. Personal AI courses that actually stick.',
    locale: 'en_US',
    images: DEFAULT_OG_IMAGES,
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Strive — A real AI course on anything you want to learn',
    description: 'Modules, lessons, quizzes, and daily recall — generated live.',
    images: DEFAULT_TWITTER_IMAGES,
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

// `viewportFit: 'cover'` opts iOS Safari into using the full screen including
// behind the rounded corners / notch / home-indicator regions, so the layout
// can read `env(safe-area-inset-*)` and decide where to pad. Without this,
// iOS keeps a black "letterbox" around the page and the safe-area envs read
// as `0`. Width + initialScale carry the defaults next-injects so we don't
// regress the responsive baseline.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
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
//
// Consent Mode v2: every storage signal defaults to 'denied' BEFORE the two
// `config` calls. Until the user accepts cookies via the banner, gtag.js
// runs in cookieless / signal-only mode (no ad_storage, no analytics_storage,
// no user-data identifiers). `CookieConsentBootstrap` flips these to
// 'granted' on accept; the same component reverts them on a later "essential
// only" choice. `wait_for_update: 500` gives the bootstrap a tick to read
// localStorage before the first hits go out.
const gtagBootstrap = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
  wait_for_update: 500
});
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
        {!process.env.NEXT_PUBLIC_DEV_MODE && (
          <>
            <script dangerouslySetInnerHTML={{ __html: gtagBootstrap }} />
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${NEXT_PUBLIC_GOOGLE_ADS_ID}`}
              strategy="afterInteractive"
            />
          </>
        )}
      </head>
      <body className={`${inter.variable} ${newsreader.variable}`} suppressHydrationWarning>
        <Analytics />
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <Registry>{children}</Registry>
      </body>
    </html>
  );
}
