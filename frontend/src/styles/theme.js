/**
 * Theme configuration for styled-components
 * Following BEM naming convention for class names
 */
export const theme = {
  colors: {
    // Background colors
    background: {
      primary: '#f2f2f2',
      secondary: '#e6e6e6',
      tertiary: '#f9fafb',
      white: '#ffffff',
      dark: '#010409',
    },
    // Text colors
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      tertiary: '#9ca3af',
      light: '#ffffff',
    },
    // Line icons (SVG stroke via currentColor; size from CSS, viewBox in markup only)
    icon: {
      stroke: '#5B5E55',
      strokeWidth: '2px',
      /** Stats card + header profile: height drives aspect ratio (width: auto) */
      statsSvgHeight: '14px',
      statsSvgMaxWidth: '28px',
      profileSvgHeight: '14px',
    },
    // Focus ring (auth fields: FieldContainer $borderless) — 145° gradient, magenta top-left
    focus: {
      ringGradientStart: '#ce00c2',
      ring: '#5200e7',
      /** 0–100: share of ring color vs transparent (80 ≈ dimmed / softer ring) */
      ringStrengthPercent: 80,
    },
    // Border colors
    border: {
      primary: '#e5e7eb',
      error: '#dc2626',
      warning: '#f59e0b',
      info: '#bae6fd',
    },
    // Status colors
    status: {
      error: '#dc2626',
      errorBg: '#fee2e2',
      errorText: '#991b1b',
      warning: '#f59e0b',
      warningBg: '#fef3c7',
      warningText: '#92400e',
      info: '#3b82f6',
      infoBg: '#f0f9ff',
      infoText: '#0369a1',
      success: '#10b981',
      successBg: '#d1fae5',
      successText: '#065f46',
    },
    // Button colors
    button: {
      primary: '#000000',
      primaryHover: '#1f1f1f',
      secondary: '#ffffff',
      /** MainNavigation Contatos chip; matches app canvas feel (same hex as background.primary) */
      tertiary: '#f2f2f2',
      danger: '#dc2626',
      dangerHover: '#b91c1c',
      disabled: '#9ca3af',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '40px',
    '5xl': '48px',
  },
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '10px',
    xl: '12px',
    '2xl': '16px',
    '3xl': '24px',
    '4xl': '32px',
    '5xl': '40px',
  },
  fontSize: {
    xs: '11px',
    sm: '12px',
    md: '13px',
    base: '14px',
    lg: '15px',
    xl: '16px',
    '2xl': '18px',
    '3xl': '20px',
    '4xl': '24px',
    '5xl': '28px',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  fontFamily: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1280px',
  },
  zIndex: {
    base: 1,
    dropdown: 100,
    modal: 1000,
    toast: 1000,
  },
  transitions: {
    fast: '0.15s',
    normal: '0.2s',
    slow: '0.3s',
  },
};
