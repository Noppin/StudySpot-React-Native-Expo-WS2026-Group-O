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
import { theme } from '../constants/theme';
import { useLocations } from '../hooks/useLocations';
import type { StudyLocation } from '../types/Location';

interface NearbyScreenProps {
  onSelectLocation: (location: StudyLocation) => void;
}

export function NearbyScreen({ onSelectLocation }: NearbyScreenProps) {
  const {
    locations,
    currentLocation,
  } = useLocations();
  const locationError = currentLocation.message;


  return (
    <ScreenContainer>
      <Text style={styles.eyebrow}>AROUND YOU</Text>
      <Text style={styles.title}>Nearby places</Text>
      <Text style={styles.subtitle}>
        {currentLocation.coordinates
          ? 'Sorted by your current device location.'
          : 'Showing distances from the FHTW campus until you share your location.'}
      </Text>

      <Pressable
        accessibilityRole="button"
        onPress={currentLocation.request}
        style={({ pressed }) => [styles.locationButton, pressed && styles.pressed]}
      >
        <Text style={styles.locationButtonText}>
          {currentLocation.coordinates ? 'Update my location' : 'Use my location'}
        </Text>
      </Pressable>

      {locationError ? <InfoBanner message={locationError} tone="error" /> : null}

      <FlatList
        data={locations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <LocationCard
            location={item}
            onPress={onSelectLocation}
          />
        )}
        ListEmptyComponent={<ActivityIndicator color={theme.colors.accent} />}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: theme.colors.accent,
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
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.md,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  locationButtonText: { color: '#FFFFFF', fontWeight: '700' },
  pressed: { opacity: 0.75 },
  list: { paddingTop: 16, paddingBottom: 24 },
  separator: { height: 10 },
});
