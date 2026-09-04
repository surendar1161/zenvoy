import { useEffect, useState } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Screen } from "@/components/Screen";
import { Badge } from "@/components/ui/Badge";
import { Text } from "@/components/ui/Text";
import { supabase } from "@/lib/supabase";
import { colors, spacing } from "@/design-system";
import type { ProjectRow } from "@/types";

export default function ProjectsScreen() {
  const [data, setData] = useState<ProjectRow[]>([]);
  useEffect(() => {
    supabase.from("projects").select("id,name,status,created_at").order("created_at", { ascending: false }).then(({ data }) => {
      setData((data ?? []) as ProjectRow[]);
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
            <Badge label={item.status} />
          </View>
        )}
        ListEmptyComponent={<Text variant="bodySmall" style={styles.empty}>No projects</Text>}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: spacing.xxl },
  row: { paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderLight, gap: spacing.xs },
  empty: { textAlign: "center", marginTop: spacing.xl },
});
