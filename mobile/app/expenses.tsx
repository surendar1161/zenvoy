import { useEffect, useState } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Screen } from "@/components/Screen";
import { Text } from "@/components/ui/Text";
import { supabase } from "@/lib/supabase";
import { colors, spacing } from "@/design-system";

interface ExpenseRow {
  id: string;
  title: string | null;
  amount: number | null;
  currency: string | null;
  created_at: string;
}

export default function ExpensesScreen() {
  const [data, setData] = useState<ExpenseRow[]>([]);
  useEffect(() => {
    supabase.from("expenses").select("id,title,amount,currency,created_at").order("created_at", { ascending: false }).then(({ data }) => {
      setData((data ?? []) as ExpenseRow[]);
    });
  }, []);
  return (
    <Screen title="Expenses">
      <FlatList
        data={data}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text variant="label">{item.title ?? "Expense"}</Text>
            <Text variant="caption">{item.currency ?? "USD"} {item.amount?.toLocaleString() ?? "—"}</Text>
          </View>
        )}
        ListEmptyComponent={<Text variant="bodySmall" style={styles.empty}>No expenses</Text>}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: spacing.xxl },
  row: { paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  empty: { textAlign: "center", marginTop: spacing.xl },
});
