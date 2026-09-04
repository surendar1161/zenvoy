import { Screen } from "@/components/Screen";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { spacing } from "@/design-system";

export default function TemplatesScreen() {
  return (
    <Screen>
      <Card>
        <Text variant="body">19+ industry templates available on web.</Text>
        <Text variant="bodySmall" style={{ marginTop: spacing.sm }}>
          Use Generate → industry template on desktop, or pick a project type when creating a proposal on mobile.
        </Text>
      </Card>
    </Screen>
  );
}
