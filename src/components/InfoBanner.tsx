import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../constants/theme';

interface InfoBannerProps {
  message: string;
  tone?: 'info' | 'error' | 'success';
}

export function InfoBanner({ message, tone = 'info' }: InfoBannerProps) {
  const toneStyle =
    tone === 'error'
      ? styles.error
      : tone === 'success'
        ? styles.success
        : styles.info;

  return (
    <View accessibilityRole="alert" style={[styles.container, toneStyle]}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.radius.control,
    padding: 12,
    marginBottom: 12,
  },
  info: { backgroundColor: theme.colors.primarySoft },
  error: { backgroundColor: theme.colors.dangerSoft },
  success: { backgroundColor: '#E8F4EC' },
  message: {
    color: theme.colors.text,
    fontSize: 13,
    lineHeight: 18,
  },
});
