import { useTheme } from 'next-themes';
import { useLayoutEffect, useState } from 'react';
import { DefaultTheme } from 'styled-components';
import { colorsLib, ColorsSet, themeColors } from '@/theme';

const getComputedCSSColors = (): ColorsSet => {
  if (typeof window === 'undefined') {
    return themeColors.light;
  }

  const computedStyle = getComputedStyle(document.documentElement);

  return {
    background: computedStyle.getPropertyValue('--background').trim(),
    foreground: computedStyle.getPropertyValue('--foreground').trim(),
    muted: computedStyle.getPropertyValue('--muted').trim(),
    border: computedStyle.getPropertyValue('--border').trim(),
    surface: computedStyle.getPropertyValue('--surface').trim(),
    surfaceBorder: computedStyle.getPropertyValue('--surface-border').trim(),
    accent: computedStyle.getPropertyValue('--accent').trim(),
    accentHover: computedStyle.getPropertyValue('--accent-hover').trim(),
    success: computedStyle.getPropertyValue('--success').trim(),
    warning: computedStyle.getPropertyValue('--warning').trim(),
    error: computedStyle.getPropertyValue('--error').trim(),
  };
};

export const useAppTheme = (): DefaultTheme & { hexColors: ColorsSet } => {
  const { resolvedTheme } = useTheme();
  const [hexColors, setHexColors] = useState(() => getComputedCSSColors());
  const activeScheme = (resolvedTheme || 'light') as 'light' | 'dark';

  useLayoutEffect(() => {
    const updateColors = () => {
      setHexColors(getComputedCSSColors());
    };

    updateColors();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((el) => {
        if (el.attributeName === 'data-theme') {
          updateColors();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, [resolvedTheme]);

  return {
    colors: {
      background: 'var(--background)',
      foreground: 'var(--foreground)',
      muted: 'var(--muted)',
      border: 'var(--border)',
      surface: 'var(--surface)',
      surfaceBorder: 'var(--surface-border)',
      accent: 'var(--accent)',
      accentHover: 'var(--accent-hover)',
      success: 'var(--success)',
      warning: 'var(--warning)',
      error: 'var(--error)',
    },
    colorsLib,
    scheme: activeScheme,
    hexColors, // For debugging/display only
  };
};
