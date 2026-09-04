import { Tabs } from "expo-router";
import { colors, typography } from "@/design-system";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontFamily: typography.fontFamily.medium,
          fontSize: 11,
        },
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { fontFamily: typography.fontFamily.semibold },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Today", tabBarLabel: "Today" }} />
      <Tabs.Screen name="pipeline" options={{ title: "Pipeline" }} />
      <Tabs.Screen name="clients" options={{ title: "Clients" }} />
      <Tabs.Screen name="money" options={{ title: "Money" }} />
      <Tabs.Screen name="more" options={{ title: "More" }} />
    </Tabs>
  );
}
