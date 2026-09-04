import { Screen } from "@/components/Screen";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { spacing } from "@/design-system";

export default function TimeTrackingScreen() {
  return (
    <Screen title="Time tracking">
      <Card>
        <Text variant="body">Start and stop timers from the web dashboard header.</Text>
        <Text variant="bodySmall" style={{ marginTop: spacing.sm }}>
          Mobile time-entry UI can be added in Phase 3 — data lives in Supabase `time_entries`.
        </Text>
      </Card>
    </Screen>
  );
}
