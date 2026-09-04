import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Text } from "@/components/ui/Text";
import { supabase } from "@/lib/supabase";
import { colors, spacing } from "@/design-system";
import type { InvoiceRow } from "@/types";

export default function MoneyScreen() {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("invoices").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setInvoices((data ?? []) as InvoiceRow[]);
      setLoading(false);
    });
  }, []);

  const outstanding = invoices.filter(i => i.status !== "paid").length;

  return (
    <Screen title="Money" subtitle="Invoices & expenses">
      <View style={styles.actions}>
        <Button title="Expenses" variant="secondary" onPress={() => router.push("/expenses")} style={styles.half} />
        <Button title="Time tracking" variant="secondary" onPress={() => router.push("/time-tracking")} style={styles.half} />
      </View>

      <Card style={styles.summary}>
        <Text variant="caption">Outstanding invoices</Text>
        <Text variant="h2">{outstanding}</Text>
      </Card>

      <Text variant="label" style={styles.sectionTitle}>Invoices</Text>
      <FlatList
        data={invoices}
        keyExtractor={item => item.id}
        refreshing={loading}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text variant="label">{item.title ?? "Invoice"}</Text>
            <Text variant="caption">
              {item.currency ?? "USD"} {item.amount?.toLocaleString() ?? "—"}
            </Text>
            <Badge label={item.status} color={item.status === "paid" ? colors.success : colors.warning} />
          </View>
        )}
        ListEmptyComponent={<Text variant="bodySmall" style={styles.empty}>No invoices yet</Text>}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.lg },
  half: { flex: 1 },
  summary: { marginBottom: spacing.lg },
  sectionTitle: { marginBottom: spacing.sm },
  list: { paddingBottom: spacing.xxl },
  row: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: spacing.xs,
  },
  empty: { textAlign: "center", marginTop: spacing.xl },
});
