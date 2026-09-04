import { View, Text, StyleSheet } from "react-native";
import { colors, radius, spacing, typography } from "@/design-system";

export function Badge({ label, color = colors.primary }: { label: string; color?: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: `${color}18`, borderColor: `${color}40` }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  text: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.xs,
    textTransform: "capitalize",
  },
});
