import { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, RefreshControl } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { UsageBar } from "@/components/UsageBar";
import { EmptyState } from "@/components/EmptyState";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";
import { colors, spacing, radius } from "@/design-system";
import type { NotificationRow, ProposalRow, UsageSummary } from "@/types";

export default function TodayScreen() {
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [needsAttention, setNeedsAttention] = useState<ProposalRow[]>([]);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [stats, setStats] = useState({ revenue: 0, accepted: 0, views: 0 });
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    const [{ data: props }, { data: notifs }] = await Promise.all([
      supabase.from("proposals").select("id,client_name,project_type,status,total_budget,view_count,created_at").order("created_at", { ascending: false }),
      supabase.from("notifications").select("id,title,message,type,created_at").order("created_at", { ascending: false }).limit(6),
    ]);
    const all = props ?? [];
    const now = Date.now();
    setNeedsAttention(
      all.filter(p => {
        const age = (now - new Date(p.created_at).getTime()) / 86400000;
        return (p.status === "sent" && age > 3) || (p.status === "viewed" && age > 2);
      }).slice(0, 5) as ProposalRow[]
    );
    setNotifications((notifs ?? []) as NotificationRow[]);
    setStats({
      revenue: all.filter(p => p.status === "accepted" || p.status === "signed").reduce((s, p) => s + (p.total_budget ?? 0), 0),
      accepted: all.filter(p => p.status === "accepted" || p.status === "signed").length,
      views: all.reduce((s, p) => s + (p.view_count ?? 0), 0),
    });
    try {
      setUsage(await api.getUsage());
    } catch {
      setUsage(null);
    }
  }

  useEffect(() => { load(); }, []);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <Screen>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="caption" style={styles.greeting}>{greeting()}</Text>
        <Text variant="h1" style={styles.title}>Today</Text>

        <Card style={styles.heroCard}>
          <Text variant="h3" color={colors.white}>
            {needsAttention.length > 0 ? `${needsAttention.length} follow-ups due` : "Ready for a new deal?"}
          </Text>
          <Text variant="bodySmall" color="rgba(255,255,255,0.85)" style={styles.heroSub}>
            {needsAttention.length > 0
              ? "Clients who haven't opened or responded yet."
              : "Generate a branded proposal in about 60 seconds."}
          </Text>
          <Button
            title={needsAttention.length > 0 ? "Open pipeline" : "New proposal"}
            variant="secondary"
            onPress={() => router.push(needsAttention.length > 0 ? "/(tabs)/pipeline" : "/generate")}
          />
        </Card>

        {usage && (
          <Card style={styles.section}>
            <Text variant="label">Usage · {usage.periodLabel.split(" ")[0]}</Text>
            <UsageBar label="Proposals" used={usage.proposals.used} limit={usage.proposals.limit} />
            <UsageBar label="Contracts" used={usage.contracts.used} limit={usage.contracts.limit} />
          </Card>
        )}

        <View style={styles.statsRow}>
          <Card style={styles.stat} padded>
            <Text variant="caption">Revenue won</Text>
            <Text variant="h2" color={colors.success}>${stats.revenue.toLocaleString()}</Text>
          </Card>
          <Card style={styles.stat} padded>
            <Text variant="caption">Deals won</Text>
            <Text variant="h2" color={colors.primary}>{stats.accepted}</Text>
          </Card>
          <Card style={styles.stat} padded>
            <Text variant="caption">Views</Text>
            <Text variant="h2">{stats.views}</Text>
          </Card>
        </View>

        {needsAttention.length > 0 && (
          <Card style={styles.section}>
            <Text variant="label">Follow up today</Text>
            {needsAttention.map(p => (
              <View key={p.id} style={styles.attentionRow}>
                <Text variant="label">{p.client_name}</Text>
                <Text variant="caption">{p.status} · needs action</Text>
              </View>
            ))}
          </Card>
        )}

        <Card style={styles.section}>
          <Text variant="label">Recent activity</Text>
          {notifications.length === 0 ? (
            <EmptyState title="No activity yet" message="Opens and signatures appear here." />
          ) : (
            notifications.map(n => (
              <View key={n.id} style={styles.activityRow}>
                <Text variant="label">{n.title}</Text>
                <Text variant="caption">{n.message}</Text>
              </View>
            ))
          )}
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.xxl },
  greeting: { marginTop: spacing.sm },
  title: { marginBottom: spacing.lg },
  heroCard: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
    marginBottom: spacing.lg,
  },
  heroSub: { marginTop: spacing.sm, marginBottom: spacing.lg },
  heroBtn: { backgroundColor: colors.white },
  section: { marginBottom: spacing.lg },
  statsRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.lg },
  stat: { flex: 1 },
  attentionRow: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  activityRow: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
});
