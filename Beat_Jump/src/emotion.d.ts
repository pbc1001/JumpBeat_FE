import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      primary: string;
      primaryOn: string;
      ink: string;
      body: string;
      charcoal: string;
      mute: string;
      ash: string;
      stone: string;
      canvas: string;
      surfaceCard: string;
      surfaceElevated: string;
      surfaceDeep: string;
      surfaceLight: string;
      hairline: string;
      hairlineStrong: string;
      dividerSoft: string;
      accentSparklingBlue: string;
      accentSparklingBlueGlow: string;
      accentSky: string;
      accentCyan: string;
      accentMint: string;
      link: string;
    };
    typography: {
      displayXxl: { fontSize: string; fontWeight: number; lineHeight: number; letterSpacing: string };
      displayXl: { fontSize: string; fontWeight: number; lineHeight: number; letterSpacing: string };
      headingMd: { fontSize: string; fontWeight: number; lineHeight: number; letterSpacing: string };
      headingSm: { fontSize: string; fontWeight: number; lineHeight: number; letterSpacing: string };
      bodyLg: { fontSize: string; fontWeight: number; lineHeight: number };
      bodyMd: { fontSize: string; fontWeight: number; lineHeight: number; letterSpacing: string };
      bodySm: { fontSize: string; fontWeight: number; lineHeight: number };
      buttonMd: { fontSize: string; fontWeight: number; lineHeight: number };
      buttonSm: { fontSize: string; fontWeight: number; lineHeight: number; letterSpacing: string };
      codeMd: { fontSize: string; fontWeight: number; lineHeight: number };
    };
    radii: {
      none: string;
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      full: string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
      section: string;
    };
  }
}