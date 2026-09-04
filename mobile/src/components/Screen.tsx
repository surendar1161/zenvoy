import { View, StyleSheet, type ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "@/design-system";
import { Text } from "./ui/Text";

interface ScreenProps extends ViewProps {
  title?: string;
  subtitle?: string;
  scroll?: boolean;
  children: React.ReactNode;
}

export function Screen({ title, subtitle, children, style, ...props }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={[styles.container, style]} {...props}>
        {title && (
          <View style={styles.header}>
            <Text variant="h1">{title}</Text>
            {subtitle && <Text variant="bodySmall" style={styles.subtitle}>{subtitle}</Text>}
          </View>
        )}
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: spacing.lg },
  header: { marginBottom: spacing.lg, paddingTop: spacing.sm },
  subtitle: { marginTop: spacing.xs },
});
