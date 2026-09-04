import {
  Pressable,
  Text,
  ActivityIndicator,
  type PressableProps,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import { colors, radius, spacing, typography } from "@/design-system";

interface ButtonProps extends Omit<PressableProps, "style"> {
  title: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
  size?: "md" | "lg";
  style?: ViewStyle;
}

export function Button({
  title,
  variant = "primary",
  loading,
  disabled,
  size = "md",
  style,
  ...props
}: ButtonProps) {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isDanger = variant === "danger";

  return (
    <Pressable
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        size === "lg" && styles.lg,
        isPrimary && styles.primary,
        isSecondary && styles.secondary,
        variant === "ghost" && styles.ghost,
        isDanger && styles.danger,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary || isDanger ? colors.white : colors.primary} />
      ) : (
        <Text
          style={[
            styles.text,
            isPrimary || isDanger ? styles.textOnPrimary : isSecondary ? styles.textSecondary : styles.textGhost,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  lg: {
    minHeight: 52,
    paddingVertical: spacing.lg,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  danger: {
    backgroundColor: colors.error,
  },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.88 },
  text: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.md,
  },
  textOnPrimary: { color: colors.white },
  textSecondary: { color: colors.text },
  textGhost: { color: colors.primary },
});
