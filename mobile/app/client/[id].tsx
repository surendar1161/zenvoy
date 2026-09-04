import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/Screen";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Text } from "@/components/ui/Text";
import { supabase } from "@/lib/supabase";
import { spacing } from "@/design-system";
import type { ClientRow } from "@/types";

export default function ClientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [client, setClient] = useState<ClientRow | null>(null);

  useEffect(() => {
    if (!id) return;
    supabase.from("clients").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      setClient(data as ClientRow);
    });
  }, [id]);

  if (!client) return <Screen><Text variant="bodySmall">Loading…</Text></Screen>;

  return (
    <Screen>
      <Card style={styles.card}>
        <Text variant="h2">{client.name}</Text>
        {client.company && <Text variant="body">{client.company}</Text>}
        {client.email && <Text variant="bodySmall">{client.email}</Text>}
        <Badge label={client.status} />
        <Text variant="caption" style={styles.meta}>
          Added {new Date(client.created_at).toLocaleDateString()}
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm },
  meta: { marginTop: spacing.md },
});
