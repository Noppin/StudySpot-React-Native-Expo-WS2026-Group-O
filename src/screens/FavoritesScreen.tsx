import { FlatList, StyleSheet, Text, View } from 'react-native';

import { LocationCard } from '../components/LocationCard';
import { ScreenContainer } from '../components/ScreenContainer';
import { theme } from '../constants/theme';
import { useFavoritesStore } from '../store/favoritesStore';
import { useOpenLocationDetails } from '../navigation/useOpenLocationDetails';

export function FavoritesScreen() {
  const onSelectLocation = useOpenLocationDetails();
  const favorites = useFavoritesStore((state) => state.favorites);

  return (
    <ScreenContainer>
      <Text style={styles.eyebrow}>YOUR SHORTLIST</Text>
      <Text style={styles.title}>Saved places</Text>
      <Text style={styles.subtitle}>
        Your saved study spots stay on this device, even when you are offline.
      </Text>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <LocationCard
            location={item}
            onPress={onSelectLocation}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>♡</Text>
            <Text style={styles.emptyTitle}>Nothing saved yet</Text>
            <Text style={styles.emptyText}>
              Tap the heart on a place in Explore or Nearby to save it here.
            </Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  eyebrow: { color: theme.colors.accent, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: theme.colors.text, fontSize: 27, fontWeight: '800', marginTop: 5 },
  subtitle: { color: theme.colors.muted, fontSize: 13, lineHeight: 19, marginTop: 6 },
  list: { paddingTop: 18, paddingBottom: 24, flexGrow: 1 },
  separator: { height: 10 },
  empty: { alignItems: 'center', paddingHorizontal: 22, paddingVertical: 48 },
  emptyIcon: { color: theme.colors.accent, fontSize: 42 },
  emptyTitle: { color: theme.colors.text, fontSize: 17, fontWeight: '700', marginTop: 12 },
  emptyText: { color: theme.colors.muted, textAlign: 'center', lineHeight: 19, marginTop: 6 },
});
