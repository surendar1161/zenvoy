import { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { useAuth } from "@/hooks/useAuth";
import { colors, spacing, radius } from "@/design-system";

export default function SignInScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    setError("");
    setLoading(true);
    const { error: err } = await signIn(email.trim(), password);
    setLoading(false);
    if (err) setError(err.message);
    else router.replace("/(tabs)");
  }

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <View style={styles.hero}>
          <View style={styles.logo}>
            <Text variant="h2" color={colors.white}>⚡</Text>
          </View>
          <Text variant="hero" style={styles.title}>DealPilot</Text>
          <Text variant="bodySmall">Your deal desk for freelancers</Text>
        </View>

        <View style={styles.form}>
          <Text variant="label" style={styles.fieldLabel}>Email</Text>
          <Input
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@studio.com"
          />
          <Text variant="label" style={styles.fieldLabel}>Password</Text>
          <Input
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
          />
          {error ? <Text variant="bodySmall" color={colors.error}>{error}</Text> : null}
          <Button title="Sign in" onPress={handleSignIn} loading={loading} size="lg" style={styles.btn} />
          <Button
            title="Create account"
            variant="ghost"
            onPress={() => router.push("/(auth)/sign-up")}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  hero: { alignItems: "center", paddingTop: spacing.section, marginBottom: spacing.xxl },
  logo: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  title: { marginBottom: spacing.xs },
  form: { gap: spacing.sm },
  fieldLabel: { marginTop: spacing.sm, marginBottom: spacing.xs },
  btn: { marginTop: spacing.lg },
});
