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

      {onToggleFavorite ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            isFavorite ? `Remove ${location.name} from favorites` : `Add ${location.name} to favorites`
          }
          accessibilityState={{ selected: isFavorite }}
          onPress={() => onToggleFavorite(location)}
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
});
