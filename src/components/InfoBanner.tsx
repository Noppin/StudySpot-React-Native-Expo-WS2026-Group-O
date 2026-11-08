import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../constants/theme';

export type BannerTone = 'info' | 'warning' | 'error';

interface InfoBannerProps {
  message: string;
  tone?: BannerTone;
}

const toneColors: Record<BannerTone, { background: string; dot: string }> = {
  info: { background: theme.colors.surface, dot: theme.colors.accent },
  warning: { background: theme.colors.warningSoft, dot: theme.colors.warning },
  error: { background: theme.colors.dangerSoft, dot: theme.colors.danger },
};

export function InfoBanner({ message, tone = 'info' }: InfoBannerProps) {
  const colors = toneColors[tone];

  return (
    <View
      accessibilityRole={tone === 'info' ? 'text' : 'alert'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.dot, { backgroundColor: colors.dot }]} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    marginBottom: theme.spacing.md,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  message: { ...theme.type.caption, color: theme.colors.text, flex: 1 },
});
