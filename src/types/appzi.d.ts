// Appzi feedback widget — script tag loaded in app/(protected)/layout.tsx
// (lazyOnload), so it never ships to anonymous landing/auth/public visitors.
// The auto-injected floating button is suppressed by a CSS rule in
// theme/GlobalStyles.tsx; the Navbar Feedback button is the sole trigger
// and uses `window.appzi.openWidget(buttonId)`. Surfaces a minimal global
// so the navbar trigger is null-safe before the script has loaded.
declare global {
  interface Window {
    appzi?: {
      openWidget?: (buttonId?: string) => void;
    };
  }
}

export {};
