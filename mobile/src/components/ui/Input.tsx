import { TextInput, StyleSheet, type TextInputProps } from "react-native";
import { colors, radius, spacing, typography } from "@/design-system";

export function Input(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.textSubtle}
      style={[styles.input, props.style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.md,
    color: colors.text,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 48,
  },
});
