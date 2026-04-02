import { useServerInsertedHTML } from 'next/navigation';
import { useTheme } from 'next-themes';
import React, { useState, useEffect } from 'react';
import { DefaultTheme, ServerStyleSheet, StyleSheetManager, ThemeProvider } from 'styled-components';
import { colorsLib, GlobalStyles, colors } from '@/theme';

interface StyledRegistryProps {
  children: React.ReactNode;
}

export const StyledRegistry: React.FC<StyledRegistryProps> = ({ children }) => {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
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
  };

  if (typeof window !== 'undefined') {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    );
  }

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </StyleSheetManager>
  );
};
