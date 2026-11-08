import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../constants/theme';

interface ErrorViewProps {
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ErrorView({
  title = 'Something went wrong',
  message,
  actionLabel = 'Try again',
  onAction,
}: ErrorViewProps) {
  return (
    <View accessibilityRole="alert" style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onAction ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: theme.spacing.xl },
  title: { ...theme.type.heading, color: theme.colors.text, textAlign: 'center' },
  message: {
    ...theme.type.caption,
    color: theme.colors.muted,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  button: {
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  buttonText: { ...theme.type.label, color: theme.colors.text },
  pressed: { opacity: 0.6 },
});
