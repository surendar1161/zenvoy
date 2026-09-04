import { useEffect, useState } from "react";
import { Screen } from "@/components/Screen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { UsageBar } from "@/components/UsageBar";
import { api } from "@/lib/api";
import { spacing } from "@/design-system";
import type { UsageSummary } from "@/types";

export default function SubscriptionScreen() {
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [health, setHealth] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.getUsage().then(setUsage).catch(() => {});
    api.getEmailHealth().then(h => {
      setHealth(h.configured ? `Email delivery OK · ${h.fromEmail}` : "Email not configured on server");
    }).catch(() => {});
  }, []);

  async function testEmail() {
    setMsg("");
    try {
      await api.sendTestEmail();
      setMsg("Test email sent to your inbox.");
    } catch (e) {
      setMsg((e as Error).message);
    }
  }

  return (
    <Screen>
      <Card style={{ marginBottom: spacing.lg }}>
        <Text variant="label">Email notifications</Text>
        <Text variant="bodySmall">{health}</Text>
        <Button title="Send test email" variant="secondary" onPress={testEmail} style={{ marginTop: spacing.md }} />
        {msg ? <Text variant="bodySmall" style={{ marginTop: spacing.sm }}>{msg}</Text> : null}
      </Card>

      {usage && (
        <Card style={{ marginBottom: spacing.lg }}>
          <Text variant="label">Usage · {usage.periodLabel}</Text>
          <UsageBar label="Proposals" used={usage.proposals.used} limit={usage.proposals.limit} />
          <UsageBar label="Contracts" used={usage.contracts.used} limit={usage.contracts.limit} />
          <UsageBar label="Team members" used={usage.teamMembers.used} limit={usage.teamMembers.limit} />
        </Card>
      )}

      <Card>
        <Text variant="body">Upgrade to Pro or Business on the web subscription page (Chargebee checkout).</Text>
      </Card>
    </Screen>
  );
}
