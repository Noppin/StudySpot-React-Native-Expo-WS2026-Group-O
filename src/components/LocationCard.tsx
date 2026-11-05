import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../constants/theme';
import type { StudyLocation } from '../types/StudyLocation';
import { formatDistance } from '../utils/distance';

interface LocationCardProps {
  location: StudyLocation;
  onPress: (location: StudyLocation) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (location: StudyLocation) => void;
}

export function LocationCard({
  location,
  onPress,
  isFavorite = false,
  onToggleFavorite,
}: LocationCardProps) {
  const distance = formatDistance(location.distanceMeters);

  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open ${location.name} details`}
        onPress={() => onPress(location)}
        style={({ pressed }) => [styles.main, pressed && styles.pressed]}
      >
        <View style={styles.content}>
          <Text style={styles.name}>{location.name}</Text>
          <Text style={styles.category}>{location.category}</Text>
          {location.address ? <Text style={styles.address}>{location.address}</Text> : null}
          {distance ? <Text style={styles.distance}>{distance} away</Text> : null}
        </View>
        <Text style={styles.chevron}>›</Text>
      </Pressable>

      {onToggleFavorite ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? `Remove ${location.name} from saved places` : `Save ${location.name}`}
          accessibilityState={{ selected: isFavorite }}
          onPress={() => onToggleFavorite(location)}
          hitSlop={8}
          style={styles.favoriteButton}
        >
          <Text style={[styles.favoriteIcon, isFavorite && styles.favoriteActive]}>
            {isFavorite ? '♥' : '♡'}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  pressed: { opacity: 0.72 },
  content: { flex: 1, paddingRight: 8 },
  name: { color: theme.colors.text, fontSize: 16, fontWeight: '700' },
  category: { color: theme.colors.primary, fontSize: 13, marginTop: 4, fontWeight: '600' },
  address: { color: theme.colors.muted, fontSize: 12, marginTop: 5 },
  distance: { color: theme.colors.muted, fontSize: 12, marginTop: 5, fontWeight: '600' },
  chevron: { color: theme.colors.muted, fontSize: 25 },
  favoriteButton: {
    width: 42,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteIcon: { color: theme.colors.muted, fontSize: 25 },
  favoriteActive: { color: '#C44747' },
});
