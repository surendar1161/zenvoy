import { useEffect, useState } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Screen } from "@/components/Screen";
import { Badge } from "@/components/ui/Badge";
import { Text } from "@/components/ui/Text";
import { supabase } from "@/lib/supabase";
import { colors, spacing } from "@/design-system";

interface AutomationRow {
  id: string;
  name: string;
  trigger_type: string;
  enabled: boolean;
}

export default function AutomationsScreen() {
  const [data, setData] = useState<AutomationRow[]>([]);
  useEffect(() => {
    supabase.from("automations").select("id,name,trigger_type,enabled").order("created_at", { ascending: false }).then(({ data }) => {
      setData((data ?? []) as AutomationRow[]);
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
            <Text variant="label">{item.name}</Text>
            <Text variant="caption">{item.trigger_type}</Text>
            <Badge label={item.enabled ? "on" : "off"} color={item.enabled ? colors.success : colors.textMuted} />
          </View>
        )}
        ListEmptyComponent={<Text variant="bodySmall" style={styles.empty}>No automations</Text>}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: spacing.xxl },
  row: { paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderLight, gap: spacing.xs },
  empty: { textAlign: "center", marginTop: spacing.xl },
});
