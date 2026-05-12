import 'styled-components';
import { colorsLib, ColorsSet, ColorScheme, Breakpoints } from '@/theme';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: ColorsSet;
    colorsLib: typeof colorsLib;
    scheme: ColorScheme;
    bp: Breakpoints;
    media: Record<keyof Breakpoints | 'hover' | 'touch', string>;
  }
}

export {};
