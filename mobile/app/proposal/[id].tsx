import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/Screen";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Text } from "@/components/ui/Text";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";
import { colors, spacing } from "@/design-system";
import { PROPOSAL_STATUS_COLORS, type ProposalRow } from "@/types";

export default function ProposalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [row, setRow] = useState<ProposalRow | null>(null);

  useEffect(() => {
    if (!id) return;
    supabase.from("proposals").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      if (data) {
        setRow(data as ProposalRow);
        api.trackView(id, "proposal");
      }
    });
  }, [id]);

  if (!row) {
    return (
      <Screen>
        <Text variant="bodySmall">Loading…</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card style={styles.header}>
          <Text variant="h2">{row.client_name}</Text>
          <Text variant="bodySmall">{row.project_type ?? "Proposal"}</Text>
          <Badge label={row.status} color={PROPOSAL_STATUS_COLORS[row.status]} />
          {row.total_budget != null && (
            <Text variant="label" color={colors.success} style={styles.budget}>
              {row.currency ?? "USD"} {row.total_budget.toLocaleString()}
            </Text>
          )}
        </Card>

        <Card>
          <Text variant="label" style={styles.section}>Proposal text</Text>
          <Text variant="body" style={styles.body}>
            {row.proposal_text ?? "No content yet."}
          </Text>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.xxl },
  header: { marginBottom: spacing.lg, gap: spacing.sm },
  budget: { marginTop: spacing.sm },
  section: { marginBottom: spacing.md },
  body: { lineHeight: 24 },
});
