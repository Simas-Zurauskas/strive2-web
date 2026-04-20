'use client';

import { useTheme } from 'next-themes';
import { Toaster } from 'sonner';
import { ToasterGlobalStyle } from './AppToaster.styles';

export const AppToaster = () => {
  const { resolvedTheme } = useTheme();

  return (
    <>
      <ToasterGlobalStyle />
      <Toaster
        position="bottom-right"
        theme={(resolvedTheme as 'light' | 'dark') ?? 'light'}
        richColors
        expand
        visibleToasts={10}
        duration={4500}
        gap={10}
        offset={20}
      />
    </>
  );
};
