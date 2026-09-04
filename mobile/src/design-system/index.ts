/**
 * DealPilot mobile design system — mirrors web `lib/theme.ts` tokens.
 * Export from `@/design-system` or `mobile/src/sdk` for white-label SDK builds.
 */
export const colors = {
  primary: "#0ea5e9",
  primaryDark: "#0369a1",
  primaryLight: "#7dd3fc",
  primaryBg: "#eff6ff",

  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",

  text: "#0f172a",
  textSecondary: "#334155",
  textMuted: "#64748b",
  textSubtle: "#94a3b8",

  background: "#f8fafc",
  surface: "#ffffff",
  border: "#e2e8f0",
  borderLight: "#f1f5f9",

  white: "#ffffff",
  black: "#000000",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  section: 40,
} as const;

export const radius = {
  sm: 8,
  md: 10,
  lg: 14,
  xl: 16,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
} as const;

export const typography = {
  fontFamily: {
    regular: "Inter_400Regular",
    medium: "Inter_500Medium",
    semibold: "Inter_600SemiBold",
    bold: "Inter_700Bold",
    extrabold: "Inter_800ExtraBold",
  },
  size: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    hero: 32,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.65,
  },
} as const;

/** Semantic text styles for consistent UI copy */
export const textStyles = {
  hero: {
    fontFamily: typography.fontFamily.extrabold,
    fontSize: typography.size.hero,
    lineHeight: typography.size.hero * typography.lineHeight.tight,
    color: colors.text,
  },
  h1: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xxl,
    lineHeight: typography.size.xxl * typography.lineHeight.tight,
    color: colors.text,
  },
  h2: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xl,
    lineHeight: typography.size.xl * typography.lineHeight.tight,
    color: colors.text,
  },
  h3: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.lg,
    lineHeight: typography.size.lg * typography.lineHeight.normal,
    color: colors.text,
  },
  body: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.md,
    lineHeight: typography.size.md * typography.lineHeight.relaxed,
    color: colors.textSecondary,
  },
  bodySmall: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    lineHeight: typography.size.sm * typography.lineHeight.normal,
    color: colors.textMuted,
  },
  caption: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
    lineHeight: typography.size.xs * typography.lineHeight.normal,
    color: colors.textSubtle,
  },
  label: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.sm,
    lineHeight: typography.size.sm * typography.lineHeight.normal,
    color: colors.text,
  },
  button: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.md,
    lineHeight: typography.size.md * typography.lineHeight.tight,
    color: colors.white,
  },
  link: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.sm,
    color: colors.primary,
  },
} as const;

export const theme = { colors, spacing, radius, shadows, typography, textStyles };

export type Theme = typeof theme;
export type Colors = typeof colors;
