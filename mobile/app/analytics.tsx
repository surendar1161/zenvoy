import { useEffect, useState } from "react";
import { Screen } from "@/components/Screen";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { supabase } from "@/lib/supabase";
import { spacing } from "@/design-system";

export default function AnalyticsScreen() {
  const [stats, setStats] = useState({ proposals: 0, views: 0, accepted: 0 });

  useEffect(() => {
    supabase.from("proposals").select("status,view_count").then(({ data }) => {
      const rows = data ?? [];
      setStats({
        proposals: rows.length,
        views: rows.reduce((s, r) => s + (r.view_count ?? 0), 0),
        accepted: rows.filter(r => r.status === "accepted" || r.status === "signed").length,
      });
    });
  }, []);

  return (
    <Screen title="Analytics" subtitle="Proposal performance">
      <Card style={{ marginBottom: spacing.md }}>
        <Text variant="caption">Total proposals</Text>
        <Text variant="h2">{stats.proposals}</Text>
      </Card>
      <Card style={{ marginBottom: spacing.md }}>
        <Text variant="caption">Total views</Text>
        <Text variant="h2">{stats.views}</Text>
      </Card>
      <Card>
        <Text variant="caption">Accepted / signed</Text>
        <Text variant="h2">{stats.accepted}</Text>
      </Card>
    </Screen>
  );
}
