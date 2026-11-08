import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { theme } from '../constants/theme';

interface LoadingViewProps {
  message?: string;
}

export function LoadingView({ message = 'Loading study places…' }: LoadingViewProps) {
  return (
    <View accessibilityRole="progressbar" style={styles.container}>
      <ActivityIndicator color={theme.colors.accent} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xl, gap: theme.spacing.md },
  message: { ...theme.type.caption, color: theme.colors.muted },
});
