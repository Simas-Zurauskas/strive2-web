import { useServerInsertedHTML } from 'next/navigation';
import { useTheme } from 'next-themes';
import React, { useState, useEffect } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { DefaultTheme, ServerStyleSheet, StyleSheetManager, ThemeProvider } from 'styled-components';
import { colorsLib, GlobalStyles, colors, breakpoints, media } from '@/theme';

interface StyledRegistryProps {
  children: React.ReactNode;
}

export const StyledRegistry: React.FC<StyledRegistryProps> = ({ children }) => {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect -- hydration detection
  }, []);

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  const activeScheme = (mounted ? resolvedTheme : 'light') as 'light' | 'dark';

  const theme: DefaultTheme = {
    colors,
    colorsLib,
    scheme: activeScheme,
    bp: breakpoints,
    media,
  };

  const skeletonBase = activeScheme === 'dark' ? colorsLib.gray800 : colorsLib.gray100;
  const skeletonHighlight = activeScheme === 'dark' ? colorsLib.gray700 : colorsLib.gray200;

  const inner = (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <SkeletonTheme baseColor={skeletonBase} highlightColor={skeletonHighlight}>
        {children}
      </SkeletonTheme>
    </ThemeProvider>
  );

  if (typeof window !== 'undefined') {
    return inner;
  }

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {inner}
    </StyleSheetManager>
  );
};
