import { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { InfoBanner } from '../components/InfoBanner';
import { LocationCard } from '../components/LocationCard';
import { ScreenContainer } from '../components/ScreenContainer';
import { FHTW_CAMPUS_LOCATION } from '../constants/studySpot';
import { theme } from '../constants/theme';
import { useStudySpot } from '../hooks/useStudySpot';
import { sortLocationsByDistance } from '../utils/distance';
import type { StudyLocation } from '../types/StudyLocation';

interface NearbyScreenProps {
  onSelectLocation: (location: StudyLocation) => void;
}

export function NearbyScreen({ onSelectLocation }: NearbyScreenProps) {
  const {
    locations,
    currentLocation,
    locationError,
    requestCurrentLocation,
    isFavorite,
    toggleFavorite,
  } = useStudySpot();

  const sortedLocations = useMemo(
    () => sortLocationsByDistance(locations, currentLocation ?? FHTW_CAMPUS_LOCATION),
    [locations, currentLocation],
  );

  return (
    <ScreenContainer>
      <Text style={styles.eyebrow}>AROUND YOU</Text>
      <Text style={styles.title}>Nearby places</Text>
      <Text style={styles.subtitle}>
        {currentLocation
          ? 'Sorted by your current device location.'
          : 'Showing distances from the FHTW campus until you share your location.'}
      </Text>

      <Pressable
        accessibilityRole="button"
        onPress={() => void requestCurrentLocation()}
        style={({ pressed }) => [styles.locationButton, pressed && styles.pressed]}
      >
        <Text style={styles.locationButtonText}>
          {currentLocation ? 'Update my location' : 'Use my location'}
        </Text>
      </Pressable>

      {locationError ? <InfoBanner message={locationError} tone="error" /> : null}

      <FlatList
        data={sortedLocations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <LocationCard
            location={item}
            onPress={onSelectLocation}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={toggleFavorite}
          />
        )}
        ListEmptyComponent={<ActivityIndicator color={theme.colors.primary} />}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  title: {
    color: theme.colors.text,
    fontSize: 27,
    fontWeight: '800',
    marginTop: 5,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  locationButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.control,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  locationButtonText: { color: '#FFFFFF', fontWeight: '700' },
  pressed: { opacity: 0.75 },
  list: { paddingTop: 16, paddingBottom: 24 },
  separator: { height: 10 },
});
