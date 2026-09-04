import { useEffect, useState } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Screen } from "@/components/Screen";
import { Text } from "@/components/ui/Text";
import { supabase } from "@/lib/supabase";
import { colors, spacing } from "@/design-system";
import type { PortalRow } from "@/types";

export default function PortalsScreen() {
  const [data, setData] = useState<PortalRow[]>([]);
  useEffect(() => {
    supabase.from("portals").select("id,title,token,created_at").order("created_at", { ascending: false }).then(({ data }) => {
      setData((data ?? []) as PortalRow[]);
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
            <Text variant="label">{item.title}</Text>
            <Text variant="caption">/portal/{item.token}</Text>
          </View>
        )}
        ListEmptyComponent={<Text variant="bodySmall" style={styles.empty}>No portals</Text>}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: spacing.xxl },
  row: { paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderLight, gap: spacing.xs },
  empty: { textAlign: "center", marginTop: spacing.xl },
});
