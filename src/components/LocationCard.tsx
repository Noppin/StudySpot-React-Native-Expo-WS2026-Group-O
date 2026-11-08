import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../constants/theme';
import { useFavoritesStore, useIsFavorite } from '../store/favoritesStore';
import type { StudyLocation } from '../types/Location';
import { formatDistance } from '../utils/distance';

interface LocationCardProps {
  location: StudyLocation;
  onPress: (location: StudyLocation) => void;
  showFavoriteToggle?: boolean;
  /** Replaces the heart with a text action, e.g. "Remove" on the Favorites screen. */
  action?: { label: string; onPress: (location: StudyLocation) => void };
}

export function LocationCard({
  location,
  onPress,
  showFavoriteToggle = true,
  action,
}: LocationCardProps) {
  const isFavorite = useIsFavorite(location.id);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const distance = formatDistance(location.distanceMeters);
  const meta = [location.category, distance].filter(Boolean).join(' · ');

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open ${location.name} details`}
        onPress={() => onPress(location)}
        style={({ pressed }) => [styles.main, pressed && styles.pressed]}
      >
        <Text style={styles.name} numberOfLines={1}>
          {location.name}
        </Text>
        <Text style={styles.meta}>{meta}</Text>
        {location.address ? (
          <Text style={styles.address} numberOfLines={1}>
            {location.address}
          </Text>
        ) : null}
      </Pressable>

      {action ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${action.label} ${location.name}`}
          onPress={() => action.onPress(location)}
          hitSlop={10}
        >
          <Text style={styles.action}>{action.label}</Text>
        </Pressable>
      ) : showFavoriteToggle ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            isFavorite ? `Remove ${location.name} from favorites` : `Add ${location.name} to favorites`
          }
          accessibilityState={{ selected: isFavorite }}
          onPress={() => toggleFavorite(location)}
          hitSlop={10}
          style={styles.favorite}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  main: { flex: 1, paddingRight: theme.spacing.md },
  pressed: { opacity: 0.55 },
  name: { ...theme.type.heading, color: theme.colors.text },
  meta: { ...theme.type.caption, color: theme.colors.accent, marginTop: 2 },
  address: { ...theme.type.caption, color: theme.colors.muted, marginTop: 2 },
  favorite: { width: 36, alignItems: 'flex-end' },
  favoriteIcon: { fontSize: 20, color: theme.colors.subtle },
  favoriteActive: { color: theme.colors.text },
  action: { ...theme.type.label, color: theme.colors.muted },
});
