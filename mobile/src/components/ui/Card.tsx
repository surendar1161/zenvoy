import { View, StyleSheet, type ViewProps } from "react-native";
import { colors, radius, shadows, spacing } from "@/design-system";

interface CardProps extends ViewProps {
  padded?: boolean;
}

export function Card({ children, style, padded = true, ...props }: CardProps) {
  return (
    <View style={[styles.card, padded && styles.padded, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  padded: {
    padding: spacing.lg,
  },
});
