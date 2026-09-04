import { Stack } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
import { colors } from "@/design-system";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="generate" options={{ title: "New proposal" }} />
      <Stack.Screen name="proposal/[id]" options={{ title: "Proposal" }} />
      <Stack.Screen name="client/[id]" options={{ title: "Client" }} />
      <Stack.Screen name="contracts" options={{ title: "Contracts" }} />
      <Stack.Screen name="projects" options={{ title: "Projects" }} />
      <Stack.Screen name="portals" options={{ title: "Portals" }} />
      <Stack.Screen name="templates" options={{ title: "Templates" }} />
      <Stack.Screen name="automations" options={{ title: "Automations" }} />
      <Stack.Screen name="bookings" options={{ title: "Bookings" }} />
      <Stack.Screen name="analytics" options={{ title: "Analytics" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen name="subscription" options={{ title: "Subscription" }} />
      <Stack.Screen name="time-tracking" options={{ title: "Time tracking" }} />
      <Stack.Screen name="expenses" options={{ title: "Expenses" }} />
    </Stack>
  );
}
