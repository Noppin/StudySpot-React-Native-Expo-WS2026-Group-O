import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Circle, Marker, type Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { InfoBanner } from '../components/InfoBanner';
import { OfflineBanner } from '../components/OfflineBanner';
import { theme } from '../constants/theme';
import { useLocations } from '../hooks/useLocations';
import { useOpenLocationDetails } from '../navigation/useOpenLocationDetails';
import { useSettingsStore } from '../store/settingsStore';
import type { Coordinates } from '../types/Location';
import { formatDistance } from '../utils/distance';

const METERS_PER_DEGREE_LATITUDE = 111_320;

/** Region that fits the search radius around the origin. */
export function regionForRadius(origin: Coordinates, radiusMeters: number): Region {
  const delta = (radiusMeters * 2.4) / METERS_PER_DEGREE_LATITUDE;
  return {
    latitude: origin.latitude,
    longitude: origin.longitude,
    latitudeDelta: delta,
    longitudeDelta: delta / Math.cos((origin.latitude * Math.PI) / 180),
  };
}

export function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const openDetails = useOpenLocationDetails();
  const radiusMeters = useSettingsStore((state) => state.searchRadiusMeters);
  const { locations, currentLocation, isShowingCache, updatedAt, error, isInitialLoading } =
    useLocations();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(
    () => locations.find((location) => location.id === selectedId) ?? null,
    [locations, selectedId],
  );
  const { origin, coordinates } = currentLocation;
  const [initialRegion] = useState(() => regionForRadius(origin, radiusMeters));

  // Follow the origin when GPS arrives or the radius changes.
  useEffect(() => {
    mapRef.current?.animateToRegion(regionForRadius(origin, radiusMeters), 400);
  }, [origin.latitude, origin.longitude, radiusMeters]);

  const status = isInitialLoading
    ? 'Loading study places…'
    : `${locations.length} places · ${coordinates ? 'around you' : 'around the default location'}`;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        showsUserLocation={currentLocation.status === 'granted'}
        showsMyLocationButton={false}
        showsPointsOfInterests={false}
        toolbarEnabled={false}
        onPress={() => setSelectedId(null)}
      >
        <Circle
          center={origin}
          radius={radiusMeters}
          strokeColor={theme.colors.accent}
          strokeWidth={1}
          fillColor="rgba(31, 111, 74, 0.05)"
        />
        {!coordinates ? (
          <Marker coordinate={origin} title="Default location" pinColor={theme.colors.text} />
        ) : null}
        {locations.map((location) => (
          <Marker
            key={location.id}
            identifier={location.id}
            coordinate={location}
            title={location.name}
            description={location.category}
            pinColor={location.id === selectedId ? theme.colors.text : theme.colors.accent}
            onPress={(event) => {
              event.stopPropagation();
              setSelectedId(location.id);
            }}
          />
        ))}
      </MapView>

      <SafeAreaView edges={['top']} style={styles.top} pointerEvents="box-none">
        <View style={styles.statusPill}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
        {isShowingCache ? <OfflineBanner cachedAt={updatedAt} /> : null}
        {error && !isShowingCache ? <InfoBanner tone="error" message={error} /> : null}
        {currentLocation.message ? <InfoBanner tone="warning" message={currentLocation.message} /> : null}
      </SafeAreaView>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Center map on search area"
        onPress={() => mapRef.current?.animateToRegion(regionForRadius(origin, radiusMeters), 400)}
        style={({ pressed }) => [styles.recenter, selected && styles.recenterRaised, pressed && styles.pressed]}
      >
        <Ionicons name="locate-outline" size={20} color={theme.colors.text} />
      </Pressable>

      {selected ? (
        <View style={styles.sheet}>
          <Text style={styles.sheetName} numberOfLines={1}>
            {selected.name}
          </Text>
          <Text style={styles.sheetMeta}>
            {[selected.category, formatDistance(selected.distanceMeters)].filter(Boolean).join(' · ')}
          </Text>
          {selected.address ? (
            <Text style={styles.sheetAddress} numberOfLines={1}>
              {selected.address}
            </Text>
          ) : null}
          <Pressable
            accessibilityRole="button"
            onPress={() => openDetails(selected)}
            style={({ pressed }) => [styles.detailsButton, pressed && styles.pressed]}
          >
            <Text style={styles.detailsText}>View details</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const floating = {
  backgroundColor: theme.colors.background,
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
} as const;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  top: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: theme.spacing.lg },
  statusPill: {
    ...floating,
    alignSelf: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
  },
  statusText: { ...theme.type.label, color: theme.colors.text },
  recenter: {
    ...floating,
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: theme.spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recenterRaised: { bottom: 176 },
  sheet: {
    ...floating,
    position: 'absolute',
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    bottom: theme.spacing.lg,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
  },
  sheetName: { ...theme.type.heading, color: theme.colors.text },
  sheetMeta: { ...theme.type.caption, color: theme.colors.accent, marginTop: 2 },
  sheetAddress: { ...theme.type.caption, color: theme.colors.muted, marginTop: 2 },
  detailsButton: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.text,
    borderRadius: theme.radius.pill,
    paddingVertical: 11,
    alignItems: 'center',
  },
  detailsText: { ...theme.type.label, color: theme.colors.background },
  pressed: { opacity: 0.6 },
});
