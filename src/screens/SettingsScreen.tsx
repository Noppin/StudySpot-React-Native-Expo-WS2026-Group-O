import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { InfoBanner } from '../components/InfoBanner';
import { ScreenContainer } from '../components/ScreenContainer';
import { theme } from '../constants/theme';
import { useClearLocationCache, useLocations } from '../hooks/useLocations';

export function SettingsScreen() {
  const { isShowingCache, updatedAt, refresh, isRefreshing: isLoading } = useLocations();
  const clearCache = useClearLocationCache();

  const sourceLabel = isShowingCache ? 'Cached offline data' : 'Live OpenStreetMap data';

  function confirmClearCache() {
    Alert.alert(
      'Clear downloaded places?',
      'This removes the location cache. Your saved favourites will not be deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear cache', style: 'destructive', onPress: () => void clearCache() },
      ],
    );
  }

  return (
    <ScreenContainer>
      <Text style={styles.eyebrow}>PREFERENCES</Text>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Manage your local data and refresh study places.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>CURRENT DATA SOURCE</Text>
        <Text style={styles.value}>{sourceLabel}</Text>
        <Text style={styles.meta}>
          {updatedAt ? `Last updated ${new Date(updatedAt).toLocaleString()}` : 'No data loaded yet.'}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        disabled={isLoading}
        onPress={() => void refresh()}
        style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed, isLoading && styles.disabled]}
      >
        <Text style={styles.primaryButtonText}>{isLoading ? 'Refreshing…' : 'Refresh study places'}</Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={confirmClearCache}
        style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
      >
        <Text style={styles.secondaryButtonText}>Clear location cache</Text>
      </Pressable>

      <InfoBanner message="StudySpot only requests foreground location when you tap “Use my location”. Your coordinates are not stored." />
      <Text style={styles.footer}>StudySpot · Cross-Platform Mobile Development</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  eyebrow: { color: theme.colors.accent, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: theme.colors.text, fontSize: 27, fontWeight: '800', marginTop: 5 },
  subtitle: { color: theme.colors.muted, fontSize: 13, lineHeight: 19, marginTop: 6 },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: 16,
    marginTop: 22,
  },
  label: { color: theme.colors.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  value: { color: theme.colors.text, fontSize: 16, fontWeight: '700', marginTop: 7 },
  meta: { color: theme.colors.muted, fontSize: 12, marginTop: 5 },
  primaryButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.md,
    padding: 14,
    alignItems: 'center',
    marginTop: 14,
  },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '700' },
  secondaryButton: {
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 18,
  },
  secondaryButtonText: { color: theme.colors.danger, fontWeight: '700' },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.55 },
  footer: { color: theme.colors.muted, fontSize: 11, textAlign: 'center', marginTop: 24 },
});
