import { View, StyleSheet } from "react-native";
import { colors, radius } from "@/design-system";
import { Text } from "./ui/Text";

export function UsageBar({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number | "unlimited";
}) {
  const pct = limit === "unlimited" ? 0 : Math.min(100, Math.round((used / limit) * 100));
  const atLimit = limit !== "unlimited" && used >= limit;
  const color = atLimit ? colors.error : pct >= 80 ? colors.warning : colors.primary;

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text variant="bodySmall">{label}</Text>
        <Text variant="label" color={atLimit ? colors.error : colors.text}>
          {limit === "unlimited" ? `${used} · Unlimited` : `${used}/${limit}`}
        </Text>
      </View>
      {limit !== "unlimited" && (
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  track: {
    height: 6,
    backgroundColor: colors.borderLight,
    borderRadius: radius.sm,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: radius.sm },
});
