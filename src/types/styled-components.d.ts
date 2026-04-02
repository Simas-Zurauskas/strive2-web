import 'styled-components';
import { colorsLib, ColorsSet, ColorScheme } from '@/theme';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: ColorsSet;
    colorsLib: typeof colorsLib;
    scheme: ColorScheme;
  }
}

export {};
