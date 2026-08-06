import { Analytics } from '@vercel/analytics/next';
import { Inter, Newsreader } from 'next/font/google';
import Script from 'next/script';
import {
  NEXT_PUBLIC_GA_MEASUREMENT_ID,
  NEXT_PUBLIC_GOOGLE_ADS_ID,
  NEXT_PUBLIC_GTM_ID,
  NEXT_PUBLIC_META_PIXEL_ID,
} from '@/conf/env';
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
    site: '@strivelearnhq',
    creator: '@strivelearnhq',
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

  // Meta (Facebook) domain verification for strive-learning.com. Deliberately
  // NOT gated behind NEXT_PUBLIC_DEV_MODE like the pixel: this is an inert
  // meta tag with no network call or tracking behaviour, and Meta re-checks it
  // periodically — a gate that silently dropped it would un-verify the domain
  // and, with it, Aggregated Event Measurement. Public by design; it is only
  // meaningful to a crawler that already fetched the page.
  verification: {
    other: {
      'facebook-domain-verification': 'b68ibavecuu466t3za6zpwz1sjonjt',
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
// Consent Mode v2 in opt-out mode: every storage signal defaults to
// 'granted' so gtag.js logs from the very first hit without waiting on the
// banner. `CookieConsentBootstrap` reverts these to 'denied' only if the
// user explicitly chooses "essential only".
//
// The loader below is parameterised with the Ads ID, which is deliberate and
// load-bearing: `gtag/js?id=G-PZ050XVB80` 404s, because a GA4 measurement ID
// is a *destination* of a tag rather than a loadable tag in its own right.
// Both IDs are registered as destinations via the two `config` calls, but an
// event only reaches both if it names them — see the `send_to` note in
// `lib/gtag.ts`.
const gtagBootstrap = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted',
  functionality_storage: 'granted',
  security_storage: 'granted'
});
gtag('js', new Date());
gtag('config', '${NEXT_PUBLIC_GOOGLE_ADS_ID}', { send_page_view: false });
gtag('config', '${NEXT_PUBLIC_GA_MEASUREMENT_ID}', { send_page_view: false });
`.trim();

// Meta Pixel base snippet. Two deliberate deviations from the copy-paste
// version Meta hands out:
//
//   1. `fbq('consent', 'revoke')` before `init`. Meta's default is granted;
//      revoking first means the pixel queues rather than sends until
//      `CookieConsentBootstrap` grants it. Unlike gtag's Consent Mode there
//      is no cookieless middle ground here — it is send or don't.
//   2. No `fbq('track', 'PageView')`. The base snippet fires one on load,
//      but `GAPageviewListener` already owns SPA route changes and fires the
//      initial one too; leaving Meta's in would double-count the landing page.
const metaPixelBootstrap = `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('consent', 'revoke');
fbq('init', '${NEXT_PUBLIC_META_PIXEL_ID}');
`.trim();

// Standard GTM container loader. Must be emitted *after* `gtagBootstrap`:
// gtm.js snapshots the consent state already pushed onto dataLayer, so the
// `gtag('consent', 'default', …)` call has to land first or every GTM-fired
// tag would start under Consent Mode's built-in denied default. The container
// loads alongside the direct gtag.js tag above, which stays the owner of the
// AW-/G- `config` calls — a tag inside GTM re-configuring those IDs would
// double-fire events.
const gtmBootstrap = `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${NEXT_PUBLIC_GTM_ID}');
`.trim();

const gtmEnabled = !process.env.NEXT_PUBLIC_DEV_MODE && NEXT_PUBLIC_GTM_ID !== '';

// Prod-only, and only once an ID is configured. Same gate as the gtag block
// so a local or preview build can never write into the live dataset.
const metaPixelEnabled = !process.env.NEXT_PUBLIC_DEV_MODE && NEXT_PUBLIC_META_PIXEL_ID !== '';

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
        {gtmEnabled && <script dangerouslySetInnerHTML={{ __html: gtmBootstrap }} />}
        {metaPixelEnabled && (
          <script dangerouslySetInnerHTML={{ __html: metaPixelBootstrap }} />
        )}
      </head>
      <body className={`${inter.variable} ${newsreader.variable}`} suppressHydrationWarning>
        {gtmEnabled && (
          <noscript>
            {/* GTM's install contract: raw iframe immediately after the
                opening <body> tag. Only fires for JS-disabled visitors. */}
            <iframe
              title="Google Tag Manager"
              src={`https://www.googletagmanager.com/ns.html?id=${NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        {metaPixelEnabled && (
          <noscript>
            {/* Must stay a raw <img>: next/image would optimize and proxy the
                URL, and this is a 1×1 tracking beacon that has to reach
                facebook.com verbatim. Only fires for JS-disabled visitors,
                so there is no LCP cost to trade off. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              alt=""
              src={`https://www.facebook.com/tr?id=${NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`}
            />
          </noscript>
        )}
        <Analytics />
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <Registry>{children}</Registry>
      </body>
    </html>
  );
}
