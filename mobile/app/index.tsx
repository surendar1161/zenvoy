import { Redirect } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { ActivityIndicator, View } from "react-native";
import { colors } from "@/design-system";

export default function Index() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }
  if (user) return <Redirect href="/(tabs)" />;
  return <Redirect href="/(auth)/sign-in" />;
}
