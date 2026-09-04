import { FlatList, Pressable, View, StyleSheet, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { colors, spacing } from "@/design-system";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import { PROPOSAL_STATUS_COLORS, type ProposalRow } from "@/types";

export function ProposalList({
  data,
  loading,
  onPress,
}: {
  data: ProposalRow[];
  loading?: boolean;
  onPress?: (id: string) => void;
}) {
  if (loading) {
    return <ActivityIndicator color={colors.primary} style={{ marginTop: 24 }} />;
  }

  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <Text variant="bodySmall" style={styles.empty}>No proposals yet</Text>
      }
      renderItem={({ item }) => (
        <Pressable
          onPress={() => onPress ? onPress(item.id) : router.push(`/proposal/${item.id}`)}
          style={styles.row}
        >
          <View style={styles.rowMain}>
            <Text variant="label">{item.client_name}</Text>
            <Text variant="caption">{item.project_type ?? "—"}</Text>
          </View>
          <Badge label={item.status} color={PROPOSAL_STATUS_COLORS[item.status] ?? colors.textMuted} />
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: spacing.xxl },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  rowMain: { flex: 1, marginRight: spacing.md },
  empty: { textAlign: "center", marginTop: spacing.xl },
});
