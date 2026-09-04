import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { Badge } from "@/components/ui/Badge";
import { Text } from "@/components/ui/Text";
import { supabase } from "@/lib/supabase";
import { colors, spacing } from "@/design-system";
import type { ClientRow } from "@/types";

export default function ClientsScreen() {
  const [data, setData] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("clients").select("*").order("created_at", { ascending: false }).then(({ data: rows }) => {
      setData((rows ?? []) as ClientRow[]);
      setLoading(false);
    });
  }, []);

  return (
    <Screen title="Clients" subtitle="Your CRM">
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        refreshing={loading}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable style={styles.row} onPress={() => router.push(`/client/${item.id}`)}>
            <Text variant="label">{item.name}</Text>
            <Text variant="caption">{item.company ?? item.email ?? "—"}</Text>
            <Badge label={item.status} />
          </Pressable>
        )}
        ListEmptyComponent={<Text variant="bodySmall" style={styles.empty}>No clients yet</Text>}
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
