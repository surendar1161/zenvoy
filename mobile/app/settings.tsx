import { Screen } from "@/components/Screen";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { useAuth } from "@/hooks/useAuth";
import { spacing } from "@/design-system";

export default function SettingsScreen() {
  const { user } = useAuth();
  return (
    <Screen>
      <Card>
        <Text variant="label">Signed in as</Text>
        <Text variant="body">{user?.email}</Text>
        <Text variant="caption" style={{ marginTop: spacing.md }}>
          Brand kit, team, and payments are managed on the web app.
        </Text>
      </Card>
    </Screen>
  );
}
