/**
 * DealPilot Design System Tokens
 * 
 * Centralized design system with standardized values for:
 * - Colors
 * - Spacing
 * - Border Radius
 * - Typography
 * - Shadows
 * - Component Sizes
 * 
 * Usage:
 * import { DESIGN_TOKENS } from '@/lib/design-tokens';
 * 
 * style={{ borderRadius: DESIGN_TOKENS.borderRadius.md }}
 */

export const DESIGN_TOKENS = {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // COLORS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  colors: {
    // Primary
    primary: '#0ea5e9',
    primaryDark: '#0369a1',
    primaryLight: '#38bdf8',
    primaryPale: '#e0f2fe',
    
    // Success
    success: '#10b981',
    successDark: '#059669',
    successLight: '#34d399',
    successPale: '#d1fae5',
    
    // Warning
    warning: '#f59e0b',
    warningDark: '#d97706',
    warningLight: '#fbbf24',
    warningPale: '#fef3c7',
    
    // Danger
    danger: '#ef4444',
    dangerDark: '#dc2626',
    dangerLight: '#f87171',
    dangerPale: '#fee2e2',
    
    // Info
    info: '#3b82f6',
    infoDark: '#2563eb',
    infoLight: '#60a5fa',
    infoPale: '#dbeafe',
    
    // Purple (for special features)
    purple: '#7c3aed',
    purpleDark: '#6d28d9',
    purpleLight: '#8b5cf6',
    purplePale: '#ede9fe',
    
    // Gray Scale
    gray: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    
    // Semantic Colors
    background: '#ffffff',
    backgroundSecondary: '#f8fafc',
    backgroundTertiary: '#f1f5f9',
    
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
      tertiary: '#94a3b8',
      disabled: '#cbd5e1',
      inverse: '#ffffff',
    },
    
    border: {
      default: '#e2e8f0',
      light: '#f1f5f9',
      medium: '#cbd5e1',
      dark: '#94a3b8',
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SPACING
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // BORDER RADIUS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  borderRadius: {
    none: 0,
    sm: 8,
    md: 12,
    lg: 16,
    full: 9999,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // BORDERS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  border: {
    width: {
      thin: '1px',
      medium: '1.5px',
      thick: '2px',
    },
    style: 'solid',
    color: '#e2e8f0', // maps to colors.border.default
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TYPOGRAPHY
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  typography: {
    fontFamily: {
      base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", "Courier New", monospace',
    },
    
    fontSize: {
      xs: 11,
      sm: 12,
      base: 14,
      md: 15,
      lg: 16,
      xl: 18,
      xxl: 20,
      xxxl: 24,
      display: 32,
    },
    
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    
    lineHeight: {
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SHADOWS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  shadow: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    xxl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // COMPONENT SIZES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  components: {
    // Button
    button: {
      height: {
        small: 32,
        medium: 40,
        large: 48,
        xlarge: 56,
      },
      padding: {
        small: '0 12px',
        medium: '0 16px',
        large: '0 24px',
        xlarge: '0 32px',
      },
      fontSize: {
        small: 13,
        medium: 14,
        large: 16,
        xlarge: 16,
      },
      borderRadius: {
        small: 8,
        medium: 10,
        large: 12,
        xlarge: 12,
      },
    },
    
    // Input
    input: {
      height: {
        small: 32,
        medium: 40,
        large: 48,
      },
      padding: {
        small: '4px 11px',
        medium: '7px 11px',
        large: '11px 11px',
      },
      fontSize: {
        small: 13,
        medium: 14,
        large: 16,
      },
      borderRadius: 8,
    },
    
    // Card
    card: {
      padding: {
        small: 16,
        medium: 24,
        large: 32,
      },
      borderRadius: {
        small: 12,
        medium: 16,
        large: 20,
      },
      border: '1px solid #e2e8f0',
    },
    
    // Modal
    modal: {
      borderRadius: 16,
      padding: 24,
    },
    
    // Tag
    tag: {
      height: {
        small: 20,
        medium: 24,
        large: 28,
      },
      padding: {
        small: '0 8px',
        medium: '2px 10px',
        large: '4px 12px',
      },
      fontSize: {
        small: 11,
        medium: 12,
        large: 13,
      },
      borderRadius: {
        small: 10,
        medium: 12,
        large: 14,
      },
    },
    
    // Avatar
    avatar: {
      size: {
        small: 32,
        medium: 40,
        large: 48,
        xlarge: 64,
      },
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Z-INDEX SCALE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TRANSITIONS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  transition: {
    duration: {
      fast: '150ms',
      base: '200ms',
      slow: '300ms',
      slower: '500ms',
    },
    timing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      linear: 'linear',
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // BREAKPOINTS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  breakpoints: {
    xs: 480,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600,
  },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UTILITY FUNCTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Get a standardized border style
 * @param width - Border width (thin, medium, thick)
 * @param color - Optional custom color (defaults to standard border color)
 */
export function border(
  width: keyof typeof DESIGN_TOKENS.border.width = 'thin',
  color?: string
): string {
  const w = DESIGN_TOKENS.border.width[width];
  const c = color || DESIGN_TOKENS.border.color;
  return `${w} ${DESIGN_TOKENS.border.style} ${c}`;
}

/**
 * Get a standardized box shadow
 * @param size - Shadow size (sm, base, md, lg, xl, xxl)
 */
export function shadow(size: keyof typeof DESIGN_TOKENS.shadow = 'base'): string {
  return DESIGN_TOKENS.shadow[size];
}

/**
 * Get a standardized transition
 * @param property - CSS property to transition
 * @param duration - Duration (fast, base, slow, slower)
 * @param timing - Timing function (ease, easeIn, easeOut, easeInOut, linear)
 */
export function transition(
  property: string = 'all',
  duration: keyof typeof DESIGN_TOKENS.transition.duration = 'base',
  timing: keyof typeof DESIGN_TOKENS.transition.timing = 'easeInOut'
): string {
  return `${property} ${DESIGN_TOKENS.transition.duration[duration]} ${DESIGN_TOKENS.transition.timing[timing]}`;
}

/**
 * Get spacing value in pixels
 * @param size - Spacing size (xs, sm, md, lg, xl, xxl, xxxl)
 */
export function spacing(size: keyof typeof DESIGN_TOKENS.spacing): number {
  return DESIGN_TOKENS.spacing[size];
}

/**
 * Get border radius in pixels
 * @param size - Border radius size (none, sm, md, lg, full)
 */
export function borderRadius(size: keyof typeof DESIGN_TOKENS.borderRadius): number {
  return DESIGN_TOKENS.borderRadius[size];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPE EXPORTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type DesignTokens = typeof DESIGN_TOKENS;
export type SpacingSize = keyof typeof DESIGN_TOKENS.spacing;
export type BorderRadiusSize = keyof typeof DESIGN_TOKENS.borderRadius;
export type ShadowSize = keyof typeof DESIGN_TOKENS.shadow;
export type ButtonSize = keyof typeof DESIGN_TOKENS.components.button.height;
export type InputSize = keyof typeof DESIGN_TOKENS.components.input.height;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXPORT DEFAULT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default DESIGN_TOKENS;
