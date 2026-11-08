import { Ionicons } from '@expo/vector-icons';
import type { PropsWithChildren } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CategoryFilter } from '../components/CategoryFilter';
import { formatCacheAge } from '../components/OfflineBanner';
import { ScreenContainer } from '../components/ScreenContainer';
import { ScreenHeader } from '../components/ScreenHeader';
import { SEARCH_RADIUS_OPTIONS } from '../constants/studySpot';
import { theme } from '../constants/theme';
import type { LocationStatus } from '../hooks/useCurrentLocation';
import { useClearLocationCache, useLocations } from '../hooks/useLocations';
import { useSettingsStore } from '../store/settingsStore';
import type { LocationMode } from '../types/Settings';
import { formatDistance } from '../utils/distance';
import { CATEGORY_FILTER_OPTIONS } from '../utils/filters';

const LOCATION_MODES: { value: LocationMode; title: string; description: string }[] = [
  {
    value: 'device',
    title: 'Use my location',
    description: 'Ask for GPS permission and search around you.',
  },
  {
    value: 'default',
    title: 'Use default location',
    description: 'Never ask for permission; search around FH Technikum Wien.',
  },
];

const PERMISSION_LABELS: Record<LocationStatus, string> = {
  requesting: 'Requesting permission…',
  granted: 'Permission granted',
  denied: 'Permission denied',
  unavailable: 'GPS unavailable',
  disabled: 'Not used',
};

export function SettingsScreen() {
  const settings = useSettingsStore();
  const { locations, isShowingCache, updatedAt, refresh, isRefreshing, currentLocation } =
    useLocations();
  const clearCache = useClearLocationCache();

  function confirmClearCache() {
    Alert.alert(
      'Delete cached places?',
      'Downloaded places are removed from this device. Favorites and settings are kept.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => void clearCache() },
      ],
    );
  }

  const cacheInfo = updatedAt
    ? `${locations.length} places · ${isShowingCache ? 'offline copy' : 'current'} · ${formatCacheAge(updatedAt)}`
    : 'No places stored on this device';

  return (
    <ScreenContainer padded={false}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Settings" />

        <Section title="Search radius">
          <CategoryFilter
            options={SEARCH_RADIUS_OPTIONS.map(String)}
            selected={String(settings.searchRadiusMeters)}
            onSelect={(value) => settings.setSearchRadius(Number(value))}
            getLabel={(value) => formatDistance(Number(value)) ?? value}
          />
        </Section>

        <Section title="Preferred category" hint="Used as the default filter on Home.">
          <CategoryFilter
            options={CATEGORY_FILTER_OPTIONS}
            selected={settings.preferredCategory}
            onSelect={settings.setPreferredCategory}
          />
        </Section>

        <Section title="Location">
          {LOCATION_MODES.map((mode) => {
            const selected = settings.locationMode === mode.value;
            return (
              <Pressable
                key={mode.value}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                onPress={() => settings.setLocationMode(mode.value)}
                style={({ pressed }) => [styles.option, pressed && styles.pressed]}
              >
                <Ionicons
                  name={selected ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={selected ? theme.colors.text : theme.colors.subtle}
                />
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>{mode.title}</Text>
                  <Text style={styles.optionDescription}>{mode.description}</Text>
                </View>
              </Pressable>
            );
          })}
          {settings.locationMode === 'device' ? (
            <View style={styles.statusRow}>
              <Text style={styles.meta}>{PERMISSION_LABELS[currentLocation.status]}</Text>
              {currentLocation.status === 'denied' ? (
                <TextButton label="Open system settings" onPress={() => void Linking.openSettings()} />
              ) : currentLocation.status === 'unavailable' ? (
                <TextButton label="Try again" onPress={currentLocation.request} />
              ) : null}
            </View>
          ) : null}
        </Section>

        <Section title="Data">
          <Text style={styles.meta}>{cacheInfo}</Text>
          <View style={styles.buttons}>
            <Pressable
              accessibilityRole="button"
              disabled={isRefreshing}
              onPress={refresh}
              style={({ pressed }) => [styles.button, (pressed || isRefreshing) && styles.pressed]}
            >
              <Text style={styles.buttonText}>{isRefreshing ? 'Refreshing…' : 'Refresh now'}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={confirmClearCache}
              style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            >
              <Text style={[styles.buttonText, styles.danger]}>Delete cache</Text>
            </Pressable>
          </View>
        </Section>

        <View style={styles.footer}>
          <TextButton label="Reset settings" onPress={settings.resetSettings} />
          <Text style={styles.footerText}>
            StudySpot · Data © OpenStreetMap contributors (ODbL)
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function Section({ title, hint, children }: PropsWithChildren<{ title: string; hint?: string }>) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function TextButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} hitSlop={8}>
      <Text style={styles.textButton}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing.screen,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  section: {
    paddingVertical: theme.spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },
  sectionTitle: { ...theme.type.heading, color: theme.colors.text },
  hint: { ...theme.type.caption, color: theme.colors.muted, marginTop: 2 },
  sectionBody: { marginTop: theme.spacing.md },
  option: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.md, paddingVertical: 8 },
  optionText: { flex: 1 },
  optionTitle: { ...theme.type.body, color: theme.colors.text },
  optionDescription: { ...theme.type.caption, color: theme.colors.muted },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    paddingLeft: 32,
  },
  meta: { ...theme.type.caption, color: theme.colors.muted },
  buttons: { flexDirection: 'row', gap: theme.spacing.sm, marginTop: theme.spacing.md },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 11,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  buttonText: { ...theme.type.label, fontSize: 14, color: theme.colors.text },
  danger: { color: theme.colors.danger },
  pressed: { opacity: 0.6 },
  textButton: { ...theme.type.label, color: theme.colors.accent },
  footer: {
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },
  footerText: { ...theme.type.caption, fontSize: 11, color: theme.colors.subtle },
});
