import { View, StyleSheet } from "react-native";
import { colors, spacing } from "@/design-system";
import { Text } from "./ui/Text";

export function EmptyState({ title, message }: { title: string; message?: string }) {
  return (
    <View style={styles.wrap}>
      <Text variant="h3" style={styles.title}>{title}</Text>
      {message && <Text variant="bodySmall" style={styles.msg}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingVertical: spacing.xxl, alignItems: "center" },
  title: { textAlign: "center", marginBottom: spacing.sm },
  msg: { textAlign: "center" },
});
