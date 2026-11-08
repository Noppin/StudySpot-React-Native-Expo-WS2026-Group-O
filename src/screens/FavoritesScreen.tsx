import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { LocationCard } from '../components/LocationCard';
import { ScreenContainer } from '../components/ScreenContainer';
import { ScreenHeader } from '../components/ScreenHeader';
import { theme } from '../constants/theme';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { useOpenLocationDetails } from '../navigation/useOpenLocationDetails';
import { useFavoritesStore } from '../store/favoritesStore';
import type { StudyLocation } from '../types/Location';
import { sortLocationsByDistance } from '../utils/distance';

export function FavoritesScreen() {
  const openDetails = useOpenLocationDetails();
  const { origin } = useCurrentLocation();
  const favorites = useFavoritesStore((state) => state.favorites);
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const [lastRemoved, setLastRemoved] = useState<StudyLocation | null>(null);

  const sorted = useMemo(() => sortLocationsByDistance(favorites, origin), [favorites, origin]);

  function remove(location: StudyLocation) {
    removeFavorite(location.id);
    setLastRemoved(location);
  }

  function undo() {
    if (lastRemoved) addFavorite(lastRemoved);
    setLastRemoved(null);
  }

  const subtitle =
    favorites.length === 0
      ? 'Saved on this device and available offline'
      : `${favorites.length} saved · available offline`;

  return (
    <ScreenContainer>
      <ScreenHeader title="Favorites" subtitle={subtitle} />

      {lastRemoved ? (
        <View style={styles.undoBar}>
          <Text style={styles.undoText} numberOfLines={1}>
            Removed {lastRemoved.name}
          </Text>
          <Pressable accessibilityRole="button" onPress={undo} hitSlop={8}>
            <Text style={styles.undoAction}>Undo</Text>
          </Pressable>
        </View>
      ) : null}

      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <LocationCard
            location={item}
            onPress={openDetails}
            action={{ label: 'Remove', onPress: remove }}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={28} color={theme.colors.subtle} />
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptyText}>
              Tap the heart on a place in Home or on its details page to keep it here.
            </Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: theme.spacing.xl, flexGrow: 1 },
  undoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.text,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    marginBottom: theme.spacing.sm,
  },
  undoText: { ...theme.type.caption, color: theme.colors.background, flex: 1 },
  undoAction: { ...theme.type.label, color: theme.colors.background, textDecorationLine: 'underline' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: theme.spacing.xl },
  emptyTitle: { ...theme.type.heading, color: theme.colors.text, marginTop: theme.spacing.md },
  emptyText: {
    ...theme.type.caption,
    color: theme.colors.muted,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
});
