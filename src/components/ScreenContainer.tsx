import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { theme } from '../constants/theme';

interface ScreenContainerProps extends PropsWithChildren {
  padded?: boolean;
  edges?: Edge[];
}

export function ScreenContainer({
  children,
  padded = true,
  edges = ['top', 'left', 'right'],
}: ScreenContainerProps) {
  return (
    <SafeAreaView edges={edges} style={styles.safeArea}>
      <View style={[styles.content, padded && styles.padded]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  content: { flex: 1 },
  padded: { paddingHorizontal: theme.spacing.screen, paddingTop: theme.spacing.lg },
});
