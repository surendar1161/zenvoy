import { useEffect, useState } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Screen } from "@/components/Screen";
import { Text } from "@/components/ui/Text";
import { supabase } from "@/lib/supabase";
import { colors, spacing } from "@/design-system";

interface BookingRow {
  id: string;
  title: string | null;
  scheduled_at: string | null;
  status: string;
}

export default function BookingsScreen() {
  const [data, setData] = useState<BookingRow[]>([]);
  useEffect(() => {
    supabase.from("bookings").select("id,title,scheduled_at,status").order("scheduled_at", { ascending: true }).then(({ data }) => {
      setData((data ?? []) as BookingRow[]);
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
            <Text variant="label">{item.title ?? "Meeting"}</Text>
            <Text variant="caption">{item.scheduled_at ? new Date(item.scheduled_at).toLocaleString() : "—"} · {item.status}</Text>
          </View>
        )}
        ListEmptyComponent={<Text variant="bodySmall" style={styles.empty}>No bookings</Text>}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: spacing.xxl },
  row: { paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderLight, gap: spacing.xs },
  empty: { textAlign: "center", marginTop: spacing.xl },
});
