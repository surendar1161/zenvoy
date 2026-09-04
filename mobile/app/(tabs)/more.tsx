import { ScrollView, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { useAuth } from "@/hooks/useAuth";
import { colors, spacing } from "@/design-system";

const LINKS = [
  { title: "New proposal", route: "/generate", primary: true },
  { title: "Contracts", route: "/contracts" },
  { title: "Projects", route: "/projects" },
  { title: "Portals", route: "/portals" },
  { title: "Templates", route: "/templates" },
  { title: "Automations", route: "/automations" },
  { title: "Bookings", route: "/bookings" },
  { title: "Analytics", route: "/analytics" },
  { title: "Subscription", route: "/subscription" },
  { title: "Settings", route: "/settings" },
];

export default function MoreScreen() {
  const { user, signOut } = useAuth();

  return (
    <Screen title="More" subtitle={user?.email ?? ""}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Button title="New proposal" onPress={() => router.push("/generate")} size="lg" style={styles.cta} />

        <Card style={styles.menu}>
          {LINKS.filter(l => !l.primary).map(link => (
            <Pressable key={link.route} style={styles.row} onPress={() => router.push(link.route as never)}>
              <Text variant="label">{link.title}</Text>
              <Text variant="caption">→</Text>
            </Pressable>
          ))}
        </Card>

        <Button title="Sign out" variant="secondary" onPress={async () => {
          await signOut();
          router.replace("/(auth)/sign-in");
        }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.xxl },
  cta: { marginBottom: spacing.lg },
  menu: { marginBottom: spacing.lg },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
});
