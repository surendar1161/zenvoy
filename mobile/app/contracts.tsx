import { useEffect, useState } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Screen } from "@/components/Screen";
import { Badge } from "@/components/ui/Badge";
import { Text } from "@/components/ui/Text";
import { supabase } from "@/lib/supabase";
import { colors, spacing } from "@/design-system";
import type { ContractRow } from "@/types";

export default function ContractsScreen() {
  const [data, setData] = useState<ContractRow[]>([]);

  useEffect(() => {
    supabase.from("contracts").select("id,contract_type_name,status,created_at").order("created_at", { ascending: false }).then(({ data: rows }) => {
      setData((rows ?? []) as ContractRow[]);
    });
  }, []);

  return (
    <Screen>
      <FlatList
        data={data}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text variant="label">{item.contract_type_name ?? "Contract"}</Text>
            <Badge label={item.status} color={item.status === "signed" ? colors.success : colors.primary} />
          </View>
        )}
        ListEmptyComponent={<Text variant="bodySmall" style={styles.empty}>No contracts</Text>}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: spacing.xxl },
  row: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: spacing.xs,
  },
  empty: { textAlign: "center", marginTop: spacing.xl },
});
