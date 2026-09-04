import { useEffect, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Screen } from "@/components/Screen";
import { ProposalList } from "@/components/ProposalList";
import { supabase } from "@/lib/supabase";
import { colors, spacing, radius } from "@/design-system";
import { Text } from "@/components/ui/Text";
import type { ProposalRow } from "@/types";

const FILTERS = ["all", "draft", "sent", "viewed", "accepted", "declined"] as const;

export default function PipelineScreen() {
  const [filter, setFilter] = useState<typeof FILTERS[number]>("all");
  const [data, setData] = useState<ProposalRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("proposals")
      .select("id,client_name,project_type,status,currency,total_budget,view_count,created_at")
      .order("created_at", { ascending: false })
      .then(({ data: rows }) => {
        setData((rows ?? []) as ProposalRow[]);
        setLoading(false);
      });
  }, []);

  const filtered = filter === "all" ? data : data.filter(p => p.status === filter);

  return (
    <Screen title="Pipeline" subtitle="Track every deal stage">
      <View style={styles.filters}>
        {FILTERS.map(f => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.chip, filter === f && styles.chipActive]}
          >
            <Text variant="caption" color={filter === f ? colors.white : colors.textMuted}>
              {f}
            </Text>
          </Pressable>
        ))}
      </View>
      <ProposalList data={filtered} loading={loading} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.borderLight,
  },
  chipActive: { backgroundColor: colors.primary },
});
