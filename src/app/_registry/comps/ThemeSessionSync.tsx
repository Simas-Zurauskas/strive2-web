'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';

/**
 * Mirrors next-themes state into sessionStorage so a user-chosen theme
 * survives new tabs and reloads within the session but dies with it —
 * fresh sessions then follow the OS preference via defaultTheme="system".
 * The <head> bootstrap script in app/layout.tsx reads this back on load.
 */
export const ThemeSessionSync = () => {
  const { theme } = useTheme();

  useEffect(() => {
    if (!theme) return;
    try {
      if (theme === 'light' || theme === 'dark') {
        sessionStorage.setItem('theme', theme);
      } else {
        sessionStorage.removeItem('theme');
      }
    } catch {
      // sessionStorage unavailable (private mode, etc.) — silently skip
    }
  }, [theme]);

  return null;
};
