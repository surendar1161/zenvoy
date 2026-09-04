import {
  Text as RNText,
  type TextProps as RNTextProps,
  StyleSheet,
} from "react-native";
import { textStyles } from "@/design-system";

type Variant = keyof typeof textStyles;

interface AppTextProps extends RNTextProps {
  variant?: Variant;
  color?: string;
}

export function Text({ variant = "body", style, color, ...props }: AppTextProps) {
  return (
    <RNText
      style={[textStyles[variant], color ? { color } : null, style]}
      {...props}
    />
  );
}

export function Label({ children, ...props }: AppTextProps) {
  return <Text variant="label" {...props}>{children}</Text>;
}
