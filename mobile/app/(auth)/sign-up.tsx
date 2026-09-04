import { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { useAuth } from "@/hooks/useAuth";
import { colors, spacing } from "@/design-system";

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    setError("");
    setLoading(true);
    const { error: err } = await signUp(email.trim(), password, fullName.trim());
    setLoading(false);
    if (err) setError(err.message);
    else router.replace("/(tabs)");
  }

  return (
    <Screen title="Create account" subtitle="Start with 5 free proposals per month">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Text variant="label" style={styles.label}>Full name</Text>
        <Input value={fullName} onChangeText={setFullName} placeholder="Alex Johnson" />
        <Text variant="label" style={styles.label}>Email</Text>
        <Input value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <Text variant="label" style={styles.label}>Password</Text>
        <Input value={password} onChangeText={setPassword} secureTextEntry placeholder="Min 8 characters" />
        {error ? <Text variant="bodySmall" color={colors.error}>{error}</Text> : null}
        <Button title="Sign up free" onPress={handleSignUp} loading={loading} size="lg" style={styles.btn} />
        <Button title="Back to sign in" variant="ghost" onPress={() => router.back()} />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { marginTop: spacing.md, marginBottom: spacing.xs },
  btn: { marginTop: spacing.lg },
});
